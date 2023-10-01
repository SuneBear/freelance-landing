// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      buildTime: Date.now(),
      needLoading: false,
      debug: true
    }
  },

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
      title: "与我协作，让 <div> 绽放光芒",
      // @TODO：配置 OG
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { href: '/augmented-ui.min.css', rel: 'stylesheet', type: 'text/css' },
        { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
        { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossorigin: true },
        { href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;700&family=Noto+Sans+SC:wght@100;300;400;500;600;700&display=swap', rel: 'stylesheet' }
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
