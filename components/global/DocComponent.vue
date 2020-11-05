<template>
  <div>
    <!-- attach to markdown with slug as its file and name properties -->
    <CodeContainer :file="file" :name="file"/>
  </div>
</template>

<script>
export default {

  props: {
    file: {
      type: String
    }
  },
}






</script>

