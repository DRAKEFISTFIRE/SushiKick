export default function AuthRoute(to, from, next) {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')

  if (token && userId) {
    next('/')
    return
  }

  next()
}