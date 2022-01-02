import Vue from 'vue'
import VueRouter from "vue-router";

import Inventory from './views/Inventory.vue'
import Main from './views/Main.vue'
import Details from './views/Details.vue'

Vue.use(VueRouter)

const routes = [
  /*
  {
    path: '/frontend/',
    name: 'frontend',
    component: Frontend,
    props:  (route) => ({
      ...route.params
  })
  },*/
  {
    path: '/',
    name: 'main',
    component: Main
  },
  {
    path: '/details',
    name: 'details',
    component: Details,
    props: true
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: Inventory
  }
  ];

  export default new VueRouter({
    routes: routes
  });
  