import { themes, repo, pacauto, saveauto, objauto, mphrase } from "@/assets/js/common.js";
import * as configs from "@/config";

export const getLoadingStatus = (state) => state.showLoading;

export const getProfile4User = (state) => state.Profile4User;

export const getUserId = (state) => state.Profile4User.id;

export const getUserToken = (state) => state.Profile4User[configs.JWTTokenName]

export const getUserRoleId = (state) => state.Profile4User.staffType;

export const getProfileFunctions = (state) => (state.Profile4User ? state.Profile4User.functions : []);

export const getProfileHotkeySetting = (state) =>
  state.Profile4User && state.Profile4User.setting && state.Profile4User.setting.Setting ? JSON.parse(state.Profile4User.setting.Setting) : [];

export const get_InstitutionList = (state) => state.institutionList;

export const getThemeColors = ({ Profile4User: { setting } }) => {
  return setting && setting["theme"] && themes.hasOwnProperty(setting["theme"]) ? themes[setting["theme"]] : themes["white"]; //預設值
};

export const getREPOValue = ({ Profile4User: { setting } }) => {
  return setting && setting["repo"] && repo ? setting["repo"] : 'Y'; //預設值
};

export const getPacAutoValue = ({ Profile4User: { setting } }) => {
  return setting && setting["pacauto"] && pacauto ? setting["pacauto"] : 'Y'; //預設值
};

export const getSaveAutoValue = ({ Profile4User: { setting } }) => {
  return setting && setting["saveauto"] && saveauto ? setting["saveauto"] : 'Y'; //預設值
};

export const getObjAutoValue = ({ Profile4User: { setting } }) => {
  return setting && setting["objauto"] && objauto ? setting["objauto"] : 'N'; //預設值
};

export const getMphraseValue = ({ Profile4User: { setting } }) => {
  return setting && setting["mphrase"] && mphrase ? setting["mphrase"] : 'N'; //預設值
};

export const getToggleReport = ({ Profile4User: { setting } }) => {
  return setting && setting["reportToggle"]
    ? setting["reportToggle"]
    : {
        navigation: true,
        patientDetail: true,
        reportDetail: true,
      }; //預設值
};

export const getReportDrs = (state) => state.doctors.report.map(({ No, Name }) => ({ text: Name, value: No }));

export const getIssueDrs = (state) => state.doctors.issuePhysician.map(({ No, Name }) => ({ text: Name, value: No }));

export const getDxDrs = (state) => state.doctors.dxPhysician.map(({ No, Name }) => ({ text: Name, value: No })); // 分派醫師

export const getScheduleDrs = (state) => state.doctors.schedule.map(({ Id, Name }) => ({ text: Name, value: Id }));

export const getListDrs = (state) => state.doctors.listPhysician.map(({ No, Name }) => ({ text: Name, value: No }));

export const getModalityOptions = (state) => state.modalities.map((v) => ({ text: v, value: v }));

export const getLocationNoOptions = (state) => state.locationList.no.map(({ No, Name }) => ({ text: Name, value: No }));

export const getLocationIdOptions = (state) => state.locationList.id.map(({ Id, Name }) => ({ text: Name, value: Id }));

export const gPrivatePhrase = (state) => state.phrase.private;

export const gPublicPhrase = (state) => state.phrase.public;

export const getIsBackFromReport = (state) => state.isBackFromReport;

export const getTempReportContent = (state) => state.tempReportContent;

export const getTempReportCount = (state) => state.tempReportCount;

export const getTempObjCount = (state) => state.tempObjCount;

export const getIsBackFromReportItems = (state) => state.isBackFromReportItems;

export const getFinalStatus = (state) => state.finalStatus;

export const getFinalAccessionNo = (state) => state.finalAccessionNo;

export const getFinalRelease = (state) => state.finalRelease;

export const getAutoRevoke = (state) => state.autoRevoke;

export const getAutoRevokeAccessionNo = (state) => state.autoRevokeAccessionNo;
