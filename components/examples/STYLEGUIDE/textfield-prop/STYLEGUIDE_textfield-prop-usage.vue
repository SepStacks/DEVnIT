<template>
<div>
 <TextField v-model="test" title="Name of User"/>
  <v-row>
  	<div>
  	{{test}}
  </div>
  </v-row>
  </div>
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



