<template>
  <div class="tooltip-wrap">
    <div class="content-area">
      <!-- <div class="name">每週({{data.Weekly}})</div> -->
      <div class="name">值班醫師:&nbsp;{{ data.EmployeeName }}</div>
      <!-- <div class="name" v-if="data.Type==2">檢查項目:&nbsp;{{data.CheckCategoryName}}</div> -->
      <div class="name">值班時間:&nbsp;{{ serveTime }}</div>

      <div v-if="showSection == 2">
        <div class="name" v-if="data.StartTime.getDay() > 5 || data.StartTime.getDay() == 0">值班時段:&nbsp;全天</div>
        <div class="name" v-else-if="data.StartTime.getHours() < 12">值班時段:&nbsp;上午</div>
        <div class="name" v-else>值班時段:&nbsp;下午</div>
      </div>
      <div v-else-if="showSection == 1">
        <div class="name">值班時段:&nbsp;{{ data.StartTime.getHours() + ":00 ~" + data.EndTime.getHours() + ":00" }}</div>
      </div>

      <div class="time" v-if="data.WorkDate > 0">指定日期:&nbsp;{{ new Date(data.MonthDate).getMonth() + 1 + "/" + data.WorkDate }}</div>
      <div class="time" v-else>指定日期:&nbsp;無</div>
    </div>
  </div>
</template>

<script>
import DateHelper from "../../library/DateHelper";

export default {
  data() {
    return {
      data: {},
      dataHelper: DateHelper
    };
  },
  computed: {
    serveTime() {
      if (this.data.TagNo == "EMERG_X" || this.data.TagNo == "EMERG_CTMR") {
        return (
          this.dataHelper.parseWeekDayToChinese(this.data.StartTime.getDay()) +
          " " +
          this.data.StartTime.getHours() +
          ":00 ~ " +
          this.dataHelper.parseWeekDayToChinese(this.data.EndTime.getDay()) +
          " " +
          this.data.EndTime.getHours() +
          ":00"
        );
      } else {
        return this.dataHelper.parseWeekDayToChinese(this.data.StartTime.getDay());
      }
    },
    showSection() {
      if (this.data.TagNo == "EMERG_X" || this.data.TagNo == "EMERG_CTMR") {
        return 0;
      } else if (this.data.TagNo == "PhysicalExam" && this.data.StartTime.getDay() <= 5 && this.data.StartTime.getDay() >= 1) {
        return 1;
      } else {
        return 2;
      }
    }
  }
};
</script>
