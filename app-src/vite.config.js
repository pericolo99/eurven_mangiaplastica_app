import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Inietta il riferimento a cordova.js nel build finale.
// cordova.js non esiste in fase di build: viene fornito a runtime dalla shell
// Cordova sul dispositivo. In browser (dev/preview) il 404 e' innocuo.
function cordovaScript() {
  return {
    name: 'inject-cordova-js',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        '    <script type="text/javascript" src="cordova.js"></script>\n  </head>'
      )
    },
  }
}

export default defineConfig({
  // Path relativi: obbligatorio per il caricamento da file:// in Cordova.
  base: './',
  plugins: [vue(), cordovaScript()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../www',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
    host: true,
  },
})
