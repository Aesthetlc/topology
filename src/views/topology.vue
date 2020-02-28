<template>
  <div v-loading="loading">
    <el-container>
      <el-aside class="left" width="200px">
        <div v-for="(item, index) in tool" :key="index">
          <div class="title">{{ item.group }}</div>
          <div class="buttons">
            <a
              v-for="(btn, i) in item.children"
              :key="i"
              :title="btn.name"
              :draggable="btn.data"
              @dragstart="onDrag($event, btn)"
            >
              <i :class="`iconfont ${btn.icon}`"></i>
            </a>
          </div>
        </div>
      </el-aside>
      <div
        id="topology-canvas"
        class="full"
        @contextmenu="onContextMenu($event)"
        @keyup.ctrl.90.exact="canvas.undo()"
        @keyup.ctrl.shift.90.exact="canvas.redo()"
        @keyup.ctrl.79.exact="canvas.cut()"
        @keyup.ctrl.67.exact="canvas.copy()"
        @keyup.ctrl.86.exact="canvas.parse()"
      ></div>
      <div
        class="context-menu"
        v-if="contextmenu.left"
        :style="this.contextmenu"
      >
        <CanvasContextMenu
          :canvas="canvas"
          :props.sync="props"
        ></CanvasContextMenu>
      </div>
      <div class="props">
        <CanvasProps
          :canvas="canvas"
          :props.sync="props"
          :linshi="linshi"
          @change="onUpdateProps"
          @changeLinshi="onUpadteLinshi"
        ></CanvasProps>
      </div>
    </el-container>
  </div>
</template>

<script>
import CanvasProps from './../components/CanvasProps'
import CanvasContextMenu from './../components/CanvasContextMenu'
import { Topology } from 'topology-core'
import { canvasRegister } from './../services/canvas'
export default {
  data () {
    return {
      tool: [
        {
          group: '基本形状',
          children: [
            {
              name: 'rectangle',
              icon: 'icon-rect',
              data: {
                text: 'Topology',
                rect: {
                  width: 100,
                  height: 100
                },
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                name: 'rectangle',
                icon: '\ue64d',
                iconFamily: 'topology',
                iconColor: '#2f54eb'
              }
            },
            {
              name: 'rectangle',
              icon: 'icon-rectangle',
              data: {
                text: '圆角矩形',
                rect: {
                  width: 200,
                  height: 50
                },
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 0.1,
                name: 'rectangle'
              }
            },
            {
              name: 'circle',
              icon: 'icon-circle',
              data: {
                text: '圆',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'circle',
                textMaxLine: 1
              }
            },
            {
              name: 'triangle',
              icon: 'icon-triangle',
              data: {
                text: '三角形',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'triangle'
              }
            },
            {
              name: 'diamond',
              icon: 'icon-diamond',
              data: {
                text: '菱形',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'diamond'
              }
            },
            {
              name: 'pentagon',
              icon: 'icon-pentagon',
              data: {
                text: '五边形',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'pentagon'
              }
            },
            {
              name: 'hexagon',
              icon: 'icon-hexagon',
              data: {
                text: '六边形',
                rect: {
                  width: 100,
                  height: 100
                },
                paddingTop: 10,
                paddingBottom: 10,
                name: 'hexagon'
              }
            },
            {
              name: 'pentagram',
              icon: 'icon-pentagram',
              data: {
                text: '五角星',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'pentagram'
              }
            },
            {
              name: 'leftArrow',
              icon: 'icon-arrow-left',
              data: {
                text: '左箭头',
                rect: {
                  width: 200,
                  height: 100
                },
                name: 'leftArrow'
              }
            },
            {
              name: 'rightArrow',
              icon: 'icon-arrow-right',
              data: {
                text: '右箭头',
                rect: {
                  width: 200,
                  height: 100
                },
                name: 'rightArrow'
              }
            },
            {
              name: 'twowayArrow',
              icon: 'icon-twoway-arrow',
              data: {
                text: '双向箭头',
                rect: {
                  width: 200,
                  height: 100
                },
                name: 'twowayArrow'
              }
            },
            {
              name: 'line',
              icon: 'icon-line',
              data: {
                text: '直线',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'line'
              }
            },
            {
              name: 'cloud',
              icon: 'icon-cloud',
              data: {
                text: '云',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'cloud'
              }
            },
            {
              name: 'message',
              icon: 'icon-msg',
              data: {
                text: '消息框',
                rect: {
                  width: 100,
                  height: 100
                },
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                name: 'message'
              }
            },
            {
              name: 'file',
              icon: 'icon-file',
              data: {
                text: '文档',
                rect: {
                  width: 80,
                  height: 100
                },
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                name: 'file'
              }
            },
            {
              name: 'text',
              icon: 'icon-text',
              data: {
                text: 'le5le-topology / 乐吾乐',
                rect: {
                  width: 160,
                  height: 30
                },
                name: 'text'
              }
            },
            {
              name: 'image',
              icon: 'icon-image',
              data: {
                text: '',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'image',
                image: require('../assets/img/logo.png')
              }
            },
            {
              name: 'cube',
              icon: 'icon-cube',
              data: {
                rect: {
                  width: 50,
                  height: 70
                },
                is3D: true,
                z: 10,
                zRotate: 15,
                fillStyle: '#ddd',
                name: 'cube',
                icon: '\ue63c',
                iconFamily: 'topology',
                iconColor: '#777',
                iconSize: 30
              }
            },
            {
              name: 'people',
              icon: 'icon-people',
              data: {
                rect: {
                  width: 70,
                  height: 100
                },
                name: 'people'
              }
            },
            {
              name: '视频/网页',
              icon: 'icon-pc',
              data: {
                text: '视频/网页',
                rect: {
                  width: 200,
                  height: 200
                },
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
                // strokeStyle: 'transparent',
                name: 'div'
              }
            }
          ]
        },
        {
          group: '流程图',
          children: [
            {
              name: '开始/结束',
              icon: 'icon-flow-start',
              data: {
                text: '开始',
                rect: {
                  width: 120,
                  height: 40
                },
                borderRadius: 0.5,
                name: 'rectangle'
              }
            },
            {
              name: '流程',
              icon: 'icon-rectangle',
              data: {
                text: '流程',
                rect: {
                  width: 120,
                  height: 40
                },
                name: 'rectangle'
              }
            },
            {
              name: '判定',
              icon: 'icon-diamond',
              data: {
                text: '判定',
                rect: {
                  width: 120,
                  height: 60
                },
                name: 'diamond'
              }
            },
            {
              name: '数据',
              icon: 'icon-flow-data',
              data: {
                text: '数据',
                rect: {
                  width: 120,
                  height: 50
                },
                name: 'flowData'
              }
            },
            {
              name: '准备',
              icon: 'icon-flow-ready',
              data: {
                text: '准备',
                rect: {
                  width: 120,
                  height: 50
                },
                name: 'hexagon'
              }
            },
            {
              name: '子流程',
              icon: 'icon-flow-subprocess',
              data: {
                text: '子流程',
                rect: {
                  width: 120,
                  height: 50
                },
                name: 'flowSubprocess'
              }
            },
            {
              name: '数据库',
              icon: 'icon-db',
              data: {
                text: '数据库',
                rect: {
                  width: 80,
                  height: 120
                },
                name: 'flowDb'
              }
            },
            {
              name: '文档',
              icon: 'icon-flow-document',
              data: {
                text: '文档',
                rect: {
                  width: 120,
                  height: 100
                },
                name: 'flowDocument'
              }
            },
            {
              name: '内部存储',
              icon: 'icon-internal-storage',
              data: {
                text: '内部存储',
                rect: {
                  width: 120,
                  height: 80
                },
                name: 'flowInternalStorage'
              }
            },
            {
              name: '外部存储',
              icon: 'icon-extern-storage',
              data: {
                text: '外部存储',
                rect: {
                  width: 120,
                  height: 80
                },
                name: 'flowExternStorage'
              }
            },
            {
              name: '队列',
              icon: 'icon-flow-queue',
              data: {
                text: '队列',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'flowQueue'
              }
            },
            {
              name: '手动输入',
              icon: 'icon-flow-manually',
              data: {
                text: '手动输入',
                rect: {
                  width: 120,
                  height: 80
                },
                name: 'flowManually'
              }
            },
            {
              name: '展示',
              icon: 'icon-flow-display',
              data: {
                text: '展示',
                rect: {
                  width: 120,
                  height: 80
                },
                name: 'flowDisplay'
              }
            },
            {
              name: '并行模式',
              icon: 'icon-flow-parallel',
              data: {
                text: '并行模式',
                rect: {
                  width: 120,
                  height: 50
                },
                name: 'flowParallel'
              }
            },
            {
              name: '注释',
              icon: 'icon-flow-comment',
              data: {
                text: '注释',
                rect: {
                  width: 100,
                  height: 100
                },
                name: 'flowComment'
              }
            }
          ]
        },
        {
          group: '活动图',
          children: [
            {
              name: '开始',
              icon: 'icon-inital',
              data: {
                text: '',
                rect: {
                  width: 30,
                  height: 30
                },
                name: 'circle',
                fillStyle: '#555',
                strokeStyle: 'transparent'
              }
            },
            {
              name: '结束',
              icon: 'icon-final',
              data: {
                text: '',
                rect: {
                  width: 30,
                  height: 30
                },
                name: 'activityFinal'
              }
            },
            {
              name: '活动',
              icon: 'icon-action',
              data: {
                text: '活动',
                rect: {
                  width: 120,
                  height: 50
                },
                borderRadius: 0.25,
                name: 'rectangle'
              }
            },
            {
              name: '决策/合并',
              icon: 'icon-diamond',
              data: {
                text: '决策',
                rect: {
                  width: 120,
                  height: 50
                },
                name: 'diamond'
              }
            },
            {
              name: '垂直泳道',
              icon: 'icon-swimlane-v',
              data: {
                text: '垂直泳道',
                rect: {
                  width: 200,
                  height: 500
                },
                name: 'swimlaneV'
              }
            },
            {
              name: '水平泳道',
              icon: 'icon-swimlane-h',
              data: {
                text: '水平泳道',
                rect: {
                  width: 500,
                  height: 200
                },
                name: 'swimlaneH'
              }
            },
            {
              name: '垂直分岔/汇合',
              icon: 'icon-fork-v',
              data: {
                text: '',
                rect: {
                  width: 10,
                  height: 150
                },
                name: 'forkV',
                fillStyle: '#555',
                strokeStyle: 'transparent'
              }
            },
            {
              name: '水平分岔/汇合',
              icon: 'icon-fork',
              data: {
                text: '',
                rect: {
                  width: 150,
                  height: 10
                },
                name: 'forkH',
                fillStyle: '#555',
                strokeStyle: 'transparent'
              }
            }
          ]
        },
        {
          group: '时序图和类图',
          children: [
            {
              name: '生命线',
              icon: 'icon-lifeline',
              data: {
                text: '生命线',
                rect: {
                  width: 150,
                  height: 400
                },
                name: 'lifeline'
              }
            },
            {
              name: '激活',
              icon: 'icon-focus',
              data: {
                text: '',
                rect: {
                  width: 12,
                  height: 200
                },
                name: 'sequenceFocus'
              }
            },
            {
              name: '简单类',
              icon: 'icon-simple-class',
              data: {
                text: 'Topolgoy',
                rect: {
                  width: 270,
                  height: 200
                },
                paddingTop: 40,
                font: {
                  fontFamily: 'Arial',
                  color: '#222',
                  fontWeight: 'bold'
                },
                fillStyle: '#ffffba',
                strokeStyle: '#7e1212',
                name: 'simpleClass',
                children: [
                  {
                    text: '- name: string\n+ setName(name: string): void',
                    name: 'text',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    rectInParent: {
                      x: 0,
                      y: 0,
                      width: '100%',
                      height: '100%',
                      rotate: 0
                    },
                    font: {
                      fontFamily: 'Arial',
                      color: '#222',
                      textAlign: 'left',
                      textBaseline: 'top'
                    }
                  }
                ]
              }
            },
            {
              name: '类',
              icon: 'icon-class',
              data: {
                text: 'Topolgoy',
                rect: {
                  width: 270,
                  height: 200
                },
                paddingTop: 40,
                font: {
                  fontFamily: 'Arial',
                  color: '#222',
                  fontWeight: 'bold'
                },
                fillStyle: '#ffffba',
                strokeStyle: '#7e1212',
                name: 'interfaceClass',
                children: [
                  {
                    text: '- name: string',
                    name: 'text',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    rectInParent: {
                      x: 0,
                      y: 0,
                      width: '100%',
                      height: '50%',
                      rotate: 0
                    },
                    font: {
                      fontFamily: 'Arial',
                      color: '#222',
                      textAlign: 'left',
                      textBaseline: 'top'
                    }
                  },
                  {
                    text: '+ setName(name: string): void',
                    name: 'text',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    rectInParent: {
                      x: 0,
                      y: '50%',
                      width: '100%',
                      height: '50%',
                      rotate: 0
                    },
                    font: {
                      fontFamily: 'Arial',
                      color: '#222',
                      textAlign: 'left',
                      textBaseline: 'top'
                    }
                  }
                ]
              }
            }
          ]
        }
      ],
      canvas: {},
      canvasOptions: {},
      props: {
        node: null,
        line: null,
        nodes: null,
        multi: false,
        locked: false
      },
      contextmenu: {
        left: null,
        top: null,
        bottom: null
      },
      loading: true,
      linshi: 0
    }
  },
  components: {
    CanvasProps,
    CanvasContextMenu
  },
  computed: {
    event () {
      return this.$store.state.event
    }
  },
  watch: {
    event (curVal) {
      if (this['handle_' + curVal.name]) {
        this['handle_' + curVal.name](curVal.data)
      }
    },
    $route (val) {
      this.open()
    }
  },
  created () {
    canvasRegister()
    document.onclick = event => {
      this.linshi = 0
      this.contextmenu = {
        left: null,
        top: null,
        bottom: null
      }
    }
  },
  mounted () {
    this.canvasOptions.on = this.onMessage
    this.canvas = new Topology('topology-canvas', this.canvasOptions)
    this.$store.state.canvas = this.canvas
    if (this.$route.query.id !== undefined) {
      this.open()
    } else {
      this.loading = false
    }
  },
  methods: {
    async open () {
      this.loading = true
      if (!this.$route.query.id) {
        return
      }
      const data = await this.$axios.get(
        '/api/topology/' + this.$route.query.id
      )
      if (data.data && data.data.id) {
        this.canvas.open(data.data.data)
      }
      this.loading = false
    },
    onUpadteLinshi (val) {
      this.linshi = val
    },
    onDrag (event, node) {
      event.dataTransfer.setData('Text', JSON.stringify(node.data))
    },
    onMessage (event, data) {
      console.log(event, data)
      switch (event) {
        case 'node':
        case 'addNode':
          this.props = {
            node: data,
            line: null,
            multi: false,
            nodes: null,
            locked: data.locked
          }
          break
        case 'line':
        case 'addLine':
          debugger
          this.props = {
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: data.locked
          }
          break
        case 'multi':
          this.props = {
            node: null,
            line: null,
            multi: true,
            nodes: data.nodes.length > 1 ? data.nodes : null,
            locked: this.getLocked(data)
          }
          break
        case 'space':
          this.props = {
            node: null,
            line: null,
            multi: false,
            nodes: null,
            locked: false
          }
          break
        case 'moveOut':
          break
        case 'moveNodes':
        case 'resizeNodes':
          if (data.length > 1) {
            this.props = {
              node: null,
              line: null,
              multi: true,
              nodes: data,
              locked: this.getLocked({ nodes: data })
            }
          } else {
            this.props = {
              node: data[0],
              line: null,
              multi: false,
              nodes: null,
              locked: false
            }
          }
          break
        case 'resize':
        case 'scale':
        case 'locked':
          if (this.canvas && this.canvas.data) {
            this.$store.commit('data', {
              scale: this.canvas.data.scale || 1,
              lineName: this.canvas.data.lineName,
              fromArrowType: this.canvas.data.fromArrowType,
              toArrowType: this.canvas.data.toArrowType,
              fromArrowlockedType: this.canvas.data.locked
            })
          }
      }
    },
    handle_state (data) {
      this.canvas.data[data.key] = data.value
      this.$store.commit('data', {
        scale: this.canvas.data.scale || 1,
        lineName: this.canvas.data.lineName,
        fromArrowType: this.canvas.data.fromArrowType,
        toArrowType: this.canvas.data.toArrowType,
        fromArrowlockedType: this.canvas.data.locked
      })
    },
    getLocked (data) {
      let locked = true
      if (data.nodes && data.nodes.length) {
        for (const item of data.nodes) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      if (locked && data.lines) {
        for (const item of data.lines) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }

      return locked
    },
    onUpdateProps (node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      this.canvas.updateProps(node)
    },
    onContextMenu (event) {
      event.preventDefault()
      event.stopPropagation()

      if (event.clientY + 360 < document.body.clientHeight) {
        this.contextmenu = {
          left: event.clientX + 'px',
          top: event.clientY + 'px'
        }
      } else {
        this.contextmenu = {
          left: event.clientX + 'px',
          bottom: document.body.clientHeight - event.clientY + 'px'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/font_1113798_0532l8oa6jqp.css";
body {
  padding: 0px;
  margin: 0px;
}
.left,
.right {
  background-color: #f8f8f8;
  height: calc(100vh - 60px);
}
.left {
  .title {
    color: #0d1a26;
    font-weight: 600;
    font-size: 20px;
    line-height: 1;
    padding: 10px 5px;
    margin-top: 5px;
    border-bottom: 1px solid #ddd;

    &:first-child {
      border-top: none;
    }
  }
  .buttons {
    padding: 10px 0;
    a {
      display: inline-block;
      color: #314659;
      line-height: 1;
      width: 40px;
      height: 40px;
      text-align: center;
      text-decoration: none !important;

      .iconfont {
        font-size: 20px;
      }
    }
  }
}
.props {
  flex-shrink: 0;
  width: 15.4rem;
  padding: 0.1rem 0;
  background-color: #f8f8f8;
  border-left: 1px solid #d9d9d9;
  overflow-x: hidden;
  // overflow: auto;
  position: relative;
}
.context-menu {
  position: fixed;
  z-index: 10;
}
.full {
  flex: 1;
  position: relative;
  // overflow: auto;
  background: #fff;
}
</style>
