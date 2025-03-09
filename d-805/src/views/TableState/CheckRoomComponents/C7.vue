<template>
  <div style="overflow:auto">
    <twp
      ref="twp"
      :FieldConfig="CIDataList"
      :DataFetch="GetData"
      :isBackEndPagination="true"
      :heightForScroll="scrollHeight"
    ></twp>
  </div>
</template>

<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapGetters, mapMutations } from "vuex";

//twp欄位
import { MedicationNoUsedDetail } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedCheckRoom: { type: Number },
    medicationNo: { type: String },
    patientSource: { type: Array },
    scrollHeight: { type: String }
  },
  data () {
    return {
      CIDataList: MedicationNoUsedDetail,
      InspectDevice: "",
      //data array
      Data: []
    };
  },
  computed: {
    ...mapGetters(['getModalityOptions'])
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    async GetData (id, page, per) {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        return { Items: [] };
      }
      let data;
      this.SHOW_LOADING();
      const params = this.dateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Date';
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')}`)
        }
        return acc;
      }, []);

      // params.push(`modalities=${this.getModalityOptions.map(({ value }) => value).join(',')}`);  // modality
      if (this.medicationNo) params.push(`medicationNo=${this.medicationNo}`);
      if (this.patientSource.length > 0) params.push(`patientSource=${this.patientSource.join(',')}`);
      await window.axios
        .get(`/examMedication/MedicationNoUsedDetail?${params.join('&')}&indexPage=${page}&top=${per}`)
        .then(r => {
          data = r;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.HIDE_LOADING();
        });
      data.Items.forEach(e => {
        let d = new Date(e.ScheduleCompleteTime);
        e.ScheduleCompleteTime = this.DateToString(d, true);
      });
      return data;
    },
    refreshTWP () {
      //refreshTWP
      if (this.dateRange[0] && this.dateRange[1]) {
        this.$refs["twp"].OnForceRefresh();
        // this.GetData();
      } else {
        // this.ObjApp.TimingMessage("條件請選擇完整", 2);
        this.SET_SIDE_MESSAGE({ msg: "條件請選擇完整", type: 2 })
      }
    }
  },
  mounted () { },
  created () {
    this.GetData();
  }
};
</script>
