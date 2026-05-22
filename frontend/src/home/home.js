import { ref, onMounted, onBeforeUnmount } from 'vue'

/* =========================
   ASSETS
========================= */

export const logoImg = '/images/Logo.png'

/*
  Nuxt/Vite best practice:
  - videos inside /public
  - accessed with absolute path
*/

export const heroVideos = [
  '/videos/video1home.mp4',
  '/videos/video2home.mp4',
  '/videos/video3home.mp4',
]

/* =========================
   HERO VIDEO SYSTEM
========================= */

export function useHeroVideo() {
  const currentVideo = ref(0)
  const videoRef = ref(null)

  const playCurrentVideo = async () => {
    const video = videoRef.value

    if (!video) return

    try {
      video.load()

      await video.play()
    } catch (error) {
      console.error('Video autoplay failed:', error)
    }
  }

  const nextVideo = async () => {
    currentVideo.value =
      (currentVideo.value + 1) % heroVideos.length

    await playCurrentVideo()
  }

  const handleVideoEnd = async () => {
    await nextVideo()
  }

  onMounted(() => {
    const video = videoRef.value

    if (!video) return

    video.addEventListener('ended', handleVideoEnd)

    playCurrentVideo()
  })

  onBeforeUnmount(() => {
    const video = videoRef.value

    if (!video) return

    video.removeEventListener('ended', handleVideoEnd)
  })

  return {
    videoRef,
    currentVideo,
    heroVideos,
  }
}

/* =========================
   FEATURED ROLLS
========================= */

export const rolls = [
  {
    name: 'Dragon Fire',
    emoji: '🐉',
    tag: 'BEST SELLER',
    desc:
      'Spicy tuna, mango, jalapeño, topped with torched salmon & sriracha aioli.',
    price: '€16.90',
    heat: 5,
    color: '#ff3b33',
  },

  {
    name: 'Black Ninja',
    emoji: '🥷',
    tag: "CHEF'S PICK",
    desc:
      'Squid ink rice, smoked eel, cream cheese, cucumber & tobiko crust.',
    price: '€15.50',
    heat: 3,
    color: '#9b59b6',
  },

  {
    name: 'Golden Kick',
    emoji: '✨',
    tag: 'NEW',
    desc:
      'King prawn tempura, avocado, yuzu mayo, gold sesame & crispy shallots.',
    price: '€17.90',
    heat: 2,
    color: '#f5c842',
  },

  {
    name: 'Tsunami Wave',
    emoji: '🌊',
    tag: 'SPICY',
    desc:
      'Bluefin tuna, crispy rice, wasabi guacamole, ponzu & micro-herbs.',
    price: '€19.50',
    heat: 4,
    color: '#0ea5e9',
  },
]

/* =========================
   WHY ITEMS
========================= */

export const whyItems = [
  {
    icon: '🐟',
    title: 'Daily fresh fish',
    desc:
      'Sourced every morning from Mercabarna and Tsukiji partners.',
  },

  {
    icon: '⚡',
    title: 'Express delivery',
    desc:
      'From kitchen to door in under 30 minutes, guaranteed cold chain.',
  },

  {
    icon: '🎌',
    title: 'Japanese technique',
    desc:
      'Our itamae trained in Tokyo. Zero shortcuts, pure craft.',
  },
]

/* =========================
   STATS
========================= */

export const stats = [
  {
    num: '12+',
    label: 'Years rolling',
  },

  {
    num: '47',
    label: 'Signature rolls',
  },

  {
    num: '98%',
    label: 'Happy faces',
  },

  {
    num: '4.9★',
    label: 'Google rating',
  },
]

/* =========================
   HERO PARTICLES
========================= */

export function sparkStyle(i) {
  const angle = (i / 18) * 360

  const radius =
    30 + Math.random() * 40

  const delay =
    (i * 0.3).toFixed(1)

  const size =
    3 + Math.floor(Math.random() * 5)

  return {
    '--angle': `${angle}deg`,
    '--radius': `${radius}%`,
    '--delay': `${delay}s`,
    '--size': `${size}px`,
  }
}