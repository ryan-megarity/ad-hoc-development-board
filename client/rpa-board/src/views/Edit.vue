<template>
  <div class="mt-3 mb-3">
    <div>
      <h3>Edit Log</h3>
      <hr>
    </div>
    <div class="list-unstyled">
      <li class="media">
        <div class="media-body">
          <h5 class="mt-1 mb-1 data">{{log.robotType}}</h5>
          <h5 class="mt-1 mb-1 data">{{log.client}}</h5>
          <p style="font-style:italic">" {{log.log}} "</p>
          <small class = "fixed">Type of Change: </small>
          <small class="data">{{log.typeOfChange}}</small>
          <br/>
          <small class = "fixed">VMs affected: </small>
          <small class="data">{{log.vm}}</small>
          <br />
          <small class = "fixed">Logged by: </small>
          <small class="data">{{log.author}}</small>
          <br/>
          <small class = "fixed">Date logged: </small>
          <small class="data">{{log.date}}</small>
        </div>
      </li>
      <hr>
      <div class="form-group">
        <label for="change">What would you like to Change?</label>
        <select v-model="toChange" id="change" class="form-control" value="" required>
        <option v-for="filter in filters" :key="filter">{{filter}}</option>
        </select>
      </div>
      <form v-if="toChange === 'Log'" @submit.prevent="editLog" class="mb-3">
        <div class="form-group">
          <label for="log">Please Enter New Log</label>
          <textarea v-model="newLog" class="form-control" id="log" value="" required>
          </textarea>
        </div>
        <button type="submit" class="btn btn-warning">Edit Log</button>
      </form>
      <form v-if="toChange === 'Client'" @submit.prevent="editLog" class="mb-3">
         <div class="form-group">
        <label for="exampleFormControlSelect1">Select Client</label>
        <select v-model="newClient" class="form-control" id="client" value="" required>
          <option v-for="client in clients" :key="client._id">{{client.clientName}}</option>
        </select>
        </div>
        <button type="submit" class="btn btn-warning">Edit Client</button>
      </form>
      <form v-if="toChange === 'Type of Change'" @submit.prevent="editLog" class="mb-3">
        <div class="form-group">
          <label for="exampleFormControlSelect3">Select Type of Change</label>
          <select v-model="newChangeType" class="form-control" id="typeOfChange" value="" required>
          <option v-for="type in typesOfChange" :key="type">{{type}}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-warning">Edit Type of Change</button>
      </form>
      <form v-if="toChange === 'Robot Type'" @submit.prevent="editLog" class="mb-3">
        <div class="form-group">
          <label for="exampleFormControlSelect3">Select Robot Type</label>
          <select v-model="newRobotType" class="form-control" id="typeOfChange" value="" required>
          <option v-for="robotType in robotTypes"
          :key="robotType._id">{{robotType.robotTypeName}}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-warning">Edit Robot Type</button>
      </form>
      <form v-if="toChange === 'VMs'" @submit.prevent="editLog">
          <label for="vm">Select VMs Affected</label>
          <br/>
          <div class="form-check form-check-inline mb-3" v-for="vm in getOnlyClientVMs(VMs)"
          :key="vm._id" v-bind:value="vm.vmName">
          <input v-on:click="addVm(vm.vmName)" class="form-check-input" type="checkbox" id="vm._id">
          <label class="form-check-label" for="inlineCheckbox1">{{vm.vmName}}</label>
          </div>
          <br/>
        <button type="submit" class="btn btn-warning">Edit Type of Change</button>
      </form>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/';

export default {
  name: 'Home',
  data: () => ({
    vm: '',
    toChange: '',
    newLog: '',
    newChangeType: '',
    newRobotType: '',
    newClient: '',
    newVMs: [],
    toSend: [],
    error: '',
    log: [],
    filters: ['Log', 'Type of Change', 'Client', 'VMs', 'Robot Type'],
    id: '',
    clients: [],
    VMs: [],
    index: '',
    robotTypes: [],
    token: localStorage.getItem('jwt'),
    typesOfChange: ['Bug Fix', 'New Logic', 'New Workflow', 'New Bot', 'Other'],
  }),
  created() {
    this.id = this.$route.params.id;
  },

  mounted() {
    const singleLogApi = `${API_URL}logs/${this.id}`;
    fetch(singleLogApi).then((response) => response.json()).then((result) => {
      this.log = result;
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
    editLog() {
      const singleLogApi = `${API_URL}logs/${this.id}`;
      if (this.toChange === 'Log') {
        this.toSend = {
          token: this.token,
          toChange: this.toChange,
          newLog: this.newLog,
        };
      } else if (this.toChange === 'Type of Change') {
        this.toSend = {
          token: this.token,
          toChange: this.toChange,
          newChangeType: this.newChangeType,
        };
      } else if (this.toChange === 'Client') {
        this.toSend = {
          token: this.token,
          toChange: this.toChange,
          newClient: this.newClient,
        };
      } else if (this.toChange === 'VMs') {
        this.toSend = {
          token: this.token,
          toChange: this.toChange,
          newVMs: this.newVMs,
        };
      } else if (this.toChange === 'Robot Type') {
        this.toSend = {
          token: this.token,
          toChange: this.toChange,
          newRobotType: this.newRobotType,
        };
      } else {
        this.error = 'Failed to edit log. PLease try again.';
        return;
      }
      fetch(singleLogApi, {
        method: 'PUT',
        body: JSON.stringify(this.toSend),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        if (result.message) {
          // there was an eror...
          const error = result.message;
          this.error = error;
        } else if (result.auth === false) {
          const error = ('You are unauthorised to make this request at this time');
          this.error = error;
        } else {
          fetch(singleLogApi).then((response) => response.json()).then((rslt) => {
            this.log = rslt;
          });
          this.toChange = '';
        }
      });
    },
    getOnlyClientVMs(VMs) {
      let temp = [];
      let tempReturn = [];
      for (let i = 0; i < VMs.length; i += 1) {
        if (VMs[i].client === this.log.client) {
          temp.push(VMs[i]);
        }
      }
      tempReturn = temp;
      temp = [];
      return tempReturn;
    },
    addVm(vmName) {
      if (this.newVMs.includes(vmName)) {
        this.index = this.newVMs.indexOf(vmName);
        if (this.index !== -1) {
          this.newVMs.splice(this.index, 1);
        }
      } else {
        this.newVMs.push(vmName);
      }
      this.newVMs.sort();
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
