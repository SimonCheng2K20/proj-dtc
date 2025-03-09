<template>
  <Dialog class="custom-modal" v-model:visible="dialog.check.show" style="width: 768px" :modal="true" :draggable="false">
    <template #header>
      <h3>系統訊息</h3>
    </template>

    <div>是否確認將此筆會診單資料轉至「<span class="font-bold text-blue-700">空轉後送遠距會診平臺</span>」?</div>

    <template #footer>
      <div class="footer-modal">
        <Button style="background: grey" label="取消" @click="dialog.check.show = false" />
        <Button label="確定" class="p-button-success" @click="confirmMessage" />
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { postAirReferral } from 'Service/apis.js'

const dialog = reactive({
  check: {
    show: false,
  },
})

const emit = defineEmits(['update'])
const toast = useToast()
const sheetId = ref('')

const confirmMessage = async () => {
  try {
    await postAirReferral(+sheetId.value)
    toast.success(`此筆資料已轉至「空轉後送遠距會診平臺」。煩請至空轉系統填寫轉診單。`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    dialog.check.show = false
    emit('update')
  } catch (e) {
    toast.error(`執行空轉失敗: ${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

defineExpose({
  showDialog(id) {
    sheetId.value = id
    dialog.check.show = true
  },
})
</script>
