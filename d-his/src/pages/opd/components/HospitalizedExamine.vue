<template>
  <div>
    <section class="px-5 pb-6">
      <h2 style="margin-left: -30px" class="text-xl font-semibold text-[#035AB8]">Vital Signs 數據列表</h2>
      <q-table
        v-bind="QTableProps"
        :columns="vitalSignColumns"
        :rows="vitalSignRows"
        :pagination="pagination"
        :loading="loadTable"
        row-key="Id"
      >
        <template v-slot:top>
          <div>Vital Signs 數據列表</div>
        </template>

        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="GetIpdVitalSign"></my-pagination>
        </template>
      </q-table>
    </section>

    <!-- 血液檢驗報告 -->
    <section class="px-5 pb-6">
      <h2 style="margin-left: -30px" class="text-xl font-semibold text-[#035AB8]">檢驗報告</h2>
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請科別">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請醫師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體編號">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢驗師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="核發者">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="確認時間">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-separator class="my-4" color="primary"></q-separator>

      <q-table v-bind="QTableProps" title="血液檢驗報告" :columns="bloodColumns" :rows="bloodRows">
        <template #body-cell-chart="{ col }">
          <q-td :props="{ col }">
            <q-btn icon="show_chart" color="primary" unelevated dense round></q-btn>
          </q-td>
        </template>
      </q-table>
    </section>

    <!-- 尿液檢查 -->
    <section class="px-5 pb-6">
      <h2 style="margin-left: -30px" class="text-xl font-semibold text-[#035AB8]">檢驗報告</h2>
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請科別">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請醫師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體編號">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢驗師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="核發者">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="確認時間">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-separator class="my-4" color="primary"></q-separator>

      <q-table v-bind="QTableProps" title="尿常規檢查" :columns="bloodColumns" :rows="bloodRows">
        <template #body-cell-chart="{ col }">
          <q-td :props="{ col }">
            <q-btn icon="show_chart" color="primary" unelevated dense round></q-btn>
          </q-td>
        </template>
      </q-table>
      <q-table v-bind="QTableProps" class="mt-4" title="尿沈渣檢查" :columns="bloodColumns" :rows="bloodRows">
        <template #body-cell-chart="{ col }">
          <q-td :props="{ col }">
            <q-btn icon="show_chart" color="primary" unelevated dense round></q-btn>
          </q-td>
        </template>
      </q-table>
    </section>

    <!-- 影像報告 -->
    <section class="px-5 pb-6">
      <h2 style="margin-left: -30px" class="text-xl font-semibold text-[#035AB8]">影像報告</h2>
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請科別">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請醫師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢查項目">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="部位">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="技師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="報告醫師">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="確認時間">
          <q-input v-bind="QInputProps" readonly></q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-separator class="my-4" color="primary"></q-separator>

      <q-table v-bind="QTableProps" title="影像報告" :columns="imgbloodColumns" :rows="imgbloodRows">
        <template #body-cell-pacs="{ col }">
          <q-td :props="{ col }">
            <q-btn icon="image" color="primary" unelevated dense round @click="toDC600"> </q-btn>
          </q-td>
        </template>
      </q-table>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { getIpdVitalSign } from 'api'

// components
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const props = defineProps({
  selectedItem: Object,
})
// VitalSignTable
const vitalSignColumns = [
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
const vitalSignRows = ref([])
const loadTable = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
})

const GetIpdVitalSign = async () => {
  loadTable.value = true
  const query = setSearchQuery({
    filter: `IpdId eq '${props.selectedItem.IpdId}'`,
    $top: pagination.value.rowsPerPage,
    $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
  })
  try {
    const res = await getIpdVitalSign(query)
    if (res.status === 200) {
      vitalSignRows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadTable.value = false
  }
}
// 血液檢驗報告
const bloodColumns = [
  { name: 'chart', label: '圖表', field: 'chart', align: 'center' },
  { name: 'Name', label: '檢驗名稱', field: 'Name', align: 'left' },
  { name: 'NormalRange', label: 'Normal Range', field: 'NormalRange', align: 'left' },
  { name: 'Result', label: '結果值', field: 'Result', align: 'left' },
  { name: 'Unit', label: '單位', field: 'Unit', align: 'left' },
]

const bloodRows = ref([{}])

// 尿液檢驗報告
const urineColumns = [
  { name: 'chart', label: '測驗項目', field: 'chart', align: 'center' },
  { name: 'Name', label: '正常值', field: 'Name', align: 'left' },
  { name: 'NormalRange', label: '結果', field: 'NormalRange', align: 'left' },
  { name: 'Result', label: '單位', field: 'Result', align: 'left' },
]

const urineRows = ref([{}])

const urineSedimentRows = ref([{}])

// 影像報告
const imgbloodColumns = [
  { name: 'pacs', label: '影像', field: 'pacs', align: 'center' },
  { name: 'Content', label: '報告內容', field: 'Content', align: 'left' },
]

const imgbloodRows = ref([])

const resetData = () => {
  vitalSignRows.value = []
  bloodRows.value = []
  urineRows.value = []
  urineSedimentRows.value = []
  imgbloodRows.value = []
}

watch(
  () => props.selectedItem,
  (newVal) => {
    if (!!newVal) getIpdData()
    else resetData()
  }
)
const getIpdData = () => {
  GetIpdVitalSign()
}
const init = () => {
  if (props.selectedItem) {
    GetIpdVitalSign()
  }
}
init()
</script>

