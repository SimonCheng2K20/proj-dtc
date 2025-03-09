<template>
    <section class="dna">
      <img src="home_image/dna.svg" />
        <h5>SERVICE ITEMS</h5>
        <nav class="dna-nav">
          <h6 @click="tab = 1" :style="tab == 1 ? 'color:#5D5D5D' : 'color:#8B8B8B;'">醫療資訊系統解決方案</h6>
          <h6 @click="tab = 2" :style="tab == 2 ? 'color:#5D5D5D' : 'color:#8B8B8B;'">資訊設備系統解決方案</h6>
        </nav>
        <section class="dna-content" v-if="tab == 1">
          <div>
            <p>HIS-醫院資訊系統</p>
            <p>PACS-影像醫學傳輸系統</p>
            <p>SRRS-手術記錄報告系統</p>
            <p>EMR-電子病歷管理系統</p>
            <p>PES-病理檢驗系統</p>
            <p>LIS-檢驗資訊系統</p>
            <p>CTPS-癌症管理系統</p>
          </div>
          <div>
            <p>HAS-醫院評鑑系統</p>
            <p>POC-床邊照護系統</p>
            <p>MRIS-病歷掃描倉儲系統</p>
            <p>ADS-血液淨化管理系統</p>
            <p>IHE-區域醫療平台</p>
            <p>PHR-基層醫療管理</p>
            <p>RIS-放射資訊系統</p>
          </div>
          <div></div>
        </section>

        <section class="dna-content dna-tab2" v-if="tab == 2">
          <div>
            <main>
              <p>專業的團隊與豐富的建置及維護經驗,幫您把關系統每一個環節建置穩定的系統,以下為本公司所提供的系統建置與維護項目：</p>
              <p>資訊安全系統建置與維護 數位監控系統建置與維護 資訊設備軟體硬體採購</p>
            </main>
          </div>
          <div></div>
        </section>
        <footer class="dna-nav-footer">
          <nav>
            <div :style="tab == 1 ? 'background:#007AD0':'background:#D0D0D0'" @click="tab = 1"></div>
            <div :style="tab == 2 ? 'background:#007AD0':'background:#D0D0D0'" @click="tab = 2"></div>
          </nav>
        </footer>
      </main>
    </section>
</template>

<script>
const names = ['首頁', '關於合華', '焦點訊息', '產品介紹', '成功案例', '報修系統', '人力招募', '聯絡我們'];
export default {
	data() {
		return {
			names,
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contact-us {
  width: 100vw;
  display: grid;
  height: 735px;
  place-items: center;
  color: white;
  background: url("/home_image/contact_img.png") no-repeat center center;
  background-size: cover;

  color: white;
}
main {
  display: grid;
  grid-template-columns: 317px 540px;
  gap: 6rem;
  margin-top: 50px;
}
.left {
  display: flex;
  flex-direction: column;
  h5 {
    font-size: 40px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      background: white;
      top: 9px;
      height: 75px;
      width: 4px;
      left: -14px;
    }
  }
  h6 {
    font-size: 30px;
    transform: translateY(-10px);
    margin-bottom: 1.5rem;
  }
  > div {
    margin-bottom: 34px;
    span {
      position: relative;
      display: inline-block;
      margin-left: 8px;
      transform: translateY(-10px);
      font-size: 18px;
      &::after {
        position: absolute;
        content: attr(data-msg);
        top: 90%;
        left: 0;
        color: #dedede;
        width: 280px;
      }
    }
  }
}

.right {
  opacity: 0.8;
  cursor: pointer;
}
</style>
