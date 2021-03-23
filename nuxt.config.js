import colors from 'vuetify/es5/util/colors'

export default {
  components: {
    dirs: [
      '~/components',
      {
        path: '~/components/code/',
        prefix: 'Code'
      }
    ]
  },
    // components: false,
  serverMiddleware: [
    { path: '/server', handler: (__dirname + '/server/index.js') }
  ],

  env: {
    WS_URL: process.env.WS_URL || 'http://localhost:4000/'
  },

  target: 'static',

  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [

    '~/assets/css/main.css',
    // lib css
    'codemirror/lib/codemirror.css',
    // merge css
    'codemirror/addon/merge/merge.css',
    // theme css
    'codemirror/theme/base16-dark.css'


  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~plugins/vue-live-preview', ssr: false },

    { src: "~/plugins/prism", ssr: false },
    { src: '~/plugins/socket.io.js', ssr: false },
    '~/plugins/notifier.js',
    '~/plugins/lodash.js',
    { src: '~/plugins/nuxt-codemirror-plugin.js', ssr: false }


    // '~/plugins/markdown.js',



  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    /*vite is causing some errors as some modules are not supported
    will check again within a future release.
    */
    // 'nuxt-vite'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {
    markdown: {
      remarkPlugins: [

        'remark-autolink-headings',

      ],
      // prism: {
      //   theme: 'prism-themes/themes/prism-material-oceanic.css'
      // }
    }
  },
    /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
 vuetify: {
  treeShake: true,
  customVariables: ['~/assets/variables.scss'],
  optionsPath: '~plugins/vuetify.js'
},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    /*
  ** You can extend webpack config here
  */
    extend (config, ctx) {

      config.module.rules.push({
        enforce: 'pre',
        test: /\.txt$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/
      })

    }
  }
}
