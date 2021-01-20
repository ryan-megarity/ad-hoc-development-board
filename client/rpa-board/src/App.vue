<template>
<div>
   <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <img src="./assets/ART.png" width="100">
      <strong class="navbar-brand">RPA Development Board</strong>
      <button class="navbar-toggler" type="button" data-toggle="collapse"
      data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
      aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <a class="nav-link" href="#/">Add log</a>
          </li>
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <a class="nav-link" href="#/view-logs">View logs</a>
          </li>
          <li class="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
            <a class="nav-link dropdown-toggle" href="" id="navbarDropdown"
            role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Add new conifgurations
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#/add-client">New Client</a>
              <a class="dropdown-item" href="#/add-vm">New VM</a>
              <a class="dropdown-item" href="#/add-robot-type">New Robot Type</a>
            </div>
          </li>
          <li class="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
            <a class="nav-link dropdown-toggle" href="" id="navbarDropdown"
            role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Delete conifgurations
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#/delete-client">Delete Client</a>
              <a class="dropdown-item" href="#/delete-vm">Delete VM</a>
              <a class="dropdown-item" href="#/delete-robot-type">Delete Robot Type</a>
            </div>
          </li>
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
          <a class="nav-link" v-on:click="Logout()" href="#/">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="container"/>
  </div>
</div>
</template>
<script>
export default {
  methods: {
    Logout() {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>
<style>
</style>
