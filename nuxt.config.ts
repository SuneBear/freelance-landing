// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3004
  },

  imports: {
    dirs: [ 'stores', 'composables' ]
  },

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false }
    ]
  },

  modules: [
    '@nuxtjs/device',
    'unplugin-icons/nuxt',
    'nuxt-icons',
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          additionalData: `@require "../styles/ref.styl"`
        }
      }
    }
  },

  app: {
    head: {
      title: "Stylus Pug Starter",
      meta: [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ],
      script: [
        { id: 'check-dark-light',
          children: `
            ;(() => {
              const preference = localStorage.getItem('vueuse-color-scheme')
              localStorage.setItem('vueuse-color-scheme', preference)
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
              if (!preference || preference === 'auto' ? prefersDark : preference === 'dark') {
                document.documentElement.classList.add('dark')
              }
            })()
          ` },
      ]
    }
  },
})
