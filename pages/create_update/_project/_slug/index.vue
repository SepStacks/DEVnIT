<template>
  <div>
    <!-- Primary Component Edit Page-->

    <LazyMainForm
      :projects="projects"
      :doc="getDoc"
      :showRadio="false"
      :mode="'edit'"
    />
  </div>
</template>

<script>
// import MainForm from '~/components/MainForm';

export default {

  // List the projects directory items
  async asyncData({ $content, params, error }) {
    // const menus = await $content({ deep: true }).fetch();

    const slug = `${params.project}/${params.slug}`;
    //Get current slug
    const slugData = await $content(`projects/${slug}`, { deep: true }).fetch();
    // console.log({slugData})
    return {
      slugData,
      pen: undefined,
      test: 'testings',
    };
  },

  computed: {
    //Import vue file as string and nest it into text field

    getDoc() {
      const doc = {
        slug: this.slugData.slug,
        description: this.slugData.description,
        extention: '.md',
        type: this.slugData.type,
        parent: this.slugData.parent,
        html: this.pen ? this.pen.template : '',
        css: this.pen ? this.pen.style : '',
        js: this.pen ? this.pen.script : '',
      };
      console.log({ doc });
      return doc;
    },
  },
  methods: {
    //Import vue file as string
    async importTemplate() {
      try {
        // const suffix =
        //   this.getDoc.type === 'component' ? 'usage' : this.getDoc.suffix;
        const template = await import(
          // raw-loader is a loader for webpack that allows importing files as a String.
          `!raw-loader!~/components/examples/${this.getDoc.parent}/${this.getDoc.slug}/${this.getDoc.parent}_${this.getDoc.slug}-usage.vue`
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
