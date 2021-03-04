<template>
  <v-container fill-height>

    <v-row
      justify="center"
      align="center"
    >

      <div v-if="menus.length > 0">

        <h2 class="text-center">Projects</h2>

        <v-col cols="12">
          <v-row justify="center">

            <v-col
              cols="auto"
              v-for="menu of menus"
              :key="menu.id"
              class="text-center"
            >

              <v-card>
                <v-btn
                  class="pa-2"
                  block
                  v-if="menu.title"
                  :to="menu.path"
                >{{menu.title}}</v-btn>
              </v-card>

            </v-col>

          </v-row>
        </v-col>
      </div>

      <!-- display if ~content/projects folder is empty -->
      <div
        v-else id="none">

        <div class="text-center display-2 font-weight-bold secondary--text">No projects available</div>
        <div
          class="mt-2 title font-weight-light text-center info--text"
          style="z-index:15"
        > please add one</div>

        <v-card-actions>
          <v-spacer />
          <v-col>
            <v-btn
              color="accent"
              class="text-center"
              to="/create_update"
            >add a project</v-btn>
          </v-col>
          <v-spacer />
        </v-card-actions>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // List the projects directory items
  async asyncData ({
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
        })
      })

    return {
      menus
    }
  },
}
</script>
