import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: {
      scale: 1,
      lineName: 'curve',
      fromArrowType: '',
      toArrowType: 'triangleSolid',
      locked: 0
    },
    event: {
      name: '',
      data: null
    }
  },
  mutations: {
    data (state, data) {
      state.data = data
    },
    emit (state, event) {
      state.event = event
      state.data[event.data.key] = event.data.value
    }
  },
  actions: {
  },
  modules: {
  }
})
