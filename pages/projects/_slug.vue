<template>
  <div>
     {{page.title}}
    <!-- <h1>{{ page }}</h1> -->

      <div v-for="p in page" :key="p.index">
         <nuxt-content :document="p" />
      </div>


  </div>
</template>

<script>
  export default {
  async asyncData({ $content, params, error }) {
    const slug = params.slug;
    const page = await $content('projects/', slug).fetch()

      .catch(err => {
        error({ statusCode: 404, message: "Page not found" });
      });

    return {
      page
    };
  },
  created() {
  }

  }
</script>

<style lang="scss" scoped>

</style>