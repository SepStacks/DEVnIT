<template>
<div>
   <v-row justify="center" align="center">

         <v-btn>Delete Component</v-btn>

        <MainForm :projects="projectTitle" :content="contentArray" :doc="slugData" :showRadio="false" :mode="'edit'"/>

   </v-row>
</div>
</template>

<script>
// import { html, css, js } from "`~/assets/compSourceCode/${slugData.slug}`";
// const {html, css, js} = require(`~/assets/compSourceCode/${getDoc.slug}`)
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

        const slug = `${params.project}/index`
        //Get current slug
        const slugData = await $content(`projects/${slug}`)
        .fetch()

        return {
            projects,
            slugData


        };
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

        },

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


}
</script>

<style lang="scss" scoped>

</style>
