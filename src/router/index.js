import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('components/business/login/login')
const Home = () => import('components/business/home/Home')
const welcome = () => import('components/business/welcome/welcome')
//导入主要信息版块
const users = () => import('components/business/maininfo/users')
const roles = () => import('components/business/maininfo/roles')
const rights = () => import('components/business/maininfo/rights')
const reports = () => import('components/business/maininfo/reports')
const params = () => import('components/business/maininfo/params')
const orders = () => import('components/business/maininfo/orders')
const goods = () => import('components/business/maininfo/goods')
const categories = () => import('components/business/maininfo/categories')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:welcome
      },
      {
        path:'/users',
        component:users
      },
      {
        path:'/roles',
        component:roles
      },
      {
        path:'/rights',
        component:rights
      },
      {
        path:'/reports',
        component:reports
      },
      {
        path:'/params',
        component:params
      },
      {
        path:'/orders',
        component:orders
      },
      {
        path:'/goods',
        component:goods
      },
      {
        path:'/categories',
        component:categories
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
