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
      </ul>

      <!-- CTA -->
      <div class="navbar__cta">
        <a href="/order" class="btn-order">
          🥢 ORDER NOW
        </a>
      </div>

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
  { href: '/logout', label: 'Log Out', jp: 'ログアウト', auth: true },

  { href: '/dashboard', label: 'Dashboard', jp: '管理', role: 'admin' }
]

const links = computed(() => {
  const loggedIn = !!userId.value

  return allLinks.filter(link => {
    // Siempre visibles
    if (link.public) return true

    // Login solo si NO está autenticado
    if (link.guest) return !loggedIn

    // Enlaces de usuario autenticado
    if (link.auth) return loggedIn

    // Dashboard solo para admin
    if (link.role) {
      return loggedIn && userRole.value === link.role
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