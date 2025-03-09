import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/assets/js/api.js'
import global from '@/assets/js/global.js'

Vue.use(Vuex)

const getInitState = () => ({
  loading: false,
  routerPath: null,
  permissions: ['admin', 'user'],
  userData: {
    No: null,
    Name: null,
    Identifier: null,
    AutoSignature: false,
    FunctionNos: [],
    RoleNos: [],
    Token: null,
    IsFirstLogin: null,
    IsRecordManager: false,
  },
  lendingClass: null,
  overTimeReason: null,
  patientClass: null,
  sheetEventClass: null,
  statusList: null,
  roleList: null,
  deptList: null,
  sheetTypeList: null,
  sheetIndex: null,
  typeList: null,
  signature: null,
  sheetArchiveStatus: {
    OverTime: null,
    OnTime: null,
  },
  cardInfo: {
    Id: null,
    Name: null,
    Connect: false,
  },
})

export default new Vuex.Store({
  state: getInitState(),
  mutations: {
    loading(state, x) {
      state.loading = x
    },
    routerPath(state, x) {
      state.routerPath = x
    },
    userData(state, userData) {
      Object.assign(state.userData, userData)
    },
    lendingClass(state, x) {
      state.lendingClass = x
    },
    overTimeReason(state, x) {
      state.overTimeReason = x
    },
    patientClass(state, x) {
      state.patientClass = x
    },
    sheetEventClass(state, x) {
      state.sheetEventClass = x
    },
    statusList(state, x) {
      state.statusList = x
    },
    roleList(state, x) {
      state.roleList = x
    },
    deptList(state, x) {
      state.deptList = x
    },
    sheetTypeList(state, x) {
      state.sheetTypeList = x
    },
    sheetIndex(state, x) {
      state.sheetIndex = x
    },
    typeList(state, x) {
      state.typeList = x
    },
    setSignature(state, signature) {
      state.signature = signature
    },
    setSheetArchiveStatus(state, status) {
      Object.assign(state.sheetArchiveStatus, status)
    },
    cardInfo(state, cardData) {
      Object.assign(state.cardInfo, cardData)
    },
    reset(state) {
      Object.assign(state, getInitState())
    },
  },
  actions: {
    async getInit(context) {
      if (!context.state.typeList) context.commit('typeList', await api.getAuditEventTypes())
      if (!context.state.lendingClass)
        context.commit('lendingClass', await api.getLendingClass().then((res) => res.Items))
      if (!context.state.overTimeReason)
        context.commit('overTimeReason', await api.getOverTimeReason().then((res) => res.Items))
      if (!context.state.patientClass)
        context.commit('patientClass', await api.getPatientClass().then((res) => res.Items))
      if (!context.state.sheetEventClass)
        context.commit('sheetEventClass', await api.getSheetEventClass().then((res) => res.Items))
      if (!context.state.statusList) context.commit('statusList', await api.getAccountStatusList())
      if (!context.state.roleList) context.commit('roleList', await api.getRole().then((res) => res.Items))
      if (!context.state.deptList) context.commit('deptList', await api.getDeptList())
      if (!context.state.sheetTypeList) context.commit('sheetTypeList', await api.getSheetTypeNoList())
      //if(!context.state.sheetIndex) context.commit('sheetIndex',await api.getAllPatient().then(res=>res.Items))
    },
  },
  modules: {},
  getters: {
    permissions(state) {
      let res = {}
      for (let item of state.permissions) {
        res[item] = true
      }
      return res
    },
    lendingClassObj(state) {
      return global.arrToObj(state.lendingClass, 'LendingClassOid')
    },
    overTimeReasonObj(state) {
      return global.arrToObj(state.overTimeReason, 'Oid')
    },
    patientClassObj(state) {
      return global.arrToObj(state.patientClass, 'PatientClassOid')
    },
    sheetEventClassObj(state) {
      return global.arrToObj(state.sheetEventClass, 'SheetEventClassOid')
    },
    statusListObj(state) {
      return global.arrToObj(state.statusList, 'Id')
    },
    roleListObj(state) {
      return global.arrToObj(state.roleList, 'No')
    },
    deptListObj(state) {
      return global.arrToObj(state.deptList, 'No')
    },
    sheetTypeListObj(state) {
      return global.arrToObj(state.sheetTypeList, 'No')
    },
    sheetIndexObj(state) {
      return global.arrToObj(state.sheetIndex, 'ChartNo')
    },
    sheetIndexOidObj(state) {
      return global.arrToObj(state.sheetIndex, 'SheetIndexOid')
    },
    typeListObj(state) {
      return global.arrToObj(state.typeList, 'Id')
    },
  },
})
