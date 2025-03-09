<template>
  <div style="overflow:hidden">
    <twp
      ref="twp"
      :key="'fields' + fields.length"
      :FieldConfig="fields"
      :DataFetch="GetData"
      :isBackEndPagination="false"
      :heightForScroll="scrollHeight"
    />

  </div>
</template>

<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapMutations } from "vuex";

//twp欄位
import { DayMonthReport } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoomKey: { type: String },
    selectedCheckRoom: { type: Number },
    scrollHeight: { type: String }
    // day: { type: Number }
  },
  data () {
    return {
      CIDataList: DayMonthReport(),
      InspectDevice: "",
      days: {
        begin: 0,
        finish: 0
      }
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    async GetData () {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        return { Items: [] };
      }
      if (this.$moment(this.dateRange[0]).format("MM") != this.$moment(this.dateRange[1]).format("MM")) {
        this.SET_SIDE_MESSAGE({ msg: "必需是同月份", type: 2 });
        return { Items: [] };
      }
      this.SHOW_LOADING();
      const params = this.dateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Date';
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')}`)
        }
        return acc;
      }, []);

      //預計建立
      // const [begin, finish] = this.dateRange.map(datetime => parseInt(this.$moment(datetime).format("DD")));
      // this.days = { begin, finish };
      if (this.selectedCheckRoomKey) params.push(`scheduleLocaion=${this.selectedCheckRoomKey}`);
      params.push("$orderby=MedicationNo");

      try {
        const data = await window.axios.get("/examMedication/DayMonthReport?" + params.join('&'));
        this.HIDE_LOADING();
        return data;
      } catch (err) {
        this.HIDE_LOADING();
        return { Items: [] };
      }

    },
    refreshTWP () {
      if (this.$refs["twp"]) this.$refs["twp"].OnForceRefresh();
    }
  },
  computed: {
    fields () {
      if (!this.dateRange[0]) return [];
      const [year, month] = this.$moment(this.dateRange[0]).format("YYYY-MM").split('-');

      const days = Object.values(this.days).every(v => v)
        ? new Array(this.days.finish - this.days.begin + 1).fill('').map((v, i) => 'Day' + (this.days.begin + i))
        : new Array(new Date(year, month, 0).getDate()).fill('').map((v, i) => 'Day' + (i + 1));
      return this.CIDataList.filter(({ key }) => !key.includes('Day') || days.some(d => d === key));
    }
  }
};
</script>
