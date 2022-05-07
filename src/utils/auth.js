import Cookies from 'js-cookie'   //操作Cookies的包

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('user_token')
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem('user_token', token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem('user_token')
}
