<template>
  <q-page>
    <my-title title="PRE MDC/MDC（附表7.1）" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="MDC"
          ><q-select v-bind="QSelectProps" v-model="search.Mdc" :options="mdcItems" @update:model-value="searchSubmit"></q-select
        ></my-input-wrapper>
        <my-input-wrapper label="DRG"> <q-input v-bind="QInputProps" v-model="search.Drg" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="Drg" :pagination="pagination" :loading="tableLoading" wrap-cells>
        <template #body="props">
          <has-children-body v-bind="props" :children-show="props.row.subShow">
            <template #body-cell-subShow="{ col, row }">
              <q-td :props="{ col }">
                <q-btn
                  v-model="row.subShow"
                  :class="{ 'rotate-90': row.subShow }"
                  icon="chevron_right"
                  @click="row.subShow = !row.subShow"
                  round
                  unelevated
                  dense
                ></q-btn>
              </q-td>
            </template>

            <template #children="{ row: parentRow, cols }">
              <q-td v-if="parentRow.subShow" :colspan="cols.length">
                <div class="flex flex-col gap-4">
                  <div v-for="(drg, key) in parentRow.drgs">
                    <div class="flex items-center bg-purple py-[6px] px-[16px] text-xl text-white">
                      <q-btn
                        v-model="drg.show"
                        :class="{ 'rotate-90': drg.show }"
                        icon="chevron_right"
                        @click="drg.show = !drg.show"
                        round
                        unelevated
                        dense
                      ></q-btn>

                      <div>{{ key }}</div>
                    </div>
                    <q-table
                      v-if="drg.show"
                      :key="key"
                      v-bind="QTableProps"
                      class="max-h-[60vh]"
                      :rows="drg.items"
                      :columns="drgColumns(key)"
                      row-key="OpCode"
                      :pagination="{ rowsPerPage: -1 }"
                      virtual-scroll
                    ></q-table>
                  </div>
                </div>
              </q-td>
            </template>
          </has-children-body>
        </template>
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Pcs71"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcs71, getIcd10Pcs71Detail } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep, range, groupBy, mapValues } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import HasChildrenBody from 'components/HasChildrenBody.js'

const $q = useQuasar()

const columns = [
  { name: 'subShow', label: '展開', field: 'subShow', align: 'left' },
  { name: 'Mdc', label: 'MDC', field: 'Mdc', align: 'left' },
  { name: 'MdcCname', label: 'MDC 中文', field: 'MdcCname', align: 'left', headerClasses: 'min-w-[122px]' },
  { name: 'MdcEname', label: 'MDC 英文', field: 'MdcEname', align: 'left', headerClasses: 'min-w-[122px]' },
  { name: 'Drg', label: 'DRG', field: 'Drg', align: 'left' },
  { name: 'DrgCname', label: 'DRG 中文', field: 'DrgCname', align: 'left' },
  { name: 'DrgEname', label: 'DRG 英文', field: 'DrgEname', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcs71 = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcs71(query)
    if (res.status === 200) {
      rows.value = res.data.Items.map((item) => ({ ...item, drgs: {}, subShow: false }))
      pagination.value.rowsNumber = res.data.Count

      rows.value.forEach((row) => {
        GetIcd10Pcs71Detail(row)
      })
    }
  } catch (err) {
    console.log(err)
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
  Mdc: null,
  Drg: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Mdc':
            return filterArray.concat(setOdataFilter({ key, value: String(value), operator: 'eq' }))
          case 'Drg':
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
  GetIcd10Pcs71()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcs71()
}

const drgColumns = (key) => {
  if (key.includes('NON-OPERATING')) {
    return [
      { name: 'OpCode', label: '虛擬碼', field: 'OpCode', align: 'left', headerClasses: 'sticky top-0 z-10' },
      { name: 'OpName', label: '虛擬名稱', field: 'OpName', align: 'left', headerClasses: 'sticky top-0 z-10' },
    ]
  } else if (key.includes('OPERATING')) {
    return [
      { name: 'OpCode', label: '處置碼', field: 'OpCode', align: 'left', headerClasses: 'sticky top-0 z-10' },
      { name: 'OpName', label: '處置名稱', field: 'OpName', align: 'left', headerClasses: 'sticky top-0 z-10' },
    ]
  } else if (key.includes('DIAGNOSIS')) {
    return [
      { name: 'OpCode', label: '診斷碼', field: 'OpCode', align: 'left', headerClasses: 'sticky top-0 z-10' },
      { name: 'OpName', label: '診斷名稱', field: 'OpName', align: 'left', headerClasses: 'sticky top-0 z-10' },
    ]
  }
}

const GetIcd10Pcs71Detail = async (row) => {
  try {
    const query = setSearchQuery({
      $filter: `Drg eq '${row.Drg}'`,
    })
    const res = await getIcd10Pcs71Detail(query)
    if (res.status === 200) {
      console.log()
      row.drgs = mapValues(groupBy(res.data.Items, 'Category'), (items) => ({ items, show: false }))
    }
  } catch (err) {
    console.log(err)
  }
}

const mdcItems = range(1, 19)
  .concat(range(21, 25))
  .map((i) => 'MDC' + i)
  .concat(['PRE MDC'])

const init = async () => {
  GetIcd10Pcs71()
}
init()
</script>

