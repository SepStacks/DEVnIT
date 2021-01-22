<template>
  <div>
    <v-sheet
      color="accent"
      elevation-10
      class="mb-9 v-example"
    >

      <v-lazy
        min-height="52"
        @mouseenter="importTemplate"
      >
        <div class="d-flex justify-end text-end pa-2">
          <CodeTooltip
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

      <div v-if="pen">
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
                      <CodeMarkup :code="pen[section]" />

                    </div>
                  </div>
                </v-window-item>
              </template>
            </v-window>
          </v-card>
        </v-expand-transition>

        <Codepen
          ref="codepen"
          :pen="pen"
        />

      </div>
      <v-sheet
        elevation="4"
        class="pa-4"
      >
        <!-- Vue file that gets generated from examples folder -->
        <CodeVueFile :file="file" />

      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
// import highlighting library (you can use any library you want just return html string)
// import syntax highlighting styles

// Mixins
import Codepen from '~/mixins/codepen'
import CodeVueFile from '~/components/code/VueFile'
import CodeMarkup from '~/components/code/Markup'
import CodeTooltip from '~/components/code/Tooltip'


export default {

  components: {
    Prism: () => import("vue-prism-component"),
    CodeVueFile,
    CodeMarkup,
    CodeTooltip
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
          icon: 'la-codepen',
          path: 'edit-in-codepen',
          onClick: this.sendToCodepen,
        },
        {
          icon: 'la-code',
          path: 'view-source',
          title: 'code',
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