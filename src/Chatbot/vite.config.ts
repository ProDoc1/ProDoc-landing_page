import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const devPort = 3000;
    const devHost = '127.0.0.1';

    return {
      server: {
        port: devPort,
        host: devHost,
        strictPort: true,
        hmr: {
          protocol: 'ws',
          host: devHost,
          port: devPort,
          clientPort: devPort,
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
