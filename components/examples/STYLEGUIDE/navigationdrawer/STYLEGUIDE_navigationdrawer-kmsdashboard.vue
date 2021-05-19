<template>
  <div>
    <v-card width="270" height="600" class="mx-auto" id="component-container">
      <v-navigation-drawer
        width="270px"
        dark
        src="/img/content_bg.svg"
        permanent
        absolute
        class="elevation-10"
        v-model="drawer"
        fixed
        color="tertiary"
        floating
      >
        <v-row dense align="center">
          <v-col>
            <v-card color="transparent" flat height="100" tile>
              <v-container fill-height>
                <v-row justify="center">
                  <v-col class="d-flex justify-end">
                    <div v-if="$vuetify.breakpoint.mdAndDown">
                      <v-spacer />
                      <v-btn text small fab @click.stop="drawer = !drawer">
                        <v-icon>la-close</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row
                  justify="center"
                  align="center"
                  :class="$vuetify.breakpoint.mdAndDown ? '' : 'mt-3'"
                >
                  <v-col cols="6" class="d-flex justify-center" align-center>
                    <!-- Logo goes here -->
                    <img
                      src="/img/KMS_logo_light.svg"
                      lazy-src="/img/KMS_logo_light.svg"
                      width="100%"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row
          :class="$vuetify.breakpoint.mdAndDown ? 'mt-16' : ''"
          class="mt-8"
          dense
          align="center"
          justify="center"
        >
        </v-row>

        <v-row dense align="center">
          <v-col>
            <ItemList :items="items" />
          </v-col>
        </v-row>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
import ItemList from '../itemlist/STYLEGUIDE_itemlist-kmsitemlist';
export default {
  components: {
    ItemList,
  },
  data() {
    return {
      dialog: false,
      drawer: false,
      items: [
        {
          text: 'Dashboard',
          icon: 'mdi-view-dashboard',
        },
        {
          text: 'Users',
          icon: 'la-user-alt',
          children: [
            {
              text: 'New User',
              icon: 'la-user-add',
            },
               {
              text: 'New User edit',
              icon: 'la-user-edit',
            },
               {
              text: 'New delete',
              icon: 'la-user-tash',
            },
          ],
        },
        {
          text: 'Estate',
          icon: 'las la-desktop',
        },
        {
          text: 'Global Content',
          icon: 'las la-globe',
        },
        {
          text: 'Reports',
          icon: 'la-wpforms',
        },
      ],
    };
  },
};
</script>



