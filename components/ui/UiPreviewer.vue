<template>
  <div class="preview">
    <div ref="iframe" class="holds-the-iframe"></div>
  </div>
</template>

<script>
import createIframe from '@/utils/iframe';

const sandboxAttributes = [
  'allow-modals',
  'allow-forms',
  'allow-pointer-lock',
  'allow-popups',
  'allow-same-origin',
  'allow-scripts',
];

export default {
  props: ['value'],

  mounted() {
    this.iframe = createIframe({
      el: this.$refs.iframe,
      sandboxAttributes,
    });
  },

  watch: {
    value(val) {
      this.iframe.setHTML(val);
    },
  },
};
</script>

<style scoped>
/* html {
  overflow-y: auto !important;
  height: auto !important;
}

.theme--light.application {
  background: #fff !important;
} */
.preview {
  /* iframe loader */
  background: url('https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')
    center center no-repeat;
  background-color: #fff;
}

</style>

