import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import MapVue from '../views/Map.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {name: 'map'}
  },
  {
    path: '/map',
    name: 'map',
    component: MapVue
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
