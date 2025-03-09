const tableConfig4QueryResult = [
  {
    key: "EmgFlagName",
    label: "類別",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "StatusName",
    label: "報到狀態",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "isShiftNote",
    label: "交班記錄",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "IsPreAudit",
    label: "審單記錄",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientSourceTypeName",
    label: "病患來源",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "AccessionNo",
    label: "申請單號",
    sortable: false,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },

  {
    key: "PatientId",
    label: "病歷號",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "OtherPatientId",
    label: "身分證字號",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ProcedureName",
    label: "檢查項目",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "PatientName",
    label: "姓名",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientSex",
    label: "性別",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "OrderDate",
    label: "開單日期",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ScheduleTime",
    label: "檢查日期",
    sortable: false,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  }
];
const IsPreAudit = [
  { value: null, text: "請選擇" },
  { value: "尚未審單", text: "尚未審單" },
  { value: "審單完成", text: "審單完成" }
];
export { tableConfig4QueryResult, IsPreAudit };
