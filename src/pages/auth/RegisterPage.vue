<template>
  <q-layout>
    <div class="pricing overflow-hidden">
      <div class="left">
        <div class="header">
          <div class="logo">
            <q-btn class="" flat no-wrap no-caps>
              <div class="row items-center no-wrap">
                <div class="logo_img"></div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="sectionMain_text">Sign up to Ore.</div>

        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="register" class="q-mt-lg">
              <div class="form_hold">
                <div class="input">
                  <label for=""> Email* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.email"
                      placeholder="Enter your email"
                      type="text"
                      required
                      name="email"
                    />
                  </div>
                </div>

                <div class="input">
                  <label for=""> States </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.state"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your state
                      </option>
                      <option
                        v-for="(state, index) in states
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))"
                        :key="index"
                        :value="state._id"
                      >
                        {{ state.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Password* </label>

                  <div
                    class="input_wrap no-wrap row justify-between items-center"
                  >
                    <input
                      v-model="data.password"
                      placeholder="Create a password"
                      :type="!togglePass ? 'password' : 'text'"
                      required
                    />
                    <q-btn
                      @click="togglePass = !togglePass"
                      flat
                      icon="visibility"
                    >
                    </q-btn>
                  </div>
                </div>

                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Sign up
                  </q-btn>
                </div>

                <div class="no_acc text-center q-mt-lg">
                  Already have an account?
                  <router-link :to="{ name: 'login' }"> Login </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right auth">
        <q-carousel animated v-model="slide" arrows navigation infinite>
          <q-carousel-slide :name="1" img-src="../../assets/promo-4.png" />
          <q-carousel-slide :name="2" img-src="../../assets/promo-5.png" />
        </q-carousel>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();

let togglePass = ref(false);
let data = ref({
  state: "",
});
let user = ref({});
let states = ref([]);
let slide = ref(1);
let loading = ref(false);

const register = () => {
  loading.value = true;
  api
    .post("auth/register", data.value)
    .then((response) => {
      loading.value = false;
      store.setUserDetails(response.data.payload);

      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });

      data.value = {};
      router.replace({ name: "home" });
    })
    .catch(({ response }) => {
      // console.log(response);
      loading.value = false;
      if (response.status !== 500) {
        Notify.create({
          message: response.data.message,
          color: "red",
          position: "top",
          actions: [{ icon: "close", color: "white" }],
        });
      }
    });
};

const getStates = () => {
  api
    .get("states")
    .then((response) => {
      console.log(response);
      states.value = response.data.payload;
    })
    .catch(({ response }) => {
      console.log(response);
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};

onMounted(() => {
  getStates();
});
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  display: grid;
  height: 100vh;
  margin: 0 auto;
  place-items: center;
  grid-template-columns: 1fr 1fr;
}
.pricing::-webkit-scrollbar {
  display: none;
}

.left {
  padding: 1rem 3rem 2rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.pricing .right {
  width: 100%;
}
.left::-webkit-scrollbar {
  display: none;
}

.right img {
  height: 100%;
  object-fit: cover;
}

.header {
  all: unset;
}

.q-card {
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  position: relative;
  /* Shadow/xl */
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03),
    0px 20px 24px -4px rgba(16, 24, 40, 0.08);
}

.q-card .close {
  position: absolute;
  top: 2%;
  right: 2%;
}

@media (min-width: 1000px) {
  .q-card {
    min-width: 402px;
  }
}
.checkcircle {
  border-radius: 28px;
  border: 8px solid #f9f5ff;
  background: #f4ebff;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}

.checkcircle img {
  width: 24px;
  height: 24px;
}
@media (min-width: 1000px) {
  .list_card {
    min-width: 600px;
  }
}

@media (max-width: 800px) {
  .right {
    display: none;
  }

  .pricing {
    grid-template-columns: 1fr;
  }
  .left {
    padding: 1rem 1rem 2rem;
  }
  .grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .btn_toggle .q-btn,
  .btns_switch .q-btn {
    font-size: 14px;
  }
}
</style>
