### 注意

首次安裝 node_modules 後，請將 src/assets/ejs 底下所有的資料夾覆蓋 node_modules/@syncfusion 底下相對應的資料夾

.env
VUE_APP_FI0301_SETTING_BTNS 為設定 FI0301 哪些功能按鈕要顯示
兩邊中文 Title 請務必對上，並且勿任意改動
以後對應個專案 Build 的時候請改成相應的參數

RIS
VUE_APP_FI0301_SETTING_BTNS=參照 FI0301 全部
VUE_APP_FI0304_COLUMNS=參照 FI0304 全部
VUE_APP_FI0304_IS_SHOW_HEADER_COUNT=true
VUE_APP_EMPLOYEE_IS_INSTITUTUION_MULTI=false
VUE_APP_DATA_MANAGER_IS_NEED_institutionNo5400=true

by Frank
VUE_APP_UrgentReportList_COLUMNS=參照 ReportStat.js 裡面的 hrrCompleted 全部
VUE_APP_HomePage=Home
VUE_APP_SHOW_ERRLV=false
VUE_APP_FIRST_SELECTEDSTATUS=51

805:
VUE_APP_FI0301_SETTING_BTNS=呼叫 PACS,暫存報告,正式報告,片語維護,報告版次,異常通報,不良片,原鄉篩檢,報告列印
VUE_APP_FI0304_COLUMNS=EmgFlag,StatusName,DxreportPhysicianName,AccessionNo,ProcedureNameList,Modality,PatientSourceTypeName,PatientId,PatientName,PatientSex,PatientAge,IssueTimeForShow,ProcedureCompletedForShow,OpColumnType1,
VUE_APP_FI0304_IS_SHOW_HEADER_COUNT=false
VUE_APP_EMPLOYEE_IS_INSTITUTUION_MULTI=true
VUE_APP_DATA_MANAGER_IS_NEED_institutionNo5400=false

by Frank
VUE_APP_UrgentReportList_COLUMNS=NoticeTimeForShow,DxreportPhysicianName,StudyTimeForShow,PatientId,PatientName,OrderNo,ProcedureNameList,Message
VUE_APP_HomePage=MI03/FI0304
VUE_APP_SHOW_ERRLV=true
VUE_APP_FIRST_SELECTEDSTATUS=56

popper.js 可刪
portal-vue 可刪

swagger: http://192.168.1.200/RIS/swagger/index.html?url=/RIS/swagger/v1/swagger.json

部署: 192.168.1.200
帳號: Administrator
密碼: 123.qwe
