<template>
  <div>
    <v-app-bar app>

    </v-app-bar>

    <v-navigation-drawer
      permanent
      app
      clipped
    >
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
<v-list nav dense>
<div v-for="(header, index) in Object.keys(headers)" :key="index">
  <div class="font-weight-bold">{{ header }}</div>

  <v-list-item v-for="(slug, innerIndex) in headers[header]" :key="innerIndex" :to="slug">
    {{ slug === 'index' ? 'Installation' : slug }}

  </v-list-item>
</div>
</v-list>
      <!-- <v-list nav>
        <v-list-item
          v-for="menu in headers"
          :key="menu.slug"
          :to="menu.path"
        >


          <v-list-item-content>
            <v-list-item-title>   <div>}</div></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
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

  computed: {


    headers () {


      let ar = []

      this.menus.forEach(el => {

        ar.push({
          title: el.title,
          path: el.path,
          slug: el.slug,
          header: el.slug === 'index' ? 'Getting Started'
            : el.slug === 'commits' ? 'Gitlab Commits' : "Components"
        })
      })


      return ar.reduce((header, group) => {
        if (header.hasOwnProperty(group.header) && Array.isArray(header[group.header])) {
          header[group.header].push(group.slug)
        } else {
          Object.assign(header, { [group.header]: [group.slug] })
        }
        return header
      }, {})


    }
  }
};
</script>
