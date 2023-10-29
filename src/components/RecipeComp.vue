<template>
  <div class="food-menu-card">
    <div class="card-banner">
      <img
        src="/recipe.png"
        width="300"
        height="300"
        loading="lazy"
        alt="Fried Chicken Unlimited"
        class="w-100"
      />

      <!-- <div class="badge">-15%</div> -->

      <!-- <button class="btn food-menu-btn">View</button> -->
    </div>

    <h3 class="h3 q-mt-lg card-title">{{ data.name }}</h3>

    <div class="price-wrapper">
      <p class="price-text">Price:</p>

      <data class="price">₦{{ data.price }}</data>

      <!-- <del class="del" value="69.00">$69.00</del> -->
    </div>
    <div v-if="load" class="row justify-center q-my-xs">
      <q-spinner color="primary" size="3em" />
    </div>
    <div class="row justify-center q-my-md">
      <q-btn @click="getDollarRate" no-caps color="primary">
        Click to see USD price
      </q-btn>
    </div>

    <div v-if="data.ingredients?.length">
      <h3 class="h3 q-mt-lg card-title">Ingredients</h3>

      <div
        v-for="ingredient in data.ingredients"
        :key="ingredient._id"
        class="wrapper justify-between"
      >
        <p class="category">{{ ingredient.name }}</p>

        <div class="rating-wrapper">{{ ingredient.calories }} Calories</div>
      </div>
      <div class="wrapper justify-between">
        <p class="category">Calorie count(total)</p>

        <div class="rating-wrapper">
          {{
            data.ingredients.reduce((total, item) => total + item.calories, 0)
          }}
          Calories
        </div>
      </div>
    </div>

    <div v-else>
      <h3 class="h3 q-mt-lg card-title">No Ingredients</h3>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { Dialog } from "quasar";
import { ref, toRefs } from "vue";
let load = ref(false);
let props = defineProps({
  data: Object,
});

const { data } = toRefs(props);

const getDollarRate = async () => {
  const options = {
    method: "GET",
    url: "https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency",
    params: {
      have: "NGN",
      want: "USD",
      amount: data.value.price ? data.value.price : 1000,
    },
    headers: {
      "X-RapidAPI-Key": "929ca9c109mshe507a59cf474ef3p135cb7jsn8b62f11b92e5",
      "X-RapidAPI-Host": "currency-converter-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    load.value = true;
    const response = await axios.request(options);

    Dialog.create({
      title: `Amount in USD for ${data.value.name} `,
      message: `$${response.data.new_amount}`,
    })
      .onOk(() => {
        // console.log('OK')
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    load.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped></style>
