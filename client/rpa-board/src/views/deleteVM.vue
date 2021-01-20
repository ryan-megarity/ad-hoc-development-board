<template>
  <div class="mt-3 mb-3">
    <div>
      <h3>Delete VM</h3>
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
      <div v-if="filters.client">
      <label for="vm">Select VM</label>
      <br/>
      </div>
      <div class="form-group mt-2" v-if="filters.client">
      <select v-model="filters.vm" class="form-control" id="vm" value = "" required>
      <label for="exampleFormControlSelect2">Select Client</label>
      <option v-for="vm in getOnlyClientVMs(VMs, filters.client)"
      :key="vm._id">{{vm.vmName}}</option>
      </select>
      </div>
      <button class="btn btn-danger" type="button" data-toggle="modal"
      data-target="#deleteModal">
      Delete VM </button>
    </form>
    <hr>
    <div class="modal fade" id="deleteModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm VM Deletion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Please confirm you would like to delete this VM.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal"
            v-on:click="deleteVM()">Delete VM</button>
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
      vm: '',
    },
    clients: [],
    index: '',
    showVMs: false,
    vm: '',
    VMs: [],
  }),

  mounted() {
    const allClientsApi = `${API_URL}all-clients/`;
    fetch(allClientsApi).then((response) => response.json()).then((result) => {
      this.clients = result;
    });
    const allVMsApi = `${API_URL}all-vms/`;
    fetch(allVMsApi).then((response) => response.json()).then((result) => {
      this.VMs = result;
    });
  },

  methods: {
    deleteVM() {
      this.toDelete.id = this.findId();
      const VM_API_URL = `${API_URL}vm/`;
      fetch(VM_API_URL, {
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
          const allVMsApi = `${API_URL}all-vms/`;
          fetch(allVMsApi).then((response) => response.json()).then((rts) => {
            this.VMs = rts;
          });
        }
      });
    },
    findId() {
      // eslint-disable-next-line
      console.log(this.filters.vm);
      for (let i = 0; i < this.VMs.length; i += 1) {
        if (this.VMs[i].vmName === this.filters.vm) {
          // eslint-disable-next-line
          return this.VMs[i]._id;
        }
      }
      return -1;
    },
    getOnlyClientVMs(VMs, selectedClient) {
      let temp = [];
      let tempReturn = [];
      for (let i = 0; i < VMs.length; i += 1) {
        if (VMs[i].client === selectedClient) {
          temp.push(VMs[i]);
        }
      }
      tempReturn = temp;
      temp = [];
      tempReturn = tempReturn.sort((a, b) => {
        // eslint-disable-next-line
        console.log('sort');
        return a.vmName.toString().toString().localeCompare(b.vmName.toString().toString());
      });
      return tempReturn;
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
