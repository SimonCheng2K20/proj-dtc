<template>
  <q-btn v-bind="qBtnPropsBind" label="讀取健保卡" :loading="loading" @click="onReadHealthyCardClick"></q-btn>
</template>

<script setup>
import { ref } from 'vue'
import { useCardReaderStore } from 'stores/card-reader'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const cardReaderStore = useCardReaderStore()
const loading = ref(false)

const props = defineProps({
  qBtnProps: Object,
})

const qBtnPropsBind = ref({
  color: 'primary',
  unelevated: true,
})

const emit = defineEmits(['read'])

const onReadHealthyCardClick = async () => {
  loading.value = true
  const { data, error } = await cardReaderStore.readHealthyCard()
  if (error) {
    $q.notify({
      type: 'negative',
      message: '讀取健保卡失敗：' + error,
      position: 'top',
    })
  }
  if (data) {
    console.log('讀取的健保卡 data', data)
    emit('read', data)
  }
  loading.value = false
}

const init = () => {
  Object.assign(qBtnPropsBind.value, props.qBtnProps)
}
init()
</script>

