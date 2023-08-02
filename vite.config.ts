import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [react()],
    };
  } else {
    return {
      mode: 'dev',
      plugins: [react()],
    };
  }
});
