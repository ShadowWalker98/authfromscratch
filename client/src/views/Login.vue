<template>
  <section>
    <h1>Login</h1>
    <div>
      <img v-if="loggingIn" src="../assets/loadinganim.svg" alt="">
    </div>
    <div v-if="errorMessage" class="alert alert-secondary" role="alert">
      {{errorMessage}}
    </div>
    <form v-if="!loggingIn" @submit.prevent="login()">
      <div class="form-group">
        <label for="username"></label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          required>
        <small id="usernameHelp" class="form-text text-muted">
          Enter your registered username
        </small>
      </div>
      <div class="form-group ">
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
          Enter the correct password
        </small>
      </div>
      <button type="submit" class="btn btn-primary"> Login </button>
    </form>
  </section>
</template>
<script>

import Joi from 'joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';


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
});

export default {
  data: () => ({
    loggingIn: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if(this.validUser()) {
        this.loggingIn = true;
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
        }).then((res) => {
          if(res.ok) {
            return res.json();
          }
          return res.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          // it worked! valid info entered!
          // they're logged in!
          console.log(result)
          setTimeout(() => {
            this.loggingIn = false;
            //this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.loggingIn = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
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
  }

};
</script>

<style>


</style>