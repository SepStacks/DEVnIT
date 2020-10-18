<template>
<div>
    landing page
    <v-btn to="projects">go to projects</v-btn>

    <v-btn @click="post">Click here</v-btn>

      <SocketNotification/>

</div>
</template>

<script>
export default {

    methods: {
        post() {
            this.$axios.post('/_content/projects', {

                    body: Object,
                    title: "Introduction",
                    description: "Learn how to use @nuxt/content.",
                    dir: true,
                    extension: ".md",
                    path: "/index",
                    slug: "index",
                    toc: Array

                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
