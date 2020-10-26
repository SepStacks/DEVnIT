<template>
  <div>

    <v-container>
      <v-form
        ref="form"
        v-model="isFormValid"
      >
        <v-radio-group
          v-model="type"
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

        <div v-if="type === 'project'">
          <v-text-field
            v-model="title"
            :rules="rules"
            label="title"
            required
          ></v-text-field>
          <v-text-field
            persistent-hint
            hint="component name for project should always be index"
            readonly
            v-model="slug"
            :value="slug ='index'"
            label="component name"
          ></v-text-field>

          <div class="mt-5 font-weight-bold"> Add installation instructions(optional)</div>

          <!-- <v-text-field v-model="bodytitle" label="Body Title"></v-text-field>
                <v-text-field v-model="bodyDescription" label="Body Description"></v-text-field>

                <v-textarea
                name="input-7-1"
                label="Body Content"
                v-model="bodyContent"
                hint="Hint text">
                </v-textarea> -->

        </div>

        <div v-if="type === 'component'">
          <!-- This items value needs to be exported as a prop and get the project titles array -->
          <v-select
            :items="projects"
            v-model="parent"
            item-text="title"
            label="Select project"
          ></v-select>
          <v-text-field
            v-model="slug"
            label="component name"
          ></v-text-field>

          <v-container>
            <v-textarea
              v-model="html"
              background-color="light-blue"
              color="black"
              label="HTML"
            ></v-textarea>

            <v-textarea
              v-model="css"
              background-color="grey lighten-2"
              color="cyan"
              label="CSS"
            ></v-textarea>

            <v-textarea
              v-model="js"
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
    // markdownTemplate: {
    //     required: false
    // }
  },

  data () {
    return {
      isFormValid: false,
      response: '',
      isConnected: false,
      rules: [
        value => !!value || 'Required.',
        value => !this.checkIfExist || 'Name already exists'
      ],

      title: '',
      slug: '',
      extention: '.md',
      type: "project",
      parent: '',
      html: '',
      css: '',
      js: `const app = new Vue({
          el:'#app',
            vuetify: new Vuetify()
          })`


      // bodyTitle: '',
      // bodyDescription: '',
      // bodyContent: ''

    }
  },

  computed: {
    //check if project title exist

    checkIfExist () {
      return this.projects.includes(this.title)

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

      if (this.type === 'project') {

        const content = {

          title: this.title,
          slug: this.slug,
          extention: this.extention,
          type: this.type,
          parent: this.parent,
          markdownData: `---\ntitle: ${this.title}\n---\n <div v-html="">`,
          // bodyTitle: `# ${this.bodyTitle}`,
          // bodyDescription: this.bodyDescription,
          // bodyContent: this.bodyContent
        }

        this.$socket.client.emit("properties", content)

      } else {

        const content = {

          slug: this.slug,
          extention: this.extention,
          type: this.type,
          parent: this.parent,
          html: this.html,
          css: this.css,
          js: this.js

        }

        this.$socket.client.emit("properties", content)
        console.log(content)
      }

      this.title = ''
      // this.$refs.form.resetValidation()

    },

    reset () {
      this.$refs.form.reset()
    },

  }

}
</script>
