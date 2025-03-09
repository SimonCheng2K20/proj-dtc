<template>
  <div class="medical-card-warning-content" v-if="showMedcalCardMessage">
    <div class="rounded-lg medical-card-warning">
      <div class="w-ful upper-content rounded-t-md">
        <div>
          <svg
            class="h-20 w-20 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <div class="down-content w-full pt-9 pr-4">
        <h3 class="font-bold text-pink-700">
          請先通過醫事卡片認證後再進行儲存
        </h3>
        <p class="py-4 text-base text-gray-600 flex justify-center">
          <Checkbox
            name="medical-card-message"
            class="mr-3"
            style="margin-top: 1.2px"
            v-model="messageCheckbox"
            :binary="true"
            id="medical-card-message"
          />
          <label for="medical-card-message">請不要再提醒此訊息</label>
        </p>
        <div class="flex justify-center">
          <tailwind-btn
            @click="closeMessage"
            wording="確定"
            bgbolor="rgb(231 44 56)"
            class="mr-2 ml-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref, defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const messageCheckbox = ref(false);
    const showMedcalCardMessage = ref(false);
    const closeMessage = () => {
      if (messageCheckbox.value) {
        sessionStorage.setItem("noneedMes", "true");
      }
      showMedcalCardMessage.value = false;
    };

    return { messageCheckbox, showMedcalCardMessage, closeMessage };
  },
});
</script>
<style lang="scss" scoped>
.medical-card-warning-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  // background-color: #0000004a;
  background: #000000ba;
  z-index: 9999;
  .medical-card-warning {
    width: 500px;
    height: 296px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    z-index: 500;
    box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px;
    .upper-content {
      height: 80px;
      background: #da5e62;
      display: flex;
      justify-content: center;
      padding-top: 5px;
    }
    .down-content {
      display: grid;
      justify-content: center;
      font-size: 24px;
    }
  }
}
</style>
