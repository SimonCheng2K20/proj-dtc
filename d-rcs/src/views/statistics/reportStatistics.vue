<template>
  <section class="dtc-main-section px-3">
    <section style="background: #fbfcf9; border: 1px solid #bdbdbd; border-radius: 0.25rem 0.25rem 0 0">
      <h5 class="router-title big-title">會診記錄統計作業</h5>
      <div class="flex flex-col 2xl:flex-row gap-2 p-2">
        <my-input-group class="grid md:grid-cols-2 2xl:grid-cols-3 gap-2">
          <my-input-wrapper label="年度">
            <Dropdown
              v-model="search.ApplyTimeYear"
              :options="yearOptions"
              placeholder="全部"
              optionLabel="text"
              optionValue="value"
              @change="searchSubmit"
              :filter="true"
              showClear
            />
          </my-input-wrapper>
          <my-input-wrapper label="月度">
            <Dropdown
              v-model="search.ApplyTimeMonth"
              :options="monthOptions"
              placeholder="全部"
              optionLabel="text"
              optionValue="value"
              @change="searchSubmit"
              :filter="true"
              showClear
            />
          </my-input-wrapper>
          <my-input-wrapper label="會診申請時間">
            <Calendar class="calendar" v-model="search.ApplyTimeStart" :showIcon="true" :manualInput="true" dateFormat="yy/mm/dd" v-date-input />
            <span class="mx-1 flex items-center">~</span>
            <Calendar class="calendar" v-model="search.ApplyTimeEnd" :showIcon="true" :manualInput="true" dateFormat="yy/mm/dd" v-date-input />
          </my-input-wrapper>

          <my-input-wrapper label="類別" class="2xl:col-span-2">
            <Dropdown
              v-model="search.ConsultationType"
              :options="catogoryOptions1"
              placeholder="全部"
              optionLabel="text"
              optionValue="value"
              class="mr-2"
              @change="setOption2(search.ConsultationType)"
              :filter="true"
              showClear
            />
            <Dropdown
              v-model="search.SubType"
              :options="catogoryOptions2"
              placeholder="全部"
              optionLabel="text"
              optionValue="value"
              class=""
              @change="searchSubmit"
              :filter="true"
              showClear
            />
          </my-input-wrapper>
        </my-input-group>
        <div class="flex items-start justify-end flex-shrink-0 gap-2">
          <Button style="background: #0c69e1" @click="searchSubmit"> 查詢 </Button>
          <Button style="background: #6a9f3e" @click="searchClear"> 清除 </Button>
          <Button @click="GetSheetExcel" class="p-button-danger">匯出Excel</Button>
        </div>
      </div>
    </section>

    <div class="p-2 text-xl">
      總計會診件數:
      <span class="font-semibold underline statistic-content">{{ statisticsData.Count || 0 }}</span
      ><span class="mr-2">筆</span> 一般會診件數: <span class="font-semibold underline statistic-content">{{ statisticsData.General || 0 }}</span
      ><span class="mr-2">筆</span> 急重症會診件數: <span class="font-semibold underline statistic-content">{{ statisticsData.Severe || 0 }}</span
      ><span class="mr-2">筆</span> 其他會診件數: <span class="font-semibold underline statistic-content">{{ statisticsData.Other || 0 }}</span
      >筆
    </div>
    <my-table
      class="max-h-[688px]"
      :headers="headers"
      :items="items"
      :loading="loading"
      v-model:sortBy="sortBy"
      @sort="searchSubmit"
      :pageOptions="pageOptions"
      @pageChange="pageChange"
    ></my-table>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { getRecordStatistics, getSheetExcel } from 'Service/apis.js'
import dayjs from 'dayjs'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'

const headers = reactive([
  { text: '會診申請時間', key: 'ApplyTime', value: 'ApplyTime', sortable: true },
  { text: '諮詢單位', key: 'InstitutionNo', value: 'InstitutionNo', sortable: true },
  { text: '諮詢醫師', key: 'CreateAccountNo', value: 'CreateAccountNo', sortable: true },
  { text: '會診醫師', key: 'CreateAccountName', value: 'CreateAccountName' },
  { text: '病患姓名', key: 'Name', value: (row) => row.Patient.Name },
  { text: '病患來源', key: 'Area', value: (row) => row.Patient.Area },
  { text: '類別', key: 'ConsultationType', value: (row) => catogoryOptions1.value.find((item) => item.value === row.ConsultationType).text },
  { text: '子類別', key: 'SubType', value: 'SubType' },
  { text: '身分證字號', key: 'Identifier', value: (row) => row.Patient.Identifier },
  { text: '性別', key: 'GenderCode', value: (row) => row.Patient.GenderCode },
  { text: '年齡', key: 'PatientAge', value: 'PatientAge', sortable: true },
])

const items = ref([])

const statisticsData = reactive({
  Count: 0,
  Other: 0,
  Severe: 0,
  General: 0,
})

const toast = useToast()
const loading = ref(false)
const GetRecordStatistics = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $skip: pageOptions.firstIndex,
      $top: pageOptions.perPageCount,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getRecordStatistics(query)
    items.value = res.data.Items
    pageOptions.totalItemsCount = res.data.Count
    statisticsData.Count = res.data.Count
    statisticsData.Other = res.data.Other
    statisticsData.Severe = res.data.Severe
    statisticsData.General = res.data.General
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const sortBy = ref([['ApplyTime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const initData = {}
initData.search = {
  ApplyTimeYear: null,
  ApplyTimeMonth: null,
  ApplyTimeStart: null,
  ApplyTimeEnd: null,
  ConsultationType: null,
  SubType: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'SubType':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'ConsultationType':
          return setOdataFilter({ key, value, operator: 'eq' })
        case 'ApplyTimeYear':
          return setOdataFilter({ key: 'ApplyTime', value, operator: 'eq', dateMethod: 'year' })
        case 'ApplyTimeMonth':
          return setOdataFilter({ key: 'ApplyTime', value, operator: 'eq', dateMethod: 'month' })
        case 'ApplyTimeStart':
          return setOdataFilter({ key: 'ApplyTime', value: encodeURIComponent(dayjs(value).format()), operator: 'ge' })
        case 'ApplyTimeEnd':
          return setOdataFilter({ key: 'ApplyTime', value: encodeURIComponent(dayjs(value).format()), operator: 'le' })
      }
    })
    .join(' and ')
})

const pageChange = () => {
  GetRecordStatistics()
}

const searchSubmit = () => {
  pageOptions.firstIndex = 0
  GetRecordStatistics()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pageOptions.firstIndex = 0
  GetRecordStatistics()
}

const yearOptions = ref([])
const monthOptions = ref([])
const catogoryOptions1 = ref([
  {
    text: '全部',
    value: null,
  },
  {
    text: '一般',
    value: 1,
  },
  {
    text: '急重症',
    value: 2,
  },
  {
    text: '其他',
    value: 0,
  },
])
const catogoryOptions2 = ref([])

let years = new Array(10).fill().map((s, i) => new Date().getFullYear() - i)

yearOptions.value = years.map((s) => ({
  value: s,
  text: s,
}))

yearOptions.value.unshift({ value: null, text: '全部' })

for (let i = 1; i <= 12; i += 1) {
  monthOptions.value.push({
    text: i,
    value: i,
  })
}
monthOptions.value.unshift({ value: null, text: '全部' })

const setOption2 = (data) => {
  search.SubType = null
  if (+data == 1) {
    catogoryOptions2.value = [
      {
        value: null,
        text: '全部',
      },
      {
        value: '內科',
        text: '內科',
      },
      {
        value: '外科',
        text: '外科',
      },
      {
        value: '兒科',
        text: '兒科',
      },
      {
        value: '婦產科',
        text: '婦產科',
      },
      {
        value: '其他',
        text: '其他',
      },
    ]
  } else if (+data == 2) {
    catogoryOptions2.value = [
      {
        value: null,
        text: '全部',
      },
      {
        value: '急診',
        text: '急診',
      },
      {
        value: '急性腦中風',
        text: '急性腦中風',
      },
      {
        value: '緊急外傷',
        text: '緊急外傷',
      },
      {
        value: '心肌梗塞',
        text: '心肌梗塞',
      },
      {
        value: '其他',
        text: '其他',
      },
    ]
  } else if (+data == 0) {
    catogoryOptions2.value = []
  }
  searchSubmit()
}

const GetSheetExcel = async () => {
  try {
    const query = setSearchQuery({
      $skip: pageOptions.firstIndex,
      $top: pageOptions.perPageCount,
      $filter: !!filter.value ? filter.value + ' and Status gt 10' : 'Status gt 10',
      $orderBy: orderBy.value,
    })
    const res = await getSheetExcel(query)
    const url = window.URL.createObjectURL(res.data)
    const filename = decodeURIComponent(res.headers['content-disposition'].match(/filename\*=.*''(.*)/)[1])
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  GetRecordStatistics()
}
init()
</script>

<style lang="scss" scoped>
.statistic-content {
  color: #4a91f3;
  margin-right: 3px;
}
</style>
