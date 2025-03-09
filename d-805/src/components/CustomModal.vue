<template>
  <b-modal
    ref="cusModal"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
    :title="title"
    :size="size"
    @shown="init"
  >
    <section>
      <slot />
    </section>
    <template v-slot:modal-footer>
      <slot name="cus-footer" />
    </template>
  </b-modal>
</template>

<script>
// import Swal from "sweetalert2";

export default {
  data() {
    return {
      variants: ["warning", "dark", "success", "warning", "danger", "info", "light", "dark"],
      headerBgVariant: "dark",
      headerTextVariant: "light",
      bodyBgVariant: "light",
      bodyTextVariant: "dark",
      footerBgVariant: "warning",
      footerTextVariant: "dark",
      isMounted: false
    };
  },
  mounted() {
    this.isMounted = true;
  },
  props: {
    title: {
      type: String
    },
    size: {
      type: String,
      default: "xl"
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      // alert("INIT");
    }
  },
  computed: {
    showState() {
      return this.isMounted ? this.$refs["cusModal"].isShow : false;
    }
  },
  watch: {
    show(value) {
      if (value && this.$refs["cusModal"]) {
        this.$refs["cusModal"].show();
      } else if (!value && this.$refs["cusModal"]) {
        this.$refs["cusModal"].hide();
      }
    }
  }
};
</script>
<style>
.dtc-form .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>
<style lang="scss" scoped>
.dtc-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  color: white;
  .input-group-prepend .input-group-text {
    width: 120px;
  }
}
footer {
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  grid-gap: 1rem;
}
</style>
