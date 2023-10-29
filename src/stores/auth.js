import { defineStore } from "pinia";

export const useMyAuthStore = defineStore("ore", {
  state: () => ({
    token: "",
    userdetails: {},
    previousRoute: "",
  }),
  getters: {
    registrationForm: (state) => state.userdetails,
  },
  actions: {
    setUserDetails(data) {
      const token = data.accessToken;
      const user = data.user;
      // console.log(data);
      localStorage.setItem("token", token);
      localStorage.setItem("userdet", JSON.stringify(user));
      this.userdetails = data.user;
      this.token = data.accessToken;
    },

    logOut() {
      // console.log(response);
      this.token = null;
      this.userDetails = null;
      localStorage.setItem("token", "");
      localStorage.setItem("userdet", "");
    },
  },
});
