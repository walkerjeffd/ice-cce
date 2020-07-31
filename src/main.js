import Vue from 'vue';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

