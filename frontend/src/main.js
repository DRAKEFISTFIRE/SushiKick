import { createApp } from 'vue'
import './style.css'
import Home from './home/home.vue'
import router from './router'

createApp(Home).use(router).mount('#app')