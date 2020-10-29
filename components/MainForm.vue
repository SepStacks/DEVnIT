<template>
  <div>
    <v-container>
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
            :rules="[rules.required, rules.duplicate]"
            label="title"
            required
          ></v-text-field>
          <v-text-field
            class="text-capitalize"
            persistent-hint
            hint="component name for project should always be index"
            readonly
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
          <!-- This items value needs to be exported as a prop and get the project titles array -->
          <v-select
            :items="projects"
            v-model="doc.parent"
            item-text="title"
            label="Select project"
          ></v-select>
          <v-text-field
            v-model="doc.slug"
            label="component name"
            :rules="[rules.required, rules.duplicate]"
          ></v-text-field>

          <v-container>
            <v-textarea
              v-model="doc.html"
              background-color="light-blue"
              color="black"
              label="HTML"
            ></v-textarea>

            <v-textarea
              v-model="doc.css"
              background-color="grey lighten-2"
              color="cyan"
              label="CSS"
            ></v-textarea>

            <v-textarea
              v-model="doc.js"
              background-color="amber lighten-4"
              color="orange orange-darken-4"
              label="JS"
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
    // markdownTemplate: {
    //     required: false
    // }
  },

  data () {
    return {
      isFormValid: false,
      response: '',
      isConnected: false,
      rules:
      {
        required: value => !!value || 'Required.',
        duplicate: value => !this.doesExist || 'Already exists'

      },






      // bodyTitle: '',
      // bodyDescription: '',
      // bodyContent: ''

    }
  },

  computed: {
    //check if project title exist

    // doesExist () {

    //   // Check if project exist
    //   if (this.type === 'project') {

    //     if(typeof title === 'string' ) {
    //         return this.projects.includes(this.doc.title.toUpperCase())
    //     }
    //   }
    //   // check if component name exists based on the parent name
    //   const check = this.content.filter(data => data.parent === this.doc.parent.toUpperCase() && data.slug === this.doc.slug.toLowerCase())
    //   return check.length === 1

    // },

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

      if (this.doc.type === 'project') {

        const content = {

          title: this.doc.title.toUpperCase(),
          slug: this.doc.slug.toLowerCase(),
          extention: this.doc.extention,
          type: this.doc.type,
          parent: this.doc.parent.toUpperCase(),
          // bodyTitle: `# ${this.bodyTitle}`,
          // bodyDescription: this.bodyDescription,
          // bodyContent: this.bodyContent
        }

        this.$socket.client.emit("properties", content)
        this.$refs.form.resetValidation()

      } else {

        const content = {

          slug: this.doc.slug.toLowerCase(),
          extention: this.doc.extention,
          type: this.doc.type,
          parent: this.doc.parent.toUpperCase(),
          html: this.doc.html,
          css: this.doc.css,
          js: this.doc.js

        }

        this.$socket.client.emit("properties", content)
      }

      // this.title = ''
      this.$refs.form.resetValidation()

    },

    reset () {
      this.$refs.form.reset()
    },

  }

}
</script>
