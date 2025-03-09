<template>
  <q-page>
    <my-title>
      看診進度查詢
      <q-space></q-space>
      <q-btn class="header-btn" label="回上一頁" dense unelevated @click="router.go(-2)"></q-btn>
    </my-title>

    <div class="p-2">
      <my-search-area grid-cols="2" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="科別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.RoomDepartmentNo"
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
            v-model="search.DoctorId"
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
      </my-search-area>
      <div class="mt-2 pt-2 relative">
        <q-linear-progress class="absolute top-0" indeterminate v-if="getDataLoading"></q-linear-progress>

        <div class="grid grid-cols-6 gap-4" v-if="timeslotNo">
          <q-card
            v-for="(item, index) in regProgressItems"
            :key="index"
            flat
            class="border border-gray-400"
            :style="{
              'background-color': departmentColor[item.RoomDepartmentNo],
            }"
          >
            <div class="flex flex-col h-full">
              <div class="p-4 grow">
                <div class="flex no-wrap justify-between items-center gap-2">
                  <div class="text-3xl font-bold">{{ item.RoomDepartmentName }}</div>
                  <div>
                    <div>{{ item.RoomDepartmentNo }}</div>
                    <div>{{ item.RoomName }}</div>
                  </div>
                </div>
                <div>醫師</div>
                <div class="font-bold text-2xl text-blue">{{ item.PersonName }}</div>
              </div>
              <div class="border-t border-gray-400">
                <div class="grid grid-cols-2">
                  <div class="text-center border-r border-gray-400 p-2">
                    <div>目前看診號</div>
                    <div class="text-blue font-bold text-2xl">
                      {{ item.Sequence }}
                    </div>
                  </div>
                  <div class="text-center p-2">
                    <div>未看診人數</div>
                    <div class="text-orange font-bold text-2xl">
                      {{ item.NotAttendPeople }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="text-center font-bold text-4xl" v-else>目前尚未開診</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onBeforeUnmount } from 'vue'
import setSearchQuery from 'utils/setSearchQuery'
import { getDepartmentDropdown, getEmployee, getRegProgress, getTimeSlot } from 'api'
import { useRouter } from 'vue-router'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep, get } from 'lodash-es'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const router = useRouter()

const timeSlotItems = ref([])

const GetTimeSlot = async () => {
  try {
    getDataLoading.value = true
    const query = `?$filter=Description eq '門急診'`
    const res = await getTimeSlot(query)

    if (res.status === 200) {
      timeSlotItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const timeslotNo = computed(() => {
  const today = dayjs().format('YYYY-MM-DD') + 'T'

  return (
    timeSlotItems.value.find((i) => {
      return dayjs().isBetween(today + i.StartTime, today + i.EndTime, '', '[)')
    })?.No || null
  )
})

const getDataLoading = ref(false)
const regProgressItems = ref([])
const GetRegProgress = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({ ...search, timeslotNo: timeslotNo.value })
    const res = await getRegProgress(query)
    if (res.status === 200) {
      regProgressItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const initData = {}
initData.search = {
  RoomDepartmentNo: null,
  DoctorId: null,
  Type: 1,
}
const search = reactive(cloneDeep(initData.search))

const searchSubmit = () => {
  GetRegProgress()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  GetRegProgress()
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomColor = () => {
  return `hsl(${getRandom(0, 360)}, 95%, 95%)`
}

const filterLoading = ref(false)

const departmentColor = computed(() => {
  return departmentItems.value.reduce((obj, item) => {
    obj[item.No] = getRandomColor()
    return obj
  }, {})
})

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

const interval = window.setInterval(() => {
  GetRegProgress()
}, 5000)

onBeforeUnmount(() => {
  window.clearInterval(interval)
})

const init = async () => {
  GetDepartmentDropdown()
  GetEmployee()
  await GetTimeSlot()
  GetRegProgress()
}
init()
</script>
