<template>
<div>
    <iframe :srcdoc="resultIFrameHtml" width="100%" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';" frameborder="0" scrolling="no" />
</div>
</template>

<script>
let vue = '/js/vue.min.js'
let vuetifyCSS = '/css/vuetify.min.css'
let lineIcons = '/css/line-awesome-font-awesome.min.css'
let vuetifyJS = '/js/vuetify.min.js'
let mainCSS = '/css/mainCSS.css'

export default {

    props: {

        height: {
            type: [Number, String]
        },
        html: {
            type: String,
            required: true
        },
        js: {
            type: String,
            required: true
        },
        css: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showResult: true
        };
    },

    computed: {

        resultIFrameHtml() {

            return `
        <!DOCTYPE html>
        <body>
        <div id="app">
         <v-app>
            <v-main>
             <v-container fill-height>
             <v-row justify="center" align="center">
                <v-col cols="12">
                  ${this.html}
                </v-col>
             </v-row></v-container>
            </v-main>
          </v-app>
        </div>

          <script src="${vue}"><\/script>
          <link href="${vuetifyCSS}" rel="stylesheet">
          <link rel="stylesheet" href="${mainCSS}">
          <link rel="stylesheet" href="${lineIcons}">
          <script src="${vuetifyJS}"><\/script>
          <script>
            ${this.js}
          <\/script>

          <style>
            ${this.css}

          <\/style>

          <style>
            html {
               overflow-y: auto !important;
               height: auto !important;
            }

            .theme--light.application {
            background: #fff !important;
            }

            <\/style>
        </body>
      `;
            // iframe.name = this.name
            return iframe.outerHTML;
        }
    }
};
</script>

<style >

</style>
