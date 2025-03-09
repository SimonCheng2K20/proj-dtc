<template>
  <q-dialog ref="dialogRef" @hide="clear">
    <my-dialog-content header="系統訊息" @close="dialogRef.hide">
      <div>已閒置超過 10 分鐘</div>
      <div>系統將在 {{ time }} 秒後自動登出</div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useGlobalStore } from 'stores/global'
import { useDialogPluginComponent } from 'quasar'
import { useRouter } from 'vue-router'

const { dialogRef } = useDialogPluginComponent()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const router = useRouter()

const logout = () => {
  sessionStorage.clear()
  authStore.$reset()
  globalStore.endCheckIsActive()
  router.replace('/Login')
  dialogRef.value.hide()
}

const time = ref(60)

const interval = setInterval(() => {
  time.value--
  if (time.value <= 0) {
    logout()
  }
}, 1000)

const clear = () => {
  clearInterval(interval)
}
</script>

