<template>
  <div
    class="context-menu"
    v-show="show"
    :style="style"
    @mousedown.stop
    @contextmenu.prevent
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: "context-menu",
  props: {
    offset: {
      type: Object,
      default: function() {
        return {
          left: 0,
          top: 0
        };
      }
    },
    show: Boolean
  },
  data() {
    return {
      scrollHgt: 0
    }
  },
  computed: {
    style() {
      return {
        left: `${this.offset.left}px`,
        top: `${this.offset.top}px`
      };
    }
  },
  watch: {
    show(show) {
      if (show) {
        this.$nextTick(this.setPosition);
      }
    }
  },
  beforeDestroy() {
    let popperElm = this.$el;
    if (popperElm && popperElm.parentNode === document.body) {
      document.body.removeChild(popperElm);
    }
    document.removeEventListener("mousedown", this.clickDocumentHandler);
    window.removeEventListener("resize", this.resizeScrollHgt);
  },
  mounted() {
    document.body.appendChild(this.$el);
    document.addEventListener("mousedown", this.clickDocumentHandler);
    // window.addEventListener("resize", this.resizeScrollHgt);
    window.addEventListener('resize', this.resizeScrollHgt);

    this.resizeScrollHgt();
  },
  methods: {
    resizeScrollHgt() {
      this.clickDocumentHandler();
      this.scrollHgt = document.body.scrollHeight - 200;
    },
    clickDocumentHandler() {
      if (this.show) {
        this.$emit("update:show", false);
      }
    },
    setPosition() {
      let docHeight = document.documentElement.clientHeight;
      let docWidth = document.documentElement.clientWidth;
      let menuHeight = this.$el.getBoundingClientRect().height;
      let menuWidth = this.$el.getBoundingClientRect().width;
      // 增加點選處與選單間間隔，較為美觀
      const gap = 20;
      let topover =
        this.offset.top + menuHeight + gap >= docHeight
          ? menuHeight + gap
          : -gap;
      let leftover =
        this.offset.left + menuWidth + gap >= docWidth ? menuWidth + gap : -gap;
      // this.style = {
      //   left: `${this.offset.left - leftover}px`,
      //   top: `${this.offset.top - topover}px`
      // };
      this.offset.left -= leftover;
      this.offset.top -= topover;

      // console.log(this.scrollHgt, this.offset.top ,menuHeight);
      // if(this.scrollHgt < this.offset.top + menuHeight) {
        
      //   this.$nextTick(()=>{
      //     this.offset.top = this.scrollHgt;
      //   });
      // }

      // console.log({offset: this.offset});
      // console.log({docHeight, docWidth, menuHeight, menuWidth});
    }
  }
};
</script>
<style lang="scss" scoped>
.context-menu {
  z-index: 1000;
  display: block;
  position: absolute;
  background-color: #fff;
}
</style>
