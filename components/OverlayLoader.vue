<template>
    <div>
  <v-overlay :value="show">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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