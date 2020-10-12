<template>
  <div>
      hii
         <nuxt-content :document="doc" />


  </div>
</template>

<script>
  export default {
    layout: 'navigation',
  // async asyncData({ $content, params, error }) {
  //   const slug = params.slug;
  //   console.log(slug)
  //   const pages = await $content('projects/' + slug).fetch()

  //     .catch(err => {
  //       error({ statusCode: 404, message: "pages not found" });
  //     });

  //   return {
  //     pages
  //   };
  // },
   async asyncData({$content, params}) {
     const slug = params.slug;
     const main = params.main
    const doc = await $content(`projects/${main}/${slug}`).fetch();
    return { doc }
  }

  }
</script>

<style >

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