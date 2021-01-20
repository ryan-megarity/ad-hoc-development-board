<template>
  <div>
    <h3 class="mt-3">Add VM</h3>
    <hr>
    <button @click="showVMForm = !showVMForm" type="button"
    class="btn btn-light mb-3">Toggle New VM Form</button>
    <form v-if="showVMForm" @submit.prevent="addVM"
    class="mb-3">
      <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong><p clas="mb-0">{{error}}</p>
        <button @click="error = ''" type="button" class="close"
        data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1">Select Client</label>
        <select v-model="vm.client" class="form-control" id="client" value="" required>
          <option v-for="client in clients" :key="client._id">{{client.clientName}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="clientName">VM Name</label>
        <br/>
        <input class="form-control" type="text" :value="`${vm.client.toUpperCase()}-VM-`" required
        @input="vm.vmName = $event.target.value.toUpperCase()">
      </div>
      <button type="submit" class="btn btn-dark">Add VM</button>
    </form>
     <div>
      <hr>
      <h4 class="fixed">Recently Added VMs</h4>
      <hr>
    </div>
    <div class="list-unstyled" v-for="vm in vms" :key="vm._id">
      <li class="media">
        <div class="media-body">
          <small class = "fixed">VM: </small>
          <small class="data">{{vm.vmName}}</small>
          <br/>
          <small class = "fixed">Client: </small>
          <small class="data">{{vm.client}}</small>
          <br/>
          <small class = "fixed">Created by: </small>
          <small class="data">{{vm.author}}</small>
          <br/>
          <small class = "fixed">Date created: </small>
          <small class="data">{{vm.dateCreated}}</small>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/';
const VM_API_URL = `${API_URL}add-vm`;

export default {
  name: 'addVM',
  data: () => ({
    showVMForm: false,
    error: '',
    vms: [],
    vm: {
      vmName: '',
      client: '',
      author: localStorage.getItem('user'),
      token: localStorage.getItem('jwt'),
    },
    clients: '',
  }),

  mounted() {
    fetch(VM_API_URL).then((response) => response.json()).then((result) => {
      this.vms = result;
    });
    const allClientsApi = `${API_URL}all-clients/`;
    fetch(allClientsApi).then((response) => response.json()).then((result) => {
      this.clients = result;
    });
  },

  methods: {
    addVM() {
      // eslint-disable-next-line
      console.log(this.vm);
      fetch(VM_API_URL, {
        method: 'POST',
        body: JSON.stringify(this.vm),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        if (result.message) {
          // there was an error...
          if (result.message.includes('Error, expected `vmName` to be unique. Value: ')) {
            const error = `Validation Error: VM "${this.vm.vmName}" already exists for ${this.vm.client}.`;
            this.error = error;
          } else {
            const error = result.message;
            this.error = error;
          }
        } else {
          this.vms.unshift(result);
          if (this.vms.length > 5) {
            this.vms.pop();
          }
          this.error = '';
          this.showVMForm = !this.showVMForm;
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
