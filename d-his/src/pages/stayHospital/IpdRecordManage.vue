<template>
  <q-page>
    <my-title title="住院病人查詢"></my-title>

    <div class="p-2">
      <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" v-model="search['Patient/PersonId']" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper data-group="1" label="科別">
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
                    <div v-html="scope.opt.filterLabel || `${scope.opt.No} - ${scope.opt.Name}`"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
      </my-search-area>

      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="IpdId" :pagination="pagination" :loading="tableLoading">
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIpdRecord"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { getIpdRecord, getDepartmentDropdown } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { genderCodeItems } from 'utils/options.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()

const columns = reactive([
  { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'left' },
  { name: 'BedName', label: '病床號', field: 'BedName', align: 'left' },
  { name: 'PatientName', label: '姓名', field: (row) => row.Patient.Person.Name, align: 'left' },
  { name: 'GenderCode', label: '性別', field: (row) => genderCodeItems.find((item) => item.value === row.Patient.Person.GenderCode)?.label, align: 'left' },
  { name: 'BirthDate', label: '生日', field: (row) => row.Patient.Person.BirthDate?.substring(0, 10), align: 'left' },
  { name: 'PersonId', label: '身分證號', field: (row) => row.Patient.PersonId, align: 'left' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'left' },
  { name: 'IpdDate', label: '入院日', field: (row) => row.IpdDate?.substring(0, 10), align: 'left' },
  { name: '入院診斷', label: '入院診斷', field: '入院診斷', align: 'left' },
  { name: 'AttendingDocName', label: '醫師', field: 'AttendingDocName', align: 'left' },
  { name: 'BedTypeName', label: '床位類別', field: 'BedTypeName', align: 'left' },
  { name: 'IpdDischargeDate', label: '出院日', field: (row) => row.IpdDischargeDate?.substring(0, 10), align: 'left' },
])

const tableLoading = ref(false)
const rows = ref([])
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

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  'Patient/PersonId': null,
  'Patient/Person/Name': null,
  DepartmentId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'Patient/PersonId':
        case 'Patient/Person/Name':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'DepartmentId':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')

  return !!str ? str + ` and Status eq '2'` : `Status eq '2'`
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIpdRecord()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIpdRecord()
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

const init = async () => {
  GetIpdRecord()
  GetDepartmentDropdown()
}
init()
</script>

