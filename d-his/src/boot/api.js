import axios from 'axios'

const api = axios.create({
  baseURL: process.env.DEV ? '/his' + $setting.apiHost : $setting.apiHost,
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
  (error) => Promise.resolve({ error })
)

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error.response.data)
    return Promise.reject(error.response)
  }
)

// 陽大 診斷建議
export const getAdvice = (body) => axios.post('https://dmc.nycu.edu.tw/hisapi/get_advice', body)

// Auth
export const postLogin = (body) => api.post(`/Auth/Login`, body)

export const putChangePassword = (body) => api.put(`/Auth/ChangePassword`, body)

export const putResetPassword = (userName, newPermit) =>
  api.put(`/Auth/ResetPassword?userName=${userName}&newPermit=${newPermit}`)

export const getAccountInfo = () => api.get(`/Auth/GetAccountInfo`)

// CommonData
export const getCommonData = (query) => api.get(`/api/CommonData${query}`)

export const getCommonDataItem = (id) => api.get(`/api/CommonData/${id}`)

export const postCommonDataItem = (body) => api.post(`/api/CommonData`, body)

export const putCommonDataItem = (body) => api.put(`/api/CommonData`, body)

export const deleteCommonDataItem = (id) => api.delete(`/api/CommonData/${id}`)

// 就診身分代碼
export const getIdentityAttend = (query) => api.get(`/api/IdentityAttend${query}`)

export const getIdentityAttendItem = (id) => api.get(`/api/IdentityAttend/${id}`)

export const postIdentityAttendItem = (body) => api.post(`/api/IdentityAttend`, body)

export const putIdentityAttendItem = (body) => api.put(`/api/IdentityAttend`, body)

export const deleteIdentityAttendItem = (id) => api.delete(`/api/IdentityAttend/${id}`)

//異常代碼
export const getNhiCardErrorCode = (query) => api.get(`/api/NhiCardErrorCode${query}`)
export const getNhiCardErrorCodeItem = (id) => api.get(`/api/NhiCardErrorCode/${id}`)
export const postNhiCardErrorCodeItem = (body) => api.post(`/api/NhiCardErrorCode`, body)
export const putNhiCardErrorCodeItem = (body) => api.put(`/api/NhiCardErrorCode`, body)
export const deleteNhiCardErrorCodeItem = (id) => api.delete(`/api/NhiCardErrorCode/${id}`)

// Role
export const getRole = (query = '') => api.get(`/api/Role${query}`)
export const getRoleItem = (id) => api.get(`/api/Role/${id}`)
export const postRoleItem = (body) => api.post(`/api/Role`, body)
export const putRoleItem = (body) => api.put(`/api/Role`, body)
export const deleteRoleItem = (id) => api.delete(`/api/Role/${id}`)

export const getRoleFunctionNos = (id) => api.get(`/Role/FunctionNos?roleNo=${id}`)

export const postAddFunction = (body) => api.post(`/Role/AddFunction`, body)

export const postRemoveFunction = (body) => api.post(`/Role/RemoveFunction`, body)

export const getRoleTypeList = () => api.get(`/Role/RoleTypeList`)

export const getRoleSelectNoList = (query = '') => api.get(`/Role/SelectNoList${query}`)

export const getOpdReceiptCategory = (query = '') => api.get(`/api/OpdReceiptCategory${query}`)
export const getOpdReceiptCategoryItem = (id) => api.get(`/api/OpdReceiptCategory/${id}`)
export const postOpdReceiptCategoryItem = (body) => api.post(`/api/OpdReceiptCategory`, body)
export const putOpdReceiptCategoryItem = (body) => api.put(`/api/OpdReceiptCategory`, body)
export const deleteOpdReceiptCategoryItem = (id) => api.delete(`/api/OpdReceiptCategory/${id}`)

// Function
export const getFunction = (query = '') => api.get(`/api/Function${query}`)
export const getFunctionItem = (id) => api.get(`/api/Function/${id}`)
export const putFunctionItem = (body) => api.put(`/api/Function`, body)
export const postFunctionItem = (body) => api.post(`/api/Function`, body)
export const deleteFunctionItem = (id) => api.delete(`/api/Function/${id}`)

// 機構
export const getOrganization = () => api.get(`/Organization/GetData`)

export const putOrganization = (body) => api.put(`/Organization/UpdateData`, body)

// 轉診醫事機構
export const getTransOrganization = (query = '') => api.get(`/api/TransOrganization${query}`)

// 檢查室
export const getExaminationRoom = (query) => api.get(`/api/ExaminationRoom${query}`)

export const getExaminationRoomItem = (id) => api.get(`/api/ExaminationRoom/${id}`)

export const deleteExaminationRoom = (id) => api.delete(`/api/ExaminationRoom/${id}`)

export const postExaminationRoom = (body) => api.post(`/api/ExaminationRoom`, body)

export const putExaminationRoom = (body) => api.put(`/api/ExaminationRoom`, body)

// 下拉選單 Dropdown
export const getAttendCategoryList = () => api.get(`/CommonData/GetAttendCategory`)

export const getIdentityDiscount = () => api.get(`/CommonData/GetIdentityDiscount`)

export const getDosageForm = () => api.get(`/CommonData/GetDosageForm`)

export const getFrequencyCodeDropdown = () => api.get(`/CommonData/GetFrequencyCode`)

export const getIdentityList = () => api.get(`/CommonData/GetIdentity`)

export const getSeekMedicalDropdown = () => api.get(`/CommonData/GetSeekMedical`)

export const getSeekMedicalList = (qeury = '') => api.get(`/CommonData/SeekMedicalOdata${qeury}`)

export const getPreventDropdown = () => api.get(`/CommonData/GetPrevent`)

export const getPreventList = () => api.get(`/Prevent/SelectNoList`)

export const getBedLevelDropdown = () => api.get(`/CommonData/GetBedLevel`)

export const getBedTypeDropdown = () => api.get(`/CommonData/GetBedType`)

export const getBedStatusDropdown = () => api.get(`/CommonData/GetBedStatus`)

export const getNursingStationDropdown = () => api.get(`/CommonData/GetNursingStation`)

export const getInpatientExpenseDropdown = () => api.get(`/CommonData/GetInpatientExpense`)

export const getPriorityLevelDropdown = () => api.get(`/CommonData/GetPriorityLevel`)

export const getStayPatientStatusDropdown = () => api.get(`/CommonData/GetStayPatientStatus`)

export const getHealthBedDropdown = () => api.get(`/CommonData/GetHealthBed`)

export const getAntibioticsCodeDropdown = () => api.get(`/CommonData/GetAntibioticsCode`)

export const getCategoryCodeDropdown = () => api.get(`/CommonData/GetCategoryCode`)

export const getControlledCodeDropdown = () => api.get(`/CommonData/GetControlledCode`)

export const getPharmacologyCodeDropdown = () => api.get(`/CommonData/GetPharmacologyCode`)

export const getGetAttendDropdown = () => api.get(`/CommonData/GetAttend`)

export const getFunctionList = () => api.get(`/Function/SelectNoList`)

export const getHealthPriceTypeDropdown = () => api.get(`/CommonData/GetHealthPriceType`)

export const getInChargeList = () => api.get(`/CommonData/GetInCharges`)

export const getStatusDropdown = () => api.get(`/CommonData/GiveActiveStatus`)

export const getChronicMonthsDropdown = () => api.get(`/CommonData/GetChronicMonths`)

export const getCaseTypeList = () => api.get(`/CommonData/GetCaseType`)
export const getCaseType = (query = '') => api.get(`/api/CommonData${query}`)
export const getCaseTypeItem = (id) => api.get(`/api/CommonData/${id}`)
export const postCaseTypeItem = (body) => api.post(`/api/CommonData`, body)
export const putCaseTypeItem = (body) => api.put(`/api/CommonData`, body)
export const deleteCaseTypeItem = (id) => api.delete(`/api/CommonData/${id}`)

export const getPayTypeDropdown = () => api.get(`/CommonData/GetPayType`)

export const getPartialAffordDropdown = () => api.get(`/CommonData/GetPartialAfford`)

export const getDeclareTypeDropdown = () => api.get(`/CommonData/DclType`)

export const getDeclareResendDropdown = () => api.get(`/CommonData/DclResend`)

export const getDeclareStatusDropdown = () => api.get(`/CommonData/DclStatus`)

export const getMedTypeDropdown = () => api.get(`/CommonData/MedType`)

export const getOrderPayDropdown = () => api.get(`/CommonData/OrderPay`)

export const getHospitalLevelDropdown = () => api.get(`/CommonData/HospitalLevel`)

export const getCommonDataDepartment = (qeury) => api.get(`/CommonData/GetDepartment${qeury}`)

export const getMarriage = () => api.get(`/CommonData/GetMarriage`)

export const getMilitaryService = () => api.get(`/CommonData/GetMilitaryService`)

export const getIndigenous = () => api.get(`/CommonData/GetIndigenous`)

export const getWorkShift = () => api.get(`/CommonData/GetWorkShift`)

export const getInjuredGrade = () => api.get(`/CommonData/GetInjuredGrade`)

export const getModality = () => api.get(`/CommonData/GetModality`)

export const getFoodTime = () => api.get(`/CommonData/GetFoodTime`)

export const getFoodType = () => api.get(`/CommonData/GetFoodType`)

export const getIcd10cmChap = () => api.get(`/CommonData/GetIcd10cmChap`)
export const getIdentityCategoryList = () => api.get(`/CommonData/GetIdentityCategory`)
export const getSpecialCureList = () => api.get(`/CommonData/GetSpecialCureItem`)

// 健保醫令 Dropdown
export const getNHIChapDropdown = () => api.get(`/CommonData/NHIChap`)

export const getRelationNhiSectDropdown = (query) => api.get(`/CommonDataRelation/GetNhiSect${query}`)

export const getRelationNhiItemDropdown = (query) => api.get(`/CommonDataRelation/GetNhiItem${query}`)

// 取得健保醫令分序選單 Dropdown
export const getRelationNhiSeqDropdown = (query) => api.get(`/CommonDataRelation/GetNhiSeq${query}`)

// 途徑
export const getRouteCodeDropdown = () => api.get(`/CommonData/GetRouteCode`)

// 藥品單位
export const getUnitCodeDropdown = () => api.get(`/CommonData/GetUnitCode`)

// 部門 Department
export const getDepartmentDropdown = (query = '') => api.get(`/Department/SelectNoList${query}`)

// 門診時段
export const getTimeSlotDropdown = () => api.get(`/TimeSlot/SelectNoList`)

export const getTimeSlot = (qeury) => api.get(`/api/TimeSlot${qeury}`)

// 給號原則
export const getNoRulePatternDropdown = () => api.get(`/CommonData/GiveNoRulePattern`)

export const getSubCodeList = () => api.get(`/CommonData/GetSubCode`)

export const getSpecialCategoryList = () => api.get(`/CommonData/GetSpecialCategory`)

export const getDoctorIdDropdown = (query = '') => api.get(`/Employee/GetDepDocList${query}`)

export const getDoctorPersonIdDropdown = (query = '') => api.get(`/Employee/SelectPersonList${query}`)

//診間 Room
export const getRoomDropdown = (query = '') => api.get(`/Room/SelectNoList${query}`)

// Account
export const getAccountList = (query) => api.get(`/Account/GetList${query}`)
export const getAccount = (query) => api.get(`/api/Account${query}`)
export const getAccountItem = (id) => api.get(`/api/Account/${id}`)
export const putAccountItem = (body) => api.put(`/api/Account`, body)
export const postAccountItem = (body) => api.post(`/api/Account`, body)
export const deleteAccountItem = (id) => api.delete(`/api/Account/${id}`)

export const getAccountStatusList = () => api.get(`/api/Account/Account/StatusList`)

// MedFrequencyCode
export const getMedFrequencyCode = (query = '') => api.get(`/api/MedFrequencyCode${query}`)
export const getMedFrequencyCodeItem = (id = '') => api.get(`/api/MedFrequencyCode/${id}`)
export const putMedFrequencyCodeItem = (body = {}) => api.put(`/api/MedFrequencyCode`, body)
export const postMedFrequencyCodeItem = (body = {}) => api.post(`/api/MedFrequencyCode`, body)
export const deleteMedFrequencyCodeItem = (id = '') => api.delete(`/api/MedFrequencyCode/${id}`)

// Employee
export const getEmployee = (query = '') => api.get(`/api/Employee${query}`)
export const getEmployeeItem = (id) => api.get(`/api/Employee/${id}`)
export const putEmployeeItem = (body) => api.put(`/api/Employee`, body)
export const postEmployeeItem = (body) => api.post(`/api/Employee`, body)
export const deleteEmployeeItem = (id) => api.delete(`/api/Employee/${id}`)
export const putEmployeeUploadImage = (body) => api.put(`/api/Employee/uploadImage`, body)

// ICD 10
export const getIcd10Cm = (query) => api.get(`/api/Icd10Cm${query}`)

export const getIcd10CmItem = (id) => api.get(`/api/Icd10Cm/${id}`)

export const postIcd10Cm = (body) => api.post(`/api/Icd10Cm`, body)

export const putIcd10Cm = (body) => api.put(`/api/Icd10Cm`, body)

export const deleteIcd10Cm = (id) => api.delete(`/api/Icd10Cm/${id}`)

// ICD9
export const getIcd9Cm = (query) => api.get(`/api/Icd9Cm${query}`)

export const getIcd9CmItem = (id) => api.get(`/api/Icd9Cm/${id}`)

export const postIcd9Cm = (body) => api.post(`/api/Icd9Cm`, body)

export const putIcd9Cm = (body) => api.put(`/api/Icd9Cm`, body)

export const deleteIcd9Cm = (id) => api.delete(`/api/Icd9Cm/${id}`)

// ICD9/ICD10 對應
export const getIcd9ToIcd10 = (query) => api.get(`/api/Icd9ToIcd10${query}`)

export const getIcd9ToIcd10Item = (id) => api.get(`/api/Icd9ToIcd10/${id}`)

export const postIcd9ToIcd10 = (body) => api.post(`/api/Icd9ToIcd10`, body)

export const putIcd9ToIcd10 = (body) => api.put(`/api/Icd9ToIcd10`, body)

export const deleteIcd9ToIcd10 = (id) => api.delete(`/api/Icd9ToIcd10/${id}`)

// Icd10Pcs Icd10Pcs 根據Code獲取診斷資料  API；主鍵{id}為：Id
export const getIcd10Pcs = (query) => api.get(`/api/Icd10Pcs${query}`)

export const getIcd10PcsItem = (id) => api.get(`/api/Icd10Pcs${id}`)

export const postIcd10Pcs = (body) => api.post(`/api/Icd10Pcs`, body)

export const putIcd10Pcs = (body) => api.put(`/api/Icd10Pcs`, body)

export const deleteIcd10Pcs = (id) => api.delete(`/api/Icd10Pcs${id}`)

// Icd10PcsTable PCS Code組合清單
export const getIcd10PcsTable = (query) => api.get(`Icd10PcsTable/GetPcsList${query}`)

export const getIcd10PcsTableItem = (id) => api.get(`Icd10PcsTable/GetPcsList/${id}`)

export const postIcd10PcsTable = (body) => api.post(`Icd10PcsTable/GetPcsList`, body)

export const putIcd10PcsTable = (body) => api.put(`Icd10PcsTable/GetPcsList`, body)

export const deleteIcd10PcsTable = (id) => api.delete(`Icd10PcsTable/GetPcsList/${id}`)

// 折扣身分 IdentityDiscounts
export const getIdentityDiscounts = (query) => api.get(`/api/IdentityDiscounts${query}`)
export const getIdentityDiscountsItem = (id) => api.get(`/api/IdentityDiscounts/${id}`)
export const postIdentityDiscountsItem = (body) => api.post(`/api/IdentityDiscounts`, body)
export const putIdentityDiscountsItem = (body) => api.put(`/api/IdentityDiscounts`, body)
export const deleteIdentityDiscountsItem = (id) => api.delete(`/api/IdentityDiscounts/${id}`)
export const getIdentityDiscountsList = () => api.get(`/IdentityDiscount/SelectNoList`)

// 部分負擔 PartialAfford
export const getPartialAfford = (query) => api.get(`/api/PartialAfford${query}`)
export const getPartialAffordItem = (id) => api.get(`/api/PartialAfford/${id}`)
export const postPartialAffordItem = (body) => api.post(`/api/PartialAfford`, body)
export const putPartialAffordItem = (body) => api.put(`/api/PartialAfford`, body)
export const deletePartialAffordItem = (id) => api.delete(`/api/PartialAfford/${id}`)

export const getPartialAffordList = () => api.get(`/PartialAfford/SelectNoList`)

export const getPartialAffordPrice = (query = '') => api.get(`/PartialAfford/GetPartialAfford${query}`)
// 醫令 Procedure
export const getProcedure = (query) => api.get(`/api/Procedure${query}`)
export const getProcedureItem = (id) => api.get(`/api/Procedure/${id}`)
export const postProcedureItem = (body) => api.post(`/api/Procedure`, body)
export const putProcedureItem = (body) => api.put(`/api/Procedure`, body)
export const deleteProcedureItem = (id) => api.delete(`/api/Procedure/${id}`)

export const getProcedureRate = (query) => api.get(`/api/ProcedureRate${query}`)
export const getProcedureRateItem = (id) => api.get(`/api/ProcedureRate/${id}`)
export const postProcedureRateItem = (body) => api.post(`/api/ProcedureRate`, body)
export const putProcedureRateItem = (body) => api.put(`/api/ProcedureRate`, body)
export const deleteProcedureRateItem = (id) => api.delete(`/api/ProcedureRate/${id}`)

// 藥品 Drug
export const getDrug = (query) => api.get(`/api/Drug${query}`)
export const getDrugItem = (id) => api.get(`/api/Drug/${id}`)
export const postDrugItem = (body) => api.post(`/api/Drug`, body)
export const putDrugItem = (body) => api.put(`/api/Drug`, body)
export const deleteDrugItem = (id) => api.delete(`/api/Drug/${id}`)
export const uploadImage = (body) => api.put(`/api/Drug/uploadImage`, body)
export const putDrugStorePlace = (body) => api.put(`/Drug/StorePlaceCode`, body)

// 住院優免
export const getIpdDeductionHistory = (query) => api.get(`/api/IpdDeductionHistory${query}`)
export const getIpdDeductionHistoryItem = (id) => api.get(`/api/IpdDeductionHistory/${id}`)
export const postIpdDeductionHistory = (body) => api.post(`/api/IpdDeductionHistory`, body)
export const putIpdDeductionHistory = (body) => api.put(`/api/IpdDeductionHistory`, body)
export const deleteIpdDeductionHistoryItem = (id) => api.delete(`/api/IpdDeductionHistory/${id}`)
export const getIpdDeductionHistoryList = (id) => api.get(`/IpdDeductionHistory/getHistory/${id}`)

// 藥品廠商 MedVender
export const getMedVender = (query = '') => api.get(`/api/MedVender${query}`)

export const getMedVenderItem = (id) => api.get(`/api/MedVender/${id}`)

export const postMedVender = (body) => api.post(`/api/MedVender`, body)

export const putMedVender = (body) => api.put(`/api/MedVender`, body)

export const deleteMedVender = (id) => api.delete(`/api/MedVender/${id}`)

// 藥品廠商 PharmacyStore
export const getDrugStore = (query = '') => api.get(`/api/PharmacyStore${query}`)
export const getDrugStoreItem = (id) => api.get(`/api/PharmacyStore/${id}`)
export const postDrugStoreItem = (body) => api.post(`/api/PharmacyStore`, body)
export const putDrugStoreItem = (body) => api.put(`/api/PharmacyStore`, body)
export const deleteDrugStoreItem = (id) => api.delete(`/api/PharmacyStore/${id}`)

// 醫師週排程 WeekSchedule
export const getWeekSchedule = (query) => api.get(`/api/WeeksSchedule${query}`)
export const getWeekScheduleItem = (id) => api.get(`/api/WeeksSchedule/${id}`)
export const postWeekScheduleItem = (body) => api.post(`/api/WeeksSchedule`, body)
export const putWeekScheduleItem = (body) => api.put(`/api/WeeksSchedule`, body)
export const deleteWeekScheduleItem = (id) => api.delete(`/api/WeeksSchedule?id=${id}`)
export const putWeekScheduleSaveAll = (body) => api.put(`/WeeksSchedule/SaveAll`, body)
export const postWeekScheduleDuplicateLastWeek = (body) => api.post(`/WeeksSchedule/DuplicateLastWeek`, body)
export const getWeekScheduleList = (query) => api.get(`/WeeksSchedule/List${query}`)
export const getDayBooking = (query) => api.get(`/WeeksSchedule/GetBookingList${query}`)

// 診間 Room
export const getRoomSelectNoList = (query = '') => api.get(`/Room/SelectNoList`)

export const getRoomLst = (query = '') => api.get(`/api/Room${query}`)

export const postRoomLst = (body) => api.post(`/api/Room`, body)

export const putRoomLst = (body) => api.put(`/api/Room`, body)

export const deleteRoomLst = (id = '') => api.delete(`/api/Room/${id}`)

export const getRoomItem = (id = '') => api.get(`/api/Room/${id}`)

// 部門代碼
export const getDepartment = (query = '') => api.get(`/api/Department${query}`)
export const getDepartmentItem = (id) => api.get(`/api/Department/${id}`)
export const postDepartmentItem = (body) => api.post(`/api/Department`, body)
export const putDepartmentItem = (body) => api.put(`/api/Department`, body)
export const deleteDepartmentItem = (id) => api.delete(`/api/Department/${id}`)

// 門診醫師設定
export const getDoctor = (query = '') => api.get(`/api/Doctor${query}`)
export const getDoctorItem = (id) => api.get(`/api/Doctor/${id}`)
export const postDoctorItem = (body) => api.post(`/api/Doctor`, body)
export const putDoctorItem = (body) => api.put(`/api/Doctor`, body)
export const deleteDoctorItem = (id) => api.delete(`/api/Doctor/${id}`)

// 慢性病 (只有慢性病)
export const getChronic = (query = '') => api.get(`/api/Chronic${query}`)
export const getChronicItem = (id) => api.get(`/api/Chronic/${id}`)
export const postChronic = (body) => api.post(`/api/Chronic`, body)
export const putChronic = (body) => api.put(`/api/Chronic`, body)
export const deleteChronic = (id) => api.delete(`/api/Chronic/${id}`)

// 特定治療項目 (包含慢性病)
export const getSpecialCureChronic = (query = '') => api.get(`/api/ChronicItem${query}`)
export const getSpecialCureChronicItem = (id) => api.get(`/api/ChronicItem/${id}`)
export const postSpecialCureChronicItem = (body) => api.post(`/api/ChronicItem`, body)
export const putSpecialCureChronicItem = (body) => api.put(`/api/ChronicItem`, body)
export const deleteSpecialCureChronicItem = (id) => api.delete(`/api/ChronicItem/${id}`)

// 稽核紀錄
export const getAuditEvent = (query) => api.get(`/AuditEvent/AuditEvent${query}`)

export const getAuditEventTypes = () => api.get(`/AuditEvent/AuditEventTypes`)

// 展日排班
export const getDaySchedule = (query) => api.get(`/DaySchedule/List${query}`)

export const postExpandWorkSchedule = (body) => api.post(`/DaySchedule/ExpandWorkSchedule`, body)

export const postDayScheduleVacation = (body) => api.post(`/DaySchedule/Vacation`, body)

export const postDayScheduleVacationCancel = (body) => api.post(`/DaySchedule/VacationCancel`, body)

export const postDayScheduleModify = (body) => api.post(`/DaySchedule/Modify`, body)

export const deleteDaySchedule = (query) => api.delete(`/DaySchedule/Delete${query}`)

// 組套 S
export const getPresetSubjective = (query = '') => api.get(`/api/PresetSubjective${query}`)
export const getPresetSubjectiveItem = (id) => api.get(`/api/PresetSubjective/${id}`)
export const postPresetSubjectiveItem = (body) => api.post(`/api/PresetSubjective`, body)
export const putPresetSubjectiveItem = (body) => api.put(`/api/PresetSubjective`, body)
export const deletePresetSubjectiveItem = (id) => api.delete(`/api/PresetSubjective/${id}`)

// 組套 O
export const getPresetObjective = (query = '') => api.get(`/api/PresetObjective${query}`)
export const getPresetObjectiveItem = (id) => api.get(`/api/PresetObjective/${id}`)
export const postPresetObjectiveItem = (body) => api.post(`/api/PresetObjective`, body)
export const putPresetObjectiveItem = (body) => api.put(`/api/PresetObjective`, body)
export const deletePresetObjectiveItem = (id) => api.delete(`/api/PresetObjective/${id}`)

// 組套 A
export const getPresetDiagnosis = (query = '') => api.get(`/api/PresetDiagnosis${query}`)
export const getPresetDiagnosisItem = (id) => api.get(`/api/PresetDiagnosis/${id}`)
export const postPresetDiagnosisItem = (body) => api.post(`/api/PresetDiagnosis`, body)
export const putPresetDiagnosisItem = (body) => api.put(`/api/PresetDiagnosis`, body)
export const deletePresetDiagnosisItem = (id) => api.delete(`/api/PresetDiagnosis/${id}`)

// 組套 P
export const getPresetPlan = (query = '') => api.get(`/api/PresetPlan${query}`)
export const getPresetPlanItem = (id) => api.get(`/api/PresetPlan/${id}`)
export const postPresetPlanItem = (body) => api.post(`/api/PresetPlan`, body)
export const putPresetPlanItem = (body) => api.put(`/api/PresetPlan`, body)
export const deletePresetPlanItem = (id) => api.delete(`/api/PresetPlan/${id}`)

// 組套 M
export const getPresetMedication = (query = '') => api.get(`/api/PresetMedication${query}`)
export const getPresetMedicationItem = (id) => api.get(`/api/PresetMedication/${id}`)
export const postPresetMedicationItem = (body) => api.post(`/api/PresetMedication`, body)
export const putPresetMedicationItem = (body) => api.put(`/api/PresetMedication`, body)
export const deletePresetMedicationItem = (id) => api.delete(`/api/PresetMedication/${id}`)

// 組套 E
export const getPresetProcedure = (query = '') => api.get(`/api/PresetProcedure${query}`)
export const getPresetProcedureItem = (id) => api.get(`/api/PresetProcedure/${id}`)
export const postPresetProcedureItem = (body) => api.post(`/api/PresetProcedure`, body)
export const putPresetProcedureItem = (body) => api.put(`/api/PresetProcedure`, body)
export const deletePresetProcedureItem = (id) => api.delete(`/api/PresetProcedure/${id}`)

// 組套 科常用組套API DepPreset
export const getDepPreset = (query = '') => api.get(`/api/DepPreset${query}`)
export const getDepPresetItem = (id) => api.get(`/api/DepPreset/${id}`)
export const postDepPresetItem = (body) => api.post(`/api/DepPreset`, body)
export const putDepPresetItem = (body) => api.put(`/api/DepPreset`, body)
export const deleteDepPresetItem = (id) => api.delete(`/api/DepPreset/${id}`)

// 組套 特定治療組套API SpecialCure
export const getDepSpecialCurePresets = (query = '') => api.get(`/PresetContent/GetSpecialCureItemPresets${query}`)
export const getDepSpecialCurePresetItem = (id) => api.get(`/PresetContent/GetSpecialCureItemPreset?id=${id}`)
export const postDepSpecialCurePreset = (body) => api.post(`/PresetContent/PostSpecialCureItemPreset`, body)
export const putDepSpecialCurePreset = (body) => api.put(`/PresetContent/PutSpecialCureItemPreset`, body)
//組套 獲取單一組套 ContentItem
export const getPresetContentItem = (id) => api.get(`/api/PresetContent/${id}`)
export const deletePresetContentItem = (id) => api.delete(`api/PresetContent/${id}`)

// 病患資料
export const getPatient = (query = '') => api.get(`/api/Patient${query}`)
export const getPatientItem = (id) => api.get(`/api/Patient/${id}`)
export const postPatientItem = (body) => api.post(`/api/Patient`, body)
export const putPatientItem = (body) => api.put(`/api/Patient`, body)
export const deletePatientItem = (id) => api.delete(`/api/Patient/${id}`)

export const postPatient = (body) => api.post(`/api/Patient`, body)

export const putPatient = (body) => api.put(`/api/Patient`, body)

export const deletePatient = (id) => api.delete(`/api/Patient/${id}`)

export const getPatientInfo = (query = '') => api.get(`/Patient/GetPatientInfo${query}`)

// 身分對應 Dropdown
export const getRelationOften = (query) => api.get(`/CommonDataRelation/GetOften${query}`)

export const getRelationIdentityDiscount = (query) => api.get(`/CommonDataRelation/GetIdentityDiscount${query}`)

export const getRelationPartialAfford = (query) => api.get(`/CommonDataRelation/GetPartialAfford${query}`)

export const getRelationSeekMedical = (query) => api.get(`/CommonDataRelation/GetSeekMedical${query}`)

export const getRelationPrevent = (query) => api.get(`/CommonDataRelation/GetPrevent${query}`)

//診診關聯
export const getCommonDataRelation = (query) => api.get(`/api/CommonDataRelation${query}`)

export const putCommonDataItemRelation = (body) => api.put(`/api/CommonDataRelation`, body)

export const getCommonDataRelationModel = (id) => api.get(`/api/CommonDataRelation/${id}`)

// 掛號

export const getBookingPeople = (query = '') => api.get(`/RoomBooking/GetBookingPeople${query}`)

export const getAttendPeople = (query = '') => api.get(`/RoomBooking/GetAttendPeople${query}`)

export const getRoomBooking = (query = '') => api.get(`/api/RoomBooking${query}`)
export const getRoomBookingItem = (id) => api.get(`/api/RoomBooking/${id}`)
export const postRoomBooking = (body) => api.post(`/api/RoomBooking`, body)
export const putRoomBooking = (body) => api.put(`/api/RoomBooking`, body)
export const deleteRoomBooking = (id) => api.delete(`/api/RoomBooking/${id}`)

// 門診
export const roomBookingChangeStatus = (body) => api.put(`/RoomBooking/ChangeStatus`, body)

export const getDoctorAttend = () => api.get(`/RoomBooking/GetDoctorAttend`)

export const getSequence = (query) => api.get(`/RoomBooking/GetSequence${query}`)

export const getPatientBooking = (query = '') => api.get(`/RoomBooking/GetPatientBooking${query}`)

export const postOpd = (id) => api.post(`/OpdRecord/PostOpd?regid=${id}`)

export const getHistoryList = (query = '') => api.get(`/OpdRecord/GetHistoryList${query}`)

export const getERHistory = (query = '') => api.get(`/OpdRecord/GetERHistoryList${query}`)

export const getNextRegId = () => api.get(`/RoomBooking/GetNextRegId`)

export const getRegProgress = (query = '') => api.get(`/RoomBooking/GetRegProgress${query}`)

// 門診醫囑
export const getOpdRecordItem = (id) => api.get(`/api/OpdRecord/${id}`)

export const putOpdRecord = (body) => api.put(`/api/OpdRecord`, body)

export const getMeasure = (query) => api.get(`/OpdRecord/GetMeasure${query}`)

// 門診論病例計酬的診療項目
export const getOpdPieceProcedureList = (query = '') => api.get(`/OpdRecord/GetOpdPieceProcedureList${query}`)
// 門診論病例計酬的支付點數核算
export const getOpdNhiPointInfo = (query) => api.get(`/OpdPieceProcedure/GetNhiPointInfo${query}`)

// 健保門急診部分負擔設定
export const getSysLevelPartial = (query = '') => api.get(`/api/SysLevelPartial${query}`)

export const putSysLevelPartial = (body) => api.put(`/api/SysLevelPartial`, body)

// DITTO
export const getDITTOAll = (query) => api.get(`/api/DITTO/GetAll${query}`)
export const getDITTOHalfYear = (query) => api.get(`/api/DITTO/GetHalfYear${query}`)
export const getDITTOOneYear = (query) => api.get(`/api/DITTO/GetOneYear${query}`)
export const getDITTOTwoYear = (query) => api.get(`/api/DITTO/GetTwoYear${query}`)
export const getDITTOLastOne = (query) => api.get(`/api/DITTO/GetLastOne${query}`)

export const getDITTOErAll = (query) => api.get(`/api/DITTO/GetErAll${query}`)
export const getDITTOErHalfYear = (query) => api.get(`/api/DITTO/GetErHalfYear${query}`)
export const getDITTOErOneYear = (query) => api.get(`/api/DITTO/GetErOneYear${query}`)
export const getDITTOErTwoYear = (query) => api.get(`/api/DITTO/GetErTwoYear${query}`)
export const getDITTOErLastOne = (query) => api.get(`/api/DITTO/GetErLastOne${query}`)

export const getDITTOIpdAll = (query) => api.get(`/api/DITTO/GetIpdAll${query}`)
export const getDITTOIpdHalfYear = (query) => api.get(`/api/DITTO/GetIpdHalfYear${query}`)
export const getDITTOIpdOneYear = (query) => api.get(`/api/DITTO/GetIpdOneYear${query}`)
export const getDITTOIpdTwoYear = (query) => api.get(`/api/DITTO/GetIpdTwoYear${query}`)
export const getDITTOIpdLastOne = (query) => api.get(`/api/DITTO/GetIpdLastOne${query}`)

export const getDITTOItem = (id) => api.get(`/api/DITTO/${id}`)
export const postDITTO = (body) => api.post(`/api/DITTO`, body)
export const putDITTO = (body) => api.put(`/api/DITTO`, body)
export const deleteDITTO = (id) => api.delete(`/api/DITTO/${id}`)

// 過敏
export const getPatientFoodAllergy = (query = '') => api.get(`/api/PatientFoodAllergy${query}`)
export const getPatientFoodAllergyItem = (id) => api.get(`/api/PatientFoodAllergy/${id}`)
export const putPatientFoodAllergyItem = (body) => api.put(`/api/PatientFoodAllergy`, body)
export const postPatientFoodAllergyItem = (body) => api.post(`/api/PatientFoodAllergy`, body)
export const deletePatientFoodAllergyItem = (id) => api.delete(`/api/PatientFoodAllergy/${id}`)

export const getPatientAllergy = (query = '') => api.get(`/api/PatientAllergy${query}`)
export const getPatientAllergyItem = (id) => api.get(`/api/PatientAllergy/${id}`)
export const putPatientAllergyItem = (body) => api.put(`/api/PatientAllergy`, body)
export const postPatientAllergyItem = (body) => api.post(`/api/PatientAllergy`, body)
export const deletePatientAllergyItem = (id) => api.delete(`/api/PatientAllergy/${id}`)

// 病床固定費用
export const getHbedFixCharge = (query = '') => api.get(`/api/HbedFixCharge${query}`)
export const getHbedFixChargeItem = (id) => api.get(`/api/HbedFixCharge/${id}`)
export const putHbedFixChargeItem = (body) => api.put(`/api/HbedFixCharge`, body)
export const postHbedFixChargeItem = (body) => api.post(`/api/HbedFixCharge`, body)
export const deleteHbedFixChargeItem = (id) => api.delete(`/api/HbedFixCharge/${id}`)

// 用藥紀錄
export const getDrugRecord = (query) => api.get(`/OpdRecord/GetMedRecList${query}`)

// 取得申報列表
export const getDeclare = (query) => api.get(`/NHlDeclar/GetList${query}`)

export const getDeclareItem = (query) => api.get(`/NHlDeclar/GetDetail${query}`)

export const getDeclareDataMove = (query) => api.get(`/NHlDeclar/DeclarDataMove${query}`)

export const postDeclareDataCreate = (body) => api.post(`/NHlDeclar/DeclarDataCreate`, body)

export const putDeclare = (body) => api.put(`/NHlDeclar/Put`, body)

// 門診批價
export const getCharge = (query) => api.get(`/OpdCharge/GetChargeList${query}`)
export const postCalcCharge = (id) => api.post(`/OpdCharge/CalcCharge/${id}`)
export const getCalcCharge = (id) => api.get(`/OpdCharge/Charge/${id}`)
export const putChargePay = (body) => api.put(`/OpdCharge/Pay`, body)
export const getExportReceipt = (id) => api.get(`/OpdCharge/ExportReceipt?opdId=${id}`)

// 住院批價
export const getIpdChargeList = (query) => api.get(`/IpdCharge/GetChargeList${query}`)

export const getReceiveMedicine = (opdId) => api.get(`/OpdCharge/GetReceiveMedicine/${opdId}`)
export const putReceiveMedicine = (body) => api.put(`/OpdCharge/ReceiveMedicine`, body)
export const getReceiveMedicinePdf = (opdId) => api.get(`/OpdCharge/ExportReceiveMedicine?opdId=${opdId}`)
export const getDrugStoreList = (query) => api.get(`/OpdCharge/GetPharmacyList${query}`)
export const getErDrugStoreList = (query) => api.get(`/OpdCharge/GetErPharmacyList${query}`)

// export const getDeclareItem = (query) => api.get(`/NHlDeclar/GetDetail${query}`);

//ProcedureChange 醫令異動狀態API

export const getProcedureChange = (query) => api.get(`/api/ProcedureChange${query}`)

export const getProcedureChangeItem = (id) => api.get(`/api/ProcedureChange/${id}`)

export const postProcedureChange = (body) => api.post(`/api/ProcedureChange`, body)

export const putProcedureChange = (body) => api.put(`/api/ProcedureChange`, body)

export const deleteProcedureChange = (query) => api.delete(`/api/ProcedureChange/${query}`)

export const procedureAutoUpdate = () => api.get(`/ProcedureChange/AutoUpdate`)

//特定治療項目
export const getSpecialTherapy = (query) => api.get(`/api/SpecialTherapy${query}`)
export const getSpecialTherapyItem = (id) => api.get(`/api/SpecialTherapy/${id}`)
export const postSpecialTherapyItem = (body) => api.post(`/api/SpecialTherapy`, body)
export const putSpecialTherapyItem = (body) => api.put(`/api/SpecialTherapy`, body)
export const deleteSpecialTherapyItem = (id) => api.delete(`/api/SpecialTherapy/${id}`)

// 預防保健
export const getPrevent = (query) => api.get(`/api/Prevent${query}`)
export const getPreventItem = (id) => api.get(`/api/Prevent/${id}`)
export const postPreventItem = (body) => api.post(`/api/Prevent`, body)
export const putPreventItem = (body) => api.put(`/api/Prevent`, body)
export const deletePreventItem = (id) => api.delete(`/api/Prevent/${id}`)

// 醫令分類維護
export const getProcedureCategory = (query) => api.get(`/api/ProcedureCategory${query}`)
export const getProcedureCategoryItem = (id) => api.get(`/api/ProcedureCategory/${id}`)
export const postProcedureCategoryItem = (body) => api.post(`/api/ProcedureCategory`, body)
export const putProcedureCategoryItem = (body) => api.put(`/api/ProcedureCategory`, body)
export const deleteProcedureCategoryItem = (id) => api.delete(`/api/ProcedureCategory/${id}`)

// BasicPartial 門診基本部分負擔
export const getBasicPartial = (query = '') => api.get(`/api/BasicPartial${query}`)

export const getBasicPartialItem = (id) => api.get(`/api/BasicPartial/${id}`)

export const postBasicPartial = (body) => api.post(`/api/BasicPartial`, body)

export const putBasicPartial = (body) => api.put(`/api/BasicPartial`, body)

export const putBatchBasicPartial = (body) => api.put(`/BasicPartial/Put`, body)

export const deleteBasicPartial = (id) => api.delete(`/api/BasicPartial/${id}`)

// MedPartial 門診藥品部分負擔
export const getMedPartial = (query = '') => api.get(`/api/MedPartial${query}`)

export const getMedPartialItem = (id) => api.get(`/api/MedPartial/${id}`)

export const postMedPartial = (body) => api.post(`/api/MedPartial`, body)

export const putMedPartial = (body) => api.put(`/api/MedPartial`, body)

export const putBatchMedPartial = (body) => api.put(`/MedPartial/Put`, body)

export const deleteMedPartial = (id) => api.delete(`/api/MedPartial/${id}`)

// MedPartial 醫院部分負擔方式及金額維護
export const getOrgPartial = (query = '') => api.get(`/api/OrgPartial${query}`)
export const getOrgPartialItem = (id) => api.get(`/api/OrgPartial/${id}`)
export const postOrgPartialItem = (body) => api.post(`/api/OrgPartial`, body)
export const putOrgPartialItem = (body) => api.put(`/api/OrgPartial`, body)
export const deleteOrgPartialItem = (id) => api.delete(`/api/OrgPartial/${id}`)

// ProcedureNhi 院內收費項目資料維護
export const getProcedureNhi = (query = '') => api.get(`/api/ProcedureNhi${query}`)

export const getProcedureNhiItem = (id) => api.get(`/api/ProcedureNhi/${id}`)

export const postProcedureNhi = (body) => api.post(`/api/ProcedureNhi`, body)

export const putProcedureNhi = (body) => api.put(`/api/ProcedureNhi`, body)

export const deleteProcedureNhi = (id) => api.delete(`/api/ProcedureNhi/${id}`)

// 個案追蹤
export const getPatientTrace = (query = '') => api.get(`/PatientTrace/GetList${query}`)
export const getPatientTraceItem = (id) => api.get(`/api/PatientTrace/${id}`)
export const postPatientTrace = (body) => api.post(`/api/PatientTrace`, body)
export const putPatientTrace = (body) => api.put(`/api/PatientTrace`, body)
export const deletePatientTrace = (id) => api.delete(`/api/PatientTrace/${id}`)

// 個案追蹤 結核病
export const getPatientTraceTb = (query = '') => api.get(`/api/PatientTraceTb${query}`)

export const getPatientTraceTbItem = (id) => api.get(`/api/PatientTraceTb/${id}`)

export const postPatientTraceTb = (body) => api.post(`/api/PatientTraceTb`, body)

export const putPatientTraceTb = (body) => api.put(`/api/PatientTraceTb`, body)

export const deletePatientTraceTb = (id) => api.delete(`/api/PatientTraceTb/${id}`)

// 診斷證明
export const getCertificateItem = (id) => api.get(`/api/DiagnosisCertificate/${id}`)

export const getCertificatePDF = (id) => api.get(`/DiagnosisCertificate/ExportCertificate?opdId=${id}`)

export const postCertificate = (body) => api.post('/api/DiagnosisCertificate', body)

export const putCertificate = (body) => api.put('/api/DiagnosisCertificate', body)

// 藥房庫存
export const getStoreStock = (query) => api.get(`/api/StoreStock${query}`)
export const getStoreStockItem = (id) => api.get(`/api/StoreStock/${id}`)
export const postStoreStock = (body) => api.post(`/api/StoreStock`, body)
export const putStoreStock = (body) => api.put(`/api/StoreStock`, body)
export const deleteStoreStock = (id) => api.delete(`/api/StoreStock/${id}`)
export const putStoreStockToApply = (body) => api.put(`/StoreStock/ApplyPut`, body)

// 藥品申領單
export const getStoreStockApply = (query = '') => api.get(`/api/StoreStockApply${query}`)
export const getStoreStockApplyItem = (id) => api.get(`/api/StoreStockApply/${id}`)
export const postStoreStockApplyItem = (body) => api.post(`/api/StoreStockApply`, body)
export const putStoreStockApplyItem = (body) => api.put(`/api/StoreStockApply`, body)
export const deleteStoreStockApplyItem = (id) => api.delete(`/api/StoreStockApply/${id}`)
export const getNewApplyId = () => api.get(`/StoreStockApply/GetNewApplyId`)
export const getStoreStockDetail = (id) => api.get(`/StoreStockApply/GetStoreStockDetail?pharmacyId=${id}`)
export const putStoreStockApplyShip = (body) => api.put(`/StoreStockApply/ship`, body)
export const putApplyInStock = (body) => api.put(`/StoreStockApply/InStock`, body)
export const putApplyAllInStock = (body) => api.put(`/StoreStockApply/AllInStock`, body)
export const putEditInStock = (body) => api.put(`/StoreStockApply/PutInStock`, body)

// 藥品退庫單
export const getStoreStockReturn = (query = '') => api.get(`/api/StoreStockReturn${query}`)
export const getStoreStockReturnItem = (id) => api.get(`/api/StoreStockReturn/${id}`)
export const postStoreStockReturnItem = (body) => api.post(`/api/StoreStockReturn`, body)
export const putStoreStockReturnItem = (body) => api.put(`/api/StoreStockReturn`, body)
export const deleteStoreStockReturnItem = (id) => api.delete(`/api/StoreStockReturn/${id}`)
export const getNewReturnId = () => api.get(`/StoreStockReturn/GetNewReturnId`)
export const putStoreStockReturnCheckAccept = (body) => api.put(`/StoreStockReturn/CheckAccept`, body)

// 藥庫資料管理 > 庫存查詢作業 > 自動採購修改
export const putAutoBuy = (body) => api.put(`/Drug/AutoBuyPut`, body)

// 藥庫資料管理 > 採購單管理
export const getOrder = (query) => api.get(`/api/Order${query}`)
export const getOrderItem = (id) => api.get(`/api/Order/${id}`)
export const postOrder = (body) => api.post(`/api/Order`, body)
export const putOrder = (body) => api.put(`/api/Order`, body)
export const deleteOrder = (id) => api.delete(`/api/Order/${id}`)
export const getPurchaseItem = () => api.get(`/Order/GetOrderDetail`)
export const GetNewPurchaseId = () => api.get(`Order/GetNewPurchaseId`)

export const putSetInStock = (body) => api.put(`/Order/SetInStock`, body)
export const putAllStock = (body) => api.put(`/Order/AllStock`, body)

// 藥庫資料管理 > 藥品數量清點
export const getQuantityList = (query) => api.get(`/Drug/GetQuantityList${query}`)

export const getPriceUpdate = (query) => api.get(`/api/PriceUpdate${query}`)
export const getPriceUpdateItem = (id) => api.get(`/api/PriceUpdate/${id}`)
export const postPriceUpdate = (body) => api.post(`/api/PriceUpdate`, body)
export const putPriceUpdate = (body) => api.put(`/api/PriceUpdate`, body)
export const deletePriceUpdate = (id) => api.delete(`/api/PriceUpdate/${id}`)

export const postDoPriceUpdate = (body) => api.post(`/PriceUpdate/Update`, body)
export const postPriceUpdateExcel = () => api.post(`/PriceUpdate/ToExcel`)

// 牙面
export const getToothSurfaceCombinationList = () => api.get(`/GetToothSurfaceCombinationList`)

// 轉診單
export const getTransForm = (query) => api.post(`/api/TransForm${query}`)
export const getTransFormItem = (id) => api.post(`/api/TransForm/${id}`)
export const postTransForm = (body) => api.post(`/api/TransForm`, body)
export const putTransForm = (body) => api.post(`/api/TransForm`, body)
export const deleteTransForm = (id) => api.post(`/api/TransForm/${id}`)

// 特材
export const getSpecialMedicalMaterial = (query) => api.get(`/api/SpecialMedicalMaterial${query}`)
export const getSpecialMedicalMaterialItem = (id) => api.get(`/api/SpecialMedicalMaterial/${id}`)
export const postSpecialMedicalMaterialItem = (body) => api.post(`/api/SpecialMedicalMaterial`, body)
export const putSpecialMedicalMaterialItem = (body) => api.put(`/api/SpecialMedicalMaterial`, body)
export const deleteSpecialMedicalMaterialItem = (id) => api.delete(`/api/SpecialMedicalMaterial/${id}`)

// 轉診單 > 取得PDF
export const getTransFormPDF = (id) => api.get(`/TransForm/ExportReport?opdId=${id}`)

//急診
export const getPatientERStatus = (query) => api.get(`/CommonData/GetERTrend`, { params: query })
export const getERStatus = (query) => api.get(`/CommonData/GetERStatus`, { params: query })
export const getAfterERTreatment = (query) => api.get(`/CommonData/GetERAfterProcess`, { params: query })

//急診病患清單
export const getERList = (query = '') => api.get(`/RoomBooking/GetERList${query}`)

//藥品交互作用
export const getDrugInteractList = (query = '') => api.get(`/DrugInteract/GetDrugInteractList${query}`)
export const getDrugInteractItem = (id) => api.get(`/api/DrugInteract/${id}`)
export const postDrugInteractItem = (body) => api.post(`/api/DrugInteract`, body)
export const putDrugInteractItem = (body) => api.put(`/api/DrugInteract`, body)
export const deleteDrugInteractItem = (id) => api.delete(`/api/DrugInteract/${id}`)

//重大傷病
export const checkMajorInjury = (query) => api.get(`/OpdMajorInjury/CheckMajorInjury`, { params: query })
export const getOpdMajorInjury = (query) => api.get(`/api/OpdMajorInjury`, { params: query })
export const getMajorInjury = (query) => api.get(`/api/MajorInjury`, { params: query })

export const getERDepartment = (query) => api.get(`/CommonData/GetERDepartment`, query)

export const getWriteNhiCardBase64 = (id) => api.get(`/OpdRecord/GetWriteNhiCardBase64/${id}`)

//護理站及床位管理
export const getHospitalBed = (query = '') => api.get(`/api/HospitalBed${query}`)
export const getHospitalBedItem = (id) => api.get(`/api/HospitalBed/${id}`)
export const postHospitalBedItem = (body) => api.post(`/api/HospitalBed`, body)
export const putHospitalBedItem = (body) => api.put(`/api/HospitalBed`, body)
export const deleteHospitalBedItem = (id) => api.delete(`/api/HospitalBed/${id}`)
export const getHospitalBedList = (query = '') => api.get(`/HospitalBed/GetList${query}`)

//護理站管理
export const getNursingStation = (query = '') => api.get(`/api/NursingStation${query}`)
export const postNursingStation = (body) => api.post(`/api/NursingStation`, body)
export const putNursingStation = (body) => api.put(`/api/NursingStation`, body)
export const deleteNursingStation = (id) => api.delete(`/api/NursingStation/${id}`)

// 護理站伙食
export const getHospitalFood = (query) => api.get(`/api/HospitalFood${query}`)
export const getHospitalFoodItem = (id) => api.get(`/api/HospitalFood/${id}`)
export const postHospitalFood = (body) => api.post(`/api/HospitalFood`, body)
export const putHospitalFood = (body) => api.put(`/api/HospitalFood`, body)
export const deleteHospitalFood = (id) => api.delete(`/api/HospitalFood/${id}`)

// 護理站身分變更
export const getIpdIdentityChange = (query) => api.get(`/api/IpdIdentityChangeLog${query}`)
export const getIpdIdentityChangeItem = (id) => api.get(`/api/IpdIdentityChangeLog/${id}`)
export const postIpdIdentityChange = (body) => api.post(`/api/IpdIdentityChangeLog`, body)
export const putIpdIdentityChange = (body) => api.put(`/api/IpdIdentityChangeLog`, body)
export const deleteIpdIdentityChangeItem = (id) => api.delete(`/api/IpdIdentityChangeLog/${id}`)

// 護理站床位變更
export const getIpdHbedChangeLog = (query) => api.get(`/api/IpdHbedChangeLog${query}`)
export const getIpdHbedChangeLogItem = (id) => api.get(`/api/IpdHbedChangeLog/${id}`)
export const postIpdHbedChangeLog = (body) => api.post(`/api/IpdHbedChangeLog`, body)
export const putIpdHbedChangeLog = (body) => api.put(`/api/IpdHbedChangeLog`, body)
export const deleteIpdHbedChangeLogItem = (id) => api.delete(`/api/IpdHbedChangeLog/${id}`)

// 住院醫師
export const getIpdDoctor = (query = '') => api.get(`/api/IpdDoctor/${query}`)

// 住院紀錄
export const getIpdRecordList = (query = '') => api.get(`/IpdRecord/GetIpdRecordList${query}`)
export const getIpdRecord = (query = '') => api.get(`/api/IpdRecord${query}`)
export const getIpdRecordItem = (id) => api.get(`/api/IpdRecord/${id}`)
export const postIpdRecordItem = (body) => api.post(`/api/IpdRecord`, body)
export const putIpdRecordItem = (body) => api.put(`/api/IpdRecord`, body)
export const deleteIpdRecordItem = (id) => api.delete(`/api/IpdRecord?id=${id}`)
export const getIsPatientReserve = (query = '') => api.get(`/IpdRecord/GetPatient${query}`)
export const getIpdRecordConsentPdf = (id) => api.get(`/IpdRecord/ExportInpatientAgreement?IpdId=${id}`)
export const getIpdRecordBarCode = (id) => api.get(`/IpdRecord/ExportBarCode?PatientId=${id}`)
export const getIpdHfoods = (id) => api.get(`/IpdRecord/GetIpdHfoods?ipdId=${id}`)

// 出院給藥
export const getIpdDischargeMedications = (id) => api.get(`/IpdRecord/GetIpdDischargeMedications?ipdId=${id}`)
export const putIpdDischargeMedications = (body) => api.put(`/IpdRecord/PutIpdDischargeMedications`, body)

// 住院伙食記錄
export const getIpdHfood = (query) => api.get(`/api/IpdHfood${query}`)
export const getIpdHfoodItem = (id) => api.get(`/api/IpdHfood/${id}`)
export const postIpdHfood = (body) => api.post(`/api/IpdHfood`, body)
export const putIpdHfood = (body) => api.put(`/api/IpdHfood`, body)
export const deleteIpdHfood = (id) => api.delete(`/api/IpdHfood/${id}`)
export const postIpdHfoodInsertAll = (body) => api.post(`/IpdHfood/InsertAll`, body)

//急診週排班設定
export const getEmployeeSelectPersonList = (query = '') => api.get(`/Employee/SelectPersonList${query}`)

export const getErEmployeeList = (query = '') => api.get(`/Employee/GetErEmployeeList${query}`)

export const getNurseList = (query = '') => api.get(`/api/Nurse${query}`)
export const getEmployeeEr = (query = '') => api.get(`/api/Employee${query}`)
export const postErSchedule = (body) => api.post(`/api/ErSchedule`, body)
export const putErSchedule = (body) => api.put(`/api/ErSchedule`, body)
export const getErSchedule = (query = '') => api.get(`/api/ErSchedule${query}`)
export const getErScheduleList = (query = '') => api.get(`/ErSchedule/List${query}`)
export const postErScheduleDuplicateLastWeek = (body) => api.post(`/ErSchedule/DuplicateLastWeek`, body)
export const getErScheduleId = (id) => api.get(`/api/ErSchedule/${id}`)
export const deleteErScheduleId = (id) => api.delete(`/api/ErSchedule/${id}`)
export const putErScheduleSaveAll = (body) => api.put(`/ErSchedule/SaveAll`, body)

//護理師設定
export const getNurseItem = (id) => api.get(`/api/Nurse/${id}`)

//護理站-醫師及護理師週排班設定
export const getNursingSchedule = (query = '') => api.get(`api/NursingSchedule${query}`)
export const getNursingScheduleItem = (id) => api.get(`/api/NursingSchedule/${id}`)
export const postNursingScheduleItem = (body) => api.post(`/api/NursingSchedule`, body)
export const putNursingScheduleItem = (body) => api.put(`/api/NursingSchedule`, body)
export const deleteNursingScheduleItem = (id) => api.delete(`/api/NursingSchedule/${id}`)
export const putNursingScheduleSaveAll = (body) => api.put(`/NursingSchedule/SaveAll`, body)
export const getNursingScheduleList = (query = '') => api.get(`/NursingSchedule/List${query}`)
export const postNursingScheduleDuplicateLastWeek = (body) => api.post(`NursingSchedule/DuplicateLastWeek`, body)
export const getIpdEmployeeList = (query = '') => api.get(`/Employee/GetIpdEmployeeList${query}`)

//住院論病例計酬-不同診療項目下所有階段表格API
export const getIpdPieceProcedureAllStep = (query) => api.get(`/IpdPieceProcedure/GetIpdPieceProcedureAllStep${query}`)

//住院論病例計酬-不同診療項目下 tw-drgs表格 API
export const getIpdPieceProcedure = (query) => api.get(`/api/IpdPieceProcedure${query}`)
export const getIpdPieceProcedureItem = (query) => api.get(`/IpdPieceProcedure/GetIpdPieceProcedure${query}`)
export const postIpdPieceProcedure = (body) => api.post(`/api/IpdPieceProcedure`, body)
export const putIpdPieceProcedure = (body) => api.put(`/api/IpdPieceProcedure`, body)
export const deleteIpdPieceProcedure = (id) => api.delete(`/api/IpdPieceProcedure/${id}`)

//住院論病例計酬-不同診療項目下 單一階段表格 API
export const getIpdPieceProcedureStep = (query) => api.get(`/api/IpdPieceProcedureStep${query}`)
//論病例計酬-根據不同診療項目ID 獲取診療項目要求紀錄表 API
export const getOpdPieceProcedure = (query) => api.get(`/Procedure/PieceProcedure/GetOpdPieceProcedure${query}`)
//住院論病例計酬-不同診療項目下 手術診斷ICD-10限制 API
export const getDiagnosisAllList = (query) => api.get(`/Procedure/PieceProcedure/GetDiagnosisAllList${query}`)
//住院論病例計酬-不同診療項目下 PCS限制 API
export const getIcd10PcsAllList = (query) => api.get(`/Procedure/PieceProcedure/GetIcd10PcsAllList${query}`)
//住院論病例計酬-不同診療項目下 支付點數核算 API
export const getNhiPointInfo = (query) => api.get(`/IpdPieceProcedure/GetNhiPointInfo${query}`)

//住院論病例計酬-診療項目階段API
export const getIpdPieceProcedureStepItem = (id) => api.get(`/api/IpdPieceProcedureStep/${id}`)
export const postIpdPieceProcedureStep = (body) => api.post(`/api/IpdPieceProcedureStep`, body)
export const putIpdPieceProcedureStep = (body) => api.put(`/api/IpdPieceProcedureStep`, body)
export const deleteIpdPieceProcedureStep = (id) => api.delete(`/api/IpdPieceProcedureStep/${id}`)

//Tw-DRGs-組套API
export const getPieceProcedurePreset = (query = '') => api.get(`/api/PieceProcedurePreset${query}`)
export const getPieceProcedurePresetItem = (id) => api.get(`/api/PieceProcedurePreset/${id}`)
export const postPieceProcedurePreset = (body) => api.post(`/api/PieceProcedurePreset`, body)
export const putPieceProcedurePreset = (body) => api.put(`/api/PieceProcedurePreset`, body)
export const deletePieceProcedurePreset = (id) => api.delete(`/api/PieceProcedurePreset/${id}`)

export const getPcsvCodeList = (query) => api.get(`/Icd10PcsvDrg/GetPcsvCodeList${query}`)
export const getIcd10PcsvDrg = (query) => api.get(`/api/Icd10PcsvDrg${query}`)

export const getIcd10Pcs71DetailGetList = (query) => api.get(`/Icd10Pcs71Detail/GetList${query}`)
export const getIcd10Pcs71 = (query) => api.get(`/api/Icd10Pcs71${query}`)
export const getIcd10Pcs71Detail = (query) => api.get(`/api/Icd10Pcs71Detail${query}`)
export const getIcd10Pcs711 = (query) => api.get(`/api/Icd10Pcs711${query}`)
export const getIcd10Pcs712 = (query) => api.get(`/api/Icd10Pcs712${query}`)
export const getIcd10Pcs7131 = (query) => api.get(`/api/Icd10Pcs7131${query}`)
export const getIcd10Pcs713 = (query) => api.get(`/api/Icd10Pcs713${query}`)
export const getIcd10Pcs7141 = (query) => api.get(`/api/Icd10Pcs7141${query}`)
export const getIcd10Pcs7142 = (query) => api.get(`/api/Icd10Pcs7142${query}`)
export const getIcd10Pcs714 = (query) => api.get(`/api/Icd10Pcs714${query}`)
export const getIcd10Pcs715 = (query) => api.get(`/api/Icd10Pcs715${query}`)
export const getIcd10Pcs716 = (query) => api.get(`/api/Icd10Pcs716${query}`)
export const getIcd10Pcs717 = (query) => api.get(`/api/Icd10Pcs717${query}`)
export const getIcd10Pcs718 = (query) => api.get(`/api/Icd10Pcs718${query}`)
export const getIcd10Pcs719 = (query) => api.get(`/api/Icd10Pcs719${query}`)
export const getIcd10Pcs7110 = (query) => api.get(`/api/Icd10Pcs7110${query}`)
export const getIcd10Pcs7112 = (query) => api.get(`/api/Icd10Pcs7112${query}`)
export const getIcd10Pcs72 = (query) => api.get(`/api/Icd10Pcs72${query}`)
export const getIcd10Pcs73 = (query) => api.get(`/api/Icd10Pcs73${query}`)
export const getIcd10Pcsv = (query) => api.get(`/api/Icd10Pcsv${query}`)
export const getDrgProcedureNhi = (query) => api.get(`/ProcedureNhi/PieceProcedure/GetDrgMappingList${query}`)

//Icd10CMTable searchedAdd 引導式搜尋 api
export const getIcd10CMTable = (query = '') => api.get(`/Icd10CMCode${query}`)

//IpdProgressNote 住院醫囑-開立醫囑-手術診斷  api
export const getIpdDiagnosis = (query = '') => api.get(`/IpdRecord/GetIpdDiagnosis${query}`)
export const putIpdDiagnosis = (body) => api.put(`/IpdRecord/PutIpdDiagnosis`, body)
//IpdProgressNote 住院醫囑-開立醫囑-病程紀錄  api
export const getIpdProgressNote = (query = '') => api.get(`/api/IpdProgressNote${query}`)
export const getIpdProgressNoteItem = (id) => api.get(`/api/IpdProgressNote/${id}`)
export const postIpdProgressNote = (body) => api.post(`/api/IpdProgressNote`, body)
export const putIpdProgressNote = (body) => api.put(`/api/IpdProgressNote`, body)
export const deleteIpdProgressNote = (id) => api.delete(`/api/IpdProgressNote/${id}`)

//IpdMedications 住院醫囑-開立醫囑-用藥紀錄  api
export const getIpdMedicationsItem = (id) => api.get(`/IpdRecord/GetIpdMedications?ipdId=${id}`)
export const postIpdMedications = (body) => api.post(`/IpdRecord/PostIpdMedications`, body)
export const putIpdMedications = (body) => api.put(`/IpdRecord/PutIpdMedications`, body)

// 取得住院用藥組套
export const getIpdMedicationPresets = (query = '') => api.get(`/PresetContent/GetIpdMedicationPresets${query}`)
export const getIpdMedicationPresetsItem = (id) => api.get(`/PresetContent/GetIpdMedicationPreset?id=${id}`)
export const postIpdMedicationPreset = (body) => api.post(`/PresetContent/PostIpdMedicationPreset`, body)
export const putIpdMedicationPreset = (body) => api.put(`/PresetContent/PutIpdMedicationPreset`, body)
export const deleteIpdMedicationPreset = (id) => api.delete(`/api//PresetContent/${id}`)

//getIpdExecuteMedicationsItem 住院醫囑-開立醫囑-用藥紀錄 下面的表格 住院給藥紀錄  api
export const getIpdExecuteMedicationsItem = (id) => api.get(`/IpdRecord/GetIpdExecuteMedications?ipdId=${id}`)

//IpdProcedures 住院醫囑-開立醫囑-E檢查治療  api
export const getIpdProceduresItem = (id) => api.get(`/IpdRecord/GetIpdProcedures?ipdId=${id}`)
export const putIpdProcedures = (body) => api.put(`/IpdRecord/PutIpdProcedures`, body)

//IpdProcedures 住院醫囑-開立醫囑-Tw-DRGs  api
export const getIpdTwDrgsItem = (query = '') => api.get(`/IpdRecord/GetIpdTwDrgsItem${query}`)
export const putIpdTwDrgsItem = (body) => api.put(`/IpdRecord/PutIpdTwDrgsItem`, body)

//2023-03-17
export const getIpdMedicationsById = (id) => api.get(`/IpdRecord/GetIpdMedications?ipdId=${id}`)

//IpdNursingNote 護理紀錄 api
export const getIpdNursingNote = (query = '') => api.get(`/api/IpdNursingNote${query}`)
export const getIpdNursingNoteItem = (id) => api.get(`/api/IpdNursingNote/${id}`)
export const postIpdNursingNote = (body) => api.post(`/api/IpdNursingNote`, body)
export const putIpdNursingNote = (body) => api.put(`/api/IpdNursingNote`, body)
export const deleteIpdNursingNote = (id) => api.delete(`/api/IpdNursingNote/${id}`)

//IpdNursingShift 護理交班紀錄 api
export const getIpdNursingShift = (query = '') => api.get(`/api/IpdNursingShift${query}`)
export const getIpdNursingShiftItem = (id) => api.get(`/api/IpdNursingShift/${id}`)
export const postIpdNursingShift = (body) => api.post(`/api/IpdNursingShift`, body)
export const putIpdNursingShift = (body) => api.put(`/api/IpdNursingShift`, body)
export const deleteIpdNursingShift = (id) => api.delete(`/api/IpdNursingShift/${id}`)

// GetNursingAllBedList 帶交班的床位
export const getNursingAllBedList = (query = '') => api.get(`/IpdNursingShift/GetNursingAllBedList${query}`)
export const postNursingAllBedList = (body) => api.post(`/IpdNursingShift/InsertAll`, body)

// GetIpdMedicationHours 護理站 取得住院給藥時程
export const getIpdMedicationHours = (query = '') => api.get(`/IpdRecord/GetIpdMedicationHours${query}`)

// GetIpdMedicationHours 護理站 取得執行給藥 要給藥的清單
export const getIpdMedicationsTakeList = (query = '') => api.get(`/IpdRecord/GetIpdMedicationsTakeList${query}`)
export const putIpdMedicationsTakeList = (body) => api.put(`/IpdRecord/PutIpdTakeMedications`, body)

// GetIpdVitalSign 護理站 取得生命象徵清單
export const getIpdVitalSign = (query = '') => api.get(`/api/IpdVitalSign${query}`)
export const getIpdVitalSignItem = (id) => api.get(`/api/IpdVitalSign/${id}`)
export const postIpdVitalSignItem = (body) => api.post(`/api/IpdVitalSign`, body)
export const putIpdVitalSignItem = (body) => api.put(`/api/IpdVitalSign`, body)
export const deleteIpdVitalSignItem = (id) => api.delete(`/api/IpdVitalSign/${id}`)

// 未服用原因
export const getNonTakeReason = () => api.get(`/CommonData/GetNonTakeReason`)

// 測試 判斷是否為「主要合併症或併發症」
export const checkComorbidity = (body) => api.post(`/Icd10Cm/CheckComorbidity`, body)

// 根據 ipdId 取得住院手術耗材
export const getIpdOperationMaterial = (query = '') => api.get(`/IpdRecord/GetIpdOperationMaterial${query}`)
export const putIpdOperationMaterial = (body) => api.put(`/IpdRecord/PutIpdOperationMaterial`, body)

// 取得手術耗材組套
export const getOperationMaterialPreset = (query = '') => api.get(`/PresetContent/GetOperationMaterialPresets${query}`)
export const postOperationMaterialPreset = (body) => api.post(`/PresetContent/PostOperationMaterialPreset`, body)
export const putOperationMaterialPreset = (body) => api.put(`/PresetContent/PutOperationMaterialPreset`, body)
export const deleteOperationMaterialPreset = (id) => api.delete(`/api//PresetContent/${id}`)

export const getOpdPacsOrder = (query = '') => api.get(`/api/OpdPacsOrder${query}`)
export const getOpdPacsOrderItem = (id) => api.get(`/api/OpdPacsOrder/${id}`)
export const postOpdPacsOrderItem = (body) => api.post(`/api/OpdPacsOrder`, body)
export const putOpdPacsOrderItem = (body) => api.put(`/api/OpdPacsOrder`, body)
export const deleteOpdPacsOrderItem = (id) => api.delete(`/api/OpdPacsOrder/${id}`)
export const getOpdPacsOrderByOpdId = (opdId) => api.get(`/OpdPacsOrder/GetPacs?OpdId=${opdId}`)

// 取得預約手術排程
export const getOpdOperationReserveItem = (id) => api.get(`/OpdRecord/GetOpdOperationReserve?opdId=${id}`)
export const putOpdOperationReserve = (body) => api.put(`/OpdRecord/PutOpdOperationReserve`, body)
// 取得預約手術排程 手術時間選項
export const getOperationTime = () => api.get(`/CommonData/GetOperationTime`)

// 病患來源
export const getPatientSourceDropdown = () => api.get(`/CommonData/GetPatientSource`)

// 員工List (醫師/護士)
export const getEmployeeSelectNoList = (query = '') => api.get(`/Employee/SelectNoList${query}`)

// 住院註記
export const getInpatientNoteDropdown = () => api.get(`/CommonData/GetInpatientNote`)

// DRG 編審
export const postFindDRG = (body) => api.post(`/Icd10Cm/FindDRG`, body)

// 病患前次門診慢箋紀錄
export const getOpdPreChronicMedications = (query = '') => api.get(`/Patient/GetOpdPreChronicMedications${query}`)

export const getIpdNasogastricTube = (query = '') => api.get(`/IpdRecord/IpdNasogastricTube/List${query}`)
export const getIpdNasogastricTubeItem = (id) => api.get(`/IpdRecord/IpdNasogastricTube/Get?id=${id}`)
export const putIpdNasogastricTubeItem = (body) => api.put(`/IpdRecord/IpdNasogastricTube/Put`, body)
export const deleteIpdNasogastricTubeItem = (id) => api.delete(`/IpdRecord/IpdNasogastricTube/Delete?id=${id}`)

// 取得中醫表格分頁清單
export const getNhiFormChineseMedicine = (query = '') => api.get(`/NhiForm/ChineseMedicine/List${query}`)
// 健保表格
export const getNhiForm = (query = '') => api.get(`/api/NhiForm${query}`)
export const postNhiForm = (body) => api.post(`/api/NhiForm`, body)
export const putNhiForm = (body) => api.put(`/api/NhiForm`, body)
export const deleteNhiForm = (id) => api.delete(`/api/NhiForm?id=${id}`)

// 取得中醫表格分頁清單
export const postCalculateDRG = (body) => api.post(`/Icd10Pcs73/CalculateDRG`, body)
// 取得中醫特定疾病清單
export const getTcmSpecificDiseaseList = (query = '') => api.get(`/OpdRecord/GetTcmSpecificDiseaseList${query}`)

// 取得診療部位(一般部位)清單
export const getMedicalPart = () => api.get(`/CommonData/GetMedicalPart`)

// 取得診療部位(牙科)清單
export const getToothMedicalPart = () => api.get(`/CommonData/GetToothMedicalPart`)

// 住院批價明細
export const getIpdCharge = (id) => api.get(`/IpdCharge/Charge/${id}`)

// 住院批價pdf
export const getIpdChargePdf = ({ ipdid, pdfType, id }) =>
  api.get(`/IpdCharge/ExportIpdReceipt/${ipdid}?pdfType=${pdfType}${!!id ? `&id=${id}` : ''}`)

// 預繳費用歷程
export const getPrepaidHistory = (id) => api.get(`IpdCharge/getPrepaidHistory/${id}`)

// 取得病床類別清單
export const getHbedType = () => api.get(`/CommonData/GetHbedType`)

// 取得病床類別清單
export const getExportChronicMedicine = (opdId) => api.get(`/OpdCharge/ExportChronicMedicine?opdId=${opdId}`)

// 獲取住院論病例計酬診療項目
export const getIpdPieceProcedureList = (query = '') => api.get(`/IpdRecord/GetIpdPieceProcedureList${query}`)
