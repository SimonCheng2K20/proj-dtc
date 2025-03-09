<template>
  <!-- style="max-width:700px" -->
  <div class>
    <div v-if="Title.length > 0">
      <b-tabs>
        <b-tab
          class="p-1"
          v-for="(item, idx) in Title"
          :key="idx"
          :title="item"
        >
          <b-table-simple
            class="table"
            style
            hover
            small
            striped
            caption-top
            responsive
            :sticky-header="'500px'"
          >
            <b-thead head-variant="dark">
              <b-tr>
                <b-th colspan="1"></b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >門診</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >急診</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >住院</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >健檢</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >轉診</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="2"
                >轉檢</b-th>
                <b-th
                  style="border-left:1px solid #dee2e6"
                  colspan="1"
                ></b-th>
              </b-tr>
              <b-tr>
                <b-th
                  v-for="(item, idx) in ReportDaysCompleted"
                  :key="idx"
                >{{ item.label }}</b-th>
              </b-tr>
            </b-thead>
            <b-tbody class="body-group">
              <b-tr
                v-for="(item, idx) in TableData(idx)"
                :key="idx"
              >
                <b-th>{{ item.PHYSICIAN_NAME }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.outPatient }}</b-th>
                <b-th>{{ item.outPatientAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.emergency }}</b-th>
                <b-th>{{ item.emergencyAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.hospitalized }}</b-th>
                <b-th>{{ item.hospitalizedAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.healthCheck }}</b-th>
                <b-th>{{ item.healthCheckAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.referralCheck }}</b-th>
                <b-th>{{ item.referralCheckAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.referralPatient }}</b-th>
                <b-th>{{ item.referralPatientAvg }}</b-th>
                <b-th style="border-left:1px solid #dee2e6">{{ item.AvgDay }}</b-th>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-tab>
      </b-tabs>
    </div>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
// import twp from "@/components/TWPv5";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";
import { PhysReportDaysFields } from "@/views/TableState/ImageComponents/ImageStat.js";
import { mapMutations } from "vuex";
export default {
  components: { NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number },
    selectedDay: { type: Number }
  },
  data () {
    return {
      ReportDaysCompleted: PhysReportDaysFields,
      //天數統計資料
      Data: [],
      //tab 的欄位
      Title: []
    };
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING']),
    GetData () {
      //預設為當月
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        return { Items: [] };
      }
      this.SHOW_LOADING();
      const param = `${this.$moment(this.dateRange[0]).format("YYYY-MM")}-${this.selectedDay ? this.$number2Digits(this.selectedDay) : '01'}`;
      window.axios.get(`/schedule/ReportMonthAvgList?date=${param}`).then(res => {
        this.Title = Object.keys(res);
        this.Data = res;
      }).finally(() => {
        this.HIDE_LOADING();
      });
    },
    TableData (x) {
      // console.log(x);
      // console.log(this.Data[this.Title[x]]);
      return this.Data[this.Title[x]];
      //TODO:寫一個sum
    },
    refreshTWP () {
      this.GetData();
    }
  }
};
</script>
<style lang="scss" scrope>
.table {
  width: 99.8%;
  .body-group {
    box-sizing: border-box;
    border-bottom: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
  }
}
</style>
