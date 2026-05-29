import { ref, computed, watch } from 'vue'

// ─── API CONFIG ───────────────────────────────────────────────────────────────

const API_URL = 'http://127.0.0.1:8000/api'

// ─── Constants ────────────────────────────────────────────────────────────────

export const visualStats = [
  { num: '47', label: 'Signature rolls' },
  { num: '4.9★', label: 'Google rating' },
  { num: '12+', label: 'Years rolling' },
]

export const perks = [
  { icon: '⚡', text: 'Comandes ràpides' },
  { icon: '★', text: 'Punts fidelitat' },
  { icon: '🎁', text: 'Ofertes exclusives' },
]

// ─── Validators ───────────────────────────────────────────────────────────────

const validators = {
  email(value) {
    if (!value.trim()) return 'El correu és obligatori.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Introdueix un correu vàlid.'
    }
    return null
  },

  password(value) {
    if (!value) return 'La contrasenya és obligatòria.'
    if (value.length < 8) return 'Mínim 8 caràcters.'
    return null
  },

  passwordStrong(value) {
    const base = validators.password(value)
    if (base) return base

    if (!/[A-Z]/.test(value)) {
      return 'Afegeix almenys una majúscula.'
    }

    if (!/[0-9]/.test(value)) {
      return 'Afegeix almenys un número.'
    }

    if (!/[^A-Za-z0-9]/.test(value)) {
      return 'Afegeix almenys un símbol.'
    }

    return null
  },

  name(value) {
    if (!value.trim()) return 'El nom és obligatori.'
    if (value.trim().length < 2) {
      return 'El nom ha de tenir mínim 2 caràcters.'
    }
    return null
  },

  surname(value) {
    if (!value.trim()) return 'Els cognoms són obligatoris.'
    if (value.trim().length < 2) {
      return 'Els cognoms han de tenir mínim 2 caràcters.'
    }
    return null
  },
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useAuthForm() {

  // UI
  const tab = ref('login')
  const showPass = ref(false)
  const showRegPass = ref(false)

  // API State
  const loading = ref(false)
  const apiError = ref('')

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  const login = ref({
    email: '',
    password: '',
  })

  const loginTouched = ref({
    email: false,
    password: false,
  })

  const loginErrors = computed(() => ({
    email: validators.email(login.value.email),
    password: validators.password(login.value.password),
  }))

  const loginVisible = computed(() => ({
    email:
      loginTouched.value.email &&
      loginErrors.value.email,

    password:
      loginTouched.value.password &&
      loginErrors.value.password,
  }))

  function touchLogin(field) {
    loginTouched.value[field] = true
  }

  const loginIsValid = computed(() =>
    !loginErrors.value.email &&
    !loginErrors.value.password,
  )

  // ─── LOGIN API ────────────────────────────────────────────────────────────

  async function handleLogin() {

    loginTouched.value = {
      email: true,
      password: true,
    }

    if (!loginIsValid.value) return

    loading.value = true
    apiError.value = ''

    try {

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          email: login.value.email,
          password: login.value.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login incorrecte')
      }

      // Guardar token
      localStorage.setItem('token', data.token)

      // Guardar usuario
      localStorage.setItem('user', JSON.stringify(data.user))

      // Guardar autenticación
      localStorage.setItem('isAuthenticated', 'true')

      console.log('LOGIN OK', data)

      // Redirección
      window.location.href = '/dashboard'

    } catch (error) {

      apiError.value = error.message
      console.error(error)

    } finally {

      loading.value = false

    }
  }

  // ─── REGISTER ─────────────────────────────────────────────────────────────

  const reg = ref({
    name: '',
    surname: '',
    email: '',
    password: '',
  })

  const regTouched = ref({
    name: false,
    surname: false,
    email: false,
    password: false,
  })

  const regErrors = computed(() => ({
    name: validators.name(reg.value.name),
    surname: validators.surname(reg.value.surname),
    email: validators.email(reg.value.email),
    password: validators.passwordStrong(reg.value.password),
  }))

  const regVisible = computed(() => ({
    name:
      regTouched.value.name &&
      regErrors.value.name,

    surname:
      regTouched.value.surname &&
      regErrors.value.surname,

    email:
      regTouched.value.email &&
      regErrors.value.email,

    password:
      regTouched.value.password &&
      regErrors.value.password,
  }))

  function touchReg(field) {
    regTouched.value[field] = true
  }

  const regIsValid = computed(() =>
    !regErrors.value.name &&
    !regErrors.value.surname &&
    !regErrors.value.email &&
    !regErrors.value.password,
  )

  // ─── REGISTER API ────────────────────────────────────────────────────────

  async function handleRegister() {

    regTouched.value = {
      name: true,
      surname: true,
      email: true,
      password: true,
    }

    if (!regIsValid.value) return

    loading.value = true
    apiError.value = ''

    try {

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },

        body: JSON.stringify({
          name: reg.value.name,
          surname: reg.value.surname,
          email: reg.value.email,
          password: reg.value.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar')
      }

      // Guardar token
      localStorage.setItem('token', data.token)

      // Guardar usuario
      localStorage.setItem('user', JSON.stringify(data.user))

      // Guardar autenticación
      localStorage.setItem('isAuthenticated', 'true')

      console.log('REGISTER OK', data)

      // Redirección
      window.location.href = '/dashboard'

    } catch (error) {

      apiError.value = error.message
      console.error(error)

    } finally {

      loading.value = false

    }
  }

  // ─── WATCH TAB ───────────────────────────────────────────────────────────

  watch(tab, () => {

    apiError.value = ''

    loginTouched.value = {
      email: false,
      password: false,
    }

    regTouched.value = {
      name: false,
      surname: false,
      email: false,
      password: false,
    }
  })

  // ─── PASSWORD STRENGTH ───────────────────────────────────────────────────

  const passwordStrength = computed(() => {

    const p = reg.value.password

    if (!p) return 0

    let score = 0

    if (p.length >= 8) score += 25
    if (p.length >= 12) score += 15
    if (/[A-Z]/.test(p)) score += 20
    if (/[0-9]/.test(p)) score += 20
    if (/[^A-Za-z0-9]/.test(p)) score += 20

    return Math.min(score, 100)
  })

  const strengthColor = computed(() => {

    const s = passwordStrength.value

    if (s < 40) return '#c8201a'
    if (s < 70) return '#f07b10'

    return '#22c55e'
  })

  const strengthLabel = computed(() => {

    const s = passwordStrength.value

    if (!reg.value.password) return ''
    if (s < 40) return 'Feble'
    if (s < 70) return 'Acceptable'
    if (s < 100) return 'Bona'

    return 'Molt segura'
  })

  return {

    tab,
    showPass,
    showRegPass,

    loading,
    apiError,

    login,
    loginTouched,
    loginErrors,
    loginVisible,
    loginIsValid,
    touchLogin,
    handleLogin,

    reg,
    regTouched,
    regErrors,
    regVisible,
    regIsValid,
    touchReg,
    handleRegister,

    passwordStrength,
    strengthColor,
    strengthLabel,
  }
}