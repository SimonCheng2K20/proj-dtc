/* eslint-disable no-console */
/* datasource: DR.01.01.002 - 櫃台報到．今日報到清單 */
const configCollection = [
  { key: "dId", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "sId", label: "狀態", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "pNe", label: "姓名", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "hId", label: "病歷號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "iId", label: "檢查項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" }
];
const dataCollection = [];

export let PresentConfig = function() {
    return configCollection;
  },
  DataSet = function() {
    return dataCollection;
  };
