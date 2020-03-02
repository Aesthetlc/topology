<template>
  <div>
    <el-menu
      :default-openeds="['1']"
      class="el-menu-vertical-demo"
      @open="handleMenuOpen"
      @close="handleMenuClose"
      background-color="#F8F8F8"
      :unique-opened="true"
    >
      <el-submenu index="1">
        <template slot="title">
          <span style="fontSize:20px;font-weight:600">功能菜单</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="loadJson" index="1-1">加载json</el-menu-item>
          <el-menu-item @click="showJson" index="1-2">显示json</el-menu-item>
          <el-menu-item @click="saveImg" index="1-3">保存图片</el-menu-item>
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
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <div v-if="!props.node && !props.line && !props.multi">
      <div class="title" style="text-indent:1em"><p>使用指南</p></div>
      <div class="group">
        <li>方向键：控制节点移动5个像素</li>
        <li>Ctrl + 方向键：控制节点移动1个像素</li>
        <li>Ctrl + 鼠标移动：移动整个画布</li>
        <li>Ctrl + 鼠标滚轮：缩放</li>
        <li>添加或选中节点，右侧属性支持上传各种图片哦</li>
      </div>
    </div>
    <!-- 选中节点 -->
    <div v-if="props.node">
      <div class="title" style="text-indent:1em"><p>位置和大小</p></div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>X（px）</div>
            <div>
              <el-input-number
                v-model="props.node.rect.x"
                controls-position="right"
                @change="onChange"
              ></el-input-number>
            </div>
          </div>
          <div class="second">
            <div>Y（px）</div>
            <div>
              <el-input-number
                v-model="props.node.rect.y"
                controls-position="right"
                @change="onChange"
              ></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>宽（px）</div>
            <el-input-number
              v-model="props.node.rect.width"
              controls-position="right"
              @change="onChange"
            ></el-input-number>
          </div>
          <div class="second">
            <div>高（px）</div>
            <el-input-number
              v-model="props.node.rect.height"
              controls-position="right"
              @change="onChange"
            ></el-input-number>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>圆角（0 - 1）</div>
            <el-input-number
              v-model="props.node.borderRadius"
              controls-position="right"
              @change="onChange"
            ></el-input-number>
          </div>
          <div class="second">
            <div>旋转（°）</div>
            <el-input-number
              v-model="props.node.rotate"
              controls-position="right"
              @change="onChange"
            ></el-input-number>
          </div>
        </div>
      </div>
      <div class="title" style="text-indent:1em"><p>边框选择</p></div>
      <div class="items">
        <div class="grid">
          <div class="first borderStyle">
            <div style="position:relative">
              边框样式
            </div>
            <div style="position:absolute;z-index:2;pointer-events:none">
              <div v-show="props.node.dash === 0 && linshi === 0">
                <div v-html="options[0].label"></div>
              </div>
              <div v-show="props.node.dash === 1 && linshi === 0">
                <div v-html="options[1].label"></div>
              </div>
              <div v-show="props.node.dash === 2 && linshi === 0">
                <div v-html="options[2].label"></div>
              </div>
              <div v-show="props.node.dash === 3 && linshi === 0">
                <div v-html="options[3].label"></div>
              </div>
            </div>
            <el-select
              ref="select_svg"
              v-model="addModel.svg"
              @change="changeStatus"
              placeholder=""
            >
              <el-option
                v-for="item in options"
                :key="item.index"
                :label="item.label"
                :value="`${item.value}|${item.index}|${item.label}`"
              >
                <div v-html="item.label"></div>
              </el-option>
            </el-select>
          </div>
          <div class="second">
            <div>边框宽度</div>
            <div>
              <el-input-number
                v-model="props.node.lineWidth"
                controls-position="right"
                @change="onChange"
              ></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>边框颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.strokeStyle"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.strokeStyle"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>边框透明度(0-1)</div>
            <el-input
              v-model="props.node.globalAlpha"
              controls-position="right"
              @change="onChange"
            ></el-input>
          </div>
          <div class="second">
            <div>背景</div>
            <el-select v-model="props.node.bkType" @change="onChange">
              <el-option
                v-for="item in bkTypeOptions.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!-- 纯色背景颜色 -->
      <div v-if="props.node.bkType === 0" class="items">
        <div class="grid">
          <div class="first">
            <div>背景颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.fillStyle"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.fillStyle"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <!-- 线性渐变 背景颜色 -->
      <div v-if="props.node.bkType === 1" class="items">
        <div class="grid">
          <div class="first">
            <div>开始颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.gradientFromColor"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.gradientFromColor"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
          <div class="second">
            <div>结束颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.gradientToColor"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.gradientToColor"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <!-- 径向渐变 背景颜色 -->
      <div v-if="props.node.bkType === 2" class="items">
        <div class="grid">
          <div class="first">
            <div>开始颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.gradientFromColor"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.gradientFromColor"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
          <div class="second">
            <div>结束颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="props.node.gradientToColor"
                controls-position="right"
                @change="onChange"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="props.node.gradientToColor"
                  @change="onChange"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.line">
      <div class="title" style="text-indent:1em"><p>位置</p></div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>起点(X)</div>
            <div>
              <el-input-number
                v-model="props.line.from.x"
                controls-position="right"
                @change="onChangeProp"
              ></el-input-number>
            </div>
          </div>
          <div class="second">
            <div>起点(Y)</div>
            <div>
              <el-input-number
                v-model="props.line.from.y"
                controls-position="right"
                @change="onChangeProp"
              ></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <span v-show="false">{{ destinationX }}</span>
            <div>终点(X)</div>
            <el-input-number
              v-model="props.line.to.x"
              controls-position="right"
              @change="onChangeProp"
            ></el-input-number>
          </div>
          <div class="second">
            <span v-show="false">{{ destinationY }}</span>
            <div>终点(Y)</div>
            <el-input-number
              v-model="props.line.to.y"
              controls-position="right"
              @change="onChangeProp"
            ></el-input-number>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>起点箭头</div>
            <div class="input" @click="selectBegin">
              <div class="icon-item" v-if="props.line.fromArrow === ''">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.fromArrow === 'triangleSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,15 4,15 14" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'triangle'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,15 4,15 14"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.fromArrow === 'diamondSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,10 6,20 9,10 12" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'diamond'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,10 6,20 9,10 12"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.fromArrow === 'circleSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle cx="6" cy="9" r="5" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'circle'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle
                      cx="6"
                      cy="9"
                      r="5"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'line'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'lineUp'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.fromArrow === 'lineDown'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                  </g>
                </svg>
              </div>
            </div>
            <div class="dropdown" v-if="drowdown === 2">
              <div class="icon-item ph10 pv5" @click="onClickFromArrow('')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l100 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('triangleSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,15 4,15 14" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('triangle')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,15 4,15 14"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('diamondSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,10 6,20 9,10 12" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('diamond')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,10 6,20 9,10 12"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('circleSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle cx="6" cy="9" r="5" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('circle')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle
                      cx="6"
                      cy="9"
                      r="5"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickFromArrow('line')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('lineUp')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickFromArrow('lineDown')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="second">
            <div>终点箭头</div>
            <div class="input" @click="selectEnd">
              <div class="icon-item" v-if="props.line.toArrow === ''">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.toArrow === 'triangleSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,15 4,15 14" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'triangle'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,15 4,15 14"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.toArrow === 'diamondSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,10 6,20 9,10 12" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'diamond'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,10 6,20 9,10 12"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.toArrow === 'circleSolid'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle cx="6" cy="9" r="5" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'circle'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle
                      cx="6"
                      cy="9"
                      r="5"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'line'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'lineUp'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.toArrow === 'lineDown'">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                  </g>
                </svg>
              </div>
            </div>
            <div class="dropdown" v-if="drowdown === 3">
              <div class="icon-item ph10 pv5" @click="onClickToArrow('')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l100 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('triangleSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,15 4,15 14" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('triangle')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,15 4,15 14"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('diamondSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon points="0 9,10 6,20 9,10 12" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('diamond')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <polygon
                      points="0 9,10 6,20 9,10 12"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('circleSolid')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle cx="6" cy="9" r="5" fill="#000000" />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickToArrow('circle')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M1 9 l85 0" />
                    <circle
                      cx="6"
                      cy="9"
                      r="5"
                      fill="#ffffff"
                      stroke="#000000"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickToArrow('line')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickToArrow('lineUp')">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 -6" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickToArrow('lineDown')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                    <path d="M0 9 l12 6" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>起点箭头颜色</div>
            <div>
              <div class="borderStyleColor">
                <el-input
                  v-model="fromArrowColor"
                  controls-position="right"
                  @change="onChangeProp"
                  ><el-color-picker
                    slot="prefix"
                    size="mini"
                    style="top:5px"
                    v-model="fromArrowColor"
                    @change="onChangeProp"
                  ></el-color-picker
                ></el-input>
              </div>
            </div>
          </div>
          <div class="second">
            <div>终点箭头颜色</div>
            <div class="borderStyleColor">
              <el-input
                v-model="toArrowColor"
                controls-position="right"
                @change="onChangeProp"
                ><el-color-picker
                  slot="prefix"
                  size="mini"
                  style="top:5px"
                  v-model="toArrowColor"
                  @change="onChangeProp"
                ></el-color-picker
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>起点箭头大小</div>
            <div>
              <el-input-number
                v-model="props.line.fromArrowSize"
                controls-position="right"
                @change="onChangeProp"
              ></el-input-number>
            </div>
          </div>
          <div class="second">
            <div>终点箭头大小</div>
            <div>
              <el-input-number
                v-model="props.line.toArrowSize"
                controls-position="right"
                @change="onChangeProp"
              ></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div class="title" style="text-indent:1em"><p>外观</p></div>
      <div class="items">
        <div class="grid">
          <div class="first">
            <div>连线类型</div>
            <div class="input" @click="selectLianXianType">
              <div
                class="icon-item"
                v-if="props.line.name === 'curve'"
                title="曲线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 a100,50 0 0,1 85,0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.name === 'polyline'"
                title="线段"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 4 l40 0 l0 12 l40 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.name === 'line'"
                title="直线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item"
                v-if="props.line.name === 'mind'"
                title="脑图曲线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 15 C0,8 50,0 85,0" />
                  </g>
                </svg>
              </div>
            </div>
            <div class="dropdown" v-if="drowdown === 4">
              <div
                class="icon-item ph10 pv5"
                @click="onClickName('curve')"
                title="曲线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 a100,50 0 0,1 85,0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickName('polyline')"
                title="线段"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 4 l40 0 l0 12 l40 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickName('line')"
                title="直线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l100 0" />
                  </g>
                </svg>
              </div>
              <div
                class="icon-item ph10 pv5"
                @click="onClickName('mind')"
                title="脑图曲线"
              >
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 15 C0,8 50,0 85,0" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="second">
            <div>连线样式</div>
            <div class="input" @click="selectLianXianStyle">
              <div class="icon-item" v-if="props.line.dash === 0">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.dash === 1">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="5,5" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.dash === 2">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item" v-if="props.line.dash === 3">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10,2,10" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
            </div>
            <div class="dropdown" v-if="drowdown === 5">
              <div class="icon-item ph10 pv5" @click="onClickDash(0)">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickDash(1)">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="5,5" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickDash(2)">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
              <div class="icon-item ph10 pv5" @click="onClickDash(3)">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10,2,10" d="M0 9 l85 0" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogVisibleLoad: false,
      editMsg: '',
      newMsg: '',
      options: [
        {
          index: 0,
          value: '',
          name: '实线',
          label: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height:20px;width:70px">
                      <g fill="none" stroke="black" stroke-width="1">
                        <path d="M8 19 l85 0" />
                      </g>
                    </svg>`
        },
        {
          index: 1,
          value: '',
          name: '虚线',
          label: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height:20px;width:70px">
                      <g fill="none" stroke="black" stroke-width="1">
                        <path stroke-dasharray="5,5" d="M10 19 l85 0" />
                      </g>
                    </svg>`
        },
        {
          index: 2,
          value: '',
          name: '',
          label: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height:20px;width:70px">
                      <g fill="none" stroke="black" stroke-width="1">
                        <path stroke-dasharray="10,10" d="M10 19 l85 0" />
                      </g>
                    </svg>`
        },
        {
          index: 3,
          value: '',
          name: '',
          label: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height:20px;width:70px">
                      <g fill="none" stroke="black" stroke-width="1">
                        <path stroke-dasharray="10,10,2,10" d="M10 19 l85 0" />
                      </g>
                    </svg>`
        }
      ],
      addModel: {
        svg: ''
      },
      bkTypeOptions: {
        id: 'id',
        name: 'name',
        list: [
          {
            id: 0,
            name: '纯色背景'
          },
          {
            id: 1,
            name: '线性渐变'
          },
          {
            id: 2,
            name: '径向渐变'
          }
        ],
        noDefaultOption: true
      },
      destinationX: '',
      destinationY: '',
      fromArrowColor: '',
      toArrowColor: '',
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
      drowdown: 0
    }
  },
  props: {
    canvas: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    props: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        node: {
          bkType: 0
        }
      }
    },
    linshi: {
      type: Number,
      default: 0
    }
  },
  components: {
    editor: require('vue2-ace-editor')
  },
  created () {},
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
  watch: {
    props: {
      handler (newvalue) {
        if (newvalue.node) {
          if (newvalue.node.bkType === undefined) {
            this.props.node.bkType = 0
          }
          if (newvalue.node.gradientFromColor === undefined) {
            this.props.node.gradientFromColor = '#fff'
          }
          if (newvalue.node.gradientToColor === undefined) {
            this.props.node.gradientToColor = '#00FA9A'
          }
        }
        if (newvalue.line) {
          // 这个位置是处理el-input-number 终点的x和y  问题解决，原因还未知
          this.destinationX = this.props.line.to.x
          this.destinationY = this.props.line.to.y
          this.fromArrowColor = this.props.line.fromArrowColor
          this.toArrowColor = this.props.line.toArrowColor
          if (newvalue.line.fromArrowColor === undefined) {
            this.props.line.fromArrowColor = '#000000'
          }
          if (newvalue.line.toArrowColor === undefined) {
            this.props.line.toArrowColor = '#000000'
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    onClickFromArrow (arrow) {
      this.props.line.fromArrow = arrow
      this.drowdown = 0
      this.onChangeProp()
    },
    onClickToArrow (arrow) {
      this.props.line.toArrow = arrow
      this.drowdown = 0
      this.onChangeProp()
    },
    onClickName (name) {
      this.props.line.name = name
      this.drowdown = 0
      this.onChangeProp()
    },
    onClickDash (dash) {
      this.props.line.dash = dash
      this.drowdown = 0
      this.onChangeProp()
    },
    selectBegin (event) {
      event.preventDefault()
      event.stopPropagation()
      this.drowdown = 2
    },
    selectEnd (event) {
      event.preventDefault()
      event.stopPropagation()
      this.drowdown = 3
    },
    selectLianXianType (event) {
      event.preventDefault()
      event.stopPropagation()
      this.drowdown = 4
    },
    selectLianXianStyle (event) {
      event.preventDefault()
      event.stopPropagation()
      this.drowdown = 5
    },
    onChangeProp () {
      // 这个位置功能实现了但是取了一个临时变量 最后又赋值回来，效果正确 原因未知
      this.props.line.fromArrowColor = this.fromArrowColor
      this.props.line.toArrowColor = this.toArrowColor
      this.$emit('changeLine')
    },
    onChange () {
      this.$emit('change', this.props.node)
    },
    changeStatus (params) {
      // this.linshi = 999
      const val = params.split('|')[0]
      const dash = params.split('|')[1]
      const label = params.split('|')[2]
      // el-select实际上是两层div包裹的input
      this.addModel.svg = val
      // 获取当前el-select标签第一层div
      const dom = this.$refs.select_svg.$el
      // 创建需要添加到其中的标签 并填充内容
      // var arr = document.getElementsByClassName('el-input__prefix')
      // if ((arr.length !== 0) & (arr !== undefined)) {
      //   for (let i = 0; i < arr.length; i++) {
      //     var parent = arr[i].parentElement
      //     parent.removeChild(arr[i])
      //   }
      // }
      if (document.getElementById('selectBorder')) {
        const arr = document.getElementById('selectBorder')
        arr.parentElement.removeChild(arr)
      }

      const svgDom = document.createElement('span') // ('<svg-svg ref="svgRef" svg-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute('class', 'el-input__prefix')
      svgDom.setAttribute('id', 'selectBorder')
      svgDom.innerHTML = label
      // 将创建的标签添加到父节点(第二层div)
      dom.children[0].appendChild(svgDom)
      // 得到el-select中的input标签
      const inputDom = dom.children[0].children[0]
      inputDom.setAttribute('style', 'padding-left: 30px;')
      // 将添加的标签放到input前面
      dom.children[0].insertBefore(svgDom, inputDom)
      this.props.node.dash = Number(dash)
      this.$emit('change', this.props.node)
      this.$emit('changeLinshi', 999)
    },
    // json展示
    showJson () {
      this.dialogVisible = true
      this.editMsg = JSON.stringify(this.canvas.data, null, 2)
    },
    // 加载json
    loadJson () {
      this.dialogVisibleLoad = true
    },
    loadJsonData () {
      this.dialogVisibleLoad = false
      this.canvas.open(JSON.parse(this.newMsg))
    },
    saveImg () {
      const date = moment().format('YYYY-MM-DD HH:mm:ss')
      this.canvas.saveAsImage(date + 'onplat')
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
    },
    handleMenuOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleMenuClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
body {
  padding: 0;
  margin: 0;
}
.star {
  display: block;
  color: #f60 !important;
  text-decoration: underline;
}

/deep/ .el-submenu__title {
  border-top: 1px solid #ccc;
}

.title {
  color: #0d1a26;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}

.group {
  margin: 0.1rem 0 0.2rem 0.3rem;
  padding: 0;
  text-align: left;

  a,
  li {
    line-height: 2;
  }

  li {
    list-style: initial;
  }
}

.bottom {
  position: absolute;
  bottom: 0.1rem;
}

.items {
  padding: 0.05rem 0.15rem;
  .grid {
    display: flex;
    .first {
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 10px;
    }
    .second {
      margin-top: 10px;
      margin-right: 10px;
    }
  }
  .el-input-number {
    width: initial;
    line-height: 0.32rem;

    .el-input__inner {
      padding-left: 0;
      height: 2.34rem;
      line-height: 2.34rem;
    }

    .el-input-number__increase {
      line-height: 2.22rem;
    }
  }
}

.formItem {
  margin-bottom: 0.1rem;
}
.el-dialog__wrapper /deep/.el-dialog__body {
  padding: 0 !important;
}
.borderStyle /deep/ .el-input__inner {
  color: transparent;
}
.borderStyleColor /deep/ .el-input__inner {
  padding-left: 40px !important;
}
.input {
  width: 120px;
  background-color: #fff;
  height: 30px;
  // border: 1px solid #000;
  font-family: Arial;
}
.icon-item {
  line-height: 1;
  border: 1px solid #999;
  height: 30px;
}
svg {
  width: 80px;
  height: 18px;
  position: relative;
  top: 8px;
  left: 15px;
}
.dropdown {
  .icon-item:hover {
    background: #409eff;
  }
}
</style>
