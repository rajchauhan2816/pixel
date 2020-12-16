<template>
  <div>
    <b-navbar v-if="loggedIn" class="is-primary">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="~/assets/pixel-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <b-button type="is-danger" @click="logOut">Log out</b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <section class="main-content columns">
      <aside v-if="toShowSideBar" class="column is-2 section">
        <p class="menu-label is-hidden-touch">Menu</p>
        <ul class="menu-list">
          <li v-for="(item, key) of items" :key="key">
            <nuxt-link :to="item.to" exact-active-class="is-active">
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Image Logs",
          icon: "home",
          to: { name: "index" },
        },
        {
          title: "Image Upload",
          icon: "lightbulb",
          to: { name: "upload" },
        },
      ],
    };
  },
  methods: {
    async logOut() {
      await this.$auth.logout("local");
      window.location.href = "/login";
    },
  },
  computed: {
    loggedIn() {
      console.log(this.$auth);
      return this.$auth.loggedIn;
    },
    toShowSideBar() {
      return this.$auth.loggedIn && this.$auth.user.role === "Admin";
    },
  },
};
</script>
