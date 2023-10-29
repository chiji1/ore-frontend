<template>
  <main>
    <article class="container article">
      <h2 class="h2 article-title">
        Hi {{ store.userdetails.first_name }} {{ store.userdetails.last_name }}
      </h2>

      <p class="article-subtitle">Welcome to Dashboard!</p>

      <section class="home">
        <div class="card profile-card">
          <button
            class="card-menu-btn icon-box"
            aria-label="More"
            data-menu-btn
          >
            <i class="ri-dashboard-line"></i>
          </button>

          <ul class="ctx-menu">
            <li class="divider"></li>
          </ul>

          <div class="profile-card-wrapper">
            <figure class="card-avatar">
              <img src="/user.svg" width="32" height="32" />
            </figure>

            <div>
              <p class="card-title">
                {{ store.userdetails.email }}
              </p>
            </div>
          </div>

          <ul class="contact-list">
            <li>
              <a
                :href="`mailto:${store.userdetails.email}`"
                class="contact-link icon-box"
              >
                <i class="ri-mail-line"></i>

                <p class="text">{{ store.userdetails.email }}</p>
              </a>
            </li>
          </ul>

          <div class="divider card-divider"></div>
        </div>

        <div class="card-wrapper">
          <div class="card task-card">
            <div class="card-icon icon-box green">
              <i class="ri-shopping-bag-line"></i>
            </div>

            <div>
              <data class="card-data" :value="recipes.length">{{
                recipes.length
              }}</data>

              <p class="card-text">Restaurants</p>
            </div>
          </div>

          <div class="card task-card">
            <div class="card-icon icon-box blue">
              <i class="ri-shopping-bag-line"></i>
            </div>

            <div>
              <data class="card-data" :value="restaurants.length">{{
                restaurants.length
              }}</data>

              <p class="card-text">Recipes</p>
            </div>
          </div>
        </div>
      </section>

      <!--
        - #PROJECTS
      -->

      <section class="projects">
        <div class="section-title-wrapper">
          <h2 class="section-title">Recent restaurants</h2>

          <q-btn
            no-caps
            no-wrap
            flat
            :to="{ name: 'orders' }"
            class="btn btn-link icon-box"
          >
          </q-btn>
        </div>
        <div class="load" v-if="loading">
          <q-skeleton width="90%" height="300px" />
        </div>

        <ul v-else class="project-list">
          <li v-for="(restaurant, index) in restaurants" :key="index">
            <RestaurantComp :data="restaurant" />
          </li>
        </ul>
      </section>
    </article>
  </main>

  <!--
    - #FOOTER
  -->

  <footer class="footer">
    <div class="container">
      <ul class="footer-list">
        <li class="footer-item">
          <a href="https://Ore.com/about" target="_blank" class="footer-link"
            >About</a
          >
        </li>

        <li class="footer-item">
          <a href="https://Ore.com/terms" target="_blank" class="footer-link"
            >Terms</a
          >
        </li>

        <li class="footer-item">
          <a
            href="https://wa.me/+2347044914032"
            target="_blank"
            class="footer-link"
            >Support</a
          >
        </li>
      </ul>

      <p class="copyright">
        &copy; {{ new Date().getFullYear() }}
        <a href="#" class="copyright-link">Ore</a>. All Rights Reserved
      </p>
    </div>
  </footer>
</template>

<script setup>
import { copyToClipboard, Dialog, Loading } from "quasar";
import { api } from "src/boot/axios";
import { useMyAuthStore } from "src/stores/auth";
import { onMounted, ref } from "vue";
import RestaurantComp from "src/components/RestaurantsComp.vue";
import { Notify } from "quasar";
let store = useMyAuthStore();
let recipes = ref([]);
let restaurants = ref({});
let loading = ref(false);

const getRecipies = () => {
  loading.value = true;
  api
    .get("recipes")
    .then(({ data }) => {
      console.log(data);
      recipes.value = data.payload;
      loading.value = false;
    })
    .catch(({ response }) => {
      loading.value = false;
    });
};
const getRestaurants = () => {
  loading.value = true;
  api
    .get("restaurants")
    .then(({ data }) => {
      console.log(data);
      restaurants.value = data.payload;
      loading.value = false;
    })
    .catch(({ response }) => {
      loading.value = false;
    });
};

onMounted(() => {
  getRecipies();
  getRestaurants();
});
</script>

<style lang="scss" scoped>
.li {
  position: relative;
  .q-btn {
    position: absolute;
    top: -65%;
    right: -35%;
  }
}

@media (max-width: 900px) {
  .dashboard .profile-card-wrapper {
    gap: 5px;
  }

  .dashboard .article.container {
    margin-top: 3rem;
  }
}
</style>
