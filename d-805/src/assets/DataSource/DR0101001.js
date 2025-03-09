/* eslint-disable no-console */
/* datasource: DR.01.01.001 - 櫃台報到．查詢結果 */
const configCollection = [
  { key: "dId", label: "項次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "eId", label: "類別", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "cId", label: "申請單號", sortable: false, thClass: "text-nowrap", tdClass: "no-wrap font-weight-bold" },
  { key: "hId", label: "病歷號", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "iNe", label: "檢查項目", sortable: false, thClass: "no-wrap", tdClass: "no-wrap text-left" },
  { key: "pNe", label: "姓名", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "pGd", label: "性別", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "bdy", label: "出生日期", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  { key: "age", label: "年齡", sortable: false, thClass: "no-wrap", tdClass: "no-wrap" }
];
const dataCollection = [
  {
    guid: "1234567890",
    dId: 1,
    eId: "急作",
    cId: "R123456789",
    cDt: "108/08/12",
    pSr: 1,
    hId: "H123456789",
    iId: 1,
    iNe: "XXXX檢驗",
    pNe: "趙大升",
    pId: "A123456789",
    pGd: "男性",
    bdy: "032/12/31",
    age: 76,
    _rowVariant: "danger"
  },
  {
    guid: "1234567891",
    dId: 2,
    eId: "一般",
    cId: "R123456790",
    cDt: "108/08/13",
    pSr: 3,
    hId: "H987654321",
    iId: 3,
    iNe: "ZZZZ檢驗",
    pNe: "錢春枝",
    pId: "B223456789",
    pGd: "女性",
    bdy: "033/01/01",
    age: 75
  }
];

export let PresentConfig = function() {
    return configCollection;
  },
  DataSet = function() {
    return dataCollection;
  },
  DataRow = guid => {
    var collections = [];
    if (guid) {
      dataCollection.forEach(e => {
        if (e.guid === guid) {
          collections.push(e);
        }
      });
    }
    return collections;
  };
