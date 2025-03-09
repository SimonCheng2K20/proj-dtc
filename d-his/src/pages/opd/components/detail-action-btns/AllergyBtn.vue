<template>
  <q-btn class="header-btn" label="過敏紀錄" unelevated dense @click="toAllergy"></q-btn>
</template>

<script setup>
import AllergyEditItem from '../AllergyEditItem.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const props = defineProps({
  patientId: String,
  isAllergy: String,
})

const toAllergy = () => {
  const dialog = $q
    .dialog({
      component: AllergyEditItem,
      componentProps: {
        patientId: props.patientId,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

const init = () => {
  if (props.isAllergy === '是') {
    toAllergy()
  }
}
init()
</script>

