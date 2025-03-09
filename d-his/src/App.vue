<template>
  <RouterView />
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

window.addEventListener(
  'error',
  (evt) => {
    if (evt.target.tagName === 'LINK') {
      const dialog = $q
        .dialog({
          message: '檢測到系統更新，是否要重新刷新頁面？',
          ok: {
            label: '刷新頁面（建議）',
            color: 'primary',
            unelevated: true,
          },
          cancel: {
            label: '取消',
            color: 'grey',
            unelevated: true,
          },
        })
        .onOk(() => {
          dialog.hide()
          location.reload()
        })
    }
  },
  { once: true, capture: true }
)
</script>

