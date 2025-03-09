<template>
  <section class="contact-us">
    <main>
      <div class="left">
        <img src="information_text.png" />
      </div>
      <div class="right">
        <!-- <img src="home_image/dtcMap.png" width="540" height="370" /> -->
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14463.332737550358!2d121.4843488!3d25.0057837!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf6166455d2a4b05d!2z5ZCI6I-v56eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1597717084437!5m2!1szh-TW!2stw"
          width="540"
          height="370"
          frameborder="0"
          style="border: 0;"
          allowfullscreen
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </div>
    </main>
  </section>
</template>

<script>
const names = [
  "首頁",
  "關於合華",
  "焦點訊息",
  "產品介紹",
  "成功案例",
  "報修系統",
  "人力招募",
  "聯絡我們",
];
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
  //clip-path: polygon(0 0, 100% 18%, 100% 100%, 0 100%);
  width: 100vw;
  display: grid;
  height: 586px;
  place-items: center;
  color: white;
  background: url("/information_bg.png") no-repeat center center;
  background-size: cover;

  color: white;
}
main {
  display: grid;
  grid-template-columns: 317px 540px;
  gap: 6rem;
  //margin-top: -100px;
}
.left {
  display: flex;
  flex-direction: column;
  transform: translateY(-46px);
}

.right {
  cursor: pointer;
  transform: translateY(-25px);
}
</style>
