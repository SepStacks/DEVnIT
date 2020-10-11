<template>
  <div>

    <v-row justify="center" align="center">

        <h2 class="text-center">Projects</h2>

        <v-col cols="12">
          <v-row justify="center">

            <div v-for="menu of menus" :key="menu.id">

             <v-btn v-if="menu.title" :to="menu.dir">{{menu.title}}</v-btn>
          <!-- <NuxtLink :to="menu.path">{{ menu.slug }}</NuxtLink> -->
        </div>

          </v-row>
        </v-col>

    </v-row>

  </div>
</template>

<script>
  export default {
      // List the projects directory items
  async asyncData({ $content, params, error }) {
    // const menus = await $content({ deep: true }).fetch();
    const menus = await $content('projects' || "index", {
        deep: true
    })
      .fetch()

      .catch(err => {
        error({ statusCode: 404, message: "Page not found" });
      });

    return {
    //   projects,
      menus
    };
  },

  computed: {

  },
  created() {
  }}
</script>

<style lang="scss" scoped>

</style>