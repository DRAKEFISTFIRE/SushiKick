<template>
  <div class="ot-page">

    <!-- ══════════════════════════════════════
         CANCEL CONFIRMATION MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal-fade">
      <div v-if="showCancelModal" class="ot-modal-backdrop" @click.self="showCancelModal = false">
        <div class="ot-modal">
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
          <span class="section-tag">📡 SEGUIMENT EN DIRECTE</span>
          <h1 class="ot-header__title">
            Comanda <em>#{{ orderId }}</em>
          </h1>
        </div>
        <div class="ot-header__right">
          <!-- Only allow cancel if not already delivered -->
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
                <span v-if="!prepDone" class="ot-time-card__countdown">{{ formatTime(prepRemaining) }}</span>
                <span v-else class="ot-time-card__done">✓ Llest</span>
              </div>
              <div class="ot-time-card__bar">
                <div
                  class="ot-time-card__bar-fill prep"
                  :style="{ width: prepProgress + '%' }"
                ></div>
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
                <div
                  class="ot-time-card__bar-fill delivery"
                  :style="{ width: deliveryProgress + '%' }"
                ></div>
              </div>
              <p class="ot-time-card__meta">~{{ deliveryMinutes }} min estimats</p>
            </div>

            <!-- ETA -->
            <div class="ot-time-card ot-time-card--eta">
              <div class="ot-time-card__label">
                <span class="ot-time-card__dot eta"></span>
                Hora estimada
              </div>
              <div class="ot-time-card__value ot-time-card__value--large">
                {{ etaTime }}
              </div>
              <p class="ot-time-card__meta">Temps total: {{ totalMinutes }} min</p>
            </div>

          </div>

          <!-- Step timeline -->
          <div class="ot-steps">
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
                <span class="ot-step__node-icon">
                  <span v-if="i < currentStepIndex">✓</span>
                  <span v-else>{{ step.icon }}</span>
                </span>
                <!-- Pulse ring for active step -->
                <div v-if="i === currentStepIndex" class="ot-step__pulse"></div>
              </div>

              <!-- Text -->
              <div class="ot-step__body">
                <span class="ot-step__title">{{ step.label }}</span>
                <span class="ot-step__time" v-if="step.time">{{ step.time }}</span>
                <p class="ot-step__desc" v-if="i === currentStepIndex">{{ step.desc }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- ════════════════════
             RIGHT COL: MAP
        ════════════════════ -->
        <div class="ot-map-col">
          <div class="ot-map-header">
            <span class="ot-map-badge" :class="mapBadgeClass">
              <span class="ot-map-badge__dot"></span>
              {{ mapBadgeLabel }}
            </span>
          </div>
          <div id="ot-map" ref="mapEl" class="ot-map"></div>
          <div class="ot-map-legend">
            <span class="ot-legend-item"><span class="ot-legend-dot restaurant"></span> Restaurant</span>
            <span class="ot-legend-item"><span class="ot-legend-dot user"></span> Destí</span>
            <span v-if="deliveryStarted && !deliveryDone" class="ot-legend-item">
              <span class="ot-legend-dot rider"></span> Repartidor
            </span>
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
import './pedido.css'
import './Order.css'

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
  orderId:         { type: [String, Number], default: '8821' },
  prepMinutes:     { type: Number, default: 12 },
  deliveryMinutes: { type: Number, default: 20 },
  // Coordinates
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
    time: 'Ara mateix',
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

const currentStepIndex = ref(1)  // Start at "en preparació"

const prepElapsed   = ref(0)
const deliveryElapsed = ref(0)

const showCancelModal = ref(false)
const cancelling      = ref(false)
const cancelled       = ref(false)

const mapEl = ref(null)
let leafletMap     = null
let riderMarker    = null
let routePolyline  = null
let riderInterval  = null
let stepInterval   = null
let timerInterval  = null

// ── Computed timers ────────────────────────────────────────────────────────

const prepTotalSec     = computed(() => props.prepMinutes * 60)
const deliveryTotalSec = computed(() => props.deliveryMinutes * 60)
const totalMinutes     = computed(() => props.prepMinutes + props.deliveryMinutes)

const prepRemaining  = computed(() => Math.max(0, prepTotalSec.value - prepElapsed.value))
const prepProgress   = computed(() => Math.min(100, (prepElapsed.value / prepTotalSec.value) * 100))
const prepDone       = computed(() => prepRemaining.value === 0)

const deliveryStarted  = computed(() => currentStepIndex.value >= 3)
const deliveryDone     = computed(() => currentStepIndex.value >= 4 && deliveryRemaining.value === 0)
const deliveryRemaining = computed(() => Math.max(0, deliveryTotalSec.value - deliveryElapsed.value))
const deliveryProgress  = computed(() => deliveryStarted.value
  ? Math.min(100, (deliveryElapsed.value / deliveryTotalSec.value) * 100)
  : 0)

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
  if (currentStepIndex.value === 3) return 'En camí 🛵'
  return 'Entregat!'
})

const mapBadgeClass = computed(() => ({
  'is-active':   currentStepIndex.value === 3,
  'is-done':     currentStepIndex.value >= 4,
  'is-cancelled': cancelled.value,
}))

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Timers & step progression ──────────────────────────────────────────────

function startTimers() {
  timerInterval = setInterval(() => {
    // Prep timer
    if (!prepDone.value) {
      prepElapsed.value++
      // Advance step when prep done
      if (prepDone.value && currentStepIndex.value < 2) {
        currentStepIndex.value = 2
        setTimeout(() => { currentStepIndex.value = 3 }, 3000)
      }
    } else if (deliveryStarted.value && !deliveryDone.value) {
      deliveryElapsed.value++
      if (deliveryDone.value) {
        currentStepIndex.value = 4
      }
    }
  }, 1000)

  // Step timestamps
  STEPS.forEach((step, i) => {
    if (i === 0) {
      const now = new Date()
      step.time = now.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
    }
  })
}

// ── Leaflet map ────────────────────────────────────────────────────────────

async function initMap() {
  const { restaurantLat, restaurantLng, userLat, userLng } = props
  const midLat = (restaurantLat + userLat) / 2
  const midLng = (restaurantLng + userLng) / 2

  leafletMap = L.map(mapEl.value, {
    center:         [midLat, midLng],
    zoom:           15,
    zoomControl:    false,
    attributionControl: false,
  })

  // Dark tile layer (CartoDB dark)
  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', maxZoom: 19 }
  ).addTo(leafletMap)

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap)

  // Restaurant marker
  const restaurantIcon = L.divIcon({
    html:      `<div class="ot-map-icon ot-map-icon--restaurant">🍣</div>`,
    className: '',
    iconSize:  [40, 40],
    iconAnchor:[20, 20],
  })

  // User marker
  const userIcon = L.divIcon({
    html:      `<div class="ot-map-icon ot-map-icon--user">📍</div>`,
    className: '',
    iconSize:  [40, 40],
    iconAnchor:[20, 40],
  })

  L.marker([restaurantLat, restaurantLng], { icon: restaurantIcon })
    .addTo(leafletMap)
    .bindPopup('<strong>Sushi Kick</strong><br>Carrer del Drac Roig 27')

  L.marker([userLat, userLng], { icon: userIcon })
    .addTo(leafletMap)
    .bindPopup('<strong>La teva adreça</strong>')

  // Draw static route line
  routePolyline = L.polyline(
    [[restaurantLat, restaurantLng], [userLat, userLng]],
    { color: 'rgba(240,123,16,0.45)', weight: 3, dashArray: '8 6' }
  ).addTo(leafletMap)

  // Fit map to bounds
  leafletMap.fitBounds(routePolyline.getBounds(), { padding: [40, 40] })

  // Watch delivery started → animate rider
  watch(deliveryStarted, (val) => {
    if (val) startRiderAnimation(L)
  })
}

function startRiderAnimation(L) {
  const { restaurantLat, restaurantLng, userLat, userLng } = props

  const riderIcon = L.divIcon({
    html:      `<div class="ot-map-icon ot-map-icon--rider">🛵</div>`,
    className: '',
    iconSize:  [40, 40],
    iconAnchor:[20, 20],
  })

  riderMarker = L.marker([restaurantLat, restaurantLng], { icon: riderIcon }).addTo(leafletMap)

  const totalFrames = props.deliveryMinutes * 60  // 1 frame/sec
  let frame = 0

  riderInterval = setInterval(() => {
    if (frame >= totalFrames) {
      clearInterval(riderInterval)
      return
    }
    const t   = frame / totalFrames
    const lat = restaurantLat + (userLat - restaurantLat) * t
    const lng = restaurantLng + (userLng - restaurantLng) * t
    riderMarker.setLatLng([lat, lng])
    frame++
  }, 1000)
}

// ── Cancel logic ───────────────────────────────────────────────────────────

async function confirmCancel() {
  cancelling.value = true
  try {
    // Simulate API call
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
  clearInterval(stepInterval)
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