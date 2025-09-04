import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['font-awesome-icon'].includes(tag)
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js'
    },
  },
  optimizeDeps: {
    include: ['@vuelidate/core', '@vuelidate/validators']
  },
  define: {
    'process.env': {}
  }
})
