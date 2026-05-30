import { ref, computed, onMounted } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api'
const CART_KEY = 'cart_items'

export function useCheckoutPedido() {

  // ───── STATE ─────
  const processing = ref(false)
  const cartItems = ref([])

  const form = ref({
    nombre: '',
    email: '',
    telefono: '',
    direccion_local: '',
    direccion: '',
    notas: '',
    tipo_pago: 'efectivo',
    datos_pago: {
      titular: '',
      numero: '',
      exp: '',
      cvv: '',
      bizum: '',
      paypal: '',
    },
  })

  const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo', icon: '💵' },
    { id: 'tarjeta', label: 'Tarjeta', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'bizum', label: 'Bizum', icon: '📱' },
  ]

  // ───── LOAD DATA ─────
  onMounted(() => {
    loadCart()
    loadUser()
  })

  function loadCart() {
    const saved = localStorage.getItem(CART_KEY)
    if (saved) cartItems.value = JSON.parse(saved)
  }

  function loadUser() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) return

    form.value.nombre = user.name || ''
    form.value.email = user.email || ''
    form.value.telefono = user.telefono || ''
    form.value.direccion = user.direccion || ''
  }

  // ───── COMPUTED ─────
  const cartTotal = computed(() =>
    cartItems.value.reduce((a, i) => a + i.product.price * i.qty, 0)
  )

  const finalTotal = computed(() =>
    cartTotal.value >= 25 ? cartTotal.value : cartTotal.value + 2.99
  )

  // ───── ACTION ─────
  async function submitPedido() {
    processing.value = true

    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const payload = {
        user_id: user.id,
        productos: cartItems.value.map(i => i.product.id),
        unidades: cartItems.value.map(i => ({
          id: i.product.id,
          qty: i.qty,
        })),
        estado: 'pendiente',
        total: finalTotal.value,
        direccion_local: form.value.direccion_local,
        direccion: form.value.direccion,
        notas: form.value.notas,
        tipo_pago: form.value.tipo_pago,
        datos_pago:
          form.value.tipo_pago === 'efectivo'
            ? null
            : form.value.datos_pago,
      }

      const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error creando pedido')

      localStorage.removeItem(CART_KEY)

      alert('Pedido creado 🎉')
      window.location.href = '/perfil/pedidos'

    } catch (e) {
      console.error(e)
      alert('Error procesando pedido')
    } finally {
      processing.value = false
    }
  }

  return {
    form,
    paymentMethods,
    cartItems,
    processing,
    finalTotal,
    submitPedido,
  }
}