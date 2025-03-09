import {
  getModalityProcedureListById,
  getInstitutionList,
  getPersonalSetting,
  getEmployeeDataByType,
  savePersonalSetting,
  getPhraseData,
  getFailImageReason,
} from "@/assets/service/dataManager.js";
import {router} from "../router.js";
import moment from "moment";

export default {
  getProcedureData({ commit }, id) {
    getModalityProcedureListById(id).then(({ Items }) => {
      commit("updateProcedureData", { type: "list", key: id, list: Items.map(({ No, Name }) => ({ text: Name, value: No })) });
    });
  },
  action_InstitutionList({ commit }) {
    getInstitutionList().then(({ Items }) => {
      commit(
        "GET_INSTITUTIONLIST",
        Items.map(({ Id, Name }) => ({ text: Name, value: "" + Id }))
      );
    });
  },
  async action_updatePrivatePhrase({ commit }, employeeId) {
    // const _public = await getPhraseData("")['Items'];
    const convertDataForm = ({ Items }) =>
      Items.map((s) => ({
        ...s,
        UPDATEDTTM: moment(s.UPDATEDTTM).format("YYYY-MM-DD HH:mm:ss"),
      }));

    commit(
      "SET_PRIVATE_PHRASE",
      convertDataForm(await getPhraseData(`?employeeNo=${employeeId}`)).sort((a, b) =>
        a.PhraseCode < b.PhraseCode || (a.PhraseCode === b.PhraseCode && a.PhraseOwnerNo === employeeId) ? -1 : 1
      )
    );
  },
  async action_getPhrase({ commit, state }, physicianId) {
    // const _public = await getPhraseData("")['Items'];
    const convertDataForm = ({ Items }) =>
      Items.map((s) => ({
        ...s,
        UPDATEDTTM: moment(s.UPDATEDTTM).format("YYYY-MM-DD HH:mm:ss"),
      }));

    commit("SET_PUBLIC_PHRASE", convertDataForm(await getPhraseData("")));
    const apiId = router.currentRoute.name === "FI0301" || router.currentRoute.name === "FI0302"
      ? state.Profile4User.id 
      : physicianId 
        ? physicianId 
        : state.Profile4User.id;

    commit(
      "SET_PRIVATE_PHRASE",
      convertDataForm(await getPhraseData(`?employeeNo=${apiId}`)).sort((a, b) =>
        a.PhraseCode < b.PhraseCode || (a.PhraseCode === b.PhraseCode && a.PhraseOwnerNo === apiId) ? -1 : 1
      )
    );
  },
  action_savingPersonalSetting({ state }) {
    const { id, setting } = state.Profile4User;
    if (id && id != "admin") savePersonalSetting(id, { ...setting });
  },
  async action_getIssueDoctors({ commit, state }) {
    const { result } = await getEmployeeDataByType("21");
    commit("SET_ISSUE_DR", result);
  },
  async action_getFailImage({ commit }){
    const result = await getFailImageReason();
    commit("SET_FAIL_IMAGE", result);
  } 
};
