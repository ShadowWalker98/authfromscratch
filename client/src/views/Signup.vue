<template>
  <section>
    <h1> Sign Up! </h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>
    <form @submit.prevent="signup">
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
          Username must be at least 2 characters long.
        </small>
      </div>
      <div class="form-row ">
        <div class="form-group col-md-6">
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
        <div class="form-group col-md-6">
          <label for="cpassword">Confirm Password</label>
          <input
            v-model="user.confirmPassword"
            type="password"
            class="form-control"
            id="cpassword"
            aria-describedby="cpasswordHelp"
            placeholder="Confirm Password"
            required>
            <small id="passwordHelp" class="form-text text-muted">
              Please confirm password.
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
        }).then((user) => {
          console.log(user);
        }).catch((error) => {
          this.errorMessage = error.message;
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
