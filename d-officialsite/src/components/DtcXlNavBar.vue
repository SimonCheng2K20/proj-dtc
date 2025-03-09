<template>
  <nav>
    <div></div>
    <img src="home_image/logo_white.svg" width="290" height="54" />
    <div></div>
    <main v-for="(item, i) in names" :key="i" @click="$router.push(links[i])">{{ item }}</main>
  </nav>
</template>

<script>
const names = ["首頁", "關於合華", "焦點訊息", "產品介紹", "成功案例", "聯絡我們"];
const links = ["home", "about", "news", "product", "success",  "contact"];
export default {
  data() {
    return {
      names,
      links
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
nav {
  height: 80px;
  z-index: 3;
  width: 100vw;
  display: grid;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(#000, 0.2);
  color: white;
  font-size: 18px;
  grid-template-columns: minmax(12px, 1fr) 260px 120px repeat(8, max-content) 1fr;
  place-items: center;
  > main {
    cursor: pointer;
    padding: 0 1rem;
    position: relative;
    font-weight: normal;
    &::after {
      position: absolute;
      content: "";
      right: 0;
      top: 3px;
      background: white;
      width: 2px;
      height: 20px;
    }
  }
  > main:last-child {
    &::after {
      opacity: 0;
    }
  }
}
</style>
