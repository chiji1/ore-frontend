<template>
  <q-layout class="dashboard" view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <header class="header" data-header>
      <div class="container">
        <h1>
          <q-item
            :to="{
              name: 'home',
            }"
            class="logo"
            >Dashboard</q-item
          >
        </h1>

        <button
          class="menu-toggle-btn icon-box"
          data-menu-toggle-btn
          aria-label="Toggle Menu"
        >
          <i class="fa-solid fa-bars"></i>
        </button>

        <nav class="navbar">
          <div class="container">
            <ul class="navbar-list">
              <li>
                <q-item
                  active-class="active"
                  :to="{ name: 'dashboard' }"
                  class="navbar-link icon-box"
                >
                  <i class="fa-solid fa-house"></i>

                  <span>Home</span>
                </q-item>
              </li>

              <li>
                <q-item
                  active-class="active"
                  :to="{ name: 'dashboard.restaurants' }"
                  class="navbar-link icon-box"
                >
                  <i class="fa-solid fa-utensils"></i>

                  <span>Restaurants</span>
                </q-item>
              </li>

              <li>
                <q-item
                  active-class="active"
                  :to="{ name: 'dashboard.recipes' }"
                  class="navbar-link icon-box"
                >
                  <i class="fa-solid fa-bowl-food"></i>

                  <span>Recipes</span>
                </q-item>
              </li>
            </ul>

            <ul class="user-action-list">
              <!-- <li>
                <a href="#" class="notification icon-box">
                  <i class="ri-notification-line"></i>
                </a>
              </li> -->

              <li>
                <q-btn
                  style="padding: 0; min-height: auto"
                  no-wrap
                  no-caps
                  flat
                >
                  <div class="header-profile">
                    <figure class="profile-avatar">
                      <img
                        src="/user.svg"
                        :alt="store.userdetails.first_name"
                        width="32"
                        height="32"
                      />
                    </figure>

                    <div class="text-left">
                      <p class="profile-title">
                        {{ store.userdetails.first_name }}
                        {{ store.userdetails.last_name }}
                      </p>

                      <p class="profile-subtitle">User</p>
                    </div>
                  </div>
                  <q-menu>
                    <q-list>
                      <q-item clickable :to="{ name: 'logout' }">
                        <q-item-section>
                          <q-item-label class="q-pa-sm">Logout</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useMyAuthStore } from "src/stores/auth";
import { useRoute, useRouter } from "vue-router";
let store = useMyAuthStore();
const routeParam = useRoute();
let router = useRouter();

watch(routeParam, (newParams, oldParams) => {
  const header = document.querySelector("[data-header]");
  if (newParams.name !== router.currentRoute.value) {
    header.classList.remove("active");
  }
});
onMounted(() => {
  const header = document.querySelector("[data-header]");
  const navToggleBtn = document.querySelector("[data-menu-toggle-btn]");

  navToggleBtn.addEventListener("click", function () {
    header.classList.toggle("active");
  });

  const menuBtn = document.querySelectorAll("[data-menu-btn]");

  for (let i = 0; i < menuBtn.length; i++) {
    menuBtn[i].addEventListener("click", function () {
      this.nextElementSibling.classList.toggle("active");
    });
  }
});
</script>

<style lang="scss" scoped>
.q-item {
  padding: 0 0.5rem;
  min-height: auto;
  /* margin: 2rem 0; */
}

.navbar-list {
  .q-item {
    margin: 2rem 0;
  }
}

@media (max-width: 1000px) {
  .header.active {
    display: unset;
  }
  .header .container .navbar .container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
  .dashboard .navbar-list {
    padding-inline: 0;
    margin-bottom: 0;
  }
  .dashboard .user-action-list {
    padding-inline: 0;
  }
}
</style>
