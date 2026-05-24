import { ref, nextTick, onMounted, onUnmounted } from 'vue'

// ─── DATA ─────────────────────────────────────────────────────────────────────
// Plain constants — zero reactivity needed, they never mutate at runtime.

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
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1400&auto=format&fit=crop'
  },

  {
    icon: '🐟',
    num: '02',
    title: 'Daily Fresh Fish',
    desc: "Fish delivered every morning from Mercabarna. If it doesn't pass the smell test, it doesn't make the cut.",
    accent: '#0ea5e9',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1400&auto=format&fit=crop'
  },

  {
    icon: '🎌',
    num: '03',
    title: 'Tokyo Technique',
    desc: 'Zero shortcuts. Our itamae brings 20 years of Japanese training to every single grain of rice.',
    accent: '#c8201a',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1400&auto=format&fit=crop'
  },

  {
    icon: '🎵',
    num: '04',
    title: 'Night Energy',
    desc: 'Bass-heavy playlists, neon lights, and a vibe born from underground Tokyo nightlife culture.',
    accent: '#9b59b6',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1400&auto=format&fit=crop'
  },

  {
    icon: '🌿',
    num: '05',
    title: 'Local & Seasonal',
    desc: "Barcelona's Catalan markets supply what Tokyo can't. Local produce. Global soul.",
    accent: '#22c55e',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1400&auto=format&fit=crop'
  },

  {
    icon: '⚡',
    num: '06',
    title: 'Express Delivery',
    desc: 'From kitchen to door in under 30 minutes. Guaranteed cold chain. Zero compromise on freshness.',
    accent: '#f5c842',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1400&auto=format&fit=crop'
  },
]

export const timeline = [
  { year: '2013', title: 'The Beginning',           desc: 'Kenji Mori arrives from Tokyo with one knife case and a big idea. A 20-seat space opens in El Born.' },
  { year: '2015', title: 'Dragon Fire Goes Viral',  desc: 'Time Out Barcelona features the Dragon Fire roll. Queues wrap around the block for the first time.' },
  { year: '2017', title: 'Moving to El Raval',      desc: 'We outgrow El Born. New kitchen, bigger team, the menu grows to 47 signature rolls.' },
  { year: '2019', title: 'Delivery Launched',       desc: '30-minute delivery guarantee across Barcelona. Cold chain, no excuses, day one.' },
  { year: '2021', title: '4.9★ on Google',          desc: 'Over 4,000 reviews. Voted #1 sushi in Barcelona by Time Out readers for two years running.' },
  { year: '2025', title: 'Still Kicking',           desc: "12 years in. Still sourcing fish at 5am and torching salmon at midnight. Same fire. Better rolls." },
]

export const locationDetails = [
  { icon: '📍', label: 'Address',      content: 'Carrer del Drac Roig 27<br />El Raval, 08001 Barcelona' },
  { icon: '📞', label: 'Reservations', content: '+34 93 777 13 37', href: 'tel:+34937771337' },
  { icon: '🚇', label: 'Getting here', content: 'Metro L3 · Liceu (4 min walk)<br />Bus 59, 91 · Carrer Hospital' },
]

export const hours = [
  { days: 'Mon – Thu', time: '13:00 – 23:00' },
  { days: 'Fri – Sat', time: '12:00 – 00:30' },
  { days: 'Sunday',    time: '13:00 – 22:00' },
]

export const stats = [
  { num: '12+',  label: 'Years rolling' },
  { num: '47',   label: 'Signature rolls' },
  { num: '98%',  label: 'Happy faces' },
  { num: '4.9★', label: 'Google rating' },
]

// ─── COMPOSABLE ───────────────────────────────────────────────────────────────
// Fresh state per component instance — NO module-level shared refs.

export function useAboutPage() {
  // Index-keyed array — set via setTimelineRef(el, i) from the template.
  const timelineRefs = ref([])

  let fadeObserver    = null
  let timelineObserver = null

  // Called by :ref="(el) => setTimelineRef(el, index)" in the v-for.
  // Using index assignment (not push) keeps the array dense & ordered
  // and handles Vue's null teardown calls safely.
  function setTimelineRef(el, index) {
    if (el) {
      timelineRefs.value[index] = el
    }
  }

  function initFadeObserver() {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            fadeObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    document.querySelectorAll('.fade-up').forEach((el) => fadeObserver.observe(el))
  }

  function initTimelineObserver() {
    timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            timelineObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    timelineRefs.value.forEach((el) => {
      if (el) timelineObserver.observe(el)
    })
  }

  onMounted(async () => {
    // nextTick guarantees all :ref callbacks from v-for have fired
    // before we start observing — this is the key fix for the timeline.
    await nextTick()
    initFadeObserver()
    initTimelineObserver()
  })

  onUnmounted(() => {
    fadeObserver?.disconnect()
    timelineObserver?.disconnect()
    timelineRefs.value = []   // release DOM node references
  })

  return { timelineRefs, setTimelineRef }
}