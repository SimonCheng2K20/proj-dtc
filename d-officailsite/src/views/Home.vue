<template>
  <section class="dtc-home">
    <span class="one-dot" v-b-visible="visibleHandler"></span>
    <!-- <DtcXlNavBar v-if="normalNavBar"></DtcXlNavBar> -->
    <DtcXlNavWhiteBar />
    <div class="banner-img2" ref="myBanner" @click="openTabOmi">
      <div
        class="container-PC"
        :style="{
          backgroundImage: `url('/2023/dtc-background_1920x840.png')`,
        }"
      >
        <div
          class="obj bor"
          data-aos="fade-in"
          data-aos-delay="300"
          data-aos-duration="300"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div class="line"></div>
        </div>
        <div
          class="countArea One"
          data-aos="fade-up"
          data-aos-delay="1500"
          data-aos-duration="300"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div class="obj pic-1-box">
            <div class="bnBox">
              <h3>目前使用的醫學中心</h3>
              <!-- <div class="countNum tracking-in-expand">07</div> -->
              <div class="countNum tracking-in-expand">
                {{ twoDigit(centerNum) }}
              </div>
              <div class="countUnit">家</div>
            </div>
          </div>
          <img class="pic-1" src="2023/co-center.svg" alt="" />
        </div>
        <div
          class="countArea Two"
          data-aos="fade-up"
          data-aos-delay="1800"
          data-aos-duration="300"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div class="obj pic-2-box">
            <div class="bnBox">
              <h3>合作醫院</h3>
              <!-- <div class="countNum tracking-in-expand">42</div> -->
              <div class="countNum tracking-in-expand">
                {{ twoDigit(hospitalNum) }}
              </div>
              <div class="countUnit">家</div>
            </div>
          </div>
          <img class="pic-2" src="2023/co-hospitals.svg" alt="" />
        </div>
        <div class="textArea Main">
          <h2
            data-aos="zoom-in-right"
            data-aos-delay="500"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
            <span>Remote Consultation System</span>
            <br />
            遠距醫療會診平臺
          </h2>
        </div>
        <div class="textArea Sub">
          <div
            class="dot"
            data-aos="zoom-in-right"
            data-aos-delay="800"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          ></div>
          <p
            class="feature"
            data-aos="zoom-in-right"
            data-aos-delay="800"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
            系統特色
          </p>
          <p
            class="notes"
            data-aos="zoom-in-right"
            data-aos-delay="1200"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
            不用額外增加硬體設備 <span>(</span> 手機、平版、行動裝置皆可
            <span>)</span>
            <br />
            操作使用簡單方便 <span>(</span> Plug <span>&amp;</span> Play
            <span>)</span>
          </p>
        </div>
        <a
          class="bn-Btn pulsate-fwd-slow"
          :class="{ Visible: showMore }"
          href="javascript:;"
          @click="scrollToContent('myClients', 100)"
        >
          <span class="lTxt">暸解更多</span><span>➨</span>
        </a>
        <a
          class="bn-Arrow pulsate-fwd"
          :class="{ Visible: showMore }"
          href="javascript:;"
          @click="scrollToContent('myClients', 100)"
          v-if="showMore === true"
        >
          <img src="2023/more_info.svg" alt="" />
        </a>
      </div>
      <!-- <img src="2023/dtc_web_background.png" alt="" /> -->
    </div>
    <div class="my-clients" ref="myClients">
      <h2>目前使用的醫學中心</h2>
      <ul>
        <li>
          <img
            src="2023/logo-hospitals/center-1.png"
            title="國立成功大學附設醫院"
            alt="國立成功大學附設醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-2.png"
            title="台東馬偕紀念醫院"
            alt="台東馬偕紀念醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-3.png"
            title="彰化基督教醫療財團法人彰化基督教醫院"
            alt="彰化基督教醫療財團法人彰化基督教醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-4.gif"
            title="臺中榮民總醫院"
            alt="臺中榮民總醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-5.png"
            title="中國醫藥大學附設醫院"
            alt="中國醫藥大學附設醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-6.png"
            title="台大醫院"
            alt="台大醫院"
          />
        </li>
        <li>
          <img
            src="2023/logo-hospitals/center-7-1.png"
            title="高雄醫學大學附設中和紀念醫院"
            alt="高雄醫學大學附設中和紀念醫院"
          />
        </li>
      </ul>
      <h2>目前使用的合作醫院</h2>
      <div class="text-box">
        <div class="tb-item">
          <h3>雙北合作網絡</h3>
          <ul>
            <li>國立臺灣大學醫學院附設醫院兒童醫院</li>
            <li>醫療財團法人徐元智先生醫藥基金會亞東紀念醫院</li>
            <li>臺北榮民總醫院</li>
            <li>台灣基督長老教會馬偕醫療財團法人馬偕兒童醫院</li>
            <li>西園醫療社團法人西園醫院</li>
            <li>天主教耕莘醫療財團法人耕莘醫院安康院區</li>
            <li>國立臺灣大學醫學院附設醫院金山分院(跨)</li>
          </ul>
        </div>
        <div class="tb-item">
          <h3>臺東網絡</h3>
          <ul>
            <li>東基醫療財團法人台東基督教醫院</li>
            <li>臺北榮民總醫院臺東分院</li>
            <li>佛教慈濟醫療財團法人關山慈濟醫院</li>
          </ul>
        </div>
        <div class="tb-item">
          <h3>中苗合作網絡</h3>
          <ul>
            <li>臺中榮民總醫院</li>
            <li>大千綜合醫院</li>
            <li>臺中榮民總醫院埔里分院</li>
            <li>為恭醫療財團法人為恭紀念醫院</li>
            <li>仁愛鄉台14甲線清境國民賓館旁(台中榮民總醫院埔里分院)</li>
            <li>和平谷關民宅(跨)(台中榮民總醫院)</li>
            <li>泰安錦水假日急醫療站(跨)※(大千綜合醫院)</li>
          </ul>
        </div>
        <div class="tb-break"></div>
        <div class="tb-item">
          <h3>中投合作網絡</h3>
          <ul>
            <li>中國醫藥大學附設兒童醫院</li>
            <li>中山醫學大學附設醫院</li>
            <li>衛生福利部南投醫院</li>
            <li>竹山秀傳醫院</li>
            <li>埔基醫療財團法人埔里基督教醫院</li>
            <li>佑民醫療社團法人佑民醫院</li>
            <li>日月潭緊急醫療站(埔里基督教醫院)</li>
          </ul>
        </div>
        <div class="tb-item">
          <h3>雲彰合作網絡</h3>
          <ul>
            <li>彰化基督教醫療財團法人彰化基督教兒童醫院</li>
            <li>彰化基督教醫療財團法人二林基督教醫院</li>
            <li>仁和醫院</li>
            <li>道安醫院</li>
            <li>彰化基督教醫療財團法人南投基督教醫院</li>
            <li>卓醫院</li>
          </ul>
        </div>
        <div class="tb-item">
          <h3>臺南網絡(成大)</h3>
          <ul>
            <li>國立成功大學醫學院附設醫院</li>
            <li>郭綜合醫院</li>
            <li>衛生福利部臺南醫院新化分院</li>
            <li>貢寮衛生所澳底醫療救護中心(跨)(汐止國泰醫院)</li>
          </ul>
        </div>
        <div class="tb-item">
          <h3>高雄合作網絡</h3>
          <ul>
            <li>財團法人私立高雄醫學大學附設中和紀念醫院</li>
            <li>高雄榮民總醫院</li>
            <li>三軍總醫院澎湖分院附設民眾診療服務處</li>
            <li>衛生福利部澎湖醫院</li>
            <li>衛生福利部旗山醫院(跨)</li>
            <li>高雄市立旗津醫院(委託財團法人私立高雄醫學大學經營)</li>
            <li>大武鄉衛生所(跨)(高雄醫學大學附設中和紀念醫院)</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="banner-img" ref="myBanner" @click="$router.push('contact')">
      <div class="bn-m-container">
        <img src="DTCwebteam.png" alt="" />
      </div>
      <!-- <img src="main_left.png" /> -->
      <!-- <img src="main_right.png" class="dtc-b-2" /> -->
    </div>
    <section class="dna">
      <img src="home_image/dna.svg" />
      <nav>
        <h5>SERVICE ITEMS</h5>
        <nav class="dna-nav">
          <h6
            @click="clickTab(1)"
            :style="
              tab == 1 ? 'color:#5D5D5D' : 'color:#8B8B8B; font-size:22px;'
            "
          >
            醫療資訊系統解決方案
          </h6>
          <h6
            @click="clickTab(2)"
            :style="
              tab == 2 ? 'color:#5D5D5D' : 'color:#8B8B8B;font-size:22px;'
            "
          >
            資訊設備系統解決方案
          </h6>
        </nav>
        <section class="dna-content" v-if="tab == 1">
          <div style="padding: 40px" class="ask-1">
            <div>HIS-醫院資訊系統</div>
            <div>PACS-影像醫學傳輸系統</div>
            <div>SRRS-手術記錄報告系統</div>
            <div>EMR-電子病歷管理系統</div>
            <div>PES-病理檢驗系統</div>
            <div>LIS-檢驗資訊系統</div>
            <div>CTPS-癌症管理系統</div>
          </div>
          <div style="padding: 40px" class="ask-2">
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
            <main style="opacity: 0">
              <div style="font-size: 20px !importnat">
                專業的團隊與豐富的建置及維護經驗,幫您把關系統每一個環節建置穩定的系統,以下為本公司所提供的系統建置與維護項目：
              </div>
              <div style="font-size: 20px !importnat">
                資訊安全系統建置與維護 數位監控系統建置與維護
                資訊設備軟體硬體採購
              </div>
            </main>
          </div>
          <div></div>
        </section>
        <footer class="dna-nav-footer">
          <nav>
            <div
              :style="tab == 1 ? 'background:#007AD0' : 'background:#D0D0D0'"
              @click="clickTab(1)"
            ></div>
            <div
              :style="tab == 2 ? 'background:#007AD0' : 'background:#D0D0D0'"
              @click="clickTab(2)"
            ></div>
          </nav>
        </footer>
      </nav>
    </section>
    <main class="dtc-clip-path">
      <News></News>
      <About style="margin-top: 5.5rem"></About>
      <Contact style="margin-top: 5.5rem"></Contact>
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
import AOS from "aos";
import "aos/dist/aos.css";

const names = ["醫療資訊系統解決方案", "資訊設備系統解決方案"];
export default {
  data() {
    return {
      names,
      tab: 1,
      normalNavBar: true,
      timer: "",
      imgUrl: {
        url: "./public/2023/",
      },
      moveToDown: true,
      centerNum: 0,
      hospitalNum: 0,
      countTimer1: null,
      countMeter1: 35,
      countTimer2: null,
      countMeter2: 25,
      showMore: false,
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
    openTabOmi() {
      let a = document.createElement("a");
      a.target = "_blank";
      // a.href = "https://995.datacom.com.tw/#/";
      a.href = "javascript:;";
      // a.click();
    },
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
    scrollToContent(toElement, moreHeight = 0) {
      let to = this.$refs[toElement].offsetTop - moreHeight;
      window.scroll({
        top: to,
        left: 0,
        behavior: "smooth",
      });
    },
    speedControl(meter, limit) {
      if (meter <= limit) {
        return limit;
      } else {
        return meter;
      }
    },
    twoDigit(num) {
      if (num >= 10) {
        return num;
      } else {
        return "0" + num;
      }
    },
    countDownFun1() {
      this.countTimer1 = setInterval(() => {
        this.centerNum++;
      }, this.speedControl((this.countMeter1 -= 5), 10));
    },
    countDownFun2() {
      this.countTimer2 = setInterval(() => {
        this.hospitalNum++;
      }, this.speedControl((this.countMeter2 -= 10), 10));
    },
  },
  watch: {
    centerNum() {
      if (this.centerNum === 7) {
        clearInterval(this.countTimer1);
      }
    },
    hospitalNum() {
      if (this.hospitalNum === 42) {
        clearInterval(this.countTimer2);
        setTimeout(() => {
          this.showMore = true;
        }, 450);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.countTimer1);
    clearInterval(this.countTimer2);
  },
  mounted() {
    this.timer = setInterval(
      () => (this.tab == 1 ? (this.tab = 2) : (this.tab = 1)),
      1000 * 9
    );
    AOS.init();
    setTimeout(() => {
      this.countDownFun1();
    }, 3000);
    setTimeout(() => {
      this.countDownFun2();
    }, 3100);
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  position: relative;
  overflow: hidden;

  .bn-m-container {
    display: block;
    > img {
      display: block;
      margin: 0 auto;
    }
  }
}

/*
.banner-img {
  display: grid;
  height: 900px;
  cursor: pointer;
  position: relative;
  gap: 0px;
  transition: all 1s ease-in-out;

  margin: 0 auto;
  width: 100%;
  height: auto;
  text-align: center;

  > img {
    object-fit: cover;
    width: 100vw;
    height: 900px;
    display: block;
    margin: 0 auto;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    display: block;
    z-index: 3px;
    // background: url("/main_right.png") no-repeat top left;
    background-size: cover;
    height: 900px;
    width: 738px;
  }
  
}
*/

.banner-img2 {
  display: grid;
  margin: 0 auto;
  margin-top: 80px;
  width: 100%;
  height: 0;
  // cursor: pointer;
  //padding-bottom: 62.5%;
  //padding-bottom: 56.25%;
  padding-bottom: 56.25%;
  position: relative;
  gap: 0px;
  transition: all 1s ease-in-out;
  overflow: hidden;

  .container-PC {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    margin: auto;
    margin-top: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-origin: border-box;
    background-position: top center;
    background-size: contain;

    h2 {
      position: absolute;
      top: 15.8%;
      left: 11.8%;
      font-size: 2.8vw;
      font-weight: bold;
      color: #8dff43;
      text-shadow: rgba(25, 52, 212, 0.9) 4px 4px 6px;
    }

    p {
      position: absolute;
      font-size: 1.9vw;
      font-weight: bold;
      color: #ffffff;
      text-shadow: rgba(25, 52, 212, 0.9) 3px 3px 9px;

      left: 11.8%;

      > span {
        font-size: 1.2vw;
      }

      &.feature {
        top: 30.8%;
        font-size: 1.5vw;
        letter-spacing: 0.3vw;
      }
      &.notes {
        top: 35.6%;
      }
    }

    .dot {
      position: absolute;
      top: 31.8%;
      left: 9.98%;
      display: block;
      width: 1.2%;
      height: 1.88%;
      background: #ff00c4;
      border-radius: 100%;
      box-shadow: rgba(25, 52, 212, 0.9) 3px 3px 9px;
    }

    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      display: block;

      &.pic-1,
      &.pic-2 {
        margin-top: 12.8%;
        height: auto;
      }

      &.pic-1 {
        margin-right: 26.8%;
        width: 8%;
      }

      &.pic-2 {
        margin-right: 11.8%;
        width: 6.8%;
      }
    }

    .obj {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;

      &.bor {
        margin: auto;
        padding: 2% 3% 20.2% 3%;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        > .line {
          width: 100%;
          height: 100%;
          border: #ffffff 1px solid;
        }
      }

      &.pic-1-box,
      &.pic-2-box {
        margin-top: 17.4%;
        width: 14.8%;
        height: 0;
        padding-bottom: 9.4%;
        background: rgba(25, 52, 212, 0.9);

        .bnBox {
          position: relative;
          display: block;
          width: 100%;
          height: 0;
          padding-bottom: 63.4%;

          h3,
          .countNum {
            margin-bottom: 0;
          }

          h3 {
            text-align: center;
            padding-top: 15%;
            font-size: 1.1vw;
            font-weight: bold;
          }

          .countNum {
            text-align: center;
            font-size: 3.5vw;
            font-weight: bold;
            text-indent: 0.4vw;
            letter-spacing: 0.4vw;
            text-shadow: rgba(25, 52, 212, 0.9) 3px 3px 6px;
          }

          .countUnit {
            position: absolute;
            margin: auto;
            top: auto;
            right: 0;
            bottom: 0;
            left: auto;

            width: 24%;
            font-size: 1.4vw;

            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            align-content: center;
            align-items: center;
          }
        }
      }

      &.pic-1-box {
        margin-right: 23.6%;
      }

      &.pic-2-box {
        margin-right: 7.6%;
      }
    }

    .bn-Btn {
      position: absolute;
      top: 50%;
      left: 11.8%;
      display: block;
      font-size: 1.5vw;
      font-weight: bold;
      width: 10%;
      height: 4.2%;

      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;

      color: #ffffff;
      background: #ff00c4;
      box-shadow: rgba(25, 52, 212, 0.9) 3px 3px 5px;

      border-radius: 2vw;

      cursor: pointer;

      > span {
        display: inline-block;
        margin-left: 5%;
        font-size: 1vw;

        &.lTxt {
          font-size: 1.25vw;
        }
      }

      &:hover {
        text-decoration: none;
      }
    }

    .bn-Arrow {
      position: absolute;
      top: 66.6%;
      left: 0;
      right: 0;

      margin: auto;
      width: 1.8%;
      height: 0;
      padding-bottom: 3.6%;

      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;

      cursor: pointer;

      > img {
        display: block;
        margin: 0 auto;
        width: 100%;
        height: auto;
      }
    }

    .bn-Btn,
    .bn-Arrow {
      display: none;
      &.Visible {
        display: flex;
      }
    }

    /*img {
      object-fit: cover;
      width: 100vw;
      height: 900px;
      display: block;
    }*/
  }

  /*&::after {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    display: block;
    z-index: 3px;
    // background: url("/main_right.png") no-repeat top left;
    background-size: cover;
    height: 900px;
    width: 738px;
  }*/
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

.my-clients {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  margin: 0 auto;
  padding: 0 0 120px 0;

  width: 100%;
  max-width: 1400px;

  > h2 {
    color: #000000;
    font-size: 2rem;
    font-weight: bold;

    display: block;
    margin: 25px auto 50px auto;
    padding: 10px;
    width: 100%;
    text-align: left;

    border-left: #4e5ac3 5px solid;

    max-width: 1024px;
  }

  > ul,
  > ul li {
    list-style: none;
  }

  > ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: center;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 50px;

    max-width: 1024px;
  }

  > ul li {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;

    padding: 0 10px 10px 0;

    width: 25%;
    height: 150px;

    img {
      display: block;
      margin: 0 auto;
      margin-left: 0;
      width: auto;
      height: auto;
      max-width: 90%;
      max-height: 80px;
    }
  }

  .text-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: stretch;
    gap: 1rem;
    width: 100%;

    max-width: 1400px;

    .tb-item {
      flex: 0 1 auto;

      min-width: 300px;

      margin-bottom: 50px;
      border: #2d50fe 1px solid;
      color: #000000;
      box-shadow: #999999 1px 1px 9px;

      h3 {
        width: 100%;
        margin-bottom: 0;
        padding: 0 8px;
        text-align: center;

        color: #ffffff;
        background: #2d50fe;

        font-size: 20px;
        font-weight: bold;
        line-height: 40px;
      }

      > ul,
      > ul li {
        display: block;
        list-style: none;
        font-size: 14px;
      }

      > ul {
        margin-bottom: 0;
        padding: 12px;
      }

      > ul li {
        display: block;
        margin-bottom: 5px;
      }
    }

    .tb-break {
      flex-basis: 100%;
      width: 0px;
      height: 0px;
      overflow: hidden;
    }
  }
}

.pulsate-fwd {
  -webkit-animation: pulsate-fwd 0.5s ease-in-out infinite both;
  animation: pulsate-fwd 0.5s ease-in-out infinite both;
}

.pulsate-fwd-slow {
  -webkit-animation: pulsate-fwd 1s ease-in-out infinite both;
  animation: pulsate-fwd 1s ease-in-out infinite both;
}

@-webkit-keyframes pulsate-fwd {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes pulsate-fwd {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.tracking-in-expand {
  -webkit-animation: tracking-in-expand 0.7s 2.5s
    cubic-bezier(0.215, 0.61, 0.355, 1) both;
  animation: tracking-in-expand 0.7s 2.5s cubic-bezier(0.215, 0.61, 0.355, 1)
    both;
}

@-webkit-keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
