<template>
  <div class="ot-page">

    <!-- ══════════════════════════════════════
         CANCEL CONFIRMATION MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showCancelModal" class="ot-modal-backdrop" @click.self="showCancelModal = false">
        <div class="ot-modal">
          <div class="ot-modal__glow"></div>
          <div class="ot-modal__icon">⚠️</div>
          <h3 class="ot-modal__title">Vols cancel·lar la comanda?</h3>
          <p class="ot-modal__sub">
            La comanda <strong>#{{ orderId }}</strong> serà cancel·lada i no es processarà.
            Aquesta acció no es pot desfer.
          </p>
          <div class="ot-modal__actions">
            <button class="btn-ghost" @click="showCancelModal = false">Mantenir</button>
            <button class="btn-danger" :class="{ loading: cancelling }" @click="confirmCancel" :disabled="cancelling">
              <span v-if="!cancelling">Sí, cancel·lar</span>
              <span v-else class="ot-spinner" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         CANCELLED SCREEN
    ══════════════════════════════════════ -->
    <Transition name="success-fade">
      <div v-if="cancelled" class="ot-cancelled">
        <div class="ot-cancelled__card">
          <div class="ot-cancelled__icon">❌</div>
          <h2 class="ot-cancelled__title">Comanda cancel·lada</h2>
          <p class="ot-cancelled__sub">La comanda <strong>#{{ orderId }}</strong> ha estat cancel·lada.</p>
          <div class="ot-cancelled__actions">
            <router-link to="/carta" class="btn-primary">Tornar a la carta</router-link>
            <router-link to="/" class="btn-ghost">Inici</router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         MAIN TRACKER
    ══════════════════════════════════════ -->
    <template v-if="!cancelled">

      <!-- Header strip -->
      <header class="ot-header container">
        <div class="ot-header__left">
          <span class="ot-live-badge">
            <span class="ot-live-badge__pulse"></span>
            EN DIRECTE
          </span>
          <h1 class="ot-header__title">
            Comanda <em>#{{ orderId }}</em>
          </h1>
          <p class="ot-header__sub">{{ mapBadgeLabel }}</p>
        </div>
        <div class="ot-header__right">
          <button
            v-if="currentStepIndex < STEPS.length - 1"
            class="ot-cancel-btn"
            @click="showCancelModal = true"
          >
            <span class="ot-cancel-btn__icon">✕</span>
            Denegar comanda
          </button>
        </div>
      </header>

      <div class="ot-layout container">

        <!-- ════════════════════
             LEFT COL
        ════════════════════ -->
        <div class="ot-left">

          <!-- Time cards -->
          <div class="ot-time-cards">

            <!-- Prep time -->
            <div class="ot-time-card" :class="{ 'is-done': prepDone }">
              <div class="ot-time-card__label">
                <span class="ot-time-card__dot prep"></span>
                Preparació
              </div>
              <div class="ot-time-card__value">
                <span v-if="!prepDone" class="ot-time-card__countdown prep">{{ formatTime(prepRemaining) }}</span>
                <span v-else class="ot-time-card__done">✓ Llest</span>
              </div>
              <div class="ot-time-card__bar">
                <div class="ot-time-card__bar-fill prep" :style="{ width: prepProgress + '%' }"></div>
              </div>
              <p class="ot-time-card__meta">~{{ prepMinutes }} min estimats</p>
            </div>

            <!-- Delivery time -->
            <div class="ot-time-card" :class="{ 'is-done': deliveryDone }">
              <div class="ot-time-card__label">
                <span class="ot-time-card__dot delivery"></span>
                Entrega
              </div>
              <div class="ot-time-card__value">
                <span v-if="!deliveryStarted" class="ot-time-card__pending">Pendent</span>
                <span v-else-if="!deliveryDone" class="ot-time-card__countdown delivery">{{ formatTime(deliveryRemaining) }}</span>
                <span v-else class="ot-time-card__done">✓ Entregat!</span>
              </div>
              <div class="ot-time-card__bar">
                <div class="ot-time-card__bar-fill delivery" :style="{ width: deliveryProgress + '%' }"></div>
              </div>
              <p class="ot-time-card__meta">~{{ deliveryMinutes }} min estimats</p>
            </div>

            <!-- ETA -->
            <div class="ot-time-card ot-time-card--eta">
              <div class="ot-time-card__label">
                <span class="ot-time-card__dot eta"></span>
                Hora estimada d'arribada
              </div>
              <div class="ot-time-card__value ot-time-card__value--large">
                {{ etaTime }}
              </div>
              <div class="ot-eta-bar">
                <div
                  class="ot-eta-segment"
                  :class="{ done: prepDone }"
                  :style="{ flex: prepMinutes }"
                >
                  <span>Cuina</span>
                </div>
                <div
                  class="ot-eta-segment delivery"
                  :class="{ done: deliveryDone, active: deliveryStarted && !deliveryDone }"
                  :style="{ flex: deliveryMinutes }"
                >
                  <span>Camí</span>
                </div>
              </div>
              <p class="ot-time-card__meta">Temps total: {{ totalMinutes }} min</p>
            </div>

          </div>

          <!-- Step timeline -->
          <div class="ot-steps">
            <div class="ot-steps__header">
              <span class="ot-steps__title">SEGUIMENT</span>
              <span class="ot-steps__count">{{ currentStepIndex + 1 }} / {{ STEPS.length }}</span>
            </div>
            <div class="ot-steps__list">
              <div
                v-for="(step, i) in STEPS"
                :key="step.id"
                class="ot-step"
                :class="{
                  'is-done':    i < currentStepIndex,
                  'is-active':  i === currentStepIndex,
                  'is-pending': i > currentStepIndex,
                }"
              >
                <!-- Connector line -->
                <div v-if="i < STEPS.length - 1" class="ot-step__line">
                  <div class="ot-step__line-fill" :class="{ filled: i < currentStepIndex }"></div>
                </div>

                <!-- Icon node -->
                <div class="ot-step__node">
                  <div class="ot-step__node-bg">
                    <span v-if="i < currentStepIndex" class="ot-step__check">✓</span>
                    <span v-else class="ot-step__node-icon">{{ step.icon }}</span>
                  </div>
                  <div v-if="i === currentStepIndex" class="ot-step__pulse-ring"></div>
                  <div v-if="i === currentStepIndex" class="ot-step__pulse-ring delay"></div>
                </div>

                <!-- Text -->
                <div class="ot-step__body">
                  <div class="ot-step__row">
                    <span class="ot-step__title">{{ step.label }}</span>
                    <span class="ot-step__time" v-if="step.time">{{ step.time }}</span>
                  </div>
                  <Transition name="desc-fade">
                    <p class="ot-step__desc" v-if="i === currentStepIndex">{{ step.desc }}</p>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ════════════════════
             RIGHT COL: MAP
        ════════════════════ -->
        <div class="ot-map-col">

          <!-- Map status bar -->
          <div class="ot-map-topbar">
            <div class="ot-map-status" :class="mapBadgeClass">
              <span class="ot-map-status__dot"></span>
              <span class="ot-map-status__label">{{ mapBadgeLabel }}</span>
            </div>
            <div class="ot-map-coords" v-if="deliveryStarted && !deliveryDone">
              <span class="ot-map-coords__icon">🛵</span>
              <span>{{ riderDistanceLabel }}</span>
            </div>
          </div>

          <!-- Map container -->
          <div class="ot-map-wrapper">
            <div id="ot-map" ref="mapEl" class="ot-map"></div>
            <!-- Vignette overlay -->
            <div class="ot-map-vignette"></div>
          </div>

          <!-- Legend -->
          <div class="ot-map-footer">
            <div class="ot-map-legend">
              <span class="ot-legend-item">
                <span class="ot-legend-dot restaurant"></span>
                Restaurant
              </span>
              <span class="ot-legend-item">
                <span class="ot-legend-dot user"></span>
                Destí
              </span>
              <span v-if="deliveryStarted && !deliveryDone" class="ot-legend-item">
                <span class="ot-legend-dot rider"></span>
                Repartidor
              </span>
            </div>
            <div class="ot-map-route-info" v-if="deliveryStarted && !deliveryDone">
              <span class="ot-route-tag">{{ riderProgressPct }}% del trajecte</span>
            </div>
          </div>

        </div>

      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './order.css'

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
  orderId:         { type: [String, Number], default: '8821' },
  prepMinutes:     { type: Number, default: 12 },
  deliveryMinutes: { type: Number, default: 20 },
  restaurantLat:   { type: Number, default: 41.3785 },
  restaurantLng:   { type: Number, default: 2.1699  },
  userLat:         { type: Number, default: 41.3851 },
  userLng:         { type: Number, default: 2.1734  },
})

// ── Order steps ────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'rebuda',
    icon: '📋',
    label: 'Comanda rebuda',
    desc: 'Hem rebut la teva comanda i estem preparant tot.',
    time: null,
  },
  {
    id: 'preparant',
    icon: '🍣',
    label: 'En preparació',
    desc: 'Els nostres cuiners estan treballant en la teva comanda.',
    time: null,
  },
  {
    id: 'llest',
    icon: '✅',
    label: 'Llest per enviar',
    desc: 'La comanda està llesta i esperant el repartidor.',
    time: null,
  },
  {
    id: 'camí',
    icon: '🛵',
    label: 'En camí',
    desc: 'El repartidor ha agafat la teva comanda i va cap a tu!',
    time: null,
  },
  {
    id: 'entregat',
    icon: '🎉',
    label: 'Entregat!',
    desc: 'La teva comanda ha estat entregada. Bon profit!',
    time: null,
  },
]

// ── State ──────────────────────────────────────────────────────────────────

const currentStepIndex  = ref(1)
const prepElapsed       = ref(0)
const deliveryElapsed   = ref(0)
const showCancelModal   = ref(false)
const cancelling        = ref(false)
const cancelled         = ref(false)
const riderFrameRef     = ref(0)

const mapEl            = ref(null)
let leafletMap         = null
let riderMarker        = null
let routePolyline      = null
let glowPolyline       = null
let riderInterval      = null
let timerInterval      = null

// ── Computed timers ────────────────────────────────────────────────────────

const prepTotalSec      = computed(() => props.prepMinutes * 60)
const deliveryTotalSec  = computed(() => props.deliveryMinutes * 60)
const totalMinutes      = computed(() => props.prepMinutes + props.deliveryMinutes)

const prepRemaining     = computed(() => Math.max(0, prepTotalSec.value - prepElapsed.value))
const prepProgress      = computed(() => Math.min(100, (prepElapsed.value / prepTotalSec.value) * 100))
const prepDone          = computed(() => prepRemaining.value === 0)

const deliveryStarted   = computed(() => currentStepIndex.value >= 3)
const deliveryDone      = computed(() => currentStepIndex.value >= 4 && deliveryRemaining.value === 0)
const deliveryRemaining = computed(() => Math.max(0, deliveryTotalSec.value - deliveryElapsed.value))
const deliveryProgress  = computed(() => deliveryStarted.value
  ? Math.min(100, (deliveryElapsed.value / deliveryTotalSec.value) * 100)
  : 0)

const riderProgressPct  = computed(() => {
  const total = props.deliveryMinutes * 60
  return Math.round(Math.min(100, (riderFrameRef.value / total) * 100))
})

const riderDistanceLabel = computed(() => {
  const pct  = riderProgressPct.value / 100
  const dist = haversineKm(
    props.restaurantLat + (props.userLat - props.restaurantLat) * pct,
    props.restaurantLng + (props.userLng - props.restaurantLng) * pct,
    props.userLat,
    props.userLng,
  )
  if (dist < 0.1) return 'A punt d\'arribar!'
  return `${(dist * 1000).toFixed(0)} m restants`
})

const etaTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + totalMinutes.value)
  return now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
})

// ── Map badge ──────────────────────────────────────────────────────────────

const mapBadgeLabel = computed(() => {
  if (cancelled.value)              return 'Cancel·lat'
  if (currentStepIndex.value === 0) return 'Comanda rebuda'
  if (currentStepIndex.value === 1) return 'En preparació'
  if (currentStepIndex.value === 2) return 'Llest per enviar'
  if (currentStepIndex.value === 3) return 'En camí'
  return 'Entregat!'
})

const mapBadgeClass = computed(() => ({
  'is-riding':    currentStepIndex.value === 3,
  'is-delivered': currentStepIndex.value >= 4,
  'is-cancelled': cancelled.value,
}))

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function stampStep(index) {
  const now = new Date()
  STEPS[index].time = now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
}

// ── Timers & step progression ──────────────────────────────────────────────

function startTimers() {
  stampStep(0)
  stampStep(1)

  timerInterval = setInterval(() => {
    if (!prepDone.value) {
      prepElapsed.value++
      if (prepDone.value && currentStepIndex.value < 2) {
        currentStepIndex.value = 2
        stampStep(2)
        setTimeout(() => {
          currentStepIndex.value = 3
          stampStep(3)
        }, 3000)
      }
    } else if (deliveryStarted.value && !deliveryDone.value) {
      deliveryElapsed.value++
      if (deliveryDone.value) {
        currentStepIndex.value = 4
        stampStep(4)
      }
    }
  }, 1000)
}

// ── Leaflet map ────────────────────────────────────────────────────────────

async function initMap() {
  const { restaurantLat, restaurantLng, userLat, userLng } = props
  const midLat = (restaurantLat + userLat) / 2
  const midLng = (restaurantLng + userLng) / 2

  leafletMap = L.map(mapEl.value, {
    center: [midLat, midLng],
    zoom: 15,
    zoomControl: false,
    attributionControl: false,
  })

  // Refined dark tile layer
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', maxZoom: 19 }
  ).addTo(leafletMap)

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap)

  // Build curved route coordinates (simulate a curved path)
  const routePoints = buildCurvedRoute(
    [restaurantLat, restaurantLng],
    [userLat, userLng],
    24
  )

  // Glow line (wider, semi-transparent)
  glowPolyline = L.polyline(routePoints, {
    color: 'rgba(240,123,16,0.18)',
    weight: 14,
    lineCap: 'round',
    lineJoin: 'round',
  }).addTo(leafletMap)

  // Main dashed route line
  routePolyline = L.polyline(routePoints, {
    color: '#f07b10',
    weight: 2.5,
    dashArray: '6 5',
    lineCap: 'round',
    opacity: 0.65,
  }).addTo(leafletMap)

  // Markers
  const restaurantIcon = L.divIcon({
    html: `<div class="ot-map-marker ot-map-marker--restaurant">
      <div class="ot-map-marker__inner">🍣</div>
      <div class="ot-map-marker__ring"></div>
    </div>`,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })

  const userIcon = L.divIcon({
    html: `<div class="ot-map-marker ot-map-marker--user">
      <div class="ot-map-marker__inner">📍</div>
      <div class="ot-map-marker__ring"></div>
      <div class="ot-map-marker__shadow"></div>
    </div>`,
    className: '',
    iconSize: [44, 56],
    iconAnchor: [22, 50],
  })

  L.marker([restaurantLat, restaurantLng], { icon: restaurantIcon })
    .addTo(leafletMap)
    .bindPopup('<strong>Sushi Kick</strong><br>Carrer del Drac Roig 27')

  L.marker([userLat, userLng], { icon: userIcon })
    .addTo(leafletMap)
    .bindPopup('<strong>La teva adreça</strong>')

  // Fit bounds with padding
  const bounds = L.latLngBounds(
    [[restaurantLat, restaurantLng], [userLat, userLng]]
  )
  leafletMap.fitBounds(bounds, { padding: [60, 60] })

  watch(deliveryStarted, (val) => {
    if (val) startRiderAnimation(routePoints)
  })
}

// Build a slightly curved interpolated route
function buildCurvedRoute(from, to, steps) {
  const points = []
  // midpoint with a perpendicular offset to create a subtle arc
  const midLat = (from[0] + to[0]) / 2
  const midLng = (from[1] + to[1]) / 2
  const perpLat = midLat + (to[1] - from[1]) * 0.08
  const perpLng = midLng - (to[0] - from[0]) * 0.08

  for (let i = 0; i <= steps; i++) {
    const t  = i / steps
    const t2 = t * t
    const mt = 1 - t
    // Quadratic bezier
    const lat = mt * mt * from[0] + 2 * mt * t * perpLat + t2 * to[0]
    const lng = mt * mt * from[1] + 2 * mt * t * perpLng + t2 * to[1]
    points.push([lat, lng])
  }
  return points
}

function startRiderAnimation(routePoints) {
  const totalFrames = props.deliveryMinutes * 60
  let frame = 0

  const riderIcon = L.divIcon({
    html: `<div class="ot-map-marker ot-map-marker--rider">
      <div class="ot-map-marker__inner">🛵</div>
      <div class="ot-map-marker__ring anim"></div>
    </div>`,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })

  // Start at first point
  riderMarker = L.marker(routePoints[0], { icon: riderIcon, zIndexOffset: 1000 }).addTo(leafletMap)

  // Animate along curved route
  riderInterval = setInterval(() => {
    if (frame >= totalFrames) {
      clearInterval(riderInterval)
      return
    }
    riderFrameRef.value = frame
    const t = frame / totalFrames
    const segIndex = Math.floor(t * (routePoints.length - 1))
    const segT = (t * (routePoints.length - 1)) - segIndex
    const p1 = routePoints[Math.min(segIndex, routePoints.length - 1)]
    const p2 = routePoints[Math.min(segIndex + 1, routePoints.length - 1)]
    const lat = p1[0] + (p2[0] - p1[0]) * segT
    const lng = p1[1] + (p2[1] - p1[1]) * segT
    riderMarker.setLatLng([lat, lng])

    // Update the completed portion of route as a highlight
    if (glowPolyline) {
      const donePoints = routePoints.slice(0, segIndex + 2)
      glowPolyline.setLatLngs(donePoints)
    }

    frame++
  }, 1000)
}

// ── Cancel logic ───────────────────────────────────────────────────────────

async function confirmCancel() {
  cancelling.value = true
  try {
    await new Promise(r => setTimeout(r, 1200))
    cancelled.value      = true
    showCancelModal.value = false
    clearTimers()
  } finally {
    cancelling.value = false
  }
}

function clearTimers() {
  clearInterval(timerInterval)
  clearInterval(riderInterval)
}

// ── Lifecycle ──────────────────────────────────────────────────────────────

onMounted(async () => {
  startTimers()
  await initMap()
})

onUnmounted(() => {
  clearTimers()
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
})
</script>