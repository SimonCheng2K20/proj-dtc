<template>
  <div class="p-2">
    <medicine-table
      style="max-height: 500px"
      title="出院帶藥"
      preset
      :columns="columns"
      :rows="rows"
      @update:rows="
        (val) => {
          rows = val
        }
      "
    ></medicine-table>
    <div class="h-16 border border-soild border-[#a6bee3] bg-[#EEF8FF] flex justify-end items-center border-t-0">
      <q-btn
        class="mr-5"
        color="pink-10"
        unelevated
        dense
        :loading="dischargeMedicationsLoading"
        @click="PutIpdDischargeMedications"
        >完成醫囑</q-btn
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

// api
import { getIpdDischargeMedications, putIpdDischargeMedications } from 'api'

// components
import MedicineTable from 'components/opd/MedicineTable.vue'

const route = useRoute()

const $q = useQuasar()

const columns = [
  'index',
  'MedicationDate',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'UnitName',
  'FrequencyCode',
  'OneDayInHospital',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'TotalAmount',
  'TotalAmount2',
  'ChronicNotes',
  'RouteCode',
  'action',
]

const rows = ref([{}])

// 出院給藥
const GetIpdDischargeMedications = async () => {
  try {
    const res = await getIpdDischargeMedications(route.params.Id)
    if (res.status === 200) {
      rows.value = res.data.IpdDischargeMedications
    }
  } catch (err) {
    console.log(err)
  }
}

// 修改出院給藥
const dischargeMedicationsLoading = ref(false)

const PutIpdDischargeMedications = async () => {
  try {
    dischargeMedicationsLoading.value = true
    rows.value.forEach((item) => {
      item.IpdId = route.params.Id
      if (item.Id) {
        delete item.Id
      }
    })
    const body = {
      IpdId: route.params.Id,
      IpdDischargeMedications: rows.value,
    }
    const res = await putIpdDischargeMedications(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新出院用藥成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '更新出院用藥失敗',
      position: 'top',
    })
  } finally {
    dischargeMedicationsLoading.value = false
  }
}

const init = () => {
  GetIpdDischargeMedications()
}

init()
</script>
