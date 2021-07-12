<template>
  <client-only>
    <v-sheet outlined>
      <!-- <div ref="iframe"></div> -->
      <v-row v-if="value">
      <v-col cols="12">
          <iframe
          :srcdoc="resultIFrameHtml"
          ref="iframe"
          frameborder="0"
          width="100%"
          height="500vh"
        />
      </v-col>
      </v-row>
      <div v-else>value loading?</div>
    </v-sheet></client-only
  >
</template>

<script>
import createIframe from '@/utils/iframe';

// const sandboxAttributes = [
//   'allow-modals',
//   'allow-forms',
//   'allow-pointer-lock',
//   'allow-popups',
//   'allow-same-origin',
//   'allow-scripts',
// ];

export default {
  props: ['value'],
  data() {
    return {
      height: '300px',
    };
  },

  computed: {
    resultIFrameHtml() {
      return `
        <!DOCTYPE html><html><head>${this.value.head}</head><body style="height:300px">${this.value.body}
        <style>

            .theme--light.application {
            background: #fff !important;
            }

            <\/style>
            </body></html>
      `;
      // iframe.name = this.name
    },
  },
  methods: {},
  mounted() {
    console.log('ref', this.$refs);
  },
  // mounted() {
  //   this.iframe = createIframe({
  //     el: this.$refs.iframe,
  //     sandboxAttributes,
  //   });
  // },

  // watch: {
  //   value(val) {
  //     this.iframe.setHTML(val);
  //   },
  // },
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

/* .panel {
  height: 900px;
} */
</style>

