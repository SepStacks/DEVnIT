
<template>
  <div class="text-center">
    <v-dialog v-model="show" width="500">

      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ doc.type }} will be deleted
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete the {{ doc.slug }} {{ doc.type }}?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text v-on="{ ...$listeners }"> yes </v-btn>

          <v-btn color="primary" text @click.stop="show = false">
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
    value: Boolean,
    doc: Object

  },
  // This allow me to open and close the modal without any issues
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>