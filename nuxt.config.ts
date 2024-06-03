// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon'],
  app: {
    head: {
      title: 'Mentor',
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
})
