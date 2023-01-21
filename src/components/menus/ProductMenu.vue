<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-menu :offset="[50, 10]">
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>:offset="[50, 10]"</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>:offset="[50, 10]"</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    return {};
  },
};
</script>
