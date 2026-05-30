import { ref, computed, onMounted } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api'

// ─── Validators ───────────────────────────────────────────────────────────────

const v = {
  required:  val => (!val?.toString().trim()             ? 'Camp obligatori.'          : null),
  email:     val => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Email no vàlid.'     : null),
  phone:     val => (!val || /^[+\d\s]{7,15}$/.test(val)     ? null                   : 'Telèfon no vàlid.'),
  password:  val => (!val || val.length >= 8                  ? null                   : 'Mínim 8 caràcters.'),
  url:       val => {
    if (!val) return null
    try { new URL(val); return null } catch { return 'URL no vàlida.' }
  },
}

// ─── Auth header helper ───────────────────────────────────────────────────────

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function usePerfil() {

  // ── Remote state ─────────────────────────────────────────────────────────────
  const loading  = ref(false)
  const saving   = ref(false)
  const error    = ref(null)
  const success  = ref(false)   // flash on save

  // ── Form ─────────────────────────────────────────────────────────────────────
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  fecha_nacimiento: '',
  biografia: '',
  imagen_perfil: '',
  imagen_banner: '',
  metodos_pago: [],
  datos_pago: {
    titular: '',
    numero: '',
    exp: '',
    cvv: '',
    bizum: '',
    paypal: '',
  },
})

  // Snapshot to detect unsaved changes
  const original = ref(null)

  const isDirty = computed(() => {
    if (!original.value) return false
    return JSON.stringify(form.value) !== JSON.stringify(original.value)
  })

  // ── Derived ───────────────────────────────────────────────────────────────────
  const initials = computed(() => {
    if (!form.value.nombre) return '?'
    return form.value.nombre
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  // ── Validation ────────────────────────────────────────────────────────────────
  const touched = ref({})

  function touch(field) { touched.value[field] = true }

  const errors = computed(() => ({
    nombre:        v.required(form.value.nombre),
    email:         v.required(form.value.email) ?? v.email(form.value.email),
    telefono:      v.phone(form.value.telefono),
    imagen_perfil: v.url(form.value.imagen_perfil),
    imagen_banner: v.url(form.value.imagen_banner),
    password:      v.password(form.value.password),
  }))

  const submitAttempted = ref(false)

  function visibleError(field) {
    if (!touched.value[field] && !submitAttempted.value) return null
    return errors.value[field] ?? null
  }

  function isFieldValid(field) {
    const hasValue = !!form.value[field]
    return hasValue && !errors.value[field]
  }

  function fieldClass(field) {
    const seen = touched.value[field] || submitAttempted.value
    return {
      'has-error': seen && errors.value[field],
      'is-valid':  seen && !errors.value[field] && form.value[field],
    }
  }

  const isValid = computed(() =>
    !errors.value.nombre &&
    !errors.value.email &&
    !errors.value.telefono &&
    !errors.value.imagen_perfil &&
    !errors.value.imagen_banner &&
    !errors.value.password,
  )

  // ── FETCH USER ────────────────────────────────────────────────────────────────
async function fetchUser() {
  loading.value = true
  error.value = null

  try {
    // 1. Leer ID del localStorage
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      throw new Error('No hi ha userId al localStorage')
    }

    // 2. Cargar cache inmediato (UX rápida)
    const cached = localStorage.getItem('user')
    if (cached) {
      applyUser(JSON.parse(cached))
    }

    // 3. Fetch real desde API por ID
    const res = await fetch(`${API_URL}/perfil/${userId}`, {
      headers: authHeaders(),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.message ?? 'Error carregant perfil.')
    }

    const u = json.data ?? json

    applyUser(u)

    // 4. Guardar cache
    localStorage.setItem('user', JSON.stringify(u))

  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
  function applyUser(u) {
    form.value = {
      nombre:           u.nombre           ?? u.name    ?? '',
      email:            u.email            ?? '',
      telefono:         u.telefono         ?? u.phone   ?? '',
      direccion:        u.direccion        ?? '',
      fecha_nacimiento: u.fecha_nacimiento
      ? String(u.fecha_nacimiento).split('T')[0]
      : '',
      biografia:        u.biografia        ?? '',
      imagen_perfil:    u.imagen_perfil    ?? '',
      imagen_banner:    u.imagen_banner    ?? '',
      password:         '',   // never prefill password
      metodos_pago: Array.isArray(u.metodos_pago)
      ? u.metodos_pago.map(pm => ({
          tipo: pm.tipo ?? 'tarjeta',
          detalles: {
            titular: pm.detalles?.titular ?? '',
            numero: pm.detalles?.numero ?? '',
            exp: pm.detalles?.exp ?? '',
            cvv: pm.detalles?.cvv ?? '',
            telefono: pm.detalles?.telefono ?? '',
            email: pm.detalles?.email ?? '',
          }
        }))
      : [],
    }
    // Deep clone snapshot
    original.value = JSON.parse(JSON.stringify(form.value))
  }

  // ── SAVE PROFILE ─────────────────────────────────────────────────────────────

  async function save() {
  submitAttempted.value = true

  if (!isValid.value) {
    const first = document.querySelector('.has-error .pf-input')
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  saving.value = true
  error.value = null
  success.value = false

  try {
    const userId = localStorage.getItem('user_id')

    if (!userId) {
      throw new Error('No hi ha userId al localStorage')
    }

    const payload = buildPayload()

    const res = await fetch(`${API_URL}/perfil/${userId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(json.message ?? 'Error desant canvis.')
    }

    const updated = json.data ?? json

    applyUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3500)

  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

  function buildPayload() {
    const f = { ...form.value }
    // Only include password if the user typed something
    if (!f.password) delete f.password
    return f
  }

  // ── UPLOAD AVATAR ─────────────────────────────────────────────────────────────

  const uploadingAvatar  = ref(false)
  const uploadingBanner  = ref(false)

async function uploadImage(file, field) {
  const isAvatar = field === 'imagen_perfil'

  const fd = new FormData()
  fd.append(field, file)

  const url = isAvatar
    ? `${API_URL}/perfil/avatar`
    : `${API_URL}/perfil/banner`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: localStorage.getItem('token')
        ? `Bearer ${localStorage.getItem('token')}`
        : '',
    },
    body: fd,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message ?? 'Error subiendo imagen')
  }

  form.value[field] = json.url
}
  function onAvatarChange(e) {
    const file = e.target.files?.[0]
    if (file) uploadImage(file, 'imagen_perfil')
  }

  function onBannerChange(e) {
    const file = e.target.files?.[0]
    if (file) uploadImage(file, 'imagen_banner')
  }

  // ── PASSWORD CHANGE ───────────────────────────────────────────────────────────

  const showPassword    = ref(false)
  const showNewPassword = ref(false)

  const currentPassword = ref('')
  const newPassword     = ref('')
  const confirmPassword = ref('')
  const passwordError   = ref(null)
  const passwordSuccess = ref(false)
  const savingPassword  = ref(false)

  async function changePassword() {
    passwordError.value   = null
    passwordSuccess.value = false

    if (!currentPassword.value) { passwordError.value = 'Introdueix la contrasenya actual.'; return }
    if (newPassword.value.length < 8) { passwordError.value = 'La nova contrasenya ha de tenir mínim 8 caràcters.'; return }
    if (newPassword.value !== confirmPassword.value) { passwordError.value = 'Les contrasenyes no coincideixen.'; return }

    savingPassword.value = true
    try {
      const res  = await fetch(`${API_URL}/user/password`, {
        method:  'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          current_password:      currentPassword.value,
          password:              newPassword.value,
          password_confirmation: confirmPassword.value,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Error canviant contrasenya.')

      currentPassword.value = ''
      newPassword.value     = ''
      confirmPassword.value = ''
      passwordSuccess.value = true
      setTimeout(() => { passwordSuccess.value = false }, 3500)

    } catch (e) {
      passwordError.value = e.message
    } finally {
      savingPassword.value = false
    }
  }

  // ── PAYMENT METHODS ───────────────────────────────────────────────────────────

  const PAYMENT_TYPES = [
    { id: 'tarjeta', label: 'Targeta', icon: '💳' },
    { id: 'paypal',  label: 'PayPal',  icon: '🅿'  },
    { id: 'bizum',   label: 'Bizum',   icon: '📱'  },
  ]

  function addPayment() {
    form.value.metodos_pago.push({
      tipo: 'tarjeta',
      detalles: {
        titular: '',
        numero: '',
        exp: '',
        cvv: '',
        telefono: '',
        email: '',
      },
    })
  }

  function removePayment(i) {
    form.value.metodos_pago.splice(i, 1)
  }

  // ── ORDERS HISTORY ────────────────────────────────────────────────────────────

  const orders        = ref([])
  const loadingOrders = ref(false)

  async function fetchOrders() {
    loadingOrders.value = true
    try {
      const res  = await fetch(`${API_URL}/pedidos`, { headers: authHeaders() })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      orders.value = json.data ?? json
    } catch (e) {
      console.error('fetchOrders:', e)
    } finally {
      loadingOrders.value = false
    }
  }

  // ── ACTIVE TAB ────────────────────────────────────────────────────────────────

  const activeTab = ref('profile')  // 'profile' | 'password' | 'orders'

  // ── LIFECYCLE ─────────────────────────────────────────────────────────────────

  onMounted(() => {
    fetchUser()
    fetchOrders()
  })

  // ── PUBLIC API ────────────────────────────────────────────────────────────────

  return {
    // state
    loading,
    saving,
    error,
    success,
    isDirty,

    // form
    form,
    initials,
    touched,
    touch,
    errors,
    visibleError,
    isFieldValid,
    fieldClass,
    isValid,

    // upload
    uploadingAvatar,
    uploadingBanner,
    onAvatarChange,
    onBannerChange,

    // password change
    showPassword,
    showNewPassword,
    currentPassword,
    newPassword,
    confirmPassword,
    passwordError,
    passwordSuccess,
    savingPassword,
    changePassword,

    // payments
    PAYMENT_TYPES,
    addPayment,
    removePayment,

    // orders
    orders,
    loadingOrders,

    // tabs
    activeTab,

    // actions
    save,
  }
}