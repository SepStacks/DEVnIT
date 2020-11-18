
<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
         Delete Component
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
         compoent will be deleted
        </v-card-title>

        <v-card-text>
  Are you sure you want to delete the {{slug}} component?
  </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            yes
          </v-btn>

           <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            cancel
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
  export default {
      props: {
          slug
      },
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>