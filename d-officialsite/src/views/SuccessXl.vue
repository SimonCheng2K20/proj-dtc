<template>
  <section class="about-us">
    <DtcXlNavWhiteBar></DtcXlNavWhiteBar>
    <div class="banner">
      <img src="case_title.png" width="140" />
    </div>
    <img src="case_content1.png" class="dtc-body" v-if="currentPage == 1" />
    <img src="case_content2.png" class="dtc-body" v-show="currentPage == 2" v-if="isVisible" />

    <div class="pages-dtc mt-4 mb-4">
      <b-pagination-nav
        v-b-visible.once="visibleHandler"
        :link-gen="linkGen"
        use-router
        v-model="currentPage"
        :number-of-pages="2"
        prev-text="上一頁"
        next-text="下一頁"
      ></b-pagination-nav>
    </div>
  </section>
</template>

<script>
import DtcXlNavWhiteBar from "@/components/DtcXlNavWhiteBar.vue";

export default {
  data() {
    return {
      currentPage:1,
      isVisible:false,
    };
  },
  components: {
    DtcXlNavWhiteBar,
  },
  methods:{
    visibleHandler(isVisible){
      this.isVisible = isVisible;
    },
    linkGen(){
      return "success";
    }
  },
  watch:{
    currentPage(){
     window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.about-us {
  width: 100vw;
  color: black;
  display: flex;
  flex-direction: column;
}
.dtc-body {
  display: block;
  width: 1200px;
  margin: 4rem auto;
}
.banner {
  width: 100vw;
  height: 380px;
  background: url("/client_banner.jpg") no-repeat center center;
  background-size: cover;
  display: grid;
  place-items: center;
  > img {
    transform: translateY(40px);
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
.pages-dtc {
  display: grid;
  min-width: 1200px;
  place-items: center;
  > div {
    transform: translateX(200px);
  }
}
</style>
