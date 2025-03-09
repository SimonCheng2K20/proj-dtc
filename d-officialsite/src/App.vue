<template>
  <div
    id="app"
    :style="
      showPrivacy || showTerm
        ? 'overflow:hidden !important; max-height: 100vh;'
        : ''
    "
  >
    <mobile-header v-if="isMobile" />
    <router-view />
    <footer v-show="!showPrivacy && !showTerm">
      <main>
        <h5 style="transform:translate(-15px,8px) !important;">DATACOM TECH</h5>
        <nav>
          <h6 @click="showPrivacy = true" style="transform:translateX(15px)">
            隱私權政策
          </h6>
          <div style="transform:translateX(15px)"></div>
          <h6 @click="showTerm = true" style="transform:translateX(-15px)">
            使用者條款
          </h6>
        </nav>
        <div
          style="color:white;transform:translate(20px, -7px);font-size:12px;"
        >
          Copyright©{{ new Date().getFullYear() }} DATACOM. All rights reserved.
        </div>
      </main>
    </footer>
    <aside
      v-if="showPrivacy"
      class="my-term"
      :class="{ 'mobile-mode': isMobile }"
    >
      <privacyAndTerms mode="privacy" v-if="isMobile" />

      <div v-else @click="showPrivacy = false">
        <span class="my-close"><i class="fas fa-times-circle"></i></span>
        <img src="privacy.png" />
      </div>
    </aside>
    <aside v-if="showTerm" class="my-term" :class="{ 'mobile-mode': isMobile }">
      <privacyAndTerms mode="terms" v-if="isMobile" />
      <div v-else @click="showTerm = false">
        <span class="my-close"><i class="fas fa-times-circle"></i></span>
        <img src="term.png" />
      </div>
    </aside>

    <div
      v-if="showTerm || showPrivacy"
      class="position-fixed close-button shadow p-1"
      @click.stop="showPrivacy = showTerm = false"
    >
      <i class="fas fa-times-circle" />
    </div>
  </div>
</template>

<script>
import DtcXlNavBar from "@/components/DtcXlNavBar.vue";
import privacyAndTerms from "@/components/privacyAndTerms.vue";
import { mapMutations, mapState } from "vuex";
import mobileHeader from "@/components/MobileHeader.vue";
export default {
  name: "Home",
  components: {
    DtcXlNavBar,
    mobileHeader,
    privacyAndTerms,
  },
  data() {
    return {
      showPrivacy: false,
      showTerm: false,
    };
  },
  computed: {
    ...mapState(["isMobile"]),
  },
  mounted() {
    this.detectDevice();
    window.addEventListener("resize", this.detectDevice);
  },
  methods: {
    ...mapMutations(["m_setIsMobile"]),
    detectDevice() {
      const userAgentIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const screenIsMobile = document.documentElement.clientWidth < 768;
      this.m_setIsMobile(userAgentIsMobile || screenIsMobile);
      setTimeout(() => {
        if (!this.$route.name.includes("Mobile") && this.isMobile)
          this.$router.replace({ name: this.$route.name + "Mobile" });
        else if (this.$route.name.includes("Mobile") && !this.isMobile)
          this.$router.replace({
            name: this.$route.name.replace("Mobile", ""),
          });
      }, 100);
    },
  },
  watch: {
    $route(to, from) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  outline: none !important;
  box-sizing: border-box;
  font-family: "Microsoft JhengHei", Helvetica, Arial, sans-serif !important;
}
#app {
  font-family: "Microsoft JhengHei", Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  overflow-x: hidden;
  > * {
    overflow-y: hidden !important;
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
      grid-template-columns: max-content 1px max-content;
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
    margin-left: 2rem;
  }
}
.my-term {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(#fff, 0.8);
  z-index: 999999;
  > div {
    z-index: 9999999;
    background: rgba(#fff, 0.7);
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    position: relative;
    overflow-y: auto;
    img {
      display: block;
    }
    .my-close {
      cursor: pointer;
      position: sticky;
      top: 1rem;
      transform: translateX(500px);
      color: black;
      font-size: 24px;
    }
  }
  &.mobile-mode {
    > div {
      display: block;
    }
  }
}

.sub-title {
  color: #3d63cb;
  font-weight: bold;
}

.google-map {
  height: 40vh;
  min-height: 400px;
}

.close-button {
  right: 15px;
  bottom: 15px;
  font-size: 1.5rem;
  line-height: 1;
  background-color: #961b05;
  border-radius: 100px;
  z-index: 1000000;
}
</style>
