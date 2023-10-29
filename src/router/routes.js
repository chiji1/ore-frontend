const routes = [
  {
    path: "/",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "login",
  },
  {
    path: "/",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "logout",
  },
  {
    path: "/register",
    component: () => import("pages/auth/RegisterPage.vue"),
    name: "register",
  },

  {
    path: "/user/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        component: () => import("pages/IndexPage.vue"),
        name: "home",
      },
      {
        path: "/restaurants",
        component: () => import("pages/RetaurantPage.vue"),
        name: "restaurants",
      },
      {
        path: "/recipes",
        component: () => import("pages/RecipePage.vue"),
        name: "recipes",
      },
      {
        path: "/search-results",
        component: () => import("pages/SearchPage.vue"),
        name: "search",
      },
    ],
  },
  {
    path: "/user/dashboard",
    component: () => import("layouts/DashBoard.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/dashboard/DashboardPage.vue"),
        name: "dashboard",
      },
      {
        path: "/dashboard/restaurants",
        component: () => import("src/pages/dashboard/CreateRestaurant.vue"),
        name: "dashboard.restaurants",
      },
      {
        path: "/dashboard/recipes",
        component: () => import("src/pages/dashboard/CreateRecipe.vue"),
        name: "dashboard.recipes",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  // {
  //   path: "/login",
  //   component: () => import("pages/auth/LoginPage.vue"),
  //   name: "login",
  // },
];

export default routes;
