// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon', '@nuxtjs/supabase', 'nuxt-mapbox'],
  app: {
    head: {
      title: 'Mentor',
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
  mapbox: {
    accessToken: process.env.MAPBOX_KEY,
  },
})
