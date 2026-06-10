export default function AdminProtected(to, from, next) {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')
  const role = localStorage.getItem('role')

  if (!token || !userId) {
    next('/login')
    return
  }

  if (
    role !== 'admin' &&
    role !== 'repartidor' &&
    role !== 'trabajador'
  ) {
    alert('You do not have permission to access this page')
    next('/')
    return
  }

  next()
}