<template>
  <div class="news">
    <dtc-banner title="成功案例" path="首頁/成功案例" image="successMobile_image/client_banner.jpg" />
    <div class="p-3">
      <dtc-title main="SYSTEMS" sub="系統建置" />
      <div class="px-3 mb-5 mt-2">
        <b-img src="successMobile_image/case1.jpg" class="w-100" />
      </div>

      <dtc-title main="ERM" sub="電子病歷建置" />
      <div class="px-3 mb-5 mt-2">
        <b-img src="successMobile_image/case2.jpg" class="w-100" />
      </div>

      <dtc-title main="ENGINEERING" sub="其他工程建置" />
      <div class="px-3">
        <b-img src="successMobile_image/case3.jpg" class="w-100" />
      </div>
    </div>
  </div>
</template>

<script>
import dtcBanner from "@/components/dtc-banner.vue";
import dtcTitle from "@/components/dtc-title.vue";

export default {
  components: {
    dtcBanner, dtcTitle
  },
  data() {
    return {
      news: [
        
      ],
      pagination: {
        page: 1,
        per: 5
      }
    };
  },
  computed: {
    
  },
  methods: {
    
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
  
</style>
