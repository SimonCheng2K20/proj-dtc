import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'

const userRequest = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.111.66/EMR' : '/EMR',
  baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.1.201/EMR' : '/EMR',
  headers: {
    'Content-Type': 'application/json',
  },
})

userRequest.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: sessionStorage.token ? 'Bearer ' + sessionStorage.token : null,
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

userRequest.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    /*if(err.response.status===401) {
    sessionStorage.token=''
    location.href="./login"
  }*/
    //alert('網路異常')
    console.log(err)
    store.commit('loading', false)
    Message.error(err.response.data || err.response.statusText)
    throw err
  }
)

export default {
  login(x) {
    return userRequest.post('/Auth/Login', x).then((res) => res.data)
  },
  changePassword(x) {
    return userRequest.put('/Auth/ChangePassword', x).then((res) => res.data)
  },
  getAccountInfo() {
    return userRequest.get('/Auth/GetAccountInfo').then((res) => res.data)
  },
  resetPassword(x) {
    return userRequest
      .put(`/Auth/ResetPassword?userName=${x.userName}&newPermit=${x.newPermit}`)
      .then((res) => res.data)
  },
  getHospitalInfo() {
    return userRequest.get('/Hospital/Get').then((res) => res.data)
  },
  putHospitalInfo(x) {
    return userRequest.put('/Hospital/Update', x).then((res) => res.data)
  },
  getLendingClass(x) {
    return userRequest.get('/api/LendingClass', { params: x }).then((res) => res.data)
  },
  postLendingClass(x) {
    return userRequest.post('/api/LendingClass', x).then((res) => res.data)
  },
  putLendingClass(x) {
    return userRequest.put(`/api/LendingClass/${x.LendingClassOid}`, x).then((res) => res.data)
  },
  delLendingClass(x) {
    return userRequest.delete(`/api/LendingClass/${x}`).then((res) => res.data)
  },
  getOverTimeReason(x) {
    return userRequest.get('/api/OverTimeReason', { params: x }).then((res) => res.data)
  },
  postOverTimeReason(x) {
    return userRequest.post('/api/OverTimeReason', x).then((res) => res.data)
  },
  putOverTimeReason(x) {
    return userRequest.put(`/api/OverTimeReason/${x.Oid}`, x).then((res) => res.data)
  },
  delOverTimeReason(x) {
    return userRequest.delete(`/api/OverTimeReason/${x}`).then((res) => res.data)
  },
  getPatientClass(x) {
    return userRequest.get('/api/PatientClass', { params: x }).then((res) => res.data)
  },
  postPatientClass(x) {
    return userRequest.post('/api/PatientClass', x).then((res) => res.data)
  },
  putPatientClass(x) {
    return userRequest.put(`/api/PatientClass/${x.PatientClassOid}`, x).then((res) => res.data)
  },
  delPatientClass(x) {
    return userRequest.delete(`/api/PatientClass/${x}`).then((res) => res.data)
  },
  getSheetEventClass(x) {
    return userRequest.get('/api/SheetEventClass', { params: x }).then((res) => res.data)
  },
  postSheetEventClass(x) {
    return userRequest.post('/api/SheetEventClass', x).then((res) => res.data)
  },
  putSheetEventClass(x) {
    return userRequest.put(`/api/SheetEventClass/${x.SheetEventClassOid}`, x).then((res) => res.data)
  },
  delSheetEventClass(x) {
    return userRequest.delete(`/api/SheetEventClass/${x}`).then((res) => res.data)
  },
  getFunction(x) {
    return userRequest.get('/api/Function', { params: x }).then((res) => res.data)
  },
  postFunction(x) {
    return userRequest.post('/api/Function', x).then((res) => res.data)
  },
  putFunction(x) {
    return userRequest.put(`/api/Function`, x).then((res) => res.data)
  },
  delFunction(x) {
    return userRequest.delete(`/api/Function/${x}`).then((res) => res.data)
  },
  getRole(x) {
    return userRequest.get('/api/Role', { params: x }).then((res) => res.data)
  },
  postRole(x) {
    return userRequest.post('/api/Role', x).then((res) => res.data)
  },
  putRole(x) {
    return userRequest.put(`/api/Role`, x).then((res) => res.data)
  },
  delRole(x) {
    return userRequest.delete(`/api/Role/${x}`).then((res) => res.data)
  },
  getRoleFunctionNos(x) {
    return userRequest.get(`/role/FunctionNos`, { params: x }).then((res) => res.data)
  },
  addFunction(x) {
    return userRequest.post(`/role/AddFunction`, x).then((res) => res.data)
  },
  removeFunction(x) {
    return userRequest.post(`/role/RemoveFunction`, x).then((res) => res.data)
  },
  getAccountStatusList() {
    return userRequest.get('/account/StatusList').then((res) => res.data)
  },
  getAccountAllList(x) {
    return userRequest.get('/account/AllList', { params: x }).then((res) => res.data)
  },
  postAccount(x) {
    return userRequest.post('/api/Account', x).then((res) => res.data)
  },
  putAccount(x) {
    return userRequest.put(`/api/Account`, x).then((res) => res.data)
  },
  delAccount(x) {
    return userRequest.delete(`/api/Account/${x}`).then((res) => res.data)
  },
  getBulletinBoard(x) {
    return userRequest.get('/api/BulletinBoard', { params: x }).then((res) => res.data)
  },
  postBulletinBoard(x) {
    return userRequest.post('/api/BulletinBoard', x).then((res) => res.data)
  },
  putBulletinBoard(x) {
    return userRequest.put('/api/BulletinBoard', x).then((res) => res.data)
  },
  delBulletinBoard(x) {
    return userRequest.delete(`/api/BulletinBoard/${x}`).then((res) => res.data)
  },
  getAuditEvent(x) {
    return userRequest.get(`/api/AuditEvent`, { params: x }).then((res) => res.data)
  },
  getAuditEventTypes() {
    return userRequest.get(`/api/AuditEvent/AuditEvent/AuditEventTypes`).then((res) => res.data)
  },
  getSheetEvent(x) {
    return userRequest.get('/api/SheetEvent', { params: x }).then((res) => res.data)
  },
  postSheetEvent(x) {
    return userRequest.post('/api/SheetEvent', x).then((res) => res.data)
  },
  putSheetEvent(x) {
    return userRequest.put('/api/SheetEvent', x).then((res) => res.data)
  },
  delSheetEvent(x) {
    return userRequest.delete(`/api/SheetEvent/${x}`).then((res) => res.data)
  },
  getSheetEventById(x) {
    return userRequest.get(`/api/SheetEvent/${x}`).then((res) => res.data)
  },
  getSheetIndex(x) {
    return userRequest.get('/api/SheetIndex', { params: x }).then((res) => res.data)
  },
  getDeptList() {
    return userRequest.get('/Lending/DeptList').then((res) => res.data)
  },
  getSheetArchive(x) {
    return userRequest.get('/SheetArchive/StatusList', { params: x }).then((res) => res.data)
  },
  postSheetArchive(x) {
    return userRequest.post('/SheetArchive/Signature', x).then((res) => res.data)
  },
  getSheetArchivePatientList(x) {
    return userRequest.get('/SheetArchive/PatientList', { params: x }).then((res) => res.data)
  },
  getSheetArchivePatientSheetArchive(x) {
    return userRequest.get('/SheetArchive/GetPatientSheetArchive', { params: x }).then((res) => res.data)
  },
  getSheetTypeNoList(x) {
    return userRequest.get('/SheetType/NoList', { params: x }).then((res) => res.data)
  },
  getSheetTypeTypeIdList(params) {
    return userRequest.get('/SheetType/TypeIdList', { params }).then((res) => res.data)
  },
  getSheetArchiveExport(x) {
    return userRequest.get(`/SheetArchive/Export/${x}`, { responseType: 'blob' }).then((res) => res.data)
  },
  postSheetArchiveExport(body) {
    return userRequest.post(`/SheetArchive/Export`, body, { responseType: 'blob' }).then((res) => res.data)
  },
  getSheetArchiveById(x) {
    return userRequest.get(`/api/SheetArchive/${x}`).then((res) => res.data)
  },
  delSheetArchive(x) {
    return userRequest.delete(`/api/SheetArchive/${x}`).then((res) => res.data)
  },
  getSheetArchiveApproverList(x) {
    return userRequest.get(`/SheetArchive/ApproverList`, { params: x }).then((res) => res.data)
  },
  getApproverSheetArchive(x) {
    return userRequest.get(`/SheetArchive/GetApproverSheetArchive`, { params: x }).then((res) => res.data)
  },
  getExchangeMid(x) {
    return userRequest.get(`/api/ExchangeMid`, { params: x }).then((res) => res.data)
  },
  getExchangeMidById(x) {
    return userRequest.get(`/api/ExchangeMid/${x}`).then((res) => res.data)
  },
  getLendingById(x) {
    return userRequest.get(`/api/lending/${x}`).then((res) => res.data)
  },
  getLending(x) {
    return userRequest.get(`/api/Lending`, { params: x }).then((res) => res.data)
  },
  postLending(x) {
    return userRequest.post(`/api/Lending`, x).then((res) => res.data)
  },
  putLending(x) {
    return userRequest.put(`/api/Lending/${x.LendingId}`, x).then((res) => res.data)
  },
  deleteLending(x) {
    return userRequest.delete(`/api/lending/${x}`).then((res) => res.data)
  },
  getSheetMid(x) {
    return userRequest.get('/api/SheetMid', { params: x }).then((res) => res.data)
  },
  getAccountSignature(x) {
    return userRequest.get('/api/AccountSignature', { params: x }).then((res) => res.data)
  },
  getAccountSignatureById(x) {
    return userRequest.get(`/api/AccountSignature/${x}`).then((res) => res.data)
  },
  getAllPatient(x) {
    return userRequest.get('/SheetArchive/AllPatient', { params: x }).then((res) => res.data)
  },
  postSetAutoSignature(body) {
    return userRequest
      .post('/account/SetAutoSignature', body)
      .then((res) => res)
      .catch((err) => err)
  },
  getSheetIndexSensitive(params) {
    return userRequest.get('/api/SheetIndexSensitive', { params }).then((res) => res.data)
  },
  postSheetIndexSensitive(body) {
    return userRequest.post('/api/SheetIndexSensitive', body).then((res) => res.data)
  },
  deleteSheetIndexSensitive(id) {
    return userRequest.delete(`/api/SheetIndexSensitive/${id}`).then((res) => res.data)
  },
  getSheetArchiveStatsExportList(x) {
    return userRequest.get(`/SheetArchiveStats/ExportList`, { params: x, responseType: 'blob' }).then((res) => res)
  },
  getSheetArchiveStatsExportSummary(x) {
    return userRequest.get(`/SheetArchiveStats/ExportSummary`, { params: x, responseType: 'blob' }).then((res) => res)
  },
  getSheetArchiveStatsExportDetail(x) {
    return userRequest.get(`/SheetArchiveStats/ExportDetail`, { params: x, responseType: 'blob' }).then((res) => res)
  },
  getMyOverStatus() {
    return userRequest.get(`/SheetArchive/GetMyOverStatus`).then((res) => res.data)
  },
  postSheetSetSpotCheck(body) {
    return userRequest.post('/SheetArchive/SetSpotCheck', body).then((res) => res.data)
  },
  postSheetSetSpotDesc(body) {
    return userRequest.post('/SheetArchive/SetSpotDesc', body).then((res) => res.data)
  },
}
