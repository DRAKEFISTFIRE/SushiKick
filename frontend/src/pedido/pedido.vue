<template>
  <div class="pedido-page">
    <Navbar />

    <!-- ══════════════════════════════════
         SUCCESS SCREEN
    ══════════════════════════════════ -->
    <Transition name="success-fade">
      <div v-if="submitted" class="pd-success">
        <div class="pd-success__card">
          <div class="pd-success__ring"></div>
          <div class="pd-success__icon">✅</div>
          <h1 class="pd-success__title">Comanda confirmada!</h1>
          <p class="pd-success__sub">
            La teva comanda <strong>#{{ orderId }}</strong> s'ha rebut.
            T'avisarem quan estigui en camí.
          </p>
          <div class="pd-success__meta">
            <div class="pd-success__meta-item">
              <span>🕒</span>
              <span>Temps estimat: <strong>25–35 min</strong></span>
            </div>
            <div class="pd-success__meta-item">
              <span>📍</span>
              <span>{{ deliveryType === 'domicili' ? form.address : form.addressLocal }}</span>
            </div>
          </div>
          <div class="pd-success__actions">
            <router-link to="/" class="btn-primary">Tornar a l'inici</router-link>
            <router-link to="/carta" class="btn-ghost">Veure la carta</router-link>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════
         MAIN CONTENT
    ══════════════════════════════════ -->
    <template v-if="!submitted">

      <!-- Hero -->
      <section class="pd-hero">
        <div class="pd-hero__overlay"></div>
        <div class="pd-hero__content container">
          <span class="section-tag">🛵 CONFIRMAR COMANDA</span>
          <h1 class="pd-hero__title">La teva<br /><em>comanda</em></h1>
        </div>
      </section>

      <!-- Empty cart guard -->
      <div v-if="!cartItems.length" class="pd-empty container">
        <span class="pd-empty__icon">🛒</span>
        <p>El carret és buit.</p>
        <router-link to="/carta" class="btn-primary">Veure la carta</router-link>
      </div>

      <div v-else class="pd-layout container">

        <!-- ════════════════════════════
             LEFT: FORM
        ════════════════════════════ -->
        <div class="pd-form-col">

          <!-- ── 1. Delivery type ── -->
          <div class="pd-block">
            <h2 class="pd-block__title">
              <span class="pd-block__num">01</span>
              Com vols rebre-ho?
            </h2>
            <div class="pd-delivery-tabs">
              <button
                v-for="dt in DELIVERY_TYPES"
                :key="dt.id"
                class="pd-delivery-tab"
                :class="{ active: deliveryType === dt.id }"
                @click="deliveryType = dt.id"
                :aria-pressed="deliveryType === dt.id"
              >
                <span class="pd-delivery-tab__icon">{{ dt.icon }}</span>
                <span>{{ dt.label }}</span>
              </button>
            </div>
          </div>

          <!-- ── 2. Contact data ── -->
          <div class="pd-block">
            <h2 class="pd-block__title">
              <span class="pd-block__num">02</span>
              Dades de contacte
            </h2>

            <div class="pd-fields">
              <div class="f-row">
                <!-- Name -->
                <div class="f-group">
                  <label class="f-label" for="pd-name">Nom complet</label>
                  <div class="f-input-wrap" :class="fieldClass('name')">
                    <span class="f-icon" aria-hidden="true">👤</span>
                    <input
                      id="pd-name"
                      class="f-input"
                      type="text"
                      placeholder="El teu nom"
                      v-model="form.name"
                      autocomplete="name"
                      @blur="touch('name')"
                    />
                    <span v-if="isFieldValid('name')" class="f-check">✓</span>
                  </div>
                  <Transition name="err">
                    <p v-if="visibleError('name')" class="f-error">{{ visibleError('name') }}</p>
                  </Transition>
                </div>

                <!-- Phone -->
                <div class="f-group">
                  <label class="f-label" for="pd-phone">Telèfon</label>
                  <div class="f-input-wrap" :class="fieldClass('phone')">
                    <span class="f-icon" aria-hidden="true">📞</span>
                    <input
                      id="pd-phone"
                      class="f-input"
                      type="tel"
                      placeholder="+34 600 000 000"
                      v-model="form.phone"
                      autocomplete="tel"
                      @blur="touch('phone')"
                    />
                    <span v-if="isFieldValid('phone')" class="f-check">✓</span>
                  </div>
                  <Transition name="err">
                    <p v-if="visibleError('phone')" class="f-error">{{ visibleError('phone') }}</p>
                  </Transition>
                </div>
              </div>

              <!-- Address (only for delivery) -->
              <Transition name="slide-down">
                <div v-if="deliveryType === 'domicili'" class="f-group">
                  <label class="f-label" for="pd-address">Adreça d'entrega</label>

                  <div class="f-input-wrap" :class="fieldClass('address')">
                    <span class="f-icon" aria-hidden="true">📍</span>
                    <input
                      id="pd-address"
                      class="f-input"
                      type="text"
                      placeholder="Carrer, número, pis..."
                      v-model="form.address"
                      autocomplete="street-address"
                      @blur="touch('address')"
                    />
                    <span v-if="isFieldValid('address')" class="f-check">✓</span>
                  </div>

                  <Transition name="err">
                    <p v-if="visibleError('address')" class="f-error">
                      {{ visibleError('address') }}
                    </p>
                  </Transition>
                </div>
              </Transition>

              <!-- ⏰ Hora del pedido -->
              <div class="f-group">
                <label class="f-label" for="pd-time">Hora de la comanda</label>

                <div class="f-input-wrap" :class="fieldClass('orderTime')">
                  <span class="f-icon" aria-hidden="true">⏰</span>

                  <input
                    id="pd-time"
                    class="f-input"
                    type="time"
                    v-model="form.orderTime"
                    @blur="touch('orderTime')"
                  />

                  <span v-if="form.orderTime" class="f-check">✓</span>
                </div>

                <Transition name="err">
                  <p v-if="visibleError('orderTime')" class="f-error">
                    {{ visibleError('orderTime') }}
                  </p>
                </Transition>
              </div>

              <!-- Pickup info banner -->
              <Transition name="slide-down">
                <div v-if="deliveryType === 'local'" class="pd-pickup-banner">
                  <span class="pd-pickup-banner__icon">🏪</span>
                  <div>
                    <strong>Recollida al local</strong>
                    <p>{{ form.addressLocal }}</p>
                  </div>
                </div>
              </Transition>

              <!-- Notes -->
              <div class="f-group">
                <label class="f-label" for="pd-notes">Notes (opcional)</label>
                <textarea
                  id="pd-notes"
                  class="f-input f-textarea"
                  placeholder="Al·lèrgies, instruccions especials, pis sense ascensor..."
                  v-model="form.notes"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- ── 3. Payment method ── -->
          <div class="pd-block">
            <h2 class="pd-block__title">
              <span class="pd-block__num">03</span>
              Mètode de pagament
            </h2>

            <!-- Payment method selector -->
            <div class="pd-payment-grid">
              <button
                v-for="pm in PAYMENT_METHODS"
                :key="pm.id"
                class="pd-pm-card"
                :class="{ active: form.paymentMethod === pm.id }"
                @click="form.paymentMethod = pm.id"
                :aria-pressed="form.paymentMethod === pm.id"
              >
                <span class="pd-pm-card__icon">{{ pm.icon }}</span>
                <span class="pd-pm-card__label">{{ pm.label }}</span>
                <span class="pd-pm-card__desc">{{ pm.desc }}</span>
                <span class="pd-pm-card__check" aria-hidden="true"></span>
              </button>
            </div>

            <!-- Payment detail fields -->
            <Transition name="slide-down" mode="out-in">

              <!-- Card fields -->
              <div v-if="form.paymentMethod === 'tarjeta'" key="tarjeta" class="pd-payment-fields">
                <div class="pd-payment-fields__hd">
                  <span>💳</span>
                  <span>Detalls de la targeta</span>
                </div>

                <div class="pd-fields">
                  <div class="f-group">
                    <label class="f-label" for="card-name">Titular</label>
                    <div class="f-input-wrap" :class="fieldClass('cardName')">
                      <input
                        id="card-name"
                        class="f-input"
                        type="text"
                        placeholder="Nom tal com apareix a la targeta"
                        v-model="form.cardName"
                        autocomplete="cc-name"
                        @blur="touch('cardName')"
                      />
                      <span v-if="isFieldValid('cardName')" class="f-check">✓</span>
                    </div>
                    <Transition name="err">
                      <p v-if="visibleError('cardName')" class="f-error">{{ visibleError('cardName') }}</p>
                    </Transition>
                  </div>

                  <div class="f-group">
                    <label class="f-label" for="card-num">Número de targeta</label>
                    <div class="f-input-wrap pd-card-num" :class="fieldClass('cardNumber')">
                      <input
                        id="card-num"
                        class="f-input"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        :value="form.cardNumber"
                        @input="formatCardNumber"
                        @blur="touch('cardNumber')"
                        inputmode="numeric"
                        autocomplete="cc-number"
                        maxlength="19"
                      />
                      <span class="pd-card-brand" aria-hidden="true">{{ cardBrand }}</span>
                    </div>
                    <Transition name="err">
                      <p v-if="visibleError('cardNumber')" class="f-error">{{ visibleError('cardNumber') }}</p>
                    </Transition>
                  </div>

                  <div class="f-row">
                    <div class="f-group">
                      <label class="f-label" for="card-exp">Caducitat</label>
                      <div class="f-input-wrap" :class="fieldClass('cardExpiry')">
                        <input
                          id="card-exp"
                          class="f-input"
                          type="text"
                          placeholder="MM/AA"
                          :value="form.cardExpiry"
                          @input="formatCardExpiry"
                          @blur="touch('cardExpiry')"
                          inputmode="numeric"
                          autocomplete="cc-exp"
                          maxlength="5"
                        />
                      </div>
                      <Transition name="err">
                        <p v-if="visibleError('cardExpiry')" class="f-error">{{ visibleError('cardExpiry') }}</p>
                      </Transition>
                    </div>

                    <div class="f-group">
                      <label class="f-label" for="card-cvv">
                        CVV
                        <span class="pd-cvv-hint" title="Els 3 dígits del darrere de la targeta">?</span>
                      </label>
                      <div class="f-input-wrap" :class="fieldClass('cardCvv')">
                        <input
                          id="card-cvv"
                          class="f-input"
                          type="password"
                          placeholder="•••"
                          v-model="form.cardCvv"
                          @blur="touch('cardCvv')"
                          inputmode="numeric"
                          autocomplete="cc-csc"
                          maxlength="4"
                        />
                      </div>
                      <Transition name="err">
                        <p v-if="visibleError('cardCvv')" class="f-error">{{ visibleError('cardCvv') }}</p>
                      </Transition>
                    </div>
                  </div>

                  <label class="pd-save-card">
                    <input type="checkbox" v-model="form.saveCard" />
                    <span class="pd-save-card__box" aria-hidden="true"></span>
                    <span>Guardar targeta per a futures compres</span>
                  </label>
                </div>
              </div>

              <!-- Bizum fields -->
              <div v-else-if="form.paymentMethod === 'bizum'" key="bizum" class="pd-payment-fields">
                <div class="pd-payment-fields__hd">
                  <span>📱</span>
                  <span>Pagament per Bizum</span>
                </div>
                <div class="pd-fields">
                  <div class="f-group">
                    <label class="f-label" for="bizum-phone">Telèfon Bizum</label>
                    <div class="f-input-wrap" :class="fieldClass('bizumPhone')">
                      <span class="f-icon">📱</span>
                      <input
                        id="bizum-phone"
                        class="f-input"
                        type="tel"
                        placeholder="+34 600 000 000"
                        v-model="form.bizumPhone"
                        @blur="touch('bizumPhone')"
                      />
                      <span v-if="isFieldValid('bizumPhone')" class="f-check">✓</span>
                    </div>
                    <Transition name="err">
                      <p v-if="visibleError('bizumPhone')" class="f-error">{{ visibleError('bizumPhone') }}</p>
                    </Transition>
                  </div>
                  <div class="pd-info-banner">
                    <span>ℹ️</span>
                    <p>Envia el pagament al número <strong>+34 93 777 13 37</strong> amb el concepte <strong>#SUSHIKICK</strong> un cop confirmis la comanda.</p>
                  </div>
                </div>
              </div>

              <!-- PayPal fields -->
              <div v-else-if="form.paymentMethod === 'paypal'" key="paypal" class="pd-payment-fields">
                <div class="pd-payment-fields__hd">
                  <span>🅿</span>
                  <span>Pagament amb PayPal</span>
                </div>
                <div class="pd-fields">
                  <div class="f-group">
                    <label class="f-label" for="paypal-email">Email PayPal</label>
                    <div class="f-input-wrap" :class="fieldClass('paypalEmail')">
                      <span class="f-icon">✉</span>
                      <input
                        id="paypal-email"
                        class="f-input"
                        type="email"
                        placeholder="tu@exemple.com"
                        v-model="form.paypalEmail"
                        @blur="touch('paypalEmail')"
                        autocomplete="email"
                      />
                      <span v-if="isFieldValid('paypalEmail')" class="f-check">✓</span>
                    </div>
                    <Transition name="err">
                      <p v-if="visibleError('paypalEmail')" class="f-error">{{ visibleError('paypalEmail') }}</p>
                    </Transition>
                  </div>
                  <div class="pd-info-banner">
                    <span>ℹ️</span>
                    <p>Seràs redirigit a PayPal per completar el pagament de forma segura.</p>
                  </div>
                </div>
              </div>

              <!-- Cash (no extra fields) -->
              <div v-else key="efectivo" class="pd-payment-fields pd-payment-fields--cash">
                <span class="pd-cash-icon">💵</span>
                <p>Pagues quan arribi el repartidor. Prepara l'import exacte si pots.</p>
              </div>

            </Transition>
          </div>

          <!-- Submit error -->
          <Transition name="err">
            <div v-if="submitError" class="pd-submit-error">
              <span>⚠️</span>
              <p>{{ submitError }}</p>
            </div>
          </Transition>

        </div>

        <!-- ════════════════════════════
             RIGHT: ORDER SUMMARY
        ════════════════════════════ -->
        <aside class="pd-summary">
          <div class="pd-summary__inner">

            <h2 class="pd-summary__title">Resum</h2>

            <!-- Items list -->
            <ul class="pd-items">
              <li v-for="item in cartItems" :key="item.product.id" class="pd-item">
                <div class="pd-item__img">
                  <img
                    v-if="item.product.img"
                    :src="item.product.img"
                    :alt="item.product.name"
                    loading="lazy"
                  />
                  <span v-else class="pd-item__img-placeholder">🍣</span>
                </div>
                <div class="pd-item__info">
                  <span class="pd-item__name">{{ item.product.name }}</span>
                  <span class="pd-item__qty">× {{ item.qty }}</span>
                </div>
                <span class="pd-item__price">
                  €{{ (item.product.price * item.qty).toFixed(2) }}
                </span>
              </li>
            </ul>

            <!-- Totals -->
            <div class="pd-totals">
              <div class="pd-totals__row">
                <span>Subtotal</span>
                <span>€{{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="pd-totals__row">
                <span>Entrega</span>
                <span class="pd-totals__free">Gratis</span>
              </div>
              <div class="pd-totals__divider"></div>
              <div class="pd-totals__row pd-totals__row--total">
                <span>Total</span>
                <span>€{{ cartTotal.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Delivery info pill -->
            <div class="pd-delivery-pill">
              <span>{{ deliveryType === 'domicili' ? '🛵 A domicili' : '🏪 Recollida al local' }}</span>
              <span class="pd-delivery-pill__time">~30 min</span>
            </div>

            <!-- CTA button -->
            <button
              class="pd-submit-btn"
              :class="{ loading: submitting }"
              @click="submitOrder"
              :disabled="submitting"
              :aria-busy="submitting"
            >
              <span v-if="!submitting" class="pd-submit-btn__inner">
                <span>Confirmar comanda</span>
                <span class="pd-submit-btn__total">€{{ cartTotal.toFixed(2) }}</span>
              </span>
              <span v-else class="pd-submit-btn__spinner" aria-hidden="true"></span>
              <span v-if="submitting" class="sr-only">Processant...</span>
            </button>

            <!-- Security badge -->
            <div class="pd-security">
              <span>🔒</span>
              <span>Pagament 100% segur i xifrat</span>
            </div>

          </div>
        </aside>

      </div>
    </template>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from '../components/navbar/Navbar.vue'
import './pedido.css'
import { PAYMENT_METHODS, DELIVERY_TYPES, useOrder } from './pedido.js'

const {
  cartItems,
  cartTotal,
  deliveryType,
  form,
  touch,
  errors,
  visibleError,
  submitAttempted,
  formatCardNumber,
  formatCardExpiry,
  submitting,
  submitted,
  orderId,
  submitError,
  submitOrder,
} = useOrder()

// ── Helpers ───────────────────────────────────────────────────────────────────

function isFieldValid(field) {
  return (submitAttempted.value || form.value[field]) && !errors.value[field]
}

function fieldClass(field) {
  const touched = submitAttempted.value || form.value[field]
  return {
    'has-error': touched && errors.value[field],
    'is-valid':  touched && !errors.value[field],
  }
}

// Detect card brand from first digits
const cardBrand = computed(() => {
  const num = form.value.cardNumber.replace(/\s/g, '')
  if (!num) return ''
  if (num.startsWith('4'))         return '💳 Visa'
  if (/^5[1-5]/.test(num))         return '💳 MC'
  if (num.startsWith('34') || num.startsWith('37')) return '💳 Amex'
  return '💳'
})
</script>