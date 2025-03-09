export default [
  //櫃檯報到顯示資料
  {
    Step: "1",
    name: "櫃台報到",
    display: "櫃台報到",
    disabled: false,
    //甚麼時間報到when,誰幫他報到的who(紀錄櫃台報到的那一個),要去哪裡where
    Detail: {
      //櫃檯報到時間
      CounterRegister: "",
      //櫃檯報到人員
      COUNTER_STAFF_Name: "",
      //預計檢查室
      ScheduleLocationName: "",
      //預計檢查時間
      ScheduleTime: ""
    },
    list: []
  },
  //檢查室
  {
    Step: "2",
    name: "檢查室",
    display: "檢查室",
    disabled: true,
    Detail: {
      StartTime: "",
      EndTime: "",
      //放射師1
      PerformRadiographer1Name: "",
      //放射師2
      PerformRadiographer2Name: "",
      //護理師
      PerformNurseName: ""
    }
  },
  //報告分派人員
  {
    Step: "3",
    name: "報告分派人員",
    display: "報告分派人員",
    disabled: true,
    Detail: {
      //報告分配給誰登打
      DxreportPhysicianName: ""
    }
  },
  //報告撰寫
  {
    Step: "4",
    name: "報告撰寫",
    display: "報告撰寫",
    disabled: true,
    Detail: {
      //報告(撰寫)人員, R:可能是打字員或醫師
      DxreportPhysicianName: "",
      //主治/審核報告的醫師
      IssuePhysicianName: ""
    }
  }
];
