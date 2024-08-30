import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Répertoire de sortie pour les fichiers de build
    sourcemap: false, // Désactiver les sourcemaps en production pour économiser de l'espace
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    port: 3000,  // Port pour le serveur de développement local
  },
  base: '/', // Assurez-vous que cela correspond à la racine de votre URL sur le serveur Caddy

})
