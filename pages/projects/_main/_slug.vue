<template>
  <v-app>
    <div id="app">
      <!-- side-bar -->
      <SideNav :categories="categories" />

      <v-main>
        <v-container width="1000px">
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <div v-if="doc.type === 'component'">
                <Dialog
                  @click="deleteSlug"
                  @loading="loading"
                  :doc="doc"
                  v-model="dialog"
                />
              </div>

              <div v-else>
                <nuxt-link :to="`/create_update/${doc.parent}`">
                  <v-btn>edit Project</v-btn>
                </nuxt-link>
                <v-btn @click="show = true">Delete Project</v-btn>

                <Dialog
                  @click="deleteProject"
                  @loading="loading"
                  :doc="doc"
                  v-model="show"
                />
              </div>
              <nuxt-content :document="doc" ref="nuxtContent" />

              <!-- add nested page here -->
              <div v-if="doc.type === 'component'">
                <nuxt-child keep-alive />
              </div>

              <div>Last updated: {{ doc.updatedAt }}</div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <!-- table of content -->
      <Toc :doc="doc" /> -->
    </div>
  </v-app>
</template>

<script>
import SideNav from '~/components/navigation/SideNav';
import Toc from '~/components/navigation/Toc';
import Dialog from '~/components/Dialog';
import { groupBy } from 'lodash';

export default {
  components: { SideNav, Toc, Dialog },
  // layout: "navigation",

  async asyncData({ $content, params }) {
    // Avoid re-fetching in production
    if (process.dev === false && categories) {
      return;
    }
    const slug = params.slug;
    const main = params.main;
    const doc = await $content(`projects/${main}/${slug}`).fetch();
    const nav = await $content(`projects/${main}`)
      .only(['title', 'menuTitle', 'category', 'slug', 'version'])
      //Set the order of the components thats underneath the headings
      .sortBy('position', 'asc')

      .fetch()

      .catch((err) => {
        error({
          statusCode: 404,
          message: 'pages not found',
        });
      });
    const categories = groupBy(nav, 'category');

    return {
      doc,
      nav,
      categories,
      dialog: false,
      loading: false,
    };
  },
  data() {
    return {
      show: false,
    };
  },

  computed: {
    nuxtContent() {
      return this.$refs.nuxtContent;
    },
    projectParent() {
      //get parent name of project from its dir and remove project path and inject into nuxt-link
      return this.doc.dir.replace('/projects/', '');
    },
  },

  methods: {
    deleteProject() {
      //add loading here within settimeout function
      this.loading = true;
      const content = this.doc;

      console.log(content);
      //return to selected project route
      this.$router.push('/projects');

      this.$socket.client.emit('deleteProperty', {
        content,
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);

      console.log('Yay, Ive been called!');
    },
    deleteSlug() {
      //add loading here within settimeout function
      this.loading = true;
      const content = this.doc;

      console.log(content);
      //return to selected project route
      this.$router.push(`/projects`);

      this.$socket.client.emit('deleteProperty', {
        content,
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);

      console.log('Yay, Ive been called!');
    },
  },
};
</script>

<style>
.nuxt-content h2 {
  font-weight: bold;
  font-size: 28px;
}

.nuxt-content h3 {
  font-weight: bold;
  font-size: 22px;
}

.nuxt-content p {
  margin-bottom: 20px;
}
</style>
