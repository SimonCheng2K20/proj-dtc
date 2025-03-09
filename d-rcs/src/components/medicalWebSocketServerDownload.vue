<template>
  <div>
    <Dialog
      class="custom-modal"
      v-model:visible="showMedicalWebSocketServerDownload"
      style="width: 550px"
      :modal="true"
      :draggable="false"
      @show="setData"
    >
      <template #header>
        <h3>系統資訊</h3>
      </template>
      <div class="font-bold mt-3" style="font-size: 16px">
        偵測到您尚未安裝或開啟讀卡軟體，如果您需要使用電子簽章功能
      </div>
      <div class="mt-1 font-bold w-full" style="font-size: 16px">
        請點選「<span class="cursor-pointer" style="color: #5a9bd5" @click="openReaderMsi"
          >下載</span
        >」；如果不需要，請點選「<span
          class="cursor-pointer"
          style="color: #495057"
          @click="showMedicalWebSocketServerDownload = false"
          >關閉</span
        >」。
      </div>

      <template #footer>
        <Button label="下載" @click="openReaderMsi" />

        <Button
          label="關閉"
          class="p-button-success"
          @click="showMedicalWebSocketServerDownload = false"
        />
      </template>
    </Dialog>
  </div>
</template>
<script>
import { inject, ref, defineComponent } from "vue";
import {
  medicalCardWebSocketCheckIdentifier,
  medicalCardWebSocketCheckCode,
} from "@/service/websocket.js";

import { useToast } from "vue-toastification";
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const showMedicalWebSocketServerDownload = ref(false);

    const toast = useToast();

    const setData = () => {};

    const openReaderMsi = () => {
      // window.open('/UploadFiles/CardReader.msi');
      window.open(`/UploadFiles/rConsultCardReaderSetup.msi?${Date.now()}`);
    };

    return {
      showMedicalWebSocketServerDownload,

      setData,
      openReaderMsi,
    };
  },
});
</script>
