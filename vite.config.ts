import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { verifyPinOnServer } from './src/server/authApi';
import { captureLeadOnServer } from './src/server/leadApi';

function serverApiPlugin(): Plugin {
  return {
    name: 'server-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/auth/pin-verify' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { publicId, pin } = JSON.parse(body);
              const result = verifyPinOnServer(publicId, pin);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 401;
              res.end(JSON.stringify(result));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
            }
          });
          return;
        }

        if (req.url === '/api/leads/capture' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const result = await captureLeadOnServer(payload);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode =
                result.status === 'confirmed' ? 200 : result.status === 'conflict' ? 409 : 400;
              res.end(JSON.stringify(result));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ status: 'failed', error: 'JSON inválido' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
