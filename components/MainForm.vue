<template>
  <div>
    <v-container>
      <div>{{ mode === 'create' ? 'Create Page' : 'Edit Page' }}</div>
      <v-form ref="form" @submit.prevent="compile" v-model="isFormValid">
        <v-radio-group
          v-show="showRadio"
          v-model="doc.type"
          row
          v-if="projects.length > 0"
        >
          <v-radio
            name="Project"
            label="create new project"
            value="project"
          ></v-radio>
          <v-radio
            @change="reset"
            name="Component"
            label="create new main component"
            value="component"
          ></v-radio>
          <v-radio
            @change="reset"
            name="Component"
            label="create new nested component"
            value="childComponent"
          ></v-radio>
        </v-radio-group>

        <div v-if="doc.type === 'project'">
          <v-text-field
            class="text-capitalize"
            v-model="doc.title"
            :rules="[rules.required, rules.string, doesExist]"
            label="title"
            required
          ></v-text-field>
          <v-text-field
            class="text-capitalize"
            persistent-hint
            hint="component name for project should always be index"
            readonly
            v-show="false"
            v-model="doc.slug"
            :value="(doc.slug = 'index')"
            label="component name"
          ></v-text-field>

          <div class="mt-5 font-weight-bold">
            <!-- add installation instructions here -->
            Add installation instructions(optional)

            <v-textarea v-model="doc.contentBody" />
          </div>
        </div>

        <div v-if="doc.type === 'component' || doc.type === 'childComponent'">
          <v-container class="px-0" fluid>
            <v-checkbox
              v-if="mode !== 'create'"
              v-model="check"
              :label="`create new component from this template`"
            >
            </v-checkbox>
          </v-container>
          <!-- switch between parent and child components -->
          <!-- <v-checkbox
            v-if="
              mode === 'create' ||
              doc.type === 'component' ||
              doc.type === 'childComponent'
            "
            v-model.lazy="isChild"
            :label="`Add Child Component`"
            @click="discardChanges"
          ></v-checkbox> -->

          <v-container>
            <v-col v-if="makeTemplate" cols="12" md="4">
              <v-select
                @input="isFormValid = true"
                :items="projects"
                v-model="doc.parent"
                item-text="parent"
                label="Select project"
                :rules="[rules.required]"
              ></v-select>
              <v-text-field
                v-if="doc.type === 'component'"
                v-model="doc.slug"
                label="Component name"
                :rules="[rules.required, rules.string, doesExist]"
              >
              </v-text-field>

              <v-select
                v-else
                @input="isFormValid = true"
                :items="parentComponents"
                v-model="doc.parentComponent"
                item-text="slug"
                label="Parent Component"
                :rules="[rules.required]"
              ></v-select>
              <v-textarea
                v-model="doc.description"
                label="Description"
                :rules="[rules.required]"
              >
              </v-textarea>
              <v-text-field
                v-if="doc.type === 'childComponent'"
                class="text-capitalize"
                persistent-hint
                hint=""
                v-model="doc.title"
                :value="doc.slug !== 'index'"
                label="component name"
              ></v-text-field>
              <v-text-field
                v-if="doc.type === 'childComponent' && doc.parent"
                class="text-capitalize"
                persistent-hint
                hint="prefix result"
                readonly
                :value="(doc.prefix = doc.parent)"
                label="Prefix"
              ></v-text-field>
              <v-text-field
                v-if="doc.type === 'childComponent' && doc.prefix && doc.title"
                class="text-capitalize"
                persistent-hint
                hint=""
                readonly
                :value="
                  mode === 'create'
                    ? (doc.slug = doc.parentComponent + '-' + doc.title)
                    : doc.slug
                "
                label="Slug"
              ></v-text-field>
            </v-col>
            <!-- codemirror -->
            <v-row
              class="container"
              v-if="doc.type === 'component' || doc.type === 'childComponent'"
            >
              <v-col cols="12" md="4">
                <client-only placeholder="Codemirror Loading...">
                  <div>HTML</div>
                  <codemirror
                    v-model="doc.html"
                    :options="cmOption"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange"
                  >
                  </codemirror>
                </client-only>
              </v-col>

              <v-col cols="12" md="4">
                <client-only>
                  <div>CSS</div>
                  <codemirror
                    v-model="doc.css"
                    :options="cmOption"
                    @focus="onCmFocus"
                  >
                  </codemirror>
                </client-only>
              </v-col>

              <v-col cols="12" md="4">
                <client-only>
                  <div>JS</div>
                  <codemirror
                    v-model="doc.js"
                    :options="cmOption"
                    @focus="onCmFocus"
                  >
                  </codemirror>
                </client-only>
              </v-col>
            </v-row>
          </v-container>

          <LazyUiPreviewer :value="preview" ref="iframe" />
          <!-- <div v-else>
              press run
            </div> -->
        </div>

        <v-row justify="end" class="mt-3">
          <v-col cols="12">
            <v-btn
              :loading="loader"
              class="mx-2"
              @click.prevent="emitToServer"
              :disabled="
                mode === 'Edit Page' ? (isFormValid = false) : !isFormValid
              "
            >
              Submit
            </v-btn>
            <v-btn
              :disabled="!doc.html"
              v-if="doc.type === 'component' || doc.type === 'childComponent'"
              type="submit"
            >
              Run
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <!-- loader -->

  <OverlayLoader v-model="loader"/>

    <DialogsInfo :content="dialogInfo" @click="resetForm" v-model="dialog" />
  </div>
</template>

<script>
// import 'some-codemirror-resource'
import UiPreviewer from '~/components/ui/UiPreviewer';
import Snackbar from '~/components/Snackbar';

import { parseComponent } from 'vue-template-compiler/browser';
import { parse as queryParse } from 'query-string';
// import getImports from '@/utils/get-imports'
import getPkgs from '@/utils/get-pkgs';
import isAbsouteUrl from 'is-absolute-url';
// import { upload } from '@/utils/store';
import * as params from '@/utils/params';

// const babel = require('babel-core')
import * as Babel from 'babel-standalone';
// var babel = require("@babel/core");
// import { transform } from "@babel/core";
// import * as babel from "@babel/core";

const CDN_MAP = {
  unpkg: '//unpkg.com/',
  jsdelivr: '//cdn.jsdelivr.net/npm/',
};
// import contentProperties from '~/mixins/contentProperties.js';

export default {
  name: 'MainForm',
  // mixins: [contentProperties],
  components: {
    //  Previewer,
    Snackbar,
  },

  props: {
    projects: {
      type: Array,
    },
    parentComponents: {
      type: Array,
    },
    // content: {
    //   type: Array,
    // },
    //document object with all the content
    doc: {
      type: Object,
    },
    /* choose to show radio group (should be hidden on edit pages as we do not
      want the values to mix/overlap with other components)*/
    showRadio: {
      type: Boolean,
      default: true,
    },
    // Create or Edit mode
    mode: {
      type: String,
      default: 'create',
    },

    template: {
      type: Boolean,
      default: false,
    },

    // markdownTemplate: {
    //     required: false
    // }
  },

  data: () => ({
    showPreviewer: false,
    dialog: false,
    showSample: false,
    preview: '',
    code: '',
    loadCompile: false,
    //Array of the code that will be applied to codemirror
    tempLoader: false,
    isEmptyTemplate: false,
    loader: false,
    isFormValid: true,
    response: '',
    isConnected: false,
    oldPath: '',
    oldComp: '',
    check: false,
    isChild: null,
    rules: {
      required: (value) => !!value || 'Required.',
      string: (value) =>
        /^[A-Za-z]+$/.test(value) || 'Only strings are allowed',
    },
    cmOption: {
      mode: 'vue',
      theme: 'base16-dark',
      value: `<template></template>`,
      lineNumbers: true,
      tabSize: 2,
      autofocus: true,
      line: true,
      styleActiveLine: true,
      matchBrackets: true,
      extraKeys: {
        Tab: 'emmetExpandAbbreviation',
        Enter: 'emmetInsertLineBreak',
      },
    },

    // bodyTitle: '',
    // bodyDescription: '',
    // bodyContent: ''
  }),

  computed: {
    // filterProjects() {
    //   if (this.doc.type === 'childComponent') {
    //     //only show projects that can have a child component
    //     console.log('projects',this.projects)
    //     const check = this.content.filter(
    //       (data) => data.parent && data.slug !== 'index'
    //     );
    //     console.log('check', check);
    //     return check;
    //   } else {
    //     //return all project titles
    //     return this.projects;
    //   }
    // },
    dialogInfo() {
      return {
        title: 'Discard changes?',
        text:
          'Changes has not been submitted, Are you sure you want to discard changes?',
        message: 'Warning unsaved data will be lost',
      };
    },

    // filterParentComponents() {
    //   //Filter function that displays the parent components based on project name
    //   const parent = this.doc.parent + '';
    //   const check = this.parentComponents.filter(
    //     (data) =>
    //       data.parent === parent.toString().toUpperCase() &&
    //       data.slug !== 'index'
    //   );
    //   console.log('content', check);
    //   return check;
    // },
    dynamicProps() {
      return { value: 'preview' };
    },
    makeTemplate() {
      return this.check === true || this.mode === 'create' ? true : false;
    },
    doesExist() {
      // Check if project exist
      if (this.doc.type === 'project') {
        const string = this.doc.title + '';
        // Without this line below switching betweeen component and project produces an error
        if (this.projects.includes(string.toUpperCase())) {
          return `${this.doc.parent} already exist`;
        }

        return true;
      } else {
        const parent = this.doc.parent + '';
        const slug = this.doc.slug + '';
        const check = this.projects.filter(
          (data) =>
            data.parent === parent.toString().toUpperCase() &&
            data.slug === slug.toString().toLowerCase()
        );
        console.log('check', check);

        return check.length === 1
          ? ` The ${slug} component already exist please choose a
        different name`
          : true;
      }
    },
  },

  sockets: {
    // Fired when the socket connects.
    connect() {
      this.isConnected = true;
      console.log('NODE-SERVER is connected');
    },
    disconnect() {
      this.isConnected = false;
    },
    output(data) {
      // This method was fired by the node-server. eg: io.emit("output", content)'
      return this.$notifier.showMessage({
        content: 'new ' + `<strong>${data.type}</strong>` + ' has been created',
        color: 'success',
      });
    },
  },

  methods: {
    async compile() {
      const code =
        this.doc.html + '\n' + '\n' + this.doc.js + '\n' + '\n' + this.doc.css;
      if (!code) {
        return;
      }
      // const imports = []
      const { template, script, styles, customBlocks } = parseComponent(code);
      let config;

      if ((config = customBlocks.find((n) => n.type === 'config'))) {
        params.clear();
        params.parse(config.content);
      }

      let compiled;
      const pkgs = [];
      let scriptContent = 'exports = { default: {} }';

      if (script) {
        try {
          compiled = Babel.transform(script.content, {
            presets: ['es2015', 'es2016', 'es2017', 'stage-0'],
            // plugins: [[getImports]]
          }).code;
        } catch (e) {
          this.preview = `<pre style="color: red">${e.message}</pre>`;
          return;
        }
        scriptContent = await getPkgs(compiled, pkgs);
      }

      const heads = this.genHeads();
      const scripts = [];

      pkgs.forEach((pkg) => {
        scripts.push(
          `<script src=//packd.now.sh/${pkg.module}${pkg.path}?name=${pkg.name}><\/script>`
        );
      });

      styles.forEach((style) => {
        heads.push(`<style>${style.content}</style>`);
      });

      const vuetifyOpts = require('@/plugins/vuetify').default;
      console.log({ vuetifyOpts });
      scripts.push(`

      <script>
        var exports = {};
        ${scriptContent}
        var component = exports.default
        component.template = component.template ||
        ${JSON.stringify('<v-app> ' + template.content + '</v-app>')}
        const LINE_AWESOME = {
            complete: 'la-check',
            cancel: 'la-ban',
            close: 'la-times',
            delete: 'la-trash', // delete (e.g. v-chip close)
            clear: 'la-times',
            success: 'la-check',
            info: 'la-exclamation-circle',
            warning: 'la-exclamation-triangle',
            error: 'la-exclamation-triangle',
            prev: 'la-angle-left',
            next: 'la-angle-right',
            checkboxOn: 'la-check',
            checkboxOff: 'la-stop',
            checkboxIndeterminate: '...',
            delimiter: '...', // for carousel
            sort: '...',
            expand: 'la-angle-down',
            menu: '...',
            subgroup: '...',
            dropdown: 'la-angle-down',
            radioOn: 'la-check-circle',
            radioOff: 'la-circle',
            edit: 'la-edit',
            ratingEmpty: '...',
            ratingFull: '...',
            ratingHalf: '...',
            loading: '...',
            first: '...',
            last: '...',
            unfold: '...',
            file: '...'
        }

        const opts = {
        icons: {
          iconfont: 'la',
          values: LINE_AWESOME
          },
        theme: {
        themes: {
        light: {
        success: '#A4DB75', //  Success
        error: '#DA4E71', //  Error
        primary: '#12152F', //  ALtron Grey BLue
        accent: '#01C5FF', //  ALtron light BLue
        secondary: '#20274F', //  ALtron white
        info: '#0169FF', //  ALtron dark Blue
        primaryShade: '#161A37',
        accentShade: '#41D4FF',
        secondaryShade: '#184F7B',
        infoShade: '#0180FF',
        primaryhover: '#12152F',
        accenthover: '#0599CB',
        secondaryhover: '#099ED3',
        infohover: '#01AEFF',
      }}}}

        Vue.use(Vuetify);
        new Vue({vuetify : new Vuetify(opts),
        render: h => h(component)
      }).$mount('#app')
      <\/script>

      `);

      this.preview = {
        head: heads.join('\n'),
        body: `<div id="app"></div>` + scripts.join('\n'),
      };
    },
    genHeads() {
      let heads = [
        'https://unpkg.com/vuetify@2.4.8/dist/vuetify.css',
        'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
        'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
        'https://unpkg.com/line-awesome@1.3.0/dist/line-awesome/css/line-awesome.min.css',
      ];

      params.queryParse(location.search);

      const { pkgs, css, cdn, vue, vuetify } = params.get();
      const prefix = CDN_MAP[cdn] || CDN_MAP.unpkg;

      let frameworkJS = [
        'https://unpkg.com/vue@2.6.12/dist/vue.js',
        'https://unpkg.com/vuetify@2.4.8/dist/vuetify.js',
      ];

      return [].concat(
        []
          // .concat(vue ? 'vue@' + vue : 'vue', pkgs)
          .concat(frameworkJS)

          .map(
            (pkg) =>
              `<script src=${isAbsouteUrl(pkg) ? '' : prefix}${pkg}><\/script>`
          ),
        css
          .concat(heads)
          .map(
            (item) =>
              `<link rel=stylesheet href=${
                isAbsouteUrl(item) ? '' : prefix
              }${item}>`
          )
      );
    },

    emitToServer() {
      //Have different paramaters for component and projects
      var modeType = this.mode;
      if (this.doc.type === 'project') {
        var self = this;

        // values for project
        const content = {
          title: self.doc.title.toString().toUpperCase(),
          slug: self.doc.slug.toString().toLowerCase(),
          extention: '.md',
          type: self.doc.type,
          parent: self.doc.parent.toString().toUpperCase(),
          contentBody: self.doc.contentBody,
          // bodyTitle: `# ${this.bodyTitle}`,
          // bodyDescription: this.bodyDescription,
          // bodyContent: this.bodyContent
        };

        this.$socket.client.emit('properties', { content, modeType });

        // add some loader while component is being generated
        this.$router.push(`/projects/`);
      } else if (this.doc.type === 'component') {
        var self = this;
        // this.tempLoader = true;

        // Values for component
        const content = {
          title: 'usage',
          description: self.doc.description.toString().toLowerCase(),
          prefix: self.doc.slug.toString().toLowerCase(),
          slug: self.doc.slug.toString().toLowerCase(),
          oldPath: self.oldPath,
          oldProject: self.oldComp,
          template: self.doc.template,
          extention: self.doc.extention,
          type: self.doc.type,
          parent: self.doc.parent.toString().toUpperCase(),
          html: self.doc.html,
          css: self.doc.css,
          js: self.doc.js,
        };
        this.$socket.client.emit('properties', { content, modeType });
        // navigate to route if it exists
        let l = this.$router.resolve({
          name: `/projects/${content.parent}/index`,
        });
        if (l.resolved.matched.length > 0) {
          //the route is exists.
          this.loader = false
          this.$router.push(`/projects/${content.parent}/${content.slug}`)
        } else {
          //the route does not exists.
          this.loader = true;
        }
      } else if (this.doc.parentComponent) {
        var self = this;

        // Values for Child component
        //add versioning in the future to components aswell
        const content = {
          title: self.doc.title,
          prefix: self.doc.parentComponent.toString(),
          description: self.doc.description,
          slug: self.doc.slug.toString().toLowerCase(),
          oldPath: self.oldPath,
          oldProject: self.oldComp,
          extention: self.doc.extention,
          type: 'childComponent',
          parent: self.doc.parent.toString().toUpperCase(),
          parentComponent: self.doc.parentComponent.toString(),
          html: self.doc.html,
          css: self.doc.css,
          js: self.doc.js,
        };
        this.$socket.client.emit('properties', { content, modeType });

        let l = this.$router.resolve({
          name: `/projects/${content.parent}/${content.parentComponent}`,
        });
        if (l.resolved.matched.length > 0) {
          //the route is exists.
          this.loader = false;
          this.$router.push( `/projects/${content.parent}/${content.parentComponent}`)

        } else {
          //the route does not exists.
          this.loader = true
        }
      }

      // this.title = ''
      this.$refs.form.validate();
    },
    discardChanges() {
      // check if any field has been edited

      if (
        this.doc.title !== null ||
        this.doc.slug !== null ||
        this.doc.extention !== '.md' ||
        this.doc.type !== 'component' ||
        this.doc.parent !== '' ||
        this.doc.html !== '' ||
        this.doc.css !== ''
      ) {
        this.dialog = true;
      }
    },
    resetForm() {
      let self = this;
      let doc = self.doc;

      (doc.title = null),
        (doc.slug = null),
        (doc.extention = '.md'),
        (doc.type = 'component'),
        (doc.parent = ''),
        (doc.html = ''),
        (doc.css = ''),
        (doc.js = '');
      this.$refs.form.resetValidation();
      this.dialog = false;
    },

    reset() {
      // const ref = this.$refs
      // console.log({ref})
      this.$refs.form.reset();
    },

    //code Mirror methods
    onCmReady(cm) {
      // if (this.doc.slug) {
      //   setTimeout(() => {
      //     this.compile();
      //   }, 500);
      // }
    },
    onCmFocus(cm) {
      // console.log('the editor is focus!', cm);
      // if (this.doc.slug) {
      //   setTimeout(() => {
      //     this.compile();
      //   }, 500);
      // }
    },
    onCmCodeChange(newCode) {
      if (newCode) {
        this.compile();
      }
    },

    // emptyOutVueTempFile() {
    //   this.$socket.client.emit('emptyOutVueFile');
    // },
  },

  mounted() {
    var slug = this.doc.slug;
    var path = _.cloneDeep(slug);
    this.oldPath = path;

    var parent = this.doc.parent;
    var comp = _.cloneDeep(parent);
    this.oldComp = comp;
  },
};
</script>


<style scoped>
.compile {
  white-space: pre;
}
</style>

