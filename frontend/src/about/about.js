import { ref, onMounted, onUnmounted } from 'vue'

// ─── DATA ─────────────────────────────────────────────────────────────

export const chefTags = [
  '🇯🇵 Tokyo trained',
  '🔪 Omakase specialist',
  '🐟 Tsukiji certified',
  '⭐ 20yr experience',
]

export const values = [
  {
    icon: '🔥',
    num: '01',
    title: 'Fearless Flavor',
    desc: 'We create rolls that punch hard and stay unforgettable. No mild, no safe, no boring.',
    accent: '#f07b10',
  },
  {
    icon: '🐟',
    num: '02',
    title: 'Daily Fresh Fish',
    desc: "Fish delivered every morning from Mercabarna. If it doesn't pass the smell test, it doesn't make the cut.",
    accent: '#0ea5e9',
  },
  {
    icon: '🎌',
    num: '03',
    title: 'Tokyo Technique',
    desc: 'Zero shortcuts. Our itamae brings 20 years of Japanese training to every grain of rice.',
    accent: '#c8201a',
  },
  {
    icon: '🎵',
    num: '04',
    title: 'Night Energy',
    desc: 'Bass-heavy playlists, neon lights, and a vibe inspired by underground Tokyo nightlife.',
    accent: '#9b59b6',
  },
  {
    icon: '🌿',
    num: '05',
    title: 'Local & Seasonal',
    desc: "Barcelona's Catalan markets supply what Tokyo can't. Local produce. Global soul.",
    accent: '#22c55e',
  },
  {
    icon: '⚡',
    num: '06',
    title: 'Express Delivery',
    desc: 'From kitchen to door in under 30 minutes. Guaranteed cold chain. No compromise on freshness.',
    accent: '#f5c842',
  },
]

export const timeline = [
  {
    year: '2013',
    title: 'The Beginning',
    desc: 'Kenji Mori arrives in Barcelona from Tokyo with a single knife case and a big idea.',
  },
  {
    year: '2015',
    title: 'Dragon Fire Goes Viral',
    desc: 'Featured in Time Out Barcelona. Queues around the block.',
  },
  {
    year: '2017',
    title: 'El Raval',
    desc: 'We move to a bigger kitchen and expand the menu.',
  },
  {
    year: '2019',
    title: 'Delivery Launch',
    desc: '30-minute delivery guarantee across Barcelona.',
  },
  {
    year: '2021',
    title: '4.9 on Google',
    desc: 'Thousands of reviews and top-rated sushi in the city.',
  },
  {
    year: '2025',
    title: 'Still Kicking',
    desc: 'Same fire, better execution.',
  },
]

export const locationDetails = [
  {
    icon: '📍',
    label: 'Address',
    content: 'Carrer del Drac Roig 27<br />El Raval, 08001 Barcelona',
  },
  {
    icon: '📞',
    label: 'Reservations',
    content: '+34 93 777 13 37',
    href: 'tel:+34937771337',
  },
  {
    icon: '🚇',
    label: 'Getting here',
    content: 'Metro L3 · Liceu (4 min walk)<br />Bus 59, 91',
  },
]

export const hours = [
  { days: 'Mon – Thu', time: '13:00 – 23:00' },
  { days: 'Fri – Sat', time: '12:00 – 00:30' },
  { days: 'Sunday', time: '13:00 – 22:00' },
]

// ─── ANIMATIONS ───────────────────────────────────────────────────────

export const timelineRefs = ref(new Set())

let fadeObserver = null
let timelineObserver = null

function initObservers() {
  fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.fade-up').forEach((el) => {
    fadeObserver.observe(el)
  })

  timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          timelineObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  )

  timelineRefs.value.forEach((el) => {
    if (el) timelineObserver.observe(el)
  })
}

function destroyObservers() {
  fadeObserver?.disconnect()
  timelineObserver?.disconnect()
}

// ─── COMPOSABLE ──────────────────────────────────────────────────────

export function useAboutPage() {
  onMounted(initObservers)
  onUnmounted(destroyObservers)

  return {
    timelineRefs,
  }
}