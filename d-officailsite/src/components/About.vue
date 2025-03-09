<template>
  <section class="about-us">
    <div class="about-container">
      <main>
        <img
          src="index_about_new.png"
          style="transform: translateX(-30px); !importnat;cursor:pointer"
          @click="$router.push('about')"
        />
      </main>
      <nav>
        <p>專 利 技 術</p>
        <img src="home_image/copyright_img.png" class="dtc-imgs" />
        <main class="nav-main">
          <img src="one_hover.png" />
        </main>
      </nav>
      <nav>
        <p>國 際 證 照 及 品 質</p>
        <img src="home_image/quality_img.png" class="dtc-imgs" />
        <main class="nav-main">
          <img src="two_hover.png" />
        </main>
      </nav>

      <nav>
        <p>獲 獎 紀 錄</p>
        <img src="home_image/prize_img.png" class="dtc-imgs" />
        <main class="nav-main">
          <img src="three_hover.png" />
        </main>
      </nav>
    </div>
  </section>
</template>

<script>
const names = ["首頁", "關於合華", "焦點訊息", "產品介紹", "成功案例", "報修系統", "人力招募", "聯絡我們"];
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
.about-us {
  padding-top: 30px;
  width: 100vw;
  display: grid;
  place-items: center;
  color: black;
  padding-bottom: 120px;
}

h5 {
  font-size: 40px;
  color: #3d63cb;
  font-weight: bolid;
  position: relative;
  &::after {
    position: absolute;
    content: "";
    display: block;
    width: 4px;
    background: #3d63cb;
    height: 80px;
    top: 6px;
    left: -15px;
  }
}
h6 {
  color: black;
  font-size: 24px;
  display: block;
  margin-bottom: 20px;
}
.about-container {
  display: grid;
  grid-template-columns: 289px repeat(3, 300px);
  grid-template-rows: 450px;
  gap: 10px;
  > main:first-child {
    p {
      margin: 0;
      margin-bottom: 10px;
    }
  }
  > nav {
    position: relative;
    .dtc-imgs {
      width: 300px;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
    p {
      position: absolute;
      top: 8px;
      left: 4px;
      writing-mode: vertical-lr;
      color: white;
      font-size: 24px;
    }
  }
}
.more-about {
  width: 120px;
  height: 40px;
  border: 1px solid #007dd5;
  border-radius: 28px;
  color: #007dd5;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  //transform: translateX(60px);
  cursor: pointer;
}

.nav-main {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0%;
  width: 100%;
  height: 100%;
  z-index: 88;
  transition: all 0.8s ease-in-out;
  clip-path: inset(100% 0 0 0);
}

nav:hover {
  .nav-main {
    transition: all 0.8s ease-in-out;
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}
</style>
