import Vue from 'vue'

//ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//按需导入
import {
  Form,
  FormItem,
  Input,
  Button,
  Message
} from 'element-ui';

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
// Vue.use(Message)

Vue.prototype.$message = Message
