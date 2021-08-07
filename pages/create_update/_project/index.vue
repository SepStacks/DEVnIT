<template>
  <div>
    Edit project
    <LazyMainForm
      :projects="projectTitle"
      :doc="slugData"
      :showRadio="false"
      :mode="'edit'"
    />
  </div>
</template>

<script>
// import { html, css, js } from "`~/assets/compSourceCode/${slugData.slug}`";
// const {html, css, js} = require(`~/assets/compSourceCode/${getDoc.slug}`)
// import MainForm from '~/components/MainForm';
// import content from "~/mixins/contentProperties.js"

export default {
  // components: { MainForm },
  // mixins: [content],
  // List the projects directory items

  async asyncData({ $content, params, error }) {
    const projects = await $content({ deep: true })
      // .only(['title', 'slug', 'parent', 'category', 'contentBody'])
      .where({ type: 'project' })
      .fetch();
    const parentComponents = await $content({ deep: true })
      .only(['title', 'slug', 'parent', 'type'])
      .where({ type: 'component' })
      .fetch();
    // const menus = await $content({ deep: true }).fetch();
    const slug = `${params.project}/index`;
    //Get current slug
    const slugData = await $content(`projects/${slug}`).fetch();
    return {
      projects,
      parentComponents,
      slugData,
    };
  },

  computed: {
    projectTitle() {
      //Get the tiles of all projects and remove any null values
      const title = this.projects
        .map((project) => {
          project.title, project.slug;
        })
        .filter((el) => {
          return el != null;
        });
      return title;
    },
    // contentArray() {
    // //Get the component name of all projects and remove any null values
    // const slug = this.projects
    //   .map((project) => project)
    //   .filter((el) => {
    //     return el;
    //   });
    // return slug;
    // },
    //     getDoc() {
    //         const doc = {
    //                slug: this.slugData.slug,
    //                     extention: '.md',
    //                     type:  this.slugData.type,
    //                     parent: this.slugData.parent,
    //                     html: this.imports.html,
    //                     css:this.imports.css,
    //                     js:this.imports.js
    //         }
    //             return doc
    //             console.log(doc)
    //     },
  },
};
</script>

<style lang="scss" scoped>
</style>
