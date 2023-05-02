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
          prop="input"
          label="输入"
          width="200">
        <template slot-scope="scope">
          <div v-show="!isEmpty(scope.row.params.text)"><div>{{ truncateText(scope.row.params.text)}}</div></div>
          <div v-show="!isEmpty(scope.row.params.file_url)"><el-image
            style="width: 50px; height: 50px"
            :src="scope.row.params.file_url"
            fit="cover"
          >
          </el-image></div>
        </template>
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
              type="primary"
              @click="fetchJobs"
            >
              刷新
            </el-button>
            <el-button
              type="primary"
              @click="onAddJob"
            >
              新建任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="fetchJobs"
        :current-page.sync="p"
        :page-size="10"
        class="pagination-container"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    <el-dialog
      title="结果查看"
      :visible.sync="resultVisible"
      width="30%"
      center>
        <div v-show="!isEmpty(data.audio)">
          <a :href="data.audio" target="_blank">音频地址</a>
          <mini-audio
          style="width: 90%;"
          :audio-source="data.audio"
        ></mini-audio></div>
        <el-image
        style="width: 100px; height: 100px"
        v-show="!isEmpty(data.image)"
        :src="data.image"
        fit="cover"
        :preview-src-list="previewSrcList">
      </el-image>
      <div v-show="!isEmpty(data.labels)">文本： {{data.labels}}</div>
      <div v-show="!isEmpty(data.scores)">得分： {{data.scores}}</div>
    </el-dialog>
    <el-dialog
      title="新建任务"
      :visible.sync="addJobVisible"
      width="60%"
      height="800"
      center
    >
      <el-form ref="data" :model="data" label-width="80px">
        <el-form-item label="任务类型">
          <el-select v-model="data.type" placeholder="请选择任务类型">
            <el-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="textInput.includes(data.type)"  label="输入文本">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="data.text"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-show="imageInput.includes(data.type)" label="输入图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="onUpload"
          >
            <img v-if="data.file_url" :src="data.file_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="data.type==='tts'" label="发音人">
          <el-select v-model="data.voice" placeholder="请选择发音人">
            <el-option v-for="item in voiceList" :key="item.value" :value="item.value" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.type">
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
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
import { Moment, Lodash, User } from '@/utils'
const TYPE_LIST = [
  { value: 'tts', name: '文本转语音' },
  { value: 'bshm', name: '人像抠图' },
  { value: 'generate_recognition', name: '通用物体识别' },
  {value: 'repair_portrait', name: '人像增强'}
]
const VOICE_LIST = [
  { value: 'zhiyan', name: '知燕' },
  { value: 'zhitan', name: '知甜' },
  { value: 'zhibei', name: '知贝' },
  { value: 'zhizhe', name: '知哲' }
]

const TEXT_INPUT = ['tts']
const IMAGE_INPUT = ['bshm', 'generate_recognition', 'repair_portrait']
export default {
  data () {
    return {
      jobs: [],
      total: 0,
      resultVisible: false,
      addJobVisible: false,
      p: 1,
      data: {},
      previewSrcList: [],
      typeList: [],
      textInput: [],
      imageInput: [],
      userInfo: {}
    }
  },

  components: { Header },

  created () {
    this.fetchJobs()
    this.typeList = TYPE_LIST
    this.textInput = TEXT_INPUT
    this.imageInput = IMAGE_INPUT
    this.voiceList = VOICE_LIST
  },

  computed: {},

  methods: {
    isEmpty (data) {
      return Lodash.isNull(data)
    },

    async fetchJobs () {
      const result = await UserEngine.fetchUserJobs({p: this.p, ordering: '-id'})
      if (result) {
        this.jobs = result.results.map((job, index) => {
          const data = job.result ? job.result : {}
          return { ...job, created_at: Moment.getBeautyDate(job.created_at), ...this.getTag(job.status), data: data, type: this.getTypeName(job.type) }
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

    getTypeName (key) {
      for (const item of TYPE_LIST) {
        if (key === item.value) {
          return item.name
        }
      }
      return '-'
    },

    showResult (row) {
      this.data = row.data
      if (this.data.image) {
        this.previewSrcList = [this.data.image]
      }
      this.resultVisible = true
    },

    onAddJob () {
      const userInfo = User.getUserInfo()
      if (Lodash.isNull(userInfo)) {
        this.$message.error('需要先登陆')
      }
      this.userInfo = userInfo
      this.addJobVisible = true
      this.data = {}
    },

    truncateText (text) {
      if (Lodash.isNull(text)) {
        return ''
      }
      const maxLength = 20
      if (text.length > maxLength) {
        text = text.substr(0, maxLength) + '...'
      }

      return text
    },

    handleAvatarSuccess (res, file) {
      this.data.url = URL.createObjectURL(file.raw)
    },

    beforeAvatarUpload (file) {
      const imageRegex = /^image\/(png|webp|jpe?g)$/i
      const isImage = imageRegex.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('不支持的图片格式 支持JPG JPEG PNG')
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },

    async onUpload (params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('type', 'image')
      await UserEngine.uploadFile(formData).then((result) => {
        if (!Lodash.isNull(result.url)) {
          this.data.file_url = result.url
          this.$nextTick(() => {
            this.$forceUpdate()
          })
        }
      })
    },

    async submitForm () {
      if (this.data.type === 'tts' && Lodash.isNull(this.data.voice)) {
        this.$message.error('请选择发音人')
        return false
      }

      if (this.imageInput.includes(this.data.type) && Lodash.isNull(this.data.file_url)) {
        this.$message.error('请上传图片')
        return false
      }

      if (this.textInput.includes(this.data.type) && Lodash.isNull(this.data.text)) {
        this.$message.error('请输入文本')
        return false
      }

      await UserEngine.createJob({
        user_id: this.userInfo.uid,
        type: this.data.type,
        params: {file_url: this.data.file_url, text: this.data.text, voice: this.data.voice}
      })
      this.addJobVisible = false
      this.data = {}
      await this.fetchJobs()
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
