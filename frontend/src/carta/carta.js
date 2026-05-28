import { ref, computed, watch } from 'vue'

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export const categories = [
  { id: 'all',       label: 'Tot',       icon: '🍽',  },
  { id: 'signature', label: 'Signature', icon: '⭐',  },
  { id: 'nigiri',    label: 'Nigiri',    icon: '🍣',  },
  { id: 'temaki',    label: 'Temaki',    icon: '🌯',  },
  { id: 'ramen',     label: 'Ramen',     icon: '🍜',  },
  { id: 'gyoza',     label: 'Gyoza',     icon: '🥟',  },
  { id: 'bento',     label: 'Bento',     icon: '🍱',  },
  { id: 'drinks',    label: 'Begudes',   icon: '🍵',  },
]

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export const products = [
  // SIGNATURE
  {
    id: 1,
    category: 'signature',
    name: 'Dragon Fire',
    desc: 'Tonyina picant, mango, jalapeño, salmó flambejat i aioli sriracha.',
    price: 16.90,
    heat: 5,
    tag: 'Best Seller',
    tagColor: '#c8201a',
    img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    allergens: ['gluten', 'peix', 'soja'],
    calories: 420,
    isNew: false,
    isSpicy: true,
  },
  {
    id: 2,
    category: 'signature',
    name: 'Black Ninja',
    desc: 'Arròs de tinta de calamar, anguila fumada, crema de formatge, cogombre i tobiko.',
    price: 15.50,
    heat: 3,
    tag: "Chef's Pick",
    tagColor: '#9b59b6',
    img: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    allergens: ['gluten', 'peix', 'lactis', 'ou'],
    calories: 380,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 3,
    category: 'signature',
    name: 'Golden Kick',
    desc: 'Tempura de gamba, alvocat, maionesa de yuzu, sèsam daurat i escalunya cruixent.',
    price: 17.90,
    heat: 2,
    tag: 'Nou',
    tagColor: '#f5c842',
    img: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    allergens: ['gluten', 'crustacis', 'ou'],
    calories: 450,
    isNew: true,
    isSpicy: false,
  },
  {
    id: 4,
    category: 'signature',
    name: 'Tsunami Wave',
    desc: 'Tonyina blava, arròs cruixent, guacamole de wasabi, ponzu i herbes fresques.',
    price: 19.50,
    heat: 4,
    tag: 'Picant',
    tagColor: '#f07b10',
    img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    allergens: ['peix', 'soja', 'sèsam'],
    calories: 390,
    isNew: false,
    isSpicy: true,
  },

  // NIGIRI
  {
    id: 5,
    category: 'nigiri',
    name: 'Salmó Premium',
    desc: 'Salmó noruec salvatge sobre nigiri d\'arròs de vinagre. Peça x2.',
    price: 7.50,
    heat: 0,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1617196034099-fc8cbff2f7c4?w=600&q=80',
    allergens: ['peix', 'soja'],
    calories: 120,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 6,
    category: 'nigiri',
    name: 'Tonyina Bluefin',
    desc: 'Tonyina bluefin de primera qualitat. Temporada limitada. Peça x2.',
    price: 12.00,
    heat: 0,
    tag: 'Temporada',
    tagColor: '#0ea5e9',
    img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    allergens: ['peix', 'soja'],
    calories: 110,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 7,
    category: 'nigiri',
    name: 'Gamba Tigre',
    desc: 'Gamba tigre cuita sobre arròs japonès. Peça x2.',
    price: 8.90,
    heat: 0,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    allergens: ['crustacis', 'soja'],
    calories: 100,
    isNew: false,
    isSpicy: false,
  },

  // TEMAKI
  {
    id: 8,
    category: 'temaki',
    name: 'Spicy Tuna Temaki',
    desc: 'Con de nori, tonyina picant, alvocat, ceba tendra i salsa sriracha.',
    price: 9.50,
    heat: 4,
    tag: 'Picant',
    tagColor: '#c8201a',
    img: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    allergens: ['gluten', 'peix', 'soja'],
    calories: 280,
    isNew: false,
    isSpicy: true,
  },
  {
    id: 9,
    category: 'temaki',
    name: 'Ebi Tempura Temaki',
    desc: 'Gamba en tempura, enciam, maionesa japonesa i tobiko.',
    price: 10.50,
    heat: 1,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    allergens: ['gluten', 'crustacis', 'ou'],
    calories: 320,
    isNew: false,
    isSpicy: false,
  },

  // RAMEN
  {
    id: 10,
    category: 'ramen',
    name: 'Tonkotsu Clàssic',
    desc: 'Brou de porc 18h, chashu, ou marinat, bambú, nori i ceba tendra.',
    price: 14.50,
    heat: 1,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    allergens: ['gluten', 'ou', 'soja'],
    calories: 680,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 11,
    category: 'ramen',
    name: 'Spicy Miso Ramen',
    desc: 'Brou de miso picant, tofu, edamame, bolets shiitake i pasta de xili.',
    price: 13.90,
    heat: 4,
    tag: 'Vegà',
    tagColor: '#22c55e',
    img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    allergens: ['gluten', 'soja', 'sèsam'],
    calories: 520,
    isNew: true,
    isSpicy: true,
  },

  // GYOZA
  {
    id: 12,
    category: 'gyoza',
    name: 'Gyoza de Porc',
    desc: 'Gyoza frites al vapor, farcides de porc i col xinesa. 6 unitats.',
    price: 8.50,
    heat: 1,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
    allergens: ['gluten', 'soja'],
    calories: 310,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 13,
    category: 'gyoza',
    name: 'Gyoza Vegetariana',
    desc: 'Farcides de tofu, bolets i verdures de temporada. 6 unitats.',
    price: 7.90,
    heat: 0,
    tag: 'Vegà',
    tagColor: '#22c55e',
    img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
    allergens: ['gluten', 'soja', 'sèsam'],
    calories: 240,
    isNew: false,
    isSpicy: false,
  },

  // BENTO
  {
    id: 14,
    category: 'bento',
    name: 'Bento Deluxe',
    desc: 'Nigiri x4, temaki x1, gyoza x3, amanida d\'alga i miso soup.',
    price: 24.90,
    heat: 1,
    tag: 'Recomanat',
    tagColor: '#f07b10',
    img: 'https://images.unsplash.com/photo-1617196034099-fc8cbff2f7c4?w=600&q=80',
    allergens: ['gluten', 'peix', 'soja', 'ou'],
    calories: 780,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 15,
    category: 'bento',
    name: 'Bento Vegà',
    desc: 'Nigiri de verdures x4, gyoza vegana x3, edamame i sopa de miso.',
    price: 19.90,
    heat: 0,
    tag: 'Vegà',
    tagColor: '#22c55e',
    img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    allergens: ['gluten', 'soja', 'sèsam'],
    calories: 560,
    isNew: true,
    isSpicy: false,
  },

  // DRINKS
  {
    id: 16,
    category: 'drinks',
    name: 'Sake Premium',
    desc: 'Sake japonès Junmai Daiginjo, servit fred. 180ml.',
    price: 9.00,
    heat: 0,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    allergens: ['gluten'],
    calories: 185,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 17,
    category: 'drinks',
    name: 'Matcha Latte',
    desc: 'Matcha de cerimònia, llet d\'avena, xarop de vainilla. Fred o calent.',
    price: 5.50,
    heat: 0,
    tag: null,
    tagColor: null,
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    allergens: [],
    calories: 140,
    isNew: false,
    isSpicy: false,
  },
  {
    id: 18,
    category: 'drinks',
    name: 'Yuzu Lemonade',
    desc: 'Yuzu fresc, llimona, gingebre i soda. Zero alcohol.',
    price: 4.50,
    heat: 0,
    tag: 'Nou',
    tagColor: '#f5c842',
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    allergens: [],
    calories: 90,
    isNew: true,
    isSpicy: false,
  },
]

// ─── ALLERGEN ICONS ───────────────────────────────────────────────────────────

export const allergenIcons = {
  gluten:    '🌾',
  peix:      '🐟',
  soja:      '🫘',
  lactis:    '🥛',
  ou:        '🥚',
  crustacis: '🦐',
  sèsam:    '🌱',
}

// ─── COMPOSABLE ───────────────────────────────────────────────────────────────

export function useMenu() {
  const activeCategory = ref('all')
  const searchQuery    = ref('')
  const filterSpicy    = ref(false)
  const filterVegan    = ref(false)
  const sortBy         = ref('default') // 'default' | 'price-asc' | 'price-desc'
  const detailProduct  = ref(null)      // product shown in modal
  const cartOpen       = ref(false)

  // ── Filtered + sorted products ──────────────────────────────────────────────

  const filtered = computed(() => {
    let list = [...products]

    // Category
    if (activeCategory.value !== 'all') {
      list = list.filter(p => p.category === activeCategory.value)
    }

    // Search
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q),
      )
    }

    // Filters
    if (filterSpicy.value) list = list.filter(p => p.isSpicy)
    if (filterVegan.value) list = list.filter(p => p.tag === 'Vegà')

    // Sort
    if (sortBy.value === 'price-asc')  list.sort((a, b) => a.price - b.price)
    if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)

    return list
  })

  // Group filtered products by category for section headers
  const groupedByCategory = computed(() => {
    if (activeCategory.value !== 'all') {
      return [{ id: activeCategory.value, items: filtered.value }]
    }
    const groups = []
    for (const cat of categories.filter(c => c.id !== 'all')) {
      const items = filtered.value.filter(p => p.category === cat.id)
      if (items.length) groups.push({ ...cat, items })
    }
    return groups
  })

  // ── Cart ────────────────────────────────────────────────────────────────────

  const cartItems = ref([])   // [{ product, qty }]

  function addToCart(product) {
    const existing = cartItems.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      cartItems.value.push({ product, qty: 1 })
    }
    // flash the cart icon
    cartFlash.value = true
    setTimeout(() => { cartFlash.value = false }, 600)
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(i => i.product.id !== productId)
  }

  function updateQty(productId, delta) {
    const item = cartItems.value.find(i => i.product.id === productId)
    if (!item) return
    item.qty += delta
    if (item.qty <= 0) removeFromCart(productId)
  }

  function clearCart() {
    cartItems.value = []
  }

  const cartCount = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.qty, 0),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.product.price * i.qty, 0),
  )

  const cartFlash = ref(false)

  // qty in cart for a given product (used for the +/- on the card)
  function qtyInCart(productId) {
    return cartItems.value.find(i => i.product.id === productId)?.qty ?? 0
  }

  // ── Modal ───────────────────────────────────────────────────────────────────

  function openDetail(product) {
    detailProduct.value = product
  }

  function closeDetail() {
    detailProduct.value = null
  }

  // Close modal on Escape
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeDetail()
      cartOpen.value = false
    }
  }

  return {
    // filters
    activeCategory,
    searchQuery,
    filterSpicy,
    filterVegan,
    sortBy,

    // products
    filtered,
    groupedByCategory,

    // cart
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

    // modal
    detailProduct,
    openDetail,
    closeDetail,
    handleKeydown,
  }
}