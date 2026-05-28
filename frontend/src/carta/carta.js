import { ref, computed, onMounted, onUnmounted } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api'

// ─── Static data ──────────────────────────────────────────────────────────────

export const allergenIcons = {
  gluten:    '🌾',
  peix:      '🐟',
  soja:      '🫘',
  lactis:    '🥛',
  ou:        '🥚',
  crustacis: '🦐',
  sèsam:    '🌱',
}

// Category icon map — used to enrich API data
const CATEGORY_ICONS = {
  nigiri:    '🍣',
  temaki:    '🌯',
  ramen:     '🍜',
  gyoza:     '🥟',
  bento:     '🍱',
  signature: '⭐',
  drinks:    '🍵',
  begudes:   '🍵',
  default:   '🍽',
}

function getCategoryIcon(name = '') {
  const key = name.trim().toLowerCase()
  return CATEGORY_ICONS[key] ?? CATEGORY_ICONS.default
}

// ─── Composable ───────────────────────────────────────────────────────────────
// All state is created inside — fresh per component instance, no module-level refs.

export function useMenu() {

  // ── Remote state ────────────────────────────────────────────────────────────
  const loading  = ref(false)
  const error    = ref(null)
  const products = ref([])
  const categories = ref([{ id: 'all', label: 'Tot', icon: '🍽' }])

  // ── Filter / sort state ─────────────────────────────────────────────────────
  const activeCategory  = ref('all')
  const searchQuery     = ref('')
  const sortBy          = ref('default')
  const filterSpicy     = ref(false)
  const filterVegan     = ref(false)
  const filterFeatured  = ref(false)

  // ── UI state ────────────────────────────────────────────────────────────────
  const detailProduct = ref(null)
  const cartItems     = ref([])
  const cartOpen      = ref(false)
  const cartFlash     = ref(false)

  // ── Fetch ───────────────────────────────────────────────────────────────────

  async function fetchCategories() {
    try {
      const res  = await fetch(`${API_URL}/categorias`)
      const json = await res.json()

      categories.value = [
        { id: 'all', label: 'Tot', icon: '🍽' },
        ...json.data.map(c => ({
          id:    c.nombre.trim().toLowerCase(),
          label: c.nombre,
          icon:  getCategoryIcon(c.nombre),
        })),
      ]
    } catch (e) {
      console.error('fetchCategories:', e)
    }
  }

  async function fetchProducts() {
    loading.value = true
    error.value   = null
    try {
      const res  = await fetch(`${API_URL}/productos`)
      const json = await res.json()

      products.value = json.data.map(p => ({
        id:       p.id,
        name:     p.nombre,
        desc:     p.info   ?? '',
        price:    Number(p.precio),
        img:      p.imagen || null,
        category: p.categoria?.nombre?.trim().toLowerCase() ?? 'general',
        featured: Boolean(p.destacado),
        // Fields the API doesn't provide yet — default values
        heat:      0,
        calories:  0,
        allergens: [],
        isNew:     false,
        isSpicy:   false,
        tag:       p.destacado ? 'Destacat' : null,
        tagColor:  p.destacado ? '#f07b10'  : null,
      }))
    } catch (e) {
      error.value = 'Error carregant la carta. Torna-ho a intentar.'
      console.error('fetchProducts:', e)
    } finally {
      loading.value = false
    }
  }

  // ── Derived: filtered list ───────────────────────────────────────────────────

  const filtered = computed(() => {
    let list = [...products.value]

    if (activeCategory.value !== 'all') {
      list = list.filter(p => p.category === activeCategory.value)
    }

    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q),
      )
    }

    if (filterFeatured.value) list = list.filter(p => p.featured)
    if (filterSpicy.value)    list = list.filter(p => p.isSpicy)
    if (filterVegan.value)    list = list.filter(p => p.tag === 'Vegà')

    if (sortBy.value === 'price-asc')  list.sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)

    return list
  })

  // ── Derived: grouped by category for section headers ────────────────────────

  const groupedByCategory = computed(() => {
    // Single category selected → one group, no need to iterate all cats
    if (activeCategory.value !== 'all') {
      return filtered.value.length
        ? [{ id: activeCategory.value, items: filtered.value }]
        : []
    }

    return categories.value
      .filter(c => c.id !== 'all')
      .reduce((acc, cat) => {
        const items = filtered.value.filter(p => p.category === cat.id)
        if (items.length) acc.push({ ...cat, items })
        return acc
      }, [])
  })

  // ── Cart ────────────────────────────────────────────────────────────────────

  function addToCart(product) {
    const existing = cartItems.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      cartItems.value.push({ product, qty: 1 })
    }
    // visual flash feedback
    cartFlash.value = true
    setTimeout(() => { cartFlash.value = false }, 500)
  }

  function removeFromCart(id) {
    cartItems.value = cartItems.value.filter(i => i.product.id !== id)
  }

  function updateQty(id, delta) {
    const item = cartItems.value.find(i => i.product.id === id)
    if (!item) return
    item.qty += delta
    if (item.qty <= 0) removeFromCart(id)
  }

  function clearCart() {
    cartItems.value = []
  }

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.qty, 0),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.qty * i.product.price, 0),
  )

  function qtyInCart(id) {
    return cartItems.value.find(i => i.product.id === id)?.qty ?? 0
  }

  // ── Modal ───────────────────────────────────────────────────────────────────

  function openDetail(product)  { detailProduct.value = product }
  function closeDetail()        { detailProduct.value = null    }

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  // Registered in the component (onMounted/onUnmounted) so it's tied to the
  // component lifecycle — not a loose global listener.

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeDetail()
      cartOpen.value = false
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  onMounted(async () => {
    await fetchCategories()
    await fetchProducts()
  })

  // ── Public API ───────────────────────────────────────────────────────────────

  return {
    // remote
    loading,
    error,
    products,
    categories,

    // filters
    activeCategory,
    searchQuery,
    sortBy,
    filterSpicy,
    filterVegan,
    filterFeatured,

    // derived
    filtered,
    groupedByCategory,

    // cart
    cartItems,
    cartOpen,
    cartFlash,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    qtyInCart,

    // modal
    detailProduct,
    openDetail,
    closeDetail,

    // keyboard
    handleKeydown,
  }
}