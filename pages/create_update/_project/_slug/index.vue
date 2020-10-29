<template>
<div>
    {{$route.params}}
    {{slugData.type}}
   <v-row justify="center" align="center">

        <MainForm :projects="projectTitle" :content="contentArray" :doc="slugData" :showRadio="false"/>
   </v-row>
</div>
</template>

<script>
export default {

    // List the projects directory items
    async asyncData({
        $content,
        params,
        error
    }) {
        // const menus = await $content({ deep: true }).fetch();
        const projects = await $content('projects', { deep: true })
        .only(['title', 'slug', 'parent'])
        .fetch()

        const slug = `${params.project}/${params.slug}`
        //Get current slug
        const slugData = await $content(`projects/${slug}`)
        .fetch()

        return {
            projects,
            slugData
        };
    },
    data() {
        return {

        }
    },

    computed: {
        getDoc() {
            //FInd a way to turn this into an object similar to its create counterpart

            // return this.slugData.filter(data => {
            //     console.log(data)
            // })

        },
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

        },

        // getCurrent() {

        //     const check = this.content.filter(data => data.parent === this.doc.parent.toUpperCase() && data.slug === this.doc.slug.toLowerCase())
        //     return check.length === 1
        // }
    }
}
</script>

<style lang="scss" scoped>

</style>
