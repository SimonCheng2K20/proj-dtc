<template>
  <q-page class="p-2">
    <my-title>
      <div>{{ route.name === 'drugStore-clinicSearch' ? '門診藥局查詢' : '急診藥局查詢' }}</div>
      <q-space></q-space>
      <ReadHealthyCardBtn class="header-btn" @read="toReceive"></ReadHealthyCardBtn>
    </my-title>
    <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="就診日">
        <my-date-input
          v-bind="QInputProps"
          v-model="search.singleDate"
          @keydown.enter="searchSubmit"
          @date-select="searchSubmit"
        ></my-date-input>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號碼"
        ><q-input v-bind="QInputProps" v-model="search.patientId" @keydown.enter="searchSubmit"></q-input
      ></my-input-wrapper>
      <my-input-wrapper label="身分證號"
        ><q-input v-bind="QInputProps" v-model="search.personId" @keydown.enter="searchSubmit"></q-input
      ></my-input-wrapper>
      <my-input-wrapper label="病患姓名"
        ><q-input v-bind="QInputProps" v-model="search.patientName" @keydown.enter="searchSubmit"></q-input
      ></my-input-wrapper>

      <my-input-wrapper label="科別">
        <q-select
          v-bind="QSelectProps"
          v-model="search.departmentNo"
          :options="specialtyDropdown"
          option-label="Name"
          option-value="No"
          emit-value
          map-options
          @update:model-value="
            () => {
              GetRoomDropdown()
              searchSubmit()
            }
          "
        ></q-select>
      </my-input-wrapper>
      <my-input-wrapper label="醫師">
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
      <my-input-wrapper label="批價狀態" class="col-span-1">
        <q-option-group
          v-bind="QOptionProps"
          class="flex items-center"
          v-model="search.chargeStatus"
          dense
          :options="[
            { label: '批價完成(待領藥)', value: '8' },
            { label: '已領藥', value: '9' },
          ]"
          @update:model-value="searchSubmit"
        ></q-option-group>
      </my-input-wrapper>
      <transition name="more-search">
        <div class="col-span-full grid grid-cols-3 gap-2" v-show="isMoreFilter">
          <my-input-wrapper label="就診日期區間" range-input>
            <template #range-input-0>
              <my-date-input
                v-bind="QInputProps"
                v-model="search.startDate"
                @keydown.enter="searchSubmit"
                @date-select="searchSubmit(), (search.singleDate = null)"
              ></my-date-input>
            </template>
            <template #range-input-1>
              <my-date-input
                v-bind="QInputProps"
                v-model="search.endDate"
                @keydown.enter="searchSubmit"
                @date-select="searchSubmit(), (search.singleDate = null)"
              ></my-date-input>
            </template>
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
      :columns="columns"
      row-key="Id"
      :pagination="pagination"
      :loading="tableLoading"
    >
      <template v-slot:body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn
            class="mr-1"
            color="edit"
            @click="toReceive(row)"
            label="領藥"
            unelevated
            dense
            :disable="row.OpdCharge.ChargeStatus === '已領藥'"
          ></q-btn>
          <!-- <q-btn color="purple" @click="toPrint(row)" label="列印" unelevated dense></q-btn> -->
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="pagination"
          v-on:update:model-value="GetDrugStoreList"
        ></my-pagination>
      </template>
    </q-table>

    <iframe v-if="pdfSrc" ref="printRef" :src="pdfSrc" style="display: none"></iframe>
  </q-page>
</template>

<script setup>
import {
  getDrugStoreList,
  getErDrugStoreList,
  getDepartmentDropdown,
  getDoctorPersonIdDropdown,
  getRoomDropdown,
  getReceiveMedicinePdf,
} from 'api'
import { ref, reactive, watch, computed, nextTick } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps, QOptionProps } from 'utils/quasar-extends/base-props.js'
import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'
import InfoItem from './components/DrugStoreInfoItem.vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const printRef = ref()
const $q = useQuasar()
const route = useRoute()
const isMoreFilter = ref(false)

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[104px]' },
  {
    name: 'CreateDatetime',
    label: '就診日期',
    field: (row) => row.RoomBooking.CreateDatetime?.substring(0, 10),
    align: 'left',
  },
  { name: 'TimeSlotName', label: '時段', field: (row) => row.RoomBooking.TimeSlotName, align: 'left' },
  { name: 'PatientName', label: '病患姓名', field: (row) => row.RoomBooking.Patient.Person.Name, align: 'left' },
  { name: 'ReceiveMedicineNo', label: '領藥號碼', field: (row) => row.OpdCharge.ReceiveMedicineNo, align: 'center' },
  { name: 'PersonId', label: '身分證號', field: (row) => row.RoomBooking.Patient.PersonId, align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: (row) => row.RoomBooking.Patient.PatientId, align: 'left' },
  { name: 'DepartmentName', label: '科別', field: (row) => row.RoomBooking.DepartmentName, align: 'left' },
  { name: 'RoomName', label: '診間', field: (row) => row.RoomBooking.RoomName, align: 'left' },
  {
    name: 'OpdDiagnoses',
    label: '診斷(ICD-10/ICD-9)',
    field: (row) =>
      row.OpdDiagnoses[0]
        ? row.OpdDiagnoses[0].Icd10Code +
          ' - ' +
          (row.OpdDiagnoses[0].Icd10Cht ? row.OpdDiagnoses[0].Icd10Cht : row.OpdDiagnoses[0].Icd9Cht)
        : null,
    align: 'left',
  },
  {
    name: 'ChargeStatus',
    label: '批價狀態',
    field: (row) => row.OpdCharge.ChargeStatus,
    align: 'left',
  },
  {
    name: 'ReceiveMedicineDatetime',
    label: '領藥時間',
    field: (row) => row.OpdCharge.ReceiveMedicineDatetime,
    align: 'left',
  },
]

const tableLoading = ref(false)
const rows = ref([])
const GetDrugStoreList = async () => {
  if (search.singleDate !== null) {
    search.startDate = search.singleDate
    search.endDate = search.singleDate
  }
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      ...search,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $orderBy: orderBy.value,
    })

    const res = await (route.name === 'drugStore-clinicSearch' ? getDrugStoreList(query) : getErDrugStoreList(query))
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
  singleDate: dayjs(new Date()).format('YYYY-MM-DD'),
  startDate: null,
  endDate: null,
  timeSlotNo: null,
  departmentNo: null,
  doctorId: null,
  roomNo: null,
  patientId: null,
  personId: null,
  patientName: null,
  birthDate: null,
  chargeStatus: '8',
  receiveMedicineNo: null,
  formula: null,
}
const search = reactive(cloneDeep(initData.search))

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDrugStoreList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrugStoreList()
}

const toView = () => {
  const dialog = $q
    .dialog({
      component: InfoItem,
      componentProps: {
        editType: 'view',
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

const toReceive = (row) => {
  const dialog = $q
    .dialog({
      component: InfoItem,
      componentProps: {
        editType: 'receive',
        id: row.OpdId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDrugStoreList()
    })
}

const pdfSrc = ref(null)
const toPrint = async (row) => {
  const { data } = await GetReceiveMedicinePdf(row.OpdId)
  if (data) {
    pdfSrc.value = data
    await nextTick()
    printRef.value.contentWindow.print()
  }
}

const specialtyDropdown = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    specialtyDropdown.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const GetReceiveMedicinePdf = async (opdId) => {
  try {
    const res = await getReceiveMedicinePdf(opdId)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const doctorDropdown = ref([])
const GetDepDocDropdown = async () => {
  try {
    const res = await getDoctorPersonIdDropdown()
    doctorDropdown.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const roomItems = ref([])
const GetRoomDropdown = async () => {
  try {
    const query = setSearchQuery({ departmentNo: search.departmentNo })
    const res = await getRoomDropdown(query)
    roomItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetDrugStoreList()
  GetDepartmentDropdown()
  GetDepDocDropdown()

  watch(
    () => route.name,
    (val) => {
      if (val === 'drugStore-clinicSearch' || val === 'drugStore-emergencySearch') {
        init()
      }
    }
  )
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

