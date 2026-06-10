<template>
  <div class="dashboard">
    <Navbar />

    <!-- ===== HEADER ===== -->
    <header class="dash-header">
      <div class="dash-header__left">
        <h1 class="dash-header__title">
          <span class="dash-header__jp">管理</span>
          Dashboard
        </h1>
        <span class="dash-header__role-badge" :class="`dash-header__role-badge--${authRole}`">
          {{ roleLabel }}
        </span>
      </div>
      <div class="dash-header__right">
        <span class="dash-header__user">{{ authName }}</span>
      </div>
    </header>

    <!-- ===== STATS (admin + trabajador) ===== -->
    <section v-if="canSeeStats" class="dash-stats">
      <div class="stat-tile" v-for="stat in stats" :key="stat.label">
        <span class="stat-tile__icon">{{ stat.icon }}</span>
        <span class="stat-tile__num">{{ stat.value }}</span>
        <span class="stat-tile__label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- ===== TABS ===== -->
    <nav class="dash-tabs">
      <button
        v-for="tab in visibleTabs"
        :key="tab.key"
        class="dash-tabs__btn"
        :class="{ 'dash-tabs__btn--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
        <span v-if="tab.key === 'pedidos' && pendingCount > 0" class="dash-tabs__badge">
          {{ pendingCount }}
        </span>
      </button>
    </nav>

    <!-- ===== TAB: PEDIDOS ===== -->
    <section v-if="activeTab === 'pedidos'" class="dash-panel">

      <!-- Filtros -->
      <div class="dash-filters">
        <div class="dash-filters__search">
          <span class="dash-filters__icon">🔍</span>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por ID, dirección, cliente..."
            class="dash-filters__input"
          />
        </div>

        <div class="dash-filters__group">
          <button
            v-for="estado in estadoFiltros"
            :key="estado.value"
            class="dash-filters__chip"
            :class="{ 'dash-filters__chip--active': filters.estado === estado.value }"
            @click="filters.estado = estado.value"
          >
            {{ estado.icon }} {{ estado.label }}
          </button>
        </div>
      </div>

      <!-- Tabla pedidos -->
      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPedidos.length === 0">
              <td colspan="8" class="dash-table__empty">
                <span>🍣</span> No hay pedidos con estos filtros
              </td>
            </tr>
            <tr
              v-for="pedido in filteredPedidos"
              :key="pedido.id"
              class="dash-table__row"
              :class="`dash-table__row--${pedido.estado}`"
            >
              <td class="dash-table__id">#{{ pedido.id }}</td>
              <td>
                <div class="dash-table__client">
                  <span class="dash-table__client-name">{{ pedido.user?.name ?? '—' }}</span>
                  <span class="dash-table__client-addr">{{ pedido.direccion }}</span>
                </div>
              </td>
              <td>
                <div class="dash-table__products">
                  <span
                    v-for="(prod, i) in parseProductos(pedido.productos)"
                    :key="i"
                    class="dash-table__product-pill"
                  >
                    {{ prod.qty }}× {{ prod.nombre }}
                  </span>
                </div>
              </td>
              <td class="dash-table__price">{{ pedido.total }}€</td>
              <td>
                <span class="dash-table__payment" :class="`dash-table__payment--${pedido.tipo_pago}`">
                  {{ pagoIcon(pedido.tipo_pago) }} {{ pedido.tipo_pago }}
                </span>
              </td>
              <td>
                <span class="estado-badge" :class="`estado-badge--${pedido.estado}`">
                  {{ estadoIcon(pedido.estado) }} {{ pedido.estado }}
                </span>
              </td>
              <td class="dash-table__time">
                {{ formatTime(pedido.hora_pedido) }}
              </td>
              <td>
                <div class="dash-table__actions">

                  <!-- ADMIN + TRABAJADOR: cambiar cualquier estado -->
                  <template v-if="canEditPedidos">
                    <button
                      class="dash-btn dash-btn--icon"
                      title="Editar pedido"
                      @click="openEdit(pedido)"
                    >✏️</button>
                    <select
                      class="dash-btn dash-btn--select"
                      :value="pedido.estado"
                      @change="cambiarEstado(pedido, $event.target.value)"
                    >
                      <option v-for="e in todosEstados" :key="e.value" :value="e.value">
                        {{ e.icon }} {{ e.label }}
                      </option>
                    </select>
                  </template>

                  <!-- REPARTIDOR: solo puede marcar enviado → entregado -->
                  <template v-else-if="isRepartidor">
                    <button
                      v-if="pedido.estado === 'preparando'"
                      class="dash-btn dash-btn--recibir"
                      @click="cambiarEstado(pedido, 'enviado')"
                    >
                      🛵 Recoger
                    </button>
                    <button
                      v-else-if="pedido.estado === 'enviado'"
                      class="dash-btn dash-btn--entregar"
                      @click="cambiarEstado(pedido, 'entregado')"
                    >
                      ✅ Entregado
                    </button>
                    <span v-else class="dash-table__no-action">—</span>
                  </template>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ===== TAB: USUARIOS (solo admin) ===== -->
    <section v-if="activeTab === 'usuarios'" class="dash-panel">
      <div class="dash-panel__topbar">
        <h2 class="dash-panel__title">Gestión de usuarios</h2>
        <button class="dash-btn dash-btn--primary" @click="openCreateUser">
          + Nuevo usuario
        </button>
      </div>

      <div class="dash-table-wrap">
        <table class="dash-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Pedidos</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usuarios.length === 0">
              <td colspan="7" class="dash-table__empty">
                <span>👤</span> No hay usuarios
              </td>
            </tr>
            <tr
              v-for="u in usuarios"
              :key="u.id"
              class="dash-table__row"
            >
              <td class="dash-table__id">#{{ u.id }}</td>
              <td>{{ u.name }}</td>
              <td class="dash-table__muted">{{ u.email }}</td>
              <td>
                <span class="role-badge" :class="`role-badge--${u.role}`">
                  {{ u.role }}
                </span>
              </td>
              <td class="dash-table__muted">{{ u.pedidos_count ?? 0 }}</td>
              <td class="dash-table__time">{{ formatDate(u.created_at) }}</td>
              <td>
                <div class="dash-table__actions">
                  <button
                    class="dash-btn dash-btn--icon"
                    title="Editar usuario"
                    @click="openEditUser(u)"
                  >✏️</button>
                  <button
                    class="dash-btn dash-btn--icon dash-btn--danger"
                    title="Eliminar usuario"
                    @click="confirmDeleteUser(u)"
                  >🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ===== TAB: MIS PEDIDOS (repartidor) ===== -->
    <section v-if="activeTab === 'mis-pedidos'" class="dash-panel">
      <h2 class="dash-panel__title">Mis entregas activas</h2>

      <div class="delivery-grid">
        <div
          v-for="pedido in misEntregas"
          :key="pedido.id"
          class="delivery-card"
          :class="`delivery-card--${pedido.estado}`"
        >
          <div class="delivery-card__header">
            <span class="delivery-card__id">#{{ pedido.id }}</span>
            <span class="estado-badge" :class="`estado-badge--${pedido.estado}`">
              {{ estadoIcon(pedido.estado) }} {{ pedido.estado }}
            </span>
          </div>

          <div class="delivery-card__body">
            <p class="delivery-card__addr">
              📍 {{ pedido.direccion }}
            </p>
            <p class="delivery-card__client">
              👤 {{ pedido.user?.name ?? '—' }}
            </p>
            <p class="delivery-card__total">
              💶 {{ pedido.total }}€ · {{ pagoIcon(pedido.tipo_pago) }} {{ pedido.tipo_pago }}
            </p>
            <p v-if="pedido.notas" class="delivery-card__notas">
              📝 {{ pedido.notas }}
            </p>
          </div>

          <div class="delivery-card__footer">
            <button
              v-if="pedido.estado === 'preparando'"
              class="dash-btn dash-btn--recibir"
              @click="cambiarEstado(pedido, 'enviado')"
            >
              🛵 Recoger pedido
            </button>
            <button
              v-else-if="pedido.estado === 'enviado'"
              class="dash-btn dash-btn--entregar"
              @click="cambiarEstado(pedido, 'entregado')"
            >
              ✅ Marcar como entregado
            </button>
            <span v-else class="delivery-card__done">
              ✓ Sin acción pendiente
            </span>
          </div>
        </div>

        <div v-if="misEntregas.length === 0" class="delivery-empty">
          <span>🛵</span>
          <p>No tienes entregas activas ahora mismo</p>
        </div>
      </div>
    </section>

    <!-- ===== MODAL: EDITAR PEDIDO ===== -->
    <Teleport to="body">
      <div v-if="modal.editPedido" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal__header">
            <h3 class="modal__title">
              Editar pedido <span class="modal__id">#{{ editingPedido?.id }}</span>
            </h3>
            <button class="modal__close" @click="closeModal">✕</button>
          </div>

          <div class="modal__body" v-if="editingPedido">

            <div class="modal__field">
              <label class="modal__label">Estado</label>
              <select v-model="editForm.estado" class="modal__select">
                <option v-for="e in todosEstados" :key="e.value" :value="e.value">
                  {{ e.icon }} {{ e.label }}
                </option>
              </select>
            </div>

            <div class="modal__field">
              <label class="modal__label">Dirección de entrega</label>
              <input v-model="editForm.direccion" class="modal__input" type="text" />
            </div>

            <div class="modal__field">
              <label class="modal__label">Notas</label>
              <textarea v-model="editForm.notas" class="modal__textarea" rows="3" placeholder="Notas adicionales..." />
            </div>

            <div class="modal__field">
              <label class="modal__label">Tiempo de preparación</label>
              <input v-model="editForm.tiempo_preparacion" class="modal__input" type="datetime-local" />
            </div>

            <div class="modal__field">
              <label class="modal__label">Tipo de pago</label>
              <select v-model="editForm.tipo_pago" class="modal__select">
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="paypal">🅿️ PayPal</option>
                <option value="bizum">📱 Bizum</option>
              </select>
            </div>

            <div class="modal__field">
              <label class="modal__label">Total (€)</label>
              <input v-model="editForm.total" class="modal__input" type="number" step="0.01" min="0" />
            </div>

          </div>

          <div class="modal__footer">
            <button class="dash-btn dash-btn--ghost" @click="closeModal">Cancelar</button>
            <button class="dash-btn dash-btn--primary" @click="saveEditPedido" :disabled="saving">
              <span v-if="saving">Guardando...</span>
              <span v-else>💾 Guardar cambios</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== MODAL: EDITAR USUARIO ===== -->
    <Teleport to="body">
      <div v-if="modal.editUser" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal__header">
            <h3 class="modal__title">
              {{ editingUser?.id ? 'Editar usuario' : 'Nuevo usuario' }}
            </h3>
            <button class="modal__close" @click="closeModal">✕</button>
          </div>

          <div class="modal__body">
            <div class="modal__field">
              <label class="modal__label">Nombre</label>
              <input v-model="userForm.name" class="modal__input" type="text" />
            </div>

            <div class="modal__field">
              <label class="modal__label">Email</label>
              <input v-model="userForm.email" class="modal__input" type="email" />
            </div>

            <div class="modal__field">
              <label class="modal__label">Rol</label>
              <select v-model="userForm.role" class="modal__select">
                <option value="cliente">👤 Cliente</option>
                <option value="trabajador">👨‍🍳 Trabajador</option>
                <option value="repartidor">🛵 Repartidor</option>
                <option value="admin">🔑 Admin</option>
              </select>
            </div>

            <div class="modal__field">
              <label class="modal__label">
                {{ editingUser?.id ? 'Nueva contraseña (dejar vacío = no cambiar)' : 'Contraseña' }}
              </label>
              <input v-model="userForm.password" class="modal__input" type="password" autocomplete="new-password" />
            </div>
          </div>

          <div class="modal__footer">
            <button class="dash-btn dash-btn--ghost" @click="closeModal">Cancelar</button>
            <button class="dash-btn dash-btn--primary" @click="saveUser" :disabled="saving">
              <span v-if="saving">Guardando...</span>
              <span v-else>💾 Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== MODAL: CONFIRMAR DELETE ===== -->
    <Teleport to="body">
      <div v-if="modal.deleteUser" class="modal-overlay" @click.self="closeModal">
        <div class="modal modal--sm">
          <div class="modal__header">
            <h3 class="modal__title">¿Eliminar usuario?</h3>
            <button class="modal__close" @click="closeModal">✕</button>
          </div>
          <div class="modal__body">
            <p class="modal__confirm-text">
              Vas a eliminar a <strong>{{ deletingUser?.name }}</strong>.<br />
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal__footer">
            <button class="dash-btn dash-btn--ghost" @click="closeModal">Cancelar</button>
            <button class="dash-btn dash-btn--danger-solid" @click="deleteUser" :disabled="saving">
              <span v-if="saving">Eliminando...</span>
              <span v-else">🗑️ Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ===== TOAST ===== -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import './admin.css'
import Navbar from '../components/navbar/Navbar.vue'

import {
  roleLabel,
  visibleTabs,
  canSeeStats,
  canEditPedidos,
  isRepartidor,
  estadoFiltros,
  todosEstados,
  estadoIcon,
  pagoIcon,
  parseProductos,
  formatTime,
  formatDate,
  useDashboard
} from './admin.js'

// 🔥 USAR EL COMPOSABLE (ESTO ES LO CLAVE)
const dashboard = useDashboard()

// ─── UI STATE ───────────────────────────────────────────
const activeTab = ref('pedidos')
const saving = ref(false)

const filters = reactive({
  search: '',
  estado: ''
})

// ─── EXPONER TODO LO QUE USA EL TEMPLATE ────────────────
const {
  stats,
  usuarios,
  misEntregas,
  pendingCount,
  filteredPedidos,
  authRole,
  authName,
  modal,
  toast,
  editForm,
  userForm,
  editingPedido,
  editingUser,
  deletingUser,
  cambiarEstado,
  openEdit,
  openEditUser,
  openCreateUser,
  saveUser,
  saveEditPedido,
  deleteUser,
  closeModal
} = dashboard
</script>