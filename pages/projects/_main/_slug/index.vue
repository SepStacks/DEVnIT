<template>
  <div>
    <div v-for="doc in docs" :key="doc.slug">
      {{ doc.slug }}
      <nuxt-content :document="doc" ref="nuxtContent" />
    </div>
    asdasd
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, route }) {
    const slug = params.slug;
    const main = params.main;
    console.log({ params });
    if (slug !== 'index') {
      const docs = await $content(`/projects/${main}/child/${slug}`)
        //Set the order of the components thats underneath the headings
        .where({ type: 'childComponent' })
        .fetch();

      return {
        docs,
      };
    }
  },
  // async fetch({$content, params}) {
  //   this.docs = await $content(`projects/${main}/${slug}/child`, {
  //     deep: true,
  //   }).fetch();
  //   // console.log(params);
  //   console.log('content here', this.docs);
  // },
  // props: {
  //   doc: {
  //     required: true,
  //   },
  // },
};
</script>

