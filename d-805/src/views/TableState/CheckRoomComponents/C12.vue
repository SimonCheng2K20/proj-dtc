<template>
  <div style="overflow:hidden">
    <div
      class="text-left px-2 pt-3"
      v-if="total!==null"
    >檢查總數: <b>{{total}}</b>, 重照比例: <b>{{repeatedRate}}</b>, 不良比例: <b>{{failRate}}</b></div>
    <twp
      ref="twp"
      :FieldConfig="FailFields"
      :DataFetch="GetData"
      :isBackEndPagination="true"
      :heightForScroll="scrollHeight"
    />

  </div>
</template>

<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapMutations, mapGetters } from "vuex";
import { getFailImages } from "@/assets/service/dataManager.js";
import { FailImages } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";

export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoomKey: { type: String },
    selectedCheckRoom: { type: Number },
    failImage: { type: Object, default: () => ({}) },
    scrollHeight: { type: String }
    // day: { type: Number }
  },
  data () {
    return {
      FailFields: FailImages,
      days: {
        begin: 0,
        finish: 0
      },
      perPage: 10,
      rows: 0,
      currentPage: 1,
      total: null,
      repeatedRate: null,
      failRate: null
    };
  },
  computed: {
    ...mapGetters(['getModalityOptions'])
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    async GetData () {
      //一進來沒有資料不打api
      const { PagingCurrentPage, PagingRowPerPage } = this.$refs['twp'];

      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        return { Items: [] };
      }

      this.SHOW_LOADING();
      const params = this.dateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Dt';
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')}`)
        }
        return acc;
      }, []);
      params.push(`top=${PagingRowPerPage}`);
      params.push(`indexPage=${PagingCurrentPage}`);

      Object.keys(this.failImage).forEach(k => {
        if (this.failImage[k]) {
          params.push(`${k}=${this.failImage[k]}`)
        }
      });

      try {
        const data = await getFailImages(params.join('&'));
        this.HIDE_LOADING();
        data.Items.forEach(item => {
          item['STEP_COMBO'] = `歸於${item.STEP < 3 ? 'R有' : 'F無'}效階段 - ${item['STEP_NAME']}`;
          item['MODALITY_NAME'] = item['MODALITY'] === 'CR'
            ? 'X-Ray'
            : item['MODALITY']
              ? 'Special'
              : '';
        });

        this.total = data.Total;
        this.repeatedRate = data.RepeatedRate;
        this.failRate = data.FailRate;

        return data;
      } catch (err) {
        this.HIDE_LOADING();
        return { Items: [] };
      }

    },
    refreshTWP () {
      if (this.$refs["twp"]) this.$refs["twp"].OnForceRefresh();
    }
  }
};
</script>
