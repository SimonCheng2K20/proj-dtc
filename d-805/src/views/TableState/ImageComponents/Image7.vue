<template>
  <div>
    <twp
      ref="twp"
      :FieldConfig="ReportModifyFields"
      :isBackEndPagination="false"
      :DataFetch="GetData"
      :heightForScroll="tableHgt"
    />
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { ReportModifyFields } from "@/views/TableState/ImageComponents/ImageStat.js";
import { mapMutations } from "vuex";
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data () {
    return {
      ReportModifyFields,
      tableHgt: '450px'
    };
  },
  created() {
    this.tableHgt = (window.innerHeight - 280) + 'px';
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    async GetData () {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] };
      this.SHOW_LOADING();
      const params = this.dateRange.map((datetime, idx) => `${idx === 0 ? 'start' : 'end'}Date=${datetime}`);
      try {
        const data = await window.axios.get(`/schedule/ReportGraphChangeRecordList?${params.join('&')}`);
        data.Items.forEach(item => {
          ['COUNTER_REGISTER', 'CHENGE_DATE'].forEach(key => {
            item[key] = this.$moment(item[key]).format('YYYY-MM-DD hh:mm:ss');
          });

          item["REPORT_DATE"] = this.$moment(item["FIRST_ISSUE_DTTM"]).format('YYYY-MM-DD hh:mm:ss');
          item['MODIFYEXPRESS_INFO'] = (item['MODIFYEXPRESSUSERTYPE_NAME'] && item['MODIFY_EXPRESS_USER_NAME'])
            ? `${item['MODIFYEXPRESSUSERTYPE_NAME']} (${item['MODIFY_EXPRESS_USER_NAME']})`
            : '';
        });
        return data;
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "取資料發生錯誤，請稍候再試", type: 2 });
      } finally {
        this.HIDE_LOADING();
      }
    },
    refreshTWP () {
      this.$refs["twp"].OnForceRefresh();
    }
  }
}
</script>
