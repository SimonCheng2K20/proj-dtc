<template>
  <div class="report">
    <medicScheduleReport class="noPrint" :kinds="kinds" :isLoading="isLoading" :isMonit="true" />
    <medicScheduleReport class="onlyPrint" :kinds="kinds" :isLoading="isLoading" :isMonit="false" />
    <div class="d-flex p-3">
      <div>說明</div>
      <div class="flex-1 text-left">
        <ol>
          <li>天數計算方式不含開單當天、週日</li>
          <li>超出閾值項目天數請用紅筆書寫</li>
          <li>本表每週一由櫃枱排程排程人員負責填寫呈報</li>
          <!-- <li>每月1日的週一為該月第一週</li> -->
        </ol>
      </div>
      <div v-text="$moment().format('YYYY')-1911 + $moment().format('MMDD')" />
    </div>

    <div class="d-flex justify-content-between p-3">
      <div>主任: </div>
      <div>技術組長: </div>
      <div>櫃枱小姐</div>
    </div>


  </div>
</template>
<script>
import { getHrrMessageList, roomScheduleDays, roomScheduleDaysReport } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
import medicScheduleReport from "./medicScheduleWeekReport.vue";
export default {
  props: {
    dateRange: { type: Array },
  },
  components: {
    medicScheduleReport
  },
  data() {
    return {
      isLoading: false,
      scrollHgt: '600px',
      kinds: []
    };
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    refreshTWP() {
      
    },
    finishPrinting() {

    }
  },
  created() {
    this.scrollHgt = (window.innerHeight - 300) + 'px'

    // roomScheduleDaysReport().then(res => {
    //   console.log(res);
    // })
    this.isLoading = true;
    roomScheduleDays().then(items => {
      this.kinds = items.filter(({ Modality }) => Modality!=='XA').reduce((acc, item) => {
        const { Modality, CheckCategoryName: sText, InpatientScheduleDays: day3, OutpatientScheduleDays: day1 } = item;
        const itemObj = acc.find(({text}) => text === Modality) || { text: Modality, items: [] };
        const isNew = itemObj.items.length === 0;


        itemObj.items.push({
          sText, 
          value1: sText === '乳房攝影（10分鐘）預防保健' ? 10 : 5,
          day1, 
          value2: '', day2: '', 
          value3: 2, day3, 
          remark: ''
        })
        if(isNew) acc.push(itemObj);
        return acc;
      }, []);
      this.isLoading = false;
    })
  }
};
</script>

<style lang="scss">
@media print {
  .pageContent {
    margin-top: 0px;
  }
}
</style>

<style lang="scss">
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
  }
  .noPrint {
    display: none;
  }
  .onlyPrint {
    display: block !important;
  }
}

.onlyPrint {
  display: none;
}
</style>


