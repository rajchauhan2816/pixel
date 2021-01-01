<template>
  <section class="section">
    <form @submit.prevent="userLogin">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Login</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Username">
            <b-input
              type="username"
              v-model="login.username"
              placeholder="Your username"
              required
            >
            </b-input>
          </b-field>

          <b-field label="Password">
            <b-input
              type="password"
              v-model="login.password"
              password-reveal
              placeholder="Your password"
              required
            >
            </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="userLogin">Login</button>
        </footer>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  auth: "guest",
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async userLogin() {
      console.log(this.login);
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.login,
        });
        window.location.href = "/";
      } catch (err) {
        this.$buefy.notification.open({
          duration: 1000,
          message: `Login Failed`,
          position: "is-bottom-right",
          type: "is-danger",
          hasIcon: true,
        });
      }
    },
  },
};
</script>