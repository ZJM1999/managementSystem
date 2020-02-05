import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//按需导入
import { Form,FormItem  } from 'element-ui';
import { Input } from 'element-ui';
import { Button } from 'element-ui';
import { Message } from 'element-ui';

//导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
// Vue.use(Message)

Vue.prototype.$axios = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
