<template>
  <div>
    <!-- attach to markdown with slug as its file and name properties -->
    <CodeContainer :file="file" :name="name" />
  </div>
</template>

<script>
import CodeContainer from '~/components/code/CodeContainer';

export default {
  components: { CodeContainer },
  props: {
    file: {
      type: String,
    },
    name: {
      type: String,
  },
  },

};
</script>

