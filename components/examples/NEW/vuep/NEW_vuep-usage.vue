<template>
  <div>
    <h2>Hello {{ msg }}</h2>
    <h3>Demo</h3>
    <ul>
      <li v-for="url in urls">
        <a target="_blank" :href="url">{{ url }}</a>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  data: () => ({
    msg: 'Vuep.run',

    urls: [
      'https://vuep.run/QingWei-Li/vue-trend/docs/home.vue',
      'https://vuep.run/QingWei-Li/vuep.run/examples/element-ui.vue?pkg=element-ui&css=element-ui/lib/theme-chalk/index.css',
      'https://vuep.run/vuetifyjs/vuetifyjs.com/blob/dev/examples/ripples/navigationDrawers.vue?pkg=vuetify&css=vuetify/dist/vuetify.min.css'
    ]
  })
}
</script>

<style>
div {
  color: #2c3e50;
  font-family: Arial, sans-serif;
}

a {
  color: #42b983;
}
</style>

