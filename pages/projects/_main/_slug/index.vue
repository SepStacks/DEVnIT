<template>
  <div>
    <!-- use the nuxtcontent component to display the specific component -->
    <!-- <nuxt-content :document="doc" ref="nuxtContent" /> -->
    <!-- <div>
        title
    </div>

    <div>descripion</div>
        <CodeContainer :file="file" :name="name" /> -->
    <!-- {{ doc }} -->
    <nuxt-content :document="docs" ref="nuxtContent" />
    {{ docs }}
    hello from nested page
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    // Avoid re-fetching in production
    // if (process.dev === false && categories) {
    //   return;
    // }
    const slug = params.slug;
    const main = params.main;

    const docs = await $content(`/projects/PLEASEWORK/child`, {
      deep: true,
    })
      //Set the order of the components thats underneath the headings

      .fetch();

    // .catch((err) => {
    //   error({
    //     statusCode: 404,
    //     message: 'pages not found',
    //   });
    // });
    return {
      docs,
    };
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

