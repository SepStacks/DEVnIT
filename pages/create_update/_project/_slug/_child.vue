<template>
  <div>
    <!-- Primary Component Edit Page-->
    Child component is here
    <MainForm
      :projects="projectTitle"
      :content="contentArray"
      :doc="getDoc"
      :showRadio="false"
      :mode="'edit'"
    />
    {{ getDoc }}
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
      .where({ type: 'project' })
      .fetch();
    //import a child.md file here to get the values (wip)
    const slug = `${params.project}/${params.slug}`;
    //Get current slug
    const slugData = await $content({ deep: true })
    //get all nested components
      .where({ type: 'childComponent', prefix: params.slug })

      .fetch();
    console.log({ slugData });
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
      const nestedComponents = this.slugData;
      //textarea
      console.log('params', this.$route.params)
      const childTitle = this.$route.params.child;
      const parent = this.$route.params.project;
      const parentComponent = this.$route.params.slug;
      //filter through the nestedComponents array and return the current childComponent
      const getChild = nestedComponents
        .filter((item) => item.slug === childTitle)
        .map((child) => {
          const doc = {
            //Build an object for the child-components
            title: childTitle,
            description: child.description,
            slug: childTitle,
            extention: '.md',
            type: child.type,
            parentComponent: parentComponent,
            parent: this.slugData.parent,
            html: this.pen ? this.pen.template : '',
            css: this.pen ? this.pen.style : '',
            js: this.pen ? this.pen.script : '',
          };
          return doc;
        });
      console.log({getChild});
      // return getChild[0];
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
      const childTitle = this.$route.params.child;
      const parent = this.$route.params.project;
      const ParentComponent = this.$route.params.slug;
      try {
        const template = await import(
          // raw-loader is a loader for webpack that allows importing files as a String.
          `!raw-loader!~/components/examples/${parent}/${ParentComponent}/${parent}_${ParentComponent}-${childTitle}.vue`
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

