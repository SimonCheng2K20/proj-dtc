import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isMobile: false,
    isLoading: false
  },
  mutations: {
    m_setIsMobile(state, mode) {
      state.isMobile = mode;
    },
    m_setLoadingStatus(state, status) {
      state.isLoading = status;
    }
  },
  actions: {},
  modules: {}
});
