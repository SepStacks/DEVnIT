<template>
<div>

        <MainForm :projects="projectTitle" :content="contentArray"  :doc="doc"/>
</div>
</template>

<script>
// import MainForm  from '~/components/MainForm'
export default {
//   components: {MainForm},

    // List the projects directory items
    async asyncData({
        $content,
        params,
        error
    }) {
        // const menus = await $content({ deep: true }).fetch();
        const projects = await $content('projects', { deep: true })
        .only(['title', 'slug', 'parent', 'category'])
        .fetch()

        return {
            projects,
        };
    },

    data()  {
        return {
            doc: {
            title: '',
            slug: '',
            extention: '.md',
            type: 'project',
            parent: '',
            html: '',
            css: '',
            js: ''
      }
        }
    },

    computed: {
        projectTitle() {
            //Get the tiles of all projects and remove any null values
            const title = this.projects.map(project => project.title).filter(el => {
                return el != null
            })
            return title
        },

        contentArray() {
              //Get the component name of all projects and remove any null values
             const slug = this.projects.map(project => project ).filter(el => {
                return el
            })
            return slug

        }
    }
}
</script>

