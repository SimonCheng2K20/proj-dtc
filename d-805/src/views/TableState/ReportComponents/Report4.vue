<template>
  <div style="overflow:auto">
    <div v-if="Data.length > 0">
      <b-table-simple
        style
        striped
        hover
        small
        caption-top
        responsive
        :sticky-header="'500px'"
      >
        <b-thead head-variant="dark">
          <b-tr>
            <b-th
              v-for="(item, idx) in ReportDaysCompleted"
              :key="idx"
              colspan="1"
            >{{ item }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody class="btbody-re4">
          <b-tr
            v-for="(item, idx) in Data"
            :key="idx"
          >
            <b-th
              :rowspan="item.count"
              v-if="item.count"
            >{{ item.MODALITY }}</b-th>
            <b-th>{{ itemName[item.ITEM] }}</b-th>
            <b-th
              v-for="(key,kidx) in ['JOUNARY', 'FEBRUARY', 'MARCH', 'SEASON1', 'APRIL', 'MAY', 'JUNE', 'SEASON2', 'JULY', 'AUGUST', 'SEPTEMBER', 'SEASON3', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 'SEASON4', 'TOTAL']"
              :key="key+'_'+kidx+'_'+idx"
              v-text="`${item[key]}${item.ITEM === 3 ? '%':''}`"
            />
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
    <NoDataShow v-else />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import twp from "@/components/TWPv5";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";
import { AmendReportAnalysis } from "@/views/TableState/ReportComponents/ReportStat.js";
export default {
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number },
    selectedPhPhysician: { type: String }
  },
  data () {
    return {
      ReportDaysCompleted: AmendReportAnalysis,
      Data: [],
      Title: [],
      itemName: {
        1: '報告量',
        2: '修改量',
        3: '影像報告修改率'
      }
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING"]),
    async GetData () {
      //預設為當月 //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] };
      this.SHOW_LOADING();
      let d = new Date(this.dateRange[0]);
      let year = "?year=" + d.getFullYear();
      const params = [`year=${this.dateRange[0].substr(0, 4)}`];
      if (this.selectedPhPhysician) params.push(`APPROVAL_PHYSICIAN_NAME=${this.selectedPhPhysician}`);
      const { Items } = await window.axios.get(`/reportStatistics/GetModifyAnalysis?${params.join('&')}`);
      Items.reverse();
      let count = 1;
      Items.forEach((item, idx) => {
        if (idx === Items.length - 1 || item.MODALITY !== Items[idx + 1].MODALITY) {
          item['count'] = count;
          count = 1;
        } else {
          count += 1;
        }
      });
      Items.reverse();
      this.Data = Items;
      this.HIDE_LOADING();
    },
    refreshTWP () {
      this.GetData();
    }
  },
};
</script>
