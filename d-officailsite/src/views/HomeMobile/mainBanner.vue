<template>
  <main>
    <div class="home-banner2">
      <b-img src="2023/dtc_mobile_background.png" />
      <div
        class="container-Mobile"
        data-aos="zoom-in-up"
        data-aos-delay="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <div class="obj bor">
          <div class="line"></div>
        </div>
        <div
          class="countArea One"
          data-aos="fade-right"
          data-aos-delay="2000"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div class="obj pic-1-box">
            <div class="bnBox">
              <h3>目前使用的醫學中心</h3>
              <!-- <div class="countNum">07</div> -->
              <div class="countNum">{{ twoDigit(centerNum) }}</div>
              <div class="countUnit">家</div>
            </div>
          </div>
          <img class="pic-1" src="2023/co-center.svg" alt="" />
        </div>
        <div
          class="countArea Two"
          data-aos="fade-left"
          data-aos-delay="2000"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div class="obj pic-2-box">
            <div class="bnBox">
              <h3>合作醫院</h3>
              <!-- <div class="countNum">42</div> -->
              <div class="countNum">{{ twoDigit(hospitalNum) }}</div>
              <p class="countUnit">家</p>
            </div>
          </div>
          <img class="pic-2" src="2023/co-hospitals.svg" alt="" />
        </div>
        <h2
          data-aos="fade-down"
          data-aos-delay="1000"
          data-aos-duration="300"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <span>Remote Consultation System</span>
          <br />
          遠距醫療會診平臺
        </h2>
        <p
          class="feature"
          data-aos="fade-up"
          data-aos-delay="1500"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          系統特色
        </p>
        <div
          class="dot"
          data-aos="fade-up"
          data-aos-delay="1500"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        ></div>
        <p
          class="notes"
          data-aos="fade-up"
          data-aos-delay="1500"
          data-aos-duration="500"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          不用額外增加硬體設備<br />
          <span>(</span> 手機、平版、行動裝置皆可 <span>)</span>
          <br />
          操作使用簡單方便 <span>(</span> Plug <span>&amp;</span> Play
          <span>)</span>
        </p>
        <a
          class="bn-Btn pulsate-fwd"
          :class="{'Visible': showMore}"
          href="javascript:;"
          @click="scrollToContent('myClients', 40)"
        >
          <span class="lTxt">暸解更多</span><span>➨</span>
        </a>
      </div>
      <!-- <b-img src="omicrommobile1.png" /> -->
    </div>
    <!-- <div class="home-banner3">
      <b-img src="omicrommobile2.png" @click="openTabOmi" />
    </div> -->
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
    <div class="position-relative">
      <b-img src="homeMobile_image/main_left.jpg" class="home-banner" />
      <div
        class="position-absolute d-flex align-items-center justify-content-end"
        style="left: 0; right: 0; bottom: 0; top: 0"
      >
        <div class="mr-5">
          <div class="px-4 py-2 home-slogan">
            <h3>DATACOME <br />TECHNOLOGY CORP.</h3>
            <h4>
              <div>讓合華科技團隊</div>
              <div>為您打造專業醫療等級的院所</div>
              <div>提供給您最專業、</div>
              <div>完整的系統解決方案。</div>
            </h4>
          </div>
          <b-button
            size="sm"
            variant="light"
            class="shadow mx-auto d-table immediate mt-2"
            @click.stop="$router.push({ name: 'contactMobile' })"
            >立即洽詢</b-button
          >
          <b-icon icon="chevron-double-down" class="mx-auto d-table mt-1" />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import AOS from "aos";
import "aos/dist/aos.css";

export default {
  data() {
    return {
      centerNum: 0,
      hospitalNum: 0,
      countTimer1: null,
      countMeter1: 35,
      countTimer2: null,
      countMeter2: 25,
      showMore: false,
    };
  },
  methods: {
    openTabOmi() {
      let a = document.createElement("a");
      // a.href = "https://995.datacom.com.tw/#/";
      a.href = "javascript:;";
      // a.click();
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
        setTimeout(()=>{
          this.showMore = true
        }, 300);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.countTimer1);
    clearInterval(this.countTimer2);
  },
  mounted() {
    AOS.init();
    setTimeout(() => {
      this.countDownFun1();
    }, 2800);
    setTimeout(() => {
      this.countDownFun2();
    }, 3000);
  },
};
</script>
<style lang="scss">
.home-banner {
  width: 100vw;
}
.home-banner2 {
  position: relative;
  width: 100%;

  // use img set banner div width & height
  > img {
    display: block;
    width: 100%;
  }

  .container-Mobile {
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

    h2 {
      position: absolute;
      top: 8.8%;
      left: 9%;
      font-size: 5.8vw;
      font-weight: bold;
      color: #8dff43;
      text-shadow: rgba(25, 52, 212, 0.9) 4px 4px 6px;
    }

    p {
      position: absolute;
      width: 80%;

      font-size: 5vw;
      font-weight: bold;
      color: #ffffff;
      text-shadow: rgba(25, 52, 212, 0.9) 3px 3px 9px;
      left: 12.8%;

      > span {
        font-size: 3vw;
      }

      &.feature {
        top: 21%;
        font-size: 4vw;
        letter-spacing: 0.3vw;
      }

      &.notes {
        top: 27.2%;
      }
    }

    .dot {
      position: absolute;
      top: 22.2%;
      left: 8.5%;
      display: block;
      width: 3%;
      height: 2%;
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
        margin-top: 73.5%;
        height: auto;
        width: 18%;
      }

      &.pic-1 {
        margin-left: 20%;
      }

      &.pic-2 {
        width: 16%;
        margin-left: 62%;
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
        padding: 4.5% 4.5% 28.5% 4.5%;
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
        margin-top: 85%;
        width: 36%;
        height: 0;
        padding-bottom: 27%;
        background: rgba(25, 52, 212, 0.9);

        .bnBox {
          position: relative;
          display: block;
          width: 100%;
          height: 0;
          padding-bottom: 70%;

          h3,
          .countNum {
            margin-bottom: 0;
          }

          h3 {
            text-align: center;
            padding-top: 15%;
            font-size: 3.5vw;
            font-weight: bold;
          }

          .countNum {
            text-align: center;
            font-size: 10vw;
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
            font-size: 4vw;

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
        margin-left: 12%;
      }

      &.pic-2-box {
        margin-left: 52%;
      }
    }

    .bn-Btn {
      position: absolute;
      bottom: 9.6%;
      left: 8.8%;
      display: block;
      font-size: 3vw;
      font-weight: bold;
      width: 28%;
      height: 5%;

      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;

      color: #ffffff;
      background: #ff00c4;
      box-shadow: rgba(25, 52, 212, 0.9) 3px 3px 5px;

      border-radius: 5vw;

      cursor: pointer;

      > span {
        display: inline-block;
        margin-left: 4%;
        font-size: 3vw;

        &.lTxt {
          font-size: 4vw;
        }
      }

      &:hover {
        text-decoration: none;
      }
    }

    .bn-Arrow {
      position: absolute;
      bottom: 23.6%;
      left: 0;
      right: 0;

      margin: auto;
      width: 5%;
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
    .bn-Arrow{
      display: none;
      &.Visible{
        display: flex;
      }
    }

  }
}
.home-banner3 {
  width: 90vw;
  margin: 0 auto;
  img {
    width: 100%;
  }
}
.home-slogan {
  background-color: rgba(5, 0, 70, 0.35);
  h3 {
    font-size: 0.9rem;
    font-weight: bold;
    border-bottom: 2px solid rgba(22, 0, 102, 0.85);
    padding-top: 0;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  h4 {
    font-size: 0.7rem;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }
}
.immediate {
  font-size: 0.7rem;
  font-weight: bold;
  color: rgba(22, 0, 102, 0.85);
}
.my-clients {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  margin: 0 auto;
  padding: 30px 20px 60px 20px;

  width: 100%;

  > h2 {
    color: #000000;
    font-size: 24px;
    font-weight: bold;

    display: block;
    margin: 15px auto;
    padding: 10px 10px 10px 20px;
    width: 100%;
    text-align: left;

    border-left: #4e5ac3 5px solid;
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
  }

  > ul li {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;

    padding: 0 10px 10px 0;

    width: 50%;
    height: 120px;

    img {
      display: block;
      margin: 0 auto;
      margin-left: 0;
      width: auto;
      height: auto;
      max-width: 95%;
      max-height: 60px;
    }
  }

  .text-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: stretch;
    width: 100%;

    max-width: 1400px;

    .tb-item {
      flex: 1 1 100%;

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
        font-size: 15px;
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
  -webkit-animation: pulsate-fwd 0.7s ease-in-out infinite both;
  animation: pulsate-fwd 0.7s ease-in-out infinite both;
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
</style>
