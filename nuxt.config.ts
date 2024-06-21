// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-icon',
    '@nuxtjs/supabase',
    'nuxt-mapbox',
    'nitro-cloudflare-dev',
  ],
  app: {
    head: {
      title: 'Mentor',
    },
    keepalive: false,
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/sign-in',
      callback: '/confirm',
    },
  },
  mapbox: {
    accessToken: process.env.MAPBOX_KEY,
  },
  vite: {
    define: {
      global: 'globalThis',
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },
})
