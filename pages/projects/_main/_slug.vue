<template>
  <div>
    <!-- side-bar -->
    <SideNav :menus="nav"/>

   <v-main>
    <v-container max-width="500px">

      <v-row justify="center">

          <v-col cols="11" md="8"  lg="6">
             <nuxt-content :document="doc" />
          </v-col>

      </v-row>

    </v-container>
   </v-main>
  </div>
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
