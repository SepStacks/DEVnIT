<template>

    <v-navigation-drawer permanent app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            TechNotes
          </v-list-item-title>
          <v-list-item-subtitle>
            @Jermaine Sepkitt
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list

        nav
      >
        <v-list-item
        nuxt
        v-for="menu in menus"
        :key="menu.slug"
        :to="menu.path"
        >


          <v-list-item-content>
            <v-list-item-title>{{ menu.slug }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
  props: {
      menus: {
          type: Array
      }
  }
  }
</script>