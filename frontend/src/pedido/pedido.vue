<template>
  <section class="ck-page">
    <div class="container ck-wrap">

      <!-- LEFT -->
      <div class="ck-main">

        <!-- HEADER -->
        <div class="ck-head">
          <span class="section-tag">Finalitzar pedido</span>
          <h1 class="ck-title">Completa tu <em>pedido</em></h1>
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
              <input v-model="form.nombre" />
            </div>

            <div class="ck-field">
              <label>Email</label>
              <input v-model="form.email" />
            </div>

            <div class="ck-field">
              <label>Teléfono</label>
              <input v-model="form.telefono" />
            </div>

            <div class="ck-field">
              <label>Dirección local</label>
              <input v-model="form.direccion_local" />
            </div>

            <div class="ck-field ck-field--full">
              <label>Dirección de entrega</label>
              <input v-model="form.direccion" />
            </div>

            <div class="ck-field ck-field--full">
              <label>Notas</label>
              <textarea v-model="form.notas" />
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
              v-for="m in paymentMethods"
              :key="m.id"
              @click="form.tipo_pago = m.id"
              :class="{ active: form.tipo_pago === m.id }"
            >
              {{ m.icon }} {{ m.label }}
            </button>
          </div>

          <!-- CARD -->
          <div v-if="form.tipo_pago === 'tarjeta'">
            <input v-model="form.datos_pago.titular" placeholder="Titular" />
            <input v-model="form.datos_pago.numero" placeholder="Número" />
            <input v-model="form.datos_pago.exp" placeholder="MM/YY" />
            <input v-model="form.datos_pago.cvv" placeholder="CVV" />
          </div>

          <!-- BIZUM -->
          <div v-if="form.tipo_pago === 'bizum'">
            <input v-model="form.datos_pago.bizum" placeholder="Bizum" />
          </div>

          <!-- PAYPAL -->
          <div v-if="form.tipo_pago === 'paypal'">
            <input v-model="form.datos_pago.paypal" placeholder="PayPal" />
          </div>

        </div>
      </div>

      <!-- SIDEBAR -->
      <aside class="ck-sidebar">

        <div v-for="item in cartItems" :key="item.product.id">
          {{ item.product.name }}
        </div>

        <div>Total: {{ finalTotal }}</div>

        <button @click="submitPedido" :disabled="processing">
          Confirmar pedido
        </button>

      </aside>

    </div>
  </section>
</template>

<script setup>
import { useCheckoutPedido } from './pedido.js'
import './pedido.css'

const {
  form,
  paymentMethods,
  cartItems,
  finalTotal,
  processing,
  submitPedido
} = useCheckoutPedido()
</script>