<template>
<TextField v-model="test"/>
</template>

<script>
  import TextField from '~/components/examples/STYLEGUIDE/textfield/STYLEGUIDE_textfield-usage'

export default {
  components: {TextField},
data(){
return {
	test: ''
}}

}
</script>



