import store from '@/store'
import axios from 'axios'
import router from '@/router'
import ajax from './ajax.js'

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/rmeeting' : '/',
  timeout: 720 * 1000,
})

api.interceptors.request.use(
  (config) => {
    const token = window.sessionStorage.getItem('token')
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    if (error.response.status === 401) {
      if (router.currentRoute.value.name !== 'Auth') {
        sessionStorage.clear()
        store.commit('m_setToDefaultData')
        store.commit('m_setDialog', {
          show: true,
          title: '系統資訊',
          content: error.response.data || `連線逾時，請重新登入`,
        })

        router.replace({ name: 'Auth' }) // 錯誤狀態是 401 且 不在登錄頁 則導到登入頁
      }
    }

    return Promise.reject(error.response)
  }
)

export const authLogin = (body) => api.post('/Auth/Login', body)
export const authLogout = (body) => api.post('/Auth/Logout', body)
export const authUnlock = (userName) => api.put(`/Auth/Unlock?userName=${userName}`)

export const getCaptcha = () => api.get(`/Auth/GetCaptcha?length=4`)

export const getGetIdentifier = (query) => api.get(`/Auth/GetIdentifier${query}`)

export const getAuditEventTypes = () => api.get('/AuditEvent/AuditEventTypes')

export const postUserRegister = (body) => api.post('/Auth/Register', body)

//機構維護作業
export const getInstitutionList = (query = '') => api.get(`/api/Institution${query}`)
export const putInstitutionList = (body) => api.put('/api/Institution', body)
export const postInstitutionList = (body) => api.post('/api/Institution', body)
export const deleteInstitutionList = (id) => api.delete(`/api/Institution/${id}`)

export const setRelations = (data) =>
  ajax({
    url: '/institution/SetRelations',
    method: 'post',
    data,
    isLoading: true,
    showDialog: false,
  })

export const getInstitutionNos = (qs) => ajax({ url: '/institution/SelectNoList' + qs })

export const getInstitutionGroups = (id) => ajax({ url: '/institution/ManageNetGroupIds?institutionNo=' + id })

export const addInstitutionGroup = (data) =>
  ajax({
    url: '/institution/AddNetGroup',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const removeInstitutionGroup = (data) =>
  ajax({
    url: '/institution/RemoveManageNetGroup',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

//網絡維護
export const getSingleNetGroup = (id) => ajax({ url: `/api/NetGroup/${id}` })

export const getNetGroup = (qs) => ajax({ url: '/api/NetGroup' + qs })

export const putNetGroup = (data) =>
  ajax({
    url: '/api/NetGroup',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postNetGroup = (data) =>
  ajax({
    url: '/api/NetGroup',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteNetGroup = (id) =>
  ajax({
    url: `/api/NetGroup/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

//帳號管理維護作業
//no filtered
export const getAccountListAll = (qs) => ajax({ url: '/Account/AllList' + qs })

//filtered
export const getAccountList = (qs) => ajax({ url: '/api/Account' + qs })

export const putAccountList = (data) =>
  ajax({
    url: '/api/Account',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postAccountList = (data) =>
  ajax({
    url: '/api/Account',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteAccountList = (id) =>
  ajax({
    url: `/api/Account/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

export const getDakarById = (id) => ajax({ url: '/api/Account/' + id })

export const getDakarByIds = (id) => {
  const ids = []
    .concat(id)
    .map((id, index) => `key${index + 1}(${id})`)
    .join(',')
  return ajax({
    url: `/api/Account/${ids}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })
}

export const getRoleSelectNos = (qs) => ajax({ url: '/Role/SelectNoList' + qs })

export const getAccountStatusNos = () => ajax({ url: `/Account/StatusList` })

export const resetPassword = (id) =>
  ajax({
    url: `/Auth/ResetPassword?userName=${id}`,
    method: 'put',
    isLoading: true,
    showDialog: false,
  })

export const changePassword = (data) =>
  ajax({
    url: `/Auth/ChangePassword`,
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

// 角色管理作業
export const getRole = (query) => api.get(`/api/Role${query}`)
export const getRoleItem = (id) => api.get(`/api/Role/${id}`)
export const postRoleItem = (body) => api.post(`/api/Role`, body)
export const putRoleItem = (body) => api.put(`/api/Role`, body)
export const deleteRoleItem = (id) => api.delete(`/api/Role/${id}`)
export const getRoleFunctionNos = (query) => api.get(`Role/FunctionNos${query}`)
export const addRoleFunction = (body) => api.post(`/Role/AddFunction`, body)
export const removeRoleFunction = (body) => api.post(`/Role/RemoveFunction`, body)

export const getRoleList = (qs) => ajax({ url: '/api/Role' + qs })

export const putRoleList = (data) =>
  ajax({
    url: '/api/Role',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postRoleList = (data) =>
  ajax({
    url: '/api/Role',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteRoleList = (id) =>
  ajax({
    url: `/api/Role/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

//使用目的角色
export const getReasonRoleList = (qs = null) => ajax({ url: '/Role/ReasonRoleList' + qs })

//稽核記錄作業
export const getAuditList = (qs) => ajax({ url: '/AuditEvent/AuditEvent' + qs })

export const getAuditType = (qs) => ajax({ url: '/AuditEvent/AuditEventTypes' + qs })

// Function 作業API
const functionUrlStr = '/api/Function'

export const getFunctionList2 = (qs) => ajax({ url: functionUrlStr + qs })

export const getFunction = (query) => api.get(`/api/Function${query}`)
export const getFunctionItem = (id) => api.get(`/api/Function/${id}`)
export const postFunctionItem = (body) => api.post(`/api/Function`, body)
export const putFunctionItem = (body) => api.put(`/api/Function`, body)
export const deleteFunctionItem = (id) => api.delete(`/api/Function/${id}`)
export const getFunctionSelectList = () => api.get(`Function/SelectNoList`)

export const getFunctionList = (params = '') => ajax({ url: `${functionUrlStr}${params ? '?' + params : ''}` })

export const addFunctionItem = (data) =>
  ajax({
    url: `${functionUrlStr}`,
    method: 'post',
    data,
    isLoading: true,
    showDialog: true,
  })

export const modifyFunctionItem = (data) =>
  ajax({
    url: `${functionUrlStr}`,
    method: 'put',
    data,
    isLoading: true,
    showDialog: true,
  })

export const removeFunctionItem = (id) =>
  ajax({
    url: `${functionUrlStr}/${id}`,
    method: 'delete',
    isLoading: true,
    showDialog: true,
  })

// 會診記錄
export const getSheetList = (qs) => ajax({ url: '/Sheet/List' + qs })

export const getUnRecords = (qs) => ajax({ url: '/Sheet/GetUnRecords' })

export const getNotify = (qs) => ajax({ url: '/Sheet/Notify' })

export const getSheetLog = (qs) => ajax({ url: '/Sheet/GetMeetLogs' + qs })

export const getSheetPdf = (qs) => ajax({ url: '/Sheet/Export' + qs })

export const getSheetExcel = (query) => api.get(`/Sheet/ExportOds${query}`, { responseType: 'blob' })

export const postSaveRecord = (data) => ajax({ url: '/Sheet/SaveRecord', method: 'post', data })

export const addSheet = (data) =>
  ajax({
    url: 'Sheet/Create',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
    // successMessage: "新增會診資料成功",
  })

export const leaveMeet = (id) =>
  ajax({
    url: '/Sheet/LeaveTheMeeting?id=' + id,
    method: 'post',
    isLoading: false,
    showDialog: false,
  })

export const addQuickSheet = (data = null) =>
  ajax({
    url: 'Sheet/QuickCreate',
    method: 'post',
    data,
    // successMessage: "新增會診資料成功",
  })

export const saveingSheet = (data) =>
  ajax({
    url: '/Sheet/Save',
    data,
    method: 'post',
    isLoading: true,
    showDialog: true,
  })

export const deleteSheet = (id) =>
  ajax({
    url: `/Sheet/Delete/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

// --------- sheet api---------
export const getSheetAssistLink = (id) =>
  ajax({
    url: `/Sheet/CreateAssistLink?id=${id}`,
    isLoading: false,
    showDialog: true,
  })

export const getSheetById = (id) => ajax({ url: `/Sheet/get?id=${id}`, isLoading: false, showDialog: true })

// 會診單號
export const getPaceUrlById = (id) => ajax({ url: `/Sheet/GetPacs?id=${id}`, isLoading: true, showDialog: true })

// 會診單號
export const getMeetUrlById = (id) => ajax({ url: `/Sheet/GetMeet?id=${id}`, isLoading: false, showDialog: true })
export const addAttach = (data) =>
  ajax({
    url: '/Attach/Upload',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteAttach = (id) =>
  ajax({
    url: `/Attach/Delete/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

export const getIcd10ListByKeyword = (keyword) => {
  const _params = ['Icd10', 'Icd9', 'Cht', 'Eng'].map((Name) => `contains(tolower(${Name}),'${keyword.toLowerCase()}')`).join(' or ')
  return ajax({ url: `/Icd10/Find?$filter=(${_params})&$top=100` })
}

export const getIcd10 = (query) => ajax({ url: `/Icd10/Find${query}` })

//HIS主機管理作業
export const getHisList = (qs) => ajax({ url: '/api/HisSetting' + qs })

export const putHisList = (data) =>
  ajax({
    url: '/api/HisSetting',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postHisList = (data) =>
  ajax({
    url: '/api/HisSetting',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteHisList = (id) =>
  ajax({
    url: `/api/HisSetting/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

export const getHisSettingMethodList = () => api.get(`/HisSetting/MethodList`)

//Pacs主機管理作業
export const getPacsList = (qs) => ajax({ url: '/api/PacsSetting' + qs })

export const putPacsList = (data) =>
  ajax({
    url: '/api/PacsSetting',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postPacsList = (data) =>
  ajax({
    url: '/api/PacsSetting',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deletePacsList = (id) =>
  ajax({
    url: `/api/PacsSetting/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })
export const getPacsExport = () => ajax({ url: '/PacsSetting/Export' })

//Video Record
export const getVideoById = (id) =>
  ajax({
    url: `/VideoRecord/List/${id}`,
    isLoading: false,
    showDialog: false,
  })

export const putVideoRecord = (data) =>
  ajax({
    url: '/VideoRecord/Put',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const getChatById = (id) =>
  ajax({
    url: `/Chat/List/${id}`,
    isLoading: false,
    showDialog: false,
  })

//常見問題維護
export const getQuestion = (qs) => ajax({ url: '/api/Question' + qs })

export const putQuestion = (data) =>
  ajax({
    url: '/api/Question',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postQuestion = (data) =>
  ajax({
    url: '/api/Question',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteQuestion = (id) =>
  ajax({
    url: `/api/Question/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

//公佈欄維護
export const getActiveNotice = (qs) => ajax({ url: '/Notice/ActiveList' + qs })

export const getNotice = (qs) => ajax({ url: '/api/Notice' + qs })

export const putNotice = (data) =>
  ajax({
    url: '/api/Notice',
    method: 'put',
    data,
    isLoading: false,
    showDialog: false,
  })

export const postNotice = (data) =>
  ajax({
    url: '/api/Notice',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteNotice = (id) =>
  ajax({
    url: `/api/Notice/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

export const postNoticeAttach = (data) =>
  ajax({
    url: '/Notice/Upload',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const deleteNoticeAttach = (id) =>
  ajax({
    url: `/Notice/DeleteAttach/${id}`,
    method: 'delete',
    isLoading: false,
    showDialog: false,
  })

export const getNoticeById = (id) => ajax({ url: `/api/Notice/${id}`, isLoading: false, showDialog: false })

//會診記錄統計作業
export const getRecordStatistics = (qs = '') => ajax({ url: 'Sheet/RecordStatistics' + qs })

//Dashboard data
export const getDashboardStatistics = (qs = '') => ajax({ url: 'sheet/Dashboard' + qs })

//取得尚未完成會診單填寫分頁清單
export const getDashboardUnRecoedList = (qs = '') => ajax({ url: 'Statistics/UnRecoedList' + qs })

export const getDakarInfo = () => ajax({ url: 'Auth/GetAccountInfo' })

//同意書 consent file
export const postConsent = (data) =>
  ajax({
    url: '/sheet/SaveConsentForm',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const getConsentById = (id) =>
  ajax({
    url: `/sheet/GetConsentForm?sheetId=${id}`,
    isLoading: false,
    showDialog: false,
  })

//Signature
export const postSignature = (data) =>
  ajax({
    url: '/Signature/Signature',
    method: 'post',
    data,
    isLoading: false,
    showDialog: false,
  })

export const getSignatureList = (qs) =>
  ajax({
    url: '/Signature/UnSignatureList' + qs,
    method: 'get',
    isLoading: false,
    showDialog: false,
  })

export const postAirReferral = (sheetId = '') =>
  ajax({
    url: '/sheet/CreateAirReferralRequest?sheetId=' + sheetId,
    method: 'post',
    isLoading: false,
    showDialog: false,
  })

export const getDepart = (query = '') => ajax({ url: `/api/Depart${query}`, method: 'get' })

export const getMyNetGroupHospitals = (id) => ajax({ url: `/institution/GetMyNetGroupHospitals?sheetId=${id}`, method: 'get' })

export const postCloseMeeting = (id) => ajax({ url: `/MeetingHub/CloseMeeting?id=${id}`, method: 'post' })

export const postLeaveTheMeeting = (id) => ajax({ url: `/Sheet/LeaveTheMeeting?id=${id}`, method: 'post' })

export const getConsultConsentForm = (id) => ajax({ url: `/sheet/GetConsultConsentForm?sheetId=${id}`, method: 'get' })
export const postConsultConsentForm = (data) => ajax({ url: `/sheet/SaveConsultConsentForm`, method: 'post', data })

export const getAccountSelectNoList = (query = '') => ajax({ url: `/Account/SelectNoList${query}`, method: 'get' })

// 1103 Dicom
export const getDicomFile = (id) => ajax({ url: `/DicomFile/Get/${id}`, method: 'get' })

// 1118 Auth Renew
export const authRenew = (id = '') => ajax({ url: `/Auth/Renew?institutionNo=${id}`, method: 'post' })

// // 1123 Account NetGroupInstitutions
// export const getAccountNetGroupInstitutions = (id = '') => ajax({ url: `/Account/NetGroupInstitutions?accountNo=${id}`, method: 'get' })

// 1202 Account NetGroupInstitutions
export const getAccountNetGroupInstitutions = (query = {}) => ajax({ url: `/Account/NetGroupInstitutions?groupType=${query.type}&institutionNo=${query.no}`, method: 'get' })

