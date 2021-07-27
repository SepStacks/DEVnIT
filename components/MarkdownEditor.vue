<template>
  <div id="editor">
    <textarea v-model="inputVal"></textarea>
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import marked from 'marked';
import DomPurify from 'dompurify';
// import TurndownService from 'turndown';

export default {
  props: {
    value: {
      default: ''
    },
  },
  // data() {
  //   return {
  //     input: '',
  //   };
  // },
  computed: {
    compiledMarkdown() {
      return DomPurify.sanitize(marked(this.inputVal));
    },
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

  },
};
</script>

<style lang="scss" >
html,
body,
#editor {
  margin: 0;
  height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>