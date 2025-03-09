<template>
  <my-title no-fixed title="藥品數量清點"></my-title>
  <div class="p-2">
    <div>
      <my-search-area gridCols="4" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="院內代碼">
          <q-input v-bind="QInputProps" v-model="search.MedicineId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥品名稱">
          <q-input v-bind="QInputProps" v-model="search.ScientificName" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="ACT碼">
          <q-input v-bind="QInputProps" v-model="search.AtcCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保代碼">
          <q-input v-bind="QInputProps" v-model="search.NhiCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <MedVenderSelection
          labelName="藥商名稱"
          useInput
          v-model:selectedData="venderData"
          @update:selectedData=";(search['VendorId'] = venderData?.VendorId), searchSubmit()"
        ></MedVenderSelection>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        class="mt-2"
        :columns="columns"
        :rows="rows"
        row-key="MedicineId"
        :loading="loading"
        :pagination="pagination"
      >
        <template #bottom>
          <my-pagination class="mx-auto" v-model="pagination" @update:modelValue="GetDrug"></my-pagination>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep, flatten, uniqBy } from 'lodash-es'
import { useQuasar } from 'quasar'

// api
import { getQuantityList } from 'api'

// components
import MedVenderSelection from 'src/components/type-selection/MedVenderSelection.vue'

// utils
import setSearchQuery from 'utils/setSearchQuery'
import isValidSearchValue from 'utils/isValidSearchValue'
import setOdataFilter from 'utils/setOdataFilter'
import numberFormat from 'utils/numberFormat.js'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const loading = ref(true)

const columns = computed(() => {
  return [
    { name: 'MedicineId', label: '院內代碼', align: 'left', field: 'MedicineId' },
    { name: 'NhiCode', label: '健保代碼', align: 'left', field: 'NhiCode' },
    { name: 'CName', label: '中文藥名', align: 'left', field: 'CName' },
    { name: 'EName', label: '英文藥名', align: 'left', field: 'EName' },
    { name: 'StockNow', label: '庫房存量', align: 'left', field: (row) => numberFormat(row.StockNow) },
    { name: 'VendorCn', label: '藥商名稱', align: 'left', field: 'VendorCn' },
  ]
})

const rows = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const sortBy = ref([['MedicineId', 'desc']])

const GetDrug = async () => {
  try {
    const query = setSearchQuery({
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $top: pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getQuantityList(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const initData = {}

const venderData = ref(null)

initData.search = {
  MedicineId: '',
  ScientificName: '',
  AtcCode: '',
  NhiCode: '',
  VendorId: '',
}

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArr, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'MedicineId':
          case 'AtcCode':
          case 'NhiCode':
            return filterArr.concat(setOdataFilter({ operator: 'contains', key, value }))
          case 'VendorId':
            return filterArr.concat(setOdataFilter({ operator: 'eq', key, value }))
          case 'ScientificName':
            const Name =
              setOdataFilter({ operator: 'contains', key: 'CName', value }) +
              ' or ' +
              setOdataFilter({ operator: 'contains', key: 'EName', value })

            return filterArr.concat(Name)
          default:
            return filterArr
        }
      } else {
        return filterArr
      }
    }, [])
    .join(' and ')

  return str
})

const orderBy = computed(() => {
  const orderByArr = []
  sortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDrug()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrug()
}

const init = async () => {
  GetDrug()
}

init()
</script>
