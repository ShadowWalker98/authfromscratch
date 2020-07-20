<template>
  <section>
    <h1> Sign Up! </h1>
    <div>
      <img v-if="signingUp" src="../assets/loadinganim.svg" alt="">
    </div>
    <div v-if="errorMessage" class="alert alert-secondary" role="alert">
      {{errorMessage}}
    </div>
    <form v-if="!signingUp" @submit.prevent="signup">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          required>
        <small id="usernameHelp" class="form-text text-muted">
         Enter the registered username
        </small>
      </div>
      <div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            aria-describedby="passwordHelp"
            placeholder="Password"
            required>
          <small id="passwordHelp" class="form-text text-muted">
            Must be a minimum of 10 characters
          </small>
        </div>
        <div class="form-group">
          <label for="cpassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="cpassword"
            aria-describedby="cpasswordHelp"
            placeholder="Confirm Password"
            required>
          <small id="cpasswordHelp" class="form-text text-muted">
            confirm your password
          </small>
        </div>
      </div>

      <button type="submit" class="btn btn-primary"> Sign Up </button>
    </form>
  </section>

</template>

<script>

import Joi from 'joi';


const SIGNUP_URL = 'http://localhost:5000/auth/signup';


const schema = Joi.object({
    username: Joi.string()
        .regex(/(^[a-zA-Z0-9_]+$)/)
        .min(2)
        .max(30)
        .required(),

    password: Joi.string()
        .trim()
        .min(10)
        .required(),
    confirmPassword: Joi.string()
        .trim()
        .min(10)
        .required(),
});

export default {
  data: () => ({
    signingUp: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    }
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if(this.validUser()) {
        //send data to server
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        this.signingUp = true;
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((res) => {
          if(res.ok) {
            return res.json();
          }
          return res.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {

          //console.log(result);
          localStorage.token = result.token;
          setTimeout(() => {
            this.signingUp = false;
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.signingUp = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
      if(this.user.password !== this.user.confirmPassword) {
        this.errorMessage = "Passwords dont match!"
        return false;
      } else {
        const result = Joi.validate(this.user, schema);
        if(result.error === null){
          return true;
        }
        if(result.error.message.includes('username')){
          this.errorMessage = 'Username is invalid'
        } else {
          this.errorMessage = 'Password is invalid'
        }
        return false;

      }
    },
  }
};
</script>



<style>

</style>
