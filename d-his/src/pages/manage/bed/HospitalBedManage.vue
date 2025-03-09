<template>
  <q-page>
    <my-title title="護理站及床位管理" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="護理站">
          <q-select
            v-bind="QSelectProps"
            v-model="search.NursingStation"
            :options="nursingStationItems"
            option-label="StationName"
            option-value="StationId"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="房號">
          <q-input v-bind="QInputProps" v-model="search.Room" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位號碼">
          <q-input v-bind="QInputProps" v-model="search.Bed" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="科別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Area"
            :options="departmentItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="所在樓別">
          <q-input v-bind="QInputProps" v-model="search.Floor" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" icon="add" color="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Id"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetHospitalBed">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getHospitalBed, getBedStatusDropdown, getDepartmentDropdown, getNursingStation } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/HospitalBedEditItem.vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import numberFormat from 'utils/numberFormat.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'AreaName', label: '科別', field: 'AreaName', align: 'left' },
  { name: 'NursingStation', label: '護理站代碼', field: 'NursingStation', align: 'left' },
  { name: 'NursingStationName', label: '護理站名稱', field: 'NursingStationName', align: 'left' },
  { name: 'Floor', label: '所在樓別', field: 'Floor', align: 'left' },
  { name: 'Room', label: '房號', field: 'Room', align: 'left' },
  { name: 'Bed', label: '床位號碼', field: 'Bed', align: 'left' },
  { name: 'HealthBedName', label: '健保性質', field: 'HealthBedName', align: 'left' },
  { name: 'BedTypeName', label: '床位類別', field: 'BedTypeName', align: 'left' },
  { name: 'BedLevelName', label: '床位等級', field: 'BedLevelName', align: 'left' },
  { name: 'BedPrice', label: '房價', field: (row) => numberFormat(row.BedPrice), align: 'right' },
  { name: 'MakeUpPrice', label: '差額', field: (row) => numberFormat(row.MakeUpPrice), align: 'right' },
  {
    name: 'BedStatus',
    label: '使用狀態',
    field: (row) => bedStatusItems.value.find(({ No }) => No === row.BedStatus)?.Name,
    align: 'left',
  },
]

const tableLoading = ref(false)
const rows = ref([])
const GetHospitalBed = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getHospitalBed(query)
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
  NursingStation: null,
  Room: null,
  Bed: null,
  Area: null,
  Floor: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'NursingStation':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'Bed':
          case 'Area':
          case 'Floor':
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

const sortBy = ref([['Bed asc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetHospitalBed()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetHospitalBed()
}

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetHospitalBed()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetHospitalBed()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetHospitalBed()
    })
}

const bedStatusItems = ref([])
const GetBedStatusList = async () => {
  try {
    const res = await getBedStatusDropdown()
    bedStatusItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const departmentItems = ref([])
const GetDepartmentList = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const nursingStationItems = ref([])
const GetNursingStationList = async () => {
  try {
    const res = await getNursingStation()
    nursingStationItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetHospitalBed()
  GetBedStatusList()
  GetDepartmentList()
  GetNursingStationList()
}
init()
</script>

