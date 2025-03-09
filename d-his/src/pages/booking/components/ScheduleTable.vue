<template>
  <div>
    <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper label="科別">
        <q-select
          v-bind="QSelectProps"
          v-model="search.DepartmentNo"
          :options="departmentFilterItems"
          option-label="Name"
          option-value="No"
          emit-value
          map-options
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
      <my-input-wrapper label="醫師">
        <q-select
          v-bind="QSelectProps"
          v-model="search.doctorId"
          :options="doctorFilterItems"
          :option-label="(opt) => (opt ? opt.Person.Name : opt)"
          option-value="AccountNo"
          emit-value
          map-options
          use-input
          @filter="onDoctorFilter"
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
      <my-input-wrapper label="時段">
        <q-select
          v-bind="QSelectProps"
          option-value="Name"
          option-label="Name"
          emit-value
          v-model="timeSlot"
          :options="timeSlotItems"
          :loading="timeSlotLoading"
        >
        </q-select>
      </my-input-wrapper>
    </my-search-area>

    <div v-if="isReserve" class="mt-2 flex items-center gap-2">
      <q-btn color="primary" label="上個月" unelevated @click="setDate(-30)"></q-btn>
      <q-btn color="primary" label="上一周" unelevated @click="setDate(-7)"></q-btn>
      <div>{{ firstDateInWeek.format('YYYY-MM-DD') }} ~ {{ firstDateInWeek.add(6, 'day').format('YYYY-MM-DD') }}</div>
      <q-btn color="primary" label="下一周" unelevated @click="setDate(7)"></q-btn>
      <q-btn color="primary" label="下個月" unelevated @click="setDate(30)"></q-btn>
    </div>

    <q-table class="mt-2" v-bind="QTableProps" :columns="columns" :rows="bookingTable" :loading="getDataLoading">
      <template v-for="week in weekColumns" :key="week.name" v-slot:[`body-cell-${week.field}`]="{ value }">
        <q-td valign="top">
          <div class="flex items-start gap-2 p-2">
            <q-btn
              class="cursor-pointer p-2"
              v-for="(bookingItem, bookingIndex) in value"
              :key="bookingIndex"
              :title="bookingItem.RoomDepartmentParentName + ' - ' + bookingItem.RoomDepartmentName"
              :style="{ 'background-color': departmentColor[bookingItem.RoomDepartmentNo] }"
              @click="onBookingClick(bookingItem)"
            >
              <div>
                <div class="flex justify-between gap-4">
                  <div>{{ bookingItem.RoomDepartmentName }}</div>
                  <div>{{ bookingItem.RoomName }}</div>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div>{{ bookingItem.PersonName }}</div>
                  <div>{{ bookingItem.Booking }}/{{ bookingItem.Limit }}</div>
                  <q-btn
                    color="white"
                    text-color="default"
                    icon="chevron_right"
                    round
                    size="sm"
                    dense
                    unelevated
                    @click.stop="toBookedList(bookingItem)"
                  ></q-btn>
                </div>
              </div>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import dayjs from 'dayjs'
import { getDayBooking, getDepartmentDropdown, getEmployee, getTimeSlot } from 'api'
import { weekNameItems } from 'utils/options.js'
import { useRoute } from 'vue-router'
import BookingInfoItem from './BookingInfoItem.vue'
import { useQuasar } from 'quasar'
import { useBookingStore } from 'stores/booking'
import BookedList from './BookedList.vue'
import { QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep, get, groupBy, findKey } from 'lodash-es'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()
const route = useRoute()
const emit = defineEmits(['getData'])
const bookingStore = useBookingStore()

const firstDateInWeek = ref(dayjs().day(0))

const isReserve = computed(() => route.name === 'ReserveBooking')
watch(isReserve, (val) => {
  if (!val && !firstDateInWeek.value.isSame(dayjs().day(0), 'day')) {
    firstDateInWeek.value = dayjs(dayjs().day(0))
    GetDayBooking()
  }
})
const timeSlot = ref('全部')

const timeSlotItems = ref([])

const timeSlotLoading = ref(false)

const compareTimeSlot = (timeSlots) => {
  timeSlot.value = timeSlots.find((item) => {
    const endTime = item.EndTime.replace(/:/g, '')
    const nowTime = dayjs(new Date()).format('HH:mm:ss').replace(/:/g, '')

    return +nowTime < +endTime
  }).Name
}

const GetTimeSlot = async () => {
  try {
    timeSlotLoading.value = true
    const query = `?$filter=Description eq '門急診'`
    const res = await getTimeSlot(query)

    if (res.status === 200) {
      timeSlotItems.value = res.data.Items
      compareTimeSlot(res.data.Items)
      timeSlotItems.value.push({ Name: '全部' })
    }
  } catch (err) {
    console.log(err)
  } finally {
    timeSlotLoading.value = false
  }
}

const columns = computed(() => {
  const arr = [
    { name: 'TimeSlotName', label: '時段', field: 'TimeSlotName', align: 'center', headerClasses: 'min-w-[60px]' },
  ]
  return arr.concat(weekColumns.value)
})

const weekColumns = computed(() => {
  const date = isReserve.value ? firstDateInWeek.value : dayjs()
  const items = isReserve.value ? weekNameItems : weekNameItems.filter((item) => item.NumName === date.get('day'))

  return items.map((item, index) => {
    return {
      name: item.EName,
      label: `${date.add(index, 'day').format('MM/DD')} ${item.CName}`,
      field: item.EName,
      align: 'center',
    }
  })
})

const bookingTable = computed(() => {
  let data = Object.entries(groupBy(bookingItems.value, 'TimeSlotName')).map(([key, items]) => {
    const weekObj = weekNameItems.reduce((obj, weekItem) => {
      obj[weekItem.EName] = items.filter((bookingItem) => bookingItem.Weekly === weekItem.NumName)
      return obj
    }, {})

    return { TimeSlotName: key, ...weekObj }
  })

  if (timeSlot.value !== '全部') {
    return data.filter((item) => {
      return item.TimeSlotName === timeSlot.value
    })
  } else {
    return data
  }
})

const getDataLoading = ref(false)
const bookingItems = ref([])
const GetDayBooking = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      dateTime: encodeURIComponent(firstDateInWeek.value.format('YYYY-MM-DD')),
      doctorId: search.doctorId,
      $filter: filter.value,
    })
    const res = await getDayBooking(query)
    if (res.status === 200) {
      bookingItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}
const allWeekBookingItems = ref([])
const GetWeekBooking = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      dateTime: encodeURIComponent(firstDateInWeek.value.format('YYYY-MM-DD')),
    })
    const res = await getDayBooking(query)
    if (res.status === 200) {
      allWeekBookingItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const initData = {}
initData.search = {
  DepartmentNo: '',
  doctorId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
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
  GetDayBooking()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  GetDayBooking()
}

const onBookingClick = async (bookingItem) => {
  const result = await bookingStore.validate()
  console.log('bookingStore.patientData', bookingStore.patientData)

  if (result) {
    $q.dialog({
      component: BookingInfoItem,
      componentProps: {
        bookingType: bookingStore.patientData.isChangeBooking ? 'change' : 'booking',
        bookingData: Object.assign(bookingItem, bookingStore.patientData),
      },
    }).onOk(() => {
      bookingStore.emitter.emit('GetPatientBooking')
      GetDayBooking()
    })
  }
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomColor = () => {
  return `hsl(${getRandom(0, 360)}, 85%, 85%)`
}

const departmentColor = computed(() => {
  return departmentItems.value.reduce((obj, item) => {
    obj[item.No] = getRandomColor()
    return obj
  }, {})
})

const filterLoading = ref(false)
const departmentItems = ref([])
const filterCanBookDepartmentItems = computed(() => {
  if (route.name === 'TodayBooking') {
    const weekBookingItems = bookingItems.value.filter((d) => {
      return d.Weekly === dayjs().day()
    })
    const canBookRoomDepartmentNoArr = weekBookingItems.map((item) => {
      return item.RoomDepartmentNo
    })
    return departmentItems.value.filter((item) => {
      return canBookRoomDepartmentNoArr.includes(item.No)
    })
  } else {
    const canBookRoomDepartmentNoArr = allWeekBookingItems.value.map((item) => {
      return item.RoomDepartmentNo
    })
    return departmentItems.value.filter((item) => {
      return canBookRoomDepartmentNoArr.includes(item.No)
    })
  }
})
const departmentFilterKeys = ['No', 'Name']
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    if (res.data) {
      departmentItems.value = res.data.Items
      console.log('test', departmentItems.value)
    }
  } catch (error) {
    console.log(error)
  }
}

const { filterItems: departmentFilterItems, filterHandler: onDepartmentFilter } = useFilter(
  { items: filterCanBookDepartmentItems, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const doctorItems = ref([])
const doctorFilterKeys = ['AccountNo', 'Person.Name']
const GetEmployee = async () => {
  try {
    const res = await getEmployee()
    if (res.data) doctorItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const { filterItems: doctorFilterItems, filterHandler: onDoctorFilter } = useFilter(
  { items: doctorItems, filterKeys: doctorFilterKeys },
  () => {
    filterLoading.value = false
  }
)
const setDate = (days) => {
  firstDateInWeek.value = firstDateInWeek.value.add(days, 'day')
  GetDayBooking()
}

const toBookedList = (bookingItem) => {
  $q.dialog({
    component: BookedList,
    componentProps: {
      bookingData: bookingItem,
    },
  })
}

watch(
  () => route.fullPath,
  () => {
    if (route.fullPath.includes('ReserveBooking')) {
      if (search.DepartmentNo === '') {
        search.DepartmentNo = departmentFilterItems.value[0].No
      }
    } else {
      search.DepartmentNo = ''
    }
    searchSubmit()
  }
)

const init = async () => {
  await GetWeekBooking()
  await GetDepartmentDropdown()
  if (route.fullPath.includes('ReserveBooking')) {
    search.DepartmentNo = departmentFilterItems.value[0].No
  }
  GetDayBooking()
  GetEmployee()
  GetTimeSlot()
}
init()
</script>

