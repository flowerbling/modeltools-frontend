import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import ElementUI from 'element-ui'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import router from './router'

Vue.use(ElementUI)
Vue.config.productionTip = false

const BaseUrl = 'http://127.0.0.1:8000'
axios.defaults.baseURL = BaseUrl
axios.defaults.headers.Authorization = localStorage.getItem('Authorization')

Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
