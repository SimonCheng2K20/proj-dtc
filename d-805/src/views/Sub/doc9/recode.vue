<template>
  <div class="mb-3">
    <h3 class="text-white">RECODE</h3>
    <b-table
      striped
      hover
      small
      dark
      class="mt-2"
      :items="reportItemList"
      :fields="fields"
    >
      <template v-slot:cell(Operation)="data">
        <b-button
          class="my-1 mr-1"
          variant="primary"
          @click="$router.push({ path: '/sub/doc/demo/' + data.item.tempId, query: {repotId: data.index}})"
        >編輯</b-button>
        <b-button
          @click="deleteReport(idx)"
          variant="danger"
        >移除</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
// import { getPatientList, getCounterPatients } from "@/assets/service/dataManager.js";
// import { Query } from "@syncfusion/ej2-data";
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'patientList',
  data () {
    return {
      fields: [
        { key: 'data.patient.PatientName', label: '病患名稱', sortable: true },
        { key: 'tempName', label: '報告名稱', sortable: true },
        { key: 'createTime', label: '編寫日期', sortable: true },
        { key: 'Operation', label: '操作' }
      ],
    }
  },
  computed: {
    ...mapState(["tempItemList", "reportItemList"])
  },
  created () {

  },
  mounted () {

  },
  methods: {
    ...mapMutations(['DELETE_REPORTITEMS']),
    deleteReport (idx) {
      this.DELETE_REPORTITEMS(idx);
    }
  }
}
</script>
