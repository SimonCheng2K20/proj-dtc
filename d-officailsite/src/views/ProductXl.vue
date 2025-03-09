<template>
  <section class="about-us">
    <DtcXlNavWhiteBar></DtcXlNavWhiteBar>
    <div class="banner">
      <img src="ris_title.png" height="76" v-if="activeIdx == 0" />
      <img src="pacs_title.png" height="76" v-if="activeIdx == 1" />
      <img src="his_title.png" height="76" v-if="activeIdx == 2" />
      <img src="srrs_title.png" height="76" v-if="activeIdx == 3" />
      <img src="emr_title.png" height="76" v-if="activeIdx == 4" />
      <img src="pes_title.png" height="76" v-if="activeIdx == 5" />
      <img src="lis_title.png" height="76" v-if="activeIdx == 6" />
      <img src="ctps_title.png" height="76" v-if="activeIdx == 7" />
      <img src="mris_title.png" height="76" v-if="activeIdx == 8" />
      <img src="ads_title.png" height="76" v-if="activeIdx == 9" />
    </div>
    <div class="dtc-body">
      <nav>
        <div @click="activeIdx = i" :class="i == activeIdx ? 'active-nav-dtc' : ''" v-for="(item, i) in names" :key="i">{{ item }}</div>
      </nav>
      <main v-for="(item, i) in imgs" :key="i" v-show="i == activeIdx">
        <nav v-if="i == 1" style="margin-left:50px;">
          <h5 class="prods">產品型號</h5>
          <main class="grid-7">
            <div @click="update(item)" v-for="(item, t) in pacsPros1" :key="t" :style="pacsSelected == t ? 'color:#3D63CB' : ''">{{ item }}</div>
          </main>
          <main class="grid-7">
            <div
              :class="item == 'ImageCore' ? 'ml-2' : ''"
              @click="update(item)"
              v-for="(item, k) in pacsPros2"
              :key="k"
              :style="pacsSelected == k + 7 ? 'color:#3D63CB' : ''"
            >
              {{ item }}
            </div>
          </main>
        </nav>
        <img :src="item" v-if="i != 1" />
        <img src="DC-100.png" v-if="pacsName == 'DC-100'" />
        <img src="DC-200.png" v-if="pacsName == 'DC-200'" />
        <img src="DC-300.png" v-if="pacsName == 'DC-300'" />
        <img src="DC-500.png" v-if="pacsName == 'DC-500'" />
        <img src="DC-600.png" v-if="pacsName == 'DC-600'" />
        <img src="DC-700.png" v-if="pacsName == 'DC-700'" />
        <img src="DC-810.png" v-if="pacsName == 'DC-810'" />
        <img src="DC-830.png" v-if="pacsName == 'DC-830'" />
        <img src="DC-1800.png" v-if="pacsName == 'DC-1800'" />
        <img src="DICOM0-DIR.png" v-if="pacsName == 'Dicom Dir'" />
      </main>
    </div>
  </section>
</template>

<script>
import DtcXlNavWhiteBar from "@/components/DtcXlNavWhiteBar.vue";
const dummy = `RIS-放射資訊系統 PACS-影像醫學傳輸系統 HIS-醫院資訊系統 SRRS-手術記錄報告系統 EMR-電子病歷管理系統 PES-病理檢驗系統 LIS-檢驗資訊系統 CTPS-癌症管理系統 MRIS-病歷掃描倉儲系統 ADS-血液淨化管理系統`;
const names = dummy.split(" ");
const imgs = [
  "ris_content.png",
  "//unsplash.it/890/1094?image=1",
  "2020-09-15 09.29.44.jpg",
  "2020-09-15 09.29.55.jpg",
  "2020-09-15 09.29.30.jpg",
  "pes_content.png",
  "lis_content.png",
  "ctps_content.png",
  "mris_content.png",
  "ads_content.png",
];
const pacsPros1 = ["DC-100", "DC-200", "DC-300", "DC-500", "DC-600", "DC-700", ""];
const pacsPros2 = ["DC-810", "DC-830", "DC-1800", "Dicom Dir", ""];
export default {
  data() {
    return {
      names,
      activeIdx: 0,
      imgs,
      pacsPros1,
      pacsPros2,
      pacsSelected: 0,
    };
  },
  components: {
    DtcXlNavWhiteBar,
  },
  computed: {
    pacsName() {
      const arr = [...pacsPros1, ...pacsPros2];
      return this.activeIdx == 1 ? arr[this.pacsSelected] : "";
    },
  },
  methods: {
    update(name) {
      const arr = [...pacsPros1, ...pacsPros2];
      this.pacsSelected = arr.findIndex((s) => s == name);
    },
  },
  watch: {
    activeIdx() {
      this.pacsSelected = 0;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.about-us {
  width: 100vw;
  color: black;
  display: flex;
  flex-direction: column;
}
.dtc-body {
  display: grid;
  grid-template-columns: 234px 1fr;
  width: 1200px;
  gap: 1rem;
  margin: 4rem auto;
  > nav {
    display: flex;
    flex-direction: column;
    > div:first-child {
      margin-top: 60px;
    }
    > div {
      margin-bottom: 30px;
      cursor: pointer;
    }
    main {
      display: flex;
      flex-direction: column;
      > img {
        display: block;
        object-fit: cover;
        width: 100%;
      }
    }
  }
}
.banner {
  width: 100vw;
  height: 380px;
  background: url("/product_banner.png") no-repeat center center;
  background-size: cover;
  display: grid;
  place-items: center;
  > img {
    transform: translateY(40px);
  }
}

footer {
  height: 90px;
  background: #242424;
  display: grid;
  place-items: center;

  main {
    width: 288px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    > div:last-child {
      font-size: 13px;
    }
    nav {
      display: grid;
      grid-template-columns: max-content 1px max-content 1px max-content;
      gap: 1rem;
      > div {
        background: white;
        height: 70%;
        cursor: pointer;
      }
    }
  }
  h5 {
    color: #cecece;
    font-size: 18px;
    text-align: center;
    transform: translateX(-10px);
  }
  h6 {
    color: #f2f2f2;
    cursor: pointer;
    font-size: 14px;
  }
}
.active-nav-dtc {
  color: #274db7;
}

.grid-7 {
  display: grid;
  grid-template-columns: repeat(7, 85px);
  margin-bottom: 1rem;
  color: black;
  > div {
    cursor: pointer;
  }
}
.prods {
  color: #3d63cb;
  font-size: 20px;
  margin-bottom: 1rem;
}
</style>
