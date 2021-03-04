<template>
  <v-app>
    <div id="app">

      <!-- side-bar -->
      <SideNav :menus="nav" />




      <v-main>
        <v-container max-width="500px">
          <v-row justify="center">

            <v-col
              cols="11"
              md="8"
              lg="6"
            >

              <div v-if="doc.type === 'component'">
                <nuxt-link :to="`/create_update/${projectParent}/${doc.slug}`">
                  <v-btn>edit component {{doc.slug}}</v-btn>
                </nuxt-link>

                <Dialog
                  @click="deleteSlug"
                  @loading="loading"
                  :doc="doc"
                  v-model="dialog"
                />
              </div>

              <div v-else>
                <nuxt-link :to="`/create_update/${doc.parent}`">
                  <v-btn>edit Project</v-btn>

                </nuxt-link>
                <Dialog
                  @click="deleteProject"
                  @loading="loading"
                  :doc="doc"
                  v-model="dialog"
                />

              </div>

              <nuxt-content :document="doc" ref="nuxtContent"/>
              <v-row>
                <v-col cols="12">

                  <div>
                    Last updated: {{doc.updatedAt}}
                  </div>
                </v-col>
              </v-row>

            </v-col>

          </v-row>

        </v-container>
      </v-main>
      <!-- table of content -->
      <Toc :doc="doc"/>
    </div>
  </v-app>
</template>

<script>
  import SideNav from '~/components/navigation/SideNav'
    import Toc from '~/components/navigation/Toc'
    import Dialog from '~/components/Dialog'


export default {
  components: { SideNav, Toc, Dialog},
  // layout: "navigation",

  async asyncData ({
    $content,
    params
  }) {
    const slug = params.slug
    const main = params.main
    const doc = await $content(`projects/${main}/${slug}`).fetch()

    const nav = await $content(`projects/${main}`)
      .only(["title", "slug", 'category'])
      //Set the order of the components thats underneath the headings
      .sortBy('title')
      .fetch()

      .catch(err => {
        error({
          statusCode: 404,
          message: "pages not found"
        })
      })

    return {
      doc,
      nav,
      dialog: false,
      loading: false,


    }
  },


  computed: {
    nuxtContent() {
      return  this.$refs.nuxtContent
    },
    projectParent () {
      //get parent name of project from its dir and remove project path and inject into nuxt-link
      return this.doc.dir.replace("/projects/", '')
    }
  },
  methods: {
    deleteProject () {
      //add loading here within settimeout function
      this.loading = true
      const content = this.doc

      console.log(content)
      //return to selected project route
      this.$router.push('/projects')

      this.$socket.client.emit("deleteProperty", {
        content
      })
      setTimeout(() => {
        this.loading = false

      }, 500)

      console.log('Yay, Ive been called!')

    },
    deleteSlug () {
      //add loading here within settimeout function
      this.loading = true
      const content = this.doc

      console.log(content)
      //return to selected project route
      this.$router.push(`/projects`)

      this.$socket.client.emit("deleteProperty", {
        content
      })
      setTimeout(() => {
        this.loading = false

      }, 500)

      console.log('Yay, Ive been called!')
    }
  },


};
</script>

<style>
.nuxt-content h2 {
  font-weight: bold;
  font-size: 28px;
}

.nuxt-content h3 {
  font-weight: bold;
  font-size: 22px;
}

.nuxt-content p {
  margin-bottom: 20px;
}
</style>
