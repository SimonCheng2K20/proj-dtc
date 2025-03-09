export default {
  m_setDeviceMode(state, value) {
    state.isMobile = value;
  },
  m_setLoadingStatus(state, value) {
    state.isLoading = value;
  },
  m_setDialog(state, { show = false, title = "", content = "" }) {
    state.dialog.title = title;
    state.dialog.content = content;
    state.dialog.show = show;
  },
  m_setAuthData(state, data) {
    Object.keys(state.dakar).forEach((key) => {
      state.dakar[key] = data[key];
    });
    // sessionStorage.setItem('dakar', JSON.stringify(state.dakar));
    sessionStorage.setItem("token", state.dakar.Token);
  },
  m_setOthersData(state, data) {
    Object.keys(data).forEach((key) => {
      state.others[key] = data[key];
    });
  },
  m_setLogout(state) {
    // Object.keys(store).forEach((key) => {
    //   store[key] = [];
    // });

    // 清除sessionStorage
    sessionStorage.clear();
  },
  m_setFunctionList(state, list) {
    state.functions = list;
    // sessionStorage.setItem('functions', JSON.stringify(list));
  },
  m_setEditItem(state, value) {
    state.editItem = value;
  },
  m_setDiagnosisPatient(state, value = null) {
    state.diagnosisPatient = value;
  },
  m_addStatusChangeList(state, eventObj = null) {
    if (typeof eventObj !== "object") return;
    Object.entries(eventObj).forEach(([key, event]) => {
      if (!state.statusChangeEvents.hasOwnProperty(key)) {
        state.statusChangeEvents[key] = event;
      }
    });
  },
  m_removeStatusChangeList(state, key) {
    if (state.statusChangeEvents.hasOwnProperty(key))
      delete state.statusChangeEvents[key];
  },
  m_setNoticeLogin(state) {
    state.checkIsLogin += 1;
  },
  m_setHasClickNotify(state, value) {
    state.hasClickNotify = value;
  },
  m_setMedicalCardData(state, value) {
    state.medicalCardData = value;
  },
  m_setToDefaultData(state, value) {
    state.isMobile = false;
    state.isLoading = false;
    state.dialog = {
      show: false,
      title: "",
      content: "",
    };
    state.dakarModel = false;
    state.dakar = {
      Name: "",
      No: "",
      Token: "",
      RoleNos: [],
      Identities: null,
      FunctionNos: [],
      PartnerHospitals: null,
      ResponsibilityHospitals: null,
      IsAirReferralUser: false,
      IsFirstLogin: false,
      AppServer: "",
    };
    state.others = {};
    state.functions = [];
    state.isShowPwdDialog = false;
    state.diagnosisPatient = null;

    state.checkIsLogin = 0;
    state.editItem = {};

    //notify
    state.hasClickNotify = false;

    //mediacalCard
    state.medicalCardData = "";
  },
  m_setSearchFilter(state, value) {
    state.setSearchFilter = value
  },
  m_setSearchFilterDefault(state) {
    state.setSearchFilter = {
      ApplyTimeStart: null,
      ApplyTimeEnd: null,
      InstitutionNo: null,
      "CreateAccount/Name": null,
      patientName: null,
      patientIdentifier: null,
      Status: [],
    }
  },
};
