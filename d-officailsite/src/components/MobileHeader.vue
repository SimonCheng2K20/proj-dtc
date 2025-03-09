<template>
  <div class="mobile-header" :style="`padding-top: ${headerHeight}px`">
    <div
      id="mainHeader"
      class="d-flex justify-content-between align-items-center py-1 px-2 position-fixed w-100 border-bottom"
    >
      <div
        class="drawer d-flex flex-column justify-content-between ml-1"
        @click.stop="drawerEvent"
      >
        <template v-if="!showDrawer"> <span /><span /><span /> </template>
      </div>
      <b-img
        @click.stop="$router.push({ name: 'HomeMobile' })"
        src="home_image/dtc.logo.svg"
        class="logo"
      />
      <div />
    </div>

    <transition name="fade">
      <aside
        class="position-fixed drawer-menu"
        :style="`top: ${headerHeight}px`"
        v-if="showDrawer"
      >
        <b-icon
          icon="x"
          font-scale="2"
          class="cross position-absolute"
          @click.stop="drawerEvent"
        />
        <div
          v-for="{ label, name } in drawMenu"
          :key="name"
          v-text="label"
          class="mb-2"
          @click.stop="navigateTo(name)"
        />
      </aside>
    </transition>

    <div
      class="position-fixed scroll-button"
      :class="scrollYIsZero ? 'btn-fade-out' : 'btn-fade-show'"
      @click.stop="scrollToTop"
      variant="primary"
      pill
    >
      <!-- <b-img src="homeMobile_image/arrowDown2.svg" /> -->
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
  </div>
</template>

<script>
import { BIcon, BIconArrowUp, BIconArrowDown } from "bootstrap-vue";
export default {
  data() {
    return {
      showDrawer: false,
      drawMenu: [
        { label: "首頁", name: "HomeMobile" },
        { label: "關於合華", name: "AboutMobile" },
        { label: "焦點訊息", name: "newsMobile" },
        { label: "產品介紹", name: "ProductMobile" },
        { label: "成功案例", name: "successMobile" },
        { label: "聯絡我們", name: "contactMobile" },
      ],
      headerHeight: 48,
      scrollYIsZero: false,
    };
  },

  components: {
    BIcon,
    BIconArrowUp,
    BIconArrowDown,
  },
  methods: {
    drawerEvent() {
      this.showDrawer = !this.showDrawer;
    },
    navigateTo(name) {
      this.$router.push({ name });
      this.drawerEvent();
    },
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
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.mobile-header {
  font-family: "Microsoft Jhenghei";
  .cross {
    right: 10px;
    top: 10px;
  }
  .logo {
    width: 210px;
  }
  .drawer {
    width: 24px;
    height: 21px;
    span {
      width: 100%;
      display: block;
      height: 3px;
      background-color: #000;
      border-radius: 5px;
    }
  }
  .drawer-menu {
    z-index: 200;
    height: calc(100vh - 36px);
    width: 67vw;
    background-color: rgba(255, 255, 255, 0.86);
    left: 0;
    color: #333;
    padding: 50px 45px 0;
    font-weight: bold;
    font-size: 1.2rem;
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

  > svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}

#mainHeader {
  left: 0;
  top: 0;
  z-index: 201;
  background-color: rgba(255, 255, 255, 0.95);
}

.btn-fade-out {
  opacity: 0;
}
.btn-fade-show {
  transition: all 0.4s ease-in-out;
  opacity: 1;
}
</style>
