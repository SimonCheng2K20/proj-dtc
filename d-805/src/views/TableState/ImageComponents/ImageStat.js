//Img1 - Shanmu data ok
const ExamItemFields = [
  { key: "checkItemCode", label: "檢查項目代碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "checkItem", label: "檢查項目", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "outPatient", label: "門診", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "emergency", label: "急診", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "hospitalized", label: "住院", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "healthCheck", label: "健檢", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralCheck", label: "轉檢", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralPatient", label: "轉診", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
];
//Img2 - Shanmu NO data
const PhysExamItemFields = [
  { key: "CheckType", label: "類別", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CheckItemCode", label: "檢查項目代碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CheckItem", label: "檢查項目代碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_1", label: "醫師1", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_2", label: "醫師2", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_3", label: "醫師3", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_4", label: "醫師4", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_5", label: "醫師5", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_6", label: "醫師6", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_7", label: "醫師7", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_8", label: "醫師8", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_9", label: "醫師9", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_10", label: "醫師10", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_11", label: "醫師11", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_12", label: "醫師12", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_13", label: "醫師13", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_14", label: "醫師14", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_15", label: "醫師15", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_16", label: "醫師16", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_17", label: "醫師17", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_18", label: "醫師18", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_19", label: "醫師19", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_20", label: "醫師20", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Doctor_21", label: "醫師21", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "DoctorSum", label: "醫師合計", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
];
//Img3 - Shanmu NO data
const PhysExamReportListFields = [
  { key: "No", label: "檢查單號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PatientID", label: "病歷號碼", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "PatientName", label: "病患姓名", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Source", label: "來源", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "Device", label: "儀器", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CheckInDate", label: "報到日期", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CheckItem", label: "檢查項目", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CheckDescription", label: "檢查說明", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "RequestingPhysician", label: "開單醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CertificationPhysician", label: "認證醫師", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "CertificationDate", label: "認證日期", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
];
//img4
const PhysReportDaysFields = [
  { key: "PHYSICIAN_NAME", label: "讀片醫生", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "outPatient", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "outPatientAvg ", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "emergency", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "emergencyAvg", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "hospitalized", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "hospitalizedAvg", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "healthCheck", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "healthCheckAvg", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralCheck", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralCheckAvg", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralPatient", label: "看病量", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "referralPatientAvg", label: "平均報告時間", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "AvgDay", label: "平均天數", sortable: true, thClass: "no-wrap", tdClass: "no-wrap" },
];
//Img5 - Shanmu
const ChangeRecordFields = [
  { key: "No", label: "編號" },
  { key: "ChengeDate", label: "修改日期" },
  { key: "GraphDate", label: "攝影日期" },
  { key: "PatientID", label: "病歷號" },
  { key: "Name", label: "姓名" },
  { key: "ServiceID", label: "科別" },
  { key: "modality", label: "儀器類別" },
  { key: "checkItem", label: "檢查項目" },
  { key: "TrainedPhysician", label: "受訓醫師" },
];
//Img6
const ChangeCauseFields = [
  { key: "ImageDxReportMRModel.WORKDATE", label: "修改原因" },
  // { key: "ImageDxReportMRModel.MODIFYREASONID ", label: "修改份數/百分比" },
  { key: "ImageDxReportMRModel.GDATANAME", label: "GDATANAME " },
  { key: "ImageDxReportMRModel.CT ", label: "CT" },
  { key: "ImageDxReportMRModel.MRI ", label: "MRI" },
  { key: "ImageDxReportMRModel.XRAY", label: "X-ray" },
  { key: "ImageDxReportMRModel.SPECIAL", label: "Special" },
  { key: "ImageDxReportMRModel.Total ", label: "總計" },
];

//Img7
const ReportModifyFields = [
  { key: "RELEASE_VERSION", label: "版號" },
  { key: "PATIENT_ID", label: "病歷號" },
  { key: "PATIENT_NAME", label: "病患姓名 " },
  { key: "COUNTER_REGISTER", label: "檢查日期" },
  { key: "REPORT_DATE", label: "報告日期" },
  { key: "CHENGE_DATE", label: "修改日期" },
  { key: "MODALITY", label: "儀器種類" },
  { key: "ORDER_NO", label: "檢查單號" },
  { key: "PROCEDURE_NAME", label: "檢查項目" },
  { key: "PATIENT_SOURCE_TYPE_NAME", label: "病患來源" },
  { key: "DXREPORT_PHYSICIAN_NAME", label: "報告撰寫者" },
  { key: "APPROVAL_PHYSICIAN_NAME", label: "審核醫師" },
  { key: "REQUESTING_SERVICE_NAME", label: "開單科別" },
  { key: "MODIFYEXPRESS_INFO", label: "反映人員" },
  { key: "MODIFYEXPRESS", label: "反映事項" },
  { key: "MODIFYREASON", label: "報告修改原因" },
  { key: "MODIFYMAJORCAUSE", label: "重要修改內容" },
];

const ImageList = [
  {
    text: "請選擇",
    value: null,
  },
  {
    text: "檢查項目及來源統計月報表",
    value: "image1",
  },
  {
    text: "各醫師檢查類別及項目統計表",
    value: "image2",
  },
  {
    text: "各醫師報告清單",
    value: "image3",
  },
  {
    text: "各醫師報告平均天數",
    value: "image4",
  },
  // {
  //   text: "修改紀錄清單",
  //   value: "image5",
  // },
  // {
  //   text: "修改報告原因分類",
  //   value: "image6",
  // },
  {
    text: "報告修改匯出清單",
    value: "image7",
  },
];
export { ExamItemFields, PhysExamItemFields, PhysExamReportListFields, PhysReportDaysFields, ChangeRecordFields, ChangeCauseFields, ImageList, ReportModifyFields };
