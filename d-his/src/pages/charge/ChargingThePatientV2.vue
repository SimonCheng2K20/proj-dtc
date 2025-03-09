<template>
  <div class="p-2">
    <my-title v-if="isCharge">
      住院批價作業
      <q-space></q-space>
      <q-btn class="header-btn" label="批價主頁" dense unelevated @click="stayHospitalCharge()"></q-btn>
      <q-btn class="header-btn" label="取消結帳" dense unelevated @click="stayHospitalCharge()"></q-btn>
      <q-btn class="header-btn" label="繳費存檔並列印收據" dense unelevated></q-btn>
    </my-title>

    <div v-else class="my-1 flex justify-end px-[300px]">
      <q-btn
        label="回上頁"
        color="info"
        unelevated
        dense
        @click="router.push({ name: 'NursingStation-Clerk' })"
      ></q-btn>
      <q-btn
        class="ml-2"
        label="列印預繳單"
        color="primary"
        unelevated
        dense
        :loading="IpdChargePdfloading"
        @click="GetIpdChargePdf(1)"
      ></q-btn>
      <q-btn
        class="ml-2"
        label="列印出院繳款單"
        color="warning"
        unelevated
        dense
        :loading="IpdChargePdfloading"
        @click="GetIpdChargePdf(2)"
      ></q-btn>
    </div>

    <div class="grid gap-2 px-0" :class="{ 'px-[300px]': !isCharge }">
      <q-card class="bg-grey-2" flat>
        <q-card-section>
          <h1 class="mb-2 text-xl font-bold">病患資料</h1>
          <my-input-group class="grid grid-cols-4 gap-2" :class="{ 'grid-cols-5': isCharge }">
            <my-input-wrapper label="病歷號碼">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.PatientId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="姓名">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.Patient.Person.Name" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper v-if="isCharge" label="身分證號">
              <q-input v-bind="QInputProps" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="床位號碼">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.BedName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="健保卡序">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.CardSerial" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="就診身分">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IdentityName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="折扣身分">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IdentityDiscountName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper v-if="isCharge" label="出生日期">
              <q-input v-bind="QInputProps" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="部分負擔">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.PartialAfford" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="床位類別">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.BedTypeName" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

      <div class="grid grid-cols-3 gap-2" :class="{ 'grid-cols-4': isCharge }">
        <q-card class="bg-grey-2 col-span-2" flat>
          <q-card-section>
            <q-table
              ref="tableRef"
              v-bind="QTableProps"
              :rows="inHospitalCost.IpdChargeDetails"
              :columns="columns"
              :pagination="{ rowsPerPage: 0 }"
              :loading="ipdChargeLoading"
              :row-class="(row, index) => (index === inHospitalCost.IpdChargeDetails.length - 1 ? 'bg-yellow-800' : '')"
            >
            </q-table>
          </q-card-section>
        </q-card>
        <q-card class="bg-grey-2" flat>
          <q-card-section>
            <div class="mb-2 flex justify-between">
              <h1 class="text-xl font-bold">住院費用</h1>
              <q-btn
                v-if="!isCharge"
                label="建立優免"
                icon="add"
                color="add"
                unelevated
                dense
                size="md"
                @click="addDiscount"
              ></q-btn>
            </div>

            <my-input-group class="grid gap-2">
              <my-input-wrapper label="繳費結算日" inputBorder>
                <div class="grow bg-white px-3 leading-10">
                  {{ dayjs(inHospitalCost.PrepaidFrom).format('YYYY-MM-DD') }} ~
                  {{ dayjs(inHospitalCost.PrepaidTo).format('YYYY-MM-DD') }}
                </div>
              </my-input-wrapper>
              <my-input-wrapper label="累積住院部分負擔">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.IpdCopaymentSum"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="本次住院費用">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.IpdFeeCurrent"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="本次住院部分負擔">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.IpdCopaymentCurrent"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="自費金額">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.SelfFee"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="已預繳費用">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.PrepaidFee"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="社福優免合計">
                <q-input
                  type="number"
                  v-bind="QInputProps"
                  v-model="inHospitalCost.SocialDeduction"
                  readonly
                  :loading="ipdChargeLoading"
                />
              </my-input-wrapper>
              <my-input-wrapper label="人工優免合計">
                <q-input
                  type="number"
                  v-bind="QInputProps"
                  v-model="inHospitalCost.ManualDeduction"
                  readonly
                  :loading="ipdChargeLoading"
                />
              </my-input-wrapper>
              <my-input-wrapper label="折扣金額">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.Discount"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="尚欠金額">
                <q-input
                  v-bind="QInputProps"
                  v-model="inHospitalCost.Arrears"
                  readonly
                  :loading="ipdChargeLoading"
                ></q-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>
        <q-card v-if="isCharge" class="bg-grey-2" flat>
          <q-card-section>
            <div class="text-xl font-bold">付款方式</div>
            <my-input-group class="grid gap-2">
              <my-input-wrapper label="繳費方式">
                <q-select v-bind="QSelectProps" :options="['現金', '刷卡']"></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="付款金額">
                <q-input v-bind="QInputProps" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="已繳金額">
                <q-input v-bind="QInputProps" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="健保卡號">
                <q-input v-bind="QInputProps" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="尚欠金額">
                <q-input v-bind="QInputProps" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="累計欠款金額">
                <q-input v-bind="QInputProps" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="應付總額">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="備註">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="mt-2 rounded-md border border-blue-400 p-2">
      <q-tabs
        v-model="currentTab"
        content-class="gap-2"
        indicator-color="primary"
        active-bg-color="primary"
        active-color="white"
        align="left"
        dense
      >
        <q-tab
          class="border border-blue-500"
          :label="tab.label"
          :name="tab.value"
          v-for="(tab, index) in tabs"
          :key="index"
        />
      </q-tabs>
      <div class="bg-white">
        <q-table
          class="mt-2"
          style="max-height: 261px"
          v-bind="QTableProps"
          :columns="prePaidHeaders"
          :rows="prePaidList"
          row-key="IpdId"
          :loading="prepaidLoading"
          v-if="currentTab === 'prePaid'"
          virtual-scroll
          :rows-per-page-options="[0]"
        >
          <template #body-cell-operable="{ row, col }">
            <q-td :props="{ row, col }">
              <q-btn
                class="bg-[#BB2192]"
                text-color="white"
                label="檢視"
                unelevated
                dense
                @click="GetIpdChargePdf(row.ReceiptTypeCode, row.Id)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>

        <q-table
          class="mt-2"
          style="max-height: 261px"
          v-bind="QTableProps"
          :columns="socialWelfareHeaders"
          :rows="socialList"
          row-key="Id"
          v-if="currentTab === 'socialWelfare'"
          virtual-scroll
          :rows-per-page-options="[0]"
        >
          <template #body-cell-operable="{ row, col }">
            <q-td :props="{ row, col }">
              <q-btn
                v-if="row.operable"
                class="mr-1"
                color="edit"
                label="編輯"
                dense
                unelevated
                @click="editDiscount(row)"
              ></q-btn>
              <q-btn
                v-if="row.operable"
                color="delete"
                label="刪除"
                unelevated
                dense
                @click="deleteDiscount(row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>

        <q-table
          class="mt-2"
          style="max-height: 261px"
          v-bind="QTableProps"
          :columns="manualWelfareHeaders"
          :rows="ManualList"
          row-key="Id"
          v-if="currentTab === 'manualWelfare'"
          virtual-scroll
          :rows-per-page-options="[0]"
        >
          <template #body-cell-operable="{ row, col }">
            <q-td :props="{ row, col }">
              <q-btn
                v-if="row.operable"
                class="mr-1"
                color="edit"
                label="編輯"
                dense
                unelevated
                @click="editDiscount(row)"
              ></q-btn>
              <q-btn
                v-if="row.operable"
                color="delete"
                label="刪除"
                unelevated
                dense
                @click="deleteDiscount(row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'
import { useIpdStore } from 'stores/ipd'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

// api
import { getIpdCharge, getIpdChargePdf, getIpdDeductionHistoryList, getPrepaidHistory, getIpdRecordList } from 'api'

// utils
import setSearchQuery from 'src/utils/setSearchQuery'
import numberFormat from 'src/utils/numberFormat'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

// components
import DiscountDialog from './components/DiscountDialog.vue'
import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const ipdStore = useIpdStore()

const isCharge = computed(() => {
  return route.fullPath.includes('Charge/ChargingThePatientV2')
})

const columns = [
  {
    name: 'FeeName',
    label: '費用項目名稱',
    field: 'FeeName',
    align: 'left',
    style: (row) => (row.FeeName === '合計' ? 'background-color: #ffe1fa' : 'background-color:#deecff'),
  },
  {
    name: 'Fee',
    label: '醫療金額',
    field: 'Fee',
    align: 'right',
    style: (row) => (row.FeeName === '合計' ? 'background-color: #fffae8' : ''),
  },
  {
    name: 'NhiFee',
    label: '健保點數',
    field: 'NhiFee',
    align: 'right',
    style: (row) => (row.FeeName === '合計' ? 'background-color: #fffae8' : ''),
  },
  {
    name: 'SelfFee',
    label: '自付金額',
    field: 'SelfFee',
    align: 'right',
    style: (row) => (row.FeeName === '合計' ? 'background-color: #fffae8' : ''),
  },
]

const inHospitalCost = ref({})

const currentTab = ref('prePaid')
const tabs = reactive([
  {
    label: '繳費歷程',
    value: 'prePaid',
  },
  {
    label: '社福優免',
    value: 'socialWelfare',
  },
  {
    label: '人工優免',
    value: 'manualWelfare',
  },
])

const ipdChargeLoading = ref(false)
const GetIpdCharge = async (id) => {
  try {
    ipdChargeLoading.value = true
    const res = await getIpdCharge(id)
    if (res.status === 200 || res.status === 204) {
      inHospitalCost.value = cloneDeep(res.data)
      inHospitalCost.value.IpdChargeDetails.sort((x, y) => {
        return x.No - y.No
      })
    }
  } catch (err) {
    console.log(`error: `, err)
  } finally {
    ipdChargeLoading.value = false
  }
}

const prepaidLoading = ref(false)
const GetPrepaidHistory = async (id) => {
  try {
    prepaidLoading.value = true
    const res = await getPrepaidHistory(id)
    if (res.status === 200 || res.status === 204) {
      prePaidList.value = res.data
    }
  } catch (err) {
    console.log(`error: `, err)
  } finally {
    prepaidLoading.value = false
  }
}

const prePaidHeaders = [
  {
    name: 'operable',
    label: '操作',
    field: 'operable',
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'PrepaidDate',
    label: '繳費日期',
    field: (row) => (row.PrepaidDate ? dayjs(row.PrepaidDate).format('YYYY-MM-DD') : ''),
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'PrepaidFrom',
    label: '繳費日期(起)',
    field: (row) => (row.PrepaidFrom ? dayjs(row.PrepaidFrom).format('YYYY-MM-DD') : ''),
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'PrepaidTo',
    label: '繳費日期(迄)',
    field: (row) => (row.PrepaidTo ? dayjs(row.PrepaidTo).format('YYYY-MM-DD') : ''),
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'PayableFee',
    label: '應繳金額',
    field: (row) => numberFormat(row.PayableFee),
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'PaidFee',
    label: '實繳金額',
    field: (row) => numberFormat(row.PaidFee),
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'ReceiptNo',
    label: '收據號碼',
    field: 'ReceiptNo',
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'Handler',
    label: '經手人',
    field: 'Handler',
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'ReceiptType',
    label: '收據性質',
    field: 'ReceiptType',
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
  {
    name: 'ReceiptStatus',
    label: '收據狀態',
    field: 'ReceiptStatus',
    align: 'center',
    headerStyle: 'position:sticky;top:0;z-index:10',
  },
]
const prePaidList = ref([])

const socialWelfareHeaders = computed(() => {
  const arr = [
    {
      name: 'operable',
      label: '操作',
      field: 'operable',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'DeductionDate',
      label: '優免日期',
      field: (row) => (row.DeductionDate ? dayjs(row.DeductionDate).format('YYYY-MM-DD') : ''),
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'FundName',
      label: '基金名稱',
      field: 'FundName',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'RequestFee',
      label: '申請金額',
      field: (row) => numberFormat(row.RequestFee),
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'ApprovedFee',
      label: '核可金額',
      field: (row) => numberFormat(row.ApprovedFee),
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'RequestName',
      label: '申請人',
      field: 'RequestName',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'ApprovedName',
      label: '核可人',
      field: 'ApprovedName',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'Remark',
      label: '備註',
      field: 'Remark',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
  ]

  if (isCharge.value) arr.splice(0, 1)

  return arr
})
const socialList = ref([])

const manualWelfareHeaders = computed(() => {
  const arr = [
    {
      name: 'operable',
      label: '操作',
      field: 'operable',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'DeductionDate',
      label: '優免日期',
      field: (row) => (row.DeductionDate ? dayjs(row.DeductionDate).format('YYYY-MM-DD') : ''),
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'ApprovedFee',
      label: '優免金額',
      field: (row) => numberFormat(row.ApprovedFee),
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'ReceiptNo',
      label: '收據號',
      field: 'ReceiptNo',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'RequestName',
      label: '申請人',
      field: 'RequestName',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'ApprovedName',
      label: '核可人',
      field: 'ApprovedName',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
    {
      name: 'Remark',
      label: '備註',
      field: 'Remark',
      align: 'center',
      headerStyle: 'position:sticky;top:0;z-index:10',
    },
  ]

  if (isCharge.value) arr.splice(0, 1)

  return arr
})

const ManualList = ref([])

const GetIpdDeductionHistoryList = async (id) => {
  try {
    const res = await getIpdDeductionHistoryList(id)
    if (res.status === 200 || res.status === 204) {
      socialList.value = res.data.SocialList
      ManualList.value = res.data.ManualList
    }
  } catch (err) {
    console.log(err)
  }
}

const addDiscount = () => {
  const dialog = $q
    .dialog({
      component: DiscountDialog,
      componentProps: {
        editType: 'add',
      },
    })
    .onOk(() => {
      reRequestInfo()
    })
}
const editDiscount = (row) => {
  const dialog = $q
    .dialog({
      component: DiscountDialog,
      componentProps: {
        editType: 'edit',
        row: row,
      },
    })
    .onOk(() => {
      reRequestInfo()
    })
}
const deleteDiscount = (row) => {
  const dialog = $q
    .dialog({
      component: DiscountDialog,
      componentProps: {
        editType: 'delete',
        row: row,
      },
    })
    .onOk(() => {
      reRequestInfo()
    })
}

const IpdChargePdfloading = ref(false)
const GetIpdChargePdf = async (pdfType, id = '') => {
  try {
    const params = {
      ipdid: route.params.ipdId,
      pdfType: pdfType,
      id: id,
    }

    IpdChargePdfloading.value = true
    const res = await getIpdChargePdf(params)
    if (res.status === 200 || res.status === 204) {
      window.open(res.data)
      if (!id) reRequestInfo()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `有單據` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    IpdChargePdfloading.value = false
  }
}

const stayHospitalCharge = () => {
  router.push({ name: 'StayHospital-StayHospitalCharge' })
}

const reRequestInfo = (id) => {
  GetIpdCharge(id)
  GetPrepaidHistory(id)
  GetIpdDeductionHistoryList(id)
}

const GetIpdRecordList = async (personId) => {
  try {
    const query = `?filter= Patient/Person/PersonId eq '${personId}'`
    const res = await getIpdRecordList(query)
    if (res.status === 200 || res.status === 204) {
      ipdStore.setIpdData(res.data.Items[0])
    }
  } catch (err) {
    console.log(err)
  }
}

const init = async () => {
  if (isCharge.value) {
    if (!!route.params.personId) {
      await GetIpdRecordList(route.params.personId)
      reRequestInfo(ipdStore.ipdData.IpdId)
    } else {
      await ipdStore.GetIpdRecordItem(route.params.ipdId)
      reRequestInfo(route.params.ipdId)
    }
  } else {
    reRequestInfo(route.params.ipdId)
  }
}

init()
</script>
