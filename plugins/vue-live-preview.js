import Vue from 'vue'
import VueLivePreview from 'vue-live-preview'

// CodeMirror options
Vue.use(VueLivePreview, {
  theme: 'material',
  tabSize: 2,
  lineNumbers: true,
})