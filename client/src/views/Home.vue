<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Authentication for noobs

      </h1>
      <p class="lead"> Learning Auth is fun!</p>
      <hr class="my-4">
      <p>This is fun!</p>
      <p class="lead">
        <router-link v-if="loggedIn" class="btn btn-primary btn-lg" :to="{name: 'dashboard'}" role="button">Go to dashboard</router-link>
        <router-link v-if="!loggedIn" class="btn btn-primary btn-lg" :to="{name: 'signup'}" role="button">Sign Up</router-link>
        <router-link v-if="!loggedIn" class="btn btn-primary btn-lg" :to="{name: 'login'}" role="button"> Login </router-link>
      </p>
    </div>
  </div>
</template>

<script>

// if(localStorage.token) {
//   console.log('token available');
//   this.loggedIn = true;
// }

export default {
  name: 'Home',
  data: () => ({
    loggedIn: false,
  }),
  mounted() {
    if(localStorage.token) {
      this.loggedIn = true;
    }
  }
};
</script>
