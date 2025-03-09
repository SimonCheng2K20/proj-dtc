<template>
  <q-page>
    <my-title title="護理站-醫師及護理人員週排班設定"></my-title>

    <my-aside>
      <div class="p-2">
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="護理站">
            <q-select
              v-bind="QSelectProps"
              v-model="search.StationId"
              :options="nursingStationItems"
              option-label="StationName"
              option-value="StationId"
              map-options
              @update:model-value="onStationIdSelect"
            ></q-select>
          </my-input-wrapper>
          <template v-if="search.StationId">
            <my-input-wrapper label="執行醫師">
              <q-select
                v-bind="QSelectProps"
                v-model="search.doctor"
                :options="doctorItems"
                option-label="Name"
                option-value="PersonId"
                emit-value
                map-options
              ></q-select>
            </my-input-wrapper>
            <my-input-wrapper label="護理人員">
              <q-select
                v-bind="QSelectProps"
                v-model="search.nurse"
                :options="nurseItems"
                option-label="Name"
                option-value="PersonId"
                emit-value
                map-options
              ></q-select>
            </my-input-wrapper>
          </template>
        </my-input-group>

        <div v-if="search.StationId && search.DepartmentNo" class="mt-4">
          <div>請選擇排班執行醫師：</div>
          <draggable-list :list="doctorFilterItems" item-key="PersonId" label="Name" color="blue"></draggable-list>
        </div>

        <div v-if="search.StationId && search.DepartmentNo" class="mt-4">
          <div>請選擇排班護理人員：</div>
          <draggable-list :list="nurseFilterItems" item-key="PersonId" label="Name" color="pink"></draggable-list>
        </div>
      </div>
    </my-aside>

    <div class="p-2">
      <WeekScheduleTable
        ref="draggableTableRef"
        :prepend-columns="prependColumns"
        v-model:rows="scheduleItems"
        :loading="getDataLoading"
        @weekChange="GetNursingScheduleList"
      >
        <template #btn-expend>
          <div>
            <div class="flex items-center gap-1">
              <div class="bg-blue h-4 w-4"></div>
              <div>執行醫師</div>
            </div>
            <div class="flex items-center gap-1">
              <div class="bg-pink h-4 w-4"></div>
              <div>護理人員</div>
            </div>
          </div>

          <q-space></q-space>
          <q-btn color="orange" label="清空本週排班" unelevated @click="clearSchedule"></q-btn>
          <q-btn
            v-if="search.StationId && search.DepartmentNo"
            color="green"
            label="複製上一週"
            unelevated
            @click="onCopyPreWeekClick"
          ></q-btn>
          <q-btn
            v-if="search.StationId && search.DepartmentNo"
            color="primary"
            label="儲存"
            unelevated
            @click="PutNursingScheduleSaveAll"
          ></q-btn>
        </template>

        <template v-for="week in weekNameItems" :key="week.EName" v-slot:[week.EName]="{ col, row, rowIndex, date }">
          <q-td :props="{ col }" valign="top">
            <div v-if="isBeforeByTime(row, date)" class="bg-grey-5 flex h-full flex-col gap-1 p-2">
              <div>此時段無法排班</div>
              <div
                v-for="(item, index) in row[week.EName]"
                :key="index"
                class="rounded p-1 text-center text-white"
                :class="[item.Type === '1' ? 'bg-blue' : 'bg-pink']"
              >
                {{ item.PersonName }}
              </div>
            </div>

            <draggable
              v-else
              class="flex h-full flex-col gap-1"
              v-model="row[week.EName]"
              :group="{ name: 'people' }"
              :item-key="(item) => `${item.AsignDate}-${item.Type}-${item.PersonId}`"
              ghost-class="opacity-50"
              :sort="false"
              @change="
                onChange(
                  $event,
                  {
                    AsignDate: date.format(),
                    TimeSlotNo: row.TimeSlotNo,
                    Weekly: weekNameItems.find((item) => item.EName === week.EName)?.NumName,
                  },
                  row[week.EName]
                )
              "
            >
              <template #item="{ element, index }">
                <q-btn
                  class="cursor-pointer rounded p-1 text-center text-white"
                  :color="element.Type === '1' ? 'blue' : 'pink'"
                  dense
                  unelevated
                >
                  {{ element.PersonName || element.Name }}

                  <q-popup-proxy :ref="(el) => (popupProxyRefs[`${week.EName}-${rowIndex}`] = el)">
                    <q-card>
                      <q-card-section class="flex gap-2 p-2">
                        <q-btn
                          color="edit"
                          label="編輯"
                          unelevated
                          dense
                          @click="
                            () => {
                              toEdit(element, row[week.EName])
                              popupProxyRefs[`${week.EName}-${rowIndex}`].hide()
                            }
                          "
                        ></q-btn>
                        <q-btn
                          color="delete"
                          label="刪除"
                          unelevated
                          dense
                          @click="
                            () => {
                              row[week.EName].splice(index, 1)
                              popupProxyRefs[`${week.EName}-${rowIndex}`].hide()
                            }
                          "
                        ></q-btn>
                      </q-card-section>
                    </q-card>
                  </q-popup-proxy>
                </q-btn>
              </template>
            </draggable>
          </q-td>
        </template>
      </WeekScheduleTable>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import {
  getNursingScheduleList,
  getNursingStation,
  postNursingScheduleDuplicateLastWeek,
  getIpdEmployeeList,
  getDepartmentDropdown,
  putNursingScheduleSaveAll,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import { useQuasar } from 'quasar'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import { groupBy, flattenDeep, cloneDeep, findKey, difference } from 'lodash-es'
import { weekNameItems } from 'utils/options.js'
import draggable from 'vuedraggable'
import ScheduleCheckDialog from './components/ScheduleCheckDialog.vue'
import DraggableList from 'components/schedule/DraggableList.vue'
import WeekScheduleTable from 'src/components/schedule/WeekScheduleTable.vue'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const popupProxyRefs = reactive({})
const draggableTableRef = ref()
const $q = useQuasar()
const prependColumns = [
  {
    name: 'TimeSlotNo',
    label: '時段\\星期',
    field: (row) => timeSlotItems.find((item) => item.value === row.TimeSlotNo)?.label,
    align: 'center',
  },
]

const isBeforeByTime = (row, date) => {
  const rowDay = dayjs(date).format('YYYY-MM-DD')
  if (row.TimeSlotNo === '1') {
    return dayjs(rowDay + '15:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '2') {
    return dayjs(rowDay + '23:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '3') {
    return dayjs(rowDay + '07:00')
      .add(1, 'd')
      .isSameOrBefore(dayjs())
  }

  //先只擋前一天
  // return dayjs(date).add(1, 'd').isSameOrBefore(dayjs())
}

const fromItems = ref([])
const onChange = async (evt, timeData, items) => {
  if (evt.removed) {
    fromItems.value = items
    return
  }

  if (evt.added) {
    const { element, newIndex } = evt.added
    const length = items.filter((item) => item.PersonId === element.PersonId).length
    if (length > 1) {
      $q.notify({
        type: 'negative',
        message: (element.PersonName || element.Name) + '已存在該排班時段',
        position: 'top',
      })

      await nextTick()
      fromItems.value.push(items.splice(newIndex, 1)[0])
      fromItems.value = []
      return
    }

    // 移除已新增的項目，重新深拷貝一份塞進去，否則都會物件指向原 list 的物件
    const index = items.findIndex((item) => item.PersonId === element.PersonId)
    const item = cloneDeep(items[index])
    items.splice(index, 1, item)

    Object.assign(item, cloneDeep(timeData))

    toAdd({ element: item, index: newIndex, items })
  }
}

const toAdd = ({ element, index, items }) => {
  const resultTargetData = {
    ...element,
    TimeSlotName: timeSlotItems.find((item) => item.value === element.TimeSlotNo)?.label,
    DepartmentName: departmentItems.value.find((item) => item.No === (search.DepartmentNo || element.DepartmentNo))
      ?.Name,
    StationId: search.StationId,
    StationName: nursingStationItems.value.find((item) => item.StationId === (search.StationId || element.StationId))
      ?.StationName,
  }
  let otherInChargeBeds = []
  items.forEach((d) => {
    if (d.PersonId !== element.PersonId) {
      otherInChargeBeds = otherInChargeBeds.concat(d.Beds)
    }
  })
  $q.dialog({
    component: ScheduleCheckDialog,
    componentProps: {
      editType: 'add',
      data: resultTargetData,
      isNurse: element.Type,
      bedsInCharge: otherInChargeBeds,
    },
  })
    .onOk((data) => {
      Object.assign(element, data)
    })
    .onCancel(() => {
      fromItems.value.push(items.splice(index, 1)[0])
      fromItems.value = []
    })
}

const toEdit = (element, items) => {
  const resultTargetData = {
    ...element,
    TimeSlotName: timeSlotItems.find((item) => item.value === element.TimeSlotNo)?.label,
    DepartmentName: departmentItems.value.find((item) => item.No === element.DepartmentNo)?.Name,
    StationName: nursingStationItems.value.find((item) => item.StationId === element.StationId)?.StationName,
  }
  let otherInChargeBeds = []
  items.forEach((d) => {
    if (d.PersonId !== element.PersonId) {
      otherInChargeBeds = otherInChargeBeds.concat(d.Beds)
    }
  })
  $q.dialog({
    component: ScheduleCheckDialog,
    componentProps: {
      editType: 'edit',
      data: resultTargetData,
      isNurse: element.Type,
      bedsInCharge: otherInChargeBeds,
    },
  }).onOk((data) => {
    Object.assign(element, data)
  })
}

const PutNursingScheduleSaveAll = async () => {
  try {
    const body = {
      NursingScheduleDate: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      NursingSchedules: flattenDeep(
        scheduleItems.value.map((row) => weekNameItems.map((weekItem) => row[weekItem.EName]))
      ),
    }
    const res = await putNursingScheduleSaveAll(body)
    if (res) {
      GetNursingScheduleList()
    }
    $q.notify({
      type: 'positive',
      message: '儲存排班資料成功',
      position: 'top',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '儲存排班資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  }
}

const setTableData = (scheduleItems) => {
  const data = Object.entries(groupBy(timeSlotItems, 'value')).map(([key, value]) => {
    const items = scheduleItems.filter((scheduleItem) => scheduleItem.TimeSlotNo === value[0].value)
    const weekObj = weekNameItems.reduce((obj, weekItem) => {
      obj[weekItem.EName] = items.filter((scheduleItem) => scheduleItem.Weekly === weekItem.NumName)
      return obj
    }, {})

    return { TimeSlotNo: key, ...weekObj }
  })
  return data
}

const getDataLoading = ref(false)
const scheduleItems = ref([])
const GetNursingScheduleList = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      dateTime: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      StationId: search.StationId,
      // $filter: filter.value,
    })
    const res = await getNursingScheduleList(query)
    scheduleItems.value = setTableData(res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const search = reactive({
  StationId: null,
  DepartmentNo: null,
  doctor: null,
  nurse: null,
})

const searchSubmit = () => {
  if (search.StationId && search.DepartmentNo) {
    GetNursingScheduleList()
  }
}

const clearSchedule = () => {
  const weekArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const todayWeekNum = dayjs().day()
  const today = dayjs().format('YYYY-MM-DD')
  let nowTimeSlot = ''
  if (dayjs(today + '07:00').isSameOrBefore(dayjs())) {
    nowTimeSlot = '1'
  } else if (dayjs(today + '15:00').isSameOrBefore(dayjs())) {
    nowTimeSlot = '2'
  } else if (dayjs(today + '23:00').isSameOrBefore(dayjs())) {
    nowTimeSlot = '3'
  }
  console.log('todayWeekNum', nowTimeSlot)

  scheduleItems.value.forEach((item) => {
    for (let index = 0; index < weekArr.length; index++) {
      if (index >= todayWeekNum) {
        if (index !== todayWeekNum || item.TimeSlotNo > nowTimeSlot) {
          item[weekArr[index]] = []
        }
      }
    }
  })
}
const onCopyPreWeekClick = () => {
  $q.dialog({
    message: '是否確定複製上一週排班？',
    ok: {
      label: '確定',
      unelevated: true,
    },
    cancel: {
      color: 'grey',
      label: '取消',
      unelevated: true,
    },
  }).onOk(async () => {
    const { error } = await PostNursingScheduleDuplicateLastWeek()
    if (!error) GetNursingScheduleList()
  })
}

const PostNursingScheduleDuplicateLastWeek = async () => {
  try {
    const date = draggableTableRef.value.getDate()
    const body = {
      Startdate: date.subtract(7, 'day').format(),
      Enddate: date.subtract(1, 'day').format(),
    }
    const res = await postNursingScheduleDuplicateLastWeek(body)
    $q.notify({
      type: 'positive',
      message: '複製排班資料成功',
      position: 'top',
    })
    return { data: res.data }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '複製排班資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
    return { error }
  }
}

const nursingStationItems = ref([])
const GetNursingStation = async () => {
  try {
    const res = await getNursingStation()
    nursingStationItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const departmentItems = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const nurseItems = ref([])
const doctorItems = ref([])
const nurseFilterItems = computed(() => {
  return nurseItems.value.filter(
    (item) => item.DepartmentNo === search.DepartmentNo && (search.nurse ? item.PersonId === search.nurse : true)
  )
})
const doctorFilterItems = computed(() => {
  return doctorItems.value.filter(
    (item) => item.DepartmentNo === search.DepartmentNo && (search.doctor ? item.PersonId === search.doctor : true)
  )
})
const GetIpdEmployeeList = async (role) => {
  try {
    const roleNo = role === 'Doctor' ? 1 : 2
    const query = setSearchQuery({ role: roleNo })
    const res = await getIpdEmployeeList(query)
    if (role === 'Doctor') doctorItems.value = res.data
    if (role === 'Nurse') nurseItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const onStationIdSelect = (opt) => {
  if (opt) {
    search.StationId = opt.StationId
    search.DepartmentNo = opt.StationType
    searchSubmit()
  }
}

const onDepartmentNoSelect = (opt) => {
  if (opt) {
    searchSubmit()
  }
}

const timeSlotItems = [
  { value: '1', label: '日班' },
  { value: '2', label: '小夜班' },
  { value: '3', label: '大夜班' },
]

const init = () => {
  GetNursingStation()
  GetDepartmentDropdown()
  GetIpdEmployeeList('Doctor')
  GetIpdEmployeeList('Nurse')
}
init()
</script>

