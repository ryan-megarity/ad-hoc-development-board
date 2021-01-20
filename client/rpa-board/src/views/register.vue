<template>
    <div class="mb-3 mt-3 container">
        <h3>Register</h3>
        <hr>
        <form @submit.prevent="handleSubmit" class="mb-3 mt-3">
             <div v-if= "error" class="alert alert-warning alert-dismissible fade
             show" role="alert">
                <strong>Error!</strong><p clas="mb-0">{{error}}</p>
                <button @click="error = ''" type="button" class="close"
                data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <label for="name">Name</label>
            <div class="form-group">
                <input id="name" type="text" v-model="user.name" class="form-control" required>
            </div>

            <label for="email" >E-Mail Address</label>
            <div class="form-group">
                <input id="email" type="email" v-model="user.email" class="form-control" required>
            </div>

            <label for="password">Password</label>
            <div class="form-group">
                <input id="password" type="password" v-model="user.password" class="form-control"
                required>
            </div>

            <label for="password-confirm">Confirm Password</label>
            <div class="form-group">
                <input id="password-confirm" type="password" v-model="password_confirmation"
                class="form-control" required>
            </div>
            <div class="form-group">
                <button type="submit" class="form-control">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/';
const REGISTER_API_URL = `${API_URL}register`;
export default {
  data: () => ({
    user: {
      name: '',
      email: '',
      password: '',
    },
    password_confirmation: '',
    error: '',
  }),
  methods: {
    handleSubmit() {
      if (this.user.password === this.password_confirmation && this.user.password.length > 0) {
        fetch(REGISTER_API_URL, {
          method: 'POST',
          body: JSON.stringify(this.user),
          headers: { 'content-type': 'application/json' },
        }).then((response) => response.json().then((result) => {
          if (result.message) {
            if (result.message.includes('Error, expected `email` to be unique')) {
              this.error = 'Sorry, this email is already associated to an account.';
            } else {
              this.error = result.message;
            }
          } else {
            localStorage.setItem('user', result.name);
            localStorage.setItem('jwt', result.token);
            this.$router.push('/');
          }
        })).catch((error) => {
          this.error = error;
        });
      } else {
        this.password = '';
        this.passwordConfirm = '';
        const error = new Error('Password do not match');
        this.error = error;
      }
    },
  },
};
</script>
