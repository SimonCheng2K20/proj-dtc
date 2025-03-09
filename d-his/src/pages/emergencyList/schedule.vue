<template>
  <q-page>
    <my-title title="急診醫師及護理人員週排班設定"></my-title>

    <my-aside>
      <div class="p-2">
        <my-input-group class="grid gap-2">
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
        </my-input-group>

        <div class="mt-4">
          <div>請選擇排班執行醫師：</div>
          <draggable-list :list="doctorFilterItems" item-key="PersonId" label="Name" color="blue"></draggable-list>
        </div>

        <div class="mt-4">
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
        @weekChange="GetErScheduleList"
      >
        <template #btn-expend>
          <div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 bg-blue"></div>
              <div>執行醫師</div>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 bg-pink"></div>
              <div>護理人員</div>
            </div>
          </div>

          <q-space></q-space>
          <q-btn color="orange" label="清空本週排班" unelevated @click="clearSchedule"></q-btn>
          <q-btn color="green" label="複製上一週" unelevated @click="onCopyPreWeekClick"></q-btn>
          <q-btn color="primary" label="儲存" unelevated @click="PutErScheduleSaveAll"></q-btn>
        </template>

        <template v-for="week in weekNameItems" :key="week.EName" v-slot:[week.EName]="{ col, row, rowIndex, date }">
          <q-td :props="{ col }" valign="top">
            <div v-if="isBeforeByTime(row, date)" class="h-full bg-grey-5 p-2 flex flex-col gap-1">
              <div>此時段無法排班</div>
              <div
                v-for="(item, index) in row[week.EName]"
                :key="index"
                class="rounded text-white text-center p-1"
                :class="[item.Type === '1' ? 'bg-blue' : 'bg-pink']"
              >
                {{ item.PersonName }}
              </div>
            </div>

            <draggable
              v-else
              class="flex flex-col gap-1 h-full"
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
                  class="rounded text-white text-center p-1 cursor-pointer"
                  :color="element.Type === '1' ? 'blue' : 'pink'"
                  dense
                  unelevated
                >
                  {{ element.PersonName || element.Name }}
                  <q-popup-proxy :ref="(el) => (popupProxyRefs[`${week.EName}-${rowIndex}`] = el)">
                    <q-card>
                      <q-card-section class="flex gap-2 p-2">
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
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import {
  getErScheduleList,
  postErScheduleDuplicateLastWeek,
  getErEmployeeList,
  getDepartmentDropdown,
  putErScheduleSaveAll,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import { useQuasar } from 'quasar'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import { groupBy, flattenDeep, cloneDeep } from 'lodash-es'
import { weekNameItems } from 'utils/options.js'
import draggable from 'vuedraggable'
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
  console.log('row', date)
  if (row.TimeSlotNo === '1') {
    return dayjs(rowDay + '07:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '2') {
    return dayjs(rowDay + '15:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '3') {
    return dayjs(rowDay + '23:00').isSameOrBefore(dayjs())
    // return date.isSameOrBefore(dayjs(nowDay))
  }
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
  }
}

const PutErScheduleSaveAll = async () => {
  try {
    const body = {
      ErScheduleDate: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      ErSchedules: flattenDeep(scheduleItems.value.map((row) => weekNameItems.map((weekItem) => row[weekItem.EName]))),
    }
    const res = await putErScheduleSaveAll(body)
    $q.notify({
      type: 'positive',
      message: '儲存排班資料成功',
      position: 'top',
    })
    GetErScheduleList()
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
    const weekObj = weekNameItems.reduce((obj, weekItem) => {
      obj[weekItem.EName] = scheduleItems.filter((scheduleItem) => scheduleItem.Weekly === weekItem.NumName)
      return obj
    }, {})

    return { TimeSlotNo: key, ...weekObj }
  })
  return data
}

const getDataLoading = ref(false)
const scheduleItems = ref([])
const GetErScheduleList = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      dateTime: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      DepartmentNo: search.DepartmentNo,
      StationId: search.StationId,
      // $filter: filter.value,
    })
    const res = await getErScheduleList(query)
    scheduleItems.value = setTableData(res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const search = reactive({
  doctor: null,
  nurse: null,
})
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
    const { error } = await PostErScheduleDuplicateLastWeek()
    if (!error) GetErScheduleList()
  })
}

const PostErScheduleDuplicateLastWeek = async () => {
  try {
    const date = draggableTableRef.value.getDate()
    const body = {
      DepartmentNo: search.DepartmentNo,
      Startdate: date.subtract(7, 'day').format(),
      Enddate: date.subtract(1, 'day').format(),
    }
    const res = await postErScheduleDuplicateLastWeek(body)
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
  return nurseItems.value.filter((item) => (search.nurse ? item.PersonId === search.nurse : true))
})
const doctorFilterItems = computed(() => {
  return doctorItems.value.filter((item) => (search.doctor ? item.PersonId === search.doctor : true))
})
const GetErEmployeeList = async (role) => {
  try {
    const roleNo = role === 'Doctor' ? 1 : 2
    const query = setSearchQuery({ role: roleNo })
    const res = await getErEmployeeList(query)
    if (role === 'Doctor') doctorItems.value = res.data
    if (role === 'Nurse') nurseItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const timeSlotItems = [{ value: '1', label: '日班' }]

const init = () => {
  GetDepartmentDropdown()
  GetErEmployeeList('Doctor')
  GetErEmployeeList('Nurse')

  onMounted(() => {
    GetErScheduleList()
  })
}
init()
</script>

