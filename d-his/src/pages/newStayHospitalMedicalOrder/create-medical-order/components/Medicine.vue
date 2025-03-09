<template>
  <div>
    <MedicineTable
      ref="medicineTableRef"
      v-model:rows="medicineRows"
      :columns="medicineColumns"
      :loading="loadingIpdMedications"
      preset
      :presetKeyName="'StayMedication'"
    >
      <template #btn-expand>
        <q-btn
          class="bg-yellow-100 mr-2 font-medium"
          dense
          unelevated
          label="用藥醫囑說明"
          @click="clickShow"
          :loading="loadingIpdMedications"
        ></q-btn>
      </template>
    </MedicineTable>

    <div class="h-16 border border-soild border-[#a6bee3] bg-[#EEF8FF] flex justify-end items-center border-t-0">
      <q-btn class="mr-5" color="pink-10" unelevated dense :loading="loadingIpdMedications" @click="PutIpdMedications"
        >完成醫囑</q-btn
      >
    </div>

    <div class="mt-10 px-3 flex">
      <p class="bg-[#1976d2] text-white text-xl font-medium px-2 rounded">用藥紀錄</p>
    </div>

    <MedicineTable
      v-model:rows="medicineRowsReadOnly"
      :columns="columnsReadOnly"
      :loading="loadingIpdMedications"
      readonly
    >
    </MedicineTable>

    <q-dialog v-model="instructShow" full-width no-backdrop-dismiss no-esc-dismiss>
      <my-dialog-content header="用藥醫囑說明" width="800px" @close="clickHide">
        <div class="bg-[#F2F8FF] font-semibold text-xl">
          <div class="flex px-2 py-1">
            <p class="mr-10">病歷號:{{ ipdData.PatientId }}</p>
            <p class="mr-10">姓名:{{ ipdData.Patient.Person.Name }}</p>
            <p class="mr-10">性別:{{ ipdData.Gender }}</p>
            <p class="mr-10">年齡:{{ age }}</p>
            <p class="mr-10">生日:{{ ipdData?.Patient?.Person?.BirthDate?.substring(0, 10) }}</p>
          </div>
          <div class="flex px-2 py-1">
            <p class="mr-10">身分證號:{{ ipdData.Patient.PersonId }}</p>
            <p class="mr-10">身分別:{{ ipdData.IdentityName }}</p>
            <p class="mr-10">過敏:{{ ipdData.Patient.AllergyComment }}</p>
          </div>
        </div>
        <div class="pt-2 font-semibold text-xl">
          <p class="px-2">用藥醫囑說明:</p>
          <q-input outlined dense flat type="textarea" v-model="ipdData.MedicationDesc" rows="17"></q-input>
        </div>

        <template #actions>
          <q-btn text-color="black" color="blue-grey-12" dense unelevated @click="clickHide">取消</q-btn>
          <q-btn color="primary" dense unelevated @click="PutIpdRecordItem">確認</q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import {
  getIpdMedicationsItem,
  putIpdMedications,
  getIpdExecuteMedicationsItem,
  getIpdRecordItem,
  putIpdRecordItem,
} from 'api'
import dayjs from 'dayjs'

import MedicineTable from 'components/opd/MedicineTable.vue'

const $q = useQuasar()
const route = useRoute()

const medicineRows = ref([])
const medicineColumns = ref([
  'index',
  'MedicationDate',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'SelfFlag',
  'UnitName',
  'FrequencyCode',
  'RouteCode',
  'OneDayInHospital',
  'Formula',
  'Mill',
  'StartDate',
  'EndDate',
  'StopFlag',
  'StopDate',
  'action',
])

const medicineRowsReadOnly = ref([])
const columnsReadOnly = [
  'MedicationDate',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'UnitName',
  'FrequencyCode',
  'OneDayInHospital',
  'RouteCode',
  'SelfFlag',
  'Formula',
  'Mill',
  'StartDate',
  'EndDate',
  'TotalAmountStayHospital',
  'StopDate',
  'AttendingDocName',
  'ExecuteStatus',
  'ExecuteStaffName',
]

const medicineTableRef = ref()
// 醫囑指示彈出框
const instructShow = ref(false)
const clickShow = () => {
  instructShow.value = true
}
const clickHide = () => {
  instructShow.value = false
}
//  用藥醫囑說明用
const ipdData = ref({})
const age = ref('')
const GetIpdRecordItem = async () => {
  const loadingIpdMedications = ref(false)
  try {
    const res = await getIpdRecordItem(route.params.Id)
    if (res.status === 200) {
      ipdData.value = res.data
      const birthDate = dayjs(res.data.Patient.Person.BirthDate)
      const today = dayjs()
      const diffInDays = today.diff(birthDate, 'year')
      age.value = diffInDays
    }
  } catch (err) {
    console.log(err)
  } finally {
    loadingIpdMedications.value = false
  }
}
const PutIpdRecordItem = async () => {
  const body = cloneDeep(ipdData.value)
  try {
    const res = await putIpdRecordItem(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新用藥醫囑說明成功',
        position: 'top',
      })
      GetIpdRecordItem()

      clickHide()
    }
  } catch (err) {
    console.log(err)
  }
}

//  M用藥表格用
const loadingIpdMedications = ref(false)
const GetIpdMedicationsItem = async () => {
  loadingIpdMedications.value = true
  try {
    const res = await getIpdMedicationsItem(route.params.Id)
    if (res.status === 200) {
      medicineRows.value = cloneDeep(res.data.IpdMedications)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdMedications.value = false
  }
}

const PutIpdMedications = async () => {
  medicineTableRef.value.validate()
  if (!medicineTableRef.value.validate().result) {
    medicineTableRef.value.validate().errorInputRef.focus()
    return false
  }
  loadingIpdMedications.value = true
  const setMedicineRows = medicineRows.value.map((item) => {
    const setItem = { ...item }
    if (!item.MedicationDate) {
      setItem.MedicationDate = dayjs().format('YYYY-MM-DD')
    }
    setItem.IpdId = route.params.Id
    delete setItem.Id
    return setItem
  })
  const body = { IpdId: route.params.Id, IpdMedications: setMedicineRows }
  try {
    const res = await putIpdMedications(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新M住院醫囑用藥成功',
        position: 'top',
      })
      GetIpdMedicationsItem()
      GetIpdExecuteMedicationsItem()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdMedications.value = false
  }
}
//用藥紀錄表格
const GetIpdExecuteMedicationsItem = async () => {
  loadingIpdMedications.value = true
  try {
    const res = await getIpdExecuteMedicationsItem(route.params.Id)
    if (res.status === 200) {
      medicineRowsReadOnly.value = cloneDeep(res.data.IpdMedications)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdMedications.value = false
  }
}

const init = () => {
  GetIpdRecordItem()
  GetIpdMedicationsItem()
  GetIpdExecuteMedicationsItem()
}
init()
</script>

