<template>
  <div>
    <!-- Primary Component Edit Page-->

    <MainForm
      :projects="projectTitle"
      :content="contentArray"
      :doc="getDoc"
      :showRadio="false"
      :mode="'edit'"
    />
  </div>
</template>

<script>
import MainForm from '~/components/MainForm';
export default {
  components: {
    MainForm,
  },
  // List the projects directory items
  async asyncData({ $content, params, error }) {
    // const menus = await $content({ deep: true }).fetch();
    console.log({ params });
    const projects = await $content('projects', {
      deep: true,
    })
      .only(['title', 'slug', 'parent'])
      .fetch();
    //import a child.md file here to get the values (wip)
    const slug = `${params.project}/${params.slug}`;
    //Get current slug
    const slugData = await $content(`projects/${slug}`).fetch();
    // console.log({ slugData });
    return {
      projects,
      slugData,
      pen: undefined,
      test: 'testings',
    };
  },

  computed: {
    //Import vue file as string and nest it into text field

    getDoc() {
      const nestedComponents = this.slugData.children
      console.log({nestedComponents});
      //textarea
      const childTitle = this.$route.params.child;
      //filter through the nestedComponents array and return the current childComponent
      const childComponent = nestedComponents.filter(child => {
        child.title === childTitle
      })
      const doc = {
        //Build an object for the child-components
        title: childTitle,
        slug: this.slugData.slug,
        extention: '.md',
        type: 'childComponents',
        parent: this.slugData.parent,
        html: this.pen ? this.pen.template : '',
        css: this.pen ? this.pen.style : '',
        js: this.pen ? this.pen.script : '',
      };
      console.log(doc);

      return doc;
    },
    projectTitle() {
      //Get the tiles of all projects and remove any null values

      const title = this.projects
        .map((project) => project.title)
        .filter((el) => {
          return el != null;
        });
      return title;
    },

    contentArray() {
      //Get the component name of all projects and remove any null values
      const slug = this.projects
        .map((project) => project)
        .filter((el) => {
          return el;
        });
      return slug;
    },
  },
  methods: {
    //Import vue file as string
    async importTemplate() {
      const child = this.$route.params.child;
      try {
        const template = await import(
          // raw-loader is a loader for webpack that allows importing files as a String.
          `!raw-loader!~/components/examples/${this.getDoc.parent}/${this.getDoc.slug}/${this.getDoc.parent}_${this.getDoc.slug}-${child}.vue`
        );
        this.boot(template.default);
      } catch (err) {
        console.log(err);
      }
    },

    boot(res) {
      //inject values and split it into their seperate groups
      const template = this.parseTemplate('template', res);
      const style = this.parseTemplate('style', res);
      const script = this.parseTemplate('script', res);

      this.pen = {
        template,
        style,
        script,
      };
    },

    parseTemplate(target, template) {
      // Use regex to split strings in its apropriate values and create a template
      const string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`;
      const regex = new RegExp(string, 'g');
      const parsed = regex.exec(template) || [];

      return parsed[1] || '';
    },
  },
  created() {
    this.imports, this.importTemplate();
  },
};
</script>

<style lang="scss" scoped>
</style>
