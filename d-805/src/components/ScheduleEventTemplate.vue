<template>
  <div class="template-wrapper">
    <div class="subject">
      <!-- <span style="color: #fff;" class="zhTW">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;:</span> -->
      <span style="color: #fff;" class="zhTW">【{{ data.PatientName }}】</span>
      <span style="color: #fff;" class="zhTW">{{ data.CheckItemName }}</span>
    </div>

    <div class="subject">
      <span style="color: #fff;" class="zhTW"
        >{{ SinglgeNumTo2Digit(data.StartTime.getHours()) }}:{{ SinglgeNumTo2Digit(data.StartTime.getMinutes()) }} ~ {{ SinglgeNumTo2Digit(data.EndTime.getHours()) }}:{{
          SinglgeNumTo2Digit(data.EndTime.getMinutes())
        }}</span
      >
    </div>
  </div>
</template>
<script>
import { dateFormatMixin } from "@/SupportLib_J.js";

export default {
  mixins: [dateFormatMixin],
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    console.log("ScheduleEvent data:" + this.data);
  }
};
</script>
