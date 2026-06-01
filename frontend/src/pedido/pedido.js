import { ref, computed, onMounted } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api'
const CART_KEY = 'cart_items'

// ─── Constants ────────────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectiu',  icon: '💵', desc: 'Pagues en rebre la comanda' },
  { id: 'tarjeta',  label: 'Targeta',  icon: '💳', desc: 'Visa, Mastercard, American Express' },
  { id: 'bizum',    label: 'Bizum',    icon: '📱', desc: 'Envia al +34 93 777 13 37' },
  { id: 'paypal',   label: 'PayPal',   icon: '🅿',  desc: 'Paga amb el teu compte PayPal' },
]

export const DELIVERY_TYPES = [
  { id: 'domicili', label: 'A domicili', icon: '🛵' },
  { id: 'local',    label: 'Recollida',  icon: '🏪' },
]

// ─── Auth header helper ───────────────────────────────────────────────────────
// Token is stored as 'token' by auth.js

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

// ─── Read user from localStorage ─────────────────────────────────────────────

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getStoredUserId() {
  return localStorage.getItem('user_id') ?? null
}

// ─── Validators ───────────────────────────────────────────────────────────────

const v = {
  required: val => (!val?.toString().trim()                     ? 'Camp obligatori.'           : null),
  phone:    val => (!/^[+\d\s]{7,15}$/.test(val)               ? 'Telèfon no vàlid.'          : null),
  cardNum:  val => (!/^\d{16}$/.test(val.replace(/\s/g, ''))   ? 'Número de targeta no vàlid.': null),
  cardExp:  val => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return 'Format MM/AA'
    const [m, y] = val.split('/').map(Number)
    return new Date(2000 + y, m - 1) < new Date() ? 'Targeta caducada.' : null
  },
  cvv:      val => (!/^\d{3,4}$/.test(val)                     ? 'CVV no vàlid.'              : null),
  email:    val => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)    ? 'Email no vàlid.'            : null),
  bizum:    val => (!/^\+?[0-9]{9,11}$/.test(val.replace(/\s/g,'')) ? 'Telèfon Bizum no vàlid.' : null),
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useOrder() {

  // ── Cart ──────────────────────────────────────────────────────────────────

  const cartItems = ref([])

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY)
      cartItems.value = raw ? JSON.parse(raw) : []
    } catch {
      cartItems.value = []
    }
  }

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.qty * i.product.price, 0),
  )
  const cartCount = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.qty, 0),
  )

  // ── Checkout data from API ─────────────────────────────────────────────────
  // GET /api/checkout returns: usuario, metodos_pago, local

  const checkoutLoading = ref(false)
  const checkoutError   = ref(null)
  const localInfo       = ref({ nombre: 'Sushi Kick', direccion: 'Carrer del Drac Roig 27, El Raval' })

  async function fetchCheckout() {
    checkoutLoading.value = true
    checkoutError.value   = null

    try {
      // 1. Seed instantly from localStorage (zero-latency prefill)
      const stored = getStoredUser()
      if (stored) seedFormFromUser(stored)

      // 2. Fetch fresh checkout data from API
      const res  = await fetch(`${API_URL}/checkout`, { headers: authHeaders() })
      const json = await res.json()

      if (!res.ok) throw new Error(json.message ?? 'Error carregant checkout.')

      // Apply user data
      if (json.usuario) seedFormFromUser(json.usuario)

      // Apply saved payment methods — pre-select the first if available
      if (Array.isArray(json.metodos_pago) && json.metodos_pago.length) {
        savedPaymentMethods.value = json.metodos_pago
        // Pre-select first saved method type if it matches our options
        const firstType = json.metodos_pago[0]?.tipo
        if (firstType && PAYMENT_METHODS.some(p => p.id === firstType)) {
          form.value.paymentMethod = firstType
          applySavedMethod(json.metodos_pago[0])
        }
      }

      // Apply local info
      if (json.local) {
        localInfo.value = json.local
        form.value.addressLocal = json.local.direccion
      }

    } catch (e) {
      checkoutError.value = e.message
      console.error('fetchCheckout:', e)
    } finally {
      checkoutLoading.value = false
    }
  }

  // ── Saved payment methods (from API) ──────────────────────────────────────

  const savedPaymentMethods = ref([])  // raw array from API

function applySavedMethod(pm) {
  if (!pm) return

  switch (pm.tipo) {
    case 'tarjeta':
      form.value.cardName = pm.detalles?.titular ?? ''
      form.value.cardExpiry = pm.detalles?.caducidad ?? ''

      form.value.cardNumber = pm.detalles?.ultimos4
        ? `•••• •••• •••• ${pm.detalles.ultimos4}`
        : ''

      break

    case 'bizum':
      form.value.bizumPhone = pm.detalles?.telefon ?? ''
      break

    case 'paypal':
      form.value.paypalEmail = pm.detalles?.email ?? ''
      break
  }
}

  function seedFormFromUser(u) {
    form.value.name    = u.nombre     ?? u.name    ?? form.value.name
    form.value.phone   = u.telefono   ?? u.phone   ?? form.value.phone
    form.value.address = u.direccion  ?? form.value.address
  }

  // ── Delivery ──────────────────────────────────────────────────────────────

  const deliveryType = ref('domicili')

  // ── Form fields ───────────────────────────────────────────────────────────

  const form = ref({
    name:          '',
    phone:         '',
    address:       '',
    addressLocal:  localInfo.value.direccion,
    orderTime: '',
    notes:         '',
    paymentMethod: 'efectivo',
    // Card
    cardName:      '',
    cardNumber:    '',
    cardExpiry:    '',
    cardCvv:       '',
    saveCard:      false,
    // Bizum
    bizumPhone:    '',
    // PayPal
    paypalEmail:   '',
  })

  // ── Validation ────────────────────────────────────────────────────────────

  const touched = ref({})
  function touch(field) { touched.value[field] = true }

  const errors = computed(() => {
    const f = form.value
    const e = {}

    e.name    = v.required(f.name)
    e.phone   = v.required(f.phone) ?? v.phone(f.phone)
    e.address = deliveryType.value === 'domicili' ? v.required(f.address) : null

    if (f.paymentMethod === 'tarjeta') {
      e.cardName   = v.required(f.cardName)
      // Skip card number validation if it's a masked saved card (starts with •)
      e.cardNumber = f.cardNumber.startsWith('••••')
        ? null
        : (v.required(f.cardNumber) ?? v.cardNum(f.cardNumber))
      e.cardExpiry = v.required(f.cardExpiry) ?? v.cardExp(f.cardExpiry)
      e.cardCvv    = v.required(f.cardCvv)    ?? v.cvv(f.cardCvv)
    }
    if (f.paymentMethod === 'bizum') {
      e.bizumPhone = v.required(f.bizumPhone) ?? v.bizum(f.bizumPhone)
    }
    if (f.paymentMethod === 'paypal') {
      e.paypalEmail = v.required(f.paypalEmail) ?? v.email(f.paypalEmail)
    }

    return e
  })

  const submitAttempted = ref(false)

  function visibleError(field) {
    if (!touched.value[field] && !submitAttempted.value) return null
    return errors.value[field] ?? null
  }

  function fieldClass(field) {
    const seen = touched.value[field] || submitAttempted.value
    return {
      'has-error': seen && errors.value[field],
      'is-valid':  seen && !errors.value[field] && form.value[field],
    }
  }

  const isValid = computed(() => Object.values(errors.value).every(e => !e))

  // ── Card formatters ───────────────────────────────────────────────────────

  function formatCardNumber(e) {
    // Don't reformat if it's a masked saved card
    if (form.value.cardNumber.startsWith('••••')) {
      form.value.cardNumber = ''
      return
    }
    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
    form.value.cardNumber = val.match(/.{1,4}/g)?.join(' ') ?? val
  }

  function formatCardExpiry(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    form.value.cardExpiry = val.length >= 3
      ? val.slice(0, 2) + '/' + val.slice(2)
      : val
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const submitting  = ref(false)
  const submitted   = ref(false)
  const orderId     = ref(null)
  const submitError = ref(null)
  const orderMeta   = ref(null)   // { tiempo_preparacion, hora_estimada }

  function buildPayload() {
    const f = form.value

    const productos = cartItems.value.map(i => i.product.id)
    const unidades  = cartItems.value.reduce((acc, i) => {
      acc[i.product.id] = i.qty
      return acc
    }, {})

    return {
      productos,
      unidades,
      total:            cartTotal.value.toFixed(2),
      direccion_local:  f.addressLocal,
      hora_pedido: form.value.orderTime,
      direccion:        deliveryType.value === 'domicili' ? f.address : f.addressLocal,
      notas:            f.notes || null,
      tipo_pago:        f.paymentMethod,
      datos_pago:       buildDatosPago(f),
    }
  }

function buildDatosPago(f) {
  switch (f.paymentMethod) {
    case 'tarjeta':
      return {
        titular: f.cardName,
        ultimos4: f.cardNumber.replace(/\D/g, '').slice(-4),
        caducidad: f.cardExpiry,
      }

    case 'bizum':
      return { telefon: f.bizumPhone }

    case 'paypal':
      return { email: f.paypalEmail }

    default:
      return null
  }
}

  async function submitOrder() {
    submitAttempted.value = true

    if (!isValid.value) {
      document.querySelector('.f-error')
        ?.closest('.f-group')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    submitting.value  = true
    submitError.value = null
 
    try {
      const res = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: authHeaders(), // 👈 aquí va TODO
      body: JSON.stringify(buildPayload()),
    })
      const json = await res.json()

      if (!res.ok) throw new Error(json.message ?? 'Error al processar la comanda.')

      const pedido = json.pedido ?? json.data ?? json
      orderId.value  = pedido.id ?? '—'
      orderMeta.value = {
        tiempo_preparacion: pedido.tiempo_preparacion ?? null,
        hora_estimada:      pedido.hora_estimada      ?? null,
      }

      localStorage.removeItem(CART_KEY)
      cartItems.value = []
      submitted.value = true

    } catch (e) {
      submitError.value = e.message
    } finally {
      submitting.value = false
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMounted(() => {
    loadCart()
    fetchCheckout()
  })

  // ── Public API ────────────────────────────────────────────────────────────

  return {
    // cart
    cartItems,
    cartTotal,
    cartCount,

    // checkout
    checkoutLoading,
    checkoutError,
    localInfo,
    savedPaymentMethods,
    applySavedMethod,

    // delivery
    deliveryType,

    // form
    form,
    touched,
    touch,
    errors,
    visibleError,
    fieldClass,
    isValid,
    submitAttempted,

    // formatters
    formatCardNumber,
    formatCardExpiry,

    // submit
    submitting,
    submitted,
    orderId,
    orderMeta,
    submitError,
    submitOrder,
  }
}