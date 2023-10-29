<template>
  <q-page class="">
    <main>
      <article>
        <section class="section food-menu" id="food-menu">
          <div class="container">
            <h2 class="h2 section-title">Recipes</h2>

            <!-- <ul class="fiter-list">
              <li>
                <button class="filter-btn active">Recipes</button>
              </li>
            </ul> -->
            <div class="load" v-if="loadingAll">
              <q-skeleton width="90%" height="300px" />
            </div>
            <ul class="food-menu-list">
              <li v-for="(recipe, index) in recipes" :key="index">
                <RecipeComp :data="recipe" />
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
    <FooterComp />
  </q-page>
</template>

<script setup>
import FooterComp from "src/components/FooterComp.vue";
import { api } from "src/boot/axios";
import RecipeComp from "src/components/RecipeComp.vue";
import { onMounted, ref } from "vue";
let loadingAll = ref(false);

let recipes = ref([]);
const getRecipes = () => {
  loadingAll.value = true;
  api
    .get("recipes")
    .then((response) => {
      // console.log(response);
      recipes.value = response.data.payload;
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
  getRecipes();
});
</script>
