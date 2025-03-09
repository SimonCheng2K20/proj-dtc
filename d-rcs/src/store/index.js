import { createStore } from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import meetingHub from './module/meetingHub.js'
import chatHub from './module/chatHub.js'

const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    meetingHub,
    chatHub,
  },
})

export default store
