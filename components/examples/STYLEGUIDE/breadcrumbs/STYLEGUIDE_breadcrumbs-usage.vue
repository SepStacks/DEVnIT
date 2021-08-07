<template>
  <div>
  <v-container>
  <v-card class="cardshadow">
     <div class="pa-2">
    <v-breadcrumbs large :items="items">
       <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
</v-breadcrumbs>
</div>

  </v-card>
  </v-container>
  
  </div>
</template>

<script>
  export default {
    data: () => ({
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
    }),
  }
</script>

<style>
.cardshadow {
  /* Add shadows to create the "card" effect */
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2) !important;
}
</style>

