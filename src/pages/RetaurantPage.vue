<template>
  <q-page class="">
    <main>
      <article>
        <!--
        - #HERO
      -->

        <!--
        - #FOOD MENU
      -->

        <section class="section food-menu" id="food-menu">
          <div class="container">
            <h2 class="h2 section-title">Restaurants</h2>

            <!-- <ul class="fiter-list">
              <li>
                <button class="filter-btn active">Restaurants</button>
              </li>
            </ul> -->

            <div class="load" v-if="loadingAll">
              <q-skeleton width="90%" height="300px" />
            </div>

            <div v-else>
              <div class="">
                <div class="input-wrapper row justify-center">
                  <input
                    type="search"
                    name="search"
                    placeholder="Enter location to see restaurants closest to you..."
                    class="input-field"
                    v-model="searchQuery"
                  />
                </div>
                <ul class="food-menu-list">
                  <li
                    v-for="restaurant in filteredRestaurants"
                    :key="restaurant._id"
                    class="promo-item"
                  >
                    <RestaurantComp :data="restaurant" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
    <FooterComp />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { api } from "src/boot/axios";
import RestaurantComp from "src/components/RestaurantsComp.vue";
import FooterComp from "src/components/FooterComp.vue";
let restaurants = ref([]);
let loadingAll = ref(false);
const searchQuery = ref("");

const filteredRestaurants = computed(() => {
  // Use a case-insensitive search filter
  return restaurants.value.filter((restaurant) =>
    restaurant.state.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});
const getRestaurants = () => {
  loadingAll.value = true;

  api
    .get("restaurants")
    .then((response) => {
      // console.log(response);
      restaurants.value = response.data.payload;
      loadingAll.value = false;
    })
    .catch(({ response }) => {
      // console.log(response);
      loadingAll.value = false;

      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
onMounted(() => {
  getRestaurants();
});
</script>

<style scoped>
.input-wrapper {
  grid-template-columns: 1fr;
  color: black;
  border: 1px solid black;
  padding: 8px 12px;
  border-radius: 5px;
  max-width: 600px;
  margin: 3rem auto;
}
</style>
