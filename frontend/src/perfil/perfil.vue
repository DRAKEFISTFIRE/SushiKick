<template>
  <div class="pf-page">
    <Navbar />

    <!-- ══════════════════════════════
         LOADING SKELETON
    ══════════════════════════════ -->
    <div v-if="loading" class="pf-skeleton">
      <div class="pf-skeleton__banner"></div>
      <div class="pf-skeleton__avatar"></div>
      <div class="pf-skeleton__lines">
        <div class="pf-skeleton__line pf-skeleton__line--lg"></div>
        <div class="pf-skeleton__line pf-skeleton__line--sm"></div>
      </div>
    </div>

    <template v-else>

      <!-- ══════════════════════════════
           HERO — BANNER + AVATAR
      ══════════════════════════════ -->
      <div class="pf-hero">

      

        <!-- Banner -->
        <div class="pf-banner">
          <img
            v-if="form.imagen_banner"
            :src="form.imagen_banner"
            alt="Banner"
            class="pf-banner__img"
          />
          <div v-else class="pf-banner__fallback"></div>
          <div class="pf-banner__overlay"></div>

          <!-- Banner upload button -->
          <label class="pf-banner__edit" title="Canviar banner" aria-label="Canviar banner">
            <span>📷</span>
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              @change="onBannerChange"
              :disabled="uploadingBanner"
            />
          </label>
        </div>

        <!-- Avatar -->
        <div class="pf-avatar-wrap">
          <div class="pf-avatar" :class="{ 'pf-avatar--uploading': uploadingAvatar }">
            <img v-if="form.imagen_perfil" :src="form.imagen_perfil" alt="Avatar" />
            <div v-else class="pf-avatar__fallback">{{ initials }}</div>
            <div v-if="uploadingAvatar" class="pf-avatar__spinner" aria-hidden="true"></div>
          </div>
          <label class="pf-avatar__edit" title="Canviar foto" aria-label="Canviar foto de perfil">
            <span>✏️</span>
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              @change="onAvatarChange"
              :disabled="uploadingAvatar"
            />
          </label>
        </div>

        <!-- Identity -->
        <div class="pf-identity">
          <h1 class="pf-identity__name">{{ form.nombre || 'El teu perfil' }}</h1>
          <p class="pf-identity__email">{{ form.email }}</p>
          <div v-if="isDirty" class="pf-dirty-badge">● Canvis sense guardar</div>
        </div>

      </div>

      <!-- ══════════════════════════════
           TABS
      ══════════════════════════════ -->
      <div class="pf-tabs container">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          class="pf-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
          :aria-selected="activeTab === tab.id"
        >
          <span class="pf-tab__icon" aria-hidden="true">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- ══════════════════════════════
           CONTENT
      ══════════════════════════════ -->
      <div class="pf-content container">

        <Transition name="pf-tab-slide" mode="out-in">

          <!-- ── TAB: PROFILE ── -->
          <div v-if="activeTab === 'profile'" key="profile" class="pf-panel">

            <!-- Global error / success -->
            <Transition name="pf-flash">
              <div v-if="success" class="pf-flash pf-flash--ok">✅ Canvis guardats correctament.</div>
            </Transition>
            <Transition name="pf-flash">
              <div v-if="error" class="pf-flash pf-flash--err">⚠️ {{ error }}</div>
            </Transition>

            <!-- ── Personal info ── -->
            <section class="pf-section">
              <div class="pf-section__hd">
                <span class="pf-section__icon">👤</span>
                <h2 class="pf-section__title">Informació personal</h2>
              </div>

              <div class="pf-grid">

                <div class="f-group">
                  <label class="f-label" for="pf-nombre">Nom complet</label>
                  <div class="f-input-wrap" :class="fieldClass('nombre')">
                    <input
                      id="pf-nombre"
                      class="pf-input"
                      type="text"
                      placeholder="El teu nom"
                      v-model="form.nombre"
                      autocomplete="name"
                      @blur="touch('nombre')"
                    />
                    <span v-if="isFieldValid('nombre')" class="f-check">✓</span>
                  </div>
                  <Transition name="err">
                    <p v-if="visibleError('nombre')" class="f-error">{{ visibleError('nombre') }}</p>
                  </Transition>
                </div>

                <div class="f-group">
                  <label class="f-label" for="pf-email">Correu electrònic</label>
                  <div class="f-input-wrap" :class="fieldClass('email')">
                    <input
                      id="pf-email"
                      class="pf-input"
                      type="email"
                      placeholder="tu@exemple.com"
                      v-model="form.email"
                      autocomplete="email"
                      @blur="touch('email')"
                    />
                    <span v-if="isFieldValid('email')" class="f-check">✓</span>
                  </div>
                  <Transition name="err">
                    <p v-if="visibleError('email')" class="f-error">{{ visibleError('email') }}</p>
                  </Transition>
                </div>

                <div class="f-group">
                  <label class="f-label" for="pf-tel">Telèfon</label>
                  <div class="f-input-wrap" :class="fieldClass('telefono')">
                    <input
                      id="pf-tel"
                      class="pf-input"
                      type="tel"
                      placeholder="+34 600 000 000"
                      v-model="form.telefono"
                      autocomplete="tel"
                      @blur="touch('telefono')"
                    />
                    <span v-if="isFieldValid('telefono')" class="f-check">✓</span>
                  </div>
                  <Transition name="err">
                    <p v-if="visibleError('telefono')" class="f-error">{{ visibleError('telefono') }}</p>
                  </Transition>
                </div>

                <div class="f-group">
                  <label class="f-label" for="pf-bday">Data de naixement</label>
                  <div class="f-input-wrap">
                    <input
                      id="pf-bday"
                      class="pf-input"
                      type="date"
                      v-model="form.fecha_nacimiento"
                      @blur="touch('fecha_nacimiento')"
                    />
                  </div>
                </div>

                <div class="f-group f-group--full">
                  <label class="f-label" for="pf-dir">Adreça</label>
                  <div class="f-input-wrap">
                    <input
                      id="pf-dir"
                      class="pf-input"
                      type="text"
                      placeholder="Carrer, número, pis..."
                      v-model="form.direccion"
                      autocomplete="street-address"
                    />
                  </div>
                </div>

                <div class="f-group f-group--full">
                  <label class="f-label" for="pf-bio">Biografia (opcional)</label>
                  <textarea
                    id="pf-bio"
                    class="pf-input pf-textarea"
                    placeholder="Explica'ns alguna cosa sobre tu..."
                    v-model="form.biografia"
                    rows="3"
                  ></textarea>
                </div>

              </div>
            </section>

            <section class="pf-section">
          <div class="pf-section__hd">
            <span class="pf-section__icon">🖼</span>
            <h2 class="pf-section__title">Imatges de perfil</h2>
          </div>

          <div class="pf-image-fields">

            <!-- Avatar -->
            <div class="pf-image-row">
              <div class="pf-image-preview pf-image-preview--avatar">
                <img
                  v-if="form.imagen_perfil"
                  :src="form.imagen_perfil"
                  alt="Avatar"
                />
                <span v-else class="pf-image-preview__empty">👤</span>
              </div>

              <div class="f-group" style="flex:1">
                <label class="f-label">Foto de perfil</label>

                <input
                  type="file"
                  accept="image/*"
                  class="pf-input"
                  @change="onAvatarChange"
                  :disabled="uploadingAvatar"
                />

                <p class="pf-hint">
                  JPG, PNG o WEBP. Máx. 5 MB.
                </p>
              </div>
            </div>

            <!-- Banner -->
            <div class="pf-image-row">
              <div class="pf-image-preview pf-image-preview--banner">
                <img
                  v-if="form.imagen_banner"
                  :src="form.imagen_banner"
                  alt="Banner"
                />
                <span v-else class="pf-image-preview__empty">🖼️</span>
              </div>

              <div class="f-group" style="flex:1">
                <label class="f-label">Banner de perfil</label>

                <input
                  type="file"
                  accept="image/*"
                  class="pf-input"
                  @change="onBannerChange"
                  :disabled="uploadingBanner"
                />

                <p class="pf-hint">
                  Recomendado: 1500x500 px.
                </p>
              </div>
            </div>

          </div>
        </section>

          <!-- ── Payment methods ── -->
        <section class="pf-section">
          <div class="pf-section__hd">
            <span class="pf-section__icon">💳</span>
            <h2 class="pf-section__title">Mètodes de pagament</h2>
          </div>

          <!-- LISTA DE MÉTODOS -->
          <div class="pf-payments">

            <div
              v-for="(pm, i) in form.metodos_pago"
              :key="i"
              class="pf-payment-item"
            >

              <!-- ICONO -->
              <div class="pf-payment-item__icon">
                {{
                  PAYMENT_TYPES.find(t => t.id === pm.tipo)?.icon ?? '💳'
                }}
              </div>

              <!-- TIPO -->
              <select
                class="pf-input pf-select"
                v-model="pm.tipo"
              >
                <option
                  v-for="t in PAYMENT_TYPES"
                  :key="t.id"
                  :value="t.id"
                >
                  {{ t.label }}
                </option>
              </select>

              <!-- DETALLES SEGÚN TIPO -->
              <div class="pf-payment-item__details">

                <!-- TARJETA -->
                <template v-if="pm.tipo === 'tarjeta'">
                  <input
                    class="pf-input"
                    v-model="pm.detalles.titular"
                    placeholder="Titular"
                  />

                  <input
                    class="pf-input"
                    v-model="pm.detalles.numero"
                    placeholder="0000 0000 0000 0000"
                  />

                  <div class="pf-grid">
                    <input
                      class="pf-input"
                      v-model="pm.detalles.exp"
                      placeholder="MM/YY"
                    />

                    <input
                      class="pf-input"
                      v-model="pm.detalles.cvv"
                      placeholder="CVV"
                      type="password"
                    />
                  </div>
                </template>

                <!-- BIZUM -->
                <template v-else-if="pm.tipo === 'bizum'">
                  <input
                    class="pf-input"
                    v-model="pm.detalles.telefono"
                    placeholder="+34 600 000 000"
                  />
                </template>

                <!-- PAYPAL -->
                <template v-else-if="pm.tipo === 'paypal'">
                  <input
                    class="pf-input"
                    v-model="pm.detalles.email"
                    placeholder="paypal@email.com"
                    type="email"
                  />
                </template>

              </div>

              <!-- REMOVE -->
              <button
                class="pf-payment-item__remove"
                @click="removePayment(i)"
                aria-label="Eliminar método de pago"
              >
                ✕
              </button>

            </div>

            <!-- ADD -->
            <button class="pf-add-payment" @click="addPayment">
              <span>+</span> Afegir mètode de pagament
            </button>

          </div>
        </section>

            <!-- ── Save button ── -->
            <div class="pf-save-row">
              <button
                class="pf-save-btn"
                :class="{ loading: saving, disabled: !isDirty }"
                :disabled="saving || !isDirty"
                @click="save"
                :aria-busy="saving"
              >
                <span v-if="!saving">
                  Guardar canvis
                  <span v-if="isDirty" class="pf-save-btn__dot" aria-hidden="true"></span>
                </span>
                <span v-else class="pf-spinner" aria-hidden="true"></span>
                <span v-if="saving" class="sr-only">Guardant...</span>
              </button>
            </div>

          </div>

          <!-- ── TAB: PASSWORD ── -->
          <div v-else-if="activeTab === 'password'" key="password" class="pf-panel">

            <section class="pf-section pf-section--narrow">
              <div class="pf-section__hd">
                <span class="pf-section__icon">🔒</span>
                <h2 class="pf-section__title">Canviar contrasenya</h2>
              </div>

              <Transition name="pf-flash">
                <div v-if="passwordSuccess" class="pf-flash pf-flash--ok">✅ Contrasenya actualitzada.</div>
              </Transition>
              <Transition name="pf-flash">
                <div v-if="passwordError" class="pf-flash pf-flash--err">⚠️ {{ passwordError }}</div>
              </Transition>

              <div class="pf-fields">
                <div class="f-group">
                  <label class="f-label" for="pw-current">Contrasenya actual</label>
                  <div class="f-input-wrap">
                    <input
                      id="pw-current"
                      class="pf-input"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      v-model="currentPassword"
                      autocomplete="current-password"
                    />
                    <button type="button" class="pf-toggle-pass" @click="showPassword = !showPassword">
                      {{ showPassword ? '🙈' : '👁' }}
                    </button>
                  </div>
                </div>

                <div class="f-group">
                  <label class="f-label" for="pw-new">Nova contrasenya</label>
                  <div class="f-input-wrap">
                    <input
                      id="pw-new"
                      class="pf-input"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Mínim 8 caràcters"
                      v-model="newPassword"
                      autocomplete="new-password"
                    />
                    <button type="button" class="pf-toggle-pass" @click="showNewPassword = !showNewPassword">
                      {{ showNewPassword ? '🙈' : '👁' }}
                    </button>
                  </div>
                </div>

                <div class="f-group">
                  <label class="f-label" for="pw-confirm">Confirmar nova contrasenya</label>
                  <div class="f-input-wrap">
                    <input
                      id="pw-confirm"
                      class="pf-input"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Repeteix la nova contrasenya"
                      v-model="confirmPassword"
                      autocomplete="new-password"
                    />
                  </div>
                </div>

                <button
                  class="pf-save-btn"
                  :class="{ loading: savingPassword }"
                  :disabled="savingPassword"
                  @click="changePassword"
                >
                  <span v-if="!savingPassword">Canviar contrasenya</span>
                  <span v-else class="pf-spinner" aria-hidden="true"></span>
                </button>
              </div>
            </section>
          </div>

          <!-- ── TAB: ORDERS ── -->
          <div v-else-if="activeTab === 'orders'" key="orders" class="pf-panel">

            <section class="pf-section">
              <div class="pf-section__hd">
                <span class="pf-section__icon">🛵</span>
                <h2 class="pf-section__title">Historial de comandes</h2>
              </div>

              <!-- Loading orders -->
              <div v-if="loadingOrders" class="pf-state">
                <div class="pf-spinner pf-spinner--lg" aria-hidden="true"></div>
                <p>Carregant comandes...</p>
              </div>

              <!-- Empty -->
              <div v-else-if="!orders.length" class="pf-state">
                <span class="pf-state__icon">🛒</span>
                <p>Encara no has fet cap comanda.</p>
                <router-link to="/carta" class="pf-cta-link">Veure la carta →</router-link>
              </div>

              <!-- Orders list -->
              <ul v-else class="pf-orders">
                <li v-for="order in orders" :key="order.id" class="pf-order">
                  <div class="pf-order__left">
                    <div class="pf-order__id">#{{ order.id }}</div>
                    <div class="pf-order__date">{{ formatDate(order.hora_pedido) }}</div>
                  </div>
                  <div class="pf-order__center">
                    <div class="pf-order__items">
                      {{ formatOrderItems(order) }}
                    </div>
                    <div class="pf-order__address">{{ order.direccion }}</div>
                  </div>
                  <div class="pf-order__right">
                    <span class="pf-order__total">€{{ Number(order.total).toFixed(2) }}</span>
                    <span
                      class="pf-order__status"
                      :class="`pf-order__status--${order.estado}`"
                    >{{ STATUS_LABELS[order.estado] ?? order.estado }}</span>
                  </div>
                </li>
              </ul>
            </section>

          </div>

        </Transition>
      </div>

    </template>
  </div>
</template>

<script setup>
import Navbar from '../components/navbar/Navbar.vue'
import './perfil.css'
import { usePerfil } from './perfil.js'

const {
  loading,
  saving,
  error,
  success,
  isDirty,
  form,
  initials,
  touched,
  touch,
  errors,
  visibleError,
  isFieldValid,
  fieldClass,
  uploadingAvatar,
  uploadingBanner,
  onAvatarChange,
  onBannerChange,
  showPassword,
  showNewPassword,
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  passwordSuccess,
  savingPassword,
  changePassword,
  PAYMENT_TYPES,
  addPayment,
  removePayment,
  orders,
  loadingOrders,
  activeTab,
  save,
} = usePerfil()

// ── Static data ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',  label: 'Perfil',      icon: '👤' },
  { id: 'password', label: 'Contrasenya', icon: '🔒' },
  { id: 'orders',   label: 'Comandes',    icon: '🛵' },
]

const STATUS_LABELS = {
  pendiente:   '⏳ Pendent',
  preparando:  '👨‍🍳 Preparant',
  enviado:     '🛵 En camí',
  entregado:   '✅ Entregat',
  cancelado:   '❌ Cancel·lat',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(raw) {
  if (!raw) return '—'
  return new Date(raw).toLocaleDateString('ca-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatOrderItems(order) {
  try {
    const productos = typeof order.productos === 'string'
      ? JSON.parse(order.productos)
      : order.productos
    return Array.isArray(productos)
      ? `${productos.length} producte${productos.length !== 1 ? 's' : ''}`
      : '—'
  } catch {
    return '—'
  }
}
</script>