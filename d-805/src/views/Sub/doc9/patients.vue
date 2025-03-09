<template>
  <div class="mb-3">
    <h3 class="text-white">PATIENT</h3>
    <!-- <div class="d-flex pb-1">
      <div
        class="d-flex"
        style="flex: 1 0 0;"
      >
        <b-input-group
          class='mr-1'
          prepend="申請單號"
        >
          <b-input />
        </b-input-group>

        <b-input-group
          class='mr-1'
          prepend="病歷號"
        >
          <b-input />
        </b-input-group>

        <b-input-group
          class='mr-1'
          prepend="報告版本"
        >
          <b-input />
        </b-input-group>

        <b-input-group
          class='mr-1'
          prepend="病患姓名"
        >
          <b-input />
        </b-input-group>
      </div>

      <b-button
        class="mx-2"
        variant="primary"
        @click="SearchConditions"
      >
        <font-awesome-icon icon="search" />進行查詢
      </b-button>
      <b-button
        variant="success"
        @click="ClearConditions"
      >
        <font-awesome-icon icon="eraser" />清除條件
      </b-button>
    </div> -->
    <b-table
      striped
      hover
      small
      dark
      class="mt-2"
      v-if="patients"
      :items="patients"
      :fields="fields"
    >
      <template v-slot:cell(Operation)="data">
        <!-- <b-button
          class="mr-1"
          variant="success"
          @click="$emit('editPatientEvent', data.item)"
        >編輯</b-button> -->

        <b-dropdown
          right
          text="編輯"
        >
          <b-dropdown-item
            v-for="(tmp,idx) in csts"
            :key="'tmp' + idx"
            @click="$emit('editWithTemplate', {tmp, patient: data.item})"
          >
            {{tmp.reportTitle}}
          </b-dropdown-item>

        </b-dropdown>

      </template>
    </b-table>
  </div>
</template>

<script>
import { getCounterPatients, getCstList } from "@/assets/service/dataManager.js";
import { Query } from "@syncfusion/ej2-data";
import { mapState } from 'vuex';
export default {
  name: 'patientList',
  data () {
    return {
      queryKey: {
        AccessionNo: "", //申請單號(大單號)
        DxrVersion: '',
        PatientId: "",
        PatientName: "",
      },
      fields: [
        { key: 'PatientId', label: '病患ID', sortable: true },
        { key: 'PatientName', label: '病患名稱', sortable: true },
        { key: 'AccessionNo', label: '單號', sortable: true },
        { key: 'CounterRegister', label: '報到時間', sortable: true },
        { key: 'Operation', label: '操作' }
      ],
      patients: null,
      csts: null,
    }
  },
  computed: {
    ...mapState(['Profile4User'])
  },
  created () {
    this.getCstList();
    this.getPatients();
  },
  mounted () {

  },
  methods: {
    getCstList () {
      getCstList().then(res => {
        this.csts = res.filter(({ CSTId }) => CSTId.includes('3345')).map(item => JSON.parse(item.StructureContent));
      });
    },
    async getPatients () {
      try {
        // const { result } = await getPatientList(
        //   this.Profile4User.id,
        //   this.getDataQuery()
        //     .sortBy("SubscribeDate")
        //     .page(1, 10)
        // );
        // this.patients = result.map(r => ({ ...r, SubscribeDate: this.$moment(r.SubscribeDate).format('YYYY-MM-DD hh:mm:ss') }));
        const { result } = await getCounterPatients(
          `?status=51&employeeNo=${this.Profile4User.id}`,
          this.getDataQuery().sortBy("ProcedureCompleted")
        )
        this.patients = result;
      } catch (err) {
        console.log(err);
      }
    },
    getDataQuery () {
      let query = new Query();
      // Object.keys(this.queryKey).forEach(key => {
      //   if (this.queryKey[key] && this.queryKey[key].trim()) {
      //     query = query.where(key, "contains", this.queryKey[key].trim(), true);
      //   }
      // });
      query.where('PatientSourceTypeCode', "equal", "E");
      return query;
    },
    editPatientDx (patient) {

    }
  }
}
</script>
