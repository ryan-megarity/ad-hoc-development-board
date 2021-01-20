<template>
  <div>
    <h3 class="mt-3">Add Robot Type</h3>
    <hr>
    <button @click="showClientForm = !showClientForm" type="button"
    class="btn btn-light mb-3">Toggle New Robot Type Form</button>
    <form v-if="showClientForm" @submit.prevent="addRobotType"
    class="mb-3">
      <div v-if= "error" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong><p clas="mb-0">{{error}}</p>
        <button @click="error = ''" type="button" class="close"
        data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="form-group">
        <label for="robotTypeName">Robot Type</label>
        <input type="text" class="form-control" :value="robotType.robotTypeName" required
        @input="robotType.robotTypeName = $event.target.value.toUpperCase()">
      </div>
      <button type="submit" class="btn btn-dark">Add Robot Type</button>
    </form>
     <div>
      <hr>
      <h4 class="fixed">Recently Added Robot Types</h4>
      <hr>
    </div>
    <div class="list-unstyled" v-for="robotType in robotTypes" :key="robotType._id">
      <li class="media">
        <div class="media-body">
          <small class = "fixed">Robot Type: </small>
          <small class="data">{{robotType.robotTypeName}}</small>
          <br/>
          <small class = "fixed">Created by: </small>
          <small class="data">{{robotType.author}}</small>
          <br/>
          <small class = "fixed">Date created: </small>
          <small class="data">{{robotType.dateCreated}}</small>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = 'https://portfolio-dev-board-backend.herokuapp.com/add-robot-type/';
export default {
  name: 'addClient',
  data: () => ({
    showClientForm: false,
    error: '',
    robotTypes: [],
    robotType: {
      robotTypeName: '',
      author: localStorage.getItem('user'),
      token: localStorage.getItem('jwt'),
    },
  }),

  mounted() {
    fetch(API_URL).then((response) => response.json()).then((result) => {
      this.robotTypes = result;
    });
  },

  methods: {
    addRobotType() {
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.robotType),
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
          this.robotTypes.unshift(result);
          if (this.robotTypes.length > 5) {
            this.robotTypes.pop();
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
