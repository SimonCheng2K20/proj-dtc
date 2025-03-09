<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="預約病床" width="1400px" @close="onDialogCancel">
      <my-search-area gridCols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="科室床位">
          <q-select
            v-bind="QSelectProps"
            v-model="search.DepartmentId"
            :options="options"
            option-label="label"
            option-value="value"
            map-options
            emit-value
          >
          </q-select>
        </my-input-wrapper>
      </my-search-area>
      <!-- 樓層病床 -->
      <div class="mt-2 flex">
        <div class="flex items-center bg-[#ECECEC] p-4">5樓</div>
        <div class="mx-2 border border-[#215cba66]" v-for="stations in bedStatus" :key="stations.stationName">
          <div class="w-full border border-b-0 border-[#215cba66] py-1 text-center">{{ stations.stationName }}</div>
          <div class="flex gap-1 border border-t-0 border-[#215cba66] p-2 pt-0">
            <div class="" v-for="rooms in stations.rooms" :key="rooms.roomName">
              <div class="w-full border border-[#215cba66] text-center" :class="getBgColorRoomName(rooms)">
                {{ rooms.roomName }}
              </div>
              <div class="grid grid-flow-col grid-rows-2">
                <!-- 單個病床 -->
                <div
                  class="h-[92px] w-[92px] border border-t-0 border-[#215cba66] p-1 py-2"
                  :class="[
                    getBgColorBedNo(bed),
                    index !== 0 && index !== 1 ? 'border-l-0' : '',
                    bed.PreOutDay === '空床' ? 'cursor-pointer hover:border-[3px] hover:border-[#dbad48c5]' : '',
                  ]"
                  v-for="(bed, index) in rooms.beds"
                  :key="bed.BedNo"
                  @click="selectBed(bed)"
                  @mouseenter="clickCount = 0"
                >
                  <div class="text-center text-sm">{{ bed.PreOutDay }}</div>
                  <div class="text-center">{{ bed.BedNo }}</div>
                  <div class="flex justify-between">
                    <div class="text-bold" :class="bed.Gender === '男' ? 'text-[#006FFF]' : 'text-red'">
                      {{ bed.Gender }}
                    </div>
                    <div v-if="bed.type === 'paySelf'">
                      <q-icon name="star" color="pink-11"></q-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 圖標提示 -->
      <div class="mt-3 ml-3 flex items-center gap-2">
        <div class="h-[30px] w-[30px] border border-[#215cba66]"></div>
        <div>空床</div>
        <div class="h-[30px] w-[30px] border border-[#215cba66] bg-[#A1FFB7]"></div>
        <div>健保床</div>
        <div class="flex h-[30px] w-[30px] items-center justify-center border border-[#215cba66] bg-[#9BD7FF]">
          <q-icon name="star" color="pink-11" size="sm"></q-icon>
        </div>
        <div>自費差額床</div>
        <div class="h-[30px] w-[30px] border border-[#215cba66] bg-[#FFF780]"></div>
        <div>今日出院</div>
      </div>

      <template #actions>
        <q-btn color="grey" label="取消" unelevated @click="onDialogCancel"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import MyCalendarGrid from 'components/MyCalendarGrid.vue'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const date = ref(dayjs().format('YYYY-MM-DD'))

const search = ref({
  DepartmentId: null,
})
const options = ref([{ label: '前端模擬', value: '模擬' }])

const bedStatus = ref([
  {
    stationName: 'A護理站',
    rooms: [
      {
        roomName: '501',
        type: 'notPaySelf',
        beds: [
          {
            stationName: 'A護理站',
            BedFloor: '5',
            BedRoom: '501',
            BedNo: '501-1',
            BedLevel: '健保三人房',
            Gender: '',
            PreOutDay: '空床',
            type: 'notPaySelf',
          },
          {
            stationName: 'A護理站',
            BedFloor: '5',
            BedRoom: '501',
            BedNo: '501-2',
            BedLevel: '健保三人房',
            Gender: '男',
            PreOutDay: '2023-07-05',
            type: 'notPaySelf',
          },
          {
            stationName: 'A護理站',
            BedFloor: '5',
            BedRoom: '501',
            BedNo: '501-3',
            BedLevel: '健保三人房',
            Gender: '',
            PreOutDay: '空床',
            type: 'notPaySelf',
          },
        ],
      },
      {
        roomName: '504',
        type: 'paySelf',
        beds: [
          {
            stationName: 'A護理站',
            BedFloor: '5',
            BedRoom: '504',
            BedNo: '504-1',
            BedLevel: '自費雙人房',
            Gender: '',
            PreOutDay: '空床',
            type: 'paySelf',
          },
          {
            stationName: 'A護理站',
            BedFloor: '5',
            BedRoom: '504',
            BedNo: '504-2',
            BedLevel: '自費雙人房',
            Gender: '女',
            PreOutDay: '今日出院',
            type: 'paySelf',
          },
        ],
      },
    ],
  },
  {
    stationName: 'B護理站',
    rooms: [
      {
        roomName: '503',
        type: 'paySelf',
        beds: [
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '503',
            BedNo: '503-1',
            BedLevel: '自費單人房',
            Gender: '男',
            PreOutDay: '2023-07-08',
            type: 'paySelf',
          },
        ],
      },
      {
        roomName: '502',
        type: 'notPaySelf',
        beds: [
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-1',
            BedLevel: '健保多人房',
            Gender: '',
            PreOutDay: '空床',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-2',
            BedLevel: '健保多人房',
            Gender: '男',
            PreOutDay: '2023-07-10',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-3',
            BedLevel: '健保多人房',
            Gender: '男',
            PreOutDay: '2023-07-27',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-4',
            BedLevel: '健保多人房',
            Gender: '男',
            PreOutDay: '今日出院',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-5',
            BedLevel: '健保多人房',
            Gender: '女',
            PreOutDay: '今日出院',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-6',
            BedLevel: '健保多人房',
            Gender: '女',
            PreOutDay: '2023-07-13',
            type: 'notPaySelf',
          },
          {
            stationName: 'B護理站',
            BedFloor: '5',
            BedRoom: '502',
            BedNo: '502-7',
            BedLevel: '健保多人房',
            Gender: '男',
            PreOutDay: '2023-07-08',
            type: 'notPaySelf',
          },
        ],
      },
    ],
  },
])

const getBgColorRoomName = (room) => {
  if (room.type === 'notPaySelf') {
    return 'bg-[#A1FFB7]'
  } else if (room.type === 'paySelf') {
    return 'bg-[#9BD7FF]'
  }
}
const getBgColorBedNo = (bed) => {
  if (bed.PreOutDay === '空床') {
    return ''
  } else if (bed.PreOutDay === '今日出院') {
    return 'bg-[#FFF780]'
  } else if (bed.PreOutDay !== '空床' && bed.type === 'notPaySelf') {
    return 'bg-[#ECFFF1]'
  } else if (bed.PreOutDay !== '空床' && bed.type === 'paySelf') {
    return 'bg-[#EBF7FF]'
  }
}
const searchSubmit = () => {
  console.log('test submit')
}
const searchClear = () => {
  console.log('test clear')
}
const clickCount = ref(0)

const selectBed = (bed) => {
  clickCount.value += 1

  // 檢查是否達到連點條件
  if (clickCount.value === 2) {
    clickCount.value === 0
    // 在這裡執行你的連點邏輯
    if (bed.PreOutDay !== '空床') {
      return
    } else {
      onDialogOK(bed)
    }
  }
}
</script>
<style lang="scss" scoped></style>

