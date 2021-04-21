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
    <nuxt-content :document="docs[0]" ref="nuxtContent" />
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
  async fetch() {
    this.docs = await this.$content(`projects/SEPKITT/child`, {
      deep: true,
    }).fetch();
    console.log(this.docs);
    console.log('content here', this.$content);
  },
  // props: {
  //   doc: {
  //     required: true,
  //   },
  // },
};
</script>

