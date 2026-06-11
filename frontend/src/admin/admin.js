import { ref, computed, reactive, onMounted } from 'vue'

// ─── Auth (localStorage) ─────────────────────────────────
export const authRole = localStorage.getItem('role') ?? ''
export const authName = localStorage.getItem('name') ?? ''

// ─── Permisos ─────────────────────────────────────────────
export const isAdmin      = authRole === 'admin'
export const isRepartidor = authRole === 'repartidor'
export const isTrabajador = authRole === 'trabajador'

export const canSeeStats    = isAdmin || isTrabajador
export const canEditPedidos = isAdmin || isTrabajador
export const canSeeUsuarios = isAdmin

// ─── Tabs visibles según rol ──────────────────────────────
const allTabs = [
  { key: 'pedidos',     label: 'Pedidos',      icon: '🍣', roles: ['admin', 'trabajador', 'repartidor'] },
  { key: 'mis-pedidos', label: 'Mis entregas', icon: '🛵', roles: ['repartidor'] },
  { key: 'usuarios',    label: 'Usuarios',     icon: '👥', roles: ['admin'] },
]

export const visibleTabs = allTabs.filter(t => t.roles.includes(authRole))

// ─── Label del rol ────────────────────────────────────────
export const roleLabel = {
  admin:      '🔑 Admin',
  trabajador: '👨‍🍳 Trabajador',
  repartidor: '🛵 Repartidor',
  cliente:    '👤 Cliente',
}[authRole] ?? authRole

// ─── Constantes de estados ────────────────────────────────
export const todosEstados = [
  { value: 'pendiente',  label: 'Pendiente',  icon: '🕐' },
  { value: 'preparando', label: 'Preparando', icon: '👨‍🍳' },
  { value: 'enviado',    label: 'Enviado',    icon: '🛵' },
  { value: 'entregado',  label: 'Entregado',  icon: '✅' },
  { value: 'cancelado',  label: 'Cancelado',  icon: '❌' },
]

export const estadoFiltros = [
  { value: 'todos', label: 'Todos', icon: '📋' },
  ...todosEstados,
]

// ─── Helpers puros ────────────────────────────────────────
export function estadoIcon(estado) {
  const map = { pendiente: '🕐', preparando: '👨‍🍳', enviado: '🛵', entregado: '✅', cancelado: '❌' }
  return map[estado] ?? '❓'
}

export function pagoIcon(tipo) {
  const map = { efectivo: '💵', tarjeta: '💳', paypal: '🅿️', bizum: '📱' }
  return map[tipo] ?? '💰'
}

export function parseProductos(raw) {
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (Array.isArray(data)) {
      return data.map(item =>
        typeof item === 'object'
          ? { nombre: item.nombre ?? item.name ?? JSON.stringify(item), qty: item.qty ?? item.cantidad ?? 1 }
          : { nombre: String(item), qty: 1 }
      )
    }
    return []
  } catch {
    return []
  }
}

export function formatTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

// ─── Composable principal ─────────────────────────────────
export function useDashboard() {

  // Estado UI
  const activeTab = ref('pedidos')
  const saving    = ref(false)

  const modal = reactive({
    editPedido: false,
    editUser:   false,
    deleteUser: false,
  })

  const toast = reactive({ show: false, message: '', type: 'success' })

  // Datos
  const pedidos  = ref([])
  const usuarios = ref([])

  // Formulario pedido
  const editingPedido = ref(null)
  const editForm = reactive({
    estado:             '',
    direccion:          '',
    notas:              '',
    tiempo_preparacion: '',
    tipo_pago:          '',
    total:              0,
  })

  // Formulario usuario
  const editingUser  = ref(null)
  const deletingUser = ref(null)
  const userForm = reactive({
    nombre: '',
    email: '',
    password: '',

    telefono: '',
    imagen_perfil: '',
    imagen_banner: '',
    biografia: '',
    direccion: '',
    fecha_nacimiento: '',

    rol: 'usuario',
    sueldo: '',
    fecha_contratacion: '',
    cargo: '',
    activo: true,

    metodos_pago: []
  })

  // Filtros
  const filters = reactive({ search: '', estado: 'todos' })

  // ── Computed ───────────────────────────────────────────

  const filteredPedidos = computed(() => {
    let list = pedidos.value

    if (filters.estado !== 'todos') {
      list = list.filter(p => p.estado === filters.estado)
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      list = list.filter(p =>
        String(p.id).includes(q) ||
        p.direccion?.toLowerCase().includes(q) ||
        p.user?.name?.toLowerCase().includes(q)
      )
    }

    if (isRepartidor) {
      list = list.filter(p => ['preparando', 'enviado'].includes(p.estado))
    }

    return list
  })

  const misEntregas = computed(() =>
    pedidos.value.filter(p => ['preparando', 'enviado'].includes(p.estado))
  )

  const pendingCount = computed(() =>
    pedidos.value.filter(p => p.estado === 'pendiente').length
  )

  const stats = computed(() => [
    { icon: '📦', label: 'Total pedidos', value: pedidos.value.length },
    { icon: '🕐', label: 'Pendientes',    value: pedidos.value.filter(p => p.estado === 'pendiente').length },
    { icon: '👨‍🍳', label: 'Preparando',   value: pedidos.value.filter(p => p.estado === 'preparando').length },
    { icon: '💶', label: 'Ingresos hoy',  value: pedidos.value.reduce((acc, p) => acc + parseFloat(p.total || 0), 0).toFixed(2) + '€' },
  ])

  // ── Toast ──────────────────────────────────────────────

  function showToast(message, type = 'success') {
    toast.message = message
    toast.type    = type
    toast.show    = true
    setTimeout(() => { toast.show = false }, 3000)
  }

  // ── Fetch ──────────────────────────────────────────────

  async function fetchPedidos() {
    try {
      const res  = await fetch('http://127.0.0.1:8000/api/pedidos', { headers: authHeaders() })
      const data = await res.json()
      pedidos.value = data.data ?? data
    } catch {
      showToast('Error al cargar pedidos', 'error')
    }
  }

  async function fetchUsuarios() {
    if (!canSeeUsuarios) return
    try {
      const res  = await fetch('http://127.0.0.1:8000/api/usuarios', { headers: authHeaders() })
      const data = await res.json()
      usuarios.value = data.data ?? data
    } catch {
      showToast('Error al cargar usuarios', 'error')
    }
  }

  // ── Pedidos ────────────────────────────────────────────

  async function cambiarEstado(pedido, nuevoEstado) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/pedidos/${pedido.id}`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
      pedido.estado = nuevoEstado
      showToast(`Pedido #${pedido.id} → ${nuevoEstado}`)
    } catch {
      showToast('Error al actualizar estado', 'error')
    }
  }

  function openEdit(pedido) {
    editingPedido.value         = pedido
    editForm.estado             = pedido.estado
    editForm.direccion          = pedido.direccion
    editForm.notas              = pedido.notas ?? ''
    editForm.tiempo_preparacion = pedido.tiempo_preparacion
      ? pedido.tiempo_preparacion.slice(0, 16)
      : ''
    editForm.tipo_pago          = pedido.tipo_pago
    editForm.total              = pedido.total
    modal.editPedido = true
  }

  async function saveEditPedido() {
    saving.value = true
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/pedidos/${editingPedido.value.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ...editForm }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      const idx = pedidos.value.findIndex(p => p.id === editingPedido.value.id)
      if (idx !== -1) pedidos.value[idx] = { ...pedidos.value[idx], ...updated }
      showToast('Pedido actualizado correctamente')
      closeModal()
    } catch {
      showToast('Error al guardar pedido', 'error')
    } finally {
      saving.value = false
    }
  }

  // ── Usuarios CRUD ──────────────────────────────────────

  function openCreateUser() {
    editingUser.value = null

    Object.assign(userForm, {
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      imagen_perfil: '',
      imagen_banner: '',
      biografia: '',
      direccion: '',
      fecha_nacimiento: '',
      rol: 'usuario',
      sueldo: '',
      fecha_contratacion: '',
      cargo: '',
      activo: true,
      metodos_pago: []
    })

    modal.editUser = true
  }

  async function openEditUser(u) {
    editingUser.value = u
    modal.editUser = true

    // Reset mientras carga
    Object.assign(userForm, {
      nombre: u.nombre ?? '',
      email: u.email ?? '',
      password: '',
      telefono: '',
      imagen_perfil: '',
      imagen_banner: '',
      biografia: '',
      direccion: '',
      fecha_nacimiento: '',
      rol: u.rol ?? 'usuario',
      sueldo: '',
      fecha_contratacion: '',
      cargo: '',
      activo: u.activo ?? true,
      metodos_pago: []
    })

    try {
      const res  = await fetch(`http://127.0.0.1:8000/api/usuarios/${u.id}`, { headers: authHeaders() })
      if (!res.ok) throw new Error()
      const full = await res.json()

      editingUser.value = full

      Object.assign(userForm, {
        nombre: full.nombre ?? '',
        email: full.email ?? '',
        password: '',

        telefono: full.telefono ?? '',
        imagen_perfil: full.imagen_perfil ?? '',
        imagen_banner: full.imagen_banner ?? '',
        biografia: full.biografia ?? '',
        direccion: full.direccion ?? '',
        fecha_nacimiento: full.fecha_nacimiento ? full.fecha_nacimiento.slice(0, 10) : '',

        rol: full.rol ?? 'usuario',
        sueldo: full.sueldo ?? '',
        fecha_contratacion: full.fecha_contratacion ? full.fecha_contratacion.slice(0, 10) : '',
        cargo: full.cargo ?? '',
        activo: !!full.activo,

        metodos_pago: Array.isArray(full.metodos_pago) ? full.metodos_pago : []
      })
    } catch {
      showToast('Error al cargar datos del usuario', 'error')
    }
  }

  function confirmDeleteUser(u) {
    deletingUser.value = u
    modal.deleteUser   = true
  }

  async function saveUser() {
    saving.value = true

    const isNew = !editingUser.value?.id
    const url = isNew
      ? 'http://127.0.0.1:8000/api/usuarios'
      : `http://127.0.0.1:8000/api/usuarios/${editingUser.value.id}`

    const method = isNew ? 'POST' : 'PUT'

    const body = {
      ...userForm,
      sueldo: userForm.sueldo === '' ? null : userForm.sueldo,
      fecha_nacimiento: userForm.fecha_nacimiento || null,
      fecha_contratacion: userForm.fecha_contratacion || null,
      metodos_pago: Array.isArray(userForm.metodos_pago)
        ? userForm.metodos_pago
        : []
    }

    if (!isNew && !body.password) delete body.password

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error()

      const saved = await res.json()

      if (isNew) {
        usuarios.value.unshift(saved)
      } else {
        const idx = usuarios.value.findIndex(u => u.id === editingUser.value.id)
        if (idx !== -1) usuarios.value[idx] = { ...usuarios.value[idx], ...saved }
      }

      showToast(isNew ? 'Usuario creado' : 'Usuario actualizado')
      closeModal()

    } catch {
      showToast('Error al guardar usuario', 'error')
    } finally {
      saving.value = false
    }
  }

  async function deleteUser() {
    saving.value = true
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/usuarios/${deletingUser.value.id}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      usuarios.value = usuarios.value.filter(u => u.id !== deletingUser.value.id)
      showToast('Usuario eliminado')
      closeModal()
    } catch {
      showToast('Error al eliminar usuario', 'error')
    } finally {
      saving.value = false
    }
  }

  // ── Modal ──────────────────────────────────────────────

  function closeModal() {
    modal.editPedido    = false
    modal.editUser      = false
    modal.deleteUser    = false
    editingPedido.value = null
    editingUser.value   = null
    deletingUser.value  = null
  }

  // ── Init ───────────────────────────────────────────────

  onMounted(() => {
    fetchPedidos()
    fetchUsuarios()
  })

  return {
    // estado UI
    activeTab, saving, modal, toast, filters,
    // datos
    pedidos, usuarios,
    // formularios
    editingPedido, editForm,
    editingUser, deletingUser, userForm,
    // computed
    filteredPedidos, misEntregas, pendingCount, stats,
    // acciones pedidos
    cambiarEstado, openEdit, saveEditPedido,
    // acciones usuarios
    openCreateUser, openEditUser, confirmDeleteUser, saveUser, deleteUser,
    // modal
    closeModal,
  }
}