<template>
  <div>
    <!-- (目前 2023-03-08 日班 黃曉琪 有資料 ) -->
    <div class="px-2">
      <div class="changeShift grid grid-cols-12 gap-2">
        <!-- 左側 -->
        <div class="info col-span-3">
          <div class="title flex items-center">
            <i class="pi pi-file"></i>
            <div class="text-blue" style="font-size: 18px">病人資訊</div>
            <div class="ml-2" v-if="patientsDataCurrent">
              {{ patientsDataCurrent?.Bed ? `床號: ${patientsDataCurrent?.Bed}` : '' }}
              {{ patientsDataCurrent?.PatientId ? `| ${patientsDataCurrent?.PatientId}` : '' }}
              {{ patientsDataCurrent?.PatientName ? `| ${patientsDataCurrent?.PatientName}` : '' }}
              {{ patientsDataCurrent?.Gender ? `| ${patientsDataCurrent?.Gender}` : '' }}
              {{ patientsDataCurrent?.Age ? `| ${patientsDataCurrent?.Age} 歲` : '' }}
            </div>
          </div>
          <div class="flex w-full items-center my-2">
            <div class="text-white text-xl font-bold">護理紀錄:</div>
            <div class="grow flex justify-end items-center">
              <q-btn
                unelevated
                dense
                class="mr-1"
                size="sm"
                color="white text-black"
                @click="lastPatient()"
                :disable="leftInfoLoading || !patientsDataCurrent"
              >
                <q-icon name="chevron_left" />上一位病患
              </q-btn>
              <q-btn
                unelevated
                dense
                class="ml-1"
                size="sm"
                color="white text-black"
                @click="nextPatient()"
                :disable="leftInfoLoading || !patientsDataCurrent"
              >
                下一位病患<q-icon name="chevron_right" />
              </q-btn>
              <q-btn
                class="ml-2"
                size="md"
                color="green"
                label="新增護理記錄"
                dense
                unelevated
                @click.prevent="addNewRecord"
                :disable="leftInfoLoading || !patientsDataCurrent"
              ></q-btn>
            </div>
          </div>
          <div class="subContent">
            <q-spinner color="primary" class="m-auto mt-10" size="5.5em" v-if="leftInfoLoading"></q-spinner>
            <div class="w-full" v-else>
              <div class="newAdd box" v-if="addingNewRecord">
                <p class="record-bar">
                  <span
                    >日期: {{ toAddRecordItem.NoteDate?.substring(0, 10) }}
                    {{ toAddRecordItem.NoteDate?.substring(11, 16) }}</span
                  >
                  <span>護理師: {{ waitShiftInfo.nursingStaffName }}</span>
                  <span
                    >狀態:
                    <select v-model="toAddRecordItem.PatientStatus">
                      <option value="0">正常作息</option>
                      <option value="1">禁止訪客</option>
                      <option value="2">病危通知</option>
                      <option value="3">準備出院</option>
                      <option value="5">隔離</option>
                    </select>
                  </span>
                </p>
                <textarea
                  class="textwrapper"
                  name=""
                  id=""
                  cols="2"
                  rows="10"
                  v-model="toAddRecordItem.Note"
                ></textarea>
                <div class="rightAlign">
                  <a href="javascript:;" class="removeRecord" @click.prevent="addingNewRecord = false">取消</a>
                  <a href="javascript:;" class="saveRecord" @click.prevent="saveRecord">儲存</a>
                </div>
              </div>
              <div v-for="(v, i) in recordData" class="box" :key="i">
                <p class="record-bar">
                  <span>日期: {{ v.NoteDate?.substring(0, 10) }} {{ v.NoteDate?.substring(11, 16) }}</span>
                  <span>護理師: {{ v.NursingStaffName }}</span>
                  <span :class="v.PatientStatus > 0 ? 'text-red' : ''">狀態: {{ v.PatientStatusName }}</span>
                  <q-icon
                    name="open_with"
                    size="md"
                    color="blue"
                    class="cursor-pointer ml-auto rotate-45"
                    @click="expandContent(v, 'read', v.note)"
                  ></q-icon>
                </p>
                <div class="textSaved">
                  {{ v.Note }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 中間 -->
        <div class="list col-span-6" :class="!hasTakeOver ? 'bg-[#0099A4]' : 'bg-[#BE8024]'">
          <div class="title flex items-center">
            <span class="text-white" style="font-size: 18px" v-if="!hasTakeOver">護理接班:</span>
            <span class="text-white" style="font-size: 18px" v-else>護理交班:</span>
            <q-space></q-space>
            <div class="flex items-center justify-end gap-2">
              <my-input-wrapper label="日期">
                <my-date-input
                  v-bind="QInputProps"
                  v-model="waitShiftInfo.shiftDate"
                  @update:model-value="GetNursingAllBedList()"
                  readonly
                >
                </my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="班別">
                <q-select
                  class="flex items-center"
                  v-bind="QSelectProps"
                  v-model="waitShiftInfo.timeSlotNo"
                  :options="stayHospitalTimeSlotOptions"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                  :clearable="false"
                  @update:model-value="GetNursingAllBedList()"
                >
                </q-select>
              </my-input-wrapper>
              <my-input-wrapper :label="!hasTakeOver ? '接班護理師姓名' : '交班護理師姓名'">
                <q-input v-bind="QInputProps" v-model="waitShiftNurseData.Name" readonly></q-input>
              </my-input-wrapper>
            </div>
          </div>
          <q-table
            v-bind="QTableProps"
            class="w-full n-table my-2"
            :columns="waitShiftColumns"
            :rows="waitShiftRows"
            row-key="IpdId"
            v-model:selected="tableSelected"
            :rows-per-page-options="[0]"
            :loading="allBedListLoading"
          >
            <template v-slot:no-data>
              <div class="full-width row flex-center">
                <q-icon color="red" size="2rem" name="warning"></q-icon>
                <span class="ml-2 text-xl text-red-600"> 此登入者未在護理站排班或負責的病床無病患 </span>
              </div>
            </template>
            <template #body-cell-PreAssignItem="{ col, row, rowIndex }">
              <q-td :props="{ col }">
                <div class="flex flex-nowrap">
                  <div class="overflow-hidden text-ellipsis w-[320px]">
                    {{ row.PreAssignItem }}
                  </div>
                  <q-icon
                    name="open_with"
                    size="md"
                    color="blue"
                    class="cursor-pointer rotate-45"
                    @click="expandContent(row, 'read', row.PreAssignItem)"
                  ></q-icon>
                </div>
              </q-td>
            </template>
            <template #body-cell-AssignItem="{ col, row, rowIndex }">
              <q-td :props="{ col }">
                <div class="flex flex-nowrap border-solid border border-blue-500 items-center">
                  <div class="overflow-hidden text-ellipsis w-[320px]">
                    {{ row.AssignItem }}
                  </div>
                  <q-icon
                    name="open_with"
                    size="md"
                    color="blue"
                    class="cursor-pointer rotate-45"
                    @click="expandContent(row, 'edit', row.AssignItem)"
                  ></q-icon>
                </div>
              </q-td>
            </template>
            <template #body-cell-action="{ col, row }">
              <q-td :props="{ col }">
                <q-btn color="deep-purple" label="檢閱" dense unelevated @click="viewDetails(row)"></q-btn>
              </q-td>
            </template>
            <template #body-cell-Receive="{ col, row }">
              <q-td :props="{ col }">
                <q-checkbox
                  dense
                  unelevated
                  v-model="row.Receive"
                  @update:model-value="toggleShiftCheck(row)"
                ></q-checkbox>
              </q-td>
            </template>
          </q-table>
          <div class="w-full my-1 flex justify-end">
            <q-btn class="mr-2" color="indigo" label="確認接班" @click="confirmTakeOver()" v-if="!hasTakeOver"></q-btn>
            <q-btn class="mr-2" color="indigo" label="儲存交班紀錄" @click="confirmShift()" v-else></q-btn>
          </div>
        </div>
        <!-- 右側 -->
        <div class="record col-span-3">
          <!-- 接班紀錄查詢 -->
          <div>
            <div class="title flex">
              <div class="text-white" style="font-size: 18px">接班紀錄查詢:</div>
            </div>
            <div class="searchArea">
              <div class="w-full mb-2">
                <my-input-wrapper label="接班日期" class="text-white">
                  <my-date-input v-bind="QInputProps" v-model="searchTotalRecord.ReceiveStartDate"> </my-date-input>
                </my-input-wrapper>
              </div>
              <div class="w-full mb-2">
                <my-input-wrapper label="交班班別">
                  <q-select
                    class="flex items-center"
                    v-bind="QSelectProps"
                    v-model="searchTotalRecord.TimeSlotNo_ByTakeOver"
                    :options="stayHospitalTimeSlotOptions"
                    option-label="Name"
                    option-value="No"
                    map-options
                    emit-value
                  >
                  </q-select>
                </my-input-wrapper>
              </div>
              <div class="w-full mb-2">
                <BedSelection
                  labelName="床號"
                  v-model:selectedData="takeOverBedData"
                  useInput
                  @update:selected-data="searchTotalRecord.BedId = takeOverBedData?.Id"
                ></BedSelection>
              </div>
              <div class="w-full mb-2">
                <NurseSelection
                  :key="nurseOptions.length"
                  labelName="交班護理師"
                  :options="nurseOptions"
                  v-model:selectedNurseData="searchTakeOverRecord_PreNurseData"
                  useInput
                  @update:selected-nurse-data="
                    searchTotalRecord.PreNursingStaffId = searchTakeOverRecord_PreNurseData?.AccountNo
                  "
                ></NurseSelection>
              </div>
              <div class="w-full mb-2">
                <NurseSelection
                  :key="nurseOptions.length"
                  labelName="接班護理師"
                  :options="nurseOptions"
                  v-model:selectedNurseData="searchTakeOverRecord_NurseData"
                  useInput
                  @update:selected-nurse-data="
                    searchTotalRecord.NursingStaffId = searchTakeOverRecord_NurseData?.AccountNo
                  "
                ></NurseSelection>
              </div>
              <div class="ns-btn-blk">
                <a class="ns-btn clear" href="javascript:;" @click.prevent="clearSearchTakeOverRecord()">
                  <i class="pi pi-eraser cus-size-12"></i> 清除查詢
                </a>
                <a class="ns-btn search" href="javascript:;" @click.prevent="GetTakeOverRecord()">
                  <i class="pi pi-search cus-size-12"></i> 進行查詢
                </a>
              </div>
            </div>
          </div>
          <!-- 交班紀錄查詢 -->
          <div>
            <div class="title flex">
              <div class="text-white" style="font-size: 18px">交班紀錄查詢:</div>
            </div>
            <div class="searchArea">
              <div class="w-full mb-2">
                <my-input-wrapper label="交班日期">
                  <my-date-input v-bind="QInputProps" v-model="searchTotalRecord.ShiftStartDate"> </my-date-input>
                </my-input-wrapper>
              </div>
              <div class="w-full mb-2">
                <my-input-wrapper label="交班班別">
                  <q-select
                    class="flex items-center"
                    v-bind="QSelectProps"
                    v-model="searchTotalRecord.TimeSlotNo_ByShift"
                    :options="stayHospitalTimeSlotOptions"
                    option-label="Name"
                    option-value="No"
                    map-options
                    emit-value
                  >
                  </q-select>
                </my-input-wrapper>
              </div>
              <div class="w-full mb-2">
                <BedSelection
                  labelName="床號"
                  v-model:selectedData="shiftBedData"
                  useInput
                  @update:selected-data="searchTotalRecord.BedId = shiftBedData?.Id"
                ></BedSelection>
              </div>
              <div class="w-full mb-2">
                <NurseSelection
                  :key="nurseOptions.length"
                  labelName="交班護理師"
                  :options="nurseOptions"
                  v-model:selectedNurseData="searchShiftRecord_NurseData"
                  useInput
                  @update:selected-nurse-data="
                    searchTotalRecord.NursingStaffId = searchShiftRecord_NurseData?.AccountNo
                  "
                ></NurseSelection>
              </div>
              <div class="w-full mb-2">
                <NurseSelection
                  :key="nurseOptions.length"
                  labelName="接班護理師"
                  :options="nurseOptions"
                  v-model:selectedNurseData="searchShiftRecord_NextNurseData"
                  useInput
                  @update:selected-nurse-data="
                    searchTotalRecord.NextNursingStaffId = searchShiftRecord_NextNurseData?.AccountNo
                  "
                ></NurseSelection>
              </div>
              <div class="ns-btn-blk">
                <a class="ns-btn clear" href="javascript:;" @click.prevent="clearSearchShiftRecord()">
                  <i class="pi pi-eraser cus-size-12"></i> 清除查詢
                </a>
                <a class="ns-btn search" href="javascript:;" @click.prevent="GetShiftRecord()">
                  <i class="pi pi-search cus-size-12"></i> 進行查詢
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { date, useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep, has } from 'lodash'
import {
  getIpdNursingNote,
  postIpdNursingNote,
  getIpdNursingShift,
  getNursingAllBedList,
  postNursingAllBedList,
  getIpdEmployeeList,
} from 'api'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import setSearchQuery from 'src/utils/setSearchQuery'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { useAuthStore } from 'stores/auth'
dayjs.extend(isSameOrAfter)

import NurseSelection from 'components/type-selection/NurseSelection.vue'
import BedSelection from 'components/type-selection/BedSelection.vue'
import ConfirmDialog from 'components/ConfirmDialog.vue'
import NurseRecordDialog from './components/NurseRecordDialog.vue'
import TakeOverRecordDialog from './components/TakeOverRecordDialog.vue'
import ShiftRecordDialog from './components/ShiftRecordDialog.vue'

const $q = useQuasar()

// 中間的資料 和變數
const initWaitShiftColumns = ref([
  {
    name: 'Bed',
    label: '床號',
    field: 'Bed',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'PatientId',
    label: '病歷號',
    field: 'PatientId',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'PatientName',
    label: '病患姓名',
    field: 'PatientName',
    align: 'center',
    headerClasses: 'whitespace-nowrap  sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'action',
    label: '護理紀錄',
    field: 'action',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'PreNursingStaffName',
    label: '交班護理師',
    field: 'PreNursingStaffName',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'PreAssignItem',
    label: '接辦事項',
    field: 'PreAssignItem',
    align: 'center',
    headerClasses: 'overflow-hidden text-ellipsis whitespace-nowrap min-w-[320px] sticky top-0 z-10 ',
  },
  {
    name: 'Receive',
    label: `接班確認`,
    field: 'Receive',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'AssignItem',
    label: '交辦事項',
    field: 'AssignItem',
    align: 'center',
    headerClasses: 'overflow-hidden text-ellipsis whitespace-nowrap min-w-[320px] sticky top-0 z-10 ',
  },
  {
    name: 'NextNursingStaffName',
    label: '接班護理師',
    field: 'NextNursingStaffName',
    align: 'center',
    headerClasses: 'whitespace-nowrap sticky top-0 z-10 ',
    classes: 'whitespace-nowrap',
  },
])
const waitShiftColumns = computed(() => {
  if (!hasTakeOver.value) {
    return initWaitShiftColumns.value.filter((item) => {
      return item.name !== 'NextNursingStaffName' && item.name !== 'AssignItem' && item.name !== 'Shifted'
    })
  } else {
    return initWaitShiftColumns.value.filter((item) => {
      return item.name !== 'PreNursingStaffName' && item.name !== 'Receive'
    })
  }
})
const waitShiftRows = ref([])

const authStore = useAuthStore()
const waitShiftNurseData = ref({
  AccountNo: authStore.userData.No,
  Name: authStore.userData.Name,
})
const stayHospitalTimeSlotOptions = ref([
  { No: '1', Name: '日班' },
  { No: '2', Name: '小夜班' },
  { No: '3', Name: '大夜班' },
])
const nowTime = () => {
  const nowDay = dayjs().format('YYYY-MM-DD')
  if (dayjs(nowDay + '16:00').isSameOrAfter(dayjs())) {
    return '1'
  } else if (dayjs(nowDay + '24:00').isSameOrAfter(dayjs())) {
    return '2'
  } else {
    return '3'
  }
}
const waitShiftInfo = ref({
  nursingStaffId: authStore.userData.No,
  nursingStaffName: authStore.userData.Name,
  shiftDate: dayjs().format('YYYY-MM-DD'),
  timeSlotNo: nowTime(),
})

const nurseOptions = ref([])
//可選護士
const GetIpdEmployeeList = async () => {
  try {
    const res = await getIpdEmployeeList('?role=2')
    if (res.status === 200 || res.status === 204) {
      nurseOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const tableSelected = ref([])
//中間的function
// 獲取待交班病床表
const allBedListLoading = ref(false)
const GetNursingAllBedList = async () => {
  allBedListLoading.value = true
  waitShiftRows.value = []
  const query = setSearchQuery(waitShiftInfo.value)
  try {
    const res = await getNursingAllBedList(query)
    if (res.status === 200) {
      // 前端整理出需要的res Data
      waitShiftRows.value = res.data.map((item) => {
        if (!item.Receive) {
          item.Receive = false
        }
        return item
      })
      patientsDataCurrent.value = waitShiftRows.value[0]
      tableSelected.value = [waitShiftRows.value[0]]
      //判斷 切換顯示接班或交班模式
      changeHasTakeOver()

      if (waitShiftRows.value.length === 0) {
        recordData.value = []
      } else {
        GetIpdNursingNote(waitShiftRows.value[0].IpdId)
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    allBedListLoading.value = false
  }
}

const PostNursingAllBedList = async () => {
  const toShiftRows = cloneDeep(waitShiftRows.value)
  toShiftRows.forEach((item) => {
    item.Id = 0
    item.ShiftDatetime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  })
  try {
    const res = await postNursingAllBedList(toShiftRows)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: hasTakeOver.value ? '交班完成！' : '接班完成！',
        position: 'top',
      })
      GetNursingAllBedList()
    }
  } catch (error) {
    console.log(error)
  }
}
const viewDetails = async (row, rowIndex) => {
  tableSelected.value = [row]
  await GetIpdNursingNote(row.IpdId)
  patientsDataCurrentIndex.value = rowIndex
  patientsDataCurrent.value = row
}

const toggleShiftCheck = (row) => {
  if (row.Receive) {
    row.ReceiveDatetime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  } else {
    row.ReceiveDatetime = null
  }
}
const hasTakeOver = ref(false)
const changeHasTakeOver = () => {
  if (waitShiftRows.value.length === 0) {
    hasTakeOver.value = false
  } else {
    hasTakeOver.value = waitShiftRows.value.every((item) => {
      return item.Receive === true
    })
  }
}

const confirmTakeOver = () => {
  const hasNoCheck = waitShiftRows.value.some((item) => {
    return item.Receive === false
  })
  if (hasNoCheck) {
    alert('有病床未進行接班確認！')
    return
  } else {
    PostNursingAllBedList()
  }
}

const confirmShift = () => {
  const hasNoShiftNurse = waitShiftRows.value.some((item) => {
    return !item.NextNursingStaffName
  })
  if (hasNoShiftNurse) {
    alert('有病床無人接班！')
    // const dialog = $q
    //   .dialog({
    //     component: ConfirmDialog,
    //     componentProps: {
    //       text: '有病床無人接班，確定要儲存交班紀錄嗎？',
    //     },
    //   })
    //   .onOk(() => {
    //     PostNursingAllBedList()
    //     dialog.hide()
    //   })
  } else {
    waitShiftRows.value.forEach((item, index, arr) => {
      arr[index].Shift = true
    })
    console.log('test', waitShiftRows.value)
    PostNursingAllBedList()
  }
}

// 左邊的資料 和變數
const leftInfoLoading = ref(false)
const patientsDataCurrent = ref({})
const recordData = ref([])
const toAddRecordItem = ref({})
const addingNewRecord = ref(false)
const expandedNurseRecordItem = ref({
  NoteDate: null,
  NursingStaffName: null,
  PatientStatusName: null,
  Note: null,
})
const patientsDataCurrentIndex = ref(0)
//左邊的function
// 獲取病人資訊 護理紀錄
const GetIpdNursingNote = async (IpdId) => {
  const query = setSearchQuery({ $filter: `IpdId eq '${IpdId}'` })
  leftInfoLoading.value = true
  try {
    const res = await getIpdNursingNote(query)
    if (res.status === 200) {
      recordData.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  } finally {
    leftInfoLoading.value = false
  }
}
const PostIpdNursingNote = async (toAddData) => {
  leftInfoLoading.value = true
  try {
    const res = await postIpdNursingNote(toAddData)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '護理紀錄儲存成功！',
        position: 'top',
      })
      addingNewRecord.value = false
      await GetIpdNursingNote(patientsDataCurrent.value.IpdId)
    }
  } catch (error) {
    console.log(error)
  } finally {
    leftInfoLoading.value = false
  }
}
const lastPatient = () => {
  if (patientsDataCurrentIndex.value === 0) {
    patientsDataCurrentIndex.value = waitShiftRows.value.length - 1
  } else {
    patientsDataCurrentIndex.value = patientsDataCurrentIndex.value - 1
  }
  patientsDataCurrent.value = waitShiftRows.value[patientsDataCurrentIndex.value]
  tableSelected.value = [waitShiftRows.value[patientsDataCurrentIndex.value]]
  GetIpdNursingNote(patientsDataCurrent.value.IpdId)
}
const nextPatient = () => {
  if (patientsDataCurrentIndex.value === waitShiftRows.value.length - 1) {
    patientsDataCurrentIndex.value = 0
  } else {
    patientsDataCurrentIndex.value++
  }
  patientsDataCurrent.value = waitShiftRows.value[patientsDataCurrentIndex.value]
  tableSelected.value = [waitShiftRows.value[patientsDataCurrentIndex.value]]
  GetIpdNursingNote(patientsDataCurrent.value.IpdId)
}
const addNewRecord = () => {
  addingNewRecord.value = true
  toAddRecordItem.value = {
    Id: 0,
    IpdId: patientsDataCurrent.value.IpdId,
    Note: null,
    NoteDate: dayjs().format('YYYY-MM-DD HH:mm'), // dayjs(new Date()).format('YYYY-MM-DD hh:mm'),
    NursingStaffId: patientsDataCurrent.value.NursingStaffId,
    PatientStatus: null,
  }
}
const saveRecord = () => {
  const toAddData = cloneDeep(toAddRecordItem.value)
  PostIpdNursingNote(toAddData)
}
const expandContent = (row, type, text) => {
  const dialog = $q
    .dialog({
      component: NurseRecordDialog,
      componentProps: {
        type: type,
        patientsDataCurrent: patientsDataCurrent.value,
        expandedNurseRecordItem: row,
        recordText: text,
      },
    })
    .onOk((recordText) => {
      row.AssignItem = recordText
      dialog.hide()
    })
}

// 右邊的資料 和變數
//接班搜尋條件
const searchTakeOverRecord_NurseData = ref(null)
const searchTakeOverRecord_PreNurseData = ref(null)
const takeOverBedData = ref(null)
//交班搜尋條件
const searchShiftRecord_NurseData = ref(null)
const searchShiftRecord_NextNurseData = ref(null)
const shiftBedData = ref(null)
//交接班搜尋條件
const searchTotalRecord = ref({
  NursingStaffId: null,
  BedId: null,
  //接班搜尋條件
  TimeSlotNo_ByTakeOver: null,
  PreNursingStaffId: null,
  ReceiveStartDate: null,
  //交班搜尋條件
  TimeSlotNo_ByShift: null,
  NextNursingStaffId: null,
  ShiftStartDate: null,
})

const filter = computed(() => {
  return Object.entries(searchTotalRecord.value)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'TimeSlotNo_ByTakeOver':
        case 'TimeSlotNo_ByShift':
          return setOdataFilter({
            key: 'TimeSlotNo',
            value,
            operator: 'eq',
          })
        case 'BedId':
          return setOdataFilter({
            key: 'IpdRecord/BedId',
            value,
            operator: 'eq',
          })

        case 'ReceiveStartDate':
          return setOdataFilter({
            key: 'ReceiveDatetime',
            value: encodeURIComponent(dayjs(value).format()),
            operator: 'ge',
          })
        case 'ReceiveEndDate':
          return setOdataFilter({
            key: 'ReceiveDatetime',
            value: encodeURIComponent(dayjs(value).format()),
            operator: 'lt',
          })
        case 'ShiftStartDate':
          return setOdataFilter({
            key: 'ShiftDate',
            value: encodeURIComponent(dayjs(value).format()),
            operator: 'ge',
          })
        case 'ShiftEndDate':
          return setOdataFilter({
            key: 'ShiftDate',
            value: encodeURIComponent(dayjs(value).format()),
            operator: 'lt',
          })

        case 'PreNursingStaffId':
          return setOdataFilter({
            key: 'PreNursingStaffId',
            value,
            operator: 'contains',
          })
        case 'NextNursingStaffId':
          return setOdataFilter({
            key: 'NextNursingStaffId',
            value,
            operator: 'contains',
          })
        case 'NursingStaffId':
          return setOdataFilter({
            key: 'NursingStaffId',
            value,
            operator: 'contains',
          })
      }
    })
    .join(' and ')
})

//右邊的function
// 獲取接班記錄查詢結果
const GetTakeOverRecord = async () => {
  const dialog = $q
    .dialog({
      component: TakeOverRecordDialog,
      componentProps: {
        filter: filter.value,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}
// 獲取交班記錄查詢結果
const GetShiftRecord = async () => {
  const dialog = $q
    .dialog({
      component: ShiftRecordDialog,
      componentProps: {
        filter: filter.value,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

const clearSearchShiftRecord = () => {
  searchTotalRecord.value = {
    TimeSlotNo: null,
    NursingShiftStaffData: null,
    BedId: null,
    ShiftStartDate: null,
    ShiftEndDate: null,
  }
  searchShiftRecord_NurseData.value = null
  searchShiftRecord_NextNurseData.value = null
  shiftBedData.value = null
}
const clearSearchTakeOverRecord = () => {
  searchTotalRecord.value = {
    TimeSlotNo: null,
    NursingShiftStaffData: null,
    BedId: null,
    ShiftStartDate: null,
    ShiftEndDate: null,
  }
  searchTakeOverRecord_NurseData.value = null
  searchTakeOverRecord_PreNurseData.value = null
  takeOverBedData.value = null
}

const init = async () => {
  GetIpdEmployeeList()
  await GetNursingAllBedList()
}

init()
</script>

<style lang="scss" scoped>
.changeShift {
  // display: flex;
  // flex-direction: row;
  // flex-wrap: nowrap;
  // justify-content: flex-start;
  // align-content: flex-start;
  // align-items: flex-start;

  // box-sizing: border-box;
  // gap: 10px;

  // width: 100%;
  // min-width: 1280px;

  &* {
    box-sizing: border-box;
  }

  .info,
  .list,
  .record {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;

    min-height: calc(100vh - 180px);

    position: relative;
    padding: 5px;
    border-radius: 5px;
  }

  .info {
    // width: 400px;
    background: #873394;
  }

  .list {
    // width: calc(100% - 750px);
  }

  .record {
    // width: 350px;
    background: #859a3e;
  }

  .info {
    .title {
      width: 100%;
      font-size: 13px;
      font-weight: bold;

      height: 38px;
      line-height: 38px;
      background: #fef9e9;

      border-top-right-radius: 4px;
      border-top-left-radius: 4px;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      h3,
      i {
        color: #0080ff;
      }

      h3 {
        display: inline-block;
        margin-right: 4px;
        font-size: 18px;
        font-weight: bold;
      }

      span {
        font-weight: normal;
      }

      ul {
        display: inline-block;
      }

      li {
        display: inline-block;
        padding: 0 1px;

        &::before {
          content: ' | ';
          color: #999999;
          font-weight: normal;
        }

        &:nth-child(1) {
          &::before {
            content: '';
          }
        }
      }
    }

    .subTitle {
      h3 {
        display: inline-block;
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }

      .btn {
        display: inline-block;
        margin: auto 10px auto 0;
        padding: 0 2px;
        font-size: 12px;
        line-height: 18px;
        color: #000;
        border: #ccc 1px solid;
        background: #fff;

        cursor: pointer;

        i {
          font-size: 12px;
        }

        &:hover {
          box-shadow: #000000 1px 1px 3px;
          transform: scale(0.98);
          transition: all 0.1s 0.1s 0.1s linear;
        }
      }

      .addRecord {
        padding: 0 8px;
        color: #ffffff;
        font-size: 15px;
        line-height: 28px;
        background: #00a816;
        border-radius: 3px;
        border: #ffffff 1px solid;
        cursor: pointer;

        &:hover {
          box-shadow: #000000 1px 1px 3px;
          transform: scale(0.98);
          transition: all 0.1s 0.1s 0.1s linear;
        }
      }
    }

    .subContent {
      padding: 0 0 20px 0;
      width: 100%;
      height: calc(100% - 120px);

      background: #ffffff;

      position: relative;

      overflow-y: auto;

      .leftInfoLoading {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        margin-top: 35%;
      }

      .box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: flex-start;

        margin-bottom: 10px;
        padding: 0;
        width: 100%;
        border: #becce2 1px solid;

        box-shadow: #666666 0 1px 5px;

        &.newAdd {
          textarea {
            height: 105px;
            transition: all 1s 1s ease-in-out;
          }
        }

        .record-bar {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-content: flex-start;
          align-items: center;

          font-size: 13px;
          line-height: 30px;

          padding: 0 4px;
          width: 100%;

          border-bottom: #a4bde3 1px solid;
          background: #eeeeee;

          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          position: relative;

          > span {
            display: inline-block;
            margin-right: 5px;
          }

          .showAll {
            display: block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            color: #1f5ca2;

            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;

            margin-top: auto;
            margin-bottom: auto;

            cursor: pointer;

            > span {
              position: relative;
              display: block;
              width: 100%;
              height: 100%;

              > svg {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
                display: block;
              }
            }
          }
        }

        textarea {
          width: 100%;
          height: 65px;
          line-height: 20px;
          font-size: 13px;

          &.textwrapper {
            margin: 0;
            padding: 5px;
            text-align: left;
            background: #ffffff;
            border: none;
          }
        }

        .textSaved {
          width: 100%;
          height: 63px;
          line-height: 20px;
          font-size: 13px;

          margin: 0;
          padding: 5px;
          text-align: left;
          background: #ffffff;
          overflow: hidden;
        }

        .rightAlign {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-content: center;
          align-items: center;

          padding: 0 5px;
          width: 100%;
          height: 30px;

          border-top: #a4bde3 1px solid;
          background: #ffffff;
        }

        .saveRecord,
        .removeRecord {
          display: inline-block;
          margin-left: 4px;
          padding: 0 10px;
          color: #ffffff;
          font-size: 16px;
          line-height: 24px;
          background: #0085e5;
          border-radius: 3px;
          cursor: pointer;

          &:hover {
            box-shadow: #cccccc 1px 1px 3px;
            transform: scale(0.98);
            transition: all 0.1s 0.1s 0.1s linear;
          }
        }

        .removeRecord {
          background: #0085e5;
        }

        .removeRecord {
          background: #999999;
        }
      }
    }
  }

  .list {
    .title {
      width: 100%;
      font-size: 14px;
      font-weight: bold;

      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      h3 {
        display: inline-block;
        margin-top: -2px;
        margin-right: 4px;
        font-size: 18px;
        font-weight: bold;
      }
    }

    .n-filter {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: center;

      padding: 0 0 4px 0;
      width: 100%;

      gap: 6px;

      position: relative;

      .confirmShift {
        display: inline-block;
        padding: 0 12px;
        color: #ffffff;
        font-size: 16px;
        line-height: 34px;
        background: #001fb8;
        border-radius: 4px;
        border: #ffffff 1px solid;
        cursor: pointer;

        position: absolute;
        right: 0;

        &:hover {
          box-shadow: #000000 1px 1px 3px;
          transform: scale(0.98);
          transition: all 0.1s 0.1s 0.1s linear;
        }
      }
    }
    .n-table {
      // max-height: calc(100vh - (200px + 110px));
      max-height: 620px;
    }
  }

  .record {
    .title {
      width: 100%;
      font-size: 14px;
      font-weight: bold;

      height: 38px;
      line-height: 38px;

      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      h3 {
        display: inline-block;
        margin-top: -2px;
        margin-right: 4px;
        font-size: 18px;
        font-weight: bold;
        text-shadow: #4b5724 1px 1px 3px;
      }
    }

    .searchArea {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: stretch;

      padding: 0 0 20px 0;

      width: 100%;
      overflow-y: auto;

      .ns-input-wrapper {
        margin-bottom: 5px;
      }

      .ns-btn-blk {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-content: flex-end;
        align-items: center;

        padding: 2px 8px;
        width: 100%;
        gap: 8px;
      }

      .ns-btn {
        display: inline-block;
        line-height: 32px;

        padding: 0 12px;
        font-size: 15px;
        color: #ffffff;

        border: rgba(255, 255, 255, 0.7) 1px solid;
        border-radius: 3px;
        box-shadow: #666666 1px 1px 2px;

        cursor: pointer;

        &.clear {
          background: rgba(106, 106, 106, 1);
        }

        &.search {
          background: rgba(26, 115, 255, 1);
        }

        &:hover {
          transform: scale(0.99);
          filter: brightness(110%);
          transition: all 0.1 0.1 ease-in-out;
        }
      }
    }
  }

  .pi-cus-font {
    font-size: 12px;
    transform: scale(0.9);
    cursor: pointer;

    &:hover,
    &:active {
      transform: scale(1.1);
      color: #0080ff;
    }
  }
}
</style>

