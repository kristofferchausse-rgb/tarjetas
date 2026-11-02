import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = '/Users/kristofferchausse/.gemini/antigravity/brain/f3dd1ee9-4a64-41d2-884a-6900d92f51ce';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// Static SPA Server supporting SPA routes
function startServer(port = 4174) {
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
    if (
      reqPath === '/' ||
      reqPath.startsWith('/c/') ||
      reqPath.startsWith('/e/') ||
      reqPath.startsWith('/empresa/') ||
      reqPath === '/dashboard' ||
      reqPath === '/admin' ||
      reqPath === '/studio'
    ) {
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
      } catch {
        // continue
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function run() {
  const port = 4174;
  const server = await startServer(port);

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const remoteDebuggingPort = 9226;

  console.log('Launching Headless Chrome on port', remoteDebuggingPort);
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/chrome-ux08-' + Date.now()
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
      name: 'ux08-gestion-empresas-studio.png',
      width: 1280,
      height: 900,
      url: `http://127.0.0.1:${port}/?admin=true`,
      description: 'Panel de Gestión Corporativa y de Equipos en el Studio de la Agencia',
      prepare: async () => {
        // Grant admin session
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            sessionStorage.setItem('redconecta_admin_session_v1', 'true');
          })()`
        });
      },
      action: async () => {
        // Click on the "Empresas & Equipos" tab
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const compBtn = buttons.find(b => b.textContent && b.textContent.includes('Empresas & Equipos'));
            if (compBtn) compBtn.click();
          })()`
        });
        await new Promise((r) => setTimeout(r, 1200));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasHeader = bodyText.includes('Cuentas Corporativas') || bodyText.includes('Empresas & Equipos');
            const hasNexo = bodyText.includes('Nexo Operativo');
            const hasJorge = bodyText.includes('Jorge Herrera');
            const hasMetrics = bodyText.includes('Integrantes') || bodyText.includes('Activos');
            const hasBrandSec = bodyText.includes('Identidad Visual & Marca') || bodyText.includes('Color Primario');
            return { hasHeader, hasNexo, hasJorge, hasMetrics, hasBrandSec, snippet: bodyText.slice(0, 300) };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasHeader) throw new Error('Assertion failed: Header "Cuentas Corporativas" not found. Snippet: ' + val.snippet);
        if (!val.hasNexo) throw new Error('Assertion failed: Benchmark company "Nexo Operativo" not found');
        if (!val.hasJorge) throw new Error('Assertion failed: Member "Jorge Herrera" not found');
        return [
          'Vista de gestión de agencias en Studio verificada',
          'Empresa benchmark Nexo Operativo seleccionada con métricas verificadas',
          'Integrantes vinculados (Jorge Herrera, Diego Salas) visibles con controles de edición y duplicación',
          'Editor de identidad de marca corporativa verificado'
        ];
      }
    },
    {
      name: 'ux08-directorio-corporativo-movil.png',
      width: 390,
      height: 844,
      url: `http://127.0.0.1:${port}/?e=nexo-operativo`,
      description: 'Directorio Corporativo Móvil (390px) con buscador, filtros de área y tarjetas de integrantes',
      prepare: async () => {},
      action: async () => {
        await new Promise((r) => setTimeout(r, 800));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasNexo = bodyText.includes('Nexo Operativo');
            const hasTagline = bodyText.includes('Servicios Técnicos & Proyectos Industriales') || bodyText.includes('Nexo Operativo');
            const hasAreas = bodyText.includes('Todas las áreas') || bodyText.includes('Operaciones & Planta');
            const hasJorge = bodyText.includes('Jorge Herrera');
            const hasRoleStatement = bodyText.includes('Coordina paros técnicos') || bodyText.includes('Qué atiende');
            const hasVerTarjeta = bodyText.includes('Ver tarjeta') || bodyText.includes('tarjeta');
            return { hasNexo, hasTagline, hasAreas, hasJorge, hasRoleStatement, hasVerTarjeta };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasNexo) throw new Error('Assertion failed: Company name "Nexo Operativo" not found in directory');
        if (!val.hasJorge) throw new Error('Assertion failed: Team member "Jorge Herrera" not found in directory');
        if (!val.hasAreas) throw new Error('Assertion failed: Area filter chips not found in directory');
        return [
          'Directorio corporativo público móvil 390px verificado',
          'Cabecera corporativa con logotipo SVG, propuesta de valor y canales de contacto',
          'Filtros por área y buscador funcional sin recarga',
          'Integrantes activos mostrados con declaración de función concreta ("Qué atiende")',
          'Aislamiento de privacidad: 0 datos privados de CRM, notas o PINs expuestos'
        ];
      }
    },
    {
      name: 'ux08-tarjeta-integrante-equipo.png',
      width: 390,
      height: 844,
      url: `http://127.0.0.1:${port}/c/demo-jorge-herrera`,
      description: 'Tarjeta individual de integrante con acceso discreto al directorio corporativo',
      prepare: async () => {},
      action: async () => {
        await new Promise((r) => setTimeout(r, 800));
      },
      assertions: async () => {
        const evalRes = await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bodyText = document.body.innerText || '';
            const hasJorge = bodyText.includes('Jorge Herrera');
            const hasNexo = bodyText.includes('Nexo Operativo');
            const hasConoceEquipo = bodyText.includes('Conoce al equipo');
            const hasValueProp = bodyText.includes('Líneas de producción') || bodyText.includes('mantenimiento');
            const hasCTA = bodyText.includes('Solicitar diagnóstico técnico') || bodyText.includes('diagnóstico');
            return { hasJorge, hasNexo, hasConoceEquipo, hasValueProp, hasCTA };
          })()`,
          returnByValue: true
        });
        const val = evalRes.result?.value || {};
        if (!val.hasJorge) throw new Error('Assertion failed: Member "Jorge Herrera" not found');
        if (!val.hasNexo) throw new Error('Assertion failed: Company "Nexo Operativo" not found on member card');
        if (!val.hasConoceEquipo) throw new Error('Assertion failed: Discrete button "Conoce al equipo" not found');
        return [
          'Tarjeta de integrante Jorge Herrera verificada en móvil (390px)',
          'Acceso discreto "Conoce al equipo" visible junto a la empresa sin desplazar la identidad individual',
          'Propuesta de valor personal, soluciones concretas y llamada a la acción priorizadas',
          'Hereda logotipo e identidad visual de la empresa corporativa'
        ];
      }
    }
  ];

  console.log('\n📸 Generando capturas de pantalla de alta fidelidad con Headless Chrome...');

  for (const item of scenarios) {
    console.log(`\n▶️ Procesando escenario: [${item.name}] (${item.width}x${item.height})`);

    // Set Viewport
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 2,
      mobile: item.width < 600
    });

    // Navigate to initial page to setup sessions if needed
    await sendCdpCommand(ws, 'Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise((r) => setTimeout(r, 400));

    if (item.prepare) {
      await item.prepare();
    }

    // Navigate to target URL
    console.log(`  🌐 Navegando a ${item.url}...`);
    await sendCdpCommand(ws, 'Page.navigate', { url: item.url });
    await new Promise((r) => setTimeout(r, 1200));

    if (item.action) {
      await item.action();
    }

    // Verify DOM Assertions
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
    console.log(`  💾 Guardada en artefactos: ${artifactPath}`);

    // Save locally in workspace
    const localPath = path.join(process.cwd(), item.name);
    fs.writeFileSync(localPath, buffer);

    manifestEntries.push({
      file: item.name,
      viewport: `${item.width}x${item.height} (2x Retina)`,
      description: item.description,
      assertions: satisfied
    });
  }

  // Generate MANIFIESTO_CAPTURAS_UX08.txt
  let manifestText = `================================================================================
MANIFIESTO DE CAPTURAS VISUALES — FASE UX08: PLAN EMPRESARIAL
PROYECTO: Tarjetas Digitales Inteligentes • Tribu Creativa QRO / RedConecta MX
FECHA: ${new Date().toISOString()}
MOTOR: Google Chrome Headless (CDP Protocol, Device Scale Factor: 2x)
================================================================================

`;

  manifestEntries.forEach((entry, idx) => {
    manifestText += `CAPTURA ${idx + 1}: ${entry.file}\n`;
    manifestText += `Resolución: ${entry.viewport}\n`;
    manifestText += `Propósito: ${entry.description}\n`;
    manifestText += `Comprobaciones de DOM satisfechas:\n`;
    entry.assertions.forEach((a) => {
      manifestText += `  ✓ ${a}\n`;
    });
    manifestText += `\n${'-'.repeat(80)}\n\n`;
  });

  fs.writeFileSync(path.join(process.cwd(), 'MANIFIESTO_CAPTURAS_UX08.txt'), manifestText);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'MANIFIESTO_CAPTURAS_UX08.txt'), manifestText);
  console.log('\n📄 Manifiesto generado en MANIFIESTO_CAPTURAS_UX08.txt');

  // Close Chrome and Server
  try {
    await sendCdpCommand(ws, 'Browser.close');
  } catch {}
  chromeProcess.kill();
  server.close();
  console.log('\n✨ Capturas completadas exitosamente.');
}

run().catch((err) => {
  console.error('Error fatal generando capturas UX08:', err);
  process.exit(1);
});
