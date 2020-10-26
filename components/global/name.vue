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

// Import dynamic path
import { html, css, js } from "../../assets/compSourceCode/name";



export default {

  data() {
    return {
    componentName : '',
      height: "100vh",
      html: html,
      css: css,
      //js app element should always be definded or else vue code will not work.
      js: js,
      //attach a condition to only show certain elements if it has markup
      sections: ["template", "style", "script"]    };
  },

   sockets: {

    output (data) {
      // This method was fired by the node-server. eg: io.emit("output", content)'
        // this.componentName =  data.slug
        console.log(data)

    },

  },

  created () {

  //Import Local js file by component name
  //  import('../../assets/compSourceCode/name' ).then(module => {
  //     const {html, css, js} = module
  //     this.html = html
  //       this.css = css
  //         this.js = js
  //  })
}

}






</script>

