import { createRouter, createWebHistory } from 'vue-router'

import Home from '../home/home.vue'
import About from '../about/about.vue'
import Menu from '../menu/menu.vue'
import Carta from '../carta/carta.vue'
import Pedido from '../pedido/pedido.vue'
import Reservations from '../reserv/reservations.vue'
import Contact from '../contact/contact.vue'
import Login from '../login/login.vue'
import Dashboard from '../admin/dashboard.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/menu', component: Menu },
  { path: '/carta', component: Carta },
  { path: '/pedido', component: Pedido },
  { path: '/reservations', component: Reservations },
  { path: '/contact', component: Contact },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})