<!-- 首页 -->
<template>
<div>
  <el-menu
  :default-active="$route.path"
  class="container"
  mode="horizontal"
  active-text-color="#3170A7"
  router
  >
  <el-menu-item class="menu-list-item" index="/">首页</el-menu-item>
  <el-button class="login-part" type="text" @click="openLoginBox" v-if="!userInfo.username">登陆</el-button>
  <el-button class="login-part" type="text" v-else>{{ userInfo.username }}</el-button>

  <!-- 登陆框 -->
  <el-dialog
    title="登陆/注册"
    :visible.sync="dialogVisible"
    width="30%"
    center>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm', 'login')">登陆</el-button>
        <el-button type="primary" @click="submitForm('ruleForm', 'register')">注册</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </el-menu>
</div>
</template>

<script>

import { User, Lodash } from '@/utils'
import { User as UserEngine } from '@/engine'
import md5 from 'js-md5'

export default {
  name: 'Header',
  data () {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      setTimeout(() => {
        if (value.length > 16 || value.length < 5) {
          callback(new Error('用户名必须在5-16位之间'))
        } else {
          callback()
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      if (!(/^[a-zA-Z0-9]{5,16}$/.test(this.ruleForm.pass))) {
        return callback(new Error('密码必须为5-16位的数字字母组合'))
      }
      callback()
    }
    return {
      searchKey: '',
      userInfo: {},
      dialogVisible: false,
      ruleForm: {
        pass: '',
        username: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.userInfo = User.getUserInfo()
  },

  components: {},

  computed: {},

  methods: {
    openLoginBox () {
      this.dialogVisible = true
      this.ruleForm = {
        pass: '',
        checkPass: '',
        username: ''
      }
    },

    async submitForm (formName, type) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false
        }

        if (type === 'login') {
          await this.login()
        } else {
          await this.register()
        }
      })
    },

    async login () {
      const result = await UserEngine.userLogin({
        username: this.ruleForm.username,
        password: md5(this.ruleForm.pass)
      })
      if (!Lodash.isNull(result.msg)) {
        alert(result.msg)
        return false
      }
      const accessToken = result.token
      if (!Lodash.isNull(accessToken)) {
        localStorage.setItem('Authorization', accessToken)
      }

      this.dialogVisible = false
      this.userInfo = User.getUserInfo()
    },

    async register () {
      await UserEngine.userRegister({
        username: this.ruleForm.username,
        password: md5(this.ruleForm.pass)
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding-left: 10%;
}

.el-header {
  padding: 0  ;
}
.menu-list-item {
  font-size: 25px;
  font-weight: bolder;
  width: 10%;
  padding: 0;
  margin-right: 20px;
}

.login-part {
  float: right;
  font-size: 20px;
  font-weight: bolder;
  width: 10%;
  padding: 0;
  margin-right: 20px;
  margin-top: 10px;
}
.empty-part {
  width: 200px;
}

</style>
