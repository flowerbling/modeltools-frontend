<template>
  <el-container class="container">
    <el-header class="top"><Header></Header></el-header>
    <div class="content-container">
      <el-table
        class="table-container"
        :data="jobs"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          prop="created_at"
          label="日期"
          width="200"
        >
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.created_at }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="200">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="200">
          <template slot-scope="scope">
              <el-tag :type="scope.row.tag" size="medium">{{scope.row.text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="结果"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="showResult(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="right">
          <template slot="header">
            <el-button
              type="primary">
              新建任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-container"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
  <el-dialog
    title="结果查看"
    :visible.sync="resultVisible"
    width="30%"
    center>
      <el-image
      style="width: 100px; height: 100px"
      :src="data.url"
      fit="cover"
      :preview-src-list="previewSrcList">
    </el-image>
    <div>文本： {{data.label}}</div>
    <div>得分： {{data.score}}</div>
  </el-dialog>
    </div>
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
import { User as UserEngine } from '@/engine'
import { Moment } from '@/utils'

export default {
  data () {
    return {
      jobs: [],
      total: 0,
      resultVisible: false,
      data: {},
      previewSrcList: []
    }
  },

  components: { Header },

  created () {
    this.fetchJobs()
  },

  computed: {},

  methods: {
    async fetchJobs () {
      const result = await UserEngine.fetchUserJobs()
      if (result) {
        this.jobs = result.results

        this.jobs = result.results.map((job, index) => {
          const data = job.result ? job.result : {}
          return { ...job, created_at: Moment.getBeautyDate(job.created_at), ...this.getTag(job.status), data: data }
        })
        this.total = result.count
      }
    },

    getTag (status) {
      switch (status) {
        case 'pending':
          return {tag: 'primary', text: '等待中'}
        case 'done':
          return {tag: 'success', text: '完成'}
        case 'running':
          return {tag: 'warning', text: '运行中'}
        case 'failed':
          return {tag: 'error', text: '失败'}
        default:
          return {tag: 'primary', text: '-'}
      }
    },

    showResult (row) {
      this.data = row.data
      if (this.data.url) {
        this.previewSrcList = [this.data.url]
      }
      this.resultVisible = true
    }
  }
}
</script>

<style lang='css' scoped>
  .pagination-container {
    display: inline-block;
  }
  .content-container {
    display: grid;
    place-items: center;
    width: 80%;
    margin: 0 auto;
  }

  .table-container {
    display: inline-block;
    margin: 20px 20px;
  }

  .top {
    padding: 0%;
  }
</style>
