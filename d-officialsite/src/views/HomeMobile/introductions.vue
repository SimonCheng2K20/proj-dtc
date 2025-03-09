<template>
  <div>
    <div class="p-4">
      <dtc-title main="SERVICE ITEMS" sub="服務項目" />
    </div>

    <div class="service-content mt-2 mb-4">

      <div v-if="serviceIndex===0" class="item items-ground px-2"  style="background-image: url(homeMobile_image/healthcare.jpg)">
        <div class="px-3">
          <div class="item-title text-center">資訊設備系統解決方案</div>
          <div class="d-grid systems">
            <div v-for="system in systems" :key="system" class="pt-1 d-flex justify-content-start">
              <div>．</div>
              <div v-text="system" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="serviceIndex===1" class="item items-ground px-2" style="background-image: url(homeMobile_image/fix.jpg)">
        <div class="px-3">
          <div class="item-title text-center">醫療資訊系統解決方案</div>
          <div class="d-grid systems">
            
            <div v-for="solution in solutions" :key="solution" class="pt-1 d-flex justify-content-start">
              <div>．</div>
              <div  v-text="solution" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="service-page d-flex justify-content-center mt-2">
        <div class="px-1 py-2" :class="{'active': serviceIndex===0}" @click.stop="serviceIndex=0" />
        <div class="px-1 py-2" :class="{'active': serviceIndex===1}" @click.stop="serviceIndex=1" />
      </div>
    </div>

    <div class="p-4">

      <dtc-title main="NEWS" sub="焦點訊息" :isLeft="false" />

      <div class="news-content mt-2">
        <div class="item mt-2" v-for="item in news.slice(0,3)" :key="item.date">
          <div v-text="item.date" class="date" />
          <div v-text="item.content" />
          <hr class="my-1" />
        </div>
      </div>

      <b-button variant="outline-primary" class="d-table mx-auto mt-2 mb-3" size="sm" @click.stop="$router.push({ name: 'newsMobile' })">
        更多消息
        <b-icon icon="arrow-right-short" />
      </b-button>

      <dtc-title main="ABOUT US" sub="關於我們" />

      <div class="about-content mt-2">
        合華科技創立民國七十六年，一直以專業化的資訊服務為經營的方向，專業醫療背景的負責人與開發團隊，擁有優越的整合技術與經驗以及底層DICOM核心技術，可整合各種不同醫療儀器與各家HIS/PACS廠商的系統及有效解決各種疑難與技術問題，提供醫療院更高規的管理與流程改造建議。
      </div>

      <b-button variant="outline-primary" class="d-table mx-auto mt-2 mb-3" size="sm" @click.stop="$router.push({ name: 'AboutMobile' })">
        瞭解更多
        <b-icon icon="arrow-right-short" />
      </b-button>
    </div>
  </div>
</template>

<script>
import dtcTitle from "@/components/dtc-title.vue";
import news from "@/assets/js/news.js";
export default {
  components: {
    dtcTitle
  },
  data () {
    return {
      news,
      serviceIndex: 0,
      systems: [
        'HIS-醫院資訊系統','HAS-醫院評鑑系統',
        'PACS-影像醫學傳輪系統','POC-床邊照護系統',
        'SRRS-手術記銬報告系','MRIS-病歴掃描倉储系統',
        'EMR-電子病例管理系統','ADS-血液淨化管理系統',
        'PES-病理検驗系統','IHE-區域醫療平台',
        'LIS-檢驗資訊系統','PHR-基層醫療管理',
        'CTPS-癌症管理系統','RIS-放射資訊系統'
      ],
      solutions: [
        '資訊安全系統建置與維護',
        '軟硬體整合系統建置與維護',
        '數位監控系統建置與維護',
        '網路系統建置與維護',
        '資訊設備軟體硬體採購'
      ]
    }
  }
}
</script>

<style lang="scss">
.items-ground {
  background: transparent no-repeat center center / cover;
  > div {
    min-height: 210px;
    background-color: rgba(255, 255, 255, .9);
  }
}

.news-content, .about-content {
  color: #555;
  .date {
    font-size: 0.7rem;
  }
}

.about-content {
  text-indent: 2rem;
}

.service-image {
  width: 40vw;
}

.d-grid {
  display: grid;
}

.systems, .solutions {
  color: #333;
  font-size: 0.7rem;
}
.systems {
  grid-template-columns: repeat(2, 1fr);
}

.item-title {
  color: #000;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2;
}

.solutions ul {
  list-style-position: inside;
}
.service-content {
  .service-page {
    color: #000;
    > div {
      &:before {
        content: '';
        display: table;
        width:21px;
        height: 3px;
        background-color: #999;
      }
      &.active {
        &:before {
          background-color: var(--primary);
        }
      }
    }
  }
}

.sysmtem-data {
  background-color: rgba(255, 255, 255, .33);
  > div {
    border: 1px solid #fff;
    color: #fff;
    background-color: rgba(0,0,0,.33);
    text-align: center;
    font-size: 1rem;
  }
}

.absolute-full {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

</style>
