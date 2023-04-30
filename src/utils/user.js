import jwtDecode from 'jwt-decode'

export default class User {
  static getUserInfo = () => {
    const token = localStorage.getItem('Authorization')

    if (token) {
      // 解码 JWT token
      var tokenData = jwtDecode(token)
      const { expire } = tokenData
      if (Date.now() < expire * 1000) {
        return tokenData
      } else {
        return {}
      }
    } else {
      return {}
    }
  }
}
