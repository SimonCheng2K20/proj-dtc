<template>
  <div class="tooltip-wrap">
    <div class="content-area">
      <!-- <div class="name">每週({{data.Weekly}})</div> -->
      <div class="name">時段類型:&nbsp;{{ data.TypeName }}</div>
      <!-- <div v-if="data.CheckItemNames && data.CheckItemNames.length > 0" class="name"></div> -->
      <p>項&nbsp;&nbsp;&nbsp;&nbsp;目：</p>
      <!-- key不能重覆所要加一個a -->
      <div v-for="(row, index) in CheckItemNames" :key="`a${index}`" class="name">
        <p>{{ index + 1 }}.&nbsp;{{ row }}</p>
      </div>
      <p>就診來源：</p>
      <div v-for="(row, i) in ExamineSourceName" :key="i" class="name">
        <p>{{ i + 1 }}.&nbsp;{{ row }}</p>
      </div>
      <div v-if="data.Duration > 0" class="name">允許檢查分鐘數:&nbsp;{{ data.Duration }}分鐘</div>
      <div v-if="data.FreeDays > 0" class="name">就診來源解鎖天數:&nbsp;{{ data.FreeDays }}天</div>
      <div v-if="data.IsOld != null" class="name">年齡限制:&nbsp;{{ data.IsOld ? "85歲以上" : "85歲以下" }}</div>
      <!-- <div class="name" v-if="data.Type==2">檢查項目:&nbsp;{{data.CheckCategoryName}}</div> -->
      <div class="time">開始時間:&nbsp;{{ $moment(data.StartTime).format("HH:mm") }}</div>
      <div class="time">結束時間:&nbsp;{{ $moment(data.EndTime).format("HH:mm") }}</div>
      <div class="name">備&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;註:&nbsp;{{ data.Description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      ExamineSourceName: [],
      CheckItemNames: []
    };
  },
  mounted() {
    // var dd = 0;
    //就診來源 (數字轉成string)
    this.data.ExamineSources.forEach(e => {
      if (e == "O") {
        this.ExamineSourceName.push("門診");
      } else if (e == "G") {
        this.ExamineSourceName.push("健檢");
      } else if (e == "E") {
        this.ExamineSourceName.push("急診");
      } else if (e == "I") {
        this.ExamineSourceName.push("住院");
      } else if (e == "Z") {
        this.ExamineSourceName.push("轉檢");
      } else if (e == "T") {
        this.ExamineSourceName.push("轉診");
      }
    });
    console.log(this.ExamineSourceName);
    //指定檢查項目
    this.CheckItemNames = this.data.CheckItemNames;
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0px;
}
</style>
