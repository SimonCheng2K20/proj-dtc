/* eslint-disable no-console */

import * as configs from "@/config";
// import VueJwtDecode from "vue-jwt-decode";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

import mutations from "./mutations";
import actions from "./actions";
import * as getters from "./getters";

var ls = new SecureLS({
  isCompression: false,
});
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Profile4User: {
      //員工的帳號 藏在Token內
      id: "",
      //ex:放射師、護理師、主治醫師等等代號...
      staffType: "",
      //ex:放射師、護理師、主治醫師等等名稱...
      staffName: "",
      //員工的名稱
      employeeName: "",
      //該登入者具有那些身分的權限 藏在Token內的role
      RoleID: [],
      Authorized: false,
      //可以使用的哪些功能
      functions: [],
      //Token 藏有
      [configs.JWTTokenName]: null,
      ActionTime: null,
      timeoutID: "",
      theme: "white",
      setting: null,
      institution: "",
      //Axios Token Timeo
    },
    procedureData: {
      class: {},
      list: {},
    },
    isLogin: false,
    showLoading: null,
    dateRange: ["", ""],
    tempItemList: [],
    reportItemList: [],
    institutionList: [],
    locationList: {
      id: [],
      no: [],
    },
    patientSourceList: [],
    serviceSourceList: [],
    radiographer: [],
    radiographerBrief: {},
    nurses: [],
    rightSideMessage: [],
    modalities: [],
    doctors: {
      report: [], // 報告醫師
      issuePhysician: [], // 審核醫師
      dxPhysician: [], // 分派醫師
      listPhysician: [],
      schedule: [],
    },
    attendingDrs: [],
    phrase: {
      private: [],
      public: [],
    },
    nationalHolidays: {},
    failImageData: {},
    reportStatus: {},
    tempReportContent: null,
    tempReportCount: 0,
    tempObjCount: 0,
    isBackFromReport: false,
    isBackFromReportItems: {},
    finalStatus: null,
    finalAccessionNo: null,
    finalRelease: false,
    autoRevoke: false,
    autoRevokeAccessionNo: null,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
  mutations,
  actions,
  getters,
});
