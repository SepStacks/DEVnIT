<template>
  <v-list flat>
    <template v-for="item in items">
      <v-list-group
        v-if="item.children && item.children.length"
        mandatory
        color="primary"
        :key="item.index"
        v-model="item.active"
      >
        <v-list-item slot="activator" class="pa-0">
          <v-list-item-icon v-if="item.icon">
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <item-list :items="item.children" />
      </v-list-group>

      <div :key="item.index" v-else>
        <v-list-item color="primary" link nuxt :to="item.path">
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'ItemList',
  props: {
    items: {
      type: [Array],
      default: () => [
        {
          text: 'item_1',
          icon: 'la-image',
          children: [
            { text: 'item_1A', icon: 'la-image' },

            { text: 'item_1B', icon: 'la-image' },

            { text: 'item_1C', icon: 'la-image' },
          ],
        },

        { text: 'item_2', icon: 'la-image' },
        { text: 'item_3', icon: 'la-image' },
      ],
    },
  },
};
</script>

<style>
.hide {
  visibility: hidden !important;
}
</style>

