<template>
  <div>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <template v-for="(step, i) in steps">
          <v-stepper-step
            :key="`${i + 1}-step`"
            :complete="e1 > i + 1"
            :step="i + 1"
          >
            {{ step.text }}
            {{ step.description }}
          </v-stepper-step>

          <v-divider v-if="(step, i) !== steps" :key="i"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content
          v-for="(step, i) in steps"
          :key="`${i + 1}-content`"
          :step="i + 1"
        >
          <component
            id="dynamic-component"
            :is="step.component"
            v-model="model"
          />
          <v-btn color="primary" @click="nextStep(i + 1)"> Continue </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import textfield from '~/components/examples/STYLEGUIDE/textfield/STYLEGUIDE_textfield-usage';
import radio from '~/components/examples/STYLEGUIDE/radio/STYLEGUIDE_radio-usage';

export default {
  data() {
    return {
      e1: 1,
      model: '',
      steps: [
        { text: 'Firstname', component: textfield },
        { text: 'Surname', component: textfield },
        { text: 'Email', component: textfield },
        { text: 'Password', component: textfield },
        { text: 'Password', component: textfield },
        { text: 'Groups', component: textfield },
        { text: 'Roles', component: radio },
        // { text: 'Privileges', component: radio, items: 'Privileges' }
      ],
    };
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
  },

  methods: {
    nextStep(i) {
      if (i === this.steps.length) {
        this.e1 = 1;
        this.model = '';
      } else {
        this.e1 = i + 1;
        this.model = '';
      }
    },
  },
};
</script>