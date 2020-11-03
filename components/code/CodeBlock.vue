<template>
  <div>
    <v-card
      class="mb-5"
      flat
      id="toolbarCard"
    >
      <v-toolbar
        tile
        dense
        flat
        color="accent"
      >
        <v-spacer />
        <v-card-actions>
          <v-row class="mr-4">
            <Codepen
              ref="codepen"
              :title="name"
              :html="html"
              :css="css"
              :js="js"
            />
          </v-row>
          <v-row>
            <v-btn
              icon
              class="white--text"
              @click="expand = !expand"
            >
              <v-icon size="20">la la-code</v-icon>
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-toolbar>

      <v-expand-transition>
        <v-card
          tile
          v-if="expand"
          color="#2a2139"
          id="loginCard"
          dark
        >
          <v-item-group
            v-model="selected"
            class="pa-2"
            mandatory
          >
            <template v-for="(section, i) in sections">
              <v-item
                :key="`item-${i}`"
                :value="section"
              >
                <v-btn
                  slot-scope="{ active, toggle }"
                  :color="active ? 'accent' : 'transparent'"
                  :light="active"
                  class="mr-0"
                  depressed
                  @click="toggle"
                >{{ section }}</v-btn>
              </v-item>
            </template>
          </v-item-group>

          <v-divider dark />

          <v-window v-model="selected">
            <template v-for="(section, i) in sections">
              <v-window-item
                v-if="section"
                :key="`window-${i}`"
                :value="section"
              >
                <div>
                  <div class="v-markup">
                    <prism
                      class="codeBlock"
                      line-numbers
                      :code="sectionVal"
                      ref="prismVal"
                      :language="language"
                    >
                    </prism>
                    <CopyBtn />

                    <!-- <div class="v-markup__copy " >
                                        <v-icon title="Copy code" @click="copyMarkup">la-copy</v-icon>
                                        <v-slide-x-transition>
                                            <span v-if="copied" class="v-markup__copied copiedText">Copied</span>
                                        </v-slide-x-transition>
                                    </div> -->
                  </div>
                </div>
              </v-window-item>
            </template>
          </v-window>
        </v-card>
      </v-expand-transition>

      <v-sheet
        elevation="4"
        class="pa-4"
      >
        <!-- <Previewer :height="height" :html="html" :css="css" :js="js" /> -->
        <Previewer :file="file" />

      </v-sheet>
    </v-card>
  </div>
</template>

<script>
// import highlighting library (you can use any library you want just return html string)
// import syntax highlighting styles
export default {
  props: {

    height: {
      type: [Number, String]
    },
    // sections: {
    //     type: [Object, String, Array]
    // },
    name: {
      type: String
    },
    file: {
      type: String
    },

  },

  components: {
    Prism: () => import("vue-prism-component"),

    sections () {
      return [
        'template',
        'script',
        'style',
      ].filter(section => this.pen[section])
    },
    // Previewer,
  },

  data () {
    return {
      file: 'example',
      copied: false,
      expand: false,
      selected: "template"
    }
  },

  computed: {
    sectionVal () {
      if (this.selected === "template") return this.html
      if (this.selected === "script") return this.js
      if (this.selected === "style") return this.css
    },

    language () {
      if (this.selected === "template") return "html"
      if (this.selected === "script") return "js"
      if (this.selected === "style") return "css"
    }
  },

  methods: {
    sendToCodepen () {
      this.$refs.codepen.submit()
    },
    copyMarkup () {
      const markup = this.$el.querySelector("pre")
      markup.setAttribute("contenteditable", "true")
      markup.focus()
      document.execCommand("selectAll", false, null)
      this.copied = document.execCommand("copy")
      markup.removeAttribute("contenteditable")
      setTimeout(() => {
        this.copied = false
      }, 2000)
    }
  },
  mounted () {
    this.file = `example`
  },

};
</script>

<style>
.v-markup {
  align-items: center;
  box-shadow: none;
  display: flex;
  border-radius: 2px;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 16px;
  color: #fff;
}

.v-markup pre,
.v-markup code {
  margin: 0;
  background: transparent;
}

.v-markup code {
  position: relative;
  box-shadow: none;
  overflow-x: auto;
  overflow-y: hidden;
  word-break: break-word;
  flex-wrap: wrap;
  align-items: center;
  vertical-align: middle;
  white-space: pre-wrap;
}

.v-markup code:before {
  display: none;
}

.v-markup__copied {
  position: absolute;
  top: 12px;
  right: 10px;
}

.v-markup__copy,
.v-markup__edit {
  position: absolute;
  top: 15px;
  cursor: pointer;
  width: 25px;
  height: 25px;
  z-index: 1;
}

.v-markup__copy {
  right: 0;
}

.v-markup__edit {
  right: 36px;
}

.v-markup__edit > a {
  color: inherit;
  text-decoration: none;
}

.v-markup:hover .v-markup__copy .v-icon,
.v-markup:hover .v-markup__edit .v-icon {
  opacity: 1;
}

.v-markup:hover .v-markup__copy:after,
.v-markup:hover .v-markup__edit:after {
  opacity: 0;
}

.v-markup .copiedText {
  margin-top: 20px !important;
}

.v-markup .v-markup__copy .v-icon,
.v-markup .v-markup__edit .v-icon {
  color: inherit;
  position: absolute;
  right: 0;
  transition: opacity 0.2s ease-in;
  font-size: 1.5rem;
  opacity: 0;
  top: 0;
  width: 50px;
  height: 50px;
  z-index: 4;
}
</style>
