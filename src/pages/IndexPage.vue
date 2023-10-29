<template>
  <q-page class="">
    <main>
      <article>
        <!--
        - #HERO
      -->

        <section class="hero" id="home">
          <div class="container">
            <div class="hero-content">
              <p class="hero-subtitle">Eat Sleep And</p>

              <h2 class="h1 hero-title">Supper delicious Recipe in town!</h2>

              <p class="hero-text">
                Food is any substance consumed to provide nutritional support
                for an organism.
              </p>

              <q-btn
                v-if="store.token"
                :to="{ name: 'dashboard' }"
                no-caps
                class="btn"
                >Go to Dashboard</q-btn
              >
              <q-btn v-else no-caps class="btn">Register</q-btn>
            </div>

            <figure class="hero-banner">
              <img
                src="../assets/hero-banner-bg.png"
                width="820"
                height="716"
                alt=""
                aria-hidden="true"
                class="w-100 hero-img-bg"
              />

              <img
                src="../assets/hero-banner.png"
                width="700"
                height="637"
                loading="lazy"
                alt="Recipe"
                class="w-100 hero-img"
              />
            </figure>
          </div>
        </section>

        <!--
        - #PROMO
      -->

        <section class="section section-divider white promo">
          <div class="container">
            <h2 class="h2 q-mb-lg section-title">
              Top <span class="span">restaurants</span>
            </h2>
            <div class="load" v-if="loading">
              <q-skeleton width="90%" height="300px" />
            </div>
            <ul v-else class="promo-list has-scrollbar">
              <li
                v-for="restaurant in restaurants"
                :key="restaurant._id"
                class="promo-item"
              >
                <RestaurantComp :data="restaurant" />
              </li>
            </ul>
          </div>
        </section>

        <!--
        - #ABOUT
      -->

        <section class="section section-divider gray about" id="about">
          <div class="container">
            <div class="about-banner">
              <img
                src="../assets/about-banner.png"
                width="509"
                height="459"
                loading="lazy"
                alt="Recipe with Drinks"
                class="w-100 about-img"
              />

              <img
                src="../assets/sale-shape-red.png"
                width="216"
                height="226"
                alt="get up to 50% off now"
                class="abs-img scale-up-anim"
              />
            </div>

            <div class="about-content">
              <h2 class="h2 section-title">
                Caferio, Recipes, and Best Restaurants
                <span class="span">in Town!</span>
              </h2>

              <p class="section-text">
                The restaurants in Hangzhou also catered to many northern
                Chinese who had fled south from Kaifeng during the Jurchen
                invasion of the 1120s, while it is also known that many
                restaurants were run by families.
              </p>

              <ul class="about-list">
                <li class="about-item">
                  <i class="fa-solid fa-check"></i>

                  <span class="span">Delicious & Healthy Foods</span>
                </li>

                <li class="about-item">
                  <i class="fa-solid fa-check"></i>
                  <span class="span">Spacific Family And Kids Zone</span>
                </li>

                <li class="about-item">
                  <i class="fa-solid fa-check"></i>

                  <span class="span">Music & Other Facilities</span>
                </li>

                <li class="about-item">
                  <i class="fa-solid fa-check"></i>
                  <span class="span">Fastest Food Home Delivery</span>
                </li>
              </ul>

              <q-btn no-caps :to="{ name: 'restaurants' }" class="btn"
                >Order Now</q-btn
              >
            </div>
          </div>
        </section>

        <!--
        - #FOOD MENU
      -->

        <section class="section food-menu" id="food-menu">
          <div class="container">
            <!-- <p class="section-subtitle">Popular Dishes</p> -->

            <h2 class="h2 section-title">
              Our <span class="span"> restaurants and recipes</span>
            </h2>

            <!-- <p class="section-text">
              Food is any substance consumed to provide nutritional support for
              an organism.
            </p> -->

            <ul class="fiter-list">
              <li>
                <button
                  @click="setView('restaurants')"
                  :class="
                    view === 'restaurants' ? 'filter-btn active' : 'filter-btn'
                  "
                >
                  Restaurants
                </button>
              </li>

              <li>
                <button
                  @click="setView('recipes')"
                  :class="
                    view === 'recipes' ? 'filter-btn active' : 'filter-btn'
                  "
                >
                  Recipes
                </button>
              </li>
            </ul>

            <div class="load" v-if="loadingAll">
              <q-skeleton width="90%" height="300px" />
            </div>
            <div v-else>
              <ul v-if="view === 'restaurants'" class="food-menu-list">
                <li v-for="(restaurant, index) in restaurants" :key="index">
                  <RestaurantComp :data="restaurant" />
                </li>
              </ul>
              <ul v-if="view === 'recipes'" class="food-menu-list">
                <li v-for="(recipe, index) in recipes" :key="index">
                  <RecipeComp :data="recipe" />
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="section ad section-divider white cta">
          <div class="container">
            <div class="cta-content">
              <h2 class="h2 section-title">
                The Foodie Have Excellent Of
                <span class="span">Quality Recipes!</span>
              </h2>

              <p class="section-text">
                The restaurants in Hangzhou also catered to many northern
                Chinese who had fled south from Kaifeng during the Jurchen
                invasion of the 1120s, while it is also known that many
                restaurants were run by families.
              </p>

              <q-btn no-caps :to="{ name: 'recipes' }" class="btn"
                >Order Now</q-btn
              >
            </div>

            <figure class="cta-banner">
              <img
                src="../assets/cta-banner.png"
                width="700"
                height="637"
                loading="lazy"
                alt="Recipe"
                class="w-100 cta-img"
              />

              <img
                src="../assets/sale-shape.png"
                width="216"
                height="226"
                loading="lazy"
                alt="get up to 50% off now"
                class="abs-img scale-up-anim"
              />
            </figure>
          </div>
        </section>

        <!--
        - #DELIVERY
      -->

        <section class="section section-divider gray delivery">
          <div class="container">
            <div class="delivery-content">
              <h2 class="h2 section-title">
                A Moments Of Delivered On <span class="span">Right Time</span> &
                Place
              </h2>

              <p class="section-text">
                The restaurants in Hangzhou also catered to many northern
                Chinese who had fled south from Kaifeng during the Jurchen
                invasion of the 1120s, while it is also known that many
                restaurants were run by families.
              </p>

              <q-btn no-caps :to="{ name: 'restaurants' }" class="btn"
                >Order Now</q-btn
              >
            </div>

            <figure class="delivery-banner">
              <img
                src="../assets/delivery-banner-bg.png"
                width="700"
                height="602"
                loading="lazy"
                alt="clouds"
                class="w-100"
              />

              <img
                src="../assets/delivery-boy.svg"
                width="1000"
                height="880"
                loading="lazy"
                alt="delivery boy"
                class="w-100 delivery-img"
                data-delivery-boy
              />
            </figure>
          </div>
        </section>

        <!--
        - #TESTIMONIALS
      -->

        <section class="section section-divider white testi">
          <div class="container">
            <p class="section-subtitle">Testimonials</p>

            <h2 class="h2 section-title">
              Our Customers <span class="span">Reviews</span>
            </h2>

            <p class="section-text">
              Food is any substance consumed to provide nutritional support for
              an organism.
            </p>

            <ul class="testi-list has-scrollbar">
              <li class="testi-item">
                <div class="testi-card">
                  <div class="profile-wrapper">
                    <figure class="avatar">
                      <img
                        src="../assets/avatar-1.jpg"
                        width="80"
                        height="80"
                        loading="lazy"
                        alt="Robert William"
                      />
                    </figure>

                    <div>
                      <h3 class="h4 testi-name">Robert William</h3>

                      <p class="testi-title">CEO Kingfisher</p>
                    </div>
                  </div>

                  <blockquote class="testi-text">
                    "I would be lost without restaurant. I would like to
                    personally thank you for your outstanding product."
                  </blockquote>

                  <div class="rating-wrapper">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                </div>
              </li>

              <li class="testi-item">
                <div class="testi-card">
                  <div class="profile-wrapper">
                    <figure class="avatar">
                      <img
                        src="../assets/avatar-2.jpg"
                        width="80"
                        height="80"
                        loading="lazy"
                        alt="Thomas Josef"
                      />
                    </figure>

                    <div>
                      <h3 class="h4 testi-name">Thomas Josef</h3>

                      <p class="testi-title">CEO Getforce</p>
                    </div>
                  </div>

                  <blockquote class="testi-text">
                    "I would be lost without restaurant. I would like to
                    personally thank you for your outstanding product."
                  </blockquote>

                  <div class="rating-wrapper">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                </div>
              </li>

              <li class="testi-item">
                <div class="testi-card">
                  <div class="profile-wrapper">
                    <figure class="avatar">
                      <img
                        src="../assets/avatar-3.jpg"
                        width="80"
                        height="80"
                        loading="lazy"
                        alt="Charles Richard"
                      />
                    </figure>

                    <div>
                      <h3 class="h4 testi-name">Charles Richard</h3>

                      <p class="testi-title">CEO Angela</p>
                    </div>
                  </div>

                  <blockquote class="testi-text">
                    "I would be lost without restaurant. I would like to
                    personally thank you for your outstanding product."
                  </blockquote>

                  <div class="rating-wrapper">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!--
        - #BANNER
      -->

        <section class="section section-divider gray banner">
          <div class="container">
            <ul class="banner-list">
              <li class="banner-item banner-lg">
                <div class="banner-card">
                  <img
                    src="../assets/banner-1.jpg"
                    width="550"
                    height="450"
                    loading="lazy"
                    alt="Discount For Delicious Tasty Recipes!"
                    class="banner-img"
                  />

                  <div class="banner-item-content">
                    <p class="banner-subtitle">50% Off Now!</p>

                    <h3 class="banner-title">
                      Discount For Delicious Tasty Recipes!
                    </h3>

                    <p class="banner-text">Sale off 50% only this week</p>

                    <button class="btn">Order Now</button>
                  </div>
                </div>
              </li>

              <li class="banner-item banner-sm">
                <div class="banner-card">
                  <img
                    src="../assets/banner-2.jpg"
                    width="550"
                    height="465"
                    loading="lazy"
                    alt="Delicious Restaurant"
                    class="banner-img"
                  />

                  <div class="banner-item-content">
                    <h3 class="banner-title">Delicious Restaurant</h3>

                    <p class="banner-text">50% off Now</p>

                    <q-btn :to="{ name: 'restaurants' }" class="btn"
                      >Order Now</q-btn
                    >
                  </div>
                </div>
              </li>

              <li class="banner-item banner-sm">
                <div class="banner-card">
                  <img
                    src="../assets/banner-3.jpg"
                    width="550"
                    height="465"
                    loading="lazy"
                    alt="American Recipes"
                    class="banner-img"
                  />

                  <div class="banner-item-content">
                    <h3 class="banner-title">American Recipes</h3>

                    <p class="banner-text">50% off Now</p>

                    <button class="btn">Order Now</button>
                  </div>
                </div>
              </li>

              <li class="banner-item banner-md">
                <div class="banner-card">
                  <img
                    src="../assets/banner-4.jpg"
                    width="550"
                    height="220"
                    loading="lazy"
                    alt="Tasty Buzzed Restaurant"
                    class="banner-img"
                  />

                  <div class="banner-item-content">
                    <h3 class="banner-title">Tasty Buzzed Restaurant</h3>

                    <p class="banner-text">Sale off 50% only this week</p>

                    <q-btn :to="{ name: 'recipes' }" class="btn"
                      >Order Now</q-btn
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <!--
        - #BLOG
      -->

        <section class="section section-divider white blog" id="blog">
          <div class="container">
            <p class="section-subtitle">Latest Blog Posts</p>

            <h2 class="h2 section-title">
              This Is All About <span class="span">Foods</span>
            </h2>

            <p class="section-text">
              Food is any substance consumed to provide nutritional support for
              an organism.
            </p>

            <ul class="blog-list">
              <li>
                <div class="blog-card">
                  <div class="card-banner">
                    <img
                      src="../assets/blog-1.jpg"
                      width="600"
                      height="390"
                      loading="lazy"
                      alt="What Do You Think About Cheese Restaurant Recipes?"
                      class="w-100"
                    />

                    <div class="badge">Restaurant</div>
                  </div>

                  <div class="card-content">
                    <div class="card-meta-wrapper">
                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-calendar-days"></i>

                        <time class="meta-info" datetime="2022-01-01"
                          >Jan 01 2022</time
                        >
                      </a>

                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-person"></i>

                        <p class="meta-info">Jonathan Smith</p>
                      </a>
                    </div>

                    <h3 class="h3">
                      <a href="#" class="card-title"
                        >What Do You Think About Cheese Restaurant Recipes?</a
                      >
                    </h3>

                    <p class="card-text">
                      Financial experts support or help you to to find out which
                      way you can raise your funds more...
                    </p>

                    <a href="#" class="btn-link">
                      <span>Read More</span>

                      <i class="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </li>

              <li>
                <div class="blog-card">
                  <div class="card-banner">
                    <img
                      src="../assets/blog-2.jpg"
                      width="600"
                      height="390"
                      loading="lazy"
                      alt="Making Chicken Strips With New Delicious Ingridents."
                      class="w-100"
                    />

                    <div class="badge">Recipe</div>
                  </div>

                  <div class="card-content">
                    <div class="card-meta-wrapper">
                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-calendar-days"></i>

                        <time class="meta-info" datetime="2022-01-01"
                          >Jan 01 2022</time
                        >
                      </a>

                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-person"></i>

                        <p class="meta-info">Jonathan Smith</p>
                      </a>
                    </div>

                    <h3 class="h3">
                      <a href="#" class="card-title"
                        >Making Chicken Strips With New Delicious Ingridents.</a
                      >
                    </h3>

                    <p class="card-text">
                      Financial experts support or help you to to find out which
                      way you can raise your funds more...
                    </p>

                    <a href="#" class="btn-link">
                      <span>Read More</span>

                      <i class="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </li>

              <li>
                <div class="blog-card">
                  <div class="card-banner">
                    <img
                      src="../assets/blog-3.jpg"
                      width="600"
                      height="390"
                      loading="lazy"
                      alt="Innovative Hot Chessyraw Pasta Make Creator Fact."
                      class="w-100"
                    />

                    <div class="badge">Chicken</div>
                  </div>

                  <div class="card-content">
                    <div class="card-meta-wrapper">
                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-calendar-days"></i>

                        <time class="meta-info" datetime="2022-01-01"
                          >Jan 01 2022</time
                        >
                      </a>

                      <a href="#" class="card-meta-link">
                        <i class="fa-solid fa-person"></i>

                        <p class="meta-info">Jonathan Smith</p>
                      </a>
                    </div>

                    <h3 class="h3">
                      <a href="#" class="card-title"
                        >Innovative Hot Chessyraw Pasta Make Creator Fact.</a
                      >
                    </h3>

                    <p class="card-text">
                      Financial experts support or help you to to find out which
                      way you can raise your funds more...
                    </p>

                    <a href="#" class="btn-link">
                      <span>Read More</span>

                      <i class="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
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
import { defineComponent, onMounted, ref } from "vue";
import RecipeComp from "src/components/RecipeComp.vue";
import RestaurantComp from "src/components/RestaurantsComp.vue";
import FooterComp from "src/components/FooterComp.vue";
import { api } from "src/boot/axios";
import { useMyAuthStore } from "src/stores/auth";
import { Loading } from "quasar";
let store = useMyAuthStore();
let recipes = ref([]);
let view = ref("restaurants");
let restaurants = ref([]);
let loading = ref(true);
let loadingAll = ref(true);

const setView = (value) => {
  view.value = value;
};

const getRecipes = () => {
  loadingAll.value = true;
  api
    .get("recipes")
    .then((response) => {
      loadingAll.value = false;
      // console.log(response);
      recipes.value = response.data.payload;
    })
    .catch(({ response }) => {
      console.log(response);
      loadingAll.value = false;

      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const getRestaurants = () => {
  loading.value = true;

  api
    .get("restaurants")
    .then((response) => {
      loading.value = false;

      // console.log(response);
      restaurants.value = response.data.payload;
    })
    .catch(({ response }) => {
      console.log(response);
      loading.value = false;

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
  getRecipes();
  /**
   * move cycle on scroll
   */

  const deliveryBoy = document.querySelector("[data-delivery-boy]");

  let deliveryBoyMove = -80;
  let lastScrollPos = 0;

  window.addEventListener("scroll", function () {
    let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;

    if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
      let activeScrollPos = window.scrollY;

      if (lastScrollPos < activeScrollPos) {
        deliveryBoyMove += 1;
      } else {
        deliveryBoyMove -= 1;
      }

      lastScrollPos = activeScrollPos;
      deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
    }
  });
});
</script>
