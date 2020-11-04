<template>
  <div>
    <v-sheet
      class="mb-9 v-example"

      id="toolbarCard"
    >

          <v-lazy
      min-height="52"
      @mouseenter="importTemplate"
    >
      <div class="text-end pa-2">
        <Tooltip
          v-for="(tooltip, i) in tooltips"
          :key="i"
          :href="tooltip.href ? tooltip.href : undefined"
          :icon="tooltip.icon"
          :path="tooltip.path"
          :target="tooltip.href ? '_blank' : undefined"
          @click="tooltip.onClick"
        />
      </div>
    </v-lazy>

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
                    <Markup   :code="pen[section]"/>

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
    </v-sheet>
  </div>
</template>

<script>
// import highlighting library (you can use any library you want just return html string)
// import syntax highlighting styles

// Mixins
import Codepen from '~/mixins/codepen'

export default {

  components: {
    Prism: () => import("vue-prism-component"),
  },
      mixins: [Codepen],

  props: {
    name: {
      type: String
    },
    file: {
      type: String
    },
  },


  data () {
    return {
      copied: false,
      expand: false,
      selected: "template"
    }
  },

  computed: {
    sections () {
      return [
        'template',
        'script',
        'style',
      ].filter(section => this.pen[section])
    },
  tooltips () {
        return [
          {
            icon: 'la-home',
            path: 'invert-example-colors',
            onClick: () => (this.dark = !this.dark),
          },
          {
            icon: 'la-codepen',
            path: 'edit-in-codepen',
            onClick: this.sendToCodepen,
          },
          {
            icon: 'la-code',
            path: 'view-source',
            onClick: () => (this.expand = !this.expand),
          },
        ]
      },
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


};
</script>

<style lang="sass">
  .v-example
    code[class*="language-"],
    pre[class*="language-"]
      text-shadow: none
    pre.language-markup::after
      content: 'vue'
</style>