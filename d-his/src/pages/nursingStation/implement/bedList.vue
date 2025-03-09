<template>
  <div>
    <my-search-area grid-cols="2" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="護理站">
        <NurseStationSelection
          v-model="search['HospitalBed/NursingStation']"
          @update:model-value="searchSubmit"
        ></NurseStationSelection>
      </my-input-wrapper>
      <my-input-wrapper label="床號">
        <q-input v-bind="QInputProps" v-model="search.BedId" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
    </my-search-area>

    <q-table
      v-bind="QTableProps"
      :columns="columns"
      :rows="ipdStore.ipdList"
      :pagination="ipdStore.pagination"
      :loading="ipdStore.ipdListLoading"
      row-key="IpdId"
      v-model:selected="ipdStore.selected"
      @row-click="onRowSelect"
    >
      <template #body-cell-PayType="{ col, row }">
        <q-td :props="{ col }" v-if="row.NhiApplyType === '一般健保'"> 支付點數 </q-td>
        <q-td :props="{ col }" v-if="row.NhiApplyType === '論病例計酬'">
          <q-btn label="論病計酬" @click="showPayInfo(row)" color="primary" dense unelevated></q-btn>
        </q-td>
        <q-td :props="{ col }" v-if="row.NhiApplyType === 'twdrg'">
          <q-btn class="ml-2" label="TwDRGs" @click="showTwDRGs(row)" color="primary" dense unelevated></q-btn>
        </q-td>
      </template>
      <template #body-cell-consumables="{ col, row }">
        <q-td :props="{ col }">
          <q-btn color="pink-4" unelevated dense label="輸入耗材" @click="InputSM(row)"></q-btn>
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="ipdStore.pagination"
          v-on:update:model-value="GetIpdRecordList"
        ></my-pagination>
      </template>
    </q-table>

    <!-- 論病例計酬 彈出框-->
    <q-dialog ref="payDialog" @hide="payDialog.hide()" full-width no-backdrop-dismiss>
      <my-dialog-content header="支付方式-論病計酬" @close="payDialog.hide()">
        <CasePayment :routeIpdId="payDialogIpdId" readonly />
        <template #actions>
          <q-btn label="關閉" color="grey" @click="payDialog.hide()"></q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>
    <!-- tw-drg 彈出框-->
    <q-dialog ref="twDRGsDialog" @hide="twDRGsDialog.hide()" full-width no-backdrop-dismiss>
      <my-dialog-content header="支付方式-TwDRGs" @close="twDRGsDialog.hide()">
        <TwDRGs :routeIpdId="twDRGsDialogIpdId" readonly />
        <template #actions>
          <q-btn label="關閉" color="grey" @click="twDRGsDialog.hide()"></q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import CasePayment from 'pages/newStayHospitalMedicalOrder/create-medical-order/case-payment/CasePayment.vue'
import TwDRGs from 'pages/newStayHospitalMedicalOrder/create-medical-order/components/TwDRGs.vue'
import ConsumablesTableDialog from './components/ConsumablesTableDialog.vue'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useIpdStore } from 'src/stores/ipd'
import NurseStationSelection from 'components/type-selection/NurseStationSelection.vue'

const ipdStore = useIpdStore()
const $q = useQuasar()

const columns = [
  { name: 'BedName', label: '床號', field: 'BedName', align: 'center' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'center' },
  { name: 'PatientName', label: '病患姓名', field: (row) => row.Patient.Person.Name, align: 'center' },
  { name: 'drug', label: '給藥', field: 'drug', align: 'center' },
  { name: 'PayType', label: '支付方式', field: 'PayType', align: 'center' },
  { name: 'op', label: '手術(OP)名稱', field: 'op', align: 'center' },
  { name: 'consumables', label: '手術耗材', field: 'consumables', align: 'center' },
  { name: 'date', label: '手術(OP)日期', field: 'date', align: 'center' },
  { name: 'time', label: '手術(OP)時間', field: 'time', align: 'center' },
  { name: 'procedure', label: '檢驗處置', field: 'procedure', align: 'center' },
  { name: 'IpdDate', label: '檢驗日期', field: (row) => row.IpdDate?.substring(0, 10), align: 'center' },
  { name: 'procedureTime', label: '檢驗時間', field: 'procedureTime', align: 'center' },
]

const GetIpdRecordList = () => {
  ipdStore.GetIpdRecordList({ $filter: filter.value, $orderBy: orderBy.value })
}

const initData = {}
initData.search = {
  ['HospitalBed/NursingStation']: null,
  BedId: null,
  Status: '2',
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'HospitalBed/NursingStation':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'Status':
          case 'BedId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([['ModifyDatetime desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const onRowSelect = (evt, row) => {
  ipdStore.setIpdData(row)
}

const InputSM = async (row) => {
  const dialog = $q.dialog({
    component: ConsumablesTableDialog,
    componentProps: {
      IpdId: row.IpdId,
    },
  })
}

const payDialog = ref()
const payDialogIpdId = ref('')
const showPayInfo = async (item) => {
  payDialog.value.show()
  payDialogIpdId.value = item.IpdId
}

const twDRGsDialog = ref()
const twDRGsDialogIpdId = ref('')
const showTwDRGs = async (item) => {
  twDRGsDialog.value.show()
  twDRGsDialogIpdId.value = item.IpdId
}
</script>

