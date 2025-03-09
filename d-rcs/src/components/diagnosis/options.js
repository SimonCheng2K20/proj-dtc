const generateDummyOptions = (str = "", num = 10) =>
  new Array(num).fill(1).map((v, idx) => {
    const text = str + (v + idx);
    return { text, value: text };
  });

export const suggestion = [
  { text: "建議後送治療", value: "建議後送治療" },
  { text: "待在原機構處治", value: "待在原機構處治" },
  { text: "其他", value: "其他", other: true, otherKey: "suggestionOther" },
];

export const purpose = {
  target: [
    { text: "第二意見", value: 1 },
    { text: "轉診", value: 2 },
    { text: "其他", value: 0, other: true, otherKey: "OtherAimed" },
  ],
  units: generateDummyOptions("unit"),
  doctors: generateDummyOptions("doctor"),
};

export const instruction = {
  type: [
    { text: "一般會診", value: 1, sub: true },
    { text: "急重症", value: 2, sub: true },
    {
      text: "其他",
      value: 0,
      other: true,
      otherKey: "ConsultationOtherType",
    },
  ],
  1: [
    { text: "內科", value: 1 },
    { text: "外科", value: 2 },
    { text: "兒科", value: 3 },
    { text: "婦產科", value: 4 },
    { text: "其他", value: 0, other: true, otherKey: "SubOtherType" },
  ],
  2: [
    { text: "急診", value: 6 },
    { text: "急性腦中風", value: 7 },
    { text: "緊急外傷", value: 8 },
    { text: "心肌梗塞", value: 9 },
    { text: "其他", value: 10, other: true, otherKey: "SubOtherType2" },
  ],
  level: [
    { text: "第一級", value: 11 },
    { text: "第二級", value: 12 },
    { text: "第三級", value: 13 },
    { text: "第四級", value: 14 },
    { text: "第五級", value: 15 },
  ],
  0: [],
};

export const diseaseColumns = [
  { key: "custom1", label: "", width: "auto" },
  { key: "custom2", label: "ICD-10", type: "text" },
  { key: "Icd9", label: "ICD-9", type: "text" },
  { key: "Cht", label: "診斷名稱", type: "text" },
  { key: "Eng", label: "英文診斷名稱", type: "text" },
  { key: "custom3", label: "操作", width: "auto" },
];

export const lifeHistoryColumns = [
  { label: "職業", key: "Career", type: "inputText", disabled: false },
  {
    label: "就醫身份別",
    key: "PatientSourceType",
    type: "comboRadio",
    options: [
      { text: "健保", value: 1 },
      { text: "自費", value: 2 },
      { text: "其他", value: 0, other: true },
    ],
    disabled: false,
  },
];

const areaOptions = [
  { text: "未知", value: 0 },
  { text: "本地", value: 1 },
  { text: "外來", value: 2 },
];

export const patientColumns = [
  { label: "姓名", key: "Name", type: "inputText", disabled: true },
  { label: "性別", key: "GenderCode", type: "inputText", disabled: true },
  {
    label: "出生年月日",
    key: "Birthday",
    type: "inputText",
    slot: true,
    disabled: true,
  },
  { label: "初診日期", key: "FirstVisitDate", type: "date" },
  {
    label: "初診科別",
    key: "FirstVisitMed",
    type: "select",
    options: generateDummyOptions("class"),
  },
  { label: "區域", key: "Area", type: "select", options: areaOptions },
];

export const patientInsertColumns = [
  { label: "姓名", key: "Name", type: "inputText", disabled: true },
  {
    label: "性別",
    key: "GenderCode",
    type: "radio",
    options: [
      { text: "男", value: "男" },
      { text: "女", value: "女" },
    ],
    disabled: true,
  },
  {
    label: "出生年月日",
    key: "Birthday",
    type: "date",
    slot: true,
    span: 2,
    disabled: true,
  },
  {
    label: "初診日期",
    key: "FirstVisitDate",
    type: "date",
    span: 2,
    disabled: true,
  },
  {
    label: "初診科別",
    key: "FirstVisitMed",
    type: "select",
    options: generateDummyOptions("class"),
    disabled: true,
  },
  {
    label: "區域",
    key: "Area",
    type: "select",
    options: areaOptions,
    disabled: true,
  },
];

// { text: '一般會診', value: '一般會診' },
// { text: '內科', value: '內科' },
// { text: '外科', value: '外科', other: true },
// { text: '兒科', value: '兒科', other: true },
// { text: '婦產科', value: '婦產科', other: true },
// { text: '其他', value: 'instructionTypeOther', other: true }
