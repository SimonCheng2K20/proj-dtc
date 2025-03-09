<template>
  <div class="floor">
    <div class="floorBox">
      <div class="floorBoxInfo mr-2">
        <div class="floorBoxInfoItem">客服專線：0800-500019</div>
        <div class="floorBoxInfoItem">軟體版本號： {{versionTime}}</div>
      </div>
      <div class="floorBoxStatement mr-2">
        本網站為合華科技股份有限公司版權所有，未經允許不得以任何形式複製和採用。Copyright © 2022<br>
        本網站建議使用Chrome瀏覽器瀏覽並搭配 1920 x 1080 (以上)之螢幕解析度，以獲得最佳瀏覽體驗。
      </div>
      <img class="floorFAQ" src="../assets/img/logo.png">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      versionTime:window.versionTime
    }
  }
}
</script>