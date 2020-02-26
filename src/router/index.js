import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  meta: {
    keepAlive: true,
    ifDoFresh: true // 是否刷新
  },
  component: Home
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

const router = new VueRouter({
  routes
})

export default router
