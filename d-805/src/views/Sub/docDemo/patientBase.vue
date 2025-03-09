<template>
  <div
    class="mb-4 p-2 bg-black text-white rounded"
    v-if="patient"
  >
    <h4>基本資料</h4>
    <temp-grid :cols="3">

      <b-input-group
        :prepend="patientData[key]"
        v-for="key in Object.keys(patientData)"
        :key="key"
      >
        <b-input
          readonly
          :value="patient[key]"
        />
      </b-input-group>

    </temp-grid>

  </div>
</template>

<script>
import tempGrid from './tempGrid';
export default {
  data () {
    return {
      patientData: {
        AccessionNo: '申請單號',
        PatientId: '病患ID',
        OtherPatientId: '身份證號',
        PatientHeight: '身高',
        PatientWeight: '體重',
        PatientName: '姓名',
        PatientBirthday: '生日',
        ScheduleLocationName: '檢查室',
        DxreportPhysicianName: '醫師',
      }
    }
  },
  props: {
    patient: {
      type: Object
    }
  },
  components: { tempGrid },
  created () {

  },

}
</script>

<style lang="scss" scoped>
/deep/ .input-group {
  .form-control[readonly],
  .form-control[readonly="readonly"] {
    color: #fff;
  }
}
</style>
