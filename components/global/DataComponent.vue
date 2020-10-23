<template>
  <div>
    <CodeBlock
      :sections="sections"
      :html="html"
      :css="css"
      :js="js"
      :height="'100%'"
    />
  </div>
</template>

<script>
//values needs to be dynamically imported somehow based on the values gathered
import { alertHTML, alertCSS, alertJS } from "../../assets/componentSourceCode/Alert.js";
export default {
  data() {
    return {
      height: "100vh",
      html: alertHTML,
      css: alertCSS,
      //js app element should always be definded or else vue code will not work.
      js: alertJS,
      sections: ["template", "style"]
    };
  }
};
</script>

<style lang="scss" scoped></style>
