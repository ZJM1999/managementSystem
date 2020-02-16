import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入element-ui
import elements from '@/plugins/element.js'

//导入vue-table-with-tree-grid插件
import tableTree from 'vue-table-with-tree-grid'

//导入axios
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//保存登录token 确保以后每一次请求都必须携带token值
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


Vue.prototype.$axios = axios
Vue.config.productionTip = false

//全局定义tableTree的组件
Vue.component('table-tree', tableTree)

//定义全局时间过滤器
Vue.filter('timeFilter', function (data) {
  const time = new Date(data)

  const y = time.getFullYear()

  const m = (time.getMonth() + 1).toString().padStart(2, '0')

  const d = time.getDate().toString().padStart(2, '0')

  const hh = time.getUTCHours().toString().padStart(2, '0')

  const mm = time.getMinutes().toString().padStart(2, '0')

  const ss = time.getSeconds().toString().padStart(2, '0')

  //return出去外部使用
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})



//注册全局vue-quill-editor插件组件
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
