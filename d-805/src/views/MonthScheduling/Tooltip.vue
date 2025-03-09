<template>
  <div class="tooltip-wrap">
    <div class="content-area">
      <div class="name">時段類型:&nbsp;{{data.TypeName}}</div>
      <!-- <div class="name" v-if="data.Type==2">檢查項目:&nbsp;{{data.CheckCategoryName}}</div> -->
      <div class="time">開始時間:&nbsp;{{$moment(data.StartDate).format('HH:mm')}}</div>
      <div class="time">結束時間:&nbsp;{{$moment(data.EndTime).format('HH:mm')}}</div>
      <div class="name">備&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;註:&nbsp;{{data.Description}}</div>
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
<style>
</style>