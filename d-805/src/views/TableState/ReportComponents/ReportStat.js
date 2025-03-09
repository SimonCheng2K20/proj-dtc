
const ReportDaysCompleted = [
  //WORKDATE 需要改變
  { key: 'Days', label: '日期差', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'O_Count', label: '門', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'E_Count', label: '急', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'I_Count', label: '住', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'G_Count', label: '健', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'T_Count', label: '轉', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'U_Count', label: '其它', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Total', label: '總計', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
]

const ReportMonthCompleted = ['天數/來源', '門', '急', '住', '健', '轉', '診', '總計']
//這個天數/源是什麼意思，1月為什麼會有2月3日等等…
const ReportYearsCompleted = [
  '天數/月份',
  '一月',
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
  '總計',
]

const NowYear = new Date().getFullYear() - 1911
const AmendReportAnalysis = ['一', '二', '三', '四']
  .reduce(
    (acc, cur, idx) => {
      const months = new Array(3).fill('').map((v, i) => NowYear + ('00' + (idx * 3 + (i + 1))).slice(-2))
      return acc.concat([...months, `第${cur}季`])
    },
    ['設備', '項目']
  )
  .concat('年度總計')
const ReportList = [
  {
    text: '請選擇',
    value: null,
  },
  {
    text: '每月報告完成天數統計',
    value: 'report1',
  },
  {
    text: '報告完成數月分析',
    value: 'report2',
  },
  {
    text: '報告完成天數年度分析',
    value: 'report3',
  },
  {
    text: '醫師修改報告分析表',
    value: 'report4',
  },
  {
    text: '高風險通報記錄',
    value: 'report5',
  },
  {
    text: '影像醫學部櫃枱排程狀況週報',
    value: 'report6',
  },
]

const hrrCompleted = [
  //WORKDATE 需要改變
  { key: 'NoticeTimeForShow', label: '發送時間', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'DxreportPhysicianName', label: '發送者', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'RequestingPhysicianId', label: '開單醫師', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Tel', label: '手機號碼', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'StudyTimeForShow', label: '檢查時間', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientId', label: '病歷號', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientName', label: '病患姓名', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'OrderNo', label: '檢查單號', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'ProcedureNameList', label: '檢查項目', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  // { key: 'HRRLevel', label: '通報等級', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  // { key: 'HRRItemDesc', label: '通報項目', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Message', label: '簡訊內容', sortable: false, tdClass: 'no-wrap text-left MX-W-350' },
  { key: 'SmsStatusText', label: '簡訊接收狀況', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap text-left MX-W-350' },
  { key: 'ReturnCodeText', label: '醫師回傳代碼', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap text-left MX-W-350' },
]

// 申請單號>>病歷號>>病患姓名>>病患來源>>報告醫師>>檢查碼>>檢查項目>>檢查日期>>報告日期>>儀器

const reportAmount = [
  { key: 'RowNum', label: 'RowNum', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'OrderNo', label: '申請單號', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientId', label: '病歷號', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientName', label: '病患姓名', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientSourceTypeCode', label: '病患來源', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'IssuePhysicianName', label: '報告醫師', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'ProcedureCode', label: '檢查碼', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'ProcedureName', label: '檢查項目', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'StudyTime', label: '檢查日期', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'IssueTime', label: '報告日期', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Modality', label: '儀器', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' }
]

const reportAmountEmr = [
  { key: 'RowNum', label: 'RowNum', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'OrderNo', label: '申請單號', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientId', label: '病歷號', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientName', label: '病患姓名', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'PatientSourceTypeCode', label: '病患來源', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'IssuePhysicianName', label: '報告醫師', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'ProcedureCode', label: '檢查碼', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'ProcedureName', label: '檢查項目', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'StudyTime', label: '檢查日期', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'IssueTime', label: '報告日期', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Modality', label: '儀器', sortable: true, thClass: 'no-wrap', tdClass: 'no-wrap' },
  { key: 'Times', label: '完成時間間隔', sortable: false, thClass: 'no-wrap', tdClass: 'no-wrap' }
]

const tOptions = (options = []) => {
  return {
    key: options[0] ? options[0] : '',
    label: options[1] ? options[1] : '',
    sortable: options[2] ? options[2] : false,
    thClass: options[3] ? options[3] : 'no-wrap',
    tdClass: options[4] ? options[4] : 'no-wrap',
  }
}
const reportFailImages = [
  tOptions(['AccessionNo', '檢查單號']),
  tOptions(['PatientId', '病歷號碼']),
  tOptions(['PatientSourceTypeCode', '診別']),
  tOptions(['DxreportPhysicianName', '報告醫師']),
  tOptions(['ProcedureCode', '檢查碼']),
  tOptions(['ProcedureName', '檢查項目名稱']),
  tOptions(['StudyTime', '進影時間']),
  tOptions(['EmployeeCodeName', '放射師']),
  tOptions(['Reason', '醫師備註', null, null, 'nowrap text-left MX-W-350']),
  tOptions(['IssueTime', '報告發送時間']),
  tOptions(['Type', '註記']),
  tOptions(['CreateTime', '記錄時間', true]),
]

export { ReportDaysCompleted, ReportMonthCompleted, ReportYearsCompleted, AmendReportAnalysis, ReportList, hrrCompleted, reportAmount, reportAmountEmr, reportFailImages }
