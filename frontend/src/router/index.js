import { createRouter, createWebHistory } from 'vue-router'

import Home from '../home/home.vue'
import About from '../about/about.vue'
import Menu from '../menu/menu.vue'
import Carta from '../carta/carta.vue'
import Pedido from '../pedido/pedido.vue'
import Perfil from '../perfil/perfil.vue'
import Reservations from '../reserv/reservations.vue'
import Contact from '../contact/contact.vue'
import Login from '../login/login.vue'
import Dashboard from '../admin/dashboard.vue'


// archivos con proteccion
import AuthRoute from './AuthRoute.js'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/menu', component: Menu },
  { path: '/carta', component: Carta },
  { path: '/pedido', component: Pedido },
  { path: '/perfil', component: Perfil },
  { path: '/reservations', component: Reservations },
  { path: '/contact', component: Contact },
  { path: '/login', beforeEnter: AuthRoute, component: Login },
  { path: '/dashboard', component: Dashboard },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})