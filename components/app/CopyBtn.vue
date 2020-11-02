<template>
<div>
      <button ref="copy" class="copy">
    <v-icon v-if="state === 'copied'" class="w-5 h-5" v-text="'la-home'" tag="i" >la-home</v-icon>
    <v-icon v-else class="w-5 h-5" />
  </button>
</div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  data () {
    return {
      state: 'init'
    }
  },
  mounted () {
    const copyCode = new Clipboard(this.$refs.copy, {
      target (trigger) {
        return trigger.previousElementSibling
      }
    })
    copyCode.on('success', (event) => {
      event.clearSelection()
      this.state = 'copied'
      window.setTimeout(() => {
        this.state = 'init'
      }, 2000)
    })
  }
}
</script>