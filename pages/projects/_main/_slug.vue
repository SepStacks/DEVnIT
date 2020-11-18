<template>
<v-app>
    <div id="app">

    <!-- side-bar -->
    <SideNav :menus="nav"/>

   <v-main>
    <v-container max-width="500px">
      <v-row justify="center">

          <v-col cols="11" md="8"  lg="6">

             <div v-if="doc.type === 'component'">
                <nuxt-link :to="`/create_update/${projectParent}/${doc.slug}`" >
                    <v-btn >edit component {{doc.slug}}</v-btn>
              </nuxt-link>

              <Dialog :slug="doc.slug"/>
             </div>

                 <nuxt-link :to="`/create_update/${doc.parent}`" v-else>
                    <v-btn >edit Project</v-btn>
              </nuxt-link>


             <nuxt-content :document="doc" />
          </v-col>

      </v-row>

    </v-container>
   </v-main>
  </div>
</v-app>
</template>

<script>
export default {
  // layout: "navigation",

  async asyncData({ $content, params }) {
    const slug = params.slug;
    const main = params.main;
    const doc = await $content(`projects/${main}/${slug}`).fetch();

    const nav = await $content(`projects/${main}`)
      .only(["title", "slug"])
      //Set the order of the components thats underneath the headings
      .sortBy('title', 'asc')
      .fetch()

      .catch(err => {
        error({
          statusCode: 404,
          message: "pages not found"
        });
      });

    return {
      doc,
      nav
    };
  },
  computed: {
    projectParent() {
      //get parent name of project from its dir and remove project path and inject into nuxt-link
      return  this.doc.dir.replace("/projects/", '')
    }
  }


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
