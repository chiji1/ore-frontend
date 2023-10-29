<template>
  <div class="dashPage container">
    <!-- {{ $router.currentRoute }} -->
    <q-table
      title="Recipes"
      :rows="rows"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      :grid="mode == 'grid'"
      :filter="filter"
      :loading="loading"
      class="sort_tables"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top-right="props">
        <q-btn
          color="primary"
          label="Create"
          no-caps
          class="q-mr-sm"
          size="md"
          @click="createRes"
        >
        </q-btn>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile">
            {{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile">{{
            mode === "grid" ? "List" : "Grid"
          }}</q-tooltip>
        </q-btn>

        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          class="export"
          padding="xs"
          v-if="rows.length"
          @click="exportTable"
        />
      </template>
      <template v-slot:body-cell-logo="props">
        <q-td :props="props">
          <q-avatar size="50px" class="shadow-10">
            <img
              style="object-fit: cover"
              :src="
                props.row.logo
                  ? props.row.logo
                  : 'https://cdn-icons-png.flaticon.com/512/666/666201.png'
              "
            />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-btn
              round
              dense
              glossy
              color="primary"
              size="sm"
              icon="visibility"
              :loading="loaders.save[props]"
              @click="viewDataFcn(props.row)"
            >
            </q-btn>
            <q-btn
              round
              dense
              glossy
              color="info"
              size="sm"
              class="q-ml-sm"
              icon="edit"
              :loading="loaders.save[props]"
              @click="editFCN(props.row)"
            >
              <q-tooltip>Edit {{ props.row.name }}</q-tooltip>
            </q-btn>
            <q-btn
              round
              dense
              color="negative"
              size="sm"
              class="q-ml-sm"
              icon="delete"
              :loading="loaders.deleteBtn[props]"
              @click="deleteFCN(props)"
            >
              <q-tooltip>Delete {{ props.row.name }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-negative q-gutter-sm">
          <span> {{ message }} </span>
        </div>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="createRecipeModal">
    <q-scroll-area style="height: 90vh; width: 100%">
      <q-card>
        <q-card-section>
          <div class="text-h4">
            <span v-if="editstate">Edit</span>
            <span v-else>Add</span> Recipe
            <q-btn
              round
              flat
              dense
              icon="close"
              class="float-right"
              color="grey-8"
              style="position: relative; z-index: 4"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <div class="q-pt-md">
              <div class="">
                <q-item-label class="q-pb-xs">Name</q-item-label>
                <q-input
                  dense
                  outlined
                  name="name"
                  v-model="data.name"
                  label="Name"
                />
              </div>
            </div>
            <div class="">
              <div class="">
                <q-item-label class="q-pb-xs">Price</q-item-label>
                <q-input
                  dense
                  outlined
                  name="price"
                  type="number"
                  v-model="data.price"
                  label="Price"
                />
              </div>
            </div>
            <div class="">
              <q-item-label class="q-pb-xs">Ingredients</q-item-label>
              <div class="">
                <div class="row q-ma-md justify-end">
                  <q-btn color="primary" no-caps @click="addIngredient"
                    >Add Ingredient</q-btn
                  >
                </div>
                <div
                  v-for="(ingredient, counter) in data.ingredients"
                  :key="counter"
                >
                  <q-list class="q-my-sm" bordered>
                    <q-item
                      clickable
                      style="gap: 1rem"
                      class="no-wrap row items-center justify-between"
                    >
                      <div
                        style="gap: 1rem"
                        class="left full-width row items-center no-wrap justify-between"
                      >
                        <q-input
                          style="width: 100%"
                          dense
                          outlined
                          name="ingredient"
                          v-model="ingredient.name"
                          label="ingredient"
                        />
                        <q-input
                          style="width: 100%"
                          dense
                          type="number"
                          outlined
                          name="calories"
                          v-model="ingredient.calories"
                          label="Calories"
                        />
                      </div>
                      <div class="right q-gutter-sm">
                        <q-btn
                          @click="deleteIngredient(counter)"
                          round
                          size="sm"
                          color="red"
                          icon="fa-solid fa-xmark"
                        />
                      </div>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
            <div class="">
              <div class="">
                <q-item-label class="q-pb-xs">Description</q-item-label>
                <q-input
                  type="textarea"
                  dense
                  outlined
                  name="Description"
                  v-model="data.description"
                  label="Description"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn
            v-if="editstate"
            label="Edit"
            type="submit"
            color="primary"
            :loading="loading"
            @click="editFCNAcn"
            no-caps
          />
          <q-btn
            v-if="!editstate"
            label="Create"
            type="submit"
            color="primary"
            :loading="loading"
            @click="createFcn"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-scroll-area>
  </q-dialog>
  <q-dialog v-model="viewDataModal">
    <q-card style="width: 70%" class="q-pa-md">
      <div class="text-h5 q-mb-sm">Ingredients for {{ viewData.name }}</div>
      <q-list bordered>
        <div v-if="loaderIngredient" class="row justify-center q-my-xs">
          <q-spinner color="primary" size="3em" />
        </div>
        <q-item
          v-else
          v-for="(data, index) in viewData.ingredients"
          :key="index"
          clickable
          v-ripple
        >
          <q-item-section>{{ data.name }}</q-item-section>
          <q-item-section
            style="flex-direction: row; gap: 1rem; justify-content: flex-end"
            class="row no-wrap justify-end items-center"
          >
            {{ data.calories }} |
            <q-btn color="red" @click="removeIngredientFCN(data)" no-caps>
              <i class="fa-solid fa-trash"></i>
            </q-btn>
          </q-item-section>
        </q-item>

        <div class="row justify-center">
          <q-btn no-caps @click="toggleAddIngredientModal" color="primary">
            Add Ingredient
          </q-btn>
        </div>
      </q-list>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addIngredientModal">
    <q-card style="width: 70%" class="q-pa-md">
      <div class="text-h5 q-mb-md">Add Ingredient to {{ viewData.name }}</div>
      <div>
        <q-input
          style="width: 100%"
          dense
          outlined
          name="ingredient"
          v-model="createIngredientObj.name"
          label="ingredient"
        />
      </div>

      <div class="q-mt-md">
        <q-input
          style="width: 100%"
          dense
          type="number"
          outlined
          name="calories"
          v-model="createIngredientObj.calories"
          label="Calories"
        />
      </div>

      <q-card-actions align="right" class="text-teal">
        <q-btn
          label="Add"
          type="submit"
          color="primary"
          :loading="loaderIngredient"
          @click="addIngredientFCN"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { Dialog, exportFile, Notify, useMeta } from "quasar";
import { api } from "src/boot/axios";
const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "price",
    required: true,
    label: "Price",
    align: "left",
    field: (row, index) => `₦${row.price}`,
    sortable: true,
  },

  {
    name: "actions",
    required: true,
    label: "Actions",
    align: "left",
    field: (row) => row.id,
    sortable: false,
  },
];
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}
export default {
  setup() {
    useMeta({
      title: "Recipes",
    });
  },
  data() {
    return {
      columns,
      preview: "",
      selected: [],
      rows: [],
      viewData: {},
      createIngredientObj: { name: "", calories: "" },
      data: { name: "", ingredients: [{ name: "", calories: "" }] },
      loaderIngredient: false,
      addIngredientModal: false,
      createRecipeModal: false,
      viewDataModal: false,
      editstate: false,
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      filter: "",
      curl: "",
      separator: "",
      mode: "list",
      editId: "",
      loading: false,
      loaders: {
        delete: false,
        category: false,
        deleteBtn: [],
        save: [],
      },
    };
  },

  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });
  },
  methods: {
    addIngredient() {
      // this.data.ingredients.push({ name: "cassava", calories: "230" });
      this.data.ingredients.push({ name: "", calories: "" });
    },

    deleteIngredient(counter) {
      this.data.ingredients.splice(counter, 1);
    },
    setFile(props) {
      if (this.editstate) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(props);
      } else {
        return;
      }
    },

    createRes() {
      this.editstate = false;
      this.data = { name: "", ingredients: [{ name: "", calories: "" }] };
      this.createRecipeModal = true;
    },
    viewDataFcn(data) {
      this.viewData = data;
      this.viewDataModal = true;
    },
    onRequest(props) {
      this.loading = true;
      const url = `recipes`;
      this.curl = url;
      this.$api
        .get(url)
        .then(({ data }) => {
          this.loading = false;
          this.rows = data.payload;
        })
        .catch(({ response }) => {
          this.loading = false;
          this.rows = [];
        });
    },

    refreshPage() {
      if (this.curl !== "") {
        this.loading = true;
        this.$api
          .get(this.curl)
          .then(({ data }) => {
            this.loading = false;
            this.rows = data.payload;
          })
          .catch(({ response }) => {
            // console.log(response);
            this.loading = false;
            this.rows = [];
          });
      }
    },

    createFcn() {
      if (this.data.name === "") {
        Notify.create({
          position: "top",
          message: "Name field is required",
          color: "primary",
        });
        return;
      } else {
        this.loading = true;
        api
          .post(`recipes`, this.data)
          .then((response) => {
            Notify.create({
              message: response.data.message,
              color: "green",
              position: "top",
            });
            this.loading = false;
            this.refreshPage();
            this.createRecipeModal = false;
            this.data = {};
          })
          .catch(({ response }) => {
            this.loading = false;

            console.log(response);
            if (response.status !== 500) {
              Notify.create({
                message: response.data.message,
                color: "red",
                position: "top",
                actions: [{ icon: "close", color: "white" }],
              });
            }
          });
      }
    },
    editFCN(restaurant) {
      console.log(restaurant);
      this.editstate = true;
      this.data = {
        ...restaurant,
      };
      this.createRecipeModal = true;
      this.editId = restaurant._id;
    },

    editFCNAcn() {
      // formData.append("_method", "PUT");
      this.loading = true;
      api
        .put(`recipes/${this.editId}`, this.data)
        .then((response) => {
          console.log(response);
          Notify.create({
            message: response.data.message,
            color: "green",
            position: "top",
          });
          this.loading = false;
          this.refreshPage();
          this.createRecipeModal = false;
          this.data = {};
        })
        .catch(({ response }) => {
          this.loading = false;

          console.log(response);
          if (response.status !== 500) {
            Notify.create({
              message: response.data.message,
              color: "red",
              position: "top",
              actions: [{ icon: "close", color: "white" }],
            });
          }
        });
    },
    deleteFCN(id) {
      Dialog.create({
        title: "Delete Member",
        message: "Please confirm you want to remove this restaurant...",
        ok: {
          push: true,
          label: "Delete",
          color: "negative",
        },
        cancel: {
          push: true,
          color: "grey",
        },
        persistent: true,
      })
        .onOk(() => {
          this.loading = true;
          api
            .delete(`recipes/${id.row._id}`)
            .then((response) => {
              this.refreshPage();
              Notify.create({
                message: response.data.message,
                color: "green",
                position: "top",
              });
              this.loading = true;
            })
            .catch(({ response }) => {
              this.loading = true;
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    toggleAddIngredientModal() {
      this.viewDataModal = false;
      this.addIngredientModal = true;
    },
    addIngredientFCN() {
      if (this.createIngredientObj.name === "") {
        Notify.create({
          position: "top",
          message: "Name field is required",
          color: "primary",
        });
        return;
      } else if (this.createIngredientObj.calories === "") {
      } else {
        this.loaderIngredient = true;
        api
          .put(`recipes/${this.viewData._id}/ingredients/add`, {
            ingredient: this.createIngredientObj,
          })
          .then((response) => {
            this.createIngredientObj = {};
            this.loaderIngredient = false;
            this.viewData = response.data.payload;
            this.addIngredientModal = false;
            this.viewDataModal = true;
            Notify.create({
              message: response.data.message,
              color: "green",
              position: "top",
            });
          })
          .catch(({ response }) => {
            this.loaderIngredient = false;
          });
      }
    },
    removeIngredientFCN(ingredientToRemove) {
      Dialog.create({
        title: "Delete ingredient",
        message: "Please confirm you want to remove this ingredient...",
        ok: {
          push: true,
          label: "Delete",
          color: "negative",
        },
        cancel: {
          push: true,
          color: "grey",
        },
        persistent: true,
      })
        .onOk(() => {
          this.loaderIngredient = true;
          api
            .put(`recipes/${this.viewData._id}/ingredients/remove`, {
              ingredient: ingredientToRemove,
            })
            .then((response) => {
              this.loaderIngredient = false;

              this.viewData = response.data.payload;
              Notify.create({
                message: response.data.message,
                color: "green",
                position: "top",
              });
            })
            .catch(({ response }) => {
              this.loaderIngredient = false;
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.rows.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");
      const status = exportFile(`Members`, content, "text/csv");
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}

select {
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  padding: 12px;
}

@media (max-width: 500px) {
  .q-item {
    min-height: 48px;
    padding: 8px 0;
  }

  .q-card {
    width: 95% !important;
  }
}
</style>
