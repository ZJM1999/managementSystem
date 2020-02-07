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
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui';

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.prototype.$message = Message
