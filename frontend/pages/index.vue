<template>
  <section class="section">
    <b-table
      :data="images"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      default-sort="name"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-table-column field="image" label="image" sortable v-slot="props">
        <b-image
          :src="props.row.url"
          alt="The Buefy Logo"
          ratio="601by235"
        ></b-image>
      </b-table-column>

      <b-table-column field="name" label="File Name" sortable searchable>
        <template slot="searchable" slot-scope="props">
          <b-input
            v-model="props.filters[props.column.field]"
            placeholder="Search..."
            icon="magnify"
            size="is-small"
          />
        </template>

        <template v-slot="props">
          {{ props.row.name }}
        </template>
      </b-table-column>

      <b-table-column
        field="categoryType"
        label="File Type"
        sortable
        searchable
      >
        <template slot="searchable" slot-scope="props">
          <b-dropdown
            v-model="props.filters[props.column.field]"
            aria-role="list"
          >
            <button
              class="button is-small"
              slot="trigger"
              slot-scope="{ active }"
            >
              <span>{{
                props.filters[props.column.field]
                  ? props.filters[props.column.field]
                  : "ALL"
              }}</span>
              <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </button>

            <b-dropdown-item aria-role="listitem">ALL</b-dropdown-item>
            <b-dropdown-item value="ASSETS" aria-role="listitem"
              >ASSETS</b-dropdown-item
            >
          </b-dropdown>
        </template>

        <template v-slot="props">
          {{ props.row.categoryType }}
        </template>
      </b-table-column>

      <b-table-column
        field="size"
        label="Image Size Option"
        sortable
        v-slot="props"
      >
        <b-dropdown v-model="rowData[props.row.id].imageSize" aria-role="list">
          <button
            class="button is-small"
            slot="trigger"
            slot-scope="{ active }"
          >
            <span>{{
              rowData[props.row.id].imageSize
                ? rowData[props.row.id].imageSize
                : "Original"
            }}</span>
            <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
          </button>

          <b-dropdown-item value="Original" aria-role="listitem"
            >Original</b-dropdown-item
          >
          <b-dropdown-item value="Large" aria-role="listitem"
            >Large</b-dropdown-item
          >
          <b-dropdown-item value="Medium" aria-role="listitem"
            >Medium</b-dropdown-item
          >
          <b-dropdown-item value="Small" aria-role="listitem"
            >Small</b-dropdown-item
          >
          <b-dropdown-item value="Thumbnail" aria-role="listitem"
            >Thumbnail</b-dropdown-item
          >
        </b-dropdown>
      </b-table-column>
      <b-table-column field="tags" label="Tags" sortable centered searchable>
        <template slot="searchable" slot-scope="props">
          <b-input
            v-model="props.filters[props.column.field]"
            placeholder="Search..."
            icon="magnify"
            size="is-small"
          />
        </template>

        <template v-slot="props">
          <b-taglist>
            <b-tag v-for="tag in props.row.tags" v-bind:key="tag">{{
              tag
            }}</b-tag>
          </b-taglist>
        </template>
      </b-table-column>
      <b-table-column
        field="link"
        label="Copy Link"
        sortable
        centered
        v-slot="props"
      >
        <b-button
          icon-left="link"
          style="border: 0px"
          @click="copyLink(props.row)"
        >
        </b-button>
      </b-table-column>
      <b-table-column
        v-if="isAdmin"
        field="Action"
        label="Action"
        sortable
        centered
        v-slot="props"
      >
        <b-button
          icon-left="delete"
          style="border: 0px"
          @click="deleteImage(props.row.id)"
        >
        </b-button>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
export default {
  name: "HomePage",
  middleware: "auth",
  data() {
    return {
      paginationPosition: "bottom",
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentPage: 1,
      perPage: 15,
      images: [],
      rowData: [],
    };
  },
  computed: {
    isAdmin() {
      return this.$auth.user.role === "Admin";
    },
  },
  async fetch() {
    const images = await this.$axios.get("/image");
    this.rowData = [];
    images.data.forEach((e) => {
      this.rowData[e.id] = {};
    });
    console.log(this.rowData);
    this.images = images.data;
  },
  methods: {
    async fetchImages() {
      const images = await this.$axios.get("/image");

      this.images = images.data;
    },
    async deleteImage(id) {
      console.log(id);
      await this.$axios.delete(`/image/${id}`);
      this.images = this.images.filter((val) => val.id != id);
      console.log(this.images);
      this.$buefy.notification.open({
        duration: 1000,
        message: `Image has been deleted`,
        position: "is-bottom-right",
        type: "is-danger",
        hasIcon: true,
      });
    },
    async copyLink(row) {
      let newUrl = "";
      if (
        !this.rowData[row.id].imageSize ||
        this.rowData[row.id].imageSize === "Original"
      ) {
        newUrl = row.url;
      } else {
        const splitUrl = row.url.split("/");
        console.log(splitUrl);

        for (let i = 0; i < splitUrl.length; i++) {
          if (i === 2) {
            /* ------------------------------- Bucket name ------------------------------ */

            let bucketUrl = splitUrl[i].split(".");
            bucketUrl[0] += "-resized";

            let temp = "";
            bucketUrl.forEach((val) => {
              temp += val + ".";
            });

            newUrl += temp;
            newUrl = newUrl.slice(0, -1);
          } else if (i === 3) {
            const fileUrlArr = splitUrl[i].split(".");
            newUrl += `${fileUrlArr[0]}_${this.rowData[
              row.id
            ].imageSize.toUpperCase()}.${fileUrlArr[1]}`;
          } else newUrl += `${splitUrl[i]}`;
          newUrl += "/";
        }

        newUrl = newUrl.slice(0, -1);
      }
      await this.$copyText(newUrl);
      this.$buefy.notification.open({
        duration: 1000,
        message: `Link has been copied`,
        position: "is-bottom-right",
        type: "is-success",
        hasIcon: true,
      });
    },
  },
};
</script>