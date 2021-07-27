<template>
  <div>
    hello
    <MainForm
      :projects="projectTitle"
      :doc="doc"
      :parentComponents="parentComponents"
    />
  </div>
</template>

<script>
// import MainForm  from '~/components/MainForm'
export default {
  //   components: {MainForm},

  // List the projects directory items
  async asyncData({ $content, params, error }) {
    // const menus = await $content({ deep: true }).fetch();
    const projects = await $content({ deep: true })
      // .only(['title', 'slug', 'parent', 'category'])
      .where({ type: 'project' })
      .fetch();
    const parentComponents = await $content({ deep: true })
      .only(['title', 'slug', 'parent', 'type'])
      .where({ type: 'component' })
      .fetch();
    return {
      projects,
      parentComponents,
    };
  },

  data() {
    return {
      doc: {
        title: '',
        slug: '',
        extention: '.md',
        type: 'project',
        parent: '',
        html: '',
        css: '',
        js: '',
      },
    };
  },

  computed: {
    projectTitle() {
      //Get the tiles of all projects and remove any null values
      const title = this.projects
        .map((project) => project.title)
        .filter((el) => {
          return el != null;
        });
      return title;
    },
  },
};
</script>

