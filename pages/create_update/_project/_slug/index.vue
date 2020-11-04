<template>
<div>
   <v-row justify="center" align="center">

         <v-btn>Delete Component</v-btn>

        <MainForm :projects="projectTitle" :content="contentArray" :doc="getDoc" :showRadio="false" :mode="'edit'"/>

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

            message: 'hello world'

            // slugData: {
            // html: html,
            // css: CSS,
            // js: js

            // }


        }
    },

    computed: {

        getDoc() {
            const doc = {
                   slug: this.slugData.slug,
                        extention: '.md',
                        type:  this.slugData.type,
                        parent: this.slugData.parent,
                        html: this.imports.html,
                        css:this.imports.css,
                        js:this.imports.js
            }

                return doc

                console.log(doc)

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
         imports() {
             //dynamically import js file of component
            //   const {html, css, js} = require(`~/assets/compSourceCode/${this.slugData.slug}`)
            //   return {html, css, js}
        },

        // getCurrent() {

        //     const check = this.content.filter(data => data.parent === this.doc.parent.toUpperCase() && data.slug === this.doc.slug.toLowerCase())
        //     return check.length === 1
        // }
    },
    methods: {

    },
    created() {
        this.imports
        console.log(this.imports)

    }
}
</script>

<style lang="scss" scoped>

</style>
