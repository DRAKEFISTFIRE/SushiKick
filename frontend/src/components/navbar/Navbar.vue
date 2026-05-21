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
import { ref, onMounted, onUnmounted } from 'vue'
import './navbar.css'

const isScrolled = ref(false)
const menuOpen   = ref(false)
const activeLink = ref('/')

const links = [
  { href: '/',         label: 'Home',     jp: 'ホーム'        },
  { href: '/menu',     label: 'Menu',     jp: 'メニュー'       },
  { href: '/specials', label: 'Specials', jp: '特別'          },
  { href: '/about',    label: 'About',    jp: '私たちについて'  },
  { href: '/contact',  label: 'Contact',  jp: '連絡先'        },
]

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
  window.addEventListener('scroll', handleScroll, { passive: true })
  activeLink.value = window.location.pathname || '/'
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
