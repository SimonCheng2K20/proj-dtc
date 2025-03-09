<template>
  <q-page class="p-2">
    <my-title>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="pr-3 pl-2">門診總覽清單</div>
          <div class="flex pr-4" style="font-size: 22px">
            <span class="mr-3">{{ clinicData.DoctorName }}</span>
            <span class="mr-3">{{ clinicData.TimeSlotName }}</span>
            <span class="mr-3">{{ clinicData.DepartmentName }}</span>
            <span>{{ clinicData.RoomName }}</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <q-btn class="header-btn" label="輔助功能" unelevated dense></q-btn>
          <q-btn class="header-btn" label="單據補印" unelevated dense></q-btn>
          <q-btn class="header-btn" label="卡機功能" unelevated dense></q-btn>
          <q-btn
            class="header-btn"
            label="修改歷史資料"
            unelevated
            dense
            @click="$router.push({ name: 'OpdHistory' })"
          ></q-btn>
        </div>
      </div>
    </my-title>

    <div class="no-wrap mb-3 flex gap-2">
      <my-search-area
        class="grow"
        grid-cols="3"
        @search-submit="searchSubmit"
        @search-clear="searchClear"
        style="border: #ccc 1px solid"
      >
        <my-input-wrapper label="看診時段">
          <q-select
            v-bind="QSelectProps"
            v-model="search.TimeSlotNo"
            :options="timeSlotItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
      </my-search-area>

      <div class="grid w-[320px] gap-2 rounded bg-[#ffffdb] p-2" style="border: #ccc 1px solid">
        <div>
          <span>目前診號：</span>
          <span class="text-red font-bold" v-if="!storeSeqObj.Seq">{{ storeSeqObj.Seq }}</span>
          <span class="text-blue font-bold" v-else>{{ storeSeqObj.Seq }}</span>
        </div>
        <div>
          <span>看診病患：</span>
          <span class="text-blue font-bold">{{ storeSeqObj.Name }}</span>
        </div>
        <div>
          <span
            >等待人數：<span class="text-blue font-bold">{{ rows[2].length }}</span></span
          >
          <span class="mx-1"> | </span>
          <span
            >未報到人數：<span class="text-blue font-bold">{{ rows[1].length }}</span></span
          >
        </div>
        <div>
          <div class="flex justify-center gap-2">
            <q-btn label="下一號" color="primary" @click="toNextPatient" unelevated></q-btn>
            <q-btn label="過號" color="green" @click="passPatient" unelevated></q-btn>
            <q-btn label="門診結束" color="purple" unelevated></q-btn>
          </div>
        </div>
      </div>
    </div>

    <q-tabs
      class="mt-2"
      v-model="currentTab"
      content-class="gap-2"
      indicator-color="primary"
      active-bg-color="primary"
      active-color="white"
      align="left"
      dense
      @update:model-value="onTabChange"
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
        class="border border-blue-500"
      ></q-tab>
    </q-tabs>
    <q-table
      v-bind="QTableProps"
      :rows="rows[currentTab]"
      :columns="columns"
      row-key="OpdId"
      :pagination="pagination[currentTab]"
      :loading="loading[currentTab]"
    >
      <template #body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn
            v-if="currentTab === attendData.notCheckIn"
            color="green"
            label="報到"
            unelevated
            dense
            @click="onRegisterClick(row.RegId)"
          ></q-btn>
          <q-btn
            v-if="currentTab !== attendData.hasBeenSee && currentTab !== attendData.notCheckIn"
            color="primary"
            label="看診"
            unelevated
            dense
            @click="checkPatient(row.RegId, row)"
          >
          </q-btn>
        </q-td>
      </template>

      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="pagination[currentTab]"
          v-on:update:model-value="onPageChange"
        ></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getRoomBooking, roomBookingChangeStatus, getSequence, getDoctorAttend, postOpd, getNextRegId } from 'api'
import { ref, reactive, computed, onBeforeUnmount, watch, nextTick, onMounted } from 'vue'
import { cloneDeep } from 'lodash'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { genderCodeItems } from 'utils/options.js'
import dayjs from 'dayjs'
import { useAuthStore } from 'stores/auth'
import { useGlobalStore } from 'src/stores/global'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { store } from 'quasar/wrappers'
import { set } from 'lodash-es'

const authStore = useAuthStore()
const globalStore = useGlobalStore()

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// 0 預約 1 未報到 2 未看診 3 已看診 4 過號 5 暫存 6 完成醫囑(未批價) 7 未批價 8 批價完成 9 領藥 C 取消掛號
const attendData = {
  notCheckIn: '1',
  notSeeDoctor: '2',
  hasBeenSee: '6',
  passNumber: '4',
  tempSave: '5',
}

const currentTab = ref(null)

const onTabChange = () => {
  setQueryFromData()
}

const tabs = computed(() => [
  {
    label: `已報到(${pagination[attendData.notSeeDoctor].rowsNumber})`,
    value: attendData.notSeeDoctor,
  },
  {
    label: `暫存(${pagination[attendData.tempSave].rowsNumber})`,
    value: attendData.tempSave,
  },
  {
    label: `已過號(${pagination[attendData.passNumber].rowsNumber})`,
    value: attendData.passNumber,
  },
  {
    label: `未報到(${pagination[attendData.notCheckIn].rowsNumber})`,
    value: attendData.notCheckIn,
  },
  {
    label: `已看診(${pagination[attendData.hasBeenSee].rowsNumber})`,
    value: attendData.hasBeenSee,
  },
])

const columns = computed(() => {
  const arr = [
    { name: 'Seq', label: '診號', field: 'Seq', align: 'right' },
    { name: 'PatientId', label: '病歷號碼', field: 'PatientId', align: 'left' },
    { name: 'Name', label: '病患姓名', field: (row) => row.Patient.Person.Name, align: 'left' },
    { name: 'Pacs', label: '影像到位', field: 'Pacs', align: 'left' },
    { name: 'Laboratory', label: '檢驗到位', field: 'Laboratory', align: 'left' },
    {
      name: 'GenderCode',
      label: '性別',
      field: (row) => genderCodeItems.find((item) => item.value === row.Patient.Person.GenderCode)?.label,
      align: 'left',
    },
    { name: 'Age', label: '年齡', field: (row) => row.Age + ' 歲', align: 'left' },
    { name: 'IdentityName', label: '健保身份', field: 'IdentityName', align: 'left' },
    { name: 'TimeSlotName', label: '看診時段', field: 'TimeSlotName', align: 'left' },
    { name: 'DoctorName', label: '醫生', field: 'DoctorName', align: 'left' },
    { name: 'AttendName', label: '狀態', field: 'AttendName', align: 'left' },
  ]

  if (currentTab.value !== attendData.hasBeenSee) {
    arr.unshift({ name: 'action', label: '操作', field: 'action', align: 'center' })
  }

  return arr
})

const loading = reactive({
  [attendData.notSeeDoctor]: false,
  [attendData.tempSave]: false,
  [attendData.passNumber]: false,
  [attendData.notCheckIn]: false,
  [attendData.hasBeenSee]: false,
})

const rows = reactive({
  [attendData.notSeeDoctor]: [],
  [attendData.tempSave]: [],
  [attendData.passNumber]: [],
  [attendData.notCheckIn]: [],
  [attendData.hasBeenSee]: [],
})

const rowsAll = reactive({
  [attendData.notSeeDoctor]: [],
  [attendData.tempSave]: [],
  [attendData.passNumber]: [],
  [attendData.notCheckIn]: [],
  [attendData.hasBeenSee]: [],
})

const GetRoomBooking = async ({ status }) => {
  let attendStatus = ''
  if (status === '6') {
    attendStatus = `Attend eq '6' or Attend eq '8' or Attend eq '9'`
  } else {
    attendStatus = `Attend eq '${status}'`
  }
  try {
    loading[status] = true
    const currentPagination = pagination[status]
    const query = setSearchQuery({
      doctorId: authStore.userData.No,
      $top: currentPagination.rowsPerPage,
      $skip: (currentPagination.page - 1) * currentPagination.rowsPerPage,
      $filter: filter.value ? filter.value + ` and (${attendStatus})` : `${attendStatus}`,
      $orderBy: orderBy.value,
    })
    const res = await getRoomBooking(query)
    if (res.status === 200) {
      rows[status] = res.data.Items
      pagination[status].rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading[status] = false
  }
}

const GetRoomBookingS2 = async ({ status }) => {
  let attendStatus = ''
  if (status === '6') {
    attendStatus = `Attend eq '6' or Attend eq '8' or Attend eq '9'`
  } else {
    attendStatus = `Attend eq '${status}'`
  }
  try {
    loading[status] = true
    const query = setSearchQuery({
      doctorId: authStore.userData.No,
      $filter: `(${dateFilter.value}) and (TimeSlotNo eq '${clinicData.value?.TimeSlotNo}') and (${attendStatus})`,
      $orderBy: orderBy.value,
    })
    const res = await getRoomBooking(query)
    if (res.status === 200) {
      rowsAll[status] = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading[status] = false
  }
}

const initData = {}
initData.pagination = {
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
}
const pagination = reactive({
  [attendData.notSeeDoctor]: cloneDeep(initData.pagination),
  [attendData.tempSave]: cloneDeep(initData.pagination),
  [attendData.passNumber]: cloneDeep(initData.pagination),
  [attendData.notCheckIn]: cloneDeep(initData.pagination),
  [attendData.hasBeenSee]: cloneDeep(initData.pagination),
})

initData.search = {
  TimeSlotNo: null,
  PatientId: null,
  'Patient/Person/Name': null,
}
const search = reactive(cloneDeep(initData.search))

const dateFilter = computed(() => {
  let tempDate = `BookingDate ge ${encodeURIComponent(
    dayjs().format('YYYY-MM-DD')
  )} and BookingDate lt ${encodeURIComponent(dayjs().add(1, 'day').format('YYYY-MM-DD'))}`

  return tempDate
})

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PatientId':
          case 'Patient/Person/Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'TimeSlotNo':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str ? str + ` and (${dateFilter.value})` : dateFilter.value
})

const sortBy = ref([['Seq', 'asc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination[currentTab.value].page = 1
  GetRoomBooking({ status: currentTab.value })
  setQueryFromData()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination[currentTab.value].page = 1
  GetRoomBooking({ status: currentTab.value })
  setQueryFromData()
}

const onPageChange = () => {
  GetRoomBooking({ status: currentTab.value })
  setQueryFromData()
}

const timeSlotItems = [
  { No: '1', Name: '上午' },
  { No: '2', Name: '下午' },
  { No: '3', Name: '夜間' },
]

const clinicData = ref({
  DoctorId: null,
  DoctorName: null,
  TimeSlotNo: null,
  TimeSlotName: null,
  DepartmentNo: null,
  DepartmentName: null,
  RoomNo: null,
  RoomName: null,
})

const GetDoctorAttend = async () => {
  try {
    const res = await getDoctorAttend()
    clinicData.value = res.data
    search.TimeSlotNo = clinicData.value?.TimeSlotNo
  } catch (e) {
    console.log(e)
  }
}

const onRegisterClick = async (regId) => {
  const { error } = await RoomBookingChangeStatus({ RegId: regId, SetAttend: attendData.notSeeDoctor })
  if (!error) {
    $q.notify({
      type: 'positive',
      message: '報到成功',
      position: 'top',
    })
    currentTab.value = attendData.notSeeDoctor
    setQueryFromData()
  }
}

const RoomBookingChangeStatus = async (data) => {
  try {
    const res = await roomBookingChangeStatus(data)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const toOpdDetail = async (regId, row) => {
  const { data } = await PostOpd(regId)
  console.log('toOpdDetail')
  if (data) {
    if (row && row.Seq) {
      storeSeqObj.value = {
        Name: row.Patient?.Person?.Name,
        RegId: row.RegId,
        Seq: row.Seq,
      }
    }
    router.push({ name: 'OpdRecord-Detail', params: { opdId: data }, query: { backpath: route.fullPath } })
  }
}

const PostOpd = async (regId) => {
  try {
    const res = await postOpd(regId)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const seq = ref(0)

const GetSequence = async () => {
  try {
    const query = setSearchQuery({ timeSlotNo: search.TimeSlotNo })
    const res = await getSequence(query)

    if (res) {
      seq.value = res.data

      if (rowsAll && rowsAll[2] && rowsAll[2].length) {
        rowsAll[2].forEach((v) => {
          if (v.Seq === seq.value) {
            console.log(`got matched`, seq.value)
            storeSeqObj.value = {
              Name: v.Patient?.Person?.Name,
              RegId: v.RegId,
              Seq: v.Seq,
            }
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const SeqObjDefault = {
  Name: null,
  RegId: null,
  Seq: 0,
}

// const storeSeqObj = computed({
//   get(){
//     let getVal = JSON.parse(sessionStorage.getItem('SeqObj'))
//     return getVal ? getVal : SeqObjDefault
//   },
//   set(val){
//     let setVal = JSON.stringify(val)
//     sessionStorage.setItem('SeqObj', setVal)
//   }
// })

const storeSeqObjTemp = ref(cloneDeep(SeqObjDefault))

const storeSeqObj = computed({
  get() {
    return storeSeqObjTemp.value
  },
  set(val) {
    storeSeqObjTemp.value = cloneDeep(val)
  },
})

const GetNextRegId = async () => {
  try {
    const res = await getNextRegId()
    return { data: res.request.response }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '取得下一號病患失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const toNextPatient = async () => {
  // const { data } = await GetNextRegId()
  // if (data) {
  //   console.log(`toNextPatient > row2: `, row)
  //   toOpdDetail(data, row)
  // } else {
  //   $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
  // }

  let rowsNext = cloneDeep(rowsAll[2])

  if (rowsNext && rowsNext.length) {
    let idx = null

    rowsNext.forEach((v, i) => {
      if (v.Seq == storeSeqObj.value.Seq && v.RegId == storeSeqObj.value.RegId) {
        idx = i
      }
    })

    if (idx !== null) {
      if (idx <= rowsNext.length - 1) {
        let { data } = await GetNextRegId()
        if (data) {
          toOpdDetail(rowsNext[idx]?.RegId, rowsNext[idx])
        } else {
          $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
        }
      } else {
        $q.notify({ type: 'negative', message: `目前診號 '${storeSeqObj.value.Seq}' 已是最後1位病患`, position: 'top' })
      }
    } else {
      let { data } = await GetNextRegId()
      if (data) {
        toOpdDetail(rowsNext[0]?.RegId, rowsNext[0])
      } else {
        $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
      }
    }
  } else {
    $q.notify({ type: 'negative', message: '無報到病患!', position: 'top' })
  }
}

const passPatient = async () => {
  let rowsPass = cloneDeep(rowsAll[2])

  if (rowsPass && rowsPass.length) {
    let idx = null

    rowsPass.forEach((v, i) => {
      if (v.Seq == storeSeqObj.value.Seq && v.RegId == storeSeqObj.value.RegId) {
        idx = i
        idx++
      }
    })

    if (idx !== null) {
      if (idx <= rowsPass.length - 1) {
        if (rowsPass.length - 1 - (idx - 1) >= 1) {
          await RoomBookingChangeStatus({ RegId: rowsPass[idx - 1]?.RegId, SetAttend: attendData.passNumber })
          setTimeout(async () => {
            let { data } = await GetNextRegId()
            if (data) {
              await toOpdDetail(rowsPass[idx]?.RegId, rowsPass[idx])
            } else {
              $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
            }
          }, 300)
        } else {
          $q.notify({
            type: 'negative',
            message: `目前診號 '${storeSeqObj.value.Seq}' 後無病患, 無法過號`,
            position: 'top',
          })
        }
      } else {
        $q.notify({ type: 'negative', message: `目前僅有1位病患, 無法過號`, position: 'top' })
      }
    } else {
      if (rowsPass.length > 1) {
        await RoomBookingChangeStatus({ RegId: rowsPass[0]?.RegId, SetAttend: attendData.passNumber })
        setTimeout(async () => {
          let { data } = await GetNextRegId()
          if (data) {
            toOpdDetail(rowsPass[1]?.RegId, rowsPass[1])
          } else {
            $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
          }
        }, 300)
      } else {
        $q.notify({ type: 'negative', message: `目前僅有1位病患, 無法過號`, position: 'top' })
      }
    }
  } else {
    $q.notify({ type: 'negative', message: '目前無報到病患, 無法過號!', position: 'top' })
  }
}

const checkPatient = async (regid, row) => {
  if (currentTab.value === '2') {
    console.log(`notSeeDoctor: 2`)

    let { data } = await GetNextRegId()
    await GetRoomBooking({ status: '2' })
    await GetRoomBookingS2({ status: '2' })
    await GetSequence()

    if (data) {
      let rowsCheck = cloneDeep(rowsAll[2])
      let tempRow = null
      let tempIdx = null

      if (data == regid) {
        if (rowsCheck && rowsCheck.length) {
          rowsCheck.forEach((v, i) => {
            if (v.RegId == data) {
              tempRow = cloneDeep(v)
              tempIdx = i
            }
          })
        }

        if (tempRow) {
          await toOpdDetail(data, tempRow)
        }
      } else {
        if (rowsCheck && rowsCheck.length) {
          rowsCheck.forEach((v, i) => {
            if (v.RegId == regid) {
              tempRow = cloneDeep(v)
              tempIdx = i
            }
          })
        }

        if (tempRow) {
          rowsCheck.forEach(async (v, i) => {
            if (i < tempIdx) {
              console.log(`pass ~`, v.RegId)
              await RoomBookingChangeStatus({ RegId: v.RegId, SetAttend: attendData.passNumber })
            }
          })

          setTimeout(async () => {
            let { data } = await GetNextRegId()

            await GetRoomBooking({ status: '2' })
            await GetRoomBookingS2({ status: '2' })
            await GetSequence()

            let rowsRenew = cloneDeep(rowsAll[2])
            let tempRowN = null

            if (rowsRenew && rowsRenew.length) {
              rowsRenew.forEach((v, i) => {
                if (v.RegId == data) {
                  tempRowN = cloneDeep(v)
                }
              })
            }

            if (tempRowN) {
              await toOpdDetail(data, tempRowN)
            } else {
              $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
            }
          }, 1000)
        }
      }
    } else {
      $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
    }
  } else if (currentTab.value === '4' || currentTab.value === '5') {
    console.log(`passNumber: 4 || tempSave: 5`)

    await RoomBookingChangeStatus({ RegId: regid, SetAttend: attendData.notSeeDoctor })
    await GetRoomBookingS2({ status: '2' })
    await GetSequence()

    setTimeout(async () => {
      let { data } = await GetNextRegId()

      if (data) {
        let rowsCheck = cloneDeep(rowsAll[2])
        let tempRow = null

        if (rowsCheck && rowsCheck.length) {
          rowsCheck.forEach((v) => {
            if (v.RegId == data) {
              tempRow = cloneDeep(v)
            }
          })

          if (tempRow) {
            await toOpdDetail(data, tempRow)
          } else {
            await toOpdDetail(regid, row)
          }
        }
      } else {
        $q.notify({ type: 'positive', message: '門診結束', position: 'top' })
      }
    }, 300)
  }
}

const setQueryFromData = () => {
  router.replace({
    query: {
      status: currentTab.value || attendData.notCheckIn,
      ...search,
      page: pagination[currentTab.value].page,
      rowsPerPage: pagination[currentTab.value].rowsPerPage,
    },
  })
}

const setDataFromQuery = () => {
  currentTab.value = route.query.status || attendData.notCheckIn
  if (route.query.page) pagination[currentTab.value].page = Number(route.query.page)
  if (route.query.rowsPerPage) pagination[currentTab.value].rowsPerPage = Number(route.query.rowsPerPage)
  Object.keys(search).forEach((key) => {
    if (route.query[key]) search[key] = route.query[key]
  })
}

const interval = ref(null)

onBeforeUnmount(() => {
  window.clearInterval(interval.value)
})

const getList = async () => {
  Object.keys(rows).forEach(async (key) => {
    await GetRoomBooking({ status: key })
  })
  await GetRoomBookingS2({ status: '2' })
  await GetSequence()
}

const init = async () => {
  setDataFromQuery()
  await GetDoctorAttend()
  await getList()

  interval.value = window.setInterval(async () => {
    await getList()
  }, 5000)
}

init()

watch(
  () => currentTab.value,
  async (val) => {
    if (val) {
      await GetRoomBooking({ status: val })
      await GetRoomBookingS2({ status: '2' })
    } else {
      router.replace({ query: { status: attendData.notCheckIn } })
    }
  }
)
</script>

