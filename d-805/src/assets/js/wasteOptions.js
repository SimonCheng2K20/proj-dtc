export const stepOptions = [
  { text: "自已發現", value: 1 },
  { text: "QA發現", value: 2 },
  { text: "科內醫師", value: 3 },
  { text: "診間WEB", value: 4 },
  { text: "報告已發", value: 5 },
  { text: "醫療糾紛", value: 6 },
];

export const reasonOptions = [
  { text: "基本資料錯誤", value: 1 },
  { text: "左右標示", value: 2 },
  { text: "攝影部位錯誤", value: 3 },
  { text: "異物", value: 4 },
  { text: "擺位不正", value: 5 },
  { text: "其他", value: 6 },
];

export const otherOptions = [
  { html: "人為<input class='ml-1 border rounded' name='other1' type='text' />", value: 6.1 },
  { html: "機器<input class='ml-1 border rounded' name='other2' type='text' />", value: 6.2 },
  { html: "條件<input class='ml-1 border rounded' name='other3' type='text' />", value: 6.3 },
  { text: "沒有影像", value: 6.4 },
  { text: "醫令更改", value: 6.5 },
  { text: "醫令取消", value: 6.6 },
];

export const columns = [
  { value: "PatientName", label: "病患姓名" },
  { value: "OrderDate", label: "檢查日期" },
  { value: "PatientId", label: "病歷號" },
  { value: "AccessionNo", label: "工作單號" },
  { value: "ProcedureNameStr", label: "部位" },
  { value: "PerformRadiographer1Name", label: "放射師/QA" },
];
