<template>
  <div>
    <h3 class="mt-3">Add Log</h3>
    <hr>
    <button @click="showLogForm = !showLogForm" type="button"
    class="btn btn-light mt-3 mb-3">Toggle New Log Form</button>
    <form v-if="showLogForm" @submit.prevent="addLog"
    class="mb-3">
      <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong><p clas="mb-0">{{error}}</p>
        <button @click="error = ''" type="button" class="close"
        data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="form-group">
        <label for="log">Log</label>
        <textarea v-model="log.log"
        class="form-control" id="log" value="" required></textarea>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect3">Select Type of Change</label>
        <select v-model="log.typeOfChange" class="form-control" id="typeOfChange" value="" required>
          <option v-for="type in typesOfChange" :key="type">{{type}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect1">Select Client</label>
        <select v-model="log.client" class="form-control" id="client" value="" required>
          <option v-for="client in clients" :key="client._id">{{client.clientName}}</option>
        </select>
      </div>
      <div v-if="log.client">
      <label for="vm">Select VMs Affected</label>
      <br/>
      </div>
      <div class="form-check form-check-inline mb-2" v-for="vm in getOnlyClientVMs(VMs, log.client)"
      :key="vm._id" v-bind:value="vm.vmName">
      <input v-on:click="addVm(vm.vmName)" class="form-check-input" type="checkbox" id="vm">
      <label class="form-check-label" for="inlineCheckbox1">{{vm.vmName}}</label>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect2">Select Robot Type</label>
        <select v-model="log.robotType" class="form-control" id="robotType" value="" required>
          <option v-for="robotType in robotTypes" :key="robotType._id">
          {{robotType.robotTypeName}}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-dark">Add Log</button>
    </form>
    <div>
      <hr>
      <h4 class="fixed">Recent Logs</h4>
      <hr>
    </div>
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
const API_URL = process.env.API_URL;

export default {
  name: 'Home',
  data: () => ({
    showLogForm: false,
    showVMs: false,
    toDelete: {
      id: '',
      token: localStorage.getItem('jwt'),
    },
    vm: '',
    error: '',
    logs: [],
    log: {
      log: '',
      token: localStorage.getItem('jwt'),
      typeOfChange: '',
      client: '',
      vm: [],
      robotType: '',
      author: localStorage.getItem('user'),
    },
    clients: [],
    VMs: [],
    index: '',
    robotTypes: [],
    typesOfChange: ['Bug Fix', 'New Logic', 'New Workflow', 'New Bot', 'Other'],
  }),

  mounted() {
    fetch(API_URL).then((response) => response.json()).then((result) => {
      this.logs = result;
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
    addLog() {
      // eslint-disable-next-line
      console.log(this.log);
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.log),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        if (result.details) {
          // there was an eror...
          const error = result.details.map((detail) => detail.log).join('. ');
          this.error = error;
        } else {
          this.logs.unshift(result);
          if (this.logs.length > 5) {
            this.logs.pop();
          }
          this.error = '';
          this.showLogForm = !this.showLogForm;
        }
      });
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
    addVm(vmName) {
      if (this.log.vm.includes(vmName)) {
        this.index = this.log.vm.indexOf(vmName);
        if (this.index !== -1) {
          this.log.vm.splice(this.index, 1);
        }
      } else {
        this.log.vm.push(vmName);
      }
      this.log.vm.sort();
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
  border-top: 3px solid rgba(255,255,255,0.5);
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
