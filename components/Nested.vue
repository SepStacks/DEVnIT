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
    hello from nested component
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: [],
    };
  },
  async fetch({$content, params}) {
    this.docs = await $content(`projects/${main}/${slug}/child`, {
      deep: true,
    }).fetch();
    // console.log(params);
    console.log('content here', this.docs);
  },
  // props: {
  //   doc: {
  //     required: true,
  //   },
  // },
};
</script>

