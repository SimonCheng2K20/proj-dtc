import * as configs from '@/config'
// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control
const KeyCode4Alternate = configs.KeyCode4Alternate

export const defaultHotKeyArr = [
  // F1 to F10
  { hotkey: 'F2', default: 'F2', method: 'callPacs', title: '呼叫PACS' },
  {
    hotkey: 'F3',
    default: 'F3',
    method: 'WinMass4Objective',
    title: '醫師客觀',
  },
  {
    hotkey: 'F4',
    default: 'F4',
    method: 'WinMass4Subjective',
    title: '病患主訴',
  },

  {
    hotkey: 'F8',
    default: 'F8',
    method: 'InstantPhraseCreate',
    title: '快速片語建立',
  },

  // Alt + key

  {
    hotkey: KeyCode4Alternate + 'F3',
    default: KeyCode4Alternate + 'F3',
    method: 'backToPreviousRoute',
    title: '返回清單',
  },
  {
    hotkey: KeyCode4Control + 'F1',
    default: KeyCode4Control + 'F1',
    method: 'toggleDetailView',
    title: '顯示詳情',
  },
  {
    hotkey: KeyCode4Control + 'F6',
    default: KeyCode4Control + 'F6',
    method: 'togglePatientDetailView',
    title: '顯示病患詳情',
  },
  {
    hotkey: KeyCode4Control + 'F8',
    default: KeyCode4Control + 'F8',
    method: 'toggleNavigation',
    title: '顯示頭部',
  },

  {
    hotkey: KeyCode4Alternate + 'F5',
    default: KeyCode4Alternate + 'F5',
    method: 'goNextHistory',
    title: '歷史診斷報告到下一筆',
  },
  {
    hotkey: KeyCode4Alternate + 'F6',
    default: KeyCode4Alternate + 'F6',
    method: 'goPrevHistory',
    title: '歷史診斷報告到上一筆',
  },
  {
    hotkey: KeyCode4Alternate + 'F7',
    default: KeyCode4Alternate + 'F7',
    method: 'openHistory',
    title: '開啟歷史診斷報告',
  },
  {
    hotkey: KeyCode4Alternate + 'F8',
    default: KeyCode4Alternate + 'F8',
    method: 'addNoteB4Save',
    title: '修改正式報告',
  },
  {
    hotkey: KeyCode4Alternate + 'F9',
    default: KeyCode4Alternate + 'F9',
    method: 'focusUpdate2Objective',
    title: '切換至客觀',
  },
  {
    hotkey: KeyCode4Alternate + 'F11',
    default: KeyCode4Alternate + 'F11',
    method: 'WinMass4Icd10',
    title: 'ICD-10',
  },

  // nav next record keys Crl+ key
  // {
  //   hotkey: KeyCode4Control + "F6",
  //   default: KeyCode4Control + "F6",
  //   method: "viewNextRecord",
  //   title: "到下一筆報告撰寫作業",
  // },
  // {
  //   hotkey: KeyCode4Control + "F7",
  //   default: KeyCode4Control + "F7",
  //   method: "viewPrevRecord",
  //   title: "到上一筆報告撰寫作業",
  // },

  {
    hotkey: KeyCode4Control + 'ARROWLEFT',
    default: KeyCode4Control + 'ARROWLEFT',
    method: 'viewPrevRecord',
    title: '上一筆報告撰寫作業',
  },

  {
    hotkey: KeyCode4Control + 'ARROWRIGHT',
    default: KeyCode4Control + 'ARROWRIGHT',
    method: 'viewNextRecord',
    title: '下一筆報告撰寫作業',
  },

  {
    hotkey: KeyCode4Control + 'E',
    default: KeyCode4Control + 'E',
    method: 'FocusOnContent',
    title: '跳至報告編輯',
  },

  {
    hotkey: KeyCode4Alternate + 'V',
    default: KeyCode4Alternate + 'V',
    method: 'insertHistoryContent',
    title: '插入歷史報告內容',
  },
  // {
  //   hotkey: KeyCode4Alternate + "X",
  //   default: KeyCode4Alternate + "X",
  //   method: "handleCanvasImage",
  //   title: "處理圖片",
  // },
  //this.viewNextRecord
]

export const modifyOptions1 = [
  { id: 'tesion', value: 1, text: '閱片太快' },
  {
    id: 'pne',
    value: 2,
    text: '行政疏忽(例如: 打錯字, 手寫代碼錯誤, 報告與影像不符)',
  },
  { id: 'active', value: 3, text: '配合臨床' },
  { id: 'tb', value: 4, text: '獲得其他影像資訊' },
  { id: 'last', value: 5, text: '不良影像' },
  // newly added at 2020-Mar 17
  { id: 'my6', value: 6, text: '癌症報告修改' },
  { id: 'my7', value: 7, text: '使用癌症報告格式' },
  { id: 'my8', value: 8, text: '修改癌症期別' },
  { id: 'my15', value: 15, text: '診斷錯誤' },
]

export const modifyOptions2 = [
  { id: 'my10', value: 10, text: '報告內容與檢查項目不符' },
  { id: 'my11', value: 11, text: '初步報告' },
  { id: 'my12', value: 12, text: '打錯左右邊' },
  { id: 'my13', value: 13, text: '打錯部位' },
  { id: 'my14', value: 14, text: '打錯病人' },
  { id: 'my9', value: 9, text: '自行發現', why: true, input: '' },
  { id: 'my16', value: 16, text: '臨床醫師反應', why: true, input: '' },
  { id: 'my17', value: 17, text: '科內醫師反應', why: true, input: '' },
  { id: 'others', value: 90, text: '其他', why: true, input: '' },
]

export const configCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  {
    key: 'EmgFlag',
    label: '急作',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'StatusName',
    label: '狀態',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'DxreportPhysicianName',
    label: '報告醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'IssuePhysicianName',
    label: '審核醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'DueTimeStr',
    label: '逾期',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'EncounterNo',
    label: '批價序號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'AccessionNo',
    label: '申請單號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'ProcedureNameList',
    label: '檢查項目',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'Modality',
    label: '儀器類別',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'PatientSourceTypeName',
    label: '病患來源',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientId',
    label: '病歷號',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientName',
    label: '姓名',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientSex',
    label: '性別',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  // {
  //   key: "PatientBirthday",
  //   label: "生日",
  //   sortable: false,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap"
  // },
  {
    key: 'PatientAge',
    label: '年齡',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'ScheduleTimeForShow', // ProcedureCompleted
    label: '檢查日期',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'StudyTime',
    label: '影像到位日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
]

export const configsCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  // {
  //   key: "Additions",
  //   label: "加成",
  //   sortable: true,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap",
  // },
  {
    key: 'EmgFlag',
    label: '急作',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'StatusName',
    label: '狀態',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'DxreportPhysicianName',
    label: '報告醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'IssuePhysicianName',
    label: '審核醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'DueTimeStr',
    label: '逾期',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'EncounterNo',
    label: '批價序號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'AccessionNo',
    label: '申請單號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'ProcedureNameList',
    label: '檢查項目',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'Modality',
    label: '儀器類別',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'PatientSourceTypeName',
    label: '病患來源',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientId',
    label: '病歷號',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-bold',
  },
  {
    key: 'PatientName',
    label: '姓名',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientSex',
    label: '性別',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  // {
  //   key: "PatientBirthday",
  //   label: "生日",
  //   sortable: false,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap"
  // },
  {
    key: 'PatientAge',
    label: '年齡',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  // {
  //   key: "CounterRegisterForShow", // ProcedureCompleted
  //   label: "報到日期",
  //   sortable: false,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap",
  // },
  {
    key: 'IssueTimeForShow', // ProcedureCompleted
    label: '報告日期',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },

  {
    key: 'StudyTime',
    label: '檢查日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
]

export const tabTags = (id) => {
  return [
    { label: '全部', id: 'FI0304_all', theme: 'primary', count: 0, disabled: false },
    { label: '急診', id: 'FI0304_emy', theme: 'danger', count: 0, disabled: false },
    { label: '門診', id: 'FI0304_door', theme: 'success', count: 0, disabled: false },
    { label: '住院', id: 'FI0304_live', theme: 'info', count: 0, disabled: false },
    id == '21'
      ? {
          label: '待審核',
          id: 'FI0304_pendingAppr',
          theme: '',
          count: 0,
          disabled: false,
        }
      : null,
    { label: '健診', id: 'FI0304_hr', theme: 'primary', count: 0, disabled: false },
  ].filter((tab) => tab)
}

export const urgOptions = [
  { id: 'tesion', value: 1, text: 'Tension Pneumothorax' },
  { id: 'pne', value: 2, text: 'Pneumoperitoneum' },
  {
    id: 'active',
    value: 3,
    text: 'Active bleeding in thorax and abdomen',
  },
  { id: 'tb', value: 4, text: 'TB with cavitation' },
  {
    id: 'last',
    value: 5,
    text: 'Aortic aneurysm(diameter >= 5CM) or Aortic dissection',
  },
  { id: 'others', value: 90, text: 'Others' },
]

export const urg2Options = [
  { id: 'tb2', value: 1, text: 'R/O TB' },
  { id: 'tumor', value: 2, text: 'Unsuspected tumor' },
  { id: 'pne2', value: 3, text: 'Pneumothorax' },
  {
    id: 'active2',
    value: 4,
    text: 'Aortic aneurysm (diameter >= 4~<5cm)',
  },
  { id: 'others2', value: 90, text: 'Others' },
]

export const norOptions = [
  { id: 'lung', value: 1, text: '健檢New Lung Lesion' },
  { id: 'fracture', value: 2, text: 'Compression Fracture' },
  { id: 'others3', value: 90, text: 'Others' },
]

export const fi0307ConfigCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },DxrVersion
  {
    key: 'DxrVersionForShow',
    label: '報告版次',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'PatientId',
    label: '病歷號',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'OtherPatientId',
    label: '身分證字號',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },

  {
    key: 'PatientName',
    label: '病患姓名',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientSex',
    label: '性別',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },

  {
    key: 'PatientAge',
    label: '年齡',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'BedNo',
    label: '病床號',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'ProcedureName',
    label: '檢查項目',
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'OrderNo',
    label: '申請單號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'ScheduleTime',
    label: '檢查日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientSourceTypeName',
    label: '病患來源',
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },

  {
    key: 'DxreportPhysicianName',
    label: '分派醫生',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'IssuePhysicianName',
    label: '審核醫師',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'EditDxreportPhysicianName',
    label: '撰寫人員',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'EditDxreportPhysicianName',
    label: '撰寫人員',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'OrderDateForShow',
    label: '開單日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'RequestingPhysicianName',
    label: '開單醫師',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'ScheduleTime',
    label: '檢查日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'CounterRegisterForShow',
    label: '報到日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'NoticeTimeForShow',
    label: '通報記錄',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'RequestingServiceName',
    label: '開單科別',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'EmgFlagName',
    label: '類別',
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'Modality',
    label: '儀器',
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
]

export const ViewData = {
  //申請單號
  AccessionNo: '',
  //病歷號
  PatientId: '',
  //檢查起
  ScheduleTimeStart: '',
  //檢查訖
  ScheduleTimeEnd: '',
  //檢查起
  ReportTimeStart: '',
  //檢查訖
  ReportTimeEnd: '',
  //檢查項目
  ProcedureCode: '',
  ProcedureCodeShow: '',
  //性別
  PatientSex: '',
  //年齡
  PatientAge: '',
  //區間年齡 底
  PatientAgeMax: '',
  //病患來源
  //病患條件
  PatientSourceTypeCode: null,
  //報告醫生
  DxreportPhysicianId: '',
  DxreportPhysician: '',

  //審核醫生
  IssuePhysicianId: '',
  IssuePhysician: '',

  //開單科別
  RequestingServiceId: '',
  RequestingService: '',

  //列印格式0:A4 1:B6 預設0
  printType: 0,

  WhitelistAction: 'AND',
  BlacklistAction: 'AND',

  Modalities: [],

  PatientAgeAction: '=',
}

export const FI0304TableField = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  // {
  //   key: "Additions",
  //   label: "加成",
  //   sortable: true,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap",
  // },
  {
    key: 'EmgFlag',
    label: '急作',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'StatusName',
    label: '狀態',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'DxreportPhysicianName',
    label: '報告醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'IssuePhysicianName',
    label: '審核醫師',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'DueTimeStr',
    label: '逾期',
    sortable: false,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'EncounterNo',
    label: '批價序號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'AccessionNo',
    label: '申請單號',
    sortable: true,
    thClass: 'text-nowrap',
    tdClass: 'no-wrap font-weight-bold',
  },
  {
    key: 'ProcedureNameList',
    label: '檢查項目',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'Modality',
    label: '儀器類別',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-left',
  },
  {
    key: 'PatientSourceTypeName',
    label: '病患來源',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientId',
    label: '病歷號',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap text-bold',
  },
  {
    key: 'PatientName',
    label: '姓名',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  {
    key: 'PatientSex',
    label: '性別',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  // {
  //   key: "PatientBirthday",
  //   label: "生日",
  //   sortable: false,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap"
  // },
  {
    key: 'PatientAge',
    label: '年齡',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
  // {
  //   key: "CounterRegisterForShow", // ProcedureCompleted
  //   label: "報到日期",
  //   sortable: false,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap",
  // },
  {
    key: 'IssueTimeForShow', // ProcedureCompleted
    label: '報告日期',
    sortable: false,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },

  {
    key: 'StudyTime',
    label: '檢查日期',
    sortable: true,
    thClass: 'no-wrap',
    tdClass: 'no-wrap',
  },
]
