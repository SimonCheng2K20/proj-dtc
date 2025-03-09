<template>
  <div>
    <header-bar :key="ipdStore.ipdData.PatientId" @scanPatient="scanPatient"></header-bar>
    <div>
      <excute-gave-medicine-table
        v-model:rows="medicineUse[currentTab]"
        :columns="columns"
        :no-data-label="`此日期時間無${header}，請確認其他類型用藥`"
        :loading="loadTable"
      >
        <template #top>
          <div>{{ header }}</div>
          <q-space></q-space>
          <q-tabs
            v-model="currentTab"
            content-class="bg-transparent gap-2"
            indicator-color="primary"
            active-bg-color="primary"
            active-color="white"
            align="left"
            dense
            style="background: none;"
          >
            <q-tab label="N" name="RegularHours" class="cus-tab-bgW1"></q-tab>
            <q-tab label="S" name="StatHours" class="cus-tab-bgW1"></q-tab>
            <q-tab label="P" name="PrnHours" class="cus-tab-bgW1"></q-tab>
          </q-tabs>
          <q-space></q-space>
        </template>
      </excute-gave-medicine-table>

      <q-separator></q-separator>

      <div class="flex flex-center gap-2 mt-2">
        <q-space></q-space>
        <q-btn label="上一位病患" color="primary" dense unelevated @click="prevPatient"></q-btn>
        <q-btn label="下一位病患" color="primary" dense unelevated @click="nextPatient"></q-btn>

        <q-space></q-space>

        <q-btn
          label="確認給藥完成"
          color="primary"
          dense
          unelevated
          @click="onSaveClick"
          :loading="saveLoading"
        ></q-btn>
        <q-btn label="返回" color="grey" dense unelevated @click="router.go(-1)"></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getIpdMedicationsTakeList, putIpdMedicationsTakeList } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import dayjs from 'dayjs'
import { useIpdStore } from 'src/stores/ipd'
import headerBar from './components/headerBar.vue'
import ExcuteGaveMedicineTable from 'components/opd/ExcuteGaveMedicineTable.vue'
import { cloneDeep } from 'lodash-es'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const ipdStore = useIpdStore()

const currentTab = ref(route.query.medicType)
const header = computed(() => {
  switch (currentTab.value) {
    case 'RegularHours':
      return '常規用藥'
    case 'StatHours':
      return 'STAT 用藥'
    case 'PrnHours':
      return 'PRN 用藥'
    default:
      return ''
  }
})

const prevPatient = async () => {
  clearMedicineUse()
  const index = ipdStore.ipdList.findIndex(({ IpdId }) => IpdId === ipdStore.selected[0].IpdId)
  if (index === 0) {
    if (ipdStore.pagination.page === 1) {
      alert('已經是清單第一個人了')
      return
    }

    ipdStore.pagination.page = ipdStore.pagination.page - 1
    await ipdStore.GetIpdRecordList()
    ipdStore.setIpdData(ipdStore.ipdList[0])
  } else {
    ipdStore.setIpdData(ipdStore.ipdList[index - 1])
  }

  // router.push({ name: 'NursingStation-Implement-VitalSign', params: { ipdId: ipdStore.ipdData.IpdId } })
}
const nextPatient = async () => {
  clearMedicineUse()
  const index = ipdStore.ipdList.findIndex(({ IpdId }) => IpdId === ipdStore.selected[0].IpdId)
  if (ipdStore.pagination.rowsPerPage * ipdStore.pagination.page - 1 === ipdStore.pagination.rowsNumber) {
    alert('已經是清單最後一個人了')
    return
  }

  if (index === ipdStore.pagination.rowsPerPage - 1) {
    ipdStore.pagination.page = ipdStore.pagination.page + 1
    await ipdStore.GetIpdRecordList()
    ipdStore.setIpdData(ipdStore.ipdList[0])
  } else {
    ipdStore.setIpdData(ipdStore.ipdList[index + 1])
  }

  // router.push({ name: 'NursingStation-Implement-VitalSign', params: { ipdId: ipdStore.ipdData.IpdId } })
}

const clearMedicineUse = () => {
  medicineUse.RegularHours = []
  medicineUse.StatHours = []
  medicineUse.PrnHours = []
}

const scanPatient = (scanPatientSuccess) => {
  if (scanPatientSuccess) {
    GetIpdMedicationsTakeList()
  }
}

// 表格資料
const columns = [
  'index',
  'book',
  'img',
  'DoseOnce',
  'Name',
  'UnitName',
  'RouteCode',
  'TakeDoseFlag',
  'TakeDoseTime',
  'NonTakeReason',
]
const medicineUse = reactive({
  RegularHours: [],
  StatHours: [],
  PrnHours: [],
})

const loadTable = ref(false)
const GetIpdMedicationsTakeList = async () => {
  loadTable.value = true
  const query = setSearchQuery({
    IpdId: route.params.ipdId,
    medDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),
  })
  try {
    const res = await getIpdMedicationsTakeList(query)
    medicineUse.RegularHours = res.data.IpdMedications.filter((item) => {
      return item.FrequenyType !== 4 && item.FrequenyType !== 5
    })
    medicineUse.StatHours = res.data.IpdMedications.filter((item) => {
      return item.FrequenyType === 5
    })
    medicineUse.PrnHours = res.data.IpdMedications.filter((item) => {
      return item.FrequenyType === 4
    })
  } catch (error) {
    console.log(error)
  } finally {
    loadTable.value = false
  }
}

const onSaveClick = () => {
  const data = {
    IpdId: route.params.ipdId,
    IpdTakeMedications: [
      ...cloneDeep(medicineUse.RegularHours),
      ...cloneDeep(medicineUse.StatHours),
      ...cloneDeep(medicineUse.PrnHours),
    ],
  }

  PutIpdMedicationsTakeList(data)
}

const saveLoading = ref(false)
const PutIpdMedicationsTakeList = async (data) => {
  try {
    saveLoading.value = true
    const res = await putIpdMedicationsTakeList(data)
    $q.notify({
      type: 'positive',
      message: '執行給藥完成',
      position: 'top',
    })
    GetIpdMedicationsTakeList()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '執行給藥失敗',
      position: 'top',
    })
    console.log(error)
  } finally {
    saveLoading.value = false
  }
}

const init = async () => {
  GetIpdMedicationsTakeList()
}
init()
</script>

<style lang="scss" scoped>
  .q-tab{
    &.q-tab--inactive{
      &.cus-tab-bgW1{
        color: #000;
        padding: 0;
        background-color: white !important;
      }
    }

    &.q-tab--active{
      &.bg-primary{
        &.cus-tab-bgW1{
          color: #fff;
          padding: 0;
          background-color: var(--q-primary) !important;
        }
      }
    }

  }

</style>

