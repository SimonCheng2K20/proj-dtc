<template>
  <div
    class="history-modal position-fixed"
    :class="{ shadown: shadow }"
    :style="`--positionTop: ${positionTop}`"
  >
    <transition
      name="raise"
      v-on:after-leave="closeSelfModal"
    >
      <div
        v-if="isMounted"
        class="modal-inner p-2"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
//  @click.self="isMounted = false"
export default {
  data () {
    return {
      isMounted: false,
    };
  },
  mounted () {
    this.isMounted = true;
  },
  props: {
    shadow: {
      type: Boolean,
      default: false,
    },
    positionTop: {
      type: String,
      default: '210px'
    }
  },
  methods: {
    closeSelfModal () {
      this.$emit("closeModal");
    },
    modalHide () {
      this.isMounted = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";
$posTop: 230px;
.history-modal {
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  &.shadown {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-inner {
    width: calc(100vw - 10px);
    height: calc(100vh - var(--positionTop));
    margin-top: var(--positionTop);
    margin-left: 5px;
    background-color: var(--themeBgColor);
    box-shadow: 0 -15px 10px rgba(0, 0, 0, 0.5);
    border-top: 1px solid #333;
    overflow-y: auto;
    @include scroll-style;
  }
}

.raise-enter-active {
  animation: raise-in 0.35s;
}
.raise-leave-active {
  animation: raise-in 0.35s reverse;
}
@keyframes raise-in {
  0% {
    margin-top: calc(var(--positionTop) + 300px);
    opacity: 0;
  }
  100% {
    margin-top: var(--positionTop);
    opacity: 1;
  }
}
</style>
