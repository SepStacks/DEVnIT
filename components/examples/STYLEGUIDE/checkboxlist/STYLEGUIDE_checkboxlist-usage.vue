<template>
  <div>
    <v-list subheader two-line flat>
      <label class="font-weight-bold">{{ title }}</label>

      <v-text-field
        background-color="tertiary"
        solo
        v-model="search"
        :label="'Search ' + title"
        single-line
        hide-details
      >
        <template #prepend-inner>
          <div v-if="$slots['formIconSearch'] ? true : false">
            <slot name="formIconSearch" />
          </div>

          <FormIcon v-else />
        </template>
      </v-text-field>

      <v-list-item-group
        v-model="selectedItems"
        multiple
        style="max-height: 500px"
        class="overflow-y-auto"
      >
        <template v-for="(item, index) in items">
          <v-list-item
            :key="index"
            :value="item.id"
            v-if="description || displayValue"
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active" color="primary"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content v-if="description">
                <v-list-item-title
                  >{{ item[displayValue] }} [{{
                    item[description]
                  }}]</v-list-item-title
                >
              </v-list-item-content>

              <v-list-item-content v-else-if="displayValue">
                <v-list-item-title>{{ item[displayValue] }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-list-item :key="index" :value="item" v-else>
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active" color="primary"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>



<script>
export default {
  props: {
    value: { required: true },
    title: {},
    items: {
      default: () => ['Admin', 'TRM-CLIENT', 'USER'],
    },
    displayValue: {},
    description: {},
  },
  data() {
    return {
      search: '',
    };
  },
  computed: {
    selectedItems: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    filteredItems() {
      if (this.displayValue) {
        return this.items.filter((item) => {
          6;
          return (
            item[this.displayValue].toLowerCase().includes(this.search) ||
            item[this.description].toLowerCase().includes(this.search)
          );
        });
      } else {
        return this.items.filter((item) => {
          return item.toLowerCase().includes(this.search);
        });
      }
    },
  },
  created() {
    // console.log("selected", this.selected)
    // console.log("filteredItems", this.filteredItems)
  },
};
</script>



