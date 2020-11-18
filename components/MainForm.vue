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
            :rules="[rules.required, rules.duplicate, rules.string]"
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
      v-model="check"
      :label="`create new component from this template`"
    ></v-checkbox>
  </v-container>
          <!-- <v-radio
            @change="reset"
            name="Component"
            label="create new component"
            value="component"
          ></v-radio> -->
          <v-select
            v-if="makeTemplate"
           @input="isFormValid = true"
            :items="projects"
            v-model="doc.parent"
            item-text="title"
            label="Select project"
            :rules="[rules.required]"

          ></v-select>
          <v-text-field
          v-if="makeTemplate"
            v-model="doc.slug"
            label="component name"
            :rules="[rules.required, rules.duplicate, rules.string]"
          ></v-text-field>

          <v-container>
            <v-textarea
              v-model="doc.html"
              background-color="light-blue"
              color="black"
              label="HTML"
              @input="isFormValid = true"

            ></v-textarea>

            <v-textarea
              v-model="doc.css"
              background-color="grey lighten-2"
              color="cyan"
              label="CSS"
              @input="isFormValid = true"

            ></v-textarea>

            <v-textarea
              v-model="doc.js"
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              label="JS"
              @input="isFormValid = true"

            ></v-textarea>
          </v-container>

        </div>

        <v-row
          dense
          class="mt-3"
        >
          <v-col cols="12">
            <v-btn
              class="mx-2"
              @click.prevent="emitToServer"
              :disabled="!isFormValid"
            >
              Submit
            </v-btn>

            <v-btn
              class="mx-2"
              to="/projects"
              v-if="projects.length > 0"
            >Go to projects</v-btn>

          </v-col>

        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>

export default {

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
      isFormValid: true,
      response: '',
      isConnected: false,
      oldPath: '',
      oldComp: '',
      check: false,

      rules:
      {
        required: value => !!value || 'Required.',
        duplicate: value => !this.doesExist || 'Already exists',
        string: value => /^[A-Za-z]+$/.test(value) || 'Only strings are allowed'

      },


      // bodyTitle: '',
      // bodyDescription: '',
      // bodyContent: ''

    }
  },

  computed: {

    makeTemplate() {
     return this.check === true || this.mode === 'create' ? true : false


    },


    doesExist () {
      // Check if project exist
      if (this.doc.type === 'project') {
        // Without this line below switching betweeen component and project produces an error
        if (typeof this.doc.title === 'string') {
          return this.projects.includes(this.doc.title.toUpperCase())
        }

      } else {
        if (typeof this.doc.slug === 'string') {
        // check if component name exists based on the parent name
        const check = this.content.filter(data => data.parent === this.doc.parent.toUpperCase() && data.slug === this.doc.slug.toLowerCase())
        return check.length === 1

      }
      }




    }
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

  },

  methods: {


    emitToServer () {
      //Have different paramaters for component and projects
      var modeType = this.mode
      if (this.doc.type === 'project') {
        var self = this

        // values for project
        const content = {

          title: s00elf.doc.title.toUpperCase(),
          slug: self.doc.slug.toLowerCase(),
          extention: '.md',
          type: self.doc.type,
          parent: self.doc.parent.toUpperCase(),
          // bodyTitle: `# ${this.bodyTitle}`,
          // bodyDescription: this.bodyDescription,
          // bodyContent: this.bodyContent
        }

 this.$socket.client.emit("properties", { content, modeType })

        setTimeout(() => {
          // add some loader while component is being generated

   this.$router.push('/projects')
        }, 500)


      } else {
        var self = this
        // Values for component
        const content = {

          slug: self.doc.slug.toLowerCase(),
          oldPath: self.oldPath,
          oldProject: self.oldComp,
          template: self.doc.template,
          extention: self.doc.extention,
          type: self.doc.type,
          parent: self.doc.parent.toUpperCase(),
          html: self.doc.html,
          css: self.doc.css,
          js: self.doc.js

        }
        console.log("content ",content)

        console.log('success')
         this.$socket.client.emit("properties", { content, modeType })
        setTimeout(() => {
                this.$router.push(`/projects/`)

        }, 500)
      }

      // this.title = ''
      this.$refs.form.resetValidation()

    },

    reset () {
      this.$refs.form.reset()
    },



  },
  mounted() {
    //Keep old value of path
      var slug = this.doc.slug.toLowerCase()
      var path = _.cloneDeep(slug)
      this.oldPath  = path

       var parent = this.doc.parent.toLowerCase()
      var comp = _.cloneDeep(parent)
      this.oldComp  = comp


  }

}
</script>
