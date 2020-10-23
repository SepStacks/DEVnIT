export const alertHTML = `
  <v-alert elevation="10" color="white">
    <v-sheet
      color="#536E89"
      elevation="8"
      height="50"
      class="rounded-lg"
      width="50"
      id="snackbarOffset">

      <v-row
        align="center"
        justify="center">

        <v-icon
        color="white"
        class="pa-3"
        size="30">la-home</v-icon>
      </v-row>
    </v-sheet>

    <v-sheet>
    <div class="d-flex align-center ml-5">
      I'm an alert with a top border and red color
    </div>
    </v-sheet>
  </v-alert>

`;

export const alertCSS = `
  #snackbarOffset {
    top: -30px;
    position: relative;
  }
`

export const alertJS = `
const app = new Vue({
  el:'#app',
    vuetify: new Vuetify()
  })


`
