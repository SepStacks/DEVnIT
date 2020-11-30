<template>
  <div>
    <v-app-bar
      app
      clipped-left
    >

      <v-toolbar-title class="ml-4">
        <div class="font-weight-bold">SepStacks</div>
        <!-- <v-img src="/svg/altron.svg" max-width="50%" /> -->
      </v-toolbar-title>
      <v-spacer />

      <!-- links -->
      <v-card-actions>
        <v-btn
          text
          to="/"
        >
          home
        </v-btn>

        <v-btn
          text
          to="/projects"
        >
          Projects
        </v-btn>
        <v-btn
          text
          to="/create_update"
        >
          Create
        </v-btn>

      </v-card-actions>

    </v-app-bar>

    <v-navigation-drawer
      permanent
      app
      clipped
      v-model="drawer"
    >

      <div
        class="region"
        v-for="category in categories.reverse()"
        :key="category"
      >
        <v-subheader>{{category}}</v-subheader>
        <v-list>

          <v-list-item
            v-for="(doc, i) in subheader(category)"
            :key="i"
            link
          >

            <v-list-item-content>

              <NuxtLink :to="doc.path">

                <v-list-item-title
                  class="active-link mt-3"
                  color="green"
                > {{ doc.slug === "index" ? "Installation" : doc.slug }}</v-list-item-title>

              </NuxtLink>

            </v-list-item-content>

          </v-list-item>
        </v-list>

      </div>

    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array
    }
  },
  data () {
    return {
      drawer: null,

    }
  },
  methods: {
    subheader (category) {
      return this.menus.filter(o => o.category === category)
    },
    displayJson (o) {
      return JSON.stringify(o, null, 2)
    }
  },
  computed: {
    categories () {
      return [...new Set(this.menus.map(o => o.category))]
    },

  }
};
</script>
