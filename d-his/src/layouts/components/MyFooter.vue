<template>
  <q-footer class="text-[13px]" bordered>
    <div class="flex flex-nowrap justify-center items-center gap-4 p-4 bg-[#035ab8]">
      <div>
        <p>本網站為合華科技股份有限公司版權所有，未經允許不得以任何形式複製和採用。Copyright <q-icon name="copyright"></q-icon> 2023</p>
        <p>本網站建議使用 Chrome 瀏覽器瀏覽並搭配 1920 x 1080（含）以上之螢幕解析度，以獲得最佳瀏覽體驗。</p>
      </div>

      <div>
        <q-img src="~assets/dtc_logo.svg" :width="150 + 'px'" :height="50 + 'px'" no-transition></q-img>
      </div>

      <div>
        <div>客服專線：0800-500019</div>
        <div>軟體版本號：{{ version }}</div>
      </div>
    </div>
  </q-footer>
</template>

<script setup>
const version = process.env.VERSION
</script>

