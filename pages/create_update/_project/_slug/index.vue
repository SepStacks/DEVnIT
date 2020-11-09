<template>
  <div>
    <v-row
      justify="center"
      align="center"
    >
      {{getDoc}}
      <v-btn>Delete Component</v-btn>
      <MainForm
        :projects="projectTitle"
        :content="contentArray"
        :doc="getDoc"
        :showRadio="false"
        :mode="'edit'"
      />

    </v-row>
  </div>
</template>

<script>
export default {

  // List the projects directory items
  async asyncData ({
    $content,
    params,
    error
  }) {
    // const menus = await $content({ deep: true }).fetch();
    const projects = await $content('projects', {
      deep: true
    })
      .only(['title', 'slug', 'parent'])
      .fetch()

    const slug = `${params.project}/${params.slug}`
    //Get current slug
    const slugData = await $content(`projects/${slug}`)
      .fetch()

    return {
      projects,
      slugData

    }
  },

  data () {
    return {
      pen: undefined
    }

  },

  computed: {
    //Import vue file as string and nest it into text field

    getDoc () {
      const doc = {
        slug: this.slugData.slug,
        extention: '.md',
        type: this.slugData.type,
        parent: this.slugData.parent,
        // html: vue.template,
        // css: this.pen.style,
        // js: this.pen.script
      }

      return doc




    },
    projectTitle () {
      //Get the tiles of all projects and remove any null values
      const title = this.projects.map(project => project.title).filter(el => {
        return el != null
      })
      return title
    },

    contentArray () {
      //Get the component name of all projects and remove any null values
      const slug = this.projects.map(project => project).filter(el => {
        return el
      })
      return slug

    },
    imports () {
      //dynamically import js file of component
      //   const {html, css, js} = require(`~/assets/compSourceCode/${this.slugData.slug}`)
      //   return {html, css, js}
    },

    // getCurrent() {

    //     const check = this.content.filter(data => data.parent === this.doc.parent.toUpperCase() && data.slug === this.doc.slug.toLowerCase())
    //     return check.length === 1
    // }
  },
  methods: {
    //Import vue file as string
    async importTemplate () {
      try {
        const template = await import(
          // raw-loader is a loader for webpack that allows importing files as a String.
          `!raw-loader!~/components/examples/${this.getDoc.parent}/${this.getDoc.slug}/${this.getDoc.slug}-usage.vue`

        )

        this.boot(template.default)
      } catch (err) {
        console.log(err)
      }
    },

    boot (res) {
      //inject values and split it into their seperate groups
      const template = this.parseTemplate('template', res)
      const style = this.parseTemplate('style', res)
      const script = this.parseTemplate('script', res)

      this.pen = {
        template,
        style,
        script,
      }
    },

    parseTemplate (target, template) {
      // Use regex to split strings in its apropriate values and create a template
      const string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`
      const regex = new RegExp(string, 'g')
      const parsed = regex.exec(template) || []

      return parsed[1] || ''
    },

  },
  created () {
    this.imports
    console.log(this.imports)
    this.importTemplate()

  }
}
</script>

<style lang="scss" scoped>
</style>
