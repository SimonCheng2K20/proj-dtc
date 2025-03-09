import Vue from 'vue'
import Vuex from 'vuex'
import api from '../assets/js/api.js'
import global from '../assets/js/global.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:false,
    routerPath:null,
    userData:null,
    statusList:null,
    medicalRecordList:null,
    categoryList:null,
    patientList:null,
    quickSearchList:null,
    functionList:null
  },
  mutations: {
    loading(state, x) {
      state.loading = x
    },
    routerPath(state, x) {
      state.routerPath = x
    },
    userData(state, x) {
      let data=x
      let showButton= {
        IsBrowse:x.RoleNos.filter(r=>r.IsBrowse).length ? true:false,
        IsDocCategory:x.RoleNos.filter(r=>r.IsDocCategory).length ? true:false,
        IsEmail:x.RoleNos.filter(r=>r.IsEmail).length ? true:false,
        IsModify:x.RoleNos.filter(r=>r.IsModify).length ? true:false,
        IsPrint:x.RoleNos.filter(r=>r.IsPrint).length ? true:false
      }
      data.showButton=showButton
      state.userData = data
      localStorage.token=x.Token
    },
    statusList(state, x) {
      state.statusList = x
    },
    medicalRecordList(state, x) {
      state.medicalRecordList = x
    },
    categoryList(state, x) {
      state.categoryList = x
    },
    patientList(state, x) {
      state.patientList = x
    },
    quickSearchList(state, x) {
      state.quickSearchList = x
    },
    functionList(state, x) {
      state.functionList = x
    }
  },
  actions: {
    async getInit(context) {
      if(!context.state.statusList) context.commit('statusList',await api.getStatusList())
      if(!context.state.medicalRecordList) context.commit('medicalRecordList',await api.getFolder().then(res=>global.treeToArr(global.arrToTree(res.Items))))
      if(!context.state.categoryList) context.commit('categoryList',await api.getDocCategory().then(res=>global.treeToArr(global.arrToTree(res.Items))))
      if(!context.state.patientList) context.commit('patientList',await api.getPatient().then(res=>res.Items))
      if(!context.state.quickSearchList) context.commit('quickSearchList',await api.getQuickSearch().then(res=>res.Items))
      if(!context.state.functionList) context.commit('functionList',await api.getFunction().then(res=>res.Items))
    }
  },
  getters: {
    statusListObj(state) {
      return global.arrToObj(state.statusList,'Id')
    },
    medicalRecordListObj(state) {
      return global.arrToObj(state.medicalRecordList,'Id')
    },
    categoryListObj(state) {
      return global.arrToObj(state.categoryList,'Id')
    },
    patientListObj(state) {
      return global.arrToObj(state.patientList,'PatientId')
    },
  },
  modules: {
  }
})
