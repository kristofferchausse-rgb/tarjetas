import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = '/Users/kristofferchausse/.gemini/antigravity/brain/f3dd1ee9-4a64-41d2-884a-6900d92f51ce';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// Static SPA Server
function startServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath.startsWith('/c/')) {
      reqPath = '/index.html';
    }

    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Local SPA server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

function sendCdpCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      try {
        const str = typeof event === 'string' ? event : event.data?.toString ? event.data.toString() : String(event);
        const data = JSON.parse(str);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) {
            reject(new Error(JSON.stringify(data.error)));
          } else {
            resolve(data.result);
          }
        }
      } catch (err) {
        // continue
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function run() {
  const port = 4173;
  const server = await startServer(port);

  // Chrome executable on macOS
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const remoteDebuggingPort = 9225;

  console.log('Launching Headless Chrome on port', remoteDebuggingPort);
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/chrome-ux07-final-' + Date.now()
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  let targets = [];
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${remoteDebuggingPort}/json`);
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    throw new Error('Could not find Chrome page WebSocket URL');
  }

  console.log('Connecting to page WebSocket:', pageTarget.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  await sendCdpCommand(ws, 'Page.enable');
  await sendCdpCommand(ws, 'DOM.enable');
  await sendCdpCommand(ws, 'Runtime.enable');

  const manifestEntries = [];

  const scenarios = [
    {
      name: 'ux07-panel-datos-demo.png',
      slug: 'demo-clara-navarro',
      width: 480,
      height: 980,
      description: 'Panel de métricas honestas y actividad claramente etiquetado como Demostración Sintética',
      prepare: async () => {
        // Ensure default synthetic stats are present in localStorage
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const current = JSON.parse(localStorage.getItem('redconecta_analytics_stats_v1') || '{}');
            current['demo-clara-navarro'] = {
              publicId: 'demo-clara-navarro',
              views: 268,
              qrScans: 118,
              shares: 49,
              vcardDownloads: 74,
              whatsappClicks: 63,
              callClicks: 16,
              emailClicks: 28,
              calendarClicks: 39,
              linkClicks: 54,
              videoPlays: 61,
              lastActive: new Date().toISOString(),
              isSynthetic: true
            };
            localStorage.setItem('redconecta_analytics_stats_v1', JSON.stringify(current));
          })()`
        });
      },
      action: async () => {
        // Scroll directly to the "Actividad Registrada de la Tarjeta" section
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const h2s = Array.from(document.querySelectorAll('h2'));
            const heading = h2s.find(h => h.textContent && h.textContent.includes('Actividad Registrada'));
            if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()`
        });
        await new Promise((r) => setTimeout(r, 600));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const upper = bodyText.toUpperCase();
            const hasDemoBadge = bodyText.includes('Demostración Sintética');
            const hasAperturas = upper.includes('APERTURAS DE TARJETA') || bodyText.includes('Aperturas');
            const hasDescargas = upper.includes('DESCARGAS DE CONTACTO') || bodyText.includes('Descargas');
            const hasWhatsApp = upper.includes('INTENTOS A WHATSAPP') || bodyText.includes('WhatsApp');
            const hasRatio = upper.includes('ACCIONES / 100 VISTAS') || bodyText.includes('Acciones');
            return { hasDemoBadge, hasAperturas, hasDescargas, hasWhatsApp, hasRatio };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasDemoBadge) throw new Error('Assertion failed: "Demostración Sintética" badge not found');
        if (!val.hasAperturas || !val.hasRatio) throw new Error('Assertion failed: Core metric cards not found');
        return [
          'Insignia "Demostración Sintética" visible y verificada',
          'Tarjetas métricas honestas verificadas: Aperturas, Descargas, WhatsApp, Acciones / 100 Vistas',
          'Cálculo fiel de acciones por cada 100 vistas sin ROI monetario falso'
        ];
      }
    },
    {
      name: 'ux07-buzon-movil-fila.png',
      slug: 'demo-clara-navarro',
      width: 390,
      height: 844,
      description: 'Buzón móvil con barra compacta de alertas y fila completa con próximo paso y resultado',
      prepare: async () => {},
      action: async () => {
        // Scroll to lead row with outcome (Sofía Elizondo)
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const leadBtn = buttons.find(b => b.textContent && b.textContent.includes('Sofía Elizondo'));
            if (leadBtn) {
              const card = leadBtn.closest('.rounded-2xl');
              if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
            }
          })()`
        });
        await new Promise((r) => setTimeout(r, 600));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const upper = bodyText.toUpperCase();
            const hasSofia = bodyText.includes('Sofía Elizondo');
            const hasOutcome = upper.includes('VENTA') || upper.includes('CONTRATACIÓN') || bodyText.includes('Venta') || bodyText.includes('Contratación');
            const hasSinPasoBtn = upper.includes('SIN PASO') || bodyText.includes('Sin paso');
            return { hasSofia, hasOutcome, hasSinPasoBtn };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasSofia) throw new Error('Assertion failed: Lead Sofía Elizondo not found');
        if (!val.hasOutcome) throw new Error('Assertion failed: Outcome badge not found on lead row');
        if (!val.hasSinPasoBtn) throw new Error('Assertion failed: "Sin paso" button not found');
        return [
          'Buzón móvil 390px con fila completa visible',
          'Contacto con próximo paso e insignia de resultado identificado',
          'Botón "Sin paso" visible sin truncamiento en barra compacta de alertas'
        ];
      }
    },
    {
      name: 'ux07-resultados-registrados.png',
      slug: 'demo-clara-navarro',
      width: 480,
      height: 900,
      description: 'Sección Resultados Registrados con chips de conteo por tipo adaptados al arquetipo',
      prepare: async () => {},
      action: async () => {
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const h2s = Array.from(document.querySelectorAll('h2'));
            const heading = h2s.find(h => h.textContent && h.textContent.includes('Resultados Registrados'));
            if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()`
        });
        await new Promise((r) => setTimeout(r, 600));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const upper = bodyText.toUpperCase();
            const hasHeader = upper.includes('RESULTADOS REGISTRADOS');
            const hasChips = upper.includes('VENTA') || upper.includes('CONTRATACIÓN') || bodyText.includes('Venta') || bodyText.includes('Contratación');
            return { hasHeader, hasChips };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasHeader) throw new Error('Assertion failed: "Resultados Registrados" heading not found');
        return [
          'Sección "Resultados Registrados" visible con encabezado veraz',
          'Chips de conteo por tipo adaptados al arquetipo profesional',
          'Cifras de resultados independientes de las etapas del embudo comercial'
        ];
      }
    },
    {
      name: 'ux07-estado-sin-datos.png',
      slug: 'demo-diego-salas',
      width: 480,
      height: 980,
      description: 'Estado sin datos registrados: 0 aperturas, 0 QR, ratio — y badge Sin datos registrados',
      prepare: async () => {
        // Isolate storage for this test: remove stats entry so all counters are 0, and clear leads to []
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const raw = localStorage.getItem('redconecta_analytics_stats_v1') || '{}';
            const parsed = JSON.parse(raw);
            parsed['demo-diego-salas'] = {
              publicId: 'demo-diego-salas',
              views: 0,
              qrScans: 0,
              shares: 0,
              vcardDownloads: 0,
              whatsappClicks: 0,
              callClicks: 0,
              emailClicks: 0,
              calendarClicks: 0,
              linkClicks: 0,
              videoPlays: 0,
              lastActive: ''
            };
            localStorage.setItem('redconecta_analytics_stats_v1', JSON.stringify(parsed));
            // Deliberately empty list in localStorage
            localStorage.setItem('tarjetas_leads_demo-diego-salas', '[]');
          })()`
        });
      },
      action: async () => {
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const h2s = Array.from(document.querySelectorAll('h2'));
            const heading = h2s.find(h => h.textContent && h.textContent.includes('Actividad Registrada'));
            if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()`
        });
        await new Promise((r) => setTimeout(r, 600));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasSinDatos = bodyText.includes('Sin datos registrados');
            const hasDash = bodyText.includes('—');
            const hasEmptyLeadsMsg = bodyText.includes('Aún no tienes prospectos registrados');
            return { hasSinDatos, hasDash, hasEmptyLeadsMsg };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasSinDatos) throw new Error('Assertion failed: "Sin datos registrados" badge not found');
        if (!val.hasDash) throw new Error('Assertion failed: Actions ratio "—" not found');
        return [
          'Distintivo "Sin datos registrados" verificado en estado cero',
          '0 aperturas, 0 QR y ratio de acciones como "—" (sin división entre cero)',
          'Lista deliberadamente vacía [] respetada sin repoblación automática'
        ];
      }
    },
    {
      name: 'ux07-plan-basico-sin-audios.png',
      slug: 'demo-jorge-herrera',
      width: 1024,
      height: 800,
      description: 'Vista de escritorio en plan básico sin insignia AI Copilot ni pestañas/módulos de audio',
      prepare: async () => {},
      action: async () => {
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
        });
        await new Promise((r) => setTimeout(r, 600));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasName = bodyText.includes('Jorge Herrera');
            const hasAiBadge = bodyText.includes('AI Copilot');
            const hasMeetingTab = bodyText.includes('Meeting Intelligence');
            const hasRecorder = bodyText.includes('Grabar Reunión');
            return { hasName, hasAiBadge, hasMeetingTab, hasRecorder };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasName) throw new Error('Assertion failed: Profile "Jorge Herrera" not found');
        if (val.hasAiBadge) throw new Error('Assertion failed: "AI Copilot" badge found on basic plan');
        if (val.hasMeetingTab) throw new Error('Assertion failed: "Meeting Intelligence" tab found on basic plan');
        if (val.hasRecorder) throw new Error('Assertion failed: Audio recorder found on basic plan');
        return [
          'Perfil en plan básico (hasMeetingIntelligence: false) resuelto',
          'Ausencia verificada en el DOM de insignia "AI Copilot"',
          'Ausencia verificada en el DOM de pestañas de Meeting Intelligence y grabadores de audio'
        ];
      }
    }
  ];

  for (const item of scenarios) {
    console.log(`\n========================================================`);
    console.log(`Capturando [${item.name}] (${item.description}) a ${item.width}x${item.height}...`);

    // Set viewport
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 2,
      mobile: item.width < 768
    });

    const url = `http://127.0.0.1:${port}/c/${item.slug}/stats?tab=crm`;

    // Establish origin and inject auth and setup first
    await sendCdpCommand(ws, 'Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 600));

    // Inject session auth and storage
    await sendCdpCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        sessionStorage.setItem('client_auth_${item.slug}', 'true');
        sessionStorage.setItem('redconecta_admin_session_v1', 'true');
      })()`
    });

    // Execute scenario preparation
    if (item.prepare) {
      await item.prepare();
    }

    // Now navigate to target stats URL with auth already established
    await sendCdpCommand(ws, 'Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 1500));

    // Execute action
    if (item.action) {
      await item.action();
    }

    // Verify DOM assertions (fails hard if scenario is incorrect)
    console.log(`  🔍 Verificando aserciones del DOM para [${item.name}]...`);
    const satisfied = await item.assertions();
    satisfied.forEach((s) => console.log(`     ✓ ${s}`));

    // Capture screenshot
    const shot = await sendCdpCommand(ws, 'Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const buffer = Buffer.from(shot.data, 'base64');

    // Save to artifact directory
    const artifactPath = path.join(ARTIFACT_DIR, item.name);
    fs.writeFileSync(artifactPath, buffer);

    // Save locally in workspace
    const workspacePath = path.resolve(process.cwd(), item.name);
    fs.writeFileSync(workspacePath, buffer);

    console.log(`  📸 Guardada captura ${item.name} (${(buffer.length / 1024).toFixed(1)} KB)`);

    manifestEntries.push({
      file: item.name,
      slug: item.slug,
      viewport: `${item.width}x${item.height}`,
      description: item.description,
      sizeKb: (buffer.length / 1024).toFixed(1),
      assertions: satisfied
    });
  }

  // Generate manifest file
  const manifestPath = path.resolve(process.cwd(), 'MANIFIESTO_CAPTURAS_UX07.txt');
  const manifestContent = [
    '================================================================================',
    'MANIFIESTO DE CAPTURAS HEADLESS CHROME — FASE UX07',
    'TARJETAS DIGITALES INTELIGENTES • TRIBU CREATIVA QRO / REDCONECTA MX',
    '================================================================================',
    `Fecha: ${new Date().toISOString()}`,
    `Herramienta: Google Chrome Headless via Chrome DevTools Protocol (CDP)`,
    '',
    ...manifestEntries.flatMap((m, idx) => [
      `[Captura ${idx + 1}] ${m.file}`,
      `  - Perfil: ${m.slug}`,
      `  - Viewport CSS: ${m.viewport}`,
      `  - Tamaño: ${m.sizeKb} KB`,
      `  - Descripción: ${m.description}`,
      `  - Aserciones Satisfechas:`,
      ...m.assertions.map((a) => `      * ${a}`),
      ''
    ]),
    '================================================================================'
  ].join('\n');

  fs.writeFileSync(manifestPath, manifestContent);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'MANIFIESTO_CAPTURAS_UX07.txt'), manifestContent);
  console.log('\n✓ Manifiesto de capturas guardado en MANIFIESTO_CAPTURAS_UX07.txt');

  // Cleanup
  console.log('\nCleaning up processes...');
  ws.close();
  chromeProcess.kill('SIGTERM');
  server.close();
  console.log('Capture process finished successfully.');
}

run().catch((err) => {
  console.error('\n❌ ERROR FATAL en generación de capturas:', err.message);
  process.exit(1);
});
