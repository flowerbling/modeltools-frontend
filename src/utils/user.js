export default class User {
  static getUsername = () => {
    const token = localStorage.getItem('Authorization')

    if (token) {
      // 解码 JWT token
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const { exp, username } = tokenData

      // 检查是否过期
      if (Date.now() < exp * 1000) {
        // 返回 username
        return username
      } else {
        // 返回空字符串
        return ''
      }
    } else {
      // 如果 token 不存在，返回空字符串
      return ''
    }
  }
}
