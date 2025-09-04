/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vuelidate/core' {
  export function useVuelidate(rules: any, state: any, options?: any): any
  export function createVuelidate(options: any): any
  export const VuelidatePlugin: any
}
