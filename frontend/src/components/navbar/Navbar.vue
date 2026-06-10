<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar__inner">

      <!-- LOGO -->
      <a href="/" class="navbar__logo">
        <img
            src="/images/Logo.png"
            alt="Sushi Kick"
            class="navbar__logo-img"
            />
        <div class="navbar__logo-text">
          <span>SUSHI</span>
          <span>KICK</span>
        </div>
      </a>

      <!-- NAV LINKS (desktop) -->
      <ul class="navbar__links" :class="{ 'mobile-open': menuOpen }">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            :data-jp="link.jp"
            :class="{ active: activeLink === link.href }"
            @click="setActive(link.href)"
          >
            {{ link.label }}
          </a>
        </li>

        <li v-if="userId"><a href="#" data-jp="ログアウト"@click.prevent="tancarSessio">Log Out</a></li>
      </ul>

      <!-- HAMBURGER -->
      <button
        class="navbar__hamburger"
        :class="{ open: menuOpen }"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>
  </nav>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import './navbar.css'

const isScrolled = ref(false)
const menuOpen = ref(false)
const activeLink = ref('/')

const userId = ref(null)
const userRole = ref(null)

const allLinks = [
  { href: '/', label: 'Home', jp: 'ホーム', public: true },
  { href: '/about', label: 'About', jp: '私たちについて', public: true },
  { href: '/menu', label: 'Menu', jp: 'メニュー', public: true },
  { href: '/contact', label: 'Contact', jp: '連絡先', public: true },

  { href: '/login', label: 'Login', jp: 'ログイン', guest: true },

  { href: '/carta', label: 'Carta', jp: 'お品書き', auth: true },
  { href: '/reservations', label: 'Reservations', jp: '予約', auth: true },
  { href: '/perfil', label: 'Perfil', jp: 'プロフィール', auth: true },

  { href: '/dashboard', label: 'Dashboard', jp: '管理', roles: ['admin', 'repartidor', 'trabajador'] }
]

const links = computed(() => {
  const loggedIn = !!userId.value

  return allLinks.filter(link => {
    if (link.public) return true

    if (link.guest) return !loggedIn

    if (link.auth) return loggedIn

    if (link.roles) {
      return loggedIn && link.roles.includes(userRole.value)
    }

    return false
  })
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function setActive(href) {
  activeLink.value = href
  menuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 40
}

function tancarSessio() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_id')
  localStorage.removeItem('role')
  localStorage.removeItem('isAuthenticated')

  userId.value = null
  userRole.value = null

  window.location.href = '/'
}

onMounted(() => {
  userId.value = localStorage.getItem('user_id')
  userRole.value = localStorage.getItem('role') // admin, user, etc.

  window.addEventListener('scroll', handleScroll, { passive: true })
  activeLink.value = window.location.pathname || '/'
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>