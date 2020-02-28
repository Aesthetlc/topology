<template>
  <div>
    <div class="page-list" v-loading="loading">
      <div class="left"></div>
      <div class="center">
        <div style="margin-left:10px">
          <label>热门图文</label>
        </div>
        <div class="content">
          <div
            class="topo"
            v-for="(item, index) of data.list"
            :key="index"
            :title="item.desc"
            @click="onOpen(item)"
          >
            <div class="image">
              <img :src="item.image" />
            </div>
            <div>
              <div class="title" :title="item.name">
                {{ item.name }}
              </div>
              <div class="desc" :title="item.desc">
                {{ item.desc }}
              </div>
              <div class="message">
                <div class="user">
                  <el-avatar
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    :size="24"
                  ></el-avatar>
                  <span>{{ item.username }}</span>
                </div>
                <div class="userLove">
                  <span class="zan" title="赞">
                    <i
                      class="iconfont"
                      :class="{
                        'iconfont icon-appreciate': !item.stared,
                        'iconfont icon-appreciatefill': item.stared
                      }"
                    ></i>
                    <span>{{ item.star || 0 }}</span>
                  </span>
                  <span class="collect" title="收藏">
                    <i
                      class="iconfont"
                      :class="{
                        'iconfont icon-like': !item.favorited,
                        'iconfont icon-likefill': item.favorited
                      }"
                    ></i>
                    <span>{{ item.hot || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-left:5px">
          <el-pagination
            @current-change="getList"
            :current-page="search.pageIndex"
            :page-size="8"
            layout=" prev, pager, next, jumper, total"
            :total="data.count"
          ></el-pagination>
        </div>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: {
        list: [],
        count: 0
      },
      search: {
        pageIndex: 1,
        pageCount: 8
      },
      loading: true
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'topology') {
      to.meta.ifDoFresh = false
    } else {
      to.meta.ifDoFresh = true
    }
    next()
  },
  activated () {
    if (this.$route.meta.ifDoFresh) {
      this.$route.meta.ifDoFresh = false // 重置ifDoFresh
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList (value) {
      this.loading = true
      if (value !== undefined) {
        this.search.pageIndex = value
      }
      const datasource = await this.$axios.get(
        `/api/topologies?pageIndex=${this.search.pageIndex}&pageCount=${this.search.pageCount}`
      )
      this.data = datasource.data
      this.loading = false
    },
    onOpen (item) {
      this.$router.push({ path: '/topology', query: { id: item.id } })
    }
  }
}
</script>

<style lang="less">
@import "//at.alicdn.com/t/font_1113798_0532l8oa6jqp.css";
body {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
}
.page-list {
  position: absolute;
  background-color: #e7e7e7;
  // width: 100%;
  height: calc(100% - 60px);
  display: flex;
  .left {
    flex: 2;
  }
  .center {
    flex: 6;
    .content {
      display: flex;
      flex-wrap: wrap;
      .topo {
        position: relative;
        width: calc(25% - 20px);
        height: 300px;
        margin: 10px;
        border-radius: 2px;
        background-color: #fff;

        .image {
          padding: 10px 10px 15px 10px;
          text-align: center;
          height: 185px;
          border-bottom: 1px solid #f7f7f7;
          cursor: pointer;

          img {
            height: 100%;
            max-width: 100%;
          }
        }

        .title {
          padding-left: 10px;
          font-size: 16px;
          line-height: 24px;
          height: 24px;
          cursor: pointer;
        }

        .desc {
          padding-left: 10px;
          font-size: 12px;
          line-height: 16px;
          height: 32px;
        }

        .iconfont {
          font-size: 16px;
        }

        textarea {
          &.input {
            min-width: 30px;
            width: 100%;
            max-width: 100%;
            font-size: 10px;
            padding: 2px 5px;
            resize: none;
          }
        }

        .icon-delete {
          position: absolute;
          top: 5px;
          right: 1px;
        }
        .message {
          padding-left: 10px;
          padding-right: 10px;
          display: flex;
          justify-content: space-between;
          .user {
            span {
              vertical-align: middle;
              padding-left: 4px;
            }
            img {
              display: inline-block;
              vertical-align: middle;
            }
          }
          .userLove {
            .zan,
            .collect {
              margin-right: 15px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .right {
    flex: 2;
  }
}
</style>
