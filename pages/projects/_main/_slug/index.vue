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
    //do a check to see if project/components has nested children
    if (slug !== 'index') {
      //get all items and only return those that matches
      const docs = await $content({ deep: true })
       //display nested components based on their type and their parent
        .where({ type: 'childComponent', prefix: params.slug })
        .fetch();
      console.log({ docs });

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

