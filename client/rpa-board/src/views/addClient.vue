<template>
  <div>
    <h3 class="mt-3">Add Client</h3>
    <hr>
    <button @click="showClientForm = !showClientForm" type="button"
    class="btn btn-light mb-3">Toggle New Client Form</button>
    <form v-if="showClientForm" @submit.prevent="addClient"
    class="mb-3">
      <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong><p clas="mb-0">{{error}}</p>
        <button @click="error = ''" type="button" class="close"
        data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="form-group">
        <label for="clientName">Client Name</label>
        <br/>
        <input class="form-control" type="text" :value="client.clientName.toUpperCase()" required
        @input="client.clientName = $event.target.value.toUpperCase()">
      </div>
      <button type="submit" class="btn btn-dark">Add Client</button>
    </form>
     <div>
      <hr>
      <h4 class="fixed">Recently Added Clients</h4>
      <hr>
    </div>
    <div class="list-unstyled" v-for="client in clients" :key="client._id">
      <li class="media">
        <div class="media-body">
          <small class = "fixed">Client: </small>
          <small class="data">{{client.clientName}}</small>
          <br/>
          <small class = "fixed">Created by: </small>
          <small class="data">{{client.author}}</small>
          <br/>
          <small class = "fixed">Date created: </small>
          <small class="data">{{client.dateCreated}}</small>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/add-client/';

export default {
  name: 'addClient',
  data: () => ({
    showClientForm: false,
    error: '',
    clients: [],
    client: {
      clientName: '',
      author: localStorage.getItem('user'),
      token: localStorage.getItem('jwt'),
    },
  }),

  mounted() {
    fetch(API_URL).then((response) => response.json()).then((result) => {
      this.clients = result;
    });
  },

  methods: {
    addClient() {
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.client),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        if (result.message) {
          // there was an error...
          if (result.message.includes('Error, expected `clientName` to be unique.')) {
            const error = `Validation Error: Client "${this.client.clientName}" already exists.`;
            this.error = error;
          } else {
            const error = result.message;
            this.error = error;
          }
        } else {
          this.clients.unshift(result);
          if (this.clients.length > 5) {
            this.clients.pop();
          }
          this.error = '';
          this.showClientForm = !this.showClientForm;
        }
      });
    },
  },
};
</script>

<style>
hr {
  border-top: 3px solid rgba(255, 255, 255, 0.212);
}
img {
  max-width: 200px;
  height: auto;
}
.data{
  color: rgb(2, 123, 128)
}
.fixed{
  color: rgba(255, 255, 255, 0.212)
}
</style>
