<template>
  <div>
    <Dialog
      v-model:visible="modalConsultationRecordShow"
      @show="setData"
      @hide="closeModalConsultationRecord"
      class="custom-modal custom-scroll-bar"
      :draggable="false"
      :modal="true"
      style="width: 775px"
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <template #header>
        <div>會診記錄</div>
      </template>

      <div style="min-height: 55vh" class="flex flex-col">
        <div class="flex items-center">
          <img
            class="mr-2"
            style="width: 25px"
            src="/assets/members-icon.png"
          />
          <div class="font-bold">
            參與者:
            <span
              style="color: rgb(55 74 151); font-size: 17px; font-weight: 550"
              >{{ allData.MeetMemberAccountName || "" }}</span
            >
          </div>
        </div>
        <div class="font-bold mt-2">會診記錄:</div>
        <Textareaprime
          class="w-full rounded-t-none custom-scroll-bar"
          v-model="allData.Content"
          disabled
          rows="12"
        />
        <div class="font-bold mt-2">建議事項:</div>
        <Textareaprime
          class="w-full rounded-t-none custom-scroll-bar"
          v-model="allData.Recommendation"
          disabled
          rows="3"
        />
      </div>
    </Dialog>
  </div>
</template>

<script>
import { inject, ref, defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const modalConsultationRecordShow = ref(false);

    const allData = ref({
      MeetMemberAccountName: "",
      Content: "",
      Recommendation: "",
    });

    const setData = () => {
      allData.value = { ...props.modelValue };
    };

    const closeModalConsultationRecord = () => {
      allData.value = {
        MeetMemberAccountName: "",
        Content: "",
        Recommendation: "",
      };
    };

    return {
      allData,
      setData,
      modalConsultationRecordShow,
      closeModalConsultationRecord,
    };
  },
});
</script>

<style lang="scss" scoped></style>
