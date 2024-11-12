import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: 'https://pritams-quiz.netlify.app', // Apne static site ka domain yahan daalein
      credentials: true,
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Agar aap specific entry points define karna chahte hain
        main: '/secure-js/function.js',
        quiz: '/secure-js/quiz.js',
        script: '/secure-js/script.js',
        sub_data: '/secure-js/sub_data.js',
        sw_data: '/secure-js/sw-data.js',
      },
    },
  },
});
