<template>
  <q-layout view="lHh Lpr lFf">
    <header class="header" data-header>
      <div class="container">
        <h1>
          <router-link :to="{ name: 'home' }" class="logo"
            >Ore<span class="span">.</span></router-link
          >
        </h1>

        <nav class="navbar" data-navbar>
          <ul class="navbar-list">
            <li class="nav-item">
              <router-link
                :to="{ name: 'home' }"
                class="navbar-link"
                data-nav-link
                >Home</router-link
              >
            </li>

            <li class="nav-item">
              <router-link
                :to="{ name: 'restaurants' }"
                class="navbar-link"
                data-nav-link
                >Restaurants</router-link
              >
            </li>

            <li class="nav-item">
              <router-link
                :to="{ name: 'recipes' }"
                class="navbar-link"
                data-nav-link
                >Recipes</router-link
              >
            </li>
          </ul>
        </nav>

        <div class="header-btn-group">
          <div class="input-wrapper">
            <input
              type="search"
              name="search"
              placeholder="Search Anything..."
              class="input-field"
              v-model="searchTerm"
              @input="searchFcn"
            />

            <q-btn type="submit" flat>
              <i class="fa-solid fa-magnifying-glass"></i>
            </q-btn>
          </div>

          <div class="header-action items-center">
            <!-- <button
              v-if="store.token === '' || store.token === null"
              class="header-action-btn"
              aria-label="user"
            >
              <i class="fa-regular fa-user"></i>
            </button> -->
            <q-btn
              v-if="store.token === '' || store.token === null"
              style="padding: 0"
              flat
              color="primary"
            >
              <img src="/user.svg" alt="" />
              <q-menu>
                <q-list>
                  <q-item clickable :to="{ name: 'login' }">
                    <q-item-section>
                      <q-item-label class="q-pa-sm">Login</q-item-label>
                    </q-item-section>
                  </q-item>
                  <hr />
                  <q-item clickable :to="{ name: 'register' }">
                    <q-item-section>
                      <q-item-label class="q-pa-sm">Register</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn style="padding: 0" v-else flat color="primary">
              <img src="/user.svg" alt="" />
              <q-menu>
                <q-list>
                  <q-item clickable :to="{ name: 'dashboard' }">
                    <q-item-section>
                      <q-item-label class="q-pa-sm"
                        >Go to Dashboard</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <hr />
                  <q-item clickable :to="{ name: 'logout' }">
                    <q-item-section>
                      <q-item-label class="q-pa-sm">Logout</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- <button class="btn btn-hover">Reservation</button> -->

          <button
            class="nav-toggle-btn"
            aria-label="Toggle Menu"
            data-menu-toggle-btn
          >
            <span class="line top"></span>
            <span class="line middle"></span>
            <span class="line bottom"></span>
          </button>
        </div>
      </div>
    </header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useMyAuthStore } from "src/stores/auth";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();
let store = useMyAuthStore();
let searchTerm = ref("");
const searchFcn = () => {
  router.push({ name: "search", query: { q: searchTerm.value } });
};
onMounted(() => {
  /**
   * navbar toggle
   */

  const navbar = document.querySelector("[data-navbar]");
  const navbarLinks = document.querySelectorAll("[data-nav-link]");
  const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

  menuToggleBtn.addEventListener("click", function () {
    navbar.classList.toggle("active");
    this.classList.toggle("active");
  });

  for (let i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      menuToggleBtn.classList.toggle("active");
    });
  }

  /**
   * header sticky & back to top
   */

  const header = document.querySelector("[data-header]");
  const backTopBtn = document.querySelector("[data-back-top-btn]");

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 100) {
      header.classList.add("active");
      // backTopBtn.classList.add("active");
    } else {
      header.classList.remove("active");
      // backTopBtn.classList.remove("active");
    }
  });
});
</script>

<style scoped>
.q-item {
  white-space: nowrap;
}
</style>
