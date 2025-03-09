<template>
  <div class="main-print">
    <div
      ref="printArea"
      class="printArea bg-white"
      :class="spareStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$root.$el.classList.add("noPrint");
    document.body.appendChild(this.$refs.printArea);
    if (this.handleTextarea) {
      Array.from(this.$refs.printArea.getElementsByTagName("textarea")).forEach(area => {
        area.removeAttribute("rows");
        area.removeAttribute("cols");
        area.classList.add("w-100");
        area.classList.add("cus-textarea");
      });
    }

    window.print();
    this.$root.$el.classList.remove("noPrint");
    this.$emit("afterPrintEvent"); // 列印完成的事件
  },
  beforeDestroy () {
    document.body.removeChild(this.$refs.printArea);
  },
  props: {
    spareStyle: {
      type: String,
      default: ""
    },
    handleTextarea: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
  }
  .noBreak {
    break-inside: avoid;
  }
  .noPrint,
  .b-toaster {
    display: none;
    margin-bottom: 100vh;
  }
  .modal,
  .modal-backdrop {
    display: none !important;
  }
}
</style>
