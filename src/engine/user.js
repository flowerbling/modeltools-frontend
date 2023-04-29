import Vue from 'vue'

export default class User {
  static userLogin = (params) => Vue.axios.post('/users/login', params).then((response) => {
    console.log(response)
    return response.data
  }).catch((error) => {
    return error.response.data
  })
}
