<template>
  <div class="about">
    <dtc-banner title="關於合華" path="首頁/關於合華" image="aboutMobile_image/banner.jpg" />
    <div class="px-3 py-4">
      <dtc-title main="FOUNDER" sub="創辦人" />
      <div class="p-3">
        <div class="mb-4">
          <div class="sub-title">創辦人</div>
          <div>何慶華先生</div>
        </div>

        <div class="mb-4">
          <div class="sub-title">學歷</div>
          <div>美國約翰霍普金斯醫療政策與管理博士</div>
          <div>國立交通大學碩士</div>
        </div>

        <div class="mb-4">
          <div class="sub-title">經歷</div>
          <div>美國約翰霍普金斯大學校友會常務理事</div>
          <div>台北市電腦公會理事/監事</div>
          <div>合華科技股份有限公司總經理</div>
        </div>
      </div>

      <dtc-title main="ABOUT" sub="公司簡介" />
      <div class="p-3 paragraph">
        <p>合華科技創立於民國七十六年,一直是以專業化的資訊服務為經營的方向,創辦人本身具有國內交通大學專業電腦科技碩士背景外,並具有美國約翰霍普金斯大學醫療政策與管理博士學位,秉持產學合作精神,將學術界與醫療界整合,以全方位拓展公司未來十年的相關醫療技術。隨著時代資通訊技術的不斷創新,全球資訊架構的快速發展,現有老舊的醫療資訊系統已經無法滿足第一線醫護人員的使用需求,有鑑於此公司研發團隊更是不遺餘力的努力引進最新的技術及架構以符合市場的期待。</p>
        <p>十多年以來隨著市場的不斷創新變化,公司也隨時調整營運策略方針,並且秉持著走在市場前端,以完善的整體專案及最新的技術提供客戶,達成客戶的滿意度,公司更於84年獲得ISO9001及ISO14001的品質認證。</p>
        <p>目前國內醫療機構所使用的資訊系統大都已超過了軟體的生命周期,往往造成了第一線醫護人員使用上的不便,目前在全球智慧醫療及AI人工智慧的大浪潮下,以全新的思維及技術框架提供給客戶最先進優良的系統是我們的目標也是我們公司的使命。</p>
      </div>

      <dtc-title main="ORGANIZATION" sub="組織架構" />
      <b-img src="aboutMobile_image\origination.jpg" class="w-100 my-3" />
    </div>

  </div>
</template>

<script>
import dtcTitle from "@/components/dtc-title.vue";
import dtcBanner from "@/components/dtc-banner.vue";
export default {
  components: {
    dtcTitle, dtcBanner
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.about {
  color: #5d5d5d;
}

.paragraph {
  > p {
    text-indent: 2rem;
  }
}
</style>
