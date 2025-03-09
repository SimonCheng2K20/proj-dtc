<template>
  <div class="tooltip-wrap">
    <div class="content-area">
      <div class="name">檢查項目:&nbsp;{{ data.CheckItemName }}</div>
      <div class="time">開始時間:&nbsp;{{ $moment(data.StartTime).format("HH:mm") }}</div>
      <div class="time">結束時間:&nbsp;{{ $moment(data.EndTime).format("HH:mm") }}</div>
      <div class="name" v-if="data.PatientName && data.PatientName.length > 0">病患姓名:&nbsp;{{ data.PatientName }}</div>

      <div class="name" v-if="data.PatientId && data.PatientId.length > 0">病歷號碼:&nbsp;{{ data.PatientId }}</div>
      <div class="name" v-if="data.PatientId && data.PatientId.length > 0">電話[住家]:&nbsp;{{ data.PhoneNo4Residence ? data.PhoneNo4Residence : "" }}</div>
      <div class="name" v-if="data.PatientId && data.PatientId.length > 0">電話[手機]:&nbsp;{{ data.PhoneNo4Mobile ? data.PhoneNo4Mobile : "" }}</div>
      <div class="name" v-if="data.PatientId && data.PatientId.length > 0">電話[工作]:&nbsp;{{ data.PhoneNo4Work ? data.PhoneNo4Work : "" }}</div>

      <!-- <div class="name">病患電話:&nbsp;{{ (data.PatientPhone?data.PatientPhone:"") }}</div> -->
      <div class="name">備&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;註:&nbsp;{{ data.Description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  }
};
</script>
<style></style>
