import cloudSchemas from './cloudSchemaSource.js';
import hisSchemas from './hisSchemaSource.js';


function generateList ([key, label]) {  // map資料
  return { key, label, type: 'text '}
}

export const cloudIdNameObject = {
  Nhi01: 'history',
  Nhi02: 'checking',
  Nhi03: 'recording',
  Nhi04: 'operation',
  Nhi05: 'allergic',
  Nhi06: 'detecting',
  Nhi07: 'memo',
  Nhi08: 'rehabilitation',
  Nhi09: 'tradition',
}

export const cloudNameObject = {
  history: '雲端藥歷',
  checking: '檢查檢驗',
  recording: '手術明細記錄',
  operation: '牙科處置及手術作業',
  allergic: '過敏藥',
  detecting: '檢驗(查)結果',
  memo: '出院病摘',
  rehabilitation: '復健醫療',
  tradition: '中醫用藥',
}

export const hisNameObject = {
  clinic: '門診病歷',
  emmergence: '急診病歷',
  hospital: '住院病歷',
}

export const hisIdNameObject = {
  0: 'clinic',
  1: 'emmergence',
  2: 'hospital',
}

export const hisDisplayNameObject = {
  DiagnosticReports: '檢驗(查)結果',
  MedicationRequests: '用藥',
  Procedures: '處置,檢查',
  Conditions: '主訴,診斷'
}

export const funcObject = {
  recording: '會診記錄',
  revisehis: 'HIS歷史資料',
  reviseEec: '電子病歷交換中心',
  revisecloud: '健保署雲端藥歷',
  pacs: '調閱PACS',
  video: '視訊諮詢',
}

export const electronicNameObject = {
  clinic: '門診病歷',
  memo: '出院病摘',
  video: '醫學影像報告',
  report: '檢驗報告',
  Complaints: '主訴,客訴',
  Diagnosis: '診斷',
  Procedures: '處置',
  MedicationRequests: '用藥',
  Laboratories: '檢查',
  DiagnosticReports: '檢驗(查)報告'
}

export const elecTableSourceLongObjList =
  {
    Complaints: [
      { key: 'Name', label: '代碼名稱', type: 'text' },
      { key: 'Evidence', label: '描述', type: 'text' }
      // { key: 'objective', label: '客觀描述', type: 'text' },
    ],
    Diagnosis: [
      { key: 'No', label: 'No', type: 'text' },
      { key: 'Code', label: '代碼/診斷代碼', type: 'text' },
      { key: 'Name', label: '代碼名稱/診斷代碼名稱', type: 'text' },
      { key: 'AssertedDate', label: '發生日期/最近一次檢查日期', type: 'text' },
      { key: 'Evidence', label: '描述', type: 'text' },
      { key: 'PatientDepartment', label: '就醫科別代碼', type: 'text' },
      { key: 'PatientDepartmentName', label: 'PatientDepartmentName', type: 'text' },
      { key: 'ProcudeCode', label: '手術明細代碼/檢查及治療代碼', type: 'text' },
      { key: 'ProcudeCodeDisplay', label: '手術明細名稱/檢查及治療名稱', type: 'text' },
      { key: 'BodySite', label: '診療部位', type: 'text' },
      { key: 'PerformedPeriodStart', label: '執行時間-起', type: 'text' },
      { key: 'PerformedPeriodEnd', label: 'CreateTime', label: '建立時間', type: 'text' },
      { key: 'CreatePractitionerId', label: '建立醫事人員ID', type: 'text' },
      { key: 'UpdateTime', label: '最後修改時間', type: 'text' },
      { key: 'UpdatePractitionerId', label: '最後修改醫事人員ID', type: 'text' },
    ],
    Procedures: [
      { key: 'index', label: '項次', type: 'text', width: 'auto' },
      { key: 'ProcedureNo', label: '序號', type: 'text' },
      { key: 'ProcedureCode', label: '代碼', type: 'text' },
      { key: 'ProcedureName', label: '名稱', type: 'text' },
      { key: 'StartDate', label: '起始日期', type: 'text' },
      { key: 'EndDate', label: '結束日期', type: 'text' },
      { key: 'AccessionNo', label: 'AccessionNo', type: 'text' },
      { key: 'Dose', label: '次劑量', type: 'text' },
      { key: 'DoseUnit', label: '次劑量單位', type: 'text' },
      { key: 'Method', label: '服法', type: 'text' },
      { key: 'Route', label: '途徑', type: 'text' },
      { key: 'Days', label: '日數(天)', type: 'text' },
      { key: 'Total', label: '總量', type: 'text' },
      { key: 'TotalUnit', label: '總量單位', type: 'text' },
      { key: 'ObservationValue', label: '量測結果值', type: 'text' },
      { key: 'ObservationUnit', label: '量測單位', type: 'text' },
      { key: 'ReferenceRangeLow', label: '量測最低值', type: 'text' },
      { key: 'ReferenceRangeHigh', label: '量測最高值', type: 'text' },
      { key: 'ReferenceText', label: 'ReferenceText', type: 'text' },
      { key: 'PatientDepartment', label: '就醫科別代碼', type: 'text' },
      { key: 'PatientDepartmentName', label: 'PatientDepartmentName', type: 'text' },
      { key: 'ConditionCode', label: '主診斷碼', type: 'text' },
      { key: 'ConditionName', label: '主診斷名稱', type: 'text' },
      { key: 'PCode', label: '醫令代碼', type: 'text' },
      { key: 'PCodeDisplay', label: '醫令名稱', type: 'text' },
      { key: 'BodySite', label: '診療部位', type: 'text' },
      { key: 'PPeriodStart', label: '就醫／檢查日期', type: 'text' },
      { key: 'CreateTime', label: '建立時間', type: 'text' },
      { key: 'CreatePractitionerId', label: '建立醫事人員ID', type: 'text' },
      { key: 'UpdateTime', label: '最後修改時間', type: 'text' },
      { key: 'UpdatePractitionerId', label: '最後修改醫事人員ID', type: 'text' },
      { key: 'PFollowUpDate', label: '治療結束日期', type: 'text' },
    ],
    MedicationRequests: [
      { key: 'index', label: '項次', type: 'text', width: 'auto' },
      { key: 'Name', label: '名稱', type: 'text' },
      { key: 'RouteCode', label: '途徑代碼', type: 'text' },
      { key: 'RouteCodeName', label: '途徑名稱', type: 'text' },
      { key: 'MethodCode', label: '服法代碼', type: 'text' },
      { key: 'MethodCodeName', label: '服法名稱', type: 'text' },
      { key: 'Dose', label: '次劑量', type: 'text' },
      { key: 'DoseUnit', label: '次劑量單位', type: 'text' },
      { key: 'Days', label: '日數(天)', type: 'text' },
      { key: 'Total', label: '總量', type: 'text' },
      { key: 'TotalUnit', label: '總量單位', type: 'text' },
      { key: 'AuthoredOn', label: '就醫日期 (住院用藥起日)', type: 'text' },
      { key: 'PractitionerId', label: '開單醫師', type: 'text' },
      { key: 'ATC7Code', label: 'ATC7代碼', type: 'text' },
      { key: 'ATC5Name', label: 'ATC5名稱', type: 'text' },
      { key: 'IngredientCode', label: '成分代碼', type: 'text' },
      { key: 'IngredientName', label: '成分名稱', type: 'text' },
      { key: 'ConditionCode', label: '主診斷碼', type: 'text' },
      { key: 'ConditionName', label: '主診斷名稱', type: 'text' },
      { key: 'MedicationCode', label: '藥品代碼', type: 'text' },
      { key: 'MedicationName', label: '藥品名稱', type: 'text' },
      { key: 'DenominatorValue', label: '藥品規格量', type: 'text' },
      { key: 'DenominatorUnit', label: '藥品規格量單位', type: 'text' },
      { key: 'DosageInstructionText', label: '用法用量', type: 'text' },
      { key: 'DosageInstructionDateEnd', label: '慢連箋領藥日(住院用藥迄日)', type: 'text' },
      { key: 'DoseQuantity', label: '藥品用量', type: 'text' },
      { key: 'TimingDuration', label: '給藥日數', type: 'text' },
      { key: 'DrugMultiMark', label: '複方註記', type: 'text' },
      { key: 'ListIdentifier', label: '就醫序號', type: 'text' },
      { key: 'ATC3Name', label: 'ATC3Name', type: 'text' },
      { key: 'RequesterOrgCode', label: '慢連箋原處方醫事機構代碼', type: 'text' },
      { key: 'NumberOfRepeatsAllowed', label: '慢連籤', type: 'text' },
      { key: 'MedicationCodeText', label: '基準方名', type: 'text' },
      { key: 'Ingredient', label: '效能名', type: 'text' },
      { key: 'Form', label: '劑型', type: 'text' },
      { key: 'MaxDosePerAdministration', label: '給藥總量', type: 'text' },
      { key: 'CreateTime', label: '建立時間', type: 'text' },
      { key: 'CreatePractitionerId', label: '建立醫事人員ID', type: 'text' },
      { key: 'UpdateTime', label: '最後修改時間', type: 'text' },
      { key: 'UpdatePractitionerId', label: '最後修改醫事人員ID', type: 'text' },
    ],
    Laboratories: [
      { key: 'index', label: '項次', type: 'text', width: 'auto' },
      { key: 'ProcedureNo', label: '序號', type: 'text' },
      { key: 'ProcedureCode', label: '代碼', type: 'text' },
      { key: 'ProcedureName', label: '名稱', type: 'text' },
      { key: 'StartDate', label: '起始日期', type: 'text' },
      { key: 'EndDate', label: '結束日期', type: 'text' },
      { key: 'AccessionNo', label: 'AccessionNo', type: 'text' },
      { key: 'Dose', label: '次劑量', type: 'text' },
      { key: 'DoseUnit', label: '次劑量單位', type: 'text' },
      { key: 'Method', label: '服法', type: 'text' },
      { key: 'Route', label: '途徑', type: 'text' },
      { key: 'Days', label: '日數(天)', type: 'text' },
      { key: 'Total', label: '總量', type: 'text' },
      { key: 'TotalUnit', label: '總量單位', type: 'text' },
      { key: 'ObservationValue', label: '量測結果值', type: 'text' },
      { key: 'ObservationUnit', label: '量測單位', type: 'text' },
      { key: 'ReferenceRangeLow', label: '量測最低值', type: 'text' },
      { key: 'ReferenceRangeHigh', label: '量測最高值', type: 'text' },
      { key: 'ReferenceText', label: 'ReferenceText', type: 'text' },
      { key: 'Category', label: '門住診別', type: 'text' },
      { key: 'PatientDepartment', label: '就醫科別代碼', type: 'text' },
      { key: 'PatientDepartmentName', label: 'PatientDepartmentName', type: 'text' },
      { key: 'ConditionCode', label: '主診斷碼', type: 'text' },
      { key: 'ConditionName', label: '主診斷名稱', type: 'text' },
      { key: 'PCode', label: '醫令代碼', type: 'text' },
      { key: 'PCodeDisplay', label: '醫令名稱', type: 'text' },
      { key: 'BodySite', label: '診療部位', type: 'text' },
      { key: 'PPeriodStart', label: '就醫／檢查日期', type: 'text' },
      { key: 'CreateTime', label: '建立時間', type: 'text' },
      { key: 'CreatePractitionerId', label: '建立醫事人員ID', type: 'text' },
      { key: 'UpdateTime', label: '最後修改時間', type: 'text' },
      { key: 'UpdatePractitionerId', label: '最後修改醫事人員ID', type: 'text' },
      { key: 'PFollowUpDate', label: '治療結束日期', type: 'text' },
      { key: 'date', label: '日期', type: 'text' },
      { key: 'code', label: '藥品代碼', type: 'text' },
      { key: 'name', label: '藥品名稱', type: 'text' }
    ],
    DiagnosticReports: [
      { key: 'Conclusion', label: '報告結果/病理發現及診斷', type: 'text' },
      // { key: 'ReportCategory', label: '報告類別', type: 'text' },
      // { key: 'Category', label: '門住診別', type: 'text' },
      // { key: 'PatientDepartment', label: '就醫科別代碼', type: 'text' },
      // { key: 'PatientDepartmentName', label: '就醫科別名稱', type: 'text' },
      // { key: 'ConditionCode',  label: '主診斷碼', type: 'text' },
      // { key: 'ConditionName',  label: '主診斷名稱', type: 'text' },
      // { key: 'BodySite', label: '診療部位', type: 'text' },
      // { key: 'ResultCategory', label: '檢查檢驗類別', type: 'text' },
      // { key: 'ResultCategoryDisplay',  label: '檢查檢驗類別名稱', type: 'text' },
      // { key: 'DRCode', label: '醫令代碼', type: 'text' },
      // { key: 'DRCodeDisplay',  label: '醫令名稱', type: 'text' },
      // { key: 'ResultCode', label: '檢驗項目', type: 'text' },
      // { key: 'ResultCodeDisplay' ,label: '檢驗方法', type: 'text' },
      // { key: 'ResultValue',  label: '檢查檢驗結果', type: 'text' },
      // { key: 'ResultValueUnit', label: '單位', type: 'text' },
      // { key: 'ResultReferenceRange', label: '參考值', type: 'text' },
      // { key: 'Conclusion', label: '報告結果/病理發現及診斷', type: 'text' },
      // { key: 'SpecimenCollectionMethod', label: '檢體採檢方法/來源/類別', type: 'text' },
      // { key: 'EffectivePeriodStart', label: '開立醫令日期', type: 'text' },
      // { key: 'EffectivePeriodEnd', label: '採檢/實際檢查日期', type: 'text' },
      // { key: 'PerformerRoleSystem', label: '有無TAF認證', type: 'text' },
      // { key: 'ImageComment', label: '是否有影像資料', type: 'text' },
      // { key: 'CreateTime', label: '建立時間', type: 'text' },
      // { key: 'CreatePractitionerId', label: '建立醫事人員ID', type: 'text' },
      // { key: 'UpdateTime', label: '最後修改時間', type: 'text' },
      // { key: 'UpdatePractitionerId', label: '最後修改醫事人員ID', type: 'text' },
      // { key: 'IssuedDate', label: '報告日期', type: 'text' },
      // { key: 'PayDate', label: '', type: 'text' },
    ]
  }


  export const tableSourceLongObjList = Object.entries(cloudSchemas).reduce((acc, [key, schema]) => ({
    ...acc,
    [key]: Object.entries(schema).map(generateList)
  }), {})

  export const hisTableSourceLongObjList = Object.entries(hisSchemas).reduce((acc, [key, schema]) => ({
    ...acc,
    [key]: Object.entries(schema).map(generateList)
  }), {})

  export const tableSourceObjList = Object.entries(tableSourceLongObjList).reduce((acc, [key, items]) => ({ ...acc, [key]: items.slice(0, 3)}), {})

  export const hisTableSourceObjList = Object.entries(hisTableSourceLongObjList).reduce((acc, [key, items]) => ({ ...acc, [key]: items.slice(0, 3)}), {})

  export const elecTableSourceObjList = Object.entries(elecTableSourceLongObjList).reduce((acc, [key, items]) => ({ ...acc, [key]: items.slice(0, 3)}), {})
