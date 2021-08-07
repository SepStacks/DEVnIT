<template>
  <v-container
    class="px-0"
    fluid
  >
    <v-radio-group v-model="radioGroup">
      <v-radio
        v-for="(radio, i) in items"
        :key="i"
        :label="radio"
        :value="radio"
      ></v-radio>
    </v-radio-group>
  </v-container>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        default: () => ['Admin', 'TRM-CLIENT', 'USER']
      }
    },
    data () {
      return {
        radioGroup: 1
      }
    },
  }
</script>



