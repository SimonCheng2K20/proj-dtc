<template>
  <div>
    <my-search-area grid-cols="2" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="護理站">
        <q-select
          v-bind="QSelectProps"
          v-model="search.StationId"
          :options="nursingStationFilterItems"
          option-label="StationName"
          option-value="StationId"
          emit-value
          map-options
          use-input
          @input-value="filterLoading = true"
          @filter="nursingStationFilterHandler"
          @update:model-value="searchSubmit"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="inputValue">
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

      <!-- <BedSelection
        labelName="床號"
        v-model:selectedData="search.BedId"
        useInput
        @update:selected-data="searchSubmit"
      ></BedSelection> -->
    </my-search-area>

    <div class="flex">
      <q-table
        v-bind="QTableProps"
        :columns="columns"
        :rows="ipdStore.ipdList"
        :pagination="ipdStore.pagination"
        :loading="ipdStore.ipdListLoading"
        row-key="IpdId"
        v-model:selected="ipdStore.selected"
        @row-click="onRowSelect"
      >
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="ipdStore.pagination"
            v-on:update:model-value="GetIpdRecordList"
          ></my-pagination>
        </template>
      </q-table>

      <div class="grow border border-[#215DBB] border-r-0">
        <div class="p-1 bg-[#EEF8FF] border-b border-[#215DBB] text-center text-lg font-bold">給藥時程</div>
        <div class="p-1">
          <q-table
            v-bind="QTableProps"
            :columns="normalHeader"
            :rows="MedicationHours"
            no-data-label="此日期無開立用藥醫囑"
            :loading="loadTable"
            wrap-cells
          >
            <template #header-cell-RegularHours="props">
              <q-th :props="props">
                {{ selectedDate }} {{ props.col.label }}
                <q-btn
                  unelevated
                  dense
                  class="mr-1"
                  size="sm"
                  color="white text-black"
                  @click="lastDate()"
                  :disable="loadTable"
                >
                  <q-icon name="chevron_left" />前一日
                </q-btn>
                <q-btn
                  unelevated
                  dense
                  class="ml-1"
                  size="sm"
                  color="white text-black"
                  @click="nextDate()"
                  :disable="loadTable"
                >
                  後一日<q-icon name="chevron_right" />
                </q-btn>
              </q-th>
            </template>
            <template #body-cell-RegularHours="{ col, value, row }">
              <q-td :props="{ col }">
                <template v-if="value">
                  <q-btn label="N" color="purple" round dense unelevated @click="goDrugPerson('RegularHours', row)">
                  </q-btn>
                  <div>{{ value.join(', ') }}</div>
                </template>
              </q-td>
            </template>
            <template #body-cell-StatHours="{ col, value, row }">
              <q-td :props="{ col }">
                <template v-if="value">
                  <q-btn label="S" color="purple" round dense unelevated @click="goDrugPerson('StatHours', row)">
                  </q-btn>
                  <div>{{ value.join(', ') }}</div>
                </template>
              </q-td>
            </template>
            <template #body-cell-PrnHours="{ col, value, row }">
              <q-td :props="{ col }">
                <template v-if="value">
                  <q-btn label="P" color="purple" round dense unelevated @click="goDrugPerson('PrnHours', row)">
                  </q-btn>
                  <div>{{ value.join(', ') }}</div>
                </template>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
      <div class="grow border border-[#215DBB]">
        <div class="p-1 dItem border-b border-[#215DBB] bg-[#EEF8FF] text-center text-lg font-bold">P 診療計畫</div>
        <div class="p-2">
          {{ ipdStore.ipdData.IpdPlan }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getNursingStation, getIpdMedicationHours, getIpdRecordItem } from 'api'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import { useIpdStore } from 'src/stores/ipd'
import { cloneDeep } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import isBetween from 'dayjs/plugin/isBetween'
import { useQuasar } from 'quasar'
dayjs.extend(isBetween)

const $q = useQuasar()
const router = useRouter()
const ipdStore = useIpdStore()

const columns = [
  { name: 'BedName', label: '床號', field: 'BedName', align: 'left' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'left' },
  { name: 'PatientName', label: '病患姓名', field: (row) => row.Patient.Person.Name, align: 'left' },
  {
    name: 'BirthDate',
    label: '出生日期',
    field: (row) => row.Patient.Person.BirthDate?.substring(0, 10),
    align: 'left',
  },
]

const GetIpdRecordList = () => {
  ipdStore.GetIpdRecordList({ $filter: filter.value, $orderBy: orderBy.value })
}

const initData = {}
initData.search = {
  StationId: null,
  BedId: null,
  Status: '2',
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'StationId':
            return filterArray.concat(
              setOdataFilter({ key: 'HospitalBed/NursingStation', value, operator: 'contains' })
            )
          case 'Status':
          case 'BedId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([['ModifyDatetime desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const onRowSelect = (evt, row) => {
  ipdStore.selected = [row]
  GetIpdRecordItem()
  GetIpdMedicationHours()
}

const selectedDate = ref(dayjs(new Date()).format('YYYY-MM-DD'))

const normalHeader = [
  {
    name: 'RegularHours',
    label: '常規',
    field: 'RegularHours',
    align: 'center',
    headerClasses: 'w-[160px]',
  },
  { name: 'StatHours', label: 'STAT', field: 'StatHours', align: 'center' },
  { name: 'PrnHours', label: 'PRN', field: 'PrnHours', align: 'center', headerClasses: 'w-[200px]' },
]
const loadTable = ref(false)

const MedicationHours = ref([])
const GetIpdMedicationHours = async () => {
  loadTable.value = true
  const query = setSearchQuery({ IpdId: ipdStore.selected[0].IpdId, medDate: selectedDate.value })
  try {
    const res = await getIpdMedicationHours(query)
    if (res.status === 200) {
      if (Object.values(res.data).every((i) => i === null)) {
        MedicationHours.value = []
      } else {
        MedicationHours.value = [res.data]
      }
      if (MedicationHours.value[0] !== undefined) {
        const allTime = Object.values(MedicationHours.value[0]).flat()
        const today = dayjs(new Date()).format('YYYY-MM-DD')

        allTime.forEach((time) => {
          const shouldUse =
            dayjs(today + time).add(-30, 'm') < dayjs(new Date()) &&
            dayjs(today + time).add(30, 'm') > dayjs(new Date())
        })
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadTable.value = false
  }
}

const GetIpdRecordItem = async () => {
  try {
    const res = await getIpdRecordItem(ipdStore.selected[0].IpdId)
    ipdStore.setIpdData(res.data)
  } catch (error) {
    console.log(error)
  }
}

const lastDate = () => {
  selectedDate.value = dayjs(selectedDate.value).add(-1, 'day').format('YYYY-MM-DD')
  GetIpdMedicationHours()
}
const nextDate = () => {
  selectedDate.value = dayjs(selectedDate.value).add(1, 'day').format('YYYY-MM-DD')
  GetIpdMedicationHours()
}

const goDrugPerson = (tag, row) => {
  if (selectedDate.value !== dayjs(new Date()).format('YYYY-MM-DD')) {
    $q.notify({
      type: 'negative',
      message: '非當天不能給藥!',
      position: 'top',
    })
    return
  }
  const isInTime = row[tag].some((d) => {
    return dayjs(new Date()).isBetween(
      `${dayjs(new Date()).format('YYYY-MM-DD')} ${d}`,
      dayjs(`${dayjs(new Date()).format('YYYY-MM-DD')} ${d}`).add(1, 'h')
    )
  })

  if (!isInTime) {
    $q.notify({
      type: 'negative',
      message: '非一個小時內不能給藥!',
      position: 'top',
    })
    return
  }

  router.push({
    name: 'NursingStation-Implement-DrugToDo-Person',
    params: { ipdId: ipdStore.selected[0].IpdId },
    query: { medicType: tag },
  })
}

const filterLoading = ref(false)
const nursingStationItems = ref([])
const GetNursingStation = async () => {
  try {
    const res = await getNursingStation()
    nursingStationItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: nursingStationFilterItems, filterHandler: nursingStationFilterHandler } = useFilter(
  { items: nursingStationItems, filterKeys: ['StationName'] },
  () => {
    filterLoading.value = false
  }
)

const init = () => {
  GetNursingStation()
  if (ipdStore.selected[0]) {
    GetIpdMedicationHours()
  }
}
init()
</script>

