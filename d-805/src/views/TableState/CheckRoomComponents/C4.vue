<template>
  <div style="overflow:auto">
    <div v-if="Data.length !== 0">
      <b-table-simple
        hover
        small
        caption-top
        responsive
        :sticky-header="tableHeight"
        :heightForScroll="cusScrollHeight"
      >
        <b-thead head-variant="dark">
          <b-tr>
            <b-th colspan="2"></b-th>
            <b-th colspan="3">住院</b-th>
            <b-th colspan="3">門診</b-th>
            <b-th colspan="3">急診</b-th>
            <b-th colspan="3">健檢</b-th>
            <b-th colspan="3">轉檢</b-th>
            <b-th colspan="3">轉診</b-th>
            <b-th colspan="3">合計</b-th>
          </b-tr>
          <!-- <b-tr v-for="(item, idx) in CIDataList" :key="idx"> -->
          <b-tr>
            <b-th
              style="white-space:nowrap; font-weight: bold;"
              v-for="(item, idx) in CIDataList"
              :key="idx"
            >{{ item.label }}</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="(item, idx) in Data"
            :key="idx"
            variant
          >
            <!-- 第一個是合併表格 -->
            <b-th
              rowspan="3"
              v-show="idx == 0 || idx%3 == 0 "
            >{{ item.Modality }}</b-th>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Date }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count1 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition1 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate1 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count2 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition2 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate2 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count3 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition3 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate3 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count4 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition4 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate4 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count5 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition5 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate5 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Count6 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.Addition6 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.AdditionRate6 }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.TotalCount }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.TotalAddition }}</b-td>
            <b-td :variant="idx == 0 || idx%3 == 0  ? '' : 'primary'">{{ item.TotalAdditionRate }}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";
import { getModalitySourceTypeCountList } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
import { SourceTable } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
export default {
  mixins: [dateFormatMixin],
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array }
  },
  data () {
    return {
      CIDataList: SourceTable,
      Data: []
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    numberToPercent (num) {
      return Number(num * 100).toFixed(1) + '%';
    },
    handelData (items) {
      items.forEach(item => {
        ['AdditionRate1', 'AdditionRate2', 'AdditionRate3', 'AdditionRate4', 'AdditionRate5', 'AdditionRate6', 'TotalAdditionRate'].forEach((str) => {
          item[str] = this.numberToPercent(item[str]);
        })
      });
      for (let i = 0; items.length > i; i = i + 3) {
        new Array(6).fill('').forEach((v, idx) => {
          items[i][`Addition${idx + 1}`] = "-";
          items[i][`AdditionRate${idx + 1}`] = "-";
        });
      }
      return items;
    },
    async GetData () {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] };
      const params = this.$moment(this.dateRange[0]).format('YYYY-MM').split('-').map((v, i) => `${i === 0 ? 'year' : 'month'}=${v}`)
      this.SHOW_LOADING();
      try {
        const data = await getModalitySourceTypeCountList(params.join('&'));
        this.Data = this.handelData(data);
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + '!稍後再試', type: 2 })
      } finally {
        this.HIDE_LOADING();
      }
    },
    refreshTWP () {
      this.GetData();
    }
  },
  created () {
    this.GetData();
  },
  computed: {
    tableHeight () {
      return ((isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight) - document.getElementById('searchBarCard').clientHeight - 100) + 'px';
    },
    cusScrollHeight () {
      return (window.innerHeight - 400) + 'px';
    }
  }
};
</script>
<style lang="scss" scoped>
.btbody-c4 {
  &::-webkit-scrollbar {
    background-color: #ccc;
    width: 2px; /* Remove scrollbar space */
    height: 7px;
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  &::-webkit-scrollbar-thumb {
    background: #4d5760;
    border-radius: 5px;
  }
}
.b-table {
  tbody {
    font-weight: bold;
  }
}
</style>
