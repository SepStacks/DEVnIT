<template>
  <v-list shaped>
    <v-list-item-group max="1">
      <template v-for="item in items">
        <v-list-group
          v-model="item.active"
          v-if="item.children && item.children.length"
          :key="item.index"
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

        <v-list-item
          exact
          v-else
          active-class=" white--text"
          :key="item.index"
          link
          :to="item.path"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list-item-group>
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
        },

        {
          text: 'item_2',
          icon: 'la-image',
          children: [
            { text: 'item_1A', icon: 'la-image' },

            { text: 'item_1B', icon: 'la-image' },

            { text: 'item_1C', icon: 'la-image' },
          ],
        },
        { text: 'item_3', icon: 'la-image' },
      ],
    },
  },
  data() {
    return {
      value: 0,
    };
  },
};
</script>



