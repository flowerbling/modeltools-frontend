<template>
  <el-container class="container">
    <el-header class="top"><Header></Header></el-header>
    <el-container>
      <el-main><router-view></router-view></el-main>
      <!-- <el-aside class='user-info-card'><Info></Info></el-aside> -->
    </el-container>
    <el-footer class="foot"><div></div></el-footer>
    <el-backtop>
      <div style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"><i class="el-icon-caret-top"></i></div>
    </el-backtop>
  </el-container>
</template>

<script>
import Header from '@/pages/Header.vue'
export default {
  data () {
    return {

    }
  },

  components: { Header },

  computed: {},

  methods: {}
}
</script>

<style lang='css' scoped>
 	.el-container {
		margin: auto;
    background: #FAFAFA;
    min-height: 1000px;
	}

  .top {
    padding: 0%;
  }

  .user-info-card{
    width: 240;
    position: fixed;
    right: 1%;
    top: 45%;
  }

  .container-right {
    float: 'right';
  }

  .intro-card {
    margin: auto;
    height: 550px;
  }
  .foot {
    height: 50px;
    background: #FFFFFF;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

</style>
