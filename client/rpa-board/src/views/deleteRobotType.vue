<template>
  <div class="mt-3 mb-3">
    <div>
      <h3>Delete Robot Type</h3>
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
        <label for="exampleFormControlSelect2">Select Robot Type</label>
        <select v-model="filters.robotType" class="form-control" id="robotType" value="" required>
          <option v-for="robotType in robotTypes" :key="robotType._id">
          {{robotType.robotTypeName}}</option>
        </select>
        </div>
      </div>
      <button class="btn btn-danger" type="button" data-toggle="modal"
      data-target="#deleteModal" v-on:click="toDelete.id=filters.robotType">
      Delete RobotType </button>
    </form>
    <hr>
    <div class="modal fade" id="deleteModal" tabindex="-1"
    role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Confirm Robot type Deletion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Please confirm you would like to delete this Robot Type.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal"
            v-on:click="deleteRobotType()">Delete Robot Type</button>
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
    toDelete: {
      id: '',
      token: localStorage.getItem('jwt'),
    },
    error: '',
    filters: {
      robotType: '',
    },
    index: '',
    robotTypes: [],
  }),

  mounted() {
    const allRobotTypesApi = `${API_URL}all-robot-types/`;
    fetch(allRobotTypesApi).then((response) => response.json()).then((result) => {
      this.robotTypes = result;
    });
  },

  methods: {
    deleteRobotType() {
      this.toDelete.id = this.findId();
      const RT_API_URL = `${API_URL}robot-type/`;
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
          const allRobotTypesApi = `${API_URL}all-robot-types/`;
          fetch(allRobotTypesApi).then((response) => response.json()).then((rts) => {
            this.robotTypes = rts;
          });
        }
      });
    },
    findId() {
      // eslint-disable-next-line
      console.log(this.filters.robotType);
      for (let i = 0; i < this.robotTypes.length; i += 1) {
        if (this.robotTypes[i].robotTypeName === this.filters.robotType) {
          // eslint-disable-next-line
          return this.robotTypes[i]._id;
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
