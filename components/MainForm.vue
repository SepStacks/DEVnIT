<template>
  <div>
    <v-container>
      <div>{{mode === 'create' ? 'Create Page' : 'Edit Page'}}</div>

      <v-form
        ref="form"
        v-model="isFormValid"
      >

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
            label="create new component"
            value="component"
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
            :value="doc.slug ='index'"
            label="component name"
          ></v-text-field>

          <div class="mt-5 font-weight-bold"> Add installation instructions(optional)</div>

          <!-- <v-text-field v-model="doc.bodytitle" label="Body Title"></v-text-field>
                <v-text-field v-model="doc.bodyDescription" label="Body Description"></v-text-field>

                <v-textarea
                name="input-7-1"
                label="Body Content"
                v-model="doc.bodyContent"
                hint="Hint text">
                </v-textarea> -->

        </div>

        <div v-if="doc.type === 'component'">

          <v-container
            class="px-0"
            fluid
          >
            <v-checkbox
              v-if="mode !== 'create'"
              v-model="check"
              :label="`create new component from this template`"
            ></v-checkbox>
          </v-container>

          <v-container>

            <v-sheet outlined>
              <v-row
                justify="center"
                class="container"
              >
                <v-col
                  v-if="makeTemplate"
                  cols="12"
                  md="4"
                >

                  <v-select
                    @input="isFormValid = true"
                    :items="projects"
                    v-model="doc.parent"
                    item-text="title"
                    label="Select project"
                    :rules="[rules.required]"
                  ></v-select>
                  <v-text-field
                    v-model="doc.slug"
                    label="component name"
                    :rules="[rules.required, rules.string]"
                  ></v-text-field>

                </v-col>

                <v-col>
                  <v-card
                    height="300"
                    elevation="4"
                    class="py-5"
                  >
                    <!-- search in temp directory and place in name of temp component -->
                    <!-- get placeholder component fist -->

                    <v-row
                      align="center"
                      justify="center"
                    >

                      <!-- <v-col v-if="doc.html === ''">
                        <div>Add vue markup to generate previewer</div>

                      </v-col>
                      <v-col v-else>
                        <Previewer
                          :value="preview"
                          class="panel"
                        />



                      </v-col> -->
                      <Previewer
                        :value="preview"
                        class="panel"
                      />
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>

            <!-- codemirror -->

            <v-row class="container">

              <v-col
                cols="12"
                md="4"
              >
                <client-only placeholder="Codemirror Loading...">
                  <div>HTML</div>
                  <codemirror
                    v-model.lazy="doc.html"
                    :options="cmOption"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange"
                  >
                  </codemirror>
                </client-only>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <client-only>
                  <div>CSS</div>
                  <codemirror
                    v-model.lazy="doc.css"
                    :options="cmOption"
                    @focus="onCmFocus"
                  >
                  </codemirror>
                </client-only>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <client-only>

                  <div>JS</div>
                  <codemirror
                    v-model.lazy="doc.js"
                    :options="cmOption"
                    @focus="onCmFocus"
                  >
                  </codemirror>
                </client-only>
              </v-col>
            </v-row>
            <v-btn
              @click="compile"
              class="compile"
            >
              Run
            </v-btn>

            <!--
            <v-textarea
              v-model="doc.html"
              background-color="light-blue"
              color="black"
              label="HTML"
              :rules="[rules.required]"
              @input="[isFormValid = true ? isFormValid : false, writeTemp()]"
            ></v-textarea>




            <v-textarea
              v-model="doc.css"
              background-color="grey lighten-2"
              color="cyan"
              label="CSS"
              @input="[isFormValid = true ? isFormValid : false, writeTemp()]"
            ></v-textarea>

            <v-textarea
              v-model="doc.js"
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              label="JS"
              @input="[isFormValid = true ? isFormValid : false, writeTemp()]"
            ></v-textarea> -->

          </v-container>

        </div>

        <v-row
          dense
          class="mt-3"
        >
          <v-col cols="12">
            <v-btn
              :loading="loader"
              class="mx-2"
              @click.prevent="emitToServer"
              :disabled="mode === 'Edit Page' ? isFormValid = false : !isFormValid"
            >
              Submit
            </v-btn>

            <v-btn
              class="mx-2"
              @click="[$router.go(-1), emptyFile()]"
            >cancel</v-btn>

          </v-col>

        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
// import 'some-codemirror-resource'
import Previewer from '~/components/ui/Previewer'
import Snackbar from '~/components/Snackbar'

import { parseComponent } from 'vue-template-compiler/browser'
import { parse as queryParse } from 'query-string'
// import getImports from '@/utils/get-imports'
import getPkgs from '@/utils/get-pkgs'
import isAbsouteUrl from 'is-absolute-url'
// import { upload } from '@/utils/store';
import * as params from '@/utils/params'

// const babel = require('babel-core')
import * as Babel from 'babel-standalone';
// var babel = require("@babel/core");
// import { transform } from "@babel/core";
// import * as babel from "@babel/core";


const CDN_MAP = {
  unpkg: '//unpkg.com/',
  jsdelivr: '//cdn.jsdelivr.net/npm/'
}


export default {

  name: 'MainForm',
  components: { Previewer, Snackbar },

  props: {
    projects: {
      type: Array,
    },
    content: {
      type: Array
    },
    //document object with all the content
    doc: {
      type: Object
    },
    /* choose to show radio group (should be hidden on edit pages as we do not
      want the values to mix/overlap with other components)*/
    showRadio: {
      type: Boolean,
      default: true

    },
    // Create or Edit mode
    mode: {
      type: String,
      default: 'create'

    },

    template: {
      type: Boolean,
      default: false
    }
    // markdownTemplate: {
    //     required: false
    // }
  },

  data () {
    return {
      preview: '',
      code: '',
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
      rules:
      {
        required: value => !!value || 'Required.',
        string: value => /^[A-Za-z]+$/.test(value) || 'Only strings are allowed'
      },
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: 'text/javascript',
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: 'base16-dark',
        extraKeys: { 'Ctrl': 'autocomplete' },
        hintOptions: {
          completeSingle: true
        }
      }


      // bodyTitle: '',
      // bodyDescription: '',
      // bodyContent: ''

    }
  },

  computed: {

    makeTemplate () {

      return this.check === true || this.mode === 'create' ? true : false

    },
    doesExist () {
      // Check if project exist
      if (this.doc.type === 'project') {
        const string = this.doc.title + ""
        // Without this line below switching betweeen component and project produces an error
        if (this.projects.includes(string.toUpperCase())) {
          return `${this.doc.parent} already exist`
        }


        return true




      } else {

        if (typeof this.doc.slug === 'string') {
          const parent = this.doc.parent + ""
          const slug = this.doc.slug + ""

          const check = this.content.filter(data => data.parent === parent.toUpperCase() && data.slug === slug.toLowerCase())

          // check if component name exists based on the parent name
          // return check.length === 1
          if (check.length === 1) {
            return `${slug} already exist`
          } else {
            return true
          }
        }

      }

    },

  },

  sockets: {

    // Fired when the socket connects.
    connect () {
      this.isConnected = true
      console.log('NODE-SERVER is connected')

    },
    disconnect () {
      this.isConnected = false
    },
    output (data) {
      // This method was fired by the node-server. eg: io.emit("output", content)'
      return this.$notifier.showMessage({
        content: 'new ' + `<strong>${data.type}</strong>` + ' has been created',
        color: "success",
      })

    },
    ifEmptyTemplate (msg) {
      //empty contrnt data
      if (msg = 'Template is empty') {
        this.isEmptyTemplate = true
      }

      console.log(msg)

    }

  },

  methods: {
    emptyFile () {
      if (this.doc.type === 'component') {
        this.doc.html = '',
          this.doc.css = '',
          this.doc.js = ''
      }
    },
    async compile () {
      const code = this.doc.html + '\n' + '\n' + this.doc.js + '\n' + '\n' + this.doc.css
      if (!code) {
        return
      }
      // const imports = []
      const { template, script, styles, customBlocks } = parseComponent(code)
      let config

      if ((config = customBlocks.find(n => n.type === 'config'))) {
        params.clear()
        params.parse(config.content)
      }

      let compiled
      const pkgs = []
      let scriptContent = 'exports = { default: {} }'

      if (script) {
        console.log(Babel)
        try {
          compiled = Babel.transform(script.content, {
            presets: ['es2015', 'es2016', 'es2017', 'stage-0'],
            // plugins: [[getImports]]
          }).code
        } catch (e) {
          this.preview = `<pre style="color: red">${e.message}</pre>`
          return
        }
        scriptContent = await getPkgs(compiled, pkgs)
      }

      const heads = this.genHeads()
      const scripts = []

      pkgs.forEach(pkg => {
        scripts.push(
          `<script src=//packd.now.sh/${pkg.module}${pkg.path}?name=${pkg.name
          }><\/script>`
        )
      })

      styles.forEach(style => {
        heads.push(`<style>${style.content}</style>`)
      })

      scripts.push(`
      <script>
        var exports = {};
        ${scriptContent}
        var component = exports.default;
        component.template = component.template || ${JSON.stringify(
        template.content
      )}

        new Vue(component).$mount('#app')
      <\/script>`)

      this.preview = {
        head: heads.join('\n'),
        body: '<div id="app"></div>' + scripts.join('\n')
      }
    },
    genHeads () {
      let heads = []

      params.queryParse(location.search)

      const { pkgs, css, cdn, vue, vuetify } = params.get()
      const prefix = CDN_MAP[cdn] || CDN_MAP.unpkg

      return [].concat(
        []
          .concat(vue ? 'vue@' + vue : 'vue', pkgs)
          .concat(vuetify ? 'vuetify@' + vuetify : 'vuetify', pkgs)

          .map(
            pkg =>
              `<script src=${isAbsouteUrl(pkg) ? '' : prefix}${pkg}><\/script>`
          ),
        css.map(
          item =>
            console.log('css', item)
              `<link rel=stylesheet href=${isAbsouteUrl(item) ? '' : prefix
              }${item}>`
        )
      )
    },



    emitToServer () {
      //Have different paramaters for component and projects
      var modeType = this.mode
      if (this.doc.type === 'project') {
        var self = this
        this.loader = true

        // values for project
        const content = {

          title: self.doc.title.toString().toUpperCase(),
          slug: self.doc.slug.toString().toLowerCase(),
          extention: '.md',
          type: self.doc.type,
          parent: self.doc.parent.toString().toUpperCase(),
          // bodyTitle: `# ${this.bodyTitle}`,
          // bodyDescription: this.bodyDescription,
          // bodyContent: this.bodyContent
        }

        this.$socket.client.emit("properties", { content, modeType })

        setTimeout(() => {
          // add some loader while component is being generated
          this.tempLoader = false

          this.$router.push(`/projects/`)
        }, 500)


      } else {
        var self = this
        this.tempLoader = true

        // Values for component
        const content = {

          slug: self.doc.slug.toString().toLowerCase(),
          oldPath: self.oldPath,
          oldProject: self.oldComp,
          template: self.doc.template,
          extention: self.doc.extention,
          type: self.doc.type,
          parent: self.doc.parent.toString().toUpperCase(),
          html: self.doc.html,
          css: self.doc.css,
          js: self.doc.js

        }
        console.log("content ", content)

        console.log('success')
        this.$router.push(`/projects/`)

        setTimeout(() => {
          this.$socket.client.emit("properties", { content, modeType })
          this.tempLoader = false

        }, 500)
      }

      // this.title = ''
      this.$refs.form.validate()

    },

    reset () {
      this.$refs.form.reset()
    },

    writeTemp () {
      //load on update
      let self = this

      //Create get/create .vue file. write the template markups based on ui input and update it
      //after a few seconds
      const content = {

        // type: self.doc.type,
        html: self.doc.html,
        css: self.doc.css,
        js: self.doc.js

      }

      //add mode property to keep state of the edit component

      this.$socket.client.emit("writeToVue", { content })

    },
    //code Mirror methods
    onCmReady (cm) {
      console.log('the editor is readied!', cm)
      this.emptyOutVueTempFile()
    },
    onCmFocus (cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange (newCode) {

      // this.isFormValid

      // console.log('this is new code', newCode)
      // this.doc.html = newCode
      // if (newCode) {
      //   setTimeout(() => {
      //     this.writeTemp()
      //   }, 300)
      // } else if (newCode === '') {

      //   this.emptyOutVueTempFile()
      //   setTimeout(() => {
      //     this.writeTemp()
      //   }, 300)

      // }
    },

    emptyOutVueTempFile () {

      this.$socket.client.emit("emptyOutVueFile")

    }

  },
  mounted () {

    //Keep old value of path
    var slug = this.doc.slug
    var path = _.cloneDeep(slug)
    this.oldPath = path

    var parent = this.doc.parent
    var comp = _.cloneDeep(parent)
    this.oldComp = comp

  },


}
</script>


<style scoped>
.compile {
  white-space: pre;
}
</style>

