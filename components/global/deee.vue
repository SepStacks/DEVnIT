<template>
  <div>
    <CodeBlock
      :sections="sections"
      :html="html"
      :css="css"
      :js="js"
      :name="name"
      :height="'100%'"
    />

  </div>

</template>

<script>

// Import dynamic path
import { html, css, js } from "../../assets/compSourceCode/deee";



export default {

  data() {
    return {
    componentName : '',
      height: "100vh",
      html: html,
      css: css,
      //js app element should always be definded or else vue code will not work.
      js: js,
      name: "deee",

      //attach a condition to only show certain elements if it has markup
      sections: ["template", "style", "script"]    };
  },

  


}






</script>

