<template>
  <div class="promo-card">
    <h3 class="h3 card-title">{{ data.name }}</h3>

    <p class="card-text">
      {{ data.description }}
    </p>
    <div v-if="route.name === 'restaurants'" class="text-center q-mb-md">
      <small class=" ">State: {{ data.state.name }}</small>
    </div>

    <img
      :src="data.logo ? data.logo : '/cutlery.png'"
      width="300"
      height="300"
      loading="lazy"
      :alt="data.name"
      class="w-100 card-banner"
    />
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();
let props = defineProps({
  data: Object,
});

const { data } = toRefs(props);
</script>

<style lang="scss" scoped></style>
