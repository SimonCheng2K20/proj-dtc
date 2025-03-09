<template>
  <div id="printArea">
    <div class="text-center" style="font-size: 32px; font-weight: bold;margin-bottom: 12px;">國軍花蓮總醫院放射科檢查報告</div>
    <div style="display: grid; grid-template-columns: repeat(6, 1fr);gap: 4px;">
      <div class="label">病患姓名:</div>
      <div>{{ this.theReport.PatientName }}</div>
      <div>科別:</div>
      <div>{{ this.theReport.PatientSourceName }}</div>
      <div>病歷號碼:</div>
      <div>{{ this.theReport.PatientId }}</div>
      <div>主治醫師:</div>
      <div>{{ this.theReport.RequestingPhysicianName }}</div>
      <div>性別:</div>
      <div>{{ this.theReport.PatientSex == 'F' ? '女性' : '男性' }}</div>
      <div>身分證號:</div>
      <div>{{ this.theReport.OtherPatientId }}</div>
      <div>出生日期:</div>
      <div>{{ this.theReport.PatientBirthday != undefined ? this.theReport.PatientBirthday.substring(0, 10) : '' }}</div>
      <div>年齡:</div>
      <div>{{ this.theReport.PatientAge }}</div>
      <div>檢查日期:</div>
      <div>{{ this.theReport.ProcedureCompleted != undefined ? this.theReport.PatientBirthday.substring(0, 10) : '' }}</div>
      <div>病床號碼:</div>
      <div>{{ this.theReport.BedNo }}</div>
      <div>病患來源:</div>
      <div>{{ this.theReport.PatientSourceTypeName }}</div>
      <div>檢查時間:</div>
      <div>{{ this.theReport.ProcedureCompleted != undefined ? this.theReport.PatientBirthday.substring(11, 19) : '' }}</div>
      <div>申請日期:</div>
      <div>{{ this.theReport.OrderDate != undefined ? this.theReport.PatientBirthday.substring(0, 10) : '' }}</div>
      <div>申請時間:</div>
      <div>{{ this.theReport.OrderDate != undefined ? this.theReport.PatientBirthday.substring(11, 19) : '' }}</div>
      <div>檢查單號:</div>
      <div>{{ this.theReport.OrderNo }}</div>
      <div>檢查項目:</div>
      <div style="grid-column: 2 / 7">
        {{ this.theReport.ProcedureName }}
      </div>
      <div>報告內容:</div>
      <div style="grid-column: 2 / 7">
        {{ this.theReport.ReportContent }}
      </div>
      <div style="grid-column: 2 / 4">Supervisor:{{ this.theReport.IssuePhysicianName }}</div>
      <div style="grid-column: 4 / 7">Reported by:{{ this.theReport.IssuePhysicianName }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    theReport: Object,
  },
}
</script>

<style>
#printArea {
  display: none;
}

@media print {
  body > *:not(#printArea) {
    display: none;
  }

  #printArea {
    display: block;
  }
}
</style>

