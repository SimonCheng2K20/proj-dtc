<template>
  <div>
    <header-bar :key="ipdStore.ipdData.PatientId" @scanPatient="scanPatient"></header-bar>
    <div>
      <div class="grid grid-cols-2 grid-rows-[400px]">
        <div>
          <q-table
            v-bind="QTableProps"
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :loading="loadTable"
            row-key="Id"
          >
            <template v-slot:top>
              <div>Vital Signs 數據列表</div>
              <q-space></q-space>
              <q-btn label="量測" color="add" icon="add" unelevated dense @click="toAdd"></q-btn>
            </template>

            <template #body-cell-action="{ row }">
              <q-td>
                <q-btn label="刪除" size="md" color="delete" @click="toDelete(row)"></q-btn>
              </q-td>
            </template>
            <template v-slot:bottom>
              <my-pagination
                class="mx-auto p-4"
                v-model="pagination"
                @update:model-value="GetIpdVitalSign"
              ></my-pagination>
            </template>
          </q-table>
        </div>
        <div class="border">
          <ChartItem ref="chartRef" :anesthesiaBodySymptoms="rows" />
        </div>
      </div>
    </div>

    <q-separator></q-separator>

    <div class="flex flex-center gap-2 mt-2">
      <q-space></q-space>
      <q-btn label="上一位病患" color="primary" dense unelevated @click="prevPatient"></q-btn>
      <q-btn label="下一位病患" color="primary" dense unelevated @click="nextPatient"></q-btn>

      <q-space></q-space>
      <q-btn label="返回" color="grey" dense unelevated @click="router.go(-1)"></q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { getIpdVitalSign } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { cloneDeep } from 'lodash-es'
import headerBar from './components/headerBar.vue'
import ChartItem from './components/ChartItem.vue'
import { useIpdStore } from 'src/stores/ipd'
import VitalSignEditItem from './components/VitalSignEditItem.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const ipdStore = useIpdStore()

const prevPatient = async () => {
  clearVitalSign()
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

  router.push({ name: 'NursingStation-Implement-VitalSign', params: { ipdId: ipdStore.ipdData.IpdId } })
}
const nextPatient = async () => {
  clearVitalSign()
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

  router.push({ name: 'NursingStation-Implement-VitalSign', params: { ipdId: ipdStore.ipdData.IpdId } })
}

const chartRef = ref()
const scanPatient = async (scanPatientSuccess) => {
  if (scanPatientSuccess) {
    await GetIpdVitalSign()
    nextTick(() => {
      chartRef.value.createChart()
    })
  }
}

const loadTable = ref(false)
const columns = [
  {
    name: 'VitalSignDatetime',
    label: '日期',
    field: (row) => row.VitalSignDatetime?.substring(0, 10),
    align: 'center',
    headerClasses: 'min-w-[120px]',
  },
  {
    name: 'time',
    label: '時間',
    field: (row) => row.VitalSignDatetime?.substring(11, 16),
    align: 'center',
  },
  {
    name: 'BodyTemperature',
    label: 'BT\n(體溫)°C',
    field: 'BodyTemperature',
    align: 'center',
    headerClasses: 'whitespace-pre',
  },
  {
    name: 'BloodPressure',
    label: 'BP\n(血壓)mmHg',
    field: (row) => `(${row.BloodPressureHigh} mmHg/${row.BloodPressureLow} mmHg) \n 平均動脈壓${row.BloodPressureAvg}`,
    align: 'center',
    headerClasses: 'whitespace-pre',
    classes: 'whitespace-pre',
  },
  { name: 'Hr', label: 'HR\n(脈搏)次/分', field: 'Hr', align: 'center', headerClasses: 'whitespace-pre' },
  { name: 'Rr', label: 'RR\n(呼吸速率)', field: 'Rr', align: 'center', headerClasses: 'whitespace-pre' },
  { name: 'Pain', label: 'PAIN\n(疼痛)0-10', field: 'Pain', align: 'center', headerClasses: 'whitespace-pre' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'whitespace-pre' },
]

const rows = ref([])
const GetIpdVitalSign = async () => {
  loadTable.value = true
  const query = setSearchQuery({
    $top: pagination.value.rowsPerPage,
    $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    $filter: `IpdId eq '${route.params.ipdId}'`,
  })
  try {
    const res = await getIpdVitalSign(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    loadTable.value = false
  }
}

const clearVitalSign = () => {
  rows.value = []
  nextTick(() => {
    chartRef.value.createChart()
  })
}

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
})

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: VitalSignEditItem,
      componentProps: {
        editType: 'add',
        ipdId: route.params.ipdId,
      },
    })
    .onOk(async () => {
      dialog.hide()
      pagination.value.page = 1
      await GetIpdVitalSign()
      chartRef.value.createChart()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: VitalSignEditItem,
      componentProps: {
        editType: 'edit',
        data: row,
        ipdId: route.params.ipdId,
      },
    })
    .onOk(async () => {
      dialog.hide()
      await GetIpdVitalSign()
      chartRef.value.createChart()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: VitalSignEditItem,
      componentProps: {
        editType: 'delete',
        data: row,
        ipdId: route.params.ipdId,
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetIpdVitalSign()
    })
}

const onSaveClick = () => {}

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const init = async () => {
  if (isMounted.value) {
    chartRef.value.createChart()
  } else {
    const unwatch = watch(isMounted, (val) => {
      if (val) {
        chartRef.value.createChart()
        unwatch()
      }
    })
  }
}
init()
</script>

