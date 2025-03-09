export default {
  "1": {
    name: "櫃台報到",
    display: "櫃台報到",
    disabled: false,
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
  "2": {
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
    },
    list: []
  },
  "3": {
    name: "報告分派人員",
    display: "報告分派人員",
    disabled: true,
    Detail: {
      //報告分配給誰登打
      DxreportPhysicianName: ""
    },
    list: []
  },
  "4": {
    name: "報告撰寫",
    display: "報告撰寫",
    disabled: true,
    Detail: {
      //報告(撰寫)人員, R:可能是打字員或醫師
      DxreportPhysicianName: "",
      //主治/審核報告的醫師
      IssuePhysicianName: ""
    },
    list: []
  }
};
