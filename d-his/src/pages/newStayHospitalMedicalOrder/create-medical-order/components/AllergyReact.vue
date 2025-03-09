<template>
  <div class="grid grid-cols-5 gap-2 p-2" :style="`height: ${pageSize.height - pageSize.offset - 40}px; min-height: 400px`">
    <patient-allergy-manage class="col-span-2" :patient-id="ipdStore.ipdData.PatientId"></patient-allergy-manage>
    <patient-food-allergy-manage class="col-span-2" :patient-id="ipdStore.ipdData.PatientId"></patient-food-allergy-manage>
    <plan-content v-model="ipdStore.ipdData.IpdPlan">
      <template #btn-expand>
        <q-btn color="primary" label="儲存" dense unelevated :loading="editLoading" @click="PutIpdRecordItem"></q-btn>
      </template>
    </plan-content>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useIpdStore } from 'stores/ipd.js'
import PatientAllergyManage from 'components/allergy/PatientAllergyManage.vue'
import PatientFoodAllergyManage from 'components/allergy/PatientFoodAllergyManage.vue'
import PlanContent from 'components/opd/PlanContent.vue'
import { putIpdRecordItem } from 'api'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const ipdStore = useIpdStore()
const pageSize = inject('pageSize')

const editLoading = ref(false)
const PutIpdRecordItem = async () => {
  try {
    editLoading.value = true
    const res = await putIpdRecordItem(ipdStore.ipdData)
    $q.notify({
      type: 'positive',
      message: '儲存 P 治療計畫 成功',
      position: 'top',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '儲存 P 治療計畫 失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}
</script>

