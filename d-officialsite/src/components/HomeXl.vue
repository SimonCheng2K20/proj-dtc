<template>
  <section class="dtc-home">
    <span class="one-dot" v-b-visible="visibleHandler"></span>
    <DtcXlNavBar v-if="normalNavBar"></DtcXlNavBar>
    <DtcXlNavWhiteBar v-if="!normalNavBar"></DtcXlNavWhiteBar>
    <div class="banner-img" ref="myBanner" @click="$router.push('contact')">
      <img src="main_left.png" />
      <!-- <img src="main_right.png" class="dtc-b-2" /> -->
    </div>
    <section class="dna">
      <img src="home_image/dna.svg" />
      <nav>
        <h5>SERVICE ITEMS</h5>
        <nav class="dna-nav">
          <h6 @click="clickTab(1)" :style="tab == 1 ? 'color:#5D5D5D' : 'color:#8B8B8B; font-size:22px;'">醫療資訊系統解決方案</h6>
          <h6 @click="clickTab(2)" :style="tab == 2 ? 'color:#5D5D5D' : 'color:#8B8B8B;font-size:22px;'">資訊設備系統解決方案</h6>
        </nav>
        <section class="dna-content" v-if="tab == 1">
          <div style="padding:40px;" class="ask-1">
            <div>HIS-醫院資訊系統</div>
            <div>PACS-影像醫學傳輸系統</div>
            <div>SRRS-手術記錄報告系統</div>
            <div>EMR-電子病歷管理系統</div>
            <div>PES-病理檢驗系統</div>
            <div>LIS-檢驗資訊系統</div>
            <div>CTPS-癌症管理系統</div>
          </div>
          <div style="padding:40px;" class="ask-2">
            <div>HAS-醫院評鑑系統</div>
            <div>POC-床邊照護系統</div>
            <div>MRIS-病歷掃描倉儲系統</div>
            <div>ADS-血液淨化管理系統</div>
            <div>IHE-區域醫療平台</div>
            <div>PHR-基層醫療管理</div>
            <div>RIS-放射資訊系統</div>
          </div>
          <div></div>
        </section>

        <section class="dna-content dna-tab2" v-if="tab == 2">
          <div class="a-img">
            <main style="opacity:0;">
              <div style="font-size:20px !importnat;">專業的團隊與豐富的建置及維護經驗,幫您把關系統每一個環節建置穩定的系統,以下為本公司所提供的系統建置與維護項目：</div>
              <div style="font-size:20px !importnat;">資訊安全系統建置與維護 數位監控系統建置與維護 資訊設備軟體硬體採購</div>
            </main>
          </div>
          <div></div>
        </section>
        <footer class="dna-nav-footer">
          <nav>
            <div :style="tab == 1 ? 'background:#007AD0' : 'background:#D0D0D0'" @click="clickTab(1)"></div>
            <div :style="tab == 2 ? 'background:#007AD0' : 'background:#D0D0D0'" @click="clickTab(2)"></div>
          </nav>
        </footer>
      </nav>
    </section>
    <main class="dtc-clip-path">
      <News></News>
      <About style="margin-top:5.5rem;"></About>
      <Contact style="margin-top:5.5rem;"></Contact>
    </main>
  </section>
</template>

<script>
//焦點訊息
import DtcXlNavBar from "@/components/DtcXlNavBar.vue";
import News from "@/components/News.vue";
import About from "@/components/About.vue";
import Contact from "@/components/ContactDtc.vue";
import DtcXlNavWhiteBar from "@/components/DtcXlNavWhiteBar.vue";
const names = ["醫療資訊系統解決方案", "資訊設備系統解決方案"];
export default {
  data() {
    return {
      names,
      tab: 1,
      normalNavBar: true,
      timer: "",
    };
  },
  components: {
    DtcXlNavBar,
    DtcXlNavWhiteBar,
    News,
    About,
    Contact,
  },
  methods: {
    clickTab(n) {
      this.tab = n;
      clearInterval(this.timer);
    },
    visibleHandler(visible) {
      this.normalNavBar = visible;
      if (!visible) {
        this.$refs.myBanner.classList.add("banner-updated");
      } else {
        this.$refs.myBanner.classList.remove("banner-updated");
      }
    },
  },
  mounted() {
    this.timer = setInterval(() => (this.tab == 1 ? (this.tab = 2) : (this.tab = 1)), 1000 * 9);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dtc-home {
  overflow-x: hidden;
  position: relative;
}

.banner-img {
  display: grid;
  height: 900px;
  cursor: pointer;
  position: relative;
  gap: 0px;
  transition: all 1s ease-in-out;
  > img {
    object-fit: cover;
    width: 100vw;
    height: 900px;
    display: block;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    display: block;
    z-index: 3px;
    background: url("/main_right.png") no-repeat top left;
    background-size: cover;
    height: 900px;
    width: 738px;
  }
}

.banner-title {
  position: absolute;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-65%, -70%);
  font-size: 54px;
  height: 65px;
  line-height: 65px;
  width: 842px;
  color: white;
}
.banner-title {
  margin-top: -65px;
  &::after {
    position: absolute;
    top: 100%;
    content: "一流的專業團隊、完整的產品線以及豐富醫療產業設備與系統建置經驗,更擁有醫學中心等級得醫療系統開發建置經驗";
    width: 856px;
    font-size: 16px;
    display: block;
    margin-top: -20px;
  }

  &::before {
    position: absolute;
    top: 100%;
    content: " 可依照不同規模醫療等級得院所提供最佳的解決方案。";
    width: 756px;
    font-size: 16px;
    display: block;
    margin-top: 6px;
  }
}

.dna {
  position: relative;
  width: 100vw;
  display: grid;
  place-items: center;
  margin-top: 5rem;
  nav > main {
    margin: 0 auto;
    position: relative;
    display: grid;
    place-items: center;
    min-width: 100vh;
    margin-top: 3rem;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 670px;
    height: 750px;
  }
  h5 {
    width: 1240px;
    font-size: 40px;
    color: #3d63cb;
    font-weight: bold;
    position: relative;
    padding-left: 14px;
    &::before,
    &::after {
      position: absolute;
      content: "";
      left: 1px;
      top: 7px;
      width: 4px;
      background: #3d63cb;
      height: 79px;
      font-size: 40px;
    }
    &::after {
      content: "服務項目";
      font-weight: bold;
      top: 100%;
      width: 200px;
      background: none;
      display: block;
      margin-left: 1rem;
      color: #5d5d5d;
      font-size: 34px;
    }
  }
}

.dna-nav {
  display: grid;
  padding-left: 2px;
  width: 1240px;
  grid-template-columns: repeat(2, max-content);
  gap: 1rem;
  padding-top: 4rem;

  h6 {
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 1.1px;
    cursor: pointer;
    z-index: 99;
  }
}
.dna-nav-footer {
  display: grid;
  background: transparent;
  width: 1240px;
  place-items: center;
  nav {
    display: grid;
    grid-template-columns: max-content max-content;
    gap: 1rem;
    transform: translateY(100px);
    > div {
      width: 91px;
      height: 3px;
      cursor: pointer;
    }
  }
}
.dna-content {
  margin-left: 3px;
  width: 1240px;
  color: black;
  height: 320px;
  display: grid;
  background: white;
  grid-template-columns: repeat(2, 305px) 630px;
  //@warngap: 1rem;
  position: relative;
  z-index: 2;
  margin-top: 1rem;
  > div {
    padding: 0px 60px;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    align-items: end;
    z-index: 2;
    order: 1;
    background: white;
  }
  > div:last-child {
    background: url("/home_image/healthcare.png") no-repeat center center;
    background-size: 630px 400px;
    border-radius: none !important;
    order: 2;
    transform: translate3d(-30px, -140px, 0);
    z-index: 1;
  }
  &::after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    display: block;
    z-index: 1;
    width: 610px;
    height: 305px;
    box-shadow: 0px 15px 16px #00000029;
  }
}

.dna-tab2 {
  grid-template-columns: 610px 630px;
  > div:first-child {
    display: grid;
    place-items: center;
    font-size: 20px;
  }
  > div:last-child {
    background: url("/home_image/fix.png") no-repeat center center;
  }
}

.ask-1 {
  > div {
    transform: translateX(30px);
  }
}
.ask-2 {
  > div {
    transform: translateX(-15px);
  }
}
.a-img {
  background: url(/home_image/text2.png) no-repeat center center !important;
  background-size: 610px 320px !important;
}

.dtc-clip-path {
  clip-path: polygon(0 15%, 100% 0%, 100% 100%, 0% 100%);
  height: 2021px;
  width: 100vw;
  background: #f7f7f7;
  transform: translateY(170px);
  > footer {
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
}
.ask-1,
.ask-2 {
  font-size: 20px;
  color: #434343;
}
.one-dot {
  position: absolute;
  top: 70px;
  left: 30px;
  display: block;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
