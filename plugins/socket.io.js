import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io-extended'

export default ({ store }) => {
  //the url needs to be in an env variable
  Vue.use(VueSocketIO, io(process.env.WS_URL), {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10}, { store })
  console.log("Some Address:", process.env.WS_URL)

}