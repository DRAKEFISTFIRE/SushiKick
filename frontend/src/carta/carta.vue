<template>
  <div
    class="menu-page"
    @keydown="handleKeydown"
    tabindex="-1"
  >
    <Navbar />

    <!-- ══════════════════════════════════════
         HERO STRIP
    ══════════════════════════════════════ -->
    <section class="mn-hero">
      <div class="mn-hero__bg"></div>
      <div class="mn-hero__overlay"></div>
      <div class="mn-hero__content container">
        <span class="section-tag">🍣 LA CARTA — MENÚ COMPLET</span>
        <h1 class="mn-hero__title">El nostre <em>menú</em></h1>
        <p class="mn-hero__sub">Ingredients frescos cada dia. Tècnica japonesa. Ànima de Barcelona.</p>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         STICKY TOOLBAR
    ══════════════════════════════════════ -->
    <div class="mn-toolbar" :class="{ sticky: isToolbarSticky }" ref="toolbarRef">
      <div class="mn-toolbar__inner container">

        <!-- category pills -->
        <nav class="mn-cats" aria-label="Categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="mn-cat-pill"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <span class="mn-cat-pill__icon" aria-hidden="true">{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </nav>

        <!-- search + filters + sort -->
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
              :class="{ active: filterSpicy }"
              @click="filterSpicy = !filterSpicy"
              title="Només picants"
            >🌶 Picant</button>
            <button
              class="mn-filter-btn"
              :class="{ active: filterVegan }"
              @click="filterVegan = !filterVegan"
              title="Només vegà"
            >🌿 Vegà</button>
          </div>

          <select class="mn-sort" v-model="sortBy" aria-label="Ordenar per">
            <option value="default">Ordre per defecte</option>
            <option value="price-asc">Preu: menor a major</option>
            <option value="price-desc">Preu: major a menor</option>
          </select>
        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════════
         MAIN — PRODUCTS + CART SIDEBAR
    ══════════════════════════════════════ -->
    <div class="mn-main container">

      <!-- ── Product grid ── -->
      <main class="mn-grid-col">

        <!-- empty state -->
        <div v-if="!groupedByCategory.length" class="mn-empty">
          <span class="mn-empty__icon">🍽</span>
          <p>Cap plat coincideix amb la teva cerca.</p>
          <button class="btn-ghost" @click="resetFilters">Esborrar filtres</button>
        </div>

        <!-- category sections -->
        <section
          v-for="group in groupedByCategory"
          :key="group.id"
          class="mn-section"
          :id="`cat-${group.id}`"
        >
          <div class="mn-section__hd">
            <span class="mn-section__icon" aria-hidden="true">{{ getCatIcon(group.id) }}</span>
            <h2 class="mn-section__title">{{ getCatLabel(group.id) }}</h2>
            <span class="mn-section__count">{{ group.items.length }} plats</span>
          </div>

          <div class="mn-products">
            <article
              v-for="product in group.items"
              :key="product.id"
              class="mn-card"
              :class="{ 'in-cart': qtyInCart(product.id) > 0 }"
            >
              <!-- image -->
              <div class="mn-card__img" @click="openDetail(product)" role="button" :aria-label="`Veure detalls de ${product.name}`">
                <img :src="product.img" :alt="product.name" loading="lazy" />
                <div class="mn-card__img-overlay"></div>

                <!-- tag badge -->
                <span
                  v-if="product.tag"
                  class="mn-card__tag"
                  :style="`background: ${product.tag === 'Vegà' ? 'rgba(34,197,94,.15)' : 'rgba(6,4,2,.75)'}; color: ${product.tagColor}; border-color: ${product.tagColor}40`"
                >{{ product.tag }}</span>

                <!-- new badge -->
                <span v-if="product.isNew" class="mn-card__new">NOU</span>

                <!-- quick view hint -->
                <div class="mn-card__view-hint">👁 Veure detalls</div>
              </div>

              <!-- body -->
              <div class="mn-card__body">
                <div class="mn-card__top">
                  <h3 class="mn-card__name">{{ product.name }}</h3>
                  <span class="mn-card__price">€{{ product.price.toFixed(2) }}</span>
                </div>

                <p class="mn-card__desc">{{ product.desc }}</p>

                <!-- heat + calories -->
                <div class="mn-card__meta">
                  <div class="mn-card__heat" v-if="product.heat > 0" :title="`Picant: ${product.heat}/5`">
                    <span
                      v-for="n in 5"
                      :key="n"
                      class="mn-heat-dot"
                      :class="{ active: n <= product.heat }"
                    ></span>
                  </div>
                  <span class="mn-card__cal">{{ product.calories }} kcal</span>
                </div>

                <!-- allergens -->
                <div class="mn-card__allergens" v-if="product.allergens.length">
                  <span
                    v-for="a in product.allergens"
                    :key="a"
                    class="mn-allergen"
                    :title="a"
                  >{{ allergenIcons[a] }}</span>
                </div>

                <!-- add to cart controls -->
                <div class="mn-card__footer">
                  <!-- qty stepper when already in cart -->
                  <div v-if="qtyInCart(product.id) > 0" class="mn-stepper">
                    <button class="mn-stepper__btn" @click="updateQty(product.id, -1)" aria-label="Reduir quantitat">−</button>
                    <span class="mn-stepper__qty">{{ qtyInCart(product.id) }}</span>
                    <button class="mn-stepper__btn" @click="updateQty(product.id, +1)" aria-label="Augmentar quantitat">+</button>
                  </div>

                  <!-- add button -->
                  <button
                    v-else
                    class="mn-add-btn"
                    @click="addToCart(product)"
                    :aria-label="`Afegir ${product.name} a la comanda`"
                  >
                    <span>Afegir</span>
                    <span class="mn-add-btn__plus" aria-hidden="true">+</span>
                  </button>
                </div>

              </div>
            </article>
          </div>
        </section>

      </main>

      <!-- ── Cart sidebar (desktop) ── -->
      <aside class="mn-cart-sidebar" :class="{ open: cartOpen || cartItems.length > 0 }">
        <CartPanel
          :items="cartItems"
          :total="cartTotal"
          @update-qty="updateQty"
          @remove="removeFromCart"
          @clear="clearCart"
        />
      </aside>

    </div>

    <!-- ══════════════════════════════════════
         FLOATING CART BUTTON (mobile)
    ══════════════════════════════════════ -->
    <Transition name="cart-fab">
      <button
        v-if="cartCount > 0"
        class="mn-cart-fab"
        :class="{ flash: cartFlash }"
        @click="cartOpen = !cartOpen"
        :aria-label="`Obrir comanda (${cartCount} productes)`"
      >
        <span class="mn-cart-fab__icon">🛒</span>
        <span class="mn-cart-fab__count">{{ cartCount }}</span>
        <span class="mn-cart-fab__total">€{{ cartTotal.toFixed(2) }}</span>
      </button>
    </Transition>

    <!-- ══════════════════════════════════════
         MOBILE CART DRAWER
    ══════════════════════════════════════ -->
    <Transition name="drawer">
      <div v-if="cartOpen" class="mn-drawer-backdrop" @click.self="cartOpen = false">
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

    <!-- ══════════════════════════════════════
         PRODUCT DETAIL MODAL
    ══════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="detailProduct" class="mn-modal-backdrop" @click.self="closeDetail">
        <div class="mn-modal" role="dialog" :aria-label="detailProduct.name">
          <button class="mn-modal__close" @click="closeDetail" aria-label="Tancar">✕</button>

          <div class="mn-modal__img">
            <img :src="detailProduct.img" :alt="detailProduct.name" />
            <span
              v-if="detailProduct.tag"
              class="mn-card__tag"
              :style="`color: ${detailProduct.tagColor}; border-color: ${detailProduct.tagColor}40; background: rgba(6,4,2,.8)`"
            >{{ detailProduct.tag }}</span>
          </div>

          <div class="mn-modal__body">
            <h2 class="mn-modal__name">{{ detailProduct.name }}</h2>
            <p class="mn-modal__desc">{{ detailProduct.desc }}</p>

            <div class="mn-modal__row">
              <div class="mn-modal__info-item">
                <span class="mn-modal__info-label">Calories</span>
                <span class="mn-modal__info-val">{{ detailProduct.calories }} kcal</span>
              </div>
              <div class="mn-modal__info-item" v-if="detailProduct.heat > 0">
                <span class="mn-modal__info-label">Picant</span>
                <div class="mn-card__heat">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="mn-heat-dot"
                    :class="{ active: n <= detailProduct.heat }"
                  ></span>
                </div>
              </div>
            </div>

            <div class="mn-modal__allergens" v-if="detailProduct.allergens.length">
              <p class="mn-modal__info-label">Al·lèrgens</p>
              <div class="mn-modal__allergen-list">
                <span
                  v-for="a in detailProduct.allergens"
                  :key="a"
                  class="mn-allergen mn-allergen--lg"
                  :title="a"
                >{{ allergenIcons[a] }} {{ a }}</span>
              </div>
            </div>

            <div class="mn-modal__footer">
              <span class="mn-modal__price">€{{ detailProduct.price.toFixed(2) }}</span>

              <div v-if="qtyInCart(detailProduct.id) > 0" class="mn-stepper mn-stepper--lg">
                <button class="mn-stepper__btn" @click="updateQty(detailProduct.id, -1)">−</button>
                <span class="mn-stepper__qty">{{ qtyInCart(detailProduct.id) }}</span>
                <button class="mn-stepper__btn" @click="updateQty(detailProduct.id, +1)">+</button>
              </div>

              <button v-else class="mn-add-btn mn-add-btn--lg" @click="addToCart(detailProduct); closeDetail()">
                <span>Afegir a la comanda</span>
                <span class="mn-add-btn__plus" aria-hidden="true">+</span>
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
import {
  categories,
  allergenIcons,
  useMenu,
} from './carta.js'

const {
  activeCategory,
  searchQuery,
  filterSpicy,
  filterVegan,
  sortBy,
  filtered,
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
} = useMenu()

// ── Helpers ──────────────────────────────────────────────────────────────────

function getCatIcon(id) {
  return categories.find(c => c.id === id)?.icon ?? '🍽'
}
function getCatLabel(id) {
  return categories.find(c => c.id === id)?.label ?? id
}
function resetFilters() {
  activeCategory.value = 'all'
  searchQuery.value    = ''
  filterSpicy.value    = false
  filterVegan.value    = false
  sortBy.value         = 'default'
}

// ── Sticky toolbar ────────────────────────────────────────────────────────────

const toolbarRef      = ref(null)
const isToolbarSticky = ref(false)

function onScroll() {
  if (!toolbarRef.value) return
  isToolbarSticky.value = toolbarRef.value.getBoundingClientRect().top <= 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>