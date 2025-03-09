<template>
  <div>
    <Dialog
      class="custom-modal"
      v-model:visible="showMedicalCardCertification"
      style="width: 580px"
      :modal="true"
      :draggable="false"
      @show="setData"
    >
      <template #header>
        <h3>醫事人員卡認證</h3>
      </template>
      <div class="font-bold" style="font-size: 18px">
        請輸入您的醫事人員卡密碼:
      </div>
      <div class="mt-3 font-bold w-full" style="font-size: 16px">
        <InputText
          class="w-full"
          placeholder="請輸入..."
          autofocus
          v-model.trim="cardPwd"
        />
      </div>

      <template #footer>
        <Button
          label="確認送出"
          v-show="!showLoadingButton"
          @click="confirmCode(cardPwd)"
        />
        <Button
          label="loading..."
          icon="pi pi-spin pi-spinner"
          v-show="showLoadingButton"
        />
        <Button
          label="取消"
          class="p-button-success"
          @click="showMedicalCardCertification = false"
          :disabled="showLoadingButton"
        />
      </template>
    </Dialog>
  </div>
</template>
<script>
import { inject, ref, defineComponent } from 'vue';
import {
  medicalCardWebSocketCheckIdentifier,
  medicalCardWebSocketCheckCode,
} from '@/service/websocket.js';

import { useToast } from 'vue-toastification';
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const showMedicalCardCertification = ref(false);
    const cardPwd = ref('');
    const showLoadingButton = ref(false);
    const toast = useToast();

    const setData = () => {
      cardPwd.value = '';
    };

    const confirmCode = async (data) => {
      showLoadingButton.value = true;
      const res = await medicalCardWebSocketCheckCode(data);
      if (res == 'matchok') {
        showMedicalCardCertification.value = false;
      } else {
        cardPwd.value = '';
      }
      showLoadingButton.value = false;
    };

    return {
      showMedicalCardCertification,
      cardPwd,
      setData,
      confirmCode,
      showLoadingButton,
    };
  },
});
</script>
