import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import loadStore from "stores/loader";

const api = axios.create({
  baseURL: " https://ore-api-dd9l.onrender.com/api/v1/",
});

function hasQueryParams(route) {
  // console.log(route);
  if (route.query.ref) {
    return !!Object.keys(route.query).length;
  } else {
    return;
  }
}
export default boot(({ app, store, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$store = loadStore;

  let auth = store.state.value.ore;
  console.log(auth);
  api.interceptors.response.use(function (response) {
    if (response.data && response.data.token) {
      token = response.data.token;
    }

    return response;
  });
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    (e) => {
      console.log(e);
      let status_code = !e.response || e.response.status;
      console.log(status_code);
      if (e.message === "Network Error") {
        Notify.create({
          message: e.message + " check your internet connection",
          color: "red",
        });
      } else if (status_code === 401) {
        Notify.create({
          message: "You need to login to view page",
          color: "red",
        });
        router.replace({
          name: "login",
        });
        Promise.reject(e);
      } else if (e.message === "timeout exceeded") {
        Notify.create({
          message: e.message + " check your internet connection",
          color: "red",
        });
      } else if (status_code === 500) {
        Notify.create({
          message:
            e.response.data.message ||
            "This is not your fault, we have been notified and is currently fixing any issues.",
          position: "top-right",
          color: "red",
        });
        return Promise.reject(e);
      } else {
        return Promise.reject(e);
      }
      return Promise.reject(e);
    }
  );

  api.interceptors.request.use(function (config) {
    if (auth.token) {
      config.headers.Authorization = "Bearer " + auth.token;
    }
    return config;
  });
  router.beforeEach((to, from, next) => {
    const store = app.config.globalProperties.$store;

    if (store.ore.token) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${store.ore.token}`;
    }
    if (to.name === "logout" && store.ore.userdetails) {
      console.log(store.ore);
      store.ore.token = "";
      store.ore.userdetails = {};
      localStorage.setItem("token", "");
      localStorage.setItem("userdet", "");
      router.replace({ name: "login" });
    }

    if (!hasQueryParams(to) && hasQueryParams(from)) {
      router.replace({
        name: to.name,
        params: to.params.id ? { id: to.params.id } : {},
        query: from.query,
        hash: to.hash,
      });
    } else {
      next();
    }
  });
});

export { axios, api };
