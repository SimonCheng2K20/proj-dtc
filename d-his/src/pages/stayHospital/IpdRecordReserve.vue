<template>
  <q-page>
    <my-title title="預約名單管理"></my-title>

    <div class="p-2">
      <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
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
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" v-model="search['Patient/PersonId']" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keydown.enter="searchSubmit">
          </q-input>
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
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="IpdId"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn
              class="mr-1"
              color="negative"
              @click="toCancel(row)"
              label="取消預約"
              unelevated
              dense
              :disable="row.Status === '2'"
            ></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetIpdRecord"
          ></my-pagination>
        </template>
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
import dayjs from 'dayjs'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()

const columns = computed(() => {
  const arr = [
    { name: 'action', label: '操作', field: 'action', align: 'center' },
    { name: 'Check', label: '是否連絡', field: 'Check', align: 'center' },
    { name: 'PatientName', label: '姓名', field: (row) => row.Patient.Person.Name, align: 'center' },
    { name: 'PersonId', label: '身分證號', field: (row) => row.Patient.PersonId, align: 'center' },
    { name: 'Phone', label: '連絡電話', field: (row) => row.Patient.Person.Phone, align: 'center' },
    { name: 'Prefer', label: '病患床位意向', field: 'Prefer', align: 'center' },
    { name: 'IdentityName', label: '病患身分', field: 'IdentityName', align: 'center' },
    { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'center' },
    { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'center' },
    { name: 'AttendingDocName', label: '醫師', field: 'AttendingDocName', align: 'center' },
    { name: 'OpdDiagnosisIcd10', label: '入院診斷', field: 'OpdDiagnosisIcd10', align: 'center' },
    { name: 'IpdPreInDate', label: '預計入院日', field: (row) => row.IpdPreDate?.substring(0, 10), align: 'center' },
    { name: 'IpdPreOutDate', label: '預計出院日', field: (row) => row.IpdPreDate?.substring(0, 10), align: 'center' },
    { name: 'Note', label: '醫師備註', field: 'Note', align: 'center' },
    { name: 'Status', label: '狀態', field: 'StatusName', align: 'center' },
  ]

  if (search.hasStatus2)
    arr.splice(8, 0, {
      name: 'IpdDate',
      label: '實際入院日',
      field: (row) => row.IpdDate?.substring(0, 10),
      align: 'left',
    })

  return arr
})

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
  IpdPreDateStart: null,
  IpdPreDateEnd: null,
  'Patient/PersonId': null,
  'Patient/Person/Name': null,
  DepartmentId: null,
  hasStatus2: false,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'IpdPreDateStart':
            return filterArray.concat(
              setOdataFilter({ key: 'IpdPreDate', value: encodeURIComponent(dayjs(value).format()), operator: 'ge' })
            )
          case 'IpdPreDateEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'IpdPreDate',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'Patient/PersonId':
          case 'Patient/Person/Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'DepartmentId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'hasStatus2': {
            const statusStr = value ? setOdataFilter({ key: 'Status', value: '2', operator: 'eq' }) : null
            return filterArray.concat(`(${!!statusStr ? statusStr + ` or Status eq '1'` : `Status eq '1'`})`)
          }
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str
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

const toCancel = () => {
  alert('確定取消嗎?')
}

const init = async () => {
  GetIpdRecord()
  GetDepartmentDropdown()
}
init()
</script>

