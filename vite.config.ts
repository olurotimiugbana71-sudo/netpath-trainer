// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In dev mode, use '/' so localhost URLs are clean (e.g., /purchase)
  // In production build, use '/netpath-trainer/' for GitHub Pages subfolder
  base: command === 'build' ? '/netpath-trainer/' : '/',
}));