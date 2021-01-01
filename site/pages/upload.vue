<template>
  <section class="section">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Image Uploader</p>
        <a href="#" class="card-header-icon" aria-label="more options">
          <span class="icon">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </header>
      <div class="card-content">
        <b-message
          type="is-info"
          has-icon
          icon="information-outline"
          size="is-small"
          icon-size="is-small"
        >
          Image size should be less than 8MB, Supported file formats .jpeg,
          .png, .jpg, .tiff
        </b-message>
        <div class="content">
          <b-field horizontal label="File Cateogry Type">
            <b-select
              v-model="selectedType"
              placeholder="Select a File Category type"
              expanded
            >
              <option v-for="type in types" v-bind:key="type" :value="type">
                {{ type }}
              </option>
            </b-select>
          </b-field>
          <b-field
            horizontal
            label="Import Images"
            class="file"
            :class="{ 'has-name': !!files }"
          >
            <b-upload
              v-model="files"
              class="file-label"
              multiple
              accept="image/png, image/jpeg, image/jpg. image/tiff"
            >
              <span class="file-cta">
                <b-icon class="file-icon" icon="image-outline"></b-icon>
              </span>
              <span
                class="file-name"
                v-for="file in filteredFiles"
                v-bind:key="file.name"
              >
                {{ file.name.substring(0, 15) }}
              </span>
            </b-upload>
          </b-field>
          <b-field horizontal label="Recently Used tags">
            <b-taglist>
              <b-tag
                v-for="n in recentTags"
                v-bind:key="n"
                type="is-info is-light"
                @click.native="tagClicked(n)"
                style="cursor: pointer"
              >
                {{ n }}</b-tag
              >
            </b-taglist>
          </b-field>
          <b-field grouped message="Type a tag" label="Type a tag" horizontal>
            <b-input
              placeholder="Ex: new year 2021"
              v-model="enteredTag"
              @keyup.enter.native="onEnterTag"
            ></b-input>
          </b-field>
          <b-field grouped horizontal>
            <b-message class="has-text-centered">
              <div v-if="selectedTags.length === 0">No Tags</div>
              <b-taglist v-else>
                <b-tag
                  v-for="n in selectedTags"
                  v-bind:key="n"
                  type="is-info is-light"
                  style="cursor: pointer"
                >
                  {{ n }}</b-tag
                >
              </b-taglist>
            </b-message>
          </b-field>

          <b-field horizontal position="is-centered">
            <p class="control">
              <b-button
                class="card-footer-item"
                icon-left="cloud-upload-outline"
                type="is-primary"
                @click="uploadImage"
                :disabled="uploading"
              >
                Upload
              </b-button>
            </p>
          </b-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script >
export default {
  middleware: "admin",
  data() {
    return {
      files: [],
      types: [],
      recentTags: [],
      selectedType: "",
      selectedTags: [],
      enteredTag: "",
      uploading: false,
    };
  },
  computed: {
    filteredFiles() {
      return this.files.filter(
        (v, i, a) => a.findIndex((t) => t.name === v.name) === i
      );
    },
  },
  methods: {
    tagClicked(value) {
      console.log(value);
      if (!this.selectedTags.find((val) => value === val)) {
        this.selectedTags.push(value);
      }
    },
    onEnterTag() {
      const tags = this.enteredTag.split(" ");
      tags.forEach((val) => {
        this.tagClicked(val);
      });
      this.enteredTag = "";
    },
    async uploadImage() {
      this.uploading = true;
      if (
        !this.selectedType ||
        this.files.length === 0 ||
        this.selectedTags.length === 0
      ) {
        this.$buefy.notification.open({
          duration: 1000,
          message: `Please enter all the fields`,
          position: "is-bottom-right",
          type: "is-danger",
          hasIcon: true,
        });
      }
      const files = this.filteredFiles;
      const uploadPromse = [];

      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        this.selectedTags.forEach((t) => data.append("tags", t));
        data.append("tags", "");
        data.append("categoryType", this.selectedType);
        data.append("file", files[i]);
        uploadPromse.push(this.$axios.post("/image", data));
        for (var pair of data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        console.log(this.selectedTags);
      }
      try {
        await Promise.all(uploadPromse);
        this.$buefy.notification.open({
          duration: 1000,
          message: `Image Uploaded successfully`,
          position: "is-bottom-right",
          type: "is-success",
          hasIcon: true,
        });
        (this.files = []), (this.selectedTags = []);
        this.enteredTag = "";
        this.uploading = false;
      } catch (error) {
        this.$buefy.notification.open({
          duration: 1000,
          message: `An error occured`,
          position: "is-bottom-right",
          type: "is-danger",
          hasIcon: true,
        });
        this.uploading = false;
      }
    },
  },
  async fetch() {
    const promises = [
      this.$axios.get("/image/tags"),
      this.$axios.get("/image/types"),
    ];
    const [tags, types] = await Promise.all(promises);
    this.types = types.data.types;
    this.recentTags = tags.data.map((val) => val.id);
  },
};
</script>