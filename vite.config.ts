import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function googleSheetProxyPlugin() {
  return {
    name: 'google-sheet-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/sheet', async (req: any, res: any) => {
        try {
          const url = new URL(req.url || '', 'http://localhost:3000');
          const sheetId = url.searchParams.get('sheetId') || '1aFmQz6_FkvGbuxfyuBvvYVzI5WrfNgVIlm4lwTPbDEI';
          const target = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
          const fetchRes = await fetch(target, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
          });
          if (!fetchRes.ok) {
            res.statusCode = fetchRes.status;
            res.end('Failed to fetch from Google Sheet');
            return;
          }
          const csvText = await fetchRes.text();
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(csvText);
        } catch (err: any) {
          res.statusCode = 500;
          res.end(err?.message || 'Error fetching Google Sheet');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), googleSheetProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
