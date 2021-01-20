<template>
    <div class="mb-3 mt-3 container">
        <h3>Login</h3>
        <hr>
        <form @submit.prevent="handleSubmit" class="mb-3 mt-3">
            <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Error!</strong><p clas="mb-0">{{error}}</p>
                <button @click="error = ''" type="button" class="close"
                data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <label for="email" >E-Mail Address</label>
            <div class="form-group">
                <input class="form-control" id="email" type="email"
                v-model="user.email" value="" required>
            </div>
            <div class="form-group">
                <label for="password" >Password</label>
                <div class="form-group">
                    <input class="form-control" id="password" type="password"
                    v-model="user.password" value="" required>
                </div>
            </div>
            <div class="form-group">
                <button class="form-control" type="submit">
                    Login
                </button>
            </div>
            <div>
                <a type="button" id = "register" href='#/register'>Register</a>
            </div>
            <div>
                <a type="button" id = "guest" @click="logInGuest()" href='#/register'>Log in as a guest</a>
            </div>
        </form>
    </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/';
const LOGIN_API_URL = `${API_URL}login`;
export default {
  name: 'login',
  data: () => ({
    user: {
      email: '',
      password: '',
    },
    error: '',
  }),
  methods: {
    logInGuest() {
      this.user = {
        email: "guest@user.test",
        password: "guest"
      };
      handleSubmit();
    },
    handleSubmit() {
      fetch(LOGIN_API_URL, {
        method: 'POST',
        body: JSON.stringify(this.user),
        headers: { 'content-type': 'application/json' },
      }).then((response) => response.json()).then((result) => {
        if (result.auth === false) {
          const error = 'Password or email incorrect. Please try again';
          this.error = error;
        } else {
          localStorage.setItem('user', result.user);
          localStorage.setItem('jwt', result.token);
          if (localStorage.getItem('jwt') != null) {
            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            } else {
              this.$router.push('/');
            }
          }
        }
      });
    },
  },
};
</script>
