<template>
  <q-page ref="pageRef" class="p-2">
    <my-title>
      住院批價作業
      <div class="flex gap-1">
        <ReadHealthyCardBtn class="header-btn" dense unelevated @read="onReadCard"></ReadHealthyCardBtn>
      </div>
    </my-title>

    <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper label="身分證號">
        <q-select
          v-bind="QSelectProps"
          v-model="search.PersonId"
          :options="patientFilterItems"
          option-label="PersonId"
          option-value="PersonId"
          use-input
          map-options
          emit-value
          @filter="(val, update) => onPatientFilterHandler(val, update, 'PersonId')"
          @update:model-value="searchSubmit"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <q-item-label v-else>
                  <div>找不到符合的資料</div>
                </q-item-label>
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
      <my-input-wrapper label="病歷號">
        <q-select
          v-bind="QSelectProps"
          v-model="search.PatientId"
          :options="patientFilterItems"
          option-label="PatientId"
          option-value="PatientId"
          use-input
          map-options
          emit-value
          @filter="(val, update) => onPatientFilterHandler(val, update, 'PatientId')"
          @update:model-value="searchSubmit"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <q-item-label v-else>
                  <div>找不到符合的資料</div>
                </q-item-label>
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
      <my-input-wrapper label="姓名">
        <q-select
          v-bind="QSelectProps"
          v-model="search.PatientName"
          :options="patientFilterItems"
          :option-label="(opt) => opt?.Person?.Name || opt"
          :option-value="(opt) => opt?.Person?.Name || opt"
          use-input
          map-options
          emit-value
          @filter="(val, update) => onPatientFilterHandler(val, update, 'Name')"
          @update:model-value="searchSubmit"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <q-item-label v-else>
                  <div>找不到符合的資料</div>
                </q-item-label>
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
      <transition name="more-search">
        <div class="col-span-full grid grid-cols-3 gap-2 overflow-hidden" v-show="isMoreFilter">
          <my-input-wrapper label="出院日期" key="出院日期">
            <my-date-input
              v-bind="QInputProps"
              v-model="search.IpdDischargeDate"
              @keydown.enter="searchSubmit"
            ></my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="出生日期" key="出生日期">
            <my-date-input
              v-bind="QInputProps"
              v-model="search.BirthDate"
              @keydown.enter="searchSubmit"
            ></my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="科別">
            <DepartmentSelection v-model="search.DepartmentId" @update:model-value="searchSubmit"></DepartmentSelection>
          </my-input-wrapper>
          <my-input-wrapper label="收據性質" key="收據性質">
            <q-option-group
              v-bind="QOptionProps"
              class="flex items-center"
              dense
              :options="receiptType"
            ></q-option-group>
          </my-input-wrapper>
          <my-input-wrapper label="繳費狀況" key="繳費狀況">
            <q-option-group
              v-bind="QOptionProps"
              class="flex items-center"
              v-model="search.ReceiptStatus"
              dense
              :options="payStatus"
            ></q-option-group>
          </my-input-wrapper>
        </div>
      </transition>

      <div class="col-span-full">
        <q-separator></q-separator>
        <q-btn class="w-full" unelevated @click="isMoreFilter = !isMoreFilter">
          <q-icon class="transition" :class="{ 'rotate-180': isMoreFilter }" name="keyboard_arrow_down"></q-icon>
          <span>進階搜尋條件</span>
        </q-btn>
      </div>
    </my-search-area>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="chargeColumns"
      row-key="OpdId"
      :pagination="pagination"
      :loading="tableLoading"
    >
      <template v-slot:body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn color="edit" @click="toChargingThePatientV2(row)" label="繳費" unelevated dense></q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-ChronicNote="{ col, row }">
        <q-td :props="{ col }">
          <q-icon :name="row.ChronicNote ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="pagination"
          v-on:update:model-value="GetIpdChargeList"
        ></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { getIpdChargeList, getPatient, getIpdRecordList } from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { QInputProps, QSelectProps, QTableProps, QOptionProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar, scroll } from 'quasar'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useRouter } from 'vue-router'

import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'
import DepartmentSelection from 'components/type-selection/DepartmentSelection.vue'
import dayjs from 'dayjs'

const $q = useQuasar()
const router = useRouter()
const isMoreFilter = ref(false)
const pageRef = ref()

const chargeColumns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  {
    name: 'IpdDischargeDate',
    label: '出院日期',
    field: (row) => (row.IpdDischargeDate ? row.IpdDischargeDate.substring(0, 10) : ''),
    align: 'left',
  },
  {
    name: 'IpdDate',
    label: '入院日期',
    field: (row) => (row.IpdDischargeDate ? row.IpdDate.substring(0, 10) : ''),
    align: 'left',
  },
  {
    name: 'Prepaid',
    label: '繳費日期(起)',
    field: (row) => row.PrepaidFrom.substring(0, 10),
    align: 'left',
  },
  {
    name: 'Prepaid',
    label: '繳費日期(迄)',
    field: (row) => row.PrepaidTo.substring(0, 10),
    align: 'left',
  },
  { name: 'IpdDays', label: '住院天數', field: (row) => row.IpdDays, align: 'left' },
  { name: 'BedNo', label: '床位號碼', field: (row) => row.BedNo, align: 'left' },
  { name: 'DepartmentName', label: '科別', field: (row) => row.DepartmentName, align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: (row) => row.PatientId, align: 'left' },
  { name: 'PatientName', label: '病患姓名', field: (row) => row.PatientName, align: 'left' },
  { name: 'ReceiptNo', label: '收據號碼', field: (row) => row.ReceiptNo, align: 'left' },
  { name: 'NhicardCode', label: '健保卡序', field: (row) => row.NhicardCode, align: 'left' },
  { name: 'ReceiptStatusName', label: '繳費狀況', field: (row) => row.ReceiptStatusName, align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIpdChargeList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIpdChargeList(query)
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
  PatientId: null,
  PersonId: null,
  PatientName: null,
  BirthDate: null,
  IpdDischargeDate: null,
  DepartmentNo: null,
  ReceiptStatus: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PatientId':
            return filterArray.concat(setOdataFilter({ operator: 'contains', key, value }))
          case 'PersonId':
          case 'PatientName':
          case 'DepartmentNo':
          case 'ReceiptStatus':
            return filterArray.concat(setOdataFilter({ operator: 'eq', key, value }))
          case 'BirthDate':
          case 'IpdDischargeDate':
            return filterArray.concat(setOdataFilter({ operator: 'contains', key, value }))
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

const searchSubmit = async () => {
  pagination.value.page = 1
  await GetIpdChargeList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIpdChargeList()
}

const receiptType = [
  { label: '出院暫結', value: '1' },
  { label: '出院繳費', value: '2' },
  { label: '全部', value: '3' },
]

const payStatus = [
  { label: '未繳費', value: '1' },
  { label: '完成繳費', value: '2' },
]

const filterLoading = ref(false)
let filterCount = 0 // 確定 API 返回的是最後一次的資料，避免第一次 GET 較第二次慢而帶入第一次資料的狀況
const patientItems = ref([])
const filterKeys = computed(() => {
  if (searchByKey.value === 'Name') return ['Person.Name']
  else return [searchByKey.value]
})
const searchByKey = ref(null)
const GetPatient = async (searchString, searchBy) => {
  filterCount++
  const selfFilterCount = filterCount
  searchByKey.value = searchBy
  try {
    const query = setSearchQuery({
      $filter: `contains(${searchBy === 'Name' ? 'Person/Name' : searchBy},'${searchString}')`,
    })
    const res = await getPatient(query)
    if (res.status === 200 && selfFilterCount === filterCount) {
      patientItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (selfFilterCount === filterCount) filterCount = 0
  }
}

const { filterItems: patientFilterItems, filterHandler: patientFilterHandler } = useFilter(
  { items: patientItems, filterKeys: filterKeys },
  () => {
    filterLoading.value = false
  }
)

const onPatientFilterHandler = async (val, update, key) => {
  if (!val) return

  filterLoading.value = true

  await GetPatient(val, key)

  patientFilterHandler(val, update)
}

const onReadCard = async (data) => {
  if (data) {
    search.PersonId = data.PersonId
    router.push({ name: 'ChargingThePatientV2', params: { PersonId: data.PersonId } })
  }
}

const toChargingThePatientV2 = async (row) => {
  router.push({ name: 'ChargingThePatientV2', params: { id: row.Id, ipdId: row.IpdId } })
}

const init = () => {
  GetIpdChargeList()
}
init()
</script>

<style lang="scss" scoped>
.more-search-enter-active,
.more-search-leave-active {
  @apply transition-[height];
  height: 88px;
}

.more-search-enter-from,
.more-search-leave-to {
  height: 0px;
}
</style>
