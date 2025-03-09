<template>
  <div>
    <div class="flex gap-2">
      <Button :style="tab === 'unRecord' ? 'background: grey' : ''" @click="tab = 'meeting'">
        <i v-if="tab === 'meeting'" class="pi pi-check"></i>
        <span>會診中｜{{ meetingPageOptions.totalItemsCount }} 筆</span>
      </Button>

      <Button :style="tab === 'meeting' ? 'background: grey' : ''" @click="tab = 'unRecord'">
        <i v-if="tab === 'unRecord'" class="pi pi-check"></i>
        <span>尚未完成會診單填寫｜{{ unRecordPageOptions.totalItemsCount }} 筆</span>
      </Button>
    </div>
    <div>
      <my-table
        v-if="tab === 'meeting'"
        :style="props.identities === 0 ? {'height': altHeight + 'px'} : {'height': '360px'}"
        :headers="meetingHeaders"
        :items="meetingItems"
        :loading="meetingLoading"
        :pageOptions="meetingPageOptions"
        @pageChange="GetSheetList"
        v-model:sortBy="meetingSortBy"
        @sort="meetingSearchSubmit"
      >
        <template #item-action="{ item }">
          <Button class="p-button-sm p-button-primary" @click="toMeeting(item)">前往</Button>
        </template>
      </my-table>

      <my-table
        v-if="tab === 'unRecord'"
        :style="props.identities === 0 ? {'height': altHeight + 'px'} : {'height': '360px'}"
        :headers="unRecordHeaders"
        :items="unRecordItems"
        :loading="unRecordLoading"
        :pageOptions="unRecordPageOptions"
        @pageChange="GetSheetList"
        v-model:sortBy="unRecordSortBy"
        @sort="unRecordSearchSubmit"
      >
        <template #item-action="{ item }">
          <Button class="p-button-sm p-button-primary" @click="toMeeting(item)">前往</Button>
        </template>
      </my-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getSheetList, getDashboardUnRecoedList } from 'Service/apis.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  identities: Number,
})

const route = useRoute()
const router = useRouter()
const tab = ref('meeting')
const store = useStore()

const altHeight = 40 * 15 + 44 + 42 + 60

watch(tab, (val) => {
  if (val === 'meeting') GetSheetList()
  else GetDashboardUnRecoedList()
})

const meetingHeaders = reactive([
  { key: 'action', text: '操作', value: 'action', width: '25%' },
  { key: 'ApplyTime', text: '日期', value: (row) => row.ApplyTime.substring(0, 10), width: '25%' },
  { key: 'Name', text: '姓名', value: (row) => row.Patient.Name, width: '25%' },
  { key: 'InstitutionName', text: '諮詢單位', value: 'InstitutionName', width: '25%' },
])

const meetingLoading = ref(false)
const meetingItems = ref([])
const GetSheetList = async () => {
  try {
    meetingLoading.value = true
    const query = setSearchQuery({
      $top: meetingPageOptions.perPageCount,
      $skip: meetingPageOptions.firstIndex,
      $filter: `Status eq 10`,
      $orderBy: meetingOrderBy.value,
    })
    const res = await getSheetList(query)
    if (res.status === 200) {
      meetingItems.value = res.data.Items
      meetingPageOptions.totalItemsCount = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    meetingLoading.value = false
  }
}

const meetingPageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const meetingSortBy = ref([['ApplyTime', 'desc']])
const meetingOrderBy = computed(() => {
  const orderByArr = []
  meetingSortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const meetingSearchSubmit = () => {
  meetingPageOptions.firstIndex = 0
  GetSheetList()
}

const toMeeting = (item) => {
  store.commit('m_setEditItem', item)
  router.push({
    name: 'formalForm',
    params: { item: item.Id },
    query: { back: route.fullPath },
  })
}

const unRecordHeaders = reactive([
  { key: 'action', text: '操作', value: 'action', width: '25%' },
  { key: 'ApplyTime', text: '日期', value: (row) => row.ApplyTime.substring(0, 10), width: '25%' },
  { key: 'PatientName', text: '姓名', value: 'PatientName', width: '25%' },
  { key: 'InstitutionName', text: '諮詢單位', value: 'InstitutionName', width: '25%' },
])

const unRecordLoading = ref(false)
const unRecordItems = ref([])
const GetDashboardUnRecoedList = async () => {
  try {
    unRecordLoading.value = true
    const query = setSearchQuery({
      identities: props.identities,
      $top: unRecordPageOptions.perPageCount,
      $skip: unRecordPageOptions.firstIndex,
      $orderBy: unRecordOrderBy.value,
    })
    const res = await getDashboardUnRecoedList(query)
    if (res.status === 200) {
      unRecordItems.value = res.data.Items
      unRecordPageOptions.totalItemsCount = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    unRecordLoading.value = false
  }
}

const unRecordPageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const unRecordSortBy = ref([['Sheet/ApplyTime', 'desc']])
const unRecordOrderBy = computed(() => {
  const orderByArr = []
  unRecordSortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const unRecordSearchSubmit = () => {
  unRecordPageOptions.firstIndex = 0
  GetDashboardUnRecoedList()
}
const init = async () => {
  await GetSheetList()
  await GetDashboardUnRecoedList()
  // console.log(props.identities)
}
init()
</script>
