<template>
  <q-page>
    <my-title>住院報到</my-title>
    <div class="p-2">
      <my-search-area gridCols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="病歷號"
          ><q-input v-bind="QInputProps" v-model="search.PatientId"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="身分證字號"
          ><q-input v-bind="QInputProps" v-model="search['Patient/PersonId']"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="姓名"
          ><q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="科別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.DepartmentId"
            :options="departmentFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onDepartmentFilter"
            @input-value="filterLoading = true"
            @update:model-value="searchSubmit"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper data-group="1" class="col-span-2" label="預計入院日" range-input>
          <template #range-input-0>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.IpdPreDateStart"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
          <template #range-input-1>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.IpdPreDateEnd"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
        </my-input-wrapper>
        <template #btn-expand>
          <q-btn unelevated class="bg-[#BB2192] text-white" icon="refresh" label="掃描病患條碼"></q-btn>
        </template>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="tableLoading"
        :pagination="pagination"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn
              class="mr-1"
              color="edit"
              @click="toEdit(row)"
              label="報到"
              unelevated
              dense
              :disable="row.Status === '2'"
            ></q-btn>
          </q-td>
        </template>

        <template #bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="GetIpdRecord"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/IpdRecordManageEditItem.vue'
import dayjs from 'dayjs'

// api
import { getIpdRecord, getDepartmentDropdown } from 'api'

// utils
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter'
import setSearchQuery from 'utils/setSearchQuery'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()

const columns = computed(() => {
  return [
    { name: 'action', label: '操作', align: 'center', field: 'action' },
    { name: 'IpdPreDate', label: '(預計)入院日', align: 'center', field: (row) => row.IpdPreDate?.substring(0, 10) },
    { name: 'PatientId', label: '病歷號', align: 'center', field: (row) => row.Patient.PatientId },
    { name: 'PatientName', label: '姓名', align: 'center', field: (row) => row.Patient.Person.Name },
    { name: 'PersonId', label: '身分證字號', align: 'center', field: (row) => row.Patient.PersonId },
    { name: 'AttendingDocName', label: '主治醫師', align: 'center', field: 'AttendingDocName' },
    { name: 'DepartmentName', label: '科別', align: 'center', field: 'DepartmentName' },
    { name: 'IdentityName', label: '病患身分', align: 'center', field: 'IdentityName' },
    { name: 'Status', label: '狀態', align: 'center', field: 'StatusName' },
  ]
})

const rows = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

// $orderBy參數
const sortBy = ref([])

const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

// $filter參數
const initData = {}

initData.search = {
  IpdPreDateStart: null,
  IpdPreDateEnd: null,
  'Patient/PersonId': null,
  'Patient/Person/Name': null,
  PatientId: null,
  DepartmentId: null,
  hasStatus: false,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'IpdPreDateStart':
          return setOdataFilter({ key: 'IpdPreDate', value: encodeURIComponent(dayjs(value).format()), operator: 'ge' })
        case 'IpdPreDateEnd':
          return setOdataFilter({
            key: 'IpdPreDate',
            value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
            operator: 'lt',
          })
        case 'Patient/PersonId':
        case 'Patient/Person/Name':
        case 'PatientId':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'DepartmentId':
          return setOdataFilter({ key, value, operator: 'eq' })
        case 'hasStatus': {
          const statusStr = value ? setOdataFilter({ key: 'Status', value: '2', operator: 'eq' }) : null
          return `(${!!statusStr ? statusStr + ` or Status eq '1'` : `Status eq '1'`})`
        }
      }
    })
    .join(' and ')

  return str
})

const tableLoading = ref(false)

// 表單請求Funtion
const GetIpdRecord = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIpdRecord(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const filterLoading = ref(false)
const departmentItems = ref([])
const departmentFilterKeys = ['No', 'Name']
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    if (res.data) departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const { filterItems: departmentFilterItems, filterHandler: onDepartmentFilter } = useFilter(
  { items: departmentItems, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const searchSubmit = () => {
  pagination.value.page = 1
  GetIpdRecord()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIpdRecord()
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.IpdId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetIpdRecord()
    })
}

const init = async () => {
  await GetIpdRecord()
  await GetDepartmentDropdown()
}

init()
</script>

