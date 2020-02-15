import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      name: ''
    }
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    }
  },
  actions: {
    setCurrentUser ({ commit }, user) {
      commit('setCurrentUser', user)
    }
  },
  modules: {
  }
})
