<template>
  <div>
    <v-col
      :class="customClass"
      cols="12"
      :lg="lableLG"
      v-if="lableLG"
    >
      <label
        class="font-weight-bold"
        for="branch"
      >{{ title }}</label>

    </v-col>
    <v-col
      :class="customClass"
      cols="12"
      :md="md"
      :lg="lg"
    >
      <label
        v-if="!lableLG"
        class="font-weight-bold"
        for="branch"
      >{{ title }}</label>
      <v-text-field
        :placeholder="title"
        class="mt-2"
        solo
        hide-details="auto"
        :type="type"
        v-model="inputVal"
        :rules="rules"
        :disabled="disabled"
        :readonly="readonly"
        background-color="tertiary"
        :error-messages="errorMessages"
        :prefix="prefix"
      />
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    prefix: {
      required:false
    },
    customClass: {
      required: false
    },
    value: {
      required: false
    },
    lableLG: {
      required: false
    },
    disabled: {
      required: false
    },
    readonly: {
      required: false
    },
    title: {
      required: true,
      default: 'Placeholder'
    },

    rules: {
      required: false
    },
    errorMessages: {
      required: false
    },
    lg: {
      defaut: "4"
    },
    md: {
      defaut: "6"
    },
    type: {
      required: false,
    }
  },
  computed: {
    inputVal: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit("input", val)
      }
    }
  }
};
</script>



