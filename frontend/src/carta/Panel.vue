<template>
  <div class="cart-panel">

    <div v-if="!items.length" class="cart-panel__empty">
      <span class="cart-panel__empty-icon">🛒</span>
      <p>La teva comanda és buida.</p>
      <span class="cart-panel__empty-hint">Afegeix plats des del menú</span>
    </div>

    <template v-else>

      <ul class="cart-list">
        <li v-for="item in items" :key="item.product.id" class="cart-item">
          <div class="cart-item__img">
            <img :src="item.product.img" :alt="item.product.name" loading="lazy" />
          </div>
          <div class="cart-item__info">
            <span class="cart-item__name">{{ item.product.name }}</span>
            <span class="cart-item__unit-price">€{{ item.product.price.toFixed(2) }} / u</span>
          </div>
          <div class="cart-item__right">
            <div class="mn-stepper mn-stepper--sm">
              <button class="mn-stepper__btn" @click="$emit('update-qty', item.product.id, -1)" aria-label="Reduir">−</button>
              <span class="mn-stepper__qty">{{ item.qty }}</span>
              <button class="mn-stepper__btn" @click="$emit('update-qty', item.product.id, +1)" aria-label="Augmentar">+</button>
            </div>
            <span class="cart-item__subtotal">€{{ (item.product.price * item.qty).toFixed(2) }}</span>
            <button class="cart-item__remove" @click="$emit('remove', item.product.id)" aria-label="Eliminar">✕</button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <div class="cart-summary__row">
          <span>Subtotal</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>
        <div class="cart-summary__row cart-summary__row--delivery">
          <span>Enviament</span>
          <span class="cart-summary__free">Gratis</span>
        </div>
        <div class="cart-summary__divider"></div>
        <div class="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>
      </div>

      <div class="cart-actions">
        <RouterLink
          to="/pedido"
          class="cart-checkout-btn"
        >
          Confirmar comanda
          <span aria-hidden="true">→</span>
        </RouterLink>
        <button class="cart-clear-btn" @click="$emit('clear')">Buidar comanda</button>
      </div>

    </template>
  </div>
</template>

<script setup>
import './carta.js'
defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
})
defineEmits(['update-qty', 'remove', 'clear'])
</script>