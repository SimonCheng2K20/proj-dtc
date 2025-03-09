<template>
  <q-page>
    <my-title title="門診週排班設定"></my-title>

    <my-aside>
      <div class="p-2">
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="部門">
            <q-select
              v-bind="QSelectProps"
              v-model="search.ParentDepartmentNo"
              :options="departmentLayer1Items"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              @update:model-value="onDepartmentLayer1NoSelect"
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper v-if="search.ParentDepartmentNo" label="科別">
            <q-select
              v-bind="QSelectProps"
              v-model="search.DepartmentNo"
              :options="departmentLayer2Items"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              @update:model-value="onDepartmentLayer2NoSelect"
            ></q-select>
          </my-input-wrapper>
        </my-input-group>

        <div class="mt-4" v-if="search.ParentDepartmentNo && search.DepartmentNo">
          <div>請選擇排班執行醫師：</div>
          <draggable-list
            :list="doctorFilterItems"
            item-key="PersonId"
            label="Name"
            text-color="default"
            :item-style="({ element }) => getDoctorColor(element.PersonId)"
            @test="test"
          >
          </draggable-list>
        </div>
      </div>
    </my-aside>

    <div class="p-2">
      <WeekScheduleTable
        ref="draggableTableRef"
        :prepend-columns="prependColumns"
        v-model:rows="scheduleItems"
        :loading="getDataLoading"
        @weekChange="GetWeekScheduleList"
      >
        <template #btn-expend>
          <q-space></q-space>
          <q-btn color="orange" label="清空本週排班" unelevated @click="clearSchedule"></q-btn>
          <q-btn color="green" label="複製上一週" unelevated @click="onCopyPreWeekClick"></q-btn>
          <q-btn color="primary" label="儲存" unelevated @click="PutWeekScheduleSaveAll"></q-btn>
        </template>

        <template #body-cell-TimeSlotName="{ col, row, value }">
          <q-td v-if="row.rowspan" :props="{ col }" :rowspan="row.rowspan">
            {{ value }}
          </q-td>
        </template>

        <template v-for="week in weekNameItems" :key="week.EName" v-slot:[week.EName]="{ col, row, rowIndex, date }">
          <q-td :props="{ col }" valign="top">
            <div v-if="isBeforeByTime(row, date)" class="h-full bg-grey-5 p-2 flex flex-col gap-1">
              <div>此時段無法排班</div>
              <div
                v-for="(item, index) in row[week.EName]"
                :key="index"
                class="rounded text-default text-center p-1"
                :style="getDoctorColor(item.PersonId)"
              >
                {{ item.PersonName }}
              </div>
            </div>
            <div v-else-if="!row.IsActive" class="h-full bg-red-3 p-2 flex flex-col gap-1">
              <div>此診間未被啟用無法排班</div>
              <div
                v-for="(item, index) in row[week.EName]"
                :key="index"
                class="rounded text-default text-center p-1"
                :style="getDoctorColor(item.PersonId)"
              >
                {{ item.PersonName }}
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
              </div>
            </div>

            <draggable
              v-else
              class="flex flex-col gap-1 h-full"
              v-model="row[week.EName]"
              :group="{ name: 'people' }"
              item-key="PersonId"
              ghost-class="opacity-50"
              :sort="false"
              @change="
                onChange(
                  $event,
                  {
                    RoomNo: row.RoomNo,
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
                  class="rounded text-center p-1 cursor-pointer"
                  text-color="default"
                  :style="getDoctorColor(element.PersonId)"
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
import { ref, computed, reactive, nextTick } from 'vue'
import {
  getWeekScheduleList,
  postWeekScheduleDuplicateLastWeek,
  getDoctor,
  getDepartmentDropdown,
  getRoomDropdown,
  putWeekScheduleSaveAll,
  getRoomLst,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import setOdataFilter from 'utils/setOdataFilter'
import isValidSearchValue from 'utils/isValidSearchValue.js'
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
  { name: 'TimeSlotName', label: '時段', field: 'TimeSlotName', align: 'center' },
  {
    name: 'RoomName',
    label: '診間',
    field: 'RoomName',
    align: 'center',
    style: 'border-left: 1px solid rgba(33, 92, 186, 0.4)',
  },
]
const isBeforeByTime = (row, date) => {
  const rowDay = dayjs(date).format('YYYY-MM-DD')
  if (row.TimeSlotNo === '1') {
    return dayjs(rowDay + '12:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '2') {
    return dayjs(rowDay + '18:00').isSameOrBefore(dayjs())
  } else if (row.TimeSlotNo === '3') {
    return dayjs(rowDay + '21:30').isSameOrBefore(dayjs())
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
    if (items.length > 1) {
      $q.notify({
        type: 'negative',
        message: '該診間和排班時段已有排定醫生',
        position: 'top',
      })

      await nextTick()
      fromItems.value.push(items.splice(newIndex, 1)[0])
      fromItems.value = []
      return
    }

    // if (length > 1) {
    //   $q.notify({
    //     type: 'negative',
    //     message: (element.PersonName || element.Name) + '已存在該排班時段',
    //     position: 'top',
    //   })

    //   await nextTick()
    //   fromItems.value.push(items.splice(newIndex, 1)[0])
    //   fromItems.value = []
    //   return
    // }

    // 移除已新增的項目，重新深拷貝一份塞進去，否則都會物件指向原 list 的物件
    const index = items.findIndex((item) => item.PersonId === element.PersonId)
    const item = cloneDeep(items[index])
    items.splice(index, 1, item)

    Object.assign(item, cloneDeep(timeData))
  }
}

const PutWeekScheduleSaveAll = async () => {
  try {
    const body = {
      WeeksScheduleDate: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      DepartmentNo: search.DepartmentNo,
      WeeksSchedules: flattenDeep(
        scheduleItems.value.map((row) => weekNameItems.map((weekItem) => row[weekItem.EName]))
      ),
    }
    const res = await putWeekScheduleSaveAll(body)
    $q.notify({
      type: 'positive',
      message: '儲存排班資料成功',
      position: 'top',
    })
    GetWeekScheduleList()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '儲存排班資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  }
}

const setTableData = (scheduleItems) => {
  const data = Object.entries(groupBy(timeSlotItems, 'value'))
    .map(([key, [{ label, value }]]) => {
      const items = scheduleItems.filter((scheduleItem) => scheduleItem.TimeSlotNo === value)

      return roomItems.value.map((item, index) => {
        const weekObj = weekNameItems.reduce((obj, weekItem) => {
          obj[weekItem.EName] = items.filter(
            (scheduleItem) => scheduleItem.Weekly === weekItem.NumName && scheduleItem.RoomNo === item.No
          )
          return obj
        }, {})

        const row = {
          IsActive: item.IsActive,
          TimeSlotNo: key,
          TimeSlotName: label,
          RoomNo: item.No,
          RoomName: item.Name,
          rowspan: index === 0 ? roomItems.value.length : undefined,
          ...weekObj,
        }

        return row
      })
    })
    .flat()

  return data
}

const getDataLoading = ref(false)
const scheduleItems = ref([])
const GetWeekScheduleList = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      dateTime: draggableTableRef.value.getDate().format('YYYY-MM-DD'),
      DepartmentNo: search.DepartmentNo,
    })
    const res = await getWeekScheduleList(query)
    scheduleItems.value = setTableData(res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const search = reactive({
  ParentDepartmentNo: null,
  DepartmentNo: null,
  doctor: null,
})

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'ParentDepartmentNo':
          case 'DepartmentNo':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
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

const searchSubmit = () => {
  if (search.ParentDepartmentNo && search.DepartmentNo && roomItems.value.length > 0) {
    GetWeekScheduleList()
  }
}

const clearSchedule = () => {
  const weekArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const todayWeekNum = dayjs().day()
  const today = dayjs().format('YYYY-MM-DD')
  let nowTimeSlot = ''
  if (dayjs(today + '12:00').isSameOrBefore(dayjs())) {
    nowTimeSlot = '1'
  } else if (dayjs(today + '18:00').isSameOrBefore(dayjs())) {
    nowTimeSlot = '2'
  } else if (dayjs(today + '21:30').isSameOrBefore(dayjs())) {
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
    const { error } = await PostWeekScheduleDuplicateLastWeek()
    if (!error) GetWeekScheduleList()
  })
}

const PostWeekScheduleDuplicateLastWeek = async () => {
  try {
    const date = draggableTableRef.value.getDate()
    const body = {
      DepartmentNo: search.ParentDepartmentNo,
      Startdate: date.subtract(7, 'day').format(),
      Enddate: date.subtract(1, 'day').format(),
    }
    const res = await postWeekScheduleDuplicateLastWeek(body)
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

const departmentLayer1Items = ref([])
const departmentLayer2Items = ref([])
const GetDepartmentDropdown = async (layer) => {
  try {
    const query = setSearchQuery({
      layer,
      $filter: search.ParentDepartmentNo
        ? setOdataFilter({ key: 'ParentNo', value: search.ParentDepartmentNo, operator: 'eq' })
        : null,
    })
    const res = await getDepartmentDropdown(query)
    if (layer === 1) departmentLayer1Items.value = res.data.Items
    if (layer === 2) departmentLayer2Items.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const getDoctorColor = (PersonId) => {
  const color = doctorWithColorItems.value.find((item) => item.PersonId === PersonId)?.color
  return color ? `background: ${color}` : null
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomColor = () => {
  return `hsl(${getRandom(0, 360)}, 95%, 95%)`
}

const doctorWithColorItems = computed(() => doctorItems.value.map((item) => ({ ...item, color: getRandomColor() })))
const doctorItems = ref([])
const doctorFilterItems = computed(() => {
  return doctorItems.value.filter((item) => (search.doctor ? item.PersonId === search.doctor : true))
})
const GetDoctor = async () => {
  try {
    const query = setSearchQuery({ $filter: filter.value })
    const res = await getDoctor(query)
    doctorItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const roomItems = ref([])
// const GetRoomDropdown = async () => {
//   try {
//     const query = setSearchQuery({ departmentNo: search.DepartmentNo })
//     const res = await getRoomDropdown(query)
//     roomItems.value = res.data
//     if (roomItems.value.length === 0) {
//       $q.notify({
//         type: 'negative',
//         message: '目前此科別尚無診間',
//         position: 'top',
//       })
//       await GetRoomLst()
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

//此科別尚無診間 的情況下 獲取該科別歷史間 及 排班紀錄
const GetRoomLst = async () => {
  try {
    const query = setSearchQuery({ filter: `DepartmentNo eq '${search.DepartmentNo}'` })
    const res = await getRoomLst(query)
    if (res.data) {
      console.log('test', res.data)
      roomItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const onDepartmentLayer1NoSelect = (opt) => {
  scheduleItems.value = []
  search.DepartmentNo = null

  if (opt) {
    GetDepartmentDropdown(2)
  }
}

const onDepartmentLayer2NoSelect = async (opt) => {
  scheduleItems.value = []

  if (opt) {
    GetDoctor()
    // await GetRoomDropdown()
    await GetRoomLst()
    searchSubmit()
  }
}

const timeSlotItems = [
  { value: '1', label: '上午' },
  { value: '2', label: '下午' },
  { value: '3', label: '夜間' },
]

const test = () => {
  console.log('test', scheduleItems.value)
}

const init = () => {
  GetDepartmentDropdown(1)
}
init()
</script>

