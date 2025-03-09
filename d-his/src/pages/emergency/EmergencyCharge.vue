<template>
  <q-page ref="pageRef" class="p-2">
    <my-title>
      急診批價作業
      <div class="flex gap-1">
        <ReadHealthyCardBtn class="header-btn" dense unelevated @read="onReadCard"></ReadHealthyCardBtn>
      </div>
    </my-title>

    <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper label="身分證號">
        <q-select
          v-bind="QSelectProps"
          v-model="search.personId"
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
          v-model="search.patientId"
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
          v-model="search.patientName"
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
          <my-input-wrapper label="出生日期" key="出生日期">
            <q-input v-bind="QInputProps" v-model="search.birthDate" @keydown.enter="searchSubmit"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="科別" key="科別">
            <q-select
              v-bind="QSelectProps"
              v-model="search.departmentNo"
              :options="specialtyDropdown"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              @update:model-value="searchSubmit"
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="醫生" key="醫生">
            <q-select
              v-bind="QSelectProps"
              v-model="search.doctorId"
              :options="doctorDropdown"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              @update:model-value="searchSubmit"
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="看診日期" key="看診日期" range-input>
            <template #range-input-0>
              <my-date-input
                v-bind="QInputProps"
                v-model="search.startDate"
                @keydown.enter="searchSubmit"
                @date-select="searchSubmit"
              ></my-date-input>
            </template>
            <template #range-input-1>
              <my-date-input
                v-bind="QInputProps"
                v-model="search.endDate"
                @keydown.enter="searchSubmit"
                @date-select="searchSubmit"
              ></my-date-input>
            </template>
          </my-input-wrapper>
          <my-input-wrapper label="看診時段" key="看診時段">
            <q-select
              v-bind="QSelectProps"
              v-model="search.opdTime"
              :options="['上午', '下午', '夜間']"
              @update:model-value="searchSubmit"
            ></q-select>
          </my-input-wrapper>
          <q-option-group
            class="flex items-center"
            v-model="search.chargeStatus"
            dense
            :options="[
              { label: '完成醫囑(未批價)', value: '6' },
              { label: '批價完成', value: '8' },
            ]"
            @update:model-value="searchSubmit"
          ></q-option-group>
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
          <q-btn
            color="edit"
            @click="toChargingThePatient(row)"
            label="批價"
            unelevated
            dense
            v-if="search.chargeStatus === '6'"
          ></q-btn>
          <q-btn color="edit" @click="GetExportReceipt(row)" label="補印收據" unelevated dense v-else></q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-ChronicNote="{ col, row }">
        <q-td :props="{ col }">
          <q-icon :name="row.ChronicNote ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetCharge"></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import { getCharge, getDepartmentDropdown, getDoctorPersonIdDropdown, getPatient, getExportReceipt } from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar, scroll } from 'quasar'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useRouter } from 'vue-router'

import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'
import dayjs from 'dayjs'

const $q = useQuasar()
const router = useRouter()
const isMoreFilter = ref(false)
const pageRef = ref()

const chargeColumns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'OpdDatetime', label: '看診日期', field: (row) => row.OpdDatetime.substring(0, 10), align: 'left' },
  { name: 'TimeSlotName', label: '看診時段', field: (row) => row.RoomBooking.TimeSlotName, align: 'left' },
  { name: 'RoomName', label: '診間', field: (row) => row.RoomBooking.RoomName, align: 'left' },
  { name: 'Seq', label: '看診號', field: (row) => row.RoomBooking.Seq, align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: (row) => row.RoomBooking.Patient.PatientId, align: 'left' },
  { name: 'Name', label: '病患姓名', field: (row) => row.RoomBooking.Patient.Person.Name, align: 'left' },
  { name: 'ReceiptNo', label: '收據號碼', field: (row) => row.OpdCharge.ReceiptNo, align: 'left' },
  { name: 'CardSerial', label: '健保卡序', field: (row) => row.RoomBooking.CardSerial, align: 'left' },
  { name: 'ChargeStatus', label: '批價狀況', field: (row) => row.OpdCharge.ChargeStatus, align: 'left' },
  { name: 'ChronicNote', label: '慢箋', field: (row) => row.OpdCharge.ChronicNote, align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetCharge = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      ...search,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getCharge(query)
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
  patientId: null,
  personId: null,
  patientName: null,
  birthDate: null,
  startDate: dayjs(new Date()).add(-1, 'day').format('YYYY-MM-DD'),
  endDate: dayjs(new Date()).format('YYYY-MM-DD'),
  opdTime: null,
  departmentNo: null,
  doctorId: null,
  chargeStatus: '6',
  isEr: true,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([['CreateDatetime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = async () => {
  pagination.value.page = 1
  await GetCharge()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetCharge()
}

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
    search.personId = data.PersonId
    router.push({ name: 'EmergencyChargingThePatient', query: { PersonId: data.PersonId } })
  }
}

const specialtyDropdown = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    if (res.status === 200) {
      specialtyDropdown.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const doctorDropdown = ref([])
const GetDepDocDropdown = async () => {
  try {
    const res = await getDoctorPersonIdDropdown()
    if (res.status === 200) {
      doctorDropdown.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const toChargingThePatient = (row) => {
  router.push({ name: 'EmergencyChargingThePatient', query: { PersonId: row.RoomBooking.Patient.PersonId } })
}

const GetExportReceipt = async (row) => {
  try {
    const res = await getExportReceipt(row.OpdId)

    if (res.status === 200) {
      const a = document.createElement('a')
      a.setAttribute('href', res.data)
      a.setAttribute('target', '_blank')
      a.click()
    }
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  GetCharge()
  GetDepartmentDropdown()
  GetDepDocDropdown()
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

