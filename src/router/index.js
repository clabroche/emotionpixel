import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import YearsVue from '../views/Years.vue'
import MonthVue from '../views/Month.vue'
import StatisticsVue from '../views/Statistics.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {name: 'years'}
  },
  {
    path: '/years',
    name: 'years',
    component: YearsVue
  },
  {
    path: '/month',
    name: 'month',
    component: MonthVue
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatisticsVue
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Login,
    props: {register: true}
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
