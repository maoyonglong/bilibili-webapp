import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginState: false,
    searchText: '',
    searchNavActiveIdx: 0
  },
  actions: {
    searchText ({ commit }, payload) {
      commit('searchText', payload)
    },
    searchNavActiveIdx ({ commit }, payload) {
      commit('searchNavActiveIdx', payload)
    }
  },
  mutations: {
    searchText (state, payload) {
      state.searchText = payload
    },
    searchNavActiveIdx (state, payload) {
      state.searchNavActiveIdx = payload
    }
  }
})

export default store
