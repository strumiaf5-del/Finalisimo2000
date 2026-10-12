import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig(({ command }) => ({
  root: resolve(__dirname),
  base: command === 'build' ? './' : '/',
  plugins: [
    {
      name: 'html-redirect',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/') {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false, // FIX B8: antes `true` → exponía 1.7MB de source map en
                      // producción. Cambiado a false. Si se necesitan para
                      // debugging, correr con `vite build --mode development`.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://ads-pie-showers-crucial.trycloudflare.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'https://ads-pie-showers-crucial.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
      '/preview': {
        target: 'https://ads-pie-showers-crucial.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
      '/jobs': {
        target: 'https://ads-pie-showers-crucial.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
      '/projects': {
        target: 'https://ads-pie-showers-crucial.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'wss://ads-pie-showers-crucial.trycloudflare.com',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}));
