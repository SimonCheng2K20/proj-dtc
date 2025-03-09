<template>
  <div class="home">
    <div class="text-xl font-bold text-blue-900 flex items-center">
      <div style="width: fit-content">{{ userName }} 您好，以下是貴單位相關數據:</div>
      <div v-for="item of consultationTypes" :key="item.text" class="p-field-radiobutton ml-3 mr-1 flex items-center" v-show="!isSysManageAccount">
        <RadioButton :id="item.text" name="item" :value="item.value" v-model="selectedType" @change="setChangeTypeData" />
        <label class="ml-2" :for="item.text">{{ item.text }}</label>
      </div>
    </div>
    <div class="chart-fields" v-if="isSysManageAccount || selectedType == 1">
      <sheetArea :identities="selectedType"></sheetArea>

      <div>
        <CompOptions
          title="會診病患來源"
          :itemData="itemData"
          itemKey="barType"
          :options="dateOptions2"
          inputType="radio"
          @click="setRecordStatisticsDatas('type2')"
        />
        <Chart type="bar" :data="aimData" :options="aimPluginOptions" :plugins="plugins" />
      </div>

      <div>
        <CompOptions
          title="單位會診數量"
          :itemData="itemData"
          itemKey="unitType"
          :options="dateOptions3"
          inputType="radio"
          @click="setRecordStatisticsDatas('type3')"
        />
        <Chart type="bar" :data="unitData" :options="lightOptions" :plugins="plugins" />
        <Paginator
          @page="setRecordStatisticsDatas('type3')"
          v-model:first="offset"
          v-model:rows="rows"
          :totalRecords="unitDataTotalItemsCount"
          :rowsPerPageOptions="[5, 10, 15]"
          v-show="+unitDataTotalItemsCount >= 10"
        ></Paginator>
      </div>

      <div class="flex flex-col items-center">
        <div class="w-full cps-options flex items-center justify-start flex-wrap">
          <CompOptions
            title="會診類別"
            :itemData="itemData"
            itemKey="pieType"
            :options="dateOptions"
            inputType="radio"
            @click="setRecordStatisticsDatas('type1')"
          />

          <div v-for="item of catogoryOptions" :key="item.text" class="p-field-radiobutton ml-3 mr-1 flex items-center">
            <RadioButton :id="item.text" name="item" :value="item.value" v-model="selectedCatogory" @change="setRecordStatisticsDatas('type1')" />
            <label class="ml-2" :for="item.text">{{ item.text }}</label>
          </div>
        </div>

        <div>
          <Chart type="pie" :data="charData" :options="pieOptions" :plugins="plugins" />
        </div>
      </div>
    </div>

    <div class="chart-fields-basic-hospital" v-else>
      <sheetArea :identities="selectedType"></sheetArea>

      <div>
        <div>
          <CompOptions
            title="會診病患來源"
            :itemData="itemData"
            itemKey="barType"
            :options="dateOptions2"
            inputType="radio"
            @click="setRecordStatisticsDatas('type2')"
          />
          <Chart type="bar" :data="aimData" :options="aimPluginOptions" :plugins="plugins" />
        </div>

        <div class="flex flex-col items-center">
          <div class="w-full cps-options flex items-center justify-start flex-wrap">
            <CompOptions
              title="會診類別"
              :itemData="itemData"
              itemKey="pieType"
              :options="dateOptions"
              inputType="radio"
              @click="setRecordStatisticsDatas('type1')"
            />

            <div v-for="item of catogoryOptions" :key="item.text" class="p-field-radiobutton ml-3 mr-1 flex items-center">
              <RadioButton :id="item.text" name="item" :value="item.value" v-model="selectedCatogory" @change="setRecordStatisticsDatas('type1')" />
              <label class="ml-2" :for="item.text">{{ item.text }}</label>
            </div>
          </div>

          <div>
            <Chart type="pie" :data="charData" :options="pieOptions" :plugins="plugins" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useStore } from 'vuex'
import CompOptions from 'comps/options.vue'
import buildQuery from 'odata-query'
import dayjs from 'dayjs'

import { getDakarById, getDashboardStatistics, getDashboardUnRecoedList } from 'Service/apis.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import sheetArea from './components/sheetArea.vue'

const offset = ref(0)
const rows = ref(10)
const unitDataTotalItemsCount = ref(1)

const plugins = [ChartDataLabels]
const lightOptions = ref({
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: '#403B39',
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 24,
          },
          align: 'top',
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
        value: {
          color: 'green',
          font: {
            weight: 'bold',
            size: 24,
          },
          align: 'top',
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        // display: false,
        precision: 0,
      },
    },
    y: {
      ticks: {
        // display: false,
        precision: 0,
      },
    },
  },
})

const pieOptions = ref({
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: '#403B39',
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 24,
          },
          align: 'top',
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
        value: {
          color: 'green',
          font: {
            weight: 'bold',
            size: 24,
          },
          align: 'top',
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
      },
    },
  },
  // scales: {
  //   x: {
  //     ticks: {
  //       display: false,
  //     },
  //     grid: {
  //       display: false,
  //     },
  //   },
  //   y: {
  //     ticks: {
  //       display: false,
  //     },
  //     grid: {
  //       display: false,
  //     },
  //   },
  // },
})

const aimPluginOptions = ref({
  indexAxis: 'y',
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      color: '#403B39',
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 24,
          },
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
        value: {
          color: 'green',
          font: {
            weight: 'bold',
            size: 24,
          },
          formatter: function (value, context) {
            return +value > 0 ? value : ''
          },
        },
      },
    },
  },
  scales: {
    y: {
      ticks: {
        precision: 0,
      },
    },
    x: {
      ticks: {
        precision: 0,
      },
    },
  },
})

const $getUniqueItemListBy = inject('$getUniqueItemListBy')

const consultationTypes = ref([
  { value: 1, text: '會診端' },
  { value: 0, text: '諮詢端' },
])

const catogoryOptions = ref([
  {
    text: '全部',
    value: 'all',
  },
  {
    text: '一般',
    value: 1,
  },
  {
    text: '急重症',
    value: 2,
  },
])

const headers = ref([
  { name: '操作', key: '' },
  { name: '日期', key: 'applyTime' },
  { name: '姓名', key: 'PatientName' },
  { name: '諮詢單位', key: 'InstitutionName' },
])

const headersBasicHospital = ref([
  { name: '操作', key: '' },
  { name: '日期', key: 'applyTime' },
  { name: '姓名', key: 'PatientName' },
  { name: '會診醫師', key: 'MeetingMemberAccounts' },
])

const items = ref([])
const itemsTotal = ref(0)
const itemsForShow = ref([])

const store = useStore()

const itemData = ref({
  pieType: 'year',
  barType: 'year2',
  unitType: 'year3',
})

const userName = computed(() => store.state.dakar.Name)

const selectedType = ref(1)
const selectedCatogory = ref('all')

const isSysManageAccount = computed(() => {
  const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : []
  return userRoles.includes('Admins') || userRoles.includes('HealthBureau')
})

const belongArr = ref([])

const dateOptions = [
  { text: '當年度', value: 'year' },
  { text: '當月', value: 'month' },
]
const dateOptions2 = [
  { text: '當年度', value: 'year2' },
  { text: '當月', value: 'month2' },
]
const dateOptions3 = [
  { text: '當年度', value: 'year3' },
  { text: '當月', value: 'month3' },
]

const charData = ref({
  labels: ['一般會診', '急重症', '其他'],
  datasets: [
    {
      data: [0, 0, 0],
      backgroundColor: ['#3a9ee2', '#f6c75c', '#f47078'],
    },
  ],
})

const aimData = ref({
  labels: [itemData.value.barType === 'year' ? '年' : '月'],
  datasets: [
    {
      label: '本地',
      backgroundColor: '#4790f6',
      data: [0],
    },
    {
      label: '外地',
      backgroundColor: '#f5c664',
      data: [0],
    },
    {
      label: '未知',
      backgroundColor: '#f26e7a',
      data: [0],
    },
  ],
})

const unitData = ref({
  labels: [itemData.value.unitType === 'year' ? '年' : '月'],
  datasets: [
    // {
    //   label: "單位1",
    //   backgroundColor: "#42A5F5",
    //   data: [50 * (itemData.value.unitType === "year" ? 12 : 1)],
    // },
  ],
})

const tableColumns = [
  { key: 'diagnosisDate', label: '日期', type: 'text' },
  { key: 'unit', label: '諮詢單位', type: 'text' },
]

const getInsitutionBelong = async () => {
  const res = await getDashboardStatistics()

  let { AssistHospitalStatistics, Identities, StationStatistics } = res.data
  //Identities 0代表為 醫療站(基層醫院)
  //Identities 1代表為 協助的醫院(重度急救責任醫院 or 合作醫院)
  //Identities 2代表為 管理者

  sessionStorage.setItem('groupbelong', JSON.stringify(Identities))
  belongArr.value = Identities

  allAssistHospitalStatisticsData.value = { ...AssistHospitalStatistics }

  allStationStatisticsData.value = { ...StationStatistics }
  // }
}

const setConsultationTypes = async () => {
  // groupbelong-- 1:醫療站 、2or3:協助的醫院(JANUS給的是 Identities 0:醫療站 、1:協助的醫院)
  let arr = belongArr.value.map((s) => s)

  if (arr.includes(0) && !arr.includes(1)) {
    selectedType.value = 0
    consultationTypes.value = [{ value: 0, text: '諮詢端' }]
  } else if (!arr.includes(0) && arr.includes(1)) {
    selectedType.value = 1
    consultationTypes.value = [{ value: 1, text: '會診端' }]
  } else if (arr.includes(2)) {
    selectedType.value = 1
  }
}

const getData = async (data = {}) => {
  const indentity = selectedType.value
  const top = data.top ? data.top : 15
  const skip = data.skip ? data.skip : 0
  const obj = { top, skip }
  let qs = buildQuery(obj)

  let arr = []

  const res = await getDashboardUnRecoedList(qs + `&identities=${indentity}`)
  let { Items, Count } = res.data

  arr = Items.map((s) => ({
    applyTime: Boolean(s.ApplyTime) ? s.ApplyTime.split('T')[0] + ' ' + s.ApplyTime.split('T')[1] : '',

    ...s,
  }))

  items.value = [...arr]
  itemsTotal.value = Count
}

const currentStatisData = ref({})
const allNowYearStatisData = ref({})
const allNowMonthStatisData = ref({})

const allAssistHospitalStatisticsData = ref({})
const allStationStatisticsData = ref({})

const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

const setRecordStatisticsDatas = (type) => {
  let allNowStsticData = { Month: {}, UnRecoedCount: 0, Year: {} }

  if (selectedType.value == 1) {
    allNowStsticData.Month = {
      ...allAssistHospitalStatisticsData.value.Month,
    }
    allNowStsticData.UnRecoedCount = allAssistHospitalStatisticsData.value.UnRecoedCount
    allNowStsticData.Year = {
      ...allAssistHospitalStatisticsData.value.Year,
    }
  } else if (selectedType.value == 0) {
    allNowStsticData.Month = {
      ...allStationStatisticsData.value.Month,
    }
    allNowStsticData.UnRecoedCount = allStationStatisticsData.value.UnRecoedCount
    allNowStsticData.Year = {
      ...allStationStatisticsData.value.Year,
    }
  }

  const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''

  if (!Boolean(type)) {
    return
  }

  if (type == 'type1') {
    let allData = {}

    if (itemData.value.pieType == 'month') {
      allData = { ...allNowStsticData.Month }
    } else {
      allData = { ...allNowStsticData.Year }
    }

    let allStsticNumData = {}
    let allStsticNumDataArr = []

    if (selectedCatogory.value == 'all') {
      charData.value.labels = ['一般會診', '急重症', '其他']
      charData.value.datasets[0].backgroundColor = ['#3a9ee2', '#f6c75c', '#f47078']
      allStsticNumData.data1 = allData.GeneralConsultationCount //一般會診
      allStsticNumData.data2 = allData.SevereConsultationCount //急重症
      allStsticNumData.data3 = allData.OtherConsultationCount //其他

      allStsticNumDataArr = [allStsticNumData.data1, allStsticNumData.data2, allStsticNumData.data3]
    } else if (+selectedCatogory.value == 1) {
      charData.value.labels = ['內科', '外科', '兒科', '婦產科', '一般會診其他']
      charData.value.datasets[0].backgroundColor = ['#3a9ee2', '#f6c75c', '#f47078', '#51c1bf', '#fd9d49']

      allStsticNumData.data4 = allData.內科會診數 //內科
      allStsticNumData.data5 = allData.外科會診數 //外科
      allStsticNumData.data6 = allData.兒科會診數 //兒科
      allStsticNumData.data7 = allData.婦產科會診數 //婦產科
      allStsticNumData.data8 = allData.一般其他會診數 //一般其他

      allStsticNumDataArr = [allStsticNumData.data4, allStsticNumData.data5, allStsticNumData.data6, allStsticNumData.data7, allStsticNumData.data8]
    } else if (+selectedCatogory.value == 2) {
      charData.value.labels = ['急診', '急性腦中風', '緊急外傷', '心肌梗塞', '急重症其他']
      charData.value.datasets[0].backgroundColor = ['#3a9ee2', '#f6c75c', '#f47078', '#51c1bf', '#fd9d49']

      allStsticNumData.data9 = allData.急診會診數 //急診
      allStsticNumData.data10 = allData.急性腦中風會診數 //急性腦中風
      allStsticNumData.data11 = allData.緊急外傷會診數 //緊急外傷
      allStsticNumData.data12 = allData.心肌梗塞會診數 //心肌梗塞
      allStsticNumData.data13 = allData.急重症其他會診數 //其他

      allStsticNumDataArr = [allStsticNumData.data9, allStsticNumData.data10, allStsticNumData.data11, allStsticNumData.data12, allStsticNumData.data13]
    }

    charData.value.datasets[0].data = allStsticNumDataArr
  } else if (type == 'type2') {
    let allData2 = {}

    if (itemData.value.barType == 'month2') {
      aimData.value.labels = [`${+dayjs(new Date()).format('MM')}月`]
      allData2 = { ...allNowStsticData.Month }
    } else {
      aimData.value.labels = [`${dayjs(new Date()).format('YYYY')}年`]
      allData2 = { ...allNowStsticData.Year }
    }

    let data1 = allData2.PatientInsideCount //本地
    let data2 = allData2.PatientOutsideCount //外地
    let data3 = allData2.PatientUnknowCount //未知

    aimData.value.datasets[0].data = [data1]
    aimData.value.datasets[1].data = [data2]
    aimData.value.datasets[2].data = [data3]
  } else if (type == 'type3') {
    let allData3 = {}
    let allInstitution = []
    let uniqueInstitution = []
    let partialUniqueInstitution = []

    const page = +offset.value / +rows.value + +1
    const skip = (page - 1) * rows.value
    const top = rows.value

    if (itemData.value.unitType == 'month3') {
      unitData.value.labels = [`${+dayjs(new Date()).format('MM')}月`]
      allData3 = { ...allNowStsticData.Month }
    } else {
      unitData.value.labels = [`${dayjs(new Date()).format('YYYY')}年`]
      allData3 = { ...allNowStsticData.Year }
    }
    if (Boolean(allData3.StationSheetCount)) {
      let allColor = ['#fd6185', '#fd9d49', '#fecc5f', '#51c1bf', '#4790f6', '#9868fc', '#c9cbcf']

      allInstitution = allData3.StationSheetCount.map((s, id) => ({
        label: s.StationName,
        // backgroundColor:
        //   "hsla(" + ~~(360 * Math.random()) + "," + "50%," + "68%,1)",
        data: [s.Count],
      }))

      uniqueInstitution = getUniqueListBy(allInstitution, 'label')

      uniqueInstitution = uniqueInstitution.filter((s) => s.data != 0)

      uniqueInstitution = uniqueInstitution.map((s, id) => {
        s.backgroundColor = allColor[`${id % 7}`]
        return s
      })

      unitDataTotalItemsCount.value = uniqueInstitution.length

      partialUniqueInstitution = uniqueInstitution.slice(skip, top + skip)
    }

    unitData.value.datasets = [...partialUniqueInstitution]
  }
}

//for the sheet can check is same institution or not
async function getAcountOtherData() {
  const isAlreadyExist = store.state?.others && store.state?.others.No == store.state?.dakar.No ? store.state?.others.No : ''
  if (Boolean(isAlreadyExist)) {
    return
  }
  const accountNo = store.state?.dakar ? store.state?.dakar.No : ''

  const { data } = await getDakarById(`${accountNo}`)
  store.commit('m_setOthersData', data)
}

const setChangeTypeData = async () => {
  await getData()

  setRecordStatisticsDatas('type1')
  setRecordStatisticsDatas('type2')
  setRecordStatisticsDatas('type3')
}

onMounted(async () => {
  await getAcountOtherData()
  await getInsitutionBelong() //設置 groupbelong
  await setConsultationTypes() //設置 selectedType

  await setChangeTypeData() //取得統計資料和尚未完成會診單填寫的清單資料
})
</script>

<style lang="scss" scoped>
.home {
  @apply p-2 sm:p-6;
  .chart-fields {
    @apply grid grid-cols-1 max-w-full sm:max-w-7xl sm:grid-cols-2 mx-auto gap-2 p-2 sm:p-4;
    max-width: 85rem;
    padding-top: 8px;
    > div {
      @apply border rounded-lg p-2;
      .doctor-sheet-table {
        height: 340px;
        overflow: auto;
      }
    }
  }
  .chart-fields-basic-hospital {
    @apply grid grid-cols-1 max-w-full sm:max-w-7xl sm:grid-cols-2 mx-auto gap-2 p-2 sm:p-4;
    max-width: 85rem;
    padding-top: 8px;
    > div {
      @apply border rounded-lg p-2;
      .basic-hospital-sheet-table {
        height: 697px;
        overflow: auto;
      }
    }
  }
  ::v-deep(.cps-options .title),
  .title {
    @apply text-xl font-bold text-blue-900 ml-2;
  }
}
</style>
