import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 一级路由
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('../views/index.vue'),
    children: [{
      path: '', // 什么都不写 就默认是二级路由组件的
      meta: {
        keepAlive: true,
        ifDoFresh: true // 是否刷新
      },
      component: Home // 默认二级路由
    },
    {
      path: '/topology',
      name: 'topology',
      // meta: {
      //   keepAlive: false,
      //   ifDoFresh: true // 是否刷新
      // },
      component: () => import('../views/topology.vue')
    }
    ]
  }]

const router = new VueRouter({
  routes
})

export default router
