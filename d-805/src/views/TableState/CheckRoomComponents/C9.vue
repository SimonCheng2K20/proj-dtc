<template>
  <div style="overflow:auto">
    <!-- <twp ref="twp" :FieldConfig="CIDataList" :DataFetch="GetData" :isBackEndPagination="false"></twp> -->
    <template v-if="Data.length !== 0">
      <b-table-simple
        hover
        small
        caption-top
        responsive
        :sticky-header="scrollHeight"
      >
        <b-thead
          head-variant="dark"
          style="position:sticky"
        >
          <b-tr>
            <b-th
              style="white-space:nowrap"
              v-for="(item, idx) in CIDataList"
              :key="idx"
            >{{ item.label }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody
          class="body-group"
          style="font-weight: bold;"
        >
          <b-tr
            v-for="(item, idx) in Data"
            :key="idx"
          >
            <b-th style="width:140px">{{ item.ScheduleCompleteTimeForShow }}</b-th>
            <b-th>{{ item.login }}</b-th>
            <b-th>{{ item.PatientSourceTypeName }}</b-th>
            <b-th>{{ item.ExamNo }}</b-th>
            <!-- <b-th style="width:80px">{{ item.PatientName }}</b-th> -->
            <b-th
              class="accession-no"
              v-if="item.count"
              :rowspan="item.count"
            >{{ item.PatientName }}</b-th>
            <b-th
              class="accession-no"
              v-if="item.count"
              :rowspan="item.count"
            >{{ item.AccessionNo }}</b-th>
            <b-th>{{ item.ProcedureCode }}</b-th>

            <b-th
              class="accession-no"
              v-if="item.count"
              :rowspan="item.count"
            >{{ item.MedicationEmployeeName }}</b-th>

            <b-th>{{ item.ProcedureName }}</b-th>
            <b-th>{{ item.PatientId }}</b-th>
            <b-th>{{ item.PriceType }}</b-th>
            <b-th>{{ item.MedicationNo }}</b-th>
            <b-th>{{ item.MedicationName }}</b-th>
            <b-th>{{ item.SubName }}</b-th>
            <b-th>{{ item.Quantity }}</b-th>
            <b-th>{{ item.ScheduleLocationName }}</b-th>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <b-row align-h="end">
        <b-col
          cols="4"
          class="d-flex justify-content-center align-items-center"
        >
          <b-pagination
            @change="refreshTable"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
          />
        </b-col>
        <b-col
          cols="4"
          class="d-flex justify-content-end align-items-center"
        >
          <label
            id="twp5-label"
            for="pagingPerPageOption"
            class="float-left my-1"
          >
            共計 <b> {{ this.$FormatForceInteger(this.rows) }} </b> 筆, 每頁顯示
          </label>
          <b-form-select
            class="mr-2"
            id="pagingPerPageOption"
            size="sm"
            plain
            v-model="perPage"
            :options="this.$DefaultPerPageOption"
            @change="GetData"
          />
        </b-col>
      </b-row>
    </template>

    <NoDataShow v-else></NoDataShow>
  </div>
</template>

<script>
import { dateFormatMixin } from "@/SupportLib_J.js";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";

//twp欄位
import { ExamMedication } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
import { mapMutations } from "vuex";
export default {
  mixins: [dateFormatMixin],
  components: { NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoomKey: { type: String },
    selectedCheckRoom: { type: Number },
    scrollHeight: { type: String }
  },
  data () {
    return {
      CIDataList: ExamMedication,
      InspectDevice: "",
      //data array
      Data: [],
      rowspan: 0,
      perPage: 10,
      rows: 0,
      currentPage: 1,
      searchCondition: ''
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING"]),
    refreshTable () {
      setTimeout(this.GetData, 50);
    },
    async GetData () {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] };
      this.SHOW_LOADING();
      const params = this.dateRange.map( //預計建立
        (datetime, idx) => `${idx === 0 ? "start" : "end"}Date=${new Date(datetime).getFullYear()}-${new Date(datetime).getMonth() + 1}-${new Date(datetime).getDate()}`
      );
      if (this.selectedCheckRoomKey) params.push(`scheduleLocaion=${this.selectedCheckRoomKey}`);

      if (this.searchCondition !== params.join('&')) {
        this.currentPage = 1;
        this.searchCondition = params.join('&');
      }

      params.push(`top=${this.perPage}`);
      params.push(`indexPage=${this.currentPage}`);
      const { Items, Count } = await window.axios.get(`/examMedication/ScheduleLocationDetail${params.length > 0 ? "?" + params.join("&") : ""}`);
      this.rows = Count;
      Items.reverse();
      let count = 1;
      Items.forEach((item, idx) => {
        item["ScheduleCompleteTimeForShow"] = this.$moment(item.ScheduleCompleteTime).format("YYYY-MM-DD hh:mm:ss");
        if (Items.length - 1 === idx || Items[idx + 1].AccessionNo !== item.AccessionNo) {
          item["count"] = count;
          count = 1;
        } else {
          count += 1;
        }
      })
      Items.reverse();
      this.HIDE_LOADING();
      this.Data = Items;
    },
    refreshTWP () {
      //refreshTWP
      // this.$refs["twp"].OnForceRefresh();
      this.GetData();
    },
  },
  mounted () { },
  created () {
    // -----------------------------取得 App.vue 參照---------------------------//
    let methodName = "created";
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    this.GetData();

    //資料塞入欄位
    // this.CIDataList = ExamMedication;
  },
};
</script>
<style lang="scss" scoped>
.body-group {
  border-bottom: 1px solid #eee;
}
.accession-no {
  border: 1px solid #eee;
  padding: 1% 5px;
}

.b-table {
  tbody {
    tr {
      th {
        vertical-align: middle;
      }
      &:hover {
        th {
          background-color: var(--themeTextColor);
          color: var(--themeBgColor);
        }
      }
    }
  }
}
</style>
