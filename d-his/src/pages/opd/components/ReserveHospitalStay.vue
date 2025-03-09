<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="床位預約" width="1280px" height="90%" @close="onDialogCancel" :loading="getDataLoading">
      <div class="flex items-center mb-2">
        <my-input-wrapper label="科室床位" class="min-w-[320px]">
          <q-select
            v-bind="QSelectProps"
            v-model="departmentNo"
            :options="departmentFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onDepartmentFilter"
            @input-value="filterLoading = true"
            @update:model-value="GetHospitalBedList"
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
        <q-space></q-space>
        <div class="grid grid-cols-2">
          <div class="flex items-center">
            <div class="w-6 h-6 flex flex-center"><div class="w-4 h-4 border border-blue-500"></div></div>
            <div>空床</div>
          </div>
          <div class="col-span-1 flex items-center">
            <div class="w-6 h-6 flex flex-center"><div class="w-4 h-4 border border-blue-500 bg-purple-2"></div></div>
            <div>已確定出院日期</div>
          </div>
          <div class="col-span-1 flex items-center">
            <q-icon name="star" class="text-[#ff0099]" size="sm"></q-icon>
            <div>差額床</div>
          </div>
          <div class="col-span-1 flex items-center">
            <div class="w-6 h-6 flex flex-center"><div class="w-4 h-4 border border-blue-500 bg-yellow-2"></div></div>
            <div>預計今日出院</div>
          </div>
        </div>
      </div>

      <div>
        <div class="font-bold mb-2">床位查詢結果：</div>
        <div v-if="Object.keys(showData).length === 0">沒有資料</div>
        <div v-for="floor in Object.keys(showData)" :key="floor">
          <div class="flex no-wrap gap-2 mb-2">
            <q-card class="shrink-0 bg-grey-5" flat>
              <q-card-section> {{ floor }}樓 </q-card-section>
            </q-card>

            <div class="w-full grid grid-cols-6 grid-col gap-2">
              <q-card v-for="(bedItem, bedIndex) in showData[floor]" :key="bedIndex">
                <q-item
                  class="h-full"
                  :class="{
                    'bg-purple-2': bedItem.BedStatus.includes('已確定出院日期'),
                    'bg-yellow-2': bedItem.BedStatus.includes('預計今日出院'),
                    'bg-light-green': bedItem.BedStatus.includes('已預約'),
                  }"
                  :clickable="bedItem.BedStatus !== '已預約'"
                  @click="onBedItemClick(bedItem)"
                >
                  <q-item-section>
                    <q-icon
                      v-if="bedItem.MakeUp"
                      name="star"
                      class="absolute top-0 right-0 text-[#ff0099]"
                      size="sm"
                    ></q-icon>
                    <div class="font-bold text-center">{{ bedItem.BedStatus }}</div>
                    <div class="font-bold text-center">{{ bedItem.Bed }}</div>
                    <div class="flex justify-between items-center">
                      <div class="font-bold">{{ bedItem.Gender }}</div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getHospitalBedList, getDepartmentDropdown } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import CheckReserveBed from './CheckReserveBed.vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { groupBy } from 'lodash-es'
import { useOpdStore } from 'stores/opd.js'

const opdStore = useOpdStore()
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  hasReservedId: String,
})

const departmentNo = ref(opdStore.opdData.DepartmentId)
const showData = computed(() => {
  const data = groupBy(bedItems.value, 'Floor')
  return data
})

const getDataLoading = ref(false)
const bedItems = ref([])
const GetHospitalBedList = async () => {
  try {
    getDataLoading.value = true
    const query = setSearchQuery({ Area: departmentNo.value, PatientId: opdStore.opdData.PatientId })
    const res = await getHospitalBedList(query)
    if (res.status === 200) {
      bedItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const onBedItemClick = (item) => {
  const dialog = $q
    .dialog({
      component: CheckReserveBed,
      componentProps: {
        data: item,
        departmentNo: departmentNo.value,
        hasReservedId: props.hasReservedId,
      },
    })
    .onOk((IpdId) => {
      dialog.hide()
      onDialogOK(IpdId)
    })
}

const filterLoading = ref(false)
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

const init = async () => {
  GetDepartmentDropdown()
  GetHospitalBedList()
}
init()
</script>

