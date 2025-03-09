export const tableConfig4QueryResult = [
  {
    key: "EmgFlagName",
    label: "類別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 1,
  },
  // {
  //   key: "StatusName",
  //   label: "報到狀態",
  //   sortable: true,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap"
  // },
  {
    key: "PatientName",
    label: "姓名",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 3,
  },
  {
    key: "OtherPatientId",
    label: "身分證字號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 5,
  },
  {
    key: "ProcedureName",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left",
    order: 7,
  },
  {
    key: "PatientSourceTypeName", // PatientSourceTypeCode, PatientSourceTypeName, Modality
    label: "病患來源",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 10,
  },
  {
    key: "AccessionNo",
    label: "申請單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold",
    order: 8,
  },

  {
    key: "PatientId",
    label: "病歷號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 2,
  },

  {
    key: "PatientSex",
    label: "性別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 4,
  },
  {
    key: "OrderDate_forShow",
    label: "開單日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 16,
  },
  {
    key: "ScheduleTime_forShow",
    label: "檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 19,
  },
  {
    key: "CounterRegister_forShow",
    label: "報到日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 20,
  },
];

const tableConfig4Mix = [
  {
    key: "ProcedureCode",
    label: "檢查項目代碼",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 6,
  },
  {
    key: "LabCustomizeSerial",
    label: "Exam No",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 9,
  },
  {
    key: "BedNo",
    label: "病床號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 11,
  },
  {
    key: "StatusName",
    label: "狀態",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 12,
  },
  {
    key: "DxreportPhysicianName",
    label: "分派醫生",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 13,
  },
  {
    key: "EditDxreportPhysicianName",
    label: "輸入者",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 14,
  },

  {
    key: "IssuePhysicianName",
    label: "審核醫生",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 15,
  },
  {
    key: "IssueTime_forShow",
    label: "報告時間",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 16,
  },
  {
    key: "RequestingPhysicianName",
    label: "開單醫師",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 17,
  },
  {
    key: "RequestingServiceName",
    label: "開單科別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
    order: 18,
  },
];

export const tableConfig4MixResult = () => {
  const copiedTableConfig = [...JSON.parse(JSON.stringify(tableConfig4QueryResult)), ...tableConfig4Mix].sort((t1, t2) => (t1.order >= t2.order ? 1 : -1));
  copiedTableConfig.forEach((item) => {
    if (item.label === "檢查日期") item.key = "ProcedureCompleted_forShow";
  });
  return copiedTableConfig;
};

export const tableConfig4TodayList = [
  {
    key: "AccessionNo",
    label: "申請單號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PatientId",
    label: "病歷號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PatientName",
    label: "姓名",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
];
