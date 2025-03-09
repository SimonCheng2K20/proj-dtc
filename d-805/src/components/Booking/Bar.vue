<template>
  <div class="d-flex justify-content-between align-items-start">
    <div
      class="d-flex flex-sm-column flex-lg-row justify-content-lg-between align-items-start align-items-lg-center menufunc-btns"
    >
      <div class="mb-1 mb-lg-0">
        <b-input-group prepend="" style="font-size: 24px">
          <b-button-group>
            <b-button variant="warning" @click="updateTime('全天', 'ALL')">
              全天
              <font-awesome-icon v-if="when == '全天'" icon="check" class="ml-1" />
            </b-button>
            <b-button variant="success" @click="updateTime('上午', 'AM')">
              上午
              <font-awesome-icon v-if="when == '上午'" icon="check" class="ml-1" />
            </b-button>
            <b-button variant="orange" @click="updateTime('下午', 'PM')">
              下午
              <font-awesome-icon v-if="when == '下午'" icon="check" class="ml-1" />
            </b-button>
          </b-button-group>
        </b-input-group>
      </div>

      <div>
        <b-input-group prepend="選擇檢查室" style="font-size: 24px">
          <b-button-group>
            <b-button
              v-for="(item, i) in rooms"
              :variant="variants[i]"
              :key="i"
              @click="updateRoom(item, '')"
              size="sm"
            >
              {{ item.Name }}
              <font-awesome-icon v-if="dtcBtnId == item.Id" icon="check" class="ml-1" />
            </b-button>
            <b-button
              v-if="rooms.length > 1"
              variant="warning"
              @click="updateRoom(null, 'ALL')"
            >
              全部檢查室
              <font-awesome-icon v-if="dtcBtnId == 'ALL'" icon="check" class="ml-1" />
            </b-button>
          </b-button-group>
        </b-input-group>
      </div>

      <div
        v-if="showClose"
        class="d-none d-md-flex align-items-center justify-content-end"
        cols="2"
      >
        <b-button class="back-btn" variant="primary" @click="setWholeDay">
          <font-awesome-icon icon="times" />
        </b-button>
      </div>
      <div v-else cols="2" class="d-none d-lg-flex justify-content-end pr-3 mr-sm-2">
        <b-button
          v-if="isOutSidePage"
          class="back-btn"
          variant="primary"
          @click="showInstruction"
        >
          說明
        </b-button>
      </div>
    </div>

    <b-modal
      v-model="instructionModel"
      class="instruction-modal"
      hide-footer
      hide-header
      centered
    >
      <div class="position-relative">
        <b-img
          class="position-absolute cursor-pointer"
          @click.stop="closeInstruction"
          style="right: 0; top: 0"
          :src="require('@/assets/imgs/crossBtn.png')"
        />
        <b-img style="width: 100%" :src="require('@/assets/imgs/bookingSteps.jpg')" />
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    when: {
      type: String,
      default: "",
    },
    dialogOpened: {
      type: Boolean,
      default: false,
    },
    rooms: {
      type: Array,
      default: () => [],
    },
    variants: {
      type: Array,
      default: () => [],
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    defaultIsAll: {
      type: Boolean,
      default: false,
    },
    dtcBtnId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      instructionModel: false,
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.defaultIsAll && this.rooms.length > 1) {
        this.updateRoom(null, "ALL");
      }
    }, 1000);
  },
  methods: {
    showInstruction() {
      this.instructionModel = true;
    },
    closeInstruction() {
      this.instructionModel = false;
    },
    callDay() {
      this.$emit("callLastDay");
    },
    updateTime(text, value) {
      this.$emit("upTime", { text, value });
    },
    updateRoom(item, value) {
      this.$emit("upRoom", { item, value });
    },
    setWholeDay() {
      // this.when = '全天';
      this.$emit("update:when", "全天");
      this.$emit("update:dialogOpened", false);
      this.$emit("executeAfterFresh");
      this.$emit("UpView");
    },
  },
  computed: {
    isOutSidePage() {
      return this.$route.name === "bookingWindow";
    },
  },
};
</script>

<style scoped>
/deep/ .modal-dialog.modal-dialog-centered {
  max-width: calc(100% - 60px);
}

@media (min-width: 1020px) {
  .menufunc-btns {
    width: 100%;
  }
}
</style>
