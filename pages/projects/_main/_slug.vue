<template>
  <div>
    <!-- side-bar -->
    <SideNav :menus="nav"/>

   <v-main>
    <v-container fluid>
          {{nav}}
        <nuxt-content :document="doc" />
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
