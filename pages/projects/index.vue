<template>
<div>

    <v-row justify="center" align="center" v-if="menus.length > 0">

        <h2 class="text-center">Projects</h2>

        <v-col cols="12">
            <v-row justify="center">

                <div v-for="menu of menus" :key="menu.id">

                    <v-btn v-if="menu.title" :to="menu.path">{{menu.title}}</v-btn>
                </div>

            </v-row>
        </v-col>

    </v-row>
    <!-- display if ~content/projects folder is empty -->
    <v-row v-else>
        <v-container>
            <h2>No projects available, please add one</h2>
            <v-btn to="/create_update">add a project</v-btn>
        </v-container>
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
        const menus = await $content('projects' || "index", {
                deep: true
            })
            .fetch()

            .catch(err => {
                error({
                    statusCode: 404,
                    message: "Page not found"
                });
            });

        return {
            //   projects,
            menus
        };
    },

    computed: {

    },
    created() {}
}
</script>

<style lang="scss" scoped>

</style>
