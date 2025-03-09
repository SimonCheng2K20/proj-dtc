<template>
  <div>
    <div v-if="Data.length > 0">
      <b-table-simple
        style="table-layout:fixed;"
        striped
        hover
        small
        caption-top
        responsive
        :sticky-header="'500px'"
      >
        <b-thead head-variant="dark">
          <b-tr>
            <b-th colspan="1">項目</b-th>
            <b-th colspan="1">天數\月份</b-th>
            <b-th colspan="2">一月</b-th>
            <b-th colspan="2">二月</b-th>
            <b-th colspan="2">三月</b-th>
            <b-th colspan="2">四月</b-th>
            <b-th colspan="2">五月</b-th>
            <b-th colspan="2">六月</b-th>
            <b-th colspan="2">七月</b-th>
            <b-th colspan="2">八月</b-th>
            <b-th colspan="2">九月</b-th>
            <b-th colspan="2">十月</b-th>
            <b-th colspan="2">十一月</b-th>
            <b-th colspan="2">十二月</b-th>
          </b-tr>
        </b-thead>
        <b-tbody class="btbody">
          <b-tr
            v-for="(item, idx) in Data"
            :key="idx"
          >
            <b-td
              rowspan="8"
              v-if="idx % 8 === 0"
            >{{ item.MODALITY }}</b-td>
            <b-td>{{ itemNames[item.ITEM] }}</b-td>
            <template v-for="(month,idx) in ['JOUNARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']">
              <b-td
                :key="month+'_'+idx"
                v-text="item[month]"
              />
              <b-td
                :key="'p'+month+'_'+idx"
                v-text="`${item['P' + month]}%`"
              />
            </template>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";
import { ReportDaysCompleted } from "@/views/TableState/ReportComponents/ReportStat.js";
import { reportCompleteYear } from "@/assets/service/dataManager.js";
export default {
  components: { NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data () {
    return {
      ReportDaysCompleted,
      //天數統計資料
      Data: [],
      itemNames: {
        1: '<=3',
        2: '4~5',
        3: '6~10',
        4: '11~20',
        5: '21~30',
        6: '31~40',
        7: '>40',
        8: '總計'
      }
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING"]),
    async GetData () {
      if (this.dateRange[0] == null && this.dateRange[1] == null) { //一進來沒有資料不打api //預設為當月
        return { Items: [] };
      }
      this.SHOW_LOADING();
      try {
        const { DxReportCompleteYear } = await reportCompleteYear(this.dateRange[0].substr(0, 4));
        // DxReportCompleteYear.forEach(report => {   // 直接在後面加上 % 即可
        //   Object.keys(report).filter(key => /^P/.test(key)).forEach(key => {
        //     report[key] += "%";
        //   })
        // });
        this.Data = DxReportCompleteYear;
        this.HIDE_LOADING();
      } catch (err) {
        this.HIDE_LOADING();
      }
    },
    refreshTWP () {
      this.GetData();
    }
  }
};
</script>
