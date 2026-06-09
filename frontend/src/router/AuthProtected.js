export default function ProtectedRoute(to, from, next) {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')

  if (!token || !userId) {
    alert('You need to Login')
    next('/login')
    return
  }

  next()
}