<template>
  <div class="menu-page" tabindex="-1">
    <Navbar />

    <!-- ══════════════════════════════
         HERO
    ══════════════════════════════ -->
    <section class="mn-hero">
      <div class="mn-hero__bg"></div>
      <div class="mn-hero__overlay"></div>
      <div class="mn-hero__content container">
        <span class="section-tag">🍣 LA CARTA — MENÚ COMPLET</span>
        <h1 class="mn-hero__title">El nostre <em>menú</em></h1>
        <p class="mn-hero__sub">
          Ingredients frescos cada dia. Tècnica japonesa. Ànima de Barcelona.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════
         STICKY TOOLBAR
    ══════════════════════════════ -->
    <div class="mn-toolbar" :class="{ 'mn-toolbar--stuck': stuck }" ref="toolbarRef">
      <div class="mn-toolbar__inner container">

        <!-- CATEGORIES — scroll horizontal en mobile, wrap en desktop -->
        <nav class="mn-cats" aria-label="Filtrar per categoria">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="mn-cat-pill"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
            :aria-pressed="activeCategory === cat.id"
          >
            <span class="mn-cat-pill__icon" aria-hidden="true">{{ cat.icon }}</span>
            <span class="mn-cat-pill__label">{{ cat.label }}</span>
          </button>
        </nav>

        <!-- CONTROLS: search · filters · sort -->
        <div class="mn-controls">

          <div class="mn-search">
            <span class="mn-search__icon" aria-hidden="true">🔍</span>
            <input
              class="mn-search__input"
              type="search"
              placeholder="Cerca un plat..."
              v-model="searchQuery"
              aria-label="Cercar plats"
            />
            <button
              v-if="searchQuery"
              class="mn-search__clear"
              @click="searchQuery = ''"
              aria-label="Esborrar cerca"
            >✕</button>
          </div>

          <div class="mn-filters">
            <button
              class="mn-filter-btn"
              :class="{ active: filterFeatured }"
              @click="filterFeatured = !filterFeatured"
            >⭐ Destacats</button>
            <button
              class="mn-filter-btn"
              :class="{ active: filterSpicy }"
              @click="filterSpicy = !filterSpicy"
            >🌶 Picant</button>
            <button
              class="mn-filter-btn"
              :class="{ active: filterVegan }"
              @click="filterVegan = !filterVegan"
            >🌿 Vegà</button>
          </div>

          <select class="mn-sort" v-model="sortBy" aria-label="Ordenar per">
            <option value="default">Ordre per defecte</option>
            <option value="price-asc">Preu ↑</option>
            <option value="price-desc">Preu ↓</option>
          </select>

        </div>
      </div>
    </div>

    <!-- ══════════════════════════════
         CONTENT
    ══════════════════════════════ -->
    <div class="mn-main container">

      <!-- Product grid -->
      <main class="mn-grid-col">

        <!-- Loading -->
        <div v-if="loading" class="mn-state">
          <div class="mn-spinner"></div>
          <p>Carregant la carta…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mn-state mn-state--error">
          <span class="mn-state__icon">⚠️</span>
          <p>{{ error }}</p>
          <button class="btn-ghost" @click="retryFetch">Tornar a intentar</button>
        </div>

        <!-- Empty results -->
        <div v-else-if="!groupedByCategory.length" class="mn-state">
          <span class="mn-state__icon">🍽</span>
          <p>Cap plat coincideix amb la cerca.</p>
          <button class="btn-ghost" @click="resetFilters">Esborrar filtres</button>
        </div>

            

        <!-- Grouped sections -->
        <template v-else>
          <section
            v-for="group in groupedByCategory"
            :key="group.id"
            class="mn-section"
            :id="`cat-${group.id}`"
          >
            <!-- section header -->
            <div class="mn-section__hd">
              <span class="mn-section__icon" aria-hidden="true">{{ group.icon }}</span>
              <h2 class="mn-section__title">{{ group.label }}</h2>
              <span class="mn-section__count">{{ group.items.length }}</span>
            </div>

       

            <!-- product cards -->
            <div class="mn-products">
              <article
                v-for="product in group.items"
                :key="product.id"
                class="mn-card"
                :class="{ 'mn-card--incart': qtyInCart(product.id) > 0 }"
              >

                <!-- image -->
                <button
                  class="mn-card__img-btn"
                  @click="openDetail(product)"
                  :aria-label="`Veure detalls: ${product.name}`"
                  tabindex="0"
                >
                  <img
                    v-if="product.img"
                    :src="product.img"
                    :alt="product.name"
                    loading="lazy"
                    class="mn-card__img"
                  />
                  <div v-else class="mn-card__img mn-card__img--placeholder">
                    <span>🍣</span>
                  </div>
                  <div class="mn-card__img-overlay" aria-hidden="true"></div>

                  <span
                    v-if="product.tag"
                    class="mn-card__tag"
                    :style="`color:${product.tagColor}; border-color:${product.tagColor}50`"
                  >{{ product.tag }}</span>

                  <span v-if="product.isNew" class="mn-card__badge-new">NOU</span>

                  <div class="mn-card__view-hint" aria-hidden="true">👁 Detalls</div>
                </button>

                <!-- body -->
                <div class="mn-card__body">
                  <div class="mn-card__top">
                    <h3 class="mn-card__name">{{ product.name }}</h3>
                    <span class="mn-card__price">€{{ product.price.toFixed(2) }}</span>
                  </div>

                  <p v-if="product.desc" class="mn-card__desc">{{ product.desc }}</p>

                  <!-- heat + calories -->
                  <div class="mn-card__meta">
                    <div v-if="product.heat > 0" class="mn-heat" :title="`Picant ${product.heat}/5`">
                      <span
                        v-for="n in 5"
                        :key="n"
                        class="mn-heat__dot"
                        :class="{ active: n <= product.heat }"
                      ></span>
                    </div>
                    <span v-if="product.calories" class="mn-card__cal">
                      {{ product.calories }} kcal
                    </span>
                  </div>

                  <!-- allergens -->
                  <div v-if="product.allergens.length" class="mn-card__allergens">
                    <span
                      v-for="a in product.allergens"
                      :key="a"
                      class="mn-allergen"
                      :title="a"
                    >{{ allergenIcons[a] }}</span>
                  </div>

                  <!-- cart controls -->
                  <div class="mn-card__footer">
                    <div v-if="qtyInCart(product.id) > 0" class="mn-stepper">
                      <button class="mn-stepper__btn" @click="updateQty(product.id, -1)" aria-label="Reduir">−</button>
                      <span class="mn-stepper__qty">{{ qtyInCart(product.id) }}</span>
                      <button class="mn-stepper__btn" @click="updateQty(product.id, +1)" aria-label="Augmentar">+</button>
                    </div>
                    <button
                      v-else
                      class="mn-add-btn"
                      @click="addToCart(product)"
                      :aria-label="`Afegir ${product.name}`"
                    >
                      Afegir <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>

              </article>
            </div>
          </section>
        </template>

        

      </main>

      <!-- Cart sidebar (desktop ≥1100px) -->
      <aside
        class="mn-cart-sidebar"
        :class="{ 'mn-cart-sidebar--visible': cartItems.length > 0 }"
        aria-label="Comanda actual"
      >
        <div class="mn-cart-sidebar__hd">
          <h2 class="mn-cart-sidebar__title">La teva comanda</h2>
          <span class="mn-cart-sidebar__count" v-if="cartCount">{{ cartCount }}</span>
        </div>
        <CartPanel
          :items="cartItems"
          :total="cartTotal"
          @update-qty="updateQty"
          @remove="removeFromCart"
          @clear="clearCart"
        />
      </aside>

    </div>

    <!-- ══════════════════════════════
         MOBILE FAB
    ══════════════════════════════ -->
    <Transition name="fab">
      <button
        v-if="cartCount > 0"
        class="mn-fab"
        :class="{ 'mn-fab--flash': cartFlash }"
        @click="cartOpen = true"
        :aria-label="`Comanda: ${cartCount} productes, €${cartTotal.toFixed(2)}`"
      >
        <span class="mn-fab__icon" aria-hidden="true">🛒</span>
        <span class="mn-fab__count">{{ cartCount }}</span>
        <span class="mn-fab__total">€{{ cartTotal.toFixed(2) }}</span>
      </button>
    </Transition>

  <transition name="fade">
  <div v-if="authModalOpen" class="auth-overlay">
    <div class="auth-modal">

      <div class="auth-icon">🔒</div>

      <h2 class="auth-title">
        Authentication Required
      </h2>

      <p class="auth-text">
        {{ authMessage }}
      </p>

      <div class="auth-actions">
        <button
          class="auth-btn auth-btn--primary"
          @click="$router.push('/login')"
        >
          Log In
        </button>

        <button
          class="auth-btn auth-btn--secondary"
          @click="authModalOpen = false"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</transition>

    <!-- ══════════════════════════════
         MOBILE DRAWER
    ══════════════════════════════ -->
    <Transition name="drawer">
      <div
        v-if="cartOpen"
        class="mn-drawer-backdrop"
        @click.self="cartOpen = false"
        role="dialog"
        aria-label="Comanda"
        aria-modal="true"
      >
        <div class="mn-drawer">
          <div class="mn-drawer__hd">
            <h2 class="mn-drawer__title">La teva comanda</h2>
            <button class="mn-drawer__close" @click="cartOpen = false" aria-label="Tancar">✕</button>
          </div>
          <CartPanel
            :items="cartItems"
            :total="cartTotal"
            @update-qty="updateQty"
            @remove="removeFromCart"
            @clear="clearCart"
          />
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════
         PRODUCT MODAL
    ══════════════════════════════ -->
    <Transition name="modal">
      <div
        v-if="detailProduct"
        class="mn-modal-backdrop"
        @click.self="closeDetail"
        role="dialog"
        :aria-label="detailProduct.name"
        aria-modal="true"
      >
        <div class="mn-modal">
          <button class="mn-modal__close" @click="closeDetail" aria-label="Tancar">✕</button>

          <!-- image -->
          <div class="mn-modal__img">
            <img
              v-if="detailProduct.img"
              :src="detailProduct.img"
              :alt="detailProduct.name"
            />
            <div v-else class="mn-modal__img-placeholder"><span>🍣</span></div>
            <span
              v-if="detailProduct.tag"
              class="mn-card__tag"
              :style="`color:${detailProduct.tagColor}; border-color:${detailProduct.tagColor}50; background:rgba(6,4,2,.8)`"
            >{{ detailProduct.tag }}</span>
          </div>

          <!-- body -->
          <div class="mn-modal__body">
            <h2 class="mn-modal__name">{{ detailProduct.name }}</h2>
            <p v-if="detailProduct.desc" class="mn-modal__desc">{{ detailProduct.desc }}</p>

            <!-- meta -->
            <div class="mn-modal__meta">
              <div v-if="detailProduct.calories" class="mn-modal__meta-item">
                <span class="mn-modal__meta-label">Calories</span>
                <span class="mn-modal__meta-val">{{ detailProduct.calories }} kcal</span>
              </div>
              <div v-if="detailProduct.heat > 0" class="mn-modal__meta-item">
                <span class="mn-modal__meta-label">Picant</span>
                <div class="mn-heat">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="mn-heat__dot"
                    :class="{ active: n <= detailProduct.heat }"
                  ></span>
                </div>
              </div>
            </div>

            <!-- allergens -->
            <div v-if="detailProduct.allergens.length" class="mn-modal__allergens">
              <p class="mn-modal__meta-label">Al·lèrgens</p>
              <div class="mn-modal__allergen-list">
                <span
                  v-for="a in detailProduct.allergens"
                  :key="a"
                  class="mn-allergen mn-allergen--lg"
                >{{ allergenIcons[a] }} {{ a }}</span>
              </div>
            </div>

            <!-- footer -->
            <div class="mn-modal__footer">
              <span class="mn-modal__price">€{{ detailProduct.price.toFixed(2) }}</span>

              <div v-if="qtyInCart(detailProduct.id) > 0" class="mn-stepper mn-stepper--lg">
                <button class="mn-stepper__btn" @click="updateQty(detailProduct.id, -1)">−</button>
                <span class="mn-stepper__qty">{{ qtyInCart(detailProduct.id) }}</span>
                <button class="mn-stepper__btn" @click="updateQty(detailProduct.id, +1)">+</button>
              </div>

              <button
                v-else
                class="mn-add-btn mn-add-btn--lg"
                @click="addToCart(detailProduct); closeDetail()"
              >
                Afegir a la comanda <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '../components/navbar/Navbar.vue'
import CartPanel from './Panel.vue'
import './carta.css'
import { allergenIcons, useMenu } from './carta.js'

const {
  loading,
  error,
  categories,
  activeCategory,
  searchQuery,
  sortBy,
  filterSpicy,
  filterVegan,
  filterFeatured,
  groupedByCategory,
  cartItems,
  cartOpen,
  cartCount,
  cartTotal,
  cartFlash,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  qtyInCart,
  detailProduct,
  openDetail,
  closeDetail,
  handleKeydown,
  authModalOpen,
  authMessage
} = useMenu()



// ── Filter helpers ────────────────────────────────────────────────────────────

function resetFilters() {
  activeCategory.value = 'all'
  searchQuery.value    = ''
  filterSpicy.value    = false
  filterVegan.value    = false
  filterFeatured.value = false
  sortBy.value         = 'default'
}

// Exposed for the error state retry button
function retryFetch() {
  // Re-trigger by clearing error and remounting — or call fetchProducts directly
  // if you export it; for now just reload the page logic by resetting filters
  window.location.reload()
}

// ── Sticky toolbar ────────────────────────────────────────────────────────────

const toolbarRef = ref(null)
const stuck      = ref(false)

let observer = null

onMounted(() => {
  // Use IntersectionObserver instead of scroll listener — zero jank
  observer = new IntersectionObserver(
    ([entry]) => { stuck.value = !entry.isIntersecting },
    { threshold: 0, rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72px'} 0px 0px 0px` },
  )
  if (toolbarRef.value) observer.observe(toolbarRef.value)

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', handleKeydown)
})
</script>