<template>
  <div>
    <div v-for="doc in docs" :key="doc.slug">
      <nuxt-content :document="doc" ref="nuxtContent" />
    </div>
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

};
</script>

