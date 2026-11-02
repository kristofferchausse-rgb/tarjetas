import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = '/Users/kristofferchausse/.gemini/antigravity/brain/f3dd1ee9-4a64-41d2-884a-6900d92f51ce';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// 1. Static SPA Server for dist
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

// Helper to send CDP command
function sendCdpCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : event.data.toString();
        const resp = JSON.parse(raw);
        if (resp.id === id) {
          ws.removeEventListener('message', handler);
          if (resp.error) {
            reject(resp.error);
          } else {
            resolve(resp.result);
          }
        }
      } catch (e) {
        // ignore other frames
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function run() {
  const server = await startServer(4173);

  // Launch Chrome headless
  console.log('Launching Chrome headless...');
  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars'
  ]);

  // Wait for remote debugging to be ready
  let versionData = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      versionData = await res.json();
      break;
    } catch {}
  }

  if (!versionData || !versionData.webSocketDebuggerUrl) {
    console.error('Failed to connect to Chrome headless debugging port');
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools Protocol:', versionData.Browser);

  // Create new page target
  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
  const targetInfo = await newTargetRes.json();
  const pageWsUrl = targetInfo.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWsUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  // Enable domains
  await sendCdpCommand(ws, 'Page.enable');
  await sendCdpCommand(ws, 'Runtime.enable');
  await sendCdpCommand(ws, 'DOM.enable');

  const profilesToCapture = [
    { id: 'demo-clara-navarro', name: 'Clara Navarro (Consultoría)' },
    { id: 'demo-adriana-torres', name: 'Adriana Torres (Directiva / Alianzas)' },
    { id: 'demo-lucia-cardenas', name: 'Dra. Lucía Cárdenas (Salud)' }
  ];

  for (const p of profilesToCapture) {
    console.log(`\nCapturing profile: ${p.name} (${p.id})...`);
    const cardUrl = `http://127.0.0.1:4173/?c=${p.id}`;

    // 1. Mobile 390px (iPhone standard)
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sendCdpCommand(ws, 'Page.navigate', { url: cardUrl });
    await new Promise((r) => setTimeout(r, 1200)); // Allow render

    // Scroll to Top (Inicio)
    await sendCdpCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await new Promise((r) => setTimeout(r, 400));
    const topShot = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `ux05-${p.id}-390px-inicio.png`), Buffer.from(topShot.data, 'base64'));
    console.log(`  ✓ Saved ux05-${p.id}-390px-inicio.png`);

    // Scroll to Middle (Intermedio: Soluciones & Testimonios)
    await sendCdpCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, 680)' });
    await new Promise((r) => setTimeout(r, 400));
    const midShot = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `ux05-${p.id}-390px-intermedio.png`), Buffer.from(midShot.data, 'base64'));
    console.log(`  ✓ Saved ux05-${p.id}-390px-intermedio.png`);

    // Scroll to Bottom (Final: Alianzas, Compartir datos, Herramientas, Pie Legal)
    await sendCdpCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
    await new Promise((r) => setTimeout(r, 400));
    const endShot = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `ux05-${p.id}-390px-final.png`), Buffer.from(endShot.data, 'base64'));
    console.log(`  ✓ Saved ux05-${p.id}-390px-final.png`);

    // 2. Mobile 320px (Compact)
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 640,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendCdpCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await new Promise((r) => setTimeout(r, 300));
    const c320Shot = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `ux05-${p.id}-320px-inicio.png`), Buffer.from(c320Shot.data, 'base64'));
    console.log(`  ✓ Saved ux05-${p.id}-320px-inicio.png`);

    // 3. Desktop 1024px
    await sendCdpCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sendCdpCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    await new Promise((r) => setTimeout(r, 300));
    const deskShot = await sendCdpCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, `ux05-${p.id}-1024px-desktop.png`), Buffer.from(deskShot.data, 'base64'));
    console.log(`  ✓ Saved ux05-${p.id}-1024px-desktop.png`);
  }

  // Cleanup
  ws.close();
  chromeProc.kill();
  server.close();
  console.log('\nAll UX05 screenshots successfully captured and saved to artifacts directory!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Screenshot generation error:', err);
  process.exit(1);
});
