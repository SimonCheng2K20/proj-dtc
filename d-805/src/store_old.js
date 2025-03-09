/* eslint-disable no-console */

import * as configs from "@/config";
import VueJwtDecode from "vue-jwt-decode";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import { getModalityProcedureListById } from "@/assets/service/dataManager.js";
var ls = new SecureLS({
  isCompression: false
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
      timeoutID: ""
      //Axios Token Timeo
    },
    procedureData: {
      class: {},
      list: {}
    },
    isLogin: false,
    dateRange: ["", ""]
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    })
  ],
  mutations: {
    [configs.XUserAuthorized](state, x) {
      // console.log(x);
      x.id === "admin" && x.functions.push("FI0102");
      //員工的ID 藏在Token內
      state.Profile4User.id = x.id;
      //ex:放射師、護理師、主治醫師等等[代號]...
      state.Profile4User.staffType = x.staffType;
      //ex:放射師、護理師、主治醫師等等[名稱]...
      state.Profile4User.staffName = x.staffName;
      //員工名稱
      state.Profile4User.employeeName = x.employeeName;
      //解Token
      let tokenData = VueJwtDecode.decode(x.token);
      console.log(tokenData);
      state.Profile4User.RoleID = x.RoleID;
      state.Profile4User.Authorized = true;
      //可以使用的哪些功能
      state.Profile4User.functions = x.functions;
      //Token
      state.Profile4User[configs.JWTTokenName] = x.token;
      console.log(state.Profile4User);
    },
    UserLogout(state) {
      state.Profile4User.Authorized = false;
      //員工的帳號 藏在Token內
      state.Profile4User.id = "";
      //ex:放射師、護理師、主治醫師等等[代號]...
      state.Profile4User.staffType = "";
      //ex:放射師、護理師、主治醫師等等[名稱]...
      state.Profile4User.staffName = "";
      state.Profile4User.employeeName = "";
      //解Token
      state.Profile4User.RoleID = "";
      //可以使用的哪些功能
      state.Profile4User.functions = [];
      //Token
      state.Profile4User[configs.JWTTokenName] = "";
    },
    updateProcedureData(state, data) {
      state.procedureData[data.type][data.key] = data.list;
    }
  },
  actions: {
    getProcedureData({ commit }, id) {
      getModalityProcedureListById(id).then(({ Items }) => {
        commit("updateProcedureData", { type: "list", key: id, list: Items.map(({ No, Name }) => ({ text: Name, value: No })) });
      });
    }
  }
});
