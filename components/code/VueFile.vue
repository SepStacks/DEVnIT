<template>
  <div>
    <component
    :is="component"
    v-if="component"
    v-bind="{
      ...$attrs,
      ...$props,
    }"
    v-on="$listeners"
  />

  <div v-else>
    <!-- use loader if component hasn't generated yet -->

    <div>loading component, please wait</div>

    <Loader/>

  </div>
  </div>
</template>

<script>
import Loader from '~/components/ui/Loader'
export default {
  components: {Loader},
    name: 'VueFile',
    inheritAttrs: false,
    props: {
      name: {
        type: String
      },
      file: {
        type: String,
        required: true,
      },
    },
    data: () => ({ component: undefined }),
    created () {
      this.load()
    },
    methods: {
      async load () {
        let component = {}
        try {
          component = await import(
            /* webpackChunkName: "examples" */
            /* webpackMode: "lazy-once" */
            `../examples/${this.file}.vue`
          )
          this.$emit('loaded', component.default)
        } catch (err) {
          component = await import('../Missing')
          this.$emit('error', err)
        }
        this.component = component.default
      },
    },
  }
</script>