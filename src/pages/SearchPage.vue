<template>
  <q-page class="">
    <main>
      <article>
        <div class="load" v-if="loading">
          <q-skeleton width="90%" height="300px" />
        </div>

        <section
          v-else
          class="section product"
          id="#product"
          aria-label="product"
        >
          <div class="container">
            <div class="title-wrapper">
              <h2 class="h2 section-title">
                Search results for restaurants with "{{ routeParam.query.q }}"
              </h2>
            </div>

            <ul
              v-if="searchResults.restaurantRecords?.length"
              class="food-menu-list"
              data-filter="all"
            >
              <li
                v-for="(restaurant, index) in searchResults.restaurantRecords"
                :key="index"
              >
                <RestaurantCompVue :data="restaurant" />
              </li>
            </ul>
            <div v-else class="empty">
              <img src="/empty.svg" alt="" />

              <div class="empty_text">There's nothing with this name</div>
            </div>
          </div>
          <div class="container">
            <div class="title-wrapper">
              <h2 class="h2 section-title">
                Search results recipes with "{{ routeParam.query.q }}"
              </h2>

              <ul class="filter-btn-list">
                <li class="filter-btn-item"></li>
              </ul>
            </div>

            <ul
              v-if="searchResults.recipeRecords?.length"
              class="food-menu-list"
              data-filter="all"
            >
              <li
                v-for="(recipe, index) in searchResults.recipeRecords"
                :key="index"
              >
                <RecipeCompVue :data="recipe" />
              </li>
            </ul>
            <div v-else class="empty">
              <img src="/empty.svg" alt="" />

              <div class="empty_text">There's nothing with this name</div>
            </div>
          </div>
        </section>
      </article>
    </main>
    <FooterCompVue />
  </q-page>
</template>

<script setup>
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import RecipeCompVue from "src/components/RecipeComp.vue";
import RestaurantCompVue from "src/components/RestaurantsComp.vue";
import FooterCompVue from "src/components/FooterComp.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRouter();
const routeParam = useRoute();
let loading = ref(false);
let searchTerm = ref("");
let searchResults = ref({});
watch(routeParam, (newParams, oldParams) => {
  // Handle the route parameter changes here
  if (newParams.name === "search") {
    searchTerm.value = newParams.query.q || "";
    getsearchResults(searchTerm.value);
  }
});
const getsearchResults = (searchTerm) => {
  loading.value = true;
  api
    .get(`search?text=${searchTerm}?populate=state`)
    .then(({ data }) => {
      searchResults.value = data.payload;
      // console.log(data);
      loading.value = false;
    })
    .catch(({ response }) => {});
};

onMounted(() => {
  searchTerm.value = routeParam.query.q;
  getsearchResults(searchTerm.value || "");
});
</script>

<style lang="scss" scoped>
section.product .container {
  padding: 3rem 0;
}
h2.section-title {
  margin-bottom: 2rem;
}
.filter-btn-item {
  .q-btn {
    padding: 0;
    min-height: auto;
  }
}
</style>
