<template>
  <div>
    <v-app-bar app clipped-left>
      <v-toolbar-title class="ml-4">
        <div class="font-weight-bold">SepStacks</div>
        <!-- <v-img src="/svg/altron.svg" max-width="50%" /> -->
      </v-toolbar-title>
      <v-spacer />

      <!-- links -->
      <v-card-actions>
        <v-btn text to="/"> home </v-btn>
        <v-btn text to="/projects"> Projects </v-btn>
        <v-btn text to="/create_update"> Create </v-btn>
      </v-card-actions>
    </v-app-bar>
    <v-navigation-drawer permanent app clipped v-model="drawer">
      <div
        class="mt-5"
        v-for="(docs, category, index) in categories"
        :key="category"
        :class="{
          active: isCategoryActive(docs),
          'lg:mb-0': index === Object.keys(categories).length - 1,
        }"
      >
        <p class="mb-2 grey--text font-weight-bold" v-if="category">
          {{ category }}
        </p>

        <ul>
          <!-- Using slice will make a copy of the array which means data.body will not change in value,
            and therefore no re-render will be called. -->
          <li v-for="doc of docs.slice().sort()" :key="doc.slug" link>
            <v-list-item-content>
              <NuxtLink :to="doc.path">
                <v-list-item-title class="active-link mt-3" color="green">
                  {{ doc.menuTitle || doc.title }}
                </v-list-item-title>
              </NuxtLink>
              <client-only>
                <span
                  v-if="isDocumentNew(doc)"
                  class="animate-pulse rounded-full bg-primary-500 opacity-75 h-2 w-2"
                />
              </client-only>
            </v-list-item-content>
          </li>
        </ul>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { sortBy } from 'lodash';
export default {
  props: {
    categories: {
      type: [Array, Object],
    },
    // docs: {
    //   type: [Array, Object],
    // },
  },
  data() {
    return {
      drawer: null,
    };
  },
  methods: {
    isCategoryActive(documents) {
      return documents.some((document) => document.to === this.$route.fullPath);
    },

    isDocumentNew(document) {
      if (process.server) {
        return;
      }
      if (!document.version || document.version <= 0) {
        return;
      }
      const version = localStorage.getItem(`document-${document.slug}-version`);
      if (document.version > Number(version)) {
        return true;
      }
      return false;
    },
  },
  computed: {
    sortedDocs() {
      const list = this.categories;
      console.log(sortBy(list, 'menuTitle'));
      // const result = Object.values(this.categories).map((doc) => {
      //      const index = Object.keys(doc).length - 1
      //       console.log(doc[index])
      // return doc.sort((a, b) => (a.menuTitle > b.menuTitle ? 1 : -1));
      // });
      //   return result
      // return result
      // console.log('result', result);
      // return result

      // .sort((a, b) => (a.menuTitle > b.menuTitle ? 1 : -1));

      // const cat =  this.categories
      // return this.categories

      // .map((item) => {
      //   item.sort((a,b) => a.menuTitle > b.menuTitle ? 1 : -1)
      // })

      // colsole.log(this.cate)
      // console.log(this.categories.filter(e => e.title))
      //  return this.categories.sort((a, b) =>
      //           a.menuTitle > b.menuTitle ? 1 : -1
      //         )
    },
  },
};
</script>
