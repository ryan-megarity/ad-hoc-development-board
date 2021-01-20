<template>
  <div class="mt-3 mb-3">
    <div>
      <h3>View Logs</h3>
      <hr>
    </div>
    <button @click="showFilterForm = !showFilterForm" type="button"
    class="btn btn-light mt-3 mb-3">Toggle Filters</button>
    <form v-if="showFilterForm" @submit.prevent="filter"
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
        <select v-model="filters.client" class="form-control" id="client" value="" required>
          <option>ALL CLIENTS</option>
          <option v-for="client in clients" :key="client._id">{{client.clientName}}</option>
        </select>
        <div v-if="filters.client && filters.client !== 'ALL CLIENTS'">
          <button @click="showVMs = !showVMs" type="button"
          class="btn btn-secondary mt-2">Toggle VM Filter</button>
        </div>
        <div v-if="showVMs">
        <div class="mt-2">
        <label for="vm">Select VMs</label>
        <br/>
        </div>
        <div class="form-check form-check-inline mb-2"
        v-for="vm in getOnlyClientVMs(VMs, filters.client)"
        :key="vm._id" v-bind:value="vm.vmName">
        <input v-on:click="addVm(vm.vmName)" class="form-check-input" type="checkbox" id="vm">
        <label class="form-check-label" for="inlineCheckbox1">{{vm.vmName}}</label>
        </div>
        </div>
        <div class="form-group mt-2">
        <label for="exampleFormControlSelect2">Select Robot Type</label>
        <select v-model="filters.robotType" class="form-control" id="robotType" value="" required>
          <option>ALL ROBOT TYPES</option>
          <option v-for="robotType in robotTypes" :key="robotType._id">
          {{robotType.robotTypeName}}</option>
        </select>
        </div>
        <div class="form-group mt-2">
        <label for="exampleFormControlSelect2">Select Change Type</label>
        <select v-model="filters.typeOfChange"
        class="form-control" id="typeOfChange" value="" required>
          <option>ALL CHANGE TYPES</option>
          <option v-for="changeType in typesOfChange" :key="changeType._id">
          {{changeType}}</option>
        </select>
        </div>
      </div>
      <button type="submit" class="btn btn-dark">Apply Filter</button>
    </form>
    <hr>
    <div class="list-unstyled" v-for="rlog in logs" :key="rlog._id">
      <li class="media">
        <div class="media-body">
          <h5 class="mt-1 mb-1 data">{{rlog.robotType}}</h5>
          <h5 class="mt-1 mb-1 data">{{rlog.client}}</h5>
          <p style="font-style:italic">" {{rlog.log}} "</p>
          <small class = "fixed">Type of Change: </small>
          <small class="data">{{rlog.typeOfChange}}</small>
          <br/>
          <small class = "fixed">VMs affected: </small>
          <small class="data">{{rlog.vm}}</small>
          <br />
          <small class = "fixed">Logged by: </small>
          <small class="data">{{rlog.author}}</small>
          <br/>
          <small class = "fixed">Date logged: </small>
          <small class="data">{{rlog.date}}</small>
          <div>
          <br/>
          </div>
          <a type="button" class="btn btn-sm btn-warning" v-bind:href="'#/logs/'+rlog._id">
          Edit Log </a>
          <button class="btn btn-sm btn-danger" type="button" data-toggle="modal"
          data-target="#deleteModal" v-on:click="toDelete.id=rlog._id">
          Delete Log </button>
        </div>
      </li>
      <hr>
    </div>
    <div class="modal fade" id="deleteModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm Log Deletion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Please confirm you would like to delete this log.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal"
            v-on:click="deleteLog()">Delete Log</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/';

export default {
  name: 'Home',
  data: () => ({
    showFilterForm: false,
    showLogs: false,
    showVMs: false,
    deleteAlert: false,
    toDelete: {
      id: '',
      token: localStorage.getItem('jwt'),
    },
    vm: '',
    error: '',
    allLogs: [],
    logs: [],
    filters: {
      log: '',
      date: '',
      typeOfChange: '',
      client: '',
      vm: [],
      robotType: '',
      author: '',
    },
    timeFilter: '',
    clients: [],
    VMs: [],
    index: '',
    robotTypes: [],
    typesOfChange: ['Bug Fix', 'New Logic', 'New Workflow', 'New Bot', 'Other'],
  }),

  mounted() {
    const allLogsApi = `${API_URL}all-logs/`;
    fetch(allLogsApi).then((response) => response.json()).then((result) => {
      this.allLogs = result;
    });
    const allClientsApi = `${API_URL}all-clients/`;
    fetch(allClientsApi).then((response) => response.json()).then((result) => {
      this.clients = result;
    });
    const allVMsApi = `${API_URL}all-vms/`;
    fetch(allVMsApi).then((response) => response.json()).then((result) => {
      this.VMs = result;
    });
    const allRobotTypesApi = `${API_URL}all-robot-types/`;
    fetch(allRobotTypesApi).then((response) => response.json()).then((result) => {
      this.robotTypes = result;
    });
  },

  methods: {
    filter() {
      // we will go through and check all filters
      let temp = []; // this is where we are going to store the values that have been filtered
      // client filter
      if (this.filters.client === 'ALL CLIENTS') {
        temp = this.allLogs;
      } else {
        temp = this.allLogs.filter((log) => log.client === this.filters.client);
      }
      // VM filter{
      if (this.filters.vm.length !== 0) {
        for (let i = 0; i < this.filters.vm.length; i += 1) {
          temp = temp.filter((log) => log.vm.includes(this.filters.vm[i]));
          this.filters.vm = [];
        }
      }
      // Robot Type filter
      if (this.filters.robotType !== 'ALL ROBOT TYPES') {
        temp = temp.filter((log) => log.robotType === this.filters.robotType);
      }
      // Change Type filter
      if (this.filters.typeOfChange !== 'ALL CHANGE TYPES') {
        temp = temp.filter((log) => log.typeOfChange === this.filters.typeOfChange);
      }
      this.logs = temp;
      this.showFilterForm = !this.showFilterForm;
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
      return tempReturn;
    },
    addVm(vmName) {
      if (this.filters.vm.includes(vmName)) {
        this.index = this.filters.vm.indexOf(vmName);
        if (this.index !== -1) {
          this.filters.vm.splice(this.index, 1);
        }
      } else {
        this.filters.vm.push(vmName);
      }
      this.filters.vm.sort();
    },
    flip(x) {
      return !x;
    },
    deleteLog() {
      const LOG_API_URL = `${API_URL}logs/`;
      fetch(LOG_API_URL, {
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
          this.error = 'Failed to delete. Please try again.';
        } else {
          let updatedLogs = this.logs;
          for (let i = 0; i < this.logs.length; i += 1) {
            // eslint-disable-next-line
            updatedLogs = updatedLogs.filter((log) => log._id !== result._id);
            this.logs = updatedLogs;
          }
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
