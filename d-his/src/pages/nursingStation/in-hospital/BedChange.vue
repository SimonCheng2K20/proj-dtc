<template>
  <div class="bg-white border border-solid border-blue-500 text-lg font-extrabold relative">
    <div class="absolute top-2 right-2">
      <q-btn class="mr-2" unelevated dense color="info" label="回上頁" @click="router.go(-2)"></q-btn>
      <q-btn unelevated dense color="edit" label="確定儲存" @click="PostIpdHbedChangeLog()"></q-btn>
    </div>

    <div class="flex justify-center border-b border-solid border-blue-500 p-4">
      <span class="pr-2">書記-轉床/互轉 :</span>

      <my-input-group class="grid gap-2 grid-cols-1 p-5 pb-14 bg-yellow-50">
        <my-input-wrapper label="轉床更換日期">
          <my-date-input v-bind="QInputProps" :date-options="dateOption" v-model="bedData.ChangeDate"></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input
            v-bind="QInputProps"
            readonly
            :model-value="ipdStore.ipdData.Patient.Person.Name"
            :loading="originLoading"
          ></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="床號">
          <q-select
            v-bind="QInputProps"
            readonly
            :model-value="ipdStore.ipdData.BedName"
            :loading="originLoading"
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="隔離床"
          ><q-checkbox readonly :model-value="ipdStore.ipdData.BedTypeName === '隔離床'"></q-checkbox
        ></my-input-wrapper>
      </my-input-group>

      <div class="px-6 self-center font-semibold">
        <q-tabs
          class="text-black text-2xl"
          vertical
          inline-label
          indicator-color="transparent"
          dense
          active-bg-color="primary"
          active-color="white"
          v-model="bedData.ChageType"
          @update:model-value="resetBedData()"
        >
          <q-tab class="mb-3 rounded border border-blue-500" name="false" icon="arrow_right_alt" label="轉床位至" />
          <q-tab
            class="border rounded border-blue-500"
            :disable="ipdStore.ipdData.BedTypeName === '隔離床'"
            name="true"
            icon="swap_horiz"
            label="床位互轉"
          />
        </q-tabs>
      </div>

      <my-input-group class="grid gap-2 grid-cols-1 p-5 pb-14 bg-yellow-50">
        <my-input-wrapper label="轉床更換日期"
          ><my-date-input v-bind="QInputProps" :date-options="dateOption" v-model="bedData.ChangeDate"></my-date-input
        ></my-input-wrapper>
        <my-input-wrapper label="姓名"
          ><q-input readonly v-bind="QInputProps" :model-value="patientName"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="床號">
          <q-select
            v-bind="QSelectProps"
            :options="bedOptions"
            v-model="bedData.AfterBedId"
            :loading="bedLoading"
            emit-value=""
            map-options
            option-label="Bed"
            option-value="Id"
            :rules="[(val) => (val !== null && val !== '') || '請輸入更換床號']"
            ref="qBedId"
            @update:model-value="(val) => changeBedNo(val)"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.Bed }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="隔離床"><q-checkbox v-model="bedData.AfterIsolate"></q-checkbox></my-input-wrapper>
      </my-input-group>
    </div>

    <div class="flex justify-center">
      <div class="py-4">
        <span>床位異動歷程 :</span>
        <div style="width: 1200px" class="pl-8 py-2 font-normal">
          <q-table
            v-bind="QTableProps"
            style="max-height: 279px"
            :columns="columns"
            :rows="rows"
            virtual-scroll
            :rows-per-page-options="[0]"
          ></q-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import {
  getIpdHbedChangeLog,
  getAccountItem,
  getHospitalBedList,
  getNursingSchedule,
  postIpdHbedChangeLog,
  getIpdRecordItem,
} from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useIpdStore } from 'stores/ipd'

const ipdStore = useIpdStore()

const $q = useQuasar()

const qBedId = ref()

const route = useRoute()

const router = useRouter()

const authStore = useAuthStore()

// 日期配置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const columns = computed(() => {
  return [
    {
      name: 'ChangeDate',
      label: '異動日期',
      align: 'center',
      field: (row) => (dayjs(row.ChangeDate).isValid() ? dayjs(row.ChangeDate).format('YYYY-MM-DD') : row.ChangeDate),
      headerClasses: 'sticky top-0 z-10',
    },
    { name: 'BeforeBed', label: '床號', align: 'center', field: 'BeforeBed', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'BeforeIsolate',
      label: '隔離否',
      align: 'center',
      field: (row) => (row.BeforeIsolate ? '是' : '否'),
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'ChangeType',
      label: '異動方式',
      align: 'center',
      field: (row) => (row.ChangeType ? '床位互轉' : '轉床位至'),
      headerClasses: 'sticky top-0 z-10',
    },
    { name: 'AfterBed', label: '異動後床號', align: 'center', field: 'AfterBed', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'AfterIsolate',
      label: '異動後隔離否',
      align: 'center',
      field: (row) => (row.AfterIsolate ? '是' : '否'),
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'ChangeUserName',
      label: '異動人員',
      align: 'center',
      field: 'ChangeUserName',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'CreateDatetime',
      label: '異動日期時間',
      align: 'center',
      field: (row) =>
        dayjs(row.CreateDatetime).isValid()
          ? dayjs(row.CreateDatetime).format('YYYY-MM-DD HH:mm:ss')
          : row.CreateDatetime,
      headerClasses: 'sticky top-0 z-10',
    },
  ]
})

const rows = ref([])

const patientName = ref(ipdStore.ipdData.Patient.Person.Name)

// 床位異動歷程
const tableLoading = ref(false)

const GetIpdHbedChangeLog = async () => {
  try {
    tableLoading.value = true
    const query = `?$filter= IpdId eq '${route.params.ipdId}'`
    const res = await getIpdHbedChangeLog(query)
    if (res.status === 200) {
      rows.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const initData = {
  IpdId: route.params.ipdId,
  ChangeDate: dayjs(new Date()).format(),
  BeforeBedId: ipdStore.ipdData.BedId,
  BeforeIsolate: ipdStore.ipdData.BedTypeName === '隔離床',
  AfterBedId: null,
  AfterIsolate: false,
  ChageType: 'false',
  ChangeIpdId: null,
}

const bedData = reactive(cloneDeep(initData))

const resetBedData = () => {
  const chageType = bedData.ChageType
  Object.assign(bedData, initData)
  bedData.ChageType = chageType
  if (bedData.ChageType === 'true') {
    patientName.value = null
  } else {
    patientName.value = ipdStore.ipdData.Patient.Person.Name
  }
}

// 取得護理師資料
const GetAccountItem = async () => {
  try {
    const id = authStore.userData.No
    const res = await getAccountItem(id)
    if (res.status === 200) {
      GetNursingSchedule(res.data.PersonId)
    }
  } catch (err) {
    console.log(err)
  }
}

// 病床
const bedsStatus = ref([])

const GetHospitalBedList = async () => {
  try {
    const res = await getHospitalBedList()
    if (res.status === 200) {
      bedsStatus.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

// 護理師當下負責床位
const nurseBeds = ref([])

const GetNursingSchedule = async (personId) => {
  try {
    const startAsignDate = encodeURIComponent(dayjs(new Date()).format('YYYY-MM-DD'))
    const endAsignDate = encodeURIComponent(dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'))
    const query = `?$filter= PersonId eq '${personId}' and AsignDate ge ${startAsignDate} and AsignDate lt ${endAsignDate}`
    const res = await getNursingSchedule(query)
    if (res.status === 200) {
      nurseBeds.value = Array.from(
        new Set(
          res.data.Items.reduce((arr, item) => {
            return arr.concat(item.Beds)
          }, [])
        )
      )
      console.log('nurseBeds.value', nurseBeds.value)
    }
  } catch (err) {
    console.log(err)
  }
}

// 床號
const bedLoading = ref(false)

const bedOptions = computed(() => {
  if (bedData.ChageType === 'false') {
    return nurseBeds.value.reduce((arr, item) => {
      const e = bedsStatus.value.find((e) => {
        return item === e.Id && e.BedStatus === '空床'
      })
      if (!!e) arr.push(e)
      return arr
    }, [])
  } else {
    return nurseBeds.value.reduce((arr, item) => {
      const e = bedsStatus.value.find((e) => {
        return item === e.Id && e.BedStatus === '入住'
      })
      if (!!e) arr.push(e)
      return arr
    }, [])
  }
})

const changeBedNo = (val) => {
  if (bedData.ChageType === 'true') {
    const bed = bedOptions.value.find((item) => {
      return item.Id === val
    })
    bedData.ChangeIpdId = bed.PatientId
    patientName.value = bed.PatientName
  }
}

// 修改床位
const editLoading = ref(false)

const PostIpdHbedChangeLog = async () => {
  if (qBedId.value.validate() === true && confirm('確定修改床位?')) {
    try {
      editLoading.value = true
      const body = {
        ...bedData,
      }
      const res = await postIpdHbedChangeLog(body)
      if (res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '床位修改成功',
          position: 'top',
        })
        GetIpdRecordItem()
        GetIpdHbedChangeLog()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '床位修改失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      editLoading.value = false
    }
  }
}

// 取得病患資訊
const originLoading = ref(false)

const GetIpdRecordItem = async () => {
  try {
    originLoading.value = true
    const res = await getIpdRecordItem(route.params.ipdId)
    if (res.status === 200) {
      emit('update:ipdStore.ipdData', res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    originLoading.value = false
  }
}

const init = async () => {
  GetIpdHbedChangeLog()
  bedLoading.value = true
  await Promise.all([GetAccountItem(), GetHospitalBedList()])
  bedLoading.value = false
}

init()
</script>

