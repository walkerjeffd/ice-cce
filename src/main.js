// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import store from './store';
import config from './config';

Vue.config.productionTip = false;

axios.defaults.baseURL = config[process.env.NODE_ENV].api.url;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
});
