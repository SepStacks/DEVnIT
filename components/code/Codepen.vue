<template>
  <div>
    <form
      action="https://codepen.io/pen/define"
      method="POST"
      target="_blank"
    >
      <input
        type="hidden"
        name="data"
        :value="value"
      />

      <!-- <input type="hidden" name="data"
      value='{"title": "New Pen!", "html": "<div>Hello, World!</div>"}'>-->

      <v-btn
        icon
        type="submit"
        class="white--text"
      >
        <v-icon size="20">la-codepen</v-icon>
      </v-btn>
    </form>
  </div>
</template>

<script>
// const title = 'Vuetify Example Pen'

const cssResources = [
  "https://maxcdn.icons8.com/fonts/line-awesome/1.1/css/line-awesome.min.css",
  "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons",
  "https://cdn.jsdelivr.net/npm/vuetify@2.3.15/dist/vuetify.min.css"
]

const jsResources = [
  "https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js",
  "https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js",
  "https://cdn.jsdelivr.net/npm/vuetify@2.3.15/dist/vuetify.min.js"
]
export default {
  name: "Codepen",

  props: {
    title: {
      type: String,
      required: false
    },
    html: {
      type: String,
      required: true
    },
    js: {
      type: String,
      required: true
    },
    css: {
      type: String,
      required: true
    }
  },

  computed: {
    value () {
      const data = {
        title: this.title,

        html: ` <div id="app">
       <v-app>
          <v-main>
           <v-container>
             ${this.html}
           </v-container>
          </v-main>
        </v-app>
      </div>`,
        css: this.css,
        css_external: [...cssResources].join(";"),
        js: this.js,
        js_external: [...jsResources].join(";")
      }
      return JSON.stringify(data)
    }
  },
  methods: {
    submit () {
      this.$el.submit()
    }
  }
};
</script>

<style scoped>
</style>
