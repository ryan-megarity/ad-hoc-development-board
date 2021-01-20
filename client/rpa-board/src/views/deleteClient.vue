<template>
  <div class="mt-3 mb-3">
    <div>
      <h3>Delete Client</h3>
      <hr>
    </div>
    <form class="mb-3">
      <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong><p clas="mb-0">{{error}}</p>
        <button @click="error = ''" type="button" class="close"
        data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="form-group">
        <div class="form-group mt-2">
        <label for="exampleFormControlSelect2">Select Client</label>
        <select v-model="filters.client" class="form-control" id="client" value="" required>
          <option v-for="client in clients" :key="client._id">
          {{client.clientName}}</option>
        </select>
        </div>
      </div>
      <button class="btn btn-danger" type="button" data-toggle="modal"
      data-target="#deleteModal">
      Delete Client </button>
    </form>
    <hr>
    <div class="modal fade" id="deleteModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm Client Deletion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Please confirm you would like to delete this Client.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal"
            v-on:click="deleteClient()">Delete Client</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://art-rpa-dev-board.herokuapp.com/';

export default {
  name: 'Home',
  data: () => ({
    toDelete: {
      id: '',
      token: localStorage.getItem('jwt'),
    },
    error: '',
    filters: {
      client: '',
    },
    clients: [],
    index: '',
  }),

  mounted() {
    const allClientsApi = `${API_URL}all-clients/`;
    fetch(allClientsApi).then((response) => response.json()).then((result) => {
      this.clients = result;
    });
  },

  methods: {
    deleteClient() {
      this.toDelete.id = this.findId();
      const RT_API_URL = `${API_URL}client/`;
      fetch(RT_API_URL, {
        method: 'DELETE',
        body: JSON.stringify(this.toDelete),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        // eslint-disable-next-line
        console.log(result);
        if (!result) {
          // there was an error...
          this.error = 'Failed to delete, please try again.';
        } else {
          const allClientsApi = `${API_URL}all-clients/`;
          fetch(allClientsApi).then((response) => response.json()).then((rts) => {
            this.clients = rts;
          });
        }
      });
    },
    findId() {
      // eslint-disable-next-line
      console.log(this.filters.client);
      for (let i = 0; i < this.clients.length; i += 1) {
        if (this.clients[i].clientName === this.filters.client) {
          // eslint-disable-next-line
          return this.clients[i]._id;
        }
      }
      return -1;
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
