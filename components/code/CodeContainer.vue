<template>
  <div>
    <v-sheet color="accent" elevation-10 class="mb-9 v-example">
      <v-lazy min-height="52" @mouseenter="importTemplate">
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
          <v-card tile v-if="expand" color="#2a2139" id="loginCard" dark>
            <v-item-group v-model="selected" class="pa-2" mandatory>
              <template v-for="(section, i) in sections">
                <v-item :key="`item-${i}`" :value="section">
                  <v-btn
                    slot-scope="{ active, toggle }"
                    :color="active ? 'accent' : 'transparent'"
                    :light="active"
                    class="mr-0"
                    depressed
                    @click="toggle"
                    >{{ section }}</v-btn
                  >
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

        <CodeCodepen ref="codepen" :pen="pen" :title="name" />
      </div>
      <v-sheet elevation="4" class="pa-4">
        <!-- Vue file that gets generated from examples folder -->
        <CodeVueFile :file="file" />
      </v-sheet>
    </v-sheet>

    <Dialog @click="deleteComponent" v-model="dialog" :doc="dialogInfo" />
    <OverlayLoader v-model="loader" />
  </div>
</template>

<script>
// import highlighting library (you can use any library you want just return html string)
// import syntax highlighting styles

// Mixins
import Codepen from '~/mixins/codepen';
import CodeVueFile from '~/components/code/VueFile';
import CodeMarkup from '~/components/code/Markup';
import CodeTooltip from '~/components/code/Tooltip';

export default {
  components: {
    Prism: () => import('vue-prism-component'),
    CodeVueFile,
    CodeMarkup,
    CodeTooltip,
  },
  mixins: [Codepen],

  props: {
    name: {
      type: String,
    },
    file: {
      type: String,
    },
  },

  data() {
    return {
      dialog: false,
      loader: false,
      copied: false,
      expand: false,
      selected: 'template',
    };
  },

  computed: {
    sections() {
      return ['template', 'script', 'style'].filter(
        (section) => this.pen[section]
      );
    },
    tooltips() {
      return [
        {
          icon: 'la-edit',
          path: `Edit-${this.name}-Component`,
          //feature: find a way distingush between child and parent components
          // if object does not have -usage in its name then attach + /child component to the route
          onClick: this.pushRoute,
        },
        {
          icon: 'la-trash',
          path: `Delete-${this.name}-Component`,
          onClick: this.show,
        },

        {
          icon: 'la-codepen',
          path: 'Open-in-Codepen',
          onClick: this.sendToCodepen,
        },
        {
          icon: 'la-code',
          path: 'View-source',
          onClick: () => (this.expand = !this.expand),
        },
      ];
    },
    dialogInfo() {
      //Check if component is parent or child
      let file = this.file.split(/[/]/);
      let fullComponentName = /[^/]*$/.exec(this.file)[0];
      let parent = file[0];
      let parentComponent = file[1];
      let isParent = fullComponentName.endsWith('usage');
      if (isParent) {
        //delete parent component
        return {
          parent: parent,
          slug: this.name,
          path: this.$route.path,
          type: 'component',
          extention: '.md',
        };
      } else {
        //delete child component
        return {
          parent: parent,
          slug: this.name,
          parentComponent: parentComponent,
          path: this.$route.path,
          type: 'childComponent',
          extention: '.md',
        };
      }
    },
  },

  methods: {
    show() {
      this.dialog = true;
    },
    deleteComponent() {
      this.dialog = false;
      //Check if component is parent or child
      let file = this.file.split(/[/]/);
      let fullComponentName = /[^/]*$/.exec(this.file)[0];
      let parent = file[0];
      let parentComponent = file[1];
      let isParent = fullComponentName.endsWith('usage');

      if (isParent) {
        //delete parent component
        const content = {
          parent: parent,
          slug: this.name,
          path: this.$route.path,
          type: 'component',
          extention: '.md',
        };
        console.log({ content });

        this.$socket.client.emit('deleteProperty', { content });
        this.$router.push(`/projects`);
        console.log(this.$route);
      } else {
        //delete child component
        const content = {
          parent: parent,
          slug: this.name,
          parentComponent: parentComponent,
          path: this.$route.path,
          type: 'childComponent',
          extention: '.md',
        };
        // console.log({ content });
        // console.log(this.$route);

        let l = this.$router.resolve({
          name: `/projects/${content.parent}/index`,
        });
        if (l.resolved.matched.length > 0) {
          //the route is exists.
          this.loader = false;
          this.$router.push(`/projects/${content.parent}/${content.slug}`);
        } else {
          //the route does not exists.
          this.loader = true;
        }

        this.$socket.client.emit('deleteProperty', { content });
        // this.$router.push(`/projects`);
      }
    },
    pushRoute() {
      let file = this.file.split(/[/]/);
      let fullComponentName = /[^/]*$/.exec(this.file)[0];
      let parent = file[0];
      let parentComponent = file[1];
      let isParent = fullComponentName.endsWith('usage');

      //Check if component is parent or child
      if (isParent) {
        //push to parent path
        this.$router.push(`/create_update/${parent}/${parentComponent}`);
      } else {
        //Push to child path
        this.$router.push(
          `/create_update/${parent}/${parentComponent}/${this.name}`
        );
      }
    },
    sendToCodepen() {
      this.$refs.codepen.submit();
    },
    copyMarkup() {
      const markup = this.$el.querySelector('pre');
      markup.setAttribute('contenteditable', 'true');
      markup.focus();
      document.execCommand('selectAll', false, null);
      this.copied = document.execCommand('copy');
      markup.removeAttribute('contenteditable');
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
  },
};
</script>

