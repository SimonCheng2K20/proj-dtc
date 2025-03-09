import { DataManager, WebApiAdaptor, Predicate, Query } from '@syncfusion/ej2-data'
import * as configs from '@/config'
import store from '@/store/index'
const institutionId270 = '&$filter=InstitutionId eq 270'
const institutionNo5400 = JSON.parse(process.env.VUE_APP_DATA_MANAGER_IS_NEED_institutionNo5400) ? "&$filter=InstitutionNo eq '5400'" : ''

const axiosService = (url, method = 'get', data = {}, showLoading = false) =>
  new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('錯誤的參數'))
    }
    if (showLoading) store.commit('setLoadingStatus', true)
    window.axios[method](url, data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        if (showLoading) store.commit('setLoadingStatus', false)
      })
  })

const websocketService = (wsurl, command) => {
  return new Promise((resolve, reject) => {
    const CONNECTION = new WebSocket(wsurl)
    if (!CONNECTION) {
      CONNECTION.close()
      reject({
        ErrorMessage: 'An error occured',
      })
    }

    CONNECTION.onerror = function (e) {
      reject({
        ErrorMessage: 'An error occured',
      })
    }

    // When the connection is open
    CONNECTION.onopen = function () {
      // console.log("State: " + CONNECTION.readyState);
      // console.log({ command });
      CONNECTION.send(command)
    }

    CONNECTION.onclose = function () {
      console.log('WEBSOCKET_CLOSE')
    }

    CONNECTION.onmessage = function (e) {
      //debugger
      if (e.data.indexOf('Error') >= 0) {
        reject({
          ErrorMessage: e.data,
        })
      } else {
        resolve({
          message: e.data,
        })
      }
      CONNECTION.close()
    }
  })
}

const dataManagerService = (subPath, query = new Query(), showLoading = false) =>
  new Promise((resolve, reject) => {
    if (showLoading) store.commit('setLoadingStatus', true)
    const url = configs.publicPath + subPath
    new DataManager({
      url,
      adaptor: new WebApiAdaptor(),
      crossDomain: true,
    })
      .executeQuery(query)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        if (showLoading) store.commit('setLoadingStatus', false)
      })
  })

// 取得分派醫生
export const getOptionsDispatchDoctors = () => dataManagerService('../Employee/SelectNoList?staffType=21,23,25,27,28,29' + institutionNo5400)

// 取得排程醫生
export const getScheduleDoctors = () => dataManagerService('../employee/SelectList?staffType=21,23,25,27,28,29&getAll=false')

// 取得開單醫生
export const getOptionsIssuePhysicianSource = () => dataManagerService('../Employee/SelectNoList?staffType=20,21,23,25,27,29' + institutionNo5400)

// 取得報告醫生
export const getOptionsReportDrSource = () => dataManagerService('../Employee/SelectNoList?staffType=21,25,28&getAll=false' + institutionNo5400)

// 取得員工資料
export const getEmployeeDataByType = (type, all = 'false') => dataManagerService(`../Employee/SelectNoList?staffType=${type}&getAll=${all}${institutionNo5400}`)

// 取得開單科別
export const getOptionsRequestingServiceSource = () => dataManagerService('../institution/SelectNoList')
// New Department
export const getOptionsRequestingDepartmentSource = () => dataManagerService('../api/Department')

// 報到櫃台條件搜尋
export const getCounterPatients = (param = '', query) => dataManagerService('../exam/List' + param, query)

// 報到櫃台條件搜尋
export const getDailyPatients = (param = '', query) => dataManagerService('../exam/info?' + param)

// 報到櫃台條件搜尋
export const getCounterPatientsAxios = (param = '') => axiosService('/exam/List?' + param)

// 報告作業搜尋作業
export const getReportContents = (param = '', query) => dataManagerService('../exam/List2' + param, query)

// 報告作業統計
export const getReportCount = (param) => dataManagerService('../exam/PlayCount' + param)

// 病患來源
export const getOptionsPatientSource = (query) => dataManagerService('../GeneralData/SelectNoList?groupNo=PatientSource', query)

// 檢查室
export const getOptionsRoomSource = (param = '', query) => dataManagerService('../Room/SelectNoList' + param, query)

// 取得報告櫃台狀態
export const getCounterStatusSource = (param = '', query) => dataManagerService('../GeneralData/SelectNoList' + param, query)

//取得檢查室相關資料
export const getRoomRelativeList = (param = '', query) => dataManagerService('../checkItem/RoomNoList' + param, query)

//抓取病患資料 call number
export const getPatientDataById = (param = '', query) => dataManagerService('../patient/Get' + param, query)

// 病患報到事件
export const patientRegisterCounterEvent = (param = '', query) => dataManagerService('../checkItem/MargeCheckItem' + param, query)

export const examCheckInEvent = ({ changeState = false, marge = true, isCheckUp = true, accessions }) =>
  axiosService(`/exam/CheckIn?changeState=${changeState}&marge=${marge}&isCheckUp=${isCheckUp}`, 'put', accessions)

// 取得modality 項目資料
export const getModalityGategoryByType = (type) => axiosService('/modalityCategory/SelectList?modality=' + type)

// 取得modality 子項目資料
export const getModalityProcedureListById = (id) => axiosService('/modalityCategory/ProcedureList?modalityCategoryId=' + id)

// 取得modality 子項目資料
export const changeExamItem = (data) => axiosService('/exam/Change', 'put', data)

// 取得員工資料CodeName
export const getEmployeeCodeName = () => dataManagerService('../api/Radiographer_CodeName')

// 設定放射師/護理師
export const saveEmployeeData = (data) => axiosService('/exam/SaveEmployee', 'put', data)

// 取得讀卡資訊
// GET / hisReader / hisGetBasicData
// export const getIcCardInfo = () => axiosService("/hisReader/hisGetBasicData", "get");
export const getIcCardInfo = () => websocketService('ws://localhost:8888/Chat', 'checkNhiCard')

export const callPaceWebSocket = (url) => websocketService('ws://localhost:8888/Chat', url)

// 取得檢查室目前叫號
// GET /room/GetCallNo
export const getCurrentNo = (no) => axiosService('/room/GetCallNo?roomNo=' + no, 'get')

// 設定檢查室啟始叫號碼
// POST /room/SetCallNo
export const setCurrentNo = (data) => axiosService('/room/SetCallNo', 'post', data)

// 取得歷程記錄
// GET / examTracking / List;
export const getPatientTracking = (no, modality = '') => axiosService(`/examTracking/${modality === 'CR' ? 'CrList?orderNo' : 'List?accessionNo'}=${no}`, 'get')

export const saveMedicationList = (accessionNo, dataArray) => axiosService(`/exam/SaveMedicationList?accessionNo=${accessionNo}`, 'put', dataArray)

// let subPath = "../favoriteCases/GetEmployeeNo";
export const getPatientList = (id, query) => dataManagerService('../favoriteCases/GetEmployeeNo?EmployeeNo=' + id, query)

export const saveCstData = (data) => axiosService('/cst/Save', 'post', data)

export const getCstList = (param = '') => axiosService('/cst/List' + param, 'get', {}, true)

export const deleteCstData = (id) => axiosService(`/cst/Delete?cstId=${id}`)

export const getCstListWithDataManager = (query) => dataManagerService('../cst/List', query, true)

// 增加記錄
export const addRecodeToAccessionNo = (data) => axiosService('/examTracking/Create', 'post', data)

// 取得科代碼
export const getInstitutionList = () => axiosService('/institution/SelectList')

// 取得HotKey設定
export const getHotKeySettingData = (id) => axiosService('/employee/GetPersonalSetting?employeeNo=' + id)

// 手開單取得employee list
export const getEmployeeByStaffType = (idList, allDep = false) => axiosService('/Employee/SelectNoList?staffType=' + idList + (allDep ? '&allDep=true' : ''))

// 取得報告內容
export const getExamReport = (Reports, Category) => axiosService('/exam/ExamReport', 'post', { Reports, Category })

// 設定個人參數
export const savePersonalSetting = (id, setting) =>
  axiosService(`/employee/SavePersonalSetting?employeeNo=${id}`, 'put', { EmployeeNo: id, PersonalSetting: JSON.stringify(setting) })

// 取得個人參數
export const getPersonalSetting = (id) => axiosService(`/employee/GetPersonalSetting?employeeNo=${id}`)
// 取得病人歷史資料
export const getPatientReportList = (id) => axiosService('/Report/GetPatientReportList?patientId=' + id)

// 取得報告barcode
export const getExportBarcode = (params) => axiosService(`/exam/ExportBarcode?${params}`)

export const getCallNoCurrentDayList = (roomNo) => axiosService(`/exam/GetCallNoDayList?roomNo=${roomNo}`)

export const getWaitingPatients = (roomNo) => axiosService(`/room/GetWaitPatients?roomNo=${roomNo}`)

// 取得轉診醫院
export const getReferralsHospitalList = () => axiosService('/institution/SelectReferralsList')

// 取得轉檢醫院
export const getTransferDetectHospitalList = () => axiosService('/institution/SelectTransferList')

// 取得轉診醫師
export const getTransferDoctorList = (hospitalName, orgType) => axiosService(`/institution/SelectTransferDoctorList?name=${hospitalName}&orgType=${orgType}`)

// 儲存轉診醫師
export const postTransferDoctorList = (hospitalName, doctorName) =>
  axiosService(`/institution/AddTransferDoctor?doctorName=${doctorName}&name=${hospitalName}`, 'post', {})

// 取得特定報告
export const getReportByAccessionNo = (no, id) => axiosService(`/Report/Get?accessionNo=${no}&patientId=${id}`)

// 變更密碼
export const authChangePassword = (oldPw, newPw) => axiosService(`/auth/ChangePassword?oldPassword=${oldPw}&newPassword=${newPw}`, 'put')

// 取得片語
export const getPhraseData = (param) => axiosService(`/reportPhrase/Get${param}`)

// 取得綜合查詢列表 excel
export const getMixSearchExportList = (param) => axiosService(`/exam/ExportList?${param}`)

// 取得檢查室的 no 和 名稱
export const getRoomSelectNoList = () => axiosService('/room/SelectNoList')

// 取得檢查室的 no 和 名稱
export const getRoomSelectIdList = () => axiosService('/room/SelectList')

// 設定喜好項目
export const postFavoriteCases = (data) => axiosService('/api/FavoriteCases', 'post', data)

export const examAssignReport = (data) => axiosService('/exam/AssignReport', 'put', data)

export const reportSave = (param, data) => axiosService(`/report/Save?${param}`, 'post', data)

export const procedureGroupSelectList = () => axiosService('/procedureGroup/SelectNoList')

export const weekSchedulingByMonth = (year, month) => axiosService(`/weekScheduling/Month2?year=${year}&month=${month}`)

export const updateWeekScheduling = ({ year, month }, data) => axiosService(`/weekScheduling/UpdateMonth2?year=${year}&month=${month}`, 'put', data)

export const reportGraphPhysicianListList = (params) => axiosService(`/schedule/ReportGraphPhysicianListList?${params}`)

export const reportGraphPhysicianListUrl = (params) => axiosService(`/schedule/ReportGraphPhysicianList?${params}`)

export const reportMonthFinishCheckList = (params) => axiosService(`/schedule/ReportMonthFinishCheckList?${params}`)

export const reportMonthFinishCheckUrl = (params) => axiosService(`/schedule/ReportMonthFinishCheck?${params}`)

export const reportMonthPhysicianGraphCheck = (params) => axiosService(`/schedule/ReportMonthPhysicianGraphCheck?${params}`)

export const statisticsCheckInReportList = (params) => axiosService(`/reportStatistics/CheckInReportList?${params}`)

export const statisticsCheckInReportExcel = (params) => axiosService(`/reportStatistics/CheckInReport?${params}`)

export const reportCompleteYear = (year) => axiosService(`/reportStatistics/GetCompleteYear?year=${year}`)

export const getReportWithVersion = (no, ver, id) => axiosService(`/Report/Get?accessionNo=${no}&version=${ver}&patientId=${id}`)

export const reportSearch = (pagination, data) => axiosService(`/report/Search?${pagination}`, 'post', data)

export const reportExport = (data) => axiosService('/report/Export', 'post', data)

export const getEmployeeTypeList = () => axiosService('/GeneralData/SelectNoList?groupNo=StaffType')

export const selectNoListForImageQuality = () => axiosService('/GeneralData/SelectNoList?groupNo=ImageQuality')

export const getEmployees = (params) => axiosService(`/api/employee/${params}`)

export const getEmployeesByNo = (query) => axiosService(`employee/Get?no=${query}`)

export const getHolidayItems = () => axiosService('/api/Holiday')

export const deleteHolidayItem = (id, startTime) => axiosService(`/api/Holiday/${id},${startTime}`, 'delete')

export const postHolidayItem = (id, start, end) => axiosService('/api/Holiday', 'post', { EmployeeId: id, StartTime: start, EndTime: end })

export const putHolidayItem = (id, start, end) => axiosService('/api/Holiday', 'post', { EmployeeId: id, StartTime: start, EndTime: end })

export const getVacancyTime = (year, month, tagNo) => axiosService(`/weekScheduling/CheckMonthFree?year=${year}&month=${month}&tagNo=${tagNo}`, 'put')

// export const postFailImageReason = (data) => axiosService('/api/FailImageReason', 'post', data)

// export const getFailImages = (query) => dataManagerService("../api/FailImageReason", query, true);

export const getFailImages = (params) => axiosService(`/FailImageReason/FailImageReportList?${params}`)

export const getFailImagesExcel = (params) => axiosService(`/FailImageReason/FailImageReport?${params}`)

export const getApiFailImage = (query) => dataManagerService('../api/FailImage', query)

export const getFailImageByAccessionNo = (no) => axiosService(`/FailImage/GetImages?accessionNo=${no}`)

export const postFailImageByAccessionNo = (no, data) => axiosService(`/FailImage/UploadImageFile?accessionNo=${no}`, 'post', data)

export const uploadFailImageByAccessionNo = (no, base64) => axiosService('/FailImage/UploadBase64Image', 'post', { AccessionNo: no, Image: base64 })

export const removeFailImageById = (id) => axiosService(`/api/FailImageFile/${id}`, 'delete')

export const getModalitySourceTypeCountList = (params) => axiosService(`/reportStatistics/ModalitySourceTypeCountList?${params}`)

export const getHrrMessageList = (params) => axiosService(`/hrr/List?${params}`)

export const getHrrMessageExcel = (params) => axiosService(`/hrr/Report?${params}`)

export const getAnonymousEvaluation = () => axiosService('/generalData/SelectNoList?groupNo=DxReportAnonymousEvaluation')

export const saveReportEvaluate = (data) => axiosService('/reportEvaluate/Save', 'post', data)

export const getReportEvaluate = (no) => axiosService(`reportEvaluate/GetEvaluates?accessionNo=${no}`)

export const getFirstFreeTimeSlot = (params) => axiosService(`/schedule/GetFistFreeTimeSlot?${params}`)

export const getOfficialHolidayByYear = (year) => axiosService(`/HospitalHoliday/Calendar?year=${year}`)

export const getHolidaysByYear = (year) => axiosService(`/HospitalHoliday/Get?year=${year}`)

export const postHolidaysByDate = (year, data) => axiosService(`/HospitalHoliday/Set?year=${year}`, 'post', data)

export const roomScheduleDays = () => axiosService('/schedule/RoomScheduleDays')

export const roomScheduleDaysReport = () => axiosService('/schedule/RoomScheduleDaysReport')

export const getActionReportEdit = (id) => axiosService(`/ActionReport/Edit?id=${id}`)

export const getActionReportRelease = (id) => axiosService(`/ActionReport/Release?id=${id}`)

export const putSaveScreeningWarning = (data) => axiosService(`/exam/SaveScreeningWarning`, 'put', data)

// FailImageReason
export const getFailImageReason = () => axiosService(`/api/FailImageReason`)
export const getFailImageReasonId = (id) => axiosService(`/api/FailImageReason/${id}`)
export const postFailImageReason = (data) => axiosService(`/api/FailImageReason`, 'post', data)
export const putFailImageReason = (data) => axiosService(`/api/FailImageReason`, 'put', data)
export const deleteFailImageReason = (id) => axiosService(`/api/FailImageReason/${id}`, 'delete')

export const getFailImageReasonReport = (params = '') => axiosService(`/FailImageReason/FailImageReport${params}`)
export const getFailImageReasonList = (params) => axiosService(`/FailImageReason/List${params}`)

export const getPacsThumbnail = (query = '') => axiosService(`/Pacs/GetThumbnail${query}`)
export const getPacsLab = (query = '') => axiosService(`/Pacs/GetPacsLab${query}`)

export const getCheckItem = (query = '') => axiosService(`/checkItem/SelectNoList${query}`)

export const getRadiographerCodeName = (query = '') => axiosService(`/CodeName/SelectList${query}`)

// 移除暫存報告
export const postRemoveTempReport = (orderNo = '') =>
  axiosService(`/report/RemoveTempReport?orderNo=${orderNo}`, 'post', {})

export const getDoctorReportCount = (params) => axiosService(`/report/DoctorReportCount?${params}`)
export const getEmrReportCount = (params) => axiosService(`/report/ReportAgeing?${params}`)
export const getReportDoctorReportCountExcel = (params) => axiosService(`/report/ExportDoctorReportCount?${params}`)
export const getReportAgeingExcel = (params) => axiosService(`/report/ExportReportAgeing?${params}`)

export const getFavoriateExcel = (params) => axiosService(`/favoriteCases/Export?${params}`)