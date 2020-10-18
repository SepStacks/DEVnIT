<template>
<div>
    <SocketNotification :projects="projectTitle" />
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
        .only(['title'])
        .fetch()

        return {
            projects
        };
    },

    computed: {
        projectTitle() {
            //Get the tiles of all projects and remove any null values
            const title = this.projects.map(project => project.title).filter(el => {
                return el != null
            })
            return title
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
