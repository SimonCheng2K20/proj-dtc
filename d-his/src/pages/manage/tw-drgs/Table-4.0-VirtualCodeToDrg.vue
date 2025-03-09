<template>
  <q-page>
    <my-title title="Tw-DRGs4.0虛擬碼對應DRG" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="MDC">
          <q-select
            v-bind="QSelectProps"
            v-model="search['Icd10Pcs71/Mdc']"
            :options="mdcItems"
            option-value="EName"
            option-label="EName"
            @update:model-value="searchSubmit"
            emit-value
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="DRG"><q-input v-bind="QInputProps" v-model="search.Drg" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="處置代碼"> <q-input v-bind="QInputProps" v-model="search.OpCode" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="Mdc" :pagination="pagination" :loading="tableLoading">
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10PcsvDrg"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10PcsvDrg } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep, range } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'Mdc', label: 'MDC', field: 'Mdc', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'MdcCname', label: 'MDC中文名稱', field: 'MdcCname', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'MdcEname', label: 'MDC英文名稱', field: 'MdcEname', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'Drg', label: 'DRG', field: 'Drg', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'OpCode', label: '處置代碼', field: 'OpCode', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'CName', label: '處置中文名稱', field: 'CName', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'EName', label: '處置英文名稱', field: 'EName', align: 'left', headerClasses: 'min-w-[60px]' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10PcsvDrg = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10PcsvDrg(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  'Icd10Pcs71/Mdc': null,
  Drg: null,
  OpCode: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Icd10Pcs71/Mdc':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'Drg':
          case 'OpCode':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIcd10PcsvDrg()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10PcsvDrg()
}

// const mdcItems = range(1, 19)
//   .concat(range(21, 25))
//   .map((i) => 'MDC' + i)
//   .concat(['PRE MDC'])
const mdcItems = ref([
  // { EName: 'PRE MDC', CName: '器官移植', filterLabel: 'PRE MDC - 器官移植' },
  { EName: 'MDC1', CName: '神經系統', filterLabel: 'MDC1 - 神經系統' },
  // { EName: 'MDC2', CName: '眼', filterLabel: 'MDC2 - 眼' },
  // { EName: 'MDC3', CName: '耳鼻喉及口腔', filterLabel: 'MDC3 - 耳鼻喉及口腔' },
  { EName: 'MDC4', CName: '呼吸系統', filterLabel: 'MDC4 - 呼吸系統' },
  { EName: 'MDC5', CName: '循環系統', filterLabel: 'MDC5 - 循環系統' },
  // { EName: 'MDC6', CName: '消化系統', filterLabel: 'MDC6 - 消化系統' },
  // { EName: 'MDC7', CName: '肝、膽系統或胰臟', filterLabel: 'MDC7 - 肝、膽系統或胰臟' },
  { EName: 'MDC8', CName: '骨骼、肌肉系統及結締組織', filterLabel: 'MDC8 - 骨骼、肌肉系統及結締組織' },
  { EName: 'MDC9', CName: '皮膚、皮下組織及乳房', filterLabel: 'MDC9 - 皮膚、皮下組織及乳房' },
  { EName: 'MDC10', CName: '內分泌、營養及新陳代謝', filterLabel: 'MDC10 - 內分泌、營養及新陳代謝' },
  // { EName: 'MDC11', CName: '腎及尿道', filterLabel: 'MDC11 - 腎及尿道' },
  // { EName: 'MDC12', CName: '男性生殖系統', filterLabel: 'MDC12 - 男性生殖系統' },
  // { EName: 'MDC13', CName: '女性生殖系統', filterLabel: 'MDC13 - 女性生殖系統' },
  // { EName: 'MDC14', CName: '妊娠、生產與產褥期', filterLabel: 'MDC14 - 妊娠、生產與產褥期' },
  // { EName: 'MDC15', CName: '新生兒與其他源於 週產期病態之新生兒', filterLabel: 'MDC15 - 新生兒與其他源於 週產期病態之新生兒' },
  // { EName: 'MDC16', CName: '血液及造血器官', filterLabel: 'MDC16 - 血液及造血器官' },
  // { EName: 'MDC17', CName: '骨髓增生性疾病或 分化不明腫瘤', filterLabel: 'MDC17 - 骨髓增生性疾病或 分化不明腫瘤' },
  // { EName: 'MDC18', CName: '傳染疾病寄生蟲病', filterLabel: 'MDC18 - 傳染疾病寄生蟲病' },
  { EName: 'MDC21', CName: '損傷、中毒與藥品毒性作用', filterLabel: 'MDC21 - 損傷、中毒與藥品毒性作用' },
  { EName: 'MDC23', CName: '影響健康狀態之因素與 需要其他醫療服務', filterLabel: 'MDC23 - 影響健康狀態之因素與 需要其他醫療服務' },
])

const init = async () => {
  GetIcd10PcsvDrg()
}
init()
</script>

