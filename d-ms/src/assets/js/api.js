import axios from 'axios'
import store from '@/store'
//import router from '../../router/index.js'
import { Message } from 'element-ui'

const userRequest = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.111.66/PMR':'/PMR',
  headers: { 
    'Content-Type': 'application/json',
  },
})

userRequest.interceptors.request.use((config)=> {
  config.headers = { 
    'Authorization': localStorage.token ? 'Bearer '+localStorage.token : null
  }
  return config;
}, (error)=> {
  return Promise.reject(error);
})

userRequest.interceptors.response.use((res)=> {
  return res
},(err)=> {
  if(err.response.status===401) {
    localStorage.token=''
    alert(err.response.data||err.response.statusText)
    location.reload()
    //router.push({name:'Login'}).catch(err=>err)
  }
    //alert('網路異常')
  console.log(err)
  store.commit('loading',false)
  Message.error(err.response.data||err.response.statusText)
  throw err
})

export default {
  baseURL:process.env.NODE_ENV === 'development' ? 'http://192.168.111.66/PMR':'/PMR',
  login(x) {
    return userRequest.post('/Auth/Login',x).then(res=>res.data)
  },
  logOut() {
    return userRequest.get('/Auth/Logout').then(res=>res.data)
  },
  loginNhicard(x) {
    return userRequest.get('/Auth/LoginNhicard',{params:x}).then(res=>res.data)
  },
  loginHicard(x) {
    return userRequest.get('/Auth/LoginHicard',{params:x}).then(res=>res.data)
  },
  setPinCode(x) {
    return userRequest.put('/Auth/SetPinCode',null,{params:x}).then(res=>res.data)
  },
  changePassword(x) {
    return userRequest.put('/Auth/ChangePassword',x).then(res=>res.data)
  },
  resetPassword(x) {
    return userRequest.get('/account/AccountReset',{params:x}).then(res=>res.data)
  },
  getAccountInfo() {
    return userRequest.get('/Auth/GetAccountInfo').then(res=>res.data)
  },
  getAccount(x) {
    return userRequest.get('/api/Account',{params:x}).then(res=>res.data)
  },
  postAccount(x) {
    return userRequest.post('/api/Account',x).then(res=>res.data)
  },
  putAccount(x) {
    return userRequest.put('/api/Account',x).then(res=>res.data)
  },
  delAccount(x) {
    return userRequest.delete(`/api/Account/${x}`).then(res=>res.data)
  },
  getAccountUnlock(x) {
    return userRequest.get('/account/Unlock',{params:x}).then(res=>res.data)
  },
  getStatusList() {
    return userRequest.get('/api/Account/account/StatusList').then(res=>res.data)
  },
  getRole(x) {
    return userRequest.get('/api/Role',{params:x}).then(res=>res.data)
  },
  postRole(x) {
    return userRequest.post('/api/Role',x).then(res=>res.data)
  },
  putRole(x) {
    return userRequest.put('/api/Role',x).then(res=>res.data)
  },
  delRole(x) {
    return userRequest.delete(`/api/Role/${x}`).then(res=>res.data)
  },
  getFunction(x) {
    return userRequest.get('/api/Function',{params:x}).then(res=>res.data)
  },
  postFunction(x) {
    return userRequest.post('/api/Function',x).then(res=>res.data)
  },
  putFunction(x) {
    return userRequest.put('/api/Function',x).then(res=>res.data)
  },
  delFunction(x) {
    return userRequest.delete(`/api/Function/${x}`).then(res=>res.data)
  },
  getAuditEvent(x) {
    return userRequest.get('/api/AuditEvent',{params:x}).then(res=>res.data)
  },
  getAuditEventTypes() {
    return userRequest.get('/api/AuditEvent/AuditEvent/AuditEventTypes').then(res=>res.data)
  },
  getFolder() {
    return userRequest.get('/api/Folder').then(res=>res.data)
  },
  postFolder(x) {
    return userRequest.post('/api/Folder',x).then(res=>res.data)
  },
  putFolder(x) {
    return userRequest.put('/api/Folder',x).then(res=>res.data)
  },
  delFolder(x) {
    return userRequest.delete(`/api/Folder/${x}`).then(res=>res.data)
  },
  getDocCategory() {
    return userRequest.get('/api/DocCategory').then(res=>res.data)
  },
  postDocCategory(x) {
    return userRequest.post('/api/DocCategory',x).then(res=>res.data)
  },
  putDocCategory(x) {
    return userRequest.put('/api/DocCategory',x).then(res=>res.data)
  },
  delDocCategory(x) {
    return userRequest.delete(`/api/DocCategory/${x}`).then(res=>res.data)
  },
  getPatient(x) {
    return userRequest.get('/api/Patient',{params:x}).then(res=>res.data)
  },
  postPatient(x) {
    return userRequest.post('/api/Patient',x).then(res=>res.data)
  },
  putPatient(x) {
    return userRequest.put('/api/Patient',x).then(res=>res.data)
  },
  delPatient(x) {
    return userRequest.delete(`/api/Patient/${x}`).then(res=>res.data)
  },
  getPatStatus() {
    return userRequest.get(`/api/CommonData/GivePatStatus`).then(res=>res.data)
  },
  getDocRecord(x) {
    return userRequest.get(`/api/DocRecordImg`,{params:x}).then(res=>res.data)
  },
  getDocRecordById(x) {
    return userRequest.get(`/api/DocRecordImg/${x}`).then(res=>res.data)
  },
  postDocRecord(x) {
    return userRequest.post('/api/DocRecordImg/NewUpload',x).then(res=>res.data)
  },
  putDocRecord(x) {
    return userRequest.put('/api/DocRecordImg',x).then(res=>res.data)
  },
  delDocRecord(x) {
    return userRequest.delete(`/api/DocRecordImg`,{data:x}).then(res=>res.data)
  },
  delDocRecordVersion(x) {
    return userRequest.delete(`/api/DocRecordImg`,{params:x}).then(res=>res.data)
  },
  getQuickSearch(x) {
    return userRequest.get(`/api/QuickSearch`,{params:x}).then(res=>res.data)
  },
  postQuickSearch(x) {
    return userRequest.post(`/api/QuickSearch`,x).then(res=>res.data)
  },
  putQuickSearch(x) {
    return userRequest.put(`/api/QuickSearch`,x).then(res=>res.data)
  },
  delQuickSearch(x) {
    return userRequest.delete(`/api/QuickSearch/${x}`).then(res=>res.data)
  },
  getFunctionNosByRoleId(x) {
    return userRequest.get(`/role/FunctionNos`,{params:x}).then(res=>res.data)
  },
  postAddFunction(x) {
    return userRequest.post(`/role/AddFunction`,x).then(res=>res.data)
  },
  postRemoveFunction(x) {
    return userRequest.post(`/role/RemoveFunction`,x).then(res=>res.data)
  },
  getDocImage(x) {
    return userRequest.get(`/api/DocImage`,{params:x}).then(res=>res.data)
  },
  getImageListById(x) {
    return userRequest.get(`/api/DocImage/${x}`).then(res=>res.data)
  },
  postNewImage(x) {
    return userRequest.post(`/api/DocImage/NewImage`,x).then(res=>res.data)
  },
  putUploadImage(x) {
    return userRequest.put(`/api/DocRecordImg/UpdateImage`,x).then(res=>res.data)
  },
  putDocImage(x) {
    return userRequest.put(`/api/DocImage`,x).then(res=>res.data)
  },
  putSortImage(x) {
    return userRequest.put(`/api/DocRecordImg/SortImage`,x).then(res=>res.data)
  },
  delDocImage(x) {
    return userRequest.delete(`/api/DocImage/${x}`).then(res=>res.data)
  },
  putUpdateNote(x) {
    return userRequest.put(`/api/DocRecordImg/UpdateNote`,x).then(res=>res.data)
  },
  getDocArchive(x) {
    return userRequest.get(`/api/DocArchive`,{params:x}).then(res=>res.data)
  },
  postDocArchive(x) {
    return userRequest.post(`/api/DocArchive`,x).then(res=>res.data)
  },
  putDocArchive(x) {
    return userRequest.put(`/api/DocArchive`,x).then(res=>res.data)
  },
  getDocVersion(x) {
    return userRequest.get(`/api/DocRecordImg/GetVersionList`,{params:x}).then(res=>res.data)
  },
  getDocRecordExportSelectList(x) {
    return userRequest.put(`/api/DocRecordImg/ExportSelectList`,x).then(res=>res.data)
  },
  getDocRecordImgGetAllImage(x) {
    return userRequest.get(`/api/DocRecordImg/GetAllImage`,{params:x}).then(res=>res.data)
  },
  delDocRecordImg(x) {
    return userRequest.delete(`/api/DocRecordImg/${x}`).then(res=>res.data)
  },
  setLastVersion(x) {
    return userRequest.get(`/api/DocRecordImg/SetLastVersion`,{params:x}).then(res=>res.data)
  },
  delDocArchive(x) {
    return userRequest.delete(`/api/DocArchive`,{data:x}).then(res=>res.data)
  },
  getDocArchiveImage(x) {
    return userRequest.get(`/api/DocArchiveImage`,{params:x}).then(res=>res.data)
  },
  putDocArchivePutRecord(x) {
    return userRequest.put(`/api/DocArchive/PutRecord`,null,{params:x}).then(res=>res.data)
  },
  getDocArchiveExportSelectList(x) {
    return userRequest.put(`/api/DocArchive/ExportSelectList`,x).then(res=>res.data)
  },
  getDocRecordImgExportSelectListPdf(x) {
    return userRequest.put(`/api/DocRecordImg/ExportSelectListPdf`,x,{responseType:'blob'}).then(res=>res.data)
  },
}