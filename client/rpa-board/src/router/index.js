import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import addVM from '../views/addVM.vue';
import addClient from '../views/addClient.vue';
import addRobotType from '../views/addRobotType.vue';
import LoginComponent from '../views/login.vue';
import registerComponent from '../views/register.vue';
import viewLogsComponent from '../views/viewLogs.vue';
import editComponent from '../views/Edit.vue';
import deleteClientComponent from '../views/deleteClient.vue';
import deleteVMComponent from '../views/deleteVM.vue';
import deleteRobotTypeComponent from '../views/deleteRobotType.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { auth: true },
  },
  {
    path: '/register',
    component: registerComponent,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
  },
  {
    path: '/add-vm',
    name: 'addVM',
    component: addVM,
    meta: { auth: true },
  },
  {
    path: '/add-client',
    name: 'addClient',
    component: addClient,
    meta: { auth: true },
  },
  {
    path: '/add-robot-type',
    name: 'addRobotType',
    component: addRobotType,
    meta: { auth: true },
  },
  {
    path: '/view-logs',
    name: 'viewLogs',
    component: viewLogsComponent,
    meta: { auth: true },
  },
  {
    path: '/logs/:id',
    name: 'editLogs',
    component: editComponent,
    meta: { auth: true },
  },
  {
    path: '/delete-client',
    name: 'deleteClient',
    component: deleteClientComponent,
    meta: { auth: true },
  },
  {
    path: '/delete-vm',
    name: 'deleteVM',
    component: deleteVMComponent,
    meta: { auth: true },
  },
  {
    path: '/delete-robot-type',
    name: 'deleteRobotType',
    component: deleteRobotTypeComponent,
    meta: { auth: true },
  },
];


const router = new VueRouter({
  routes,
});
const VERIFY_API_URL = 'https://art-rpa-dev-board.herokuapp.com/verify';
function isAuthorised(jwt) {
  return fetch(VERIFY_API_URL, {
    method: 'POST',
    body: JSON.stringify({
      token: jwt,
    }),
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json()).then((res) => res.auth);
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.auth)) {
    isAuthorised(localStorage.getItem('jwt')).then((res) => {
      if (res === true) {
        next();
      } else {
        router.push('/login');
      }
    }).catch(() => {
      router.push('/login');
    });
  } else {
    next();
  }
});

export default router;
