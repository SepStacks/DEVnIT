<template>
<v-row justify="center" align="center">
    <div>

           <v-row justify="center" align="center">
                <v-icon color="primary" size="200">la-pencil-alt</v-icon>
           </v-row>

        <h1 class="accent--text text-center">DEVnIT</h1>

        <p class=" mt-3 title text-center">Documentation Solution Created through the UI</p>
        <p class="  text-center">Project is just a test to play around with creating .md files through the UI and does not contain the full solution</p>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"  to="projects">projects</v-btn>

            <v-btn to="/create_update">Create </v-btn>
            <v-spacer></v-spacer>

        </v-card-actions>

        <div class="mt-5 caption font-weight-bold text-center">SEPSTACKS</div>

    </div>
</v-row>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
