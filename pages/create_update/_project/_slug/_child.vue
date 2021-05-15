<template>
  <div>
    <!-- Primary Component Edit Page-->
    Child component is here
    <LazyMainForm
      :projects="projectTitle"
      :doc="getDoc"
      :showRadio="false"
      :mode="'edit'"
      :parentComponents="parentComponents"
    />
    {{ getDoc }}
  </div>
</template>

<script>
export default {
  // components: {
  //   MainForm,
  // },
  // List the projects directory items
  async asyncData({ $content, params, error }) {
    const projects = await $content({ deep: true })
      .only(['title', 'slug', 'parent', 'category'])
      .where({ type: 'project' })
      .fetch();
    const parentComponents = await $content({ deep: true })
      .only(['title', 'slug', 'parent', 'type'])
      .where({ type: 'component' })
      .fetch();
    //import a child.md file here to get the values (wip)
    //Get current slug
    const slugData = await $content({ deep: true })
      //get all nested components
      .where({ type: 'childComponent', prefix: params.slug })
      .fetch();
    return {
      slugData,
      projects,
      parentComponents,
      pen: undefined,
      test: 'testings',
    };
  },

  computed: {
    //Import vue file as string and nest it into text field

    getDoc() {
      const nestedComponents = this.slugData;
      //textarea
      console.log('params', this.$route.params);
      const childTitle = this.$route.params.child;
      const parent = this.$route.params.project;
      const parentComponent = this.$route.params.slug;
      //filter through the nestedComponents array and return the current childComponent
      const getChild = nestedComponents
        .filter((item) => item.slug === childTitle)
        .map((child) => {
          console.log({ child });
          const doc = {
            //Build an object for the child-components
            title: child.title,
            description: child.description,
            slug: child.menuTitle,
            extention: '.md',
            type: child.type,
            parentComponent: parentComponent,
            parent: parent,
            html: this.pen ? this.pen.template : '',
            css: this.pen ? this.pen.style : '',
            js: this.pen ? this.pen.script : '',
          };
          return doc;
        });
      console.log({ getChild });
      return getChild[0];
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

    // contentArray() {
    //   //Get the component name of all projects and remove any null values
    //   const slug = this.projects
    //     .map((project) => project)
    //     .filter((el) => {
    //       return el;
    //     });
    //   return slug;
    // },
  },
  methods: {
    //Import vue file as string
    async importTemplate() {
     
      try {
        const template = await import(
          // raw-loader is a loader for webpack that allows importing files as a String.
          `!raw-loader!~/components/examples/${this.getDoc.parent}/${this.getDoc.parentComponent}/${this.getDoc.parent}_${this.getDoc.parentComponent}-${this.getDoc.title}.vue`
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
''
