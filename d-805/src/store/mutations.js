import * as configs from "@/config";
import {
  getActionReportRelease,
} from "@/assets/service/dataManager.js";
import {router} from "../router.js";
// import VueJwtDecode from "vue-jwt-decode";

export default {
  UserAuthorized(state, x) {
    // x.functions.push("FI0310")

    console.log(`UserAuthorized: `, x);

    x.id === "admin" && x.functions.push("FI0102");
    //員工的ID 藏在Token內
    state.Profile4User.id = x.id;
    //ex:放射師、護理師、主治醫師等等[代號]...
    state.Profile4User.staffType = x.staffType;
    //ex:放射師、護理師、主治醫師等等[名稱]...
    state.Profile4User.staffName = x.staffName;
    //科別代號
    state.Profile4User.institution = x.institution;
    //員工名稱
    state.Profile4User.employeeName = x.employeeName;
    
    //解Token
    // let tokenData = VueJwtDecode.decode(x.token);
    state.Profile4User.RoleID = x.RoleID;
    state.Profile4User.Authorized = true;
    //可以使用的哪些功能
    state.Profile4User.functions = x.functions;
    
    //Token
    state.Profile4User[configs.JWTTokenName] = x.token;
    //to localStorage token
    localStorage.setItem('token', x.token);

  },
  async UserLogout(state) {

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
    
    state.Profile4User.setting = null;
    state.modalities = [];

    state.isBackFromReport = false;
    state.isBackFromReportItems = {};

    if(router.currentRoute.name === "FI0301"){

      state.finalRelease = true

      if(state.finalAccessionNo){
        try {
          await getActionReportRelease(state.finalAccessionNo)
        } catch (err) {
          console.log(`error: `, err)
        }
      }

    }

    console.log(`router: `, router)
    
    //remove localStorage token
    if(localStorage['token']){
      localStorage.removeItem('token')
    }

    // const resLogout = await window.axios.post("/auth/Logout")
    // if(resLogout){
    //   console.log(`logouted ~`, resLogout)
    // }

  },
  setAuthState(state, bool) {
    state.Profile4User.Authorized = bool;
  },
  setAuthToken(state, token) {
    state.Profile4User[configs.JWTTokenName] = token;
  },
  updateProcedureData(state, data) {
    state.procedureData[data.type][data.key] = data.list;
  },
  clearProcedureData(state) {
    state.procedureData = {
      class: {},
      list: {},
    };
  },
  setLoginStatus(state, status) {
    state.isLogin = status;
  },
  setLoadingStatus(state, status) {
    state.isLoadingState = status;
  },
  ADD_TEMPITEMS(state, items) {
    state.tempItemList.push(items);
  },
  UPDATE_TEMPITEMS(state, data) {
    const newTmpList = [...state.tempItemList];
    newTmpList[data.index] = data.report;
    state.tempItemList = newTmpList;
  },
  CLEAR_TEMPITEMS(state) {
    state.tempItemList = [];
  },
  DELETE_TEMPITEMS(state, index) {
    state.tempItemList.splice(index, 1);
  },
  ADD_REPORTITEMS(state, item) {
    state.reportItemList.push(item);
  },
  UPDATE_REPORTITEMS(state, data) {
    const newRepList = [...state.reportItemList];
    newRepList[data.index] = data.report;
    state.reportItemList = newRepList;
  },
  DELETE_REPORTITEMS(state, index) {
    state.reportItemList.splice(index, 1);
  },
  GET_INSTITUTIONLIST(state, data) {
    state.institutionList = data;
  },
  SET_SETTING(state, setting) {
    state.Profile4User.setting = setting;
  },
  SET_THEME(state, color) {
    state.Profile4User.setting = { ...state.Profile4User.setting, theme: color };
    // state.Profile4User.setting["theme"] = color;
    // state.Profile4User.theme = color;
  },
  SET_REPO(state, repo) {
    state.Profile4User.setting = { ...state.Profile4User.setting, repo: repo };
  },
  SET_PACAUTO(state, pacauto) {
    state.Profile4User.setting = { ...state.Profile4User.setting, pacauto: pacauto };
  },
  SET_SAVEAUTO(state, saveauto) {
    state.Profile4User.setting = { ...state.Profile4User.setting, saveauto: saveauto };
  },
  SET_OBJAUTO(state, objauto) {
    state.Profile4User.setting = { ...state.Profile4User.setting, objauto: objauto };
  },
  SET_MPHRASE(state, mphrase) {
    state.Profile4User.setting = { ...state.Profile4User.setting, mphrase: mphrase };
  },
  SET_SIDE_MESSAGE(state, { msg, type = null }) {
    // if (typeof state.rightSideMessage === "object") state.rightSideMessage = [];
    if (!Array.isArray(state.rightSideMessage)) state.rightSideMessage = [];
    state.rightSideMessage.push({ msg, type });
  },
  CLEAR_SIDE_MESSAGE(state, { msg, type }) {
    state.rightSideMessage = state.rightSideMessage.filter((item) => item.msg != msg && item.type != type);
  },
  SHOW_LOADING(state, msg = "") {
    state.showLoading = msg;
  },
  HIDE_LOADING(state) {
    state.showLoading = null;
  },
  SET_REPORT_DR(state, Items) {
    state.doctors.report = Items;
  },
  SET_LIST_DR(state, Items) {
    // 設定審核醫師
    state.doctors.listPhysician = Items;
  },
  SET_ISSUE_DR(state, Items) {
    // 設定審核醫師
    state.doctors.issuePhysician = Items;
  },
  SET_DX_DR(state, Items) {
    // 設定分派醫師
    state.doctors.dxPhysician = Items;
  },
  SET_SCHEDULE_DR(state, Items) {
    state.doctors.schedule = Items;
  },
  CLEAR_DOCTORS(state) {
    Object.keys(state.doctors).forEach((key) => {
      state.doctors[key] = [];
    });
  },
  SET_ATTENDING_DR(state, Items) {
    state.attendingDrs = Items;
  },
  CLEAR_ATTENDING_DR(state) {
    state.attendingDrs = [];
  },
  SET_PRIVATE_PHRASE(state, phrase) {
    state.phrase.private = phrase;
  },
  SET_PUBLIC_PHRASE(state, phrase) {
    state.phrase.public = phrase;
  },
  CLEAR_PHRASE(state) {
    state.phrase.private = [];
    state.phrase.public = [];
  },
  SET_HOTKEY(state, settings) {
    state.Profile4User.setting.Setting = settings;
  },
  SET_MODALITIES(state, items) {
    state.modalities = items;
  },
  CLEAR_MODALITIES(state) {
    state.modalities = [];
  },
  SET_PATIENT_SOURCE_LIST(state, Items) {
    state.patientSourceList = Items;
  },
  SET_SERVICE_SOURCE_LIST(state, Items) {
    state.serviceSourceList = Items;
  },
  SET_LOCATION_LIST(state, { key, items }) {
    state.locationList[key] = items;
  },
  CLEAR_LOCATIONLIST(state) {
    state.locationList = {
      id: [],
      no: [],
    };
  },
  SET_RADIOGRAPHER(state, items) {
    state.radiographer = items;
  },
  SET_RADIOGRAPHER_BRIEF(state, items) {
    state.radiographerBrief = items;
  },
  SET_NURSES(state, items) {
    state.nurses = items;
  },
  SET_REPORT_TOGGLE(state, { key, value }) {
    const newReportToggle =
      state.Profile4User.setting && state.Profile4User.setting.reportToggle
        ? state.Profile4User.setting.reportToggle
        : {
            navigation: true,
            patientDetail: true,
            reportDetail: true,
          };
    newReportToggle[key] = value;
    state.Profile4User.setting = { ...state.Profile4User.setting, reportToggle: newReportToggle };
    this.dispatch("action_savingPersonalSetting");
  },
  SET_SEARCHREPORT_FIELDS(state, searchReportField) {
    state.Profile4User.setting = { ...state.Profile4User.setting, searchReportField };
    this.dispatch("action_savingPersonalSetting");
  },
  SET_REPORTLIST_FIELDS(state, reportListField) {
    state.Profile4User.setting = { ...state.Profile4User.setting, reportListField };
    this.dispatch("action_savingPersonalSetting");
  },
  SET_NATIONAL_HOLIDAYS(state, {year, holidays}) {
    state.nationalHolidays[year] = holidays;
  },
  SET_FAIL_IMAGE(state, item) {
    state.failImageData = item;
  },
  CLEAR_FAIL_IMAGE(state) {
    state.failImageData = {};
  },
  SET_REPORT_STATUS(state, item) {
    state.reportStatus = item;
  },
  CLEAR_REPORT_STATUS(state) {
    state.reportStatus = {};
  },
  SET_ISBACK_REPORT(state, isBackFromReport) {
    state.isBackFromReport = isBackFromReport;
  },
  SET_TEMPREPORTCONTENT(state, tempReportContent) {
    state.tempReportContent = tempReportContent;
  },
  SET_TEMPREPORTCOUNT(state, tempReportCount) {
    state.tempReportCount = tempReportCount;
  },
  SET_AUTOREVOKE(state, autoRevoke) {
    state.autoRevoke = autoRevoke;
  },
  SET_AUTOREVOKEACCESSIONNO(state, autoRevokeAccessionNo) {
    state.autoRevokeAccessionNo = autoRevokeAccessionNo;
  },
  SET_TEMPOBJCOUNT(state, tempObjCount) {
    state.tempObjCount = tempObjCount;
  },
  SET_ISBACK_REPORT_ITEMS(state, isBackFromReportItems) {
    state.isBackFromReportItems = isBackFromReportItems;
  },
  SET_FINAL_STATUS(state, finalStatus) {
    state.finalStatus = finalStatus;
  },
  SET_FINAL_ACCESSIONNO(state, finalAccessionNo) {
    state.finalAccessionNo = finalAccessionNo;
  },
  SET_FINAL_RELEASE(state, finalRelease) {
    state.finalRelease = finalRelease;
  },
  CLEAR_ISBACK_REPORT_ITEMS(state) {
    state.isBackFromReportItems = {};
  },
};
