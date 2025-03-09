<template>
  <nav>
    <div></div>
    <img
      src="home_image/dtc.logo.svg"
      width="290"
      height="54"
      style="cursor: pointer"
      @click="$router.push('home')"
    />
    <div></div>
    <div
      class="position-fixed scroll-button"
      :class="scrollYIsZero ? 'btn-fade-out' : 'btn-fade-show'"
      @click.stop="scrollToTop"
      title="回頂端"
      variant="primary"
      pill
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24.00 24.00"
        fill="none"
        transform="matrix(1, 0, 0, 1, 0, 0)"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#38b8fc"
          stroke-width="0.336"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            d="M19.9201 15.0501L13.4001 8.53014C12.6301 7.76014 11.3701 7.76014 10.6001 8.53014L4.08008 15.0501"
            stroke="#38b8fc"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </div>
    <main v-for="(item, i) in names" :key="i" @click="$router.push(links[i])">
      {{ item }}
    </main>
  </nav>
</template>

<script>
const names = [
  "首頁",
  "關於合華",
  "焦點訊息",
  "產品介紹",
  "成功案例",
  "聯絡我們",
];
const links = ["home", "about", "news", "product", "success", "contact"];
export default {
  data() {
    return {
      names,
      links,
      scrollYIsZero: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    handleScroll() {
      if (window.scrollY < 10) {
        this.scrollYIsZero = true;
      } else {
        this.scrollYIsZero = false;
      }
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.handleScroll();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
nav {
  height: 80px;
  z-index: 9999;
  width: 100vw;
  display: grid;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  color: black;
  font-size: 18px;
  grid-template-columns: minmax(12px, 1fr) 260px 120px repeat(8, max-content) 1fr;
  place-items: center;
  box-shadow: 0px 3px 6px #00000029;
  > main {
    cursor: pointer;
    padding: 0 1rem;
    position: relative;
    font-weight: bold;

    &:last-child {
      &::after {
        opacity: 0;
      }
    }

    &::after {
      position: absolute;
      content: "";
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background: #333333;
      width: 1px;
      height: 16px;
    }
  }
}

.scroll-button {
  right: 20px;
  bottom: 30px;
  background-color: #ffffff;
  border: #ededed 1px solid;
  border-radius: 100px;
  z-index: 1;

  width: 40px;
  height: 40px;

  color: #38b8fc;

  font-weight: bold;
  box-shadow: #666666 1px 1px 5px 1px;

  cursor: pointer;

  > svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}

.btn-fade-out {
  opacity: 0;
}
.btn-fade-show {
  transition: all 0.4s ease-in-out;
  opacity: 1;
}
</style>
