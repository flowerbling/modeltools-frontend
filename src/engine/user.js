import Vue from 'vue'

export default class User {
  static userLogin = (params) => Vue.axios.post('/users/login/', params).then((response) => {
    return response.data
  }).catch((error) => {
    return error.response.data
  })

  static userRegister = (params) => Vue.axios.post('/users/', params).then((response) => {
    return response.data
  }).catch((error) => {
    return error.response.data
  })

  static fetchUserJobs = (params) => Vue.axios.get('/users/jobs/', { params }).then((response) => {
    return response.data
  }).catch((error) => {
    return error.response.data
  })

  static createJob = (params) => Vue.axios.post('/users/jobs/', params).then((response) => {
    return response.data
  }).catch((error) => {
    return error.response.data
  })
}
