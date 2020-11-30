<template>
  <v-app >
        <Snackbar/>

    <nuxt/>
  </v-app>
</template>

<script>
  export default {
 sockets: {

    // Fired when the socket connects.
    connect () {
      this.isConnected = true
      console.log('NODE-SERVER is connected')

    },
    disconnect () {
      this.isConnected = false
    },
    output (data) {
      // This method was fired by the node-server. eg: io.emit("output", content)'
      return this.$notifier.showMessage({
        content: 'new ' + `<strong>${data.type}</strong>` + ' has been created',
        color: "success",
      })

    },

  },

  }
</script>

<style lang="scss" scoped>

</style>