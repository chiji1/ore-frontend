<template>
  <div class="dashPage container">
    <!-- {{ $router.currentRoute }} -->
    <q-table
      title="Restaurants"
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
              color="info"
              size="sm"
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
  <q-dialog v-model="createRestaurantModal">
    <q-scroll-area style="height: 90vh; width: 100%">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            <span v-if="editstate">Edit</span>
            <span v-else>Add</span> Restaurant
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
            <div class="q-pt-sm">
              <div class="q-mt-md">
                <q-item-label class="q-pb-xs">Logo</q-item-label>
                <q-avatar v-if="editstate" class="q-mb-md" size="50px">
                  <img
                    v-if="data.logoStr && preview === ''"
                    :src="
                      data.logoStr
                        ? data.logoStr
                        : 'https://cdn-icons-png.flaticon.com/512/666/666201.png'
                    "
                  />

                  <img v-if="data.logoStr && preview !== ''" :src="preview" />
                </q-avatar>
                <q-file
                  dense
                  @update:model-value="setFile"
                  outlined
                  name="cover"
                  accept=".jpg,.png,.svg,.jpeg"
                  v-model="data.logo"
                  :label="editstate ? 'Upload another logo' : 'Upload logo'"
                >
                </q-file>
              </div>
            </div>
            <div class="">
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
                <q-item-label class="q-pb-xs">State</q-item-label>
                <select
                  class="text2 grey"
                  required
                  v-model="data.state"
                  name="department"
                >
                  <option value="" disabled selected>Select your state</option>
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
            v-close-popup="false"
          />
          <q-btn
            v-if="!editstate"
            label="Create"
            type="submit"
            color="primary"
            :loading="loading"
            @click="createFcn"
            no-caps
            v-close-popup="false"
          />
        </q-card-actions>
      </q-card>
    </q-scroll-area>
  </q-dialog>
</template>

<script>
import { Dialog, exportFile, Notify, useMeta } from "quasar";
import { api } from "src/boot/axios";
const columns = [
  {
    name: "logo",
    required: true,
    label: "Logo",
    align: "left",
    field: "logo",
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "state",
    required: true,
    label: "State",
    align: "left",
    field: (row, index) => row.state.name,
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
      title: "Restaurants",
    });
  },
  data() {
    return {
      columns,
      title: "",
      showCities: false,
      guaPreview: "",
      preview: "",
      selected: [],
      rows: [],
      states: [],
      viewData: {},
      data: { state: "", name: "" },
      image: null,
      viewDialog: false,
      createRestaurantModal: false,
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
  created() {
    this.getStates();
  },
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });
  },
  methods: {
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
      this.data = {
        state: "",
        name: "",
      };
      this.createRestaurantModal = true;
    },
    onRequest(props) {
      this.loading = true;
      const url = `restaurants`;
      this.curl = url;
      this.$api
        .get(url)
        .then(({ data }) => {
          this.loading = false;
          console.log(data);
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
            // console.log(data);
          })
          .catch(({ response }) => {
            // console.log(response);
            this.loading = false;
            this.rows = [];
          });
      }
    },

    getStates() {
      this.$api
        .get("states")
        .then((response) => {
          console.log(response);
          this.states = response.data.payload;
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
    },

    createFcn() {
      console.log(this.data);
      if (this.data.name === "") {
        Notify.create({
          position: "top",
          message: "Name field is required",
          color: "primary",
        });
        return;
      } else {
        const formData = new FormData();
        for (var key in this.data) {
          if (this.data[key] === null || this.data[key] === undefined) {
            delete this.data[key];
          } else {
            formData.append(key, this.data[key]);
          }
        }

        this.loading = true;
        api
          .post(`restaurants`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response);
            Notify.create({
              message: response.data.message,
              color: "green",
              position: "top",
            });
            this.loading = false;
            this.refreshPage();
            this.createRestaurantModal = false;
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
        state: restaurant.state._id,
        logo: null,
        logoStr: restaurant.logo,
      };
      this.createRestaurantModal = true;
      this.editId = restaurant._id;
    },

    editFCNAcn() {
      // console.log(editId);
      const propertiesToOmit = [
        "createdAt",
        "updatedAt",
        "slug",
        "logoStr",
        "__v",
      ]; // Define the properties to omit

      const filteredObj1 = Object.fromEntries(
        Object.entries(this.data).filter(
          ([key]) => !propertiesToOmit.includes(key)
        )
      );
      const formData = new FormData();
      for (var key in filteredObj1) {
        formData.append(key, filteredObj1[key]);
      }
      // formData.append("_method", "PUT");
      console.log(this.data);
      console.log(filteredObj1);
      this.loading = true;
      api
        .put(`restaurants/${this.editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          Notify.create({
            message: response.data.message,
            color: "green",
            position: "top",
          });
          this.loading = false;
          this.refreshPage();
          this.createRestaurantModal = false;
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
            .delete(`restaurants/${id.row._id}`)
            .then(({ data }) => {
              this.refreshPage();
              Notify.create({
                message: response.data.message,
                color: "green",
                position: "top",
              });
              this.loading = true;
            })
            .catch(({ response }) => {
              console.log(response);
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
</style>
