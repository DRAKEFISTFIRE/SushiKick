# CheckoutPedido.vue

```vue
<template>
  <section class="ck-page">
    <div class="container ck-wrap">
      <!-- LEFT -->
      <div class="ck-main">
        <div class="ck-head">
          <span class="section-tag">Finalitzar pedido</span>
          <h1 class="ck-title">
            Completa tu <em>pedido</em>
          </h1>
          <p class="ck-sub">
            Revisa tus productos, añade la dirección y selecciona el método de pago.
          </p>
        </div>

        <!-- USER INFO -->
        <div class="ck-card">
          <div class="ck-card__header">
            <h2>Información del cliente</h2>
          </div>

          <div class="ck-grid">
            <div class="ck-field">
              <label>Nombre completo</label>
              <input v-model="form.nombre" type="text" placeholder="Tu nombre" />
            </div>

            <div class="ck-field">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="tu@email.com" />
            </div>

            <div class="ck-field">
              <label>Teléfono</label>
              <input v-model="form.telefono" type="text" placeholder="+34 600 000 000" />
            </div>

            <div class="ck-field">
              <label>Dirección local</label>
              <input
                v-model="form.direccion_local"
                type="text"
                placeholder="Barcelona Centro"
              />
            </div>

            <div class="ck-field ck-field--full">
              <label>Dirección de entrega</label>
              <input
                v-model="form.direccion"
                type="text"
                placeholder="Calle, número, piso..."
              />
            </div>

            <div class="ck-field ck-field--full">
              <label>Notas</label>
              <textarea
                v-model="form.notas"
                rows="4"
                placeholder="Instrucciones para el repartidor..."
              />
            </div>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="ck-card">
          <div class="ck-card__header">
            <h2>Método de pago</h2>
          </div>

          <div class="ck-payments">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              class="ck-payment"
              :class="{
                active: form.tipo_pago === method.id,
              }"
              @click="form.tipo_pago = method.id"
            >
              <span class="ck-payment__icon">{{ method.icon }}</span>
              <div>
                <strong>{{ method.label }}</strong>
                <p>{{ method.desc }}</p>
              </div>
            </button>
          </div>

          <!-- CARD -->
          <transition name="fade-slide">
            <div
              v-if="form.tipo_pago === 'tarjeta'"
              class="ck-payment-box"
            >
              <div class="ck-payment-box__head">
                <h3>Tarjeta</h3>
                <button
                  class="ck-mini-btn"
                  @click="toggleSavedCard"
                >
                  {{ useSavedCard ? 'Crear nueva tarjeta' : 'Usar guardada' }}
                </button>
              </div>

              <div
                v-if="useSavedCard"
                class="ck-saved-card"
              >
                <div>
                  <span class="ck-chip"></span>
                  <p>•••• •••• •••• 4588</p>
                  <small>Visa terminada en 4588</small>
                </div>

                <button class="ck-use-btn">
                  Seleccionada
                </button>
              </div>

              <div
                v-else
                class="ck-grid"
              >
                <div class="ck-field ck-field--full">
                  <label>Titular</label>
                  <input
                    v-model="form.datos_pago.titular"
                    type="text"
                    placeholder="Nombre en la tarjeta"
                  />
                </div>

                <div class="ck-field ck-field--full">
                  <label>Número de tarjeta</label>
                  <input
                    v-model="form.datos_pago.numero"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div class="ck-field">
                  <label>Expiración</label>
                  <input
                    v-model="form.datos_pago.exp"
                    type="text"
                    placeholder="MM/YY"
                  />
                </div>

                <div class="ck-field">
                  <label>CVV</label>
                  <input
                    v-model="form.datos_pago.cvv"
                    type="password"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </transition>

          <!-- BIZUM -->
          <transition name="fade-slide">
            <div
              v-if="form.tipo_pago === 'bizum'"
              class="ck-payment-box"
            >
              <div class="ck-grid">
                <div class="ck-field ck-field--full">
                  <label>Número de Bizum</label>
                  <input
                    v-model="form.datos_pago.bizum"
                    type="text"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
            </div>
          </transition>

          <!-- PAYPAL -->
          <transition name="fade-slide">
            <div
              v-if="form.tipo_pago === 'paypal'"
              class="ck-payment-box"
            >
              <div class="ck-grid">
                <div class="ck-field ck-field--full">
                  <label>Email PayPal</label>
                  <input
                    v-model="form.datos_pago.paypal"
                    type="email"
                    placeholder="paypal@email.com"
                  />
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- SIDEBAR -->
      <aside class="ck-sidebar">
        <div class="ck-summary">
          <div class="ck-summary__head">
            <h2>Tu pedido</h2>
            <span>{{ cartCount }} items</span>
          </div>

          <div
            v-if="cartItems.length"
            class="ck-items"
          >
            <div
              v-for="item in cartItems"
              :key="item.product.id"
              class="ck-item"
            >
              <img
                :src="item.product.img"
                :alt="item.product.name"
              />

              <div class="ck-item__info">
                <h4>{{ item.product.name }}</h4>
                <p>
                  {{ item.qty }} x {{ formatPrice(item.product.price) }}
                </p>
              </div>

              <strong>
                {{ formatPrice(item.qty * item.product.price) }}
              </strong>
            </div>
          </div>

          <div
            v-else
            class="ck-empty"
          >
            Tu carrito está vacío.
          </div>

          <div class="ck-total">
            <div>
              <span>Subtotal</span>
              <strong>{{ formatPrice(cartTotal) }}</strong>
            </div>

            <div>
              <span>Envío</span>
              <strong>
                {{ cartTotal >= 25 ? 'Gratis' : '2,99 €' }}
              </strong>
            </div>

            <div class="ck-total__final">
              <span>Total</span>
              <strong>
                {{ formatPrice(finalTotal) }}
              </strong>
            </div>
          </div>

          <button
            class="ck-submit"
            :disabled="processing || !cartItems.length"
            @click="submitPedido"
          >
            <span v-if="processing">Procesando...</span>
            <span v-else>
              Confirmar pedido
            </span>
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api'
const CART_KEY = 'cart_items'

const processing = ref(false)
const cartItems = ref([])
const useSavedCard = ref(true)

const paymentMethods = [
  {
    id: 'efectivo',
    label: 'Efectivo',
    icon: '💵',
    desc: 'Pagar al recibir',
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    icon: '💳',
    desc: 'Visa / Mastercard',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿️',
    desc: 'Pago online rápido',
  },
  {
    id: 'bizum',
    label: 'Bizum',
    icon: '📱',
    desc: 'Pago instantáneo',
  },
]

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

onMounted(() => {
  loadCart()
  loadUser()
})

function loadCart() {
  const saved = localStorage.getItem(CART_KEY)

  if (saved) {
    cartItems.value = JSON.parse(saved)
  }
}

function loadUser() {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) return

  form.value.nombre = user.name || ''
  form.value.email = user.email || ''
  form.value.telefono = user.telefono || ''
  form.value.direccion = user.direccion || ''
}

function toggleSavedCard() {
  useSavedCard.value = !useSavedCard.value
}

const cartCount = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.qty, 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((acc, item) => {
    return acc + item.product.price * item.qty
  }, 0)
})

const finalTotal = computed(() => {
  return cartTotal.value >= 25
    ? cartTotal.value
    : cartTotal.value + 2.99
})

function formatPrice(price) {
  return `${Number(price).toFixed(2)} €`
}

async function submitPedido() {
  try {
    processing.value = true

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

    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Error creando pedido')
    }

    localStorage.removeItem(CART_KEY)

    alert('Pedido realizado correctamente 🎉')

    window.location.href = '/perfil/pedidos'
  } catch (e) {
    console.error(e)
    alert('No se pudo procesar el pedido')
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.ck-page {
  min-height: 100svh;
  background: var(--sk-black);
  color: var(--sk-cream);
  padding: 3rem 0 5rem;
}

.ck-wrap {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: flex-start;
}

.ck-title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5vw, 4.5rem);
  line-height: .95;
  margin: .7rem 0;
}

.ck-title em {
  font-style: normal;
  color: var(--sk-orange);
}

.ck-sub {
  color: rgba(255,248,240,.45);
  line-height: 1.7;
  max-width: 700px;
}

.ck-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ck-card,
.ck-summary {
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,.06);
  background:
    linear-gradient(
      160deg,
      rgba(24,12,6,.95),
      rgba(8,5,3,1)
    );

  box-shadow: 0 20px 60px rgba(0,0,0,.35);
}

.ck-card {
  padding: 1.7rem;
}

.ck-card__header {
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.ck-card__header h2 {
  font-family: var(--font-display);
  letter-spacing: .06em;
  font-size: 1.4rem;
  color: var(--sk-white);
}

.ck-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ck-field {
  display: flex;
  flex-direction: column;
  gap: .55rem;
}

.ck-field--full {
  grid-column: span 2;
}

.ck-field label {
  font-size: .78rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(255,248,240,.38);
}

.ck-field input,
.ck-field textarea {
  width: 100%;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.035);
  border-radius: 14px;
  padding: .95rem 1rem;
  color: var(--sk-white);
  font-size: .95rem;
  transition:
    border-color .25s,
    background .25s,
    box-shadow .25s;
}

.ck-field input:focus,
.ck-field textarea:focus {
  outline: none;
  border-color: rgba(240,123,16,.55);
  background: rgba(255,255,255,.05);
  box-shadow: 0 0 0 4px rgba(240,123,16,.08);
}

.ck-field textarea {
  resize: vertical;
  min-height: 120px;
}

.ck-payments {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ck-payment {
  display: flex;
  align-items: center;
  gap: 1rem;

  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(255,255,255,.03);

  padding: 1rem;
  cursor: pointer;

  transition:
    transform .22s,
    border-color .22s,
    background .22s,
    box-shadow .22s;
}

.ck-payment:hover {
  transform: translateY(-2px);
  border-color: rgba(240,123,16,.24);
}

.ck-payment.active {
  background: rgba(240,123,16,.08);
  border-color: rgba(240,123,16,.45);
  box-shadow: 0 12px 28px rgba(240,123,16,.12);
}

.ck-payment__icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: rgba(255,255,255,.05);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.4rem;
  flex-shrink: 0;
}

.ck-payment strong {
  display: block;
  color: var(--sk-white);
  margin-bottom: .2rem;
}

.ck-payment p {
  color: rgba(255,248,240,.42);
  font-size: .82rem;
}

.ck-payment-box {
  margin-top: 1.4rem;
  padding-top: 1.4rem;
  border-top: 1px solid rgba(255,255,255,.06);
}

.ck-payment-box__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ck-payment-box__head h3 {
  font-family: var(--font-display);
  color: var(--sk-white);
}

.ck-mini-btn {
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: rgba(255,248,240,.7);

  padding: .7rem 1rem;
  border-radius: 12px;

  cursor: pointer;
  transition: .22s;
}

.ck-mini-btn:hover {
  background: rgba(255,255,255,.06);
}

.ck-saved-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1.4rem;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      rgba(200,32,26,.88),
      rgba(240,123,16,.95)
    );

  color: white;
}

.ck-chip {
  width: 44px;
  height: 32px;
  border-radius: 8px;
  display: block;
  margin-bottom: .8rem;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.9),
      rgba(255,255,255,.35)
    );
}

.ck-saved-card p {
  font-family: var(--font-display);
  letter-spacing: .15em;
  margin-bottom: .35rem;
}

.ck-saved-card small {
  opacity: .8;
}

.ck-use-btn {
  border: 0;
  border-radius: 12px;
  padding: .9rem 1.2rem;
  background: rgba(0,0,0,.2);
  color: white;
  font-weight: 700;
}

.ck-sidebar {
  position: sticky;
  top: calc(var(--nav-h) + 25px);
}

.ck-summary {
  padding: 1.5rem;
}

.ck-summary__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-bottom: 1rem;
  margin-bottom: 1rem;

  border-bottom: 1px solid rgba(255,255,255,.06);
}

.ck-summary__head h2 {
  font-family: var(--font-display);
  color: var(--sk-white);
  letter-spacing: .05em;
}

.ck-summary__head span {
  color: rgba(255,248,240,.4);
  font-size: .8rem;
}

.ck-items {
  display: flex;
  flex-direction: column;
  gap: .9rem;

  max-height: 420px;
  overflow-y: auto;

  padding-right: .4rem;
}

.ck-item {
  display: flex;
  align-items: center;
  gap: .8rem;

  padding: .75rem;

  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(255,255,255,.03);
}

.ck-item img {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
}

.ck-item__info {
  flex: 1;
}

.ck-item__info h4 {
  font-family: var(--font-display);
  color: var(--sk-white);
  margin-bottom: .3rem;
}

.ck-item__info p {
  font-size: .8rem;
  color: rgba(255,248,240,.4);
}

.ck-item strong {
  color: var(--sk-gold);
  font-family: var(--font-display);
}

.ck-empty {
  padding: 3rem 1rem;
  text-align: center;
  color: rgba(255,248,240,.35);
}

.ck-total {
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,.06);
  padding-top: 1rem;

  display: flex;
  flex-direction: column;
  gap: .85rem;
}

.ck-total > div {
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: rgba(255,248,240,.52);
}

.ck-total strong {
  color: var(--sk-white);
}

.ck-total__final {
  padding-top: .9rem;
  border-top: 1px solid rgba(255,255,255,.06);

  font-size: 1.15rem;
}

.ck-total__final strong {
  color: var(--sk-gold);
  font-size: 1.5rem;
  font-family: var(--font-display);
}

.ck-submit {
  width: 100%;
  margin-top: 1.4rem;

  border: 0;
  border-radius: 18px;

  padding: 1.1rem 1.4rem;

  background:
    linear-gradient(
      135deg,
      var(--sk-red),
      var(--sk-orange)
    );

  color: white;
  cursor: pointer;

  font-family: var(--font-display);
  letter-spacing: .14em;
  font-size: .95rem;

  transition:
    transform .22s,
    box-shadow .22s;

  box-shadow: 0 18px 40px rgba(200,32,26,.22);
}

.ck-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 48px rgba(200,32,26,.34);
}

.ck-submit:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity .28s ease,
    transform .28s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1100px) {
  .ck-wrap {
    grid-template-columns: 1fr;
  }

  .ck-sidebar {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .ck-grid,
  .ck-payments {
    grid-template-columns: 1fr;
  }

  .ck-field--full {
    grid-column: span 1;
  }

  .ck-page {
    padding-top: 2rem;
  }

  .ck-card,
  .ck-summary {
    padding: 1.2rem;
  }

  .ck-saved-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
```

---

# LocalStorage esperado

```js
localStorage.setItem('user', JSON.stringify({
  id: 1,
  name: 'Juan',
  email: 'juan@email.com',
  telefono: '+34 600000000',
  direccion: 'Barcelona',
}))

localStorage.setItem('token', 'TOKEN_DEL_USER')

localStorage.setItem('isAuthenticated', 'true')
```

---

# Payload que enviará al backend

```json
{
  "user_id": 1,
  "productos": [1, 5, 8],
  "unidades": [
    {
      "id": 1,
      "qty": 2
    }
  ],
  "estado": "pendiente",
  "total": 52.99,
  "direccion_local": "Barcelona Centro",
  "direccion": "Calle Mallorca 221",
  "notas": "Sin cebolla",
  "tipo_pago": "tarjeta",
  "datos_pago": {
    "titular": "Juan Perez",
    "numero": "0000 0000 0000 0000",
    "exp": "12/28",
    "cvv": "123"
  }
}
```
