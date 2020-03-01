<template>
  <div class="headers">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#f8f8f8"
    >
      <el-menu-item index="1" @click="onOpen">新建视图</el-menu-item>
      <el-menu-item index="2" @click="aboutMe">关于我们</el-menu-item>
      <el-menu-item index="3" @click="loadJson" :disabled="disabledFlag"
        >加载json</el-menu-item
      >
      <el-menu-item index="4" @click="showJson" :disabled="disabledFlag"
        >展示json</el-menu-item
      >
      <el-menu-item index="5" @click="saveImg" :disabled="disabledFlag"
        >保存图片</el-menu-item
      >
    </el-menu>
    <el-menu
      mode="horizontal"
      class="full"
      background-color="#f8f8f8"
    ></el-menu>
    <el-menu background-color="#f8f8f8" mode="horizontal">
      <!-- 这里是新增的 -->
      <el-submenu index="6" title="默认连线类型" :disabled="disabledFlag">
        <template slot="title">
          <i :class="`iconfont icon-${lineName}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in lineNames"
          :key="index"
          :index="`line-${item}`"
          @click="onState('lineName', item)"
        >
          <i :class="`iconfont icon-${item}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>

    <el-menu background-color="#f8f8f8" mode="horizontal">
      <el-submenu index="7" title="默认起点箭头" :disabled="disabledFlag">
        <template slot="title">
          <i :class="`iconfont icon-from-${fromArrowType}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in arrowTypes"
          :key="index"
          :index="`fromArrow-${item}`"
          @click="onState('fromArrowType', item)"
        >
          <i :class="`iconfont icon-from-${item}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-menu background-color="#f8f8f8" mode="horizontal">
      <el-submenu index="8" title="默认终点箭头" :disabled="disabledFlag">
        <template slot="title">
          <i :class="`iconfont icon-to-${toArrowType}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in arrowTypes"
          :key="index"
          :index="`toArrow-${item}`"
          @click="onState('toArrowType', item)"
        >
          <i :class="`iconfont icon-to-${item}`"></i>
        </el-menu-item>
      </el-submenu>
      <!-- 这里是新增的 -->
    </el-menu>

    <el-dialog
      title="加载json"
      :visible.sync="dialogVisibleLoad"
      width="80%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <editor
          v-model="newMsg"
          @init="editorInit"
          lang="javascript"
          theme="xcode"
          width="100%"
          height="663"
          ref="myEditor1"
        ></editor>
        <el-button type="primary" @click="loadJsonData">加 载</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="显示json"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <editor
          v-model="editMsg"
          @init="editorInit"
          lang="javascript"
          theme="xcode"
          width="100%"
          height="663"
          ref="myEditor"
        ></editor>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      activeIndex: '0',
      dialogVisible: false,
      dialogVisibleLoad: false,
      editMsg: '',
      newMsg: '',
      disabledFlag: true,
      arrowTypes: [
        '',
        'triangleSolid',
        'triangle',
        'diamondSolid',
        'diamond',
        'circleSolid',
        'circle',
        'line',
        'lineUp',
        'lineDown'
      ],
      lineNames: ['curve', 'polyline', 'line']
    }
  },
  components: {
    editor: require('vue2-ace-editor')
  },
  mounted () {
    if (this.$route.path !== '/index') {
      this.disabledFlag = false
    }
    this.init()
  },
  computed: {
    lineName () {
      return this.$store.state.data.lineName
    },
    fromArrowType () {
      return this.$store.state.data.fromArrowType
    },
    toArrowType () {
      return this.$store.state.data.toArrowType
    }
  },
  methods: {
    onState (key, value) {
      this.$store.commit('emit', {
        name: 'state',
        data: {
          key,
          value
        }
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    onOpen () {
      this.$router.push({ path: '/topology' })
    },
    aboutMe () {
      const h = this.$createElement
      this.$notify({
        title: '关于我们',
        message: h('B', { style: 'color: blue' }, '欢迎使用V1.0系统')
      })
    },
    // json展示
    showJson () {
      this.dialogVisible = true
      this.editMsg = JSON.stringify(this.$store.state.canvas.data, null, 2)
    },
    // 加载json
    loadJson () {
      this.dialogVisibleLoad = true
    },
    loadJsonData () {
      this.dialogVisibleLoad = false
      this.$store.state.canvas.open(JSON.parse(this.newMsg))
    },
    saveImg () {
      const date = moment().format('YYYY-MM-DD HH:mm:ss')
      this.$store.state.canvas.saveAsImage(date + 'onplat')
    },
    handleClose (done) {
      done()
    },
    // 编辑器样式语言
    editorInit () {
      require('brace/ext/language_tools') // language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/javascript') // language
      require('brace/mode/less')
      require('brace/theme/xcode')
      require('brace/snippets/javascript') // snippet
    },

    // 初始化init编辑器
    init () {
      const editor = this.$refs.myEditor.editor
      const editor1 = this.$refs.myEditor1.editor
      editor.setReadOnly(true) // 设置禁用
      editor.setFontSize(20)
      editor1.setFontSize(20)
    }
  }
}
</script>

<style lang="less" scoped>
.el-dialog__wrapper /deep/.el-dialog__body {
  padding: 0 !important;
}
.iconfont {
  color: #314659;
  font-size: 26px;
}
.headers {
  display: flex;
  .full {
    flex: 1;
  }
}
/deep/ .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
  border: 1px solid transparent !important
}
</style>
