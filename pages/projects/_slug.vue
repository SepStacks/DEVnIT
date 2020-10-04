<template>
  <div>

    <h1>{{ page }}</h1>
        <article>
            <nuxt-content :document="page" />
        </article>

  </div>
</template>

<script>
  export default {
  async asyncData({ $content, params, error }) {
    const slug = params.slug;
    const page = await $content('projects/', slug ,{ deep: true }).fetch()

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