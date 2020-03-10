// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './flexiable'
import axios from 'axios'
import axiosSugar from './vendor/axios'
import lazyload from './vendor/lazyload'
import bus from './bus'
import store from './vuex'

Vue.use(axiosSugar, {
  axios: axios.create({
    timeout: 5000
  })
})
Vue.use(bus)
Vue.use.apply(Vue, lazyload)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
