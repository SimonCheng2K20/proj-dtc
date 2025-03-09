<template>
  <div class="recording-delete-warning-content" v-if="showRecordingDeleteMessage">
    <div class="rounded-lg recording-delete-warning">
      <div class="w-ful upper-content rounded-t-md">
        <div>
          <svg class="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div class="down-content w-full">
        <div class="font-semibold px-8 py-6 pb-1 text-xl">
          確定要刪除此筆會診單? 刪除後將無法再檢視
        </div>
        <div class="font-semibold px-8 py-2 pb-8 text-xl">
          身分證字號:
          {{ patientIdentifier }}
        </div>

        <div class="flex justify-center">
          <tailwind-btn @click="confirmMessage" wording="確定" bgbolor="#2a97f0" class="mx-3" />
          <tailwind-btn @click="closeMessage" wording="取消" bgbolor="#6a9f3e" class="mx-3" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { inject, ref, reactive, defineComponent, computed, onMounted, nextTick, watch } from "vue";
import { useToast } from "vue-toastification";
import { deleteSheet } from "Service/apis.js";
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const showRecordingDeleteMessage = ref(false);
    const toast = useToast();
    const sheetData = reactive({
      Id: '',
      data: '',
    })

    const closeMessage = () => {
      showRecordingDeleteMessage.value = false;
    };

    const patientIdentifier = computed(() => {
      // return store.state.editItem?.Patient?.Identifier

      if (sheetData.Id) {
        return sheetData.data.Patient.Identifier
      } else {
        return store.state.editItem?.Patient?.Identifier
      }

    });

    const getSheetId = (data) => {
      sheetData.Id = data.Id
      sheetData.data = data
    }

    const confirmMessage = async () => {
      try {

        console.log(`sheetData.Id: `, sheetData.Id)
        console.log(`store.state.editItem.Id: `, store.state.editItem.Id)

        let Id

        if (sheetData.Id) {
          Id = sheetData.Id
        } else {
          Id = store.state.editItem.Id
        }

        const res = await deleteSheet(Id);
        toast.success(`已成功刪除此會診單`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        emit("closeDeleteMessage");
        showRecordingDeleteMessage.value = false;
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    watch(
      () => sheetData.Id,
      (val) => {
        console.log(val)
      }
    )

    return {
      patientIdentifier,
      showRecordingDeleteMessage,
      confirmMessage,
      closeMessage,
      getSheetId,
      sheetData,
    };
  },
});
</script>
<style lang="scss" scoped>
.recording-delete-warning-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  // background-color: #0000004a;
  background: #0000004d;
  z-index: 9999;

  .recording-delete-warning {
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
      height: 86px;
      background: #da5e62;
      display: flex;
      justify-content: center;
      padding-top: 5px;
      //   padding-bottom: 10px;
    }

    .down-content {
      display: grid;
      justify-content: center;
      font-size: 24px;
    }
  }
}
</style>
