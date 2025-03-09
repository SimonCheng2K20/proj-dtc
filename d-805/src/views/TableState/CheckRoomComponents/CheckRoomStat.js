// C1
const CRStat = [
  { key: "IsEnter", label: "結果登錄", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientId", label: "病歷號碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientName", label: "病患姓名", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "OrderNo", label: "檢查單號", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientSourceType", label: "病患來源", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ChargeTypeId", label: "身份別", sortable: false, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "SelfPay", label: "自費註記", sortable: false, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "Modality", label: "儀器種類", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureCode", label: "檢查代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureName", label: "檢查項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RequestingServiceName", label: "科診別", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ScheduleLocationName", label: "檢查室名稱", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RadiographerNote", label: "備註", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RequestingPhysicianName", label: "開單醫師姓名", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "OrderDate", label: "開單日期時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CounterRegister", label: "報到日期時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ScheduleTime", label: "排程日期時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PerformRadiographerName", label: "放射師", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureStart", label: "檢查開始時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureCompleted", label: "檢查結束時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReportInitialTime", label: "報告認證時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "IssueTime", label: "報告修改時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "IsChange", label: "是否修改", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "IssuePhysicianName", label: "認證醫師", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ScheduleWaitTime", label: "排程等待時間(分)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RegisterWaitTime", label: "現場等待(分)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  // { key: "keyReportWaitTime27", label: "報告等待(小時)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReportWaitTimeHour", label: "報告等待(小時)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  
  // { key: "TotalTime", label: "檢查總時間(分)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "StudyTime", label: "照攝時間(分)", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TransferDoctorName", label: "轉檢醫師", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TransferInstitutionName", label: "轉檢醫院", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReferralsDoctorName", label: "轉診醫師", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReferralsInstitutionName", label: "轉診醫院", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];
//C2 - Shanmu data ok
const MnthFinishCheckList = [
  { key: "Resault", label: "結果登入", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReportStatus", label: "報告狀態", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PhotographyDateTime", label: "攝影日期", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Order_No", label: "檢查單號", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Exam_No", label: "Exam No", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MODALITY", label: "儀器種類", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ExamResult", label: "檢查結果", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientInfo", label: "病患資料", sortable: true, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "PhotographyDepartment", label: "攝影項目", sortable: true, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "PhotographyDepartmentName", label: "攝影名稱", sortable: true, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "PatientSourceTypeCode", label: "來源", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RequestingServiceName", label: "科診別", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ChargeTypeId", label: "身份", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PriceType", label: "自費", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "BedNo", label: "床號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "IssuePhysicianName", label: "報告醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RequestingPhysicianName", label: "申請醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PerformRadiographerName", label: "執行放射師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "QC_RadiographerName", label: "QC放射師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PerformNurse", label: "護理師 ", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  // { key: "No", label: "序號 ", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  // { key: "PersonNum", label: "人數 ", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Remark", label: "備註 ", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckStartDate", label: "檢查開始日", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckendDate", label: "檢查結束日", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "REFERRALS_INSTITUTION_NAME", label: "轉診醫院", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "REFERRING_PHYSICIAN", label: "轉診醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TRANSFER_INSTITUTION_NAME", label: "轉檢醫院", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TRANSFER_DOCTOR_NAME", label: "轉檢醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RoomName", label: "檢查室", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];
//C3 - Shanmu NO data
const CheckItemstat = [
  { key: "ServiceID", label: "科別代碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "SERVICE", label: "科診別", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckItemNo", label: "檢查項目代碼", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckItem", label: "檢查項目", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "OutPatient", label: "門診", sortable: true, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Emergency", label: "急診", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Hospitalized", label: "住院", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "HealthCheck", label: "健檢", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReferralCheck", label: "轉檢", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ReferralPatient", label: "轉診", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];

// C4
const SourceTable = [
  { key: "Modality", label: "項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Date", label: "日期", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count1", label: "項次", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition1", label: "成長數", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate1", label: "成長比", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count2", label: "項次 ", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition2", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate2", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count3", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition3", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate3", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count4", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition4", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate4", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count5", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition5", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate5", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Count6  ", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Addition6", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AdditionRate6", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TotalCount", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TotalAddition", label: "成長數", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TotalAdditionRate", label: "成長比", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];

// C5
const EveryCRStat = () =>
  [{ key: "RoomName", label: "檢查室", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" }].concat(
    new Array(12).fill("").reduce(
      (a, c, i) =>
        a.concat([
          { key: "PresonCount" + (i + 1), label: "數量", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
          { key: "Count" + (i + 1), label: "人次", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
        ]),
      []
    )
  );

// C6
const WorkLoading = [
  // { key: "Modality", label: "項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "No", label: "No", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Name", label: "姓名", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CR", label: "CR", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CT", label: "CT", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ES", label: "ES", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MG", label: "MG", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MR", label: "MR", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "OT", label: "OT", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RF", label: "RF", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "US", label: "US", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "XA", label: "XA", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "TotalCount", label: "總計", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
];
//C7
const MedicationNoUsedDetail = [
  { key: "ScheduleCompleteTime", label: "攝影時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },

  { key: "login", label: "登入", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientSourceTypeName", label: "來源", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ExamNo", label: "Exam No", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientName", label: "姓名", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "AccessionNo", label: "工作單號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureCode", label: "攝影代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MedicationEmployeeName", label: "登錄者", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ProcedureName", label: "攝影項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientId", label: "病歷號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PriceType", label: "註記", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MedicationNo", label: "耗材代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MedicationName", label: "耗材名稱", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "SubName", label: "子代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Quantity", label: "數量", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ScheduleLocationName", label: "攝影室", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];
//C8

const DayMonthReport = () => {
  return [
    { key: "MedicationNo", label: "代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
    { key: "MedicationName", label: "名稱", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
    { key: "SubName", label: "子分類", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
    { key: "PriceType", label: "註記", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
    ...new Array(31).fill("").map((v, i) => ({ key: "Day" + (i + 1), label: i + 1 + "", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" })),
    { key: "Amount", label: "總和", sortable: false, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  ];
};

//C9
const ExamMedication = [
  { key: "ScheduleCompleteTimeForShow", label: "攝影時間", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },

  { key: "login", label: "登入", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PatientSourceTypeName", label: "來源", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "ExamNo", label: "Exam No", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PatientName", label: "姓名", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "AccessionNo", label: "工作單號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "ProcedureCode", label: "攝影代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },

  { key: "MedicationEmployeeName", label: "登錄者", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },

  { key: "ProcedureName", label: "攝影項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PatientId", label: "病歷號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PriceType", label: "註記", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "MedicationNo", label: "耗材代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "MedicationName", label: "耗材名稱", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "SubName", label: "子代碼", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Quantity", label: "數量", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "ScheduleLocationName", label: "攝影室", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
];
//C10
const CTMRI = [
  { key: "EXRId", label: "檢查室代號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "RoomName", label: "檢查室名稱", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckDate", label: "檢查日期", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckDateTime", label: "檢查時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckItemNo", label: "檢查計價代碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "NHINO", label: "轉換碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CheckItemName", label: "檢查項目名稱", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "OrderNo", label: "檢查單號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "PatientID", label: "病歷號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Name", label: "姓名", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Sex", label: "姓別", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Age", label: "年齡", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Weight", label: "體重", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "MedWarning", label: "過敏藥物", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "EGFR_LabNo", label: "EGFR Lab No", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "EGFR_ThisDate", label: "EGFR This Date", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "EGFR_Data", label: "EGFR Data", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "EGFR_Remark", label: "EGFR Remark", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Freet4LabNo", label: "Free-T4 No", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Freet4ThisDate", label: "Free-T4 This Date", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Freet4Data", label: "Free-T4 Data", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Freet4Remark", label: "Free-T4 Remark", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Phone", label: "聯絡電話1", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Mobile", label: "聯絡電話2", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "CreatedTTM", label: "開單日期", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "DoctorName", label: "開單醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Note", label: "備註", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ICD_10_1", label: "ICD-10 Code 1", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Diagnosis_1", label: "診斷 1", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ICD_10_2", label: "ICD-20 Code 2", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Diagnosis_2", label: "診斷 2", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ICD_10_3", label: "ICD-30 Code 3", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "Diagnosis_3", label: "診斷 3", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "SubDesc", label: "Sub Desc", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
  { key: "ObjDesc", label: "ObjDesc", sortable: true, thClass: "no-wrap", tdClass: "no-wrap font-weight-bold" },
];

//C11
const FailImages = [
  { key: "PROCEDURE_COMPLETED", label: "檢查日期", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "ACCESSION_NO", label: "單號", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "TYPE_NAME", label: "分類", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "MODALITY_NAME", label: "影像種類", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "STEP_COMBO", label: "發現階段", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PROCEDURE_NAME", label: "檢查項目", thClass: "no-wrap", tdClass: "no-wrap" },

  { key: "PHYSICIAN_NAME", label: "記錄人", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CREATEDTTM", label: "紀錄日期", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PERFORM_RADIOGRAPHER_1_NAME", label: "放射師1", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PERFORM_RADIOGRAPHER_2_NAME", label: "放射師2", thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "QC_RADIOGRAPHER_NAME", label: "QC放射師", thClass: "no-wrap", tdClass: "no-wrap" },
];
const optionsSelectedImageType = [
  {
    value: null,
    text: "請選擇",
  },
  {
    value: "C1",
    text: "檢查報到清單",
  },
  {
    value: "C2",
    text: "完成檢查清單",
  },
  {
    value: "C3",
    text: "各科診別檢查項目統計表",
  },
  {
    value: "C4",
    text: "各檢查類別及來源統計表",
  },
  {
    value: "C5",
    text: "各檢查室統計總表",
  },
  {
    value: "C6",
    text: "放射師個人工作量",
  },
  {
    value: "C7",
    text: "單一耗材使用明細表",
  },
  {
    value: "C8",
    text: "所有衛材所有檢查室日月報表",
  },
  {
    value: "C9",
    text: "攝影室耗材使用明細表",
  },
  {
    value: "C10",
    text: "CT MRI 檢查排程清單",
  },
  {
    value: "C11",
    text: "不良影像",
  },
];
export {
  optionsSelectedImageType,
  CRStat,
  SourceTable,
  MnthFinishCheckList,
  MedicationNoUsedDetail,
  WorkLoading,
  EveryCRStat,
  CheckItemstat,
  DayMonthReport,
  ExamMedication,
  CTMRI,
  FailImages,
};
