import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入element-ui
import elements from '@/plugins/element.js'



//导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  
  return config
})


Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
