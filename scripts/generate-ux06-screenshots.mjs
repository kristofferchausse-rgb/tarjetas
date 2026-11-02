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
  const remoteDebuggingPort = 9223;

  console.log('Launching Headless Chrome on port', remoteDebuggingPort);
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/chrome-crm-profile-' + Date.now()
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

  const screenshotsToTake = [
    {
      name: 'ux06-clara-navarro-lista-movil.png',
      slug: 'demo-clara-navarro',
      width: 390,
      height: 844,
      description: 'Vista completa con filtros: Todos, Hoy, Vencidos, Sin próximo paso',
      action: async () => {
        await new Promise((r) => setTimeout(r, 600));
      }
    },
    {
      name: 'ux06-clara-navarro-filtro-vencidos.png',
      slug: 'demo-clara-navarro',
      width: 390,
      height: 844,
      description: 'Filtro Vencidos activo con caso visible e indicador visual',
      action: async () => {
        // Click on "Vencidos" button
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const vencidosBtn = buttons.find(b => b.textContent && b.textContent.includes('Vencidos'));
            if (vencidosBtn) vencidosBtn.click();
          })()`
        });
        await new Promise((r) => setTimeout(r, 600));
      }
    },
    {
      name: 'ux06-clara-navarro-ficha-detalle.png',
      slug: 'demo-clara-navarro',
      width: 390,
      height: 844,
      description: 'Ficha de detalle abierta con datos de contacto, notas y próximo paso editable',
      action: async () => {
        // Click on "Ficha & Notas" on the first lead
        await sendCdpCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const fichaBtn = buttons.find(b => b.textContent && b.textContent.includes('Ficha & Notas'));
            if (fichaBtn) fichaBtn.click();
          })()`
        });
        await new Promise((r) => setTimeout(r, 800));
      }
    },
    {
      name: 'ux06-lucia-cardenas-lista-salud.png',
      slug: 'demo-lucia-cardenas',
      width: 390,
      height: 844,
      description: 'Vista adaptada al arquetipo de salud con seguimiento administrativo y descargo normativo',
      action: async () => {
        await new Promise((r) => setTimeout(r, 600));
      }
    },
    {
      name: 'ux06-adriana-torres-desktop-crm.png',
      slug: 'demo-jorge-herrera',
      width: 1024,
      height: 800,
      description: 'Vista de escritorio del panel en un perfil de plan básico (sin módulo de audio)',
      action: async () => {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  ];

  for (const item of screenshotsToTake) {
    console.log(`\nCapturing [${item.name}] (${item.description}) at ${item.width}x${item.height}...`);

    // Set viewport
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 2,
      mobile: item.width < 768
    });

    // Navigate to profile stats URL with explicit CRM tab
    const url = `http://127.0.0.1:${port}/c/${item.slug}/stats?tab=crm`;
    await sendCdpCommand(ws, 'Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 800));

    // Inject session auth and seed local leads so ClientStatsView renders immediately
    await sendCdpCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        sessionStorage.setItem('client_auth_${item.slug}', 'true');
        sessionStorage.setItem('redconecta_admin_session_v1', 'true');
      })()`
    });

    // Reload page to pick up auth and render CRM tab
    await sendCdpCommand(ws, 'Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 1200));

    // Assert that we are truly in Mini-CRM and NOT in Meeting Intelligence audio recorder
    const checkResult = await sendCdpCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText || '';
        const hasCrmHeader = text.includes('Buzón de Prospectos') || text.includes('Próximos Pasos');
        const hasAudioRecorder = text.includes('Grabar Reunión') && !hasCrmHeader;
        return { hasCrmHeader, hasAudioRecorder, length: text.length };
      })()`,
      returnByValue: true
    });

    const pageState = checkResult?.value || {};
    if (pageState.hasAudioRecorder) {
      console.warn('⚠️ Warning: Audio recorder detected! Switching to CRM tab...');
      await sendCdpCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const crmTab = buttons.find(b => b.textContent && b.textContent.includes('Prospectos & CRM'));
          if (crmTab) crmTab.click();
        })()`
      });
      await new Promise((r) => setTimeout(r, 800));
    }

    // Execute custom action (e.g. filter, open modal)
    if (item.action) {
      await item.action();
    }

    // Capture screenshot
    const shot = await sendCdpCommand(ws, 'Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const buffer = Buffer.from(shot.data, 'base64');

    // Save to artifact directory
    const artifactPath = path.join(ARTIFACT_DIR, item.name);
    fs.writeFileSync(artifactPath, buffer);

    // Also save locally in workspace
    const workspacePath = path.resolve(process.cwd(), item.name);
    fs.writeFileSync(workspacePath, buffer);

    console.log(`  ✓ Saved ${item.name} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  // Cleanup
  console.log('\nCleaning up processes...');
  ws.close();
  chromeProcess.kill('SIGTERM');
  server.close();
  console.log('Capture process finished successfully.');
}

run().catch((err) => {
  console.error('Error during screenshot generation:', err);
  process.exit(1);
});
