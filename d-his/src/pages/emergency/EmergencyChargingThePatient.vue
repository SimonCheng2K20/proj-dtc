<template>
  <q-page ref="pageRef" class="p-2">
    <my-title>
      批價作業
      <div class="flex gap-1">
        <q-btn class="header-btn" label="批價主頁" dense unelevated @click="goChargePage"></q-btn>
        <q-btn class="header-btn" label="取消結帳" dense unelevated @click="goChargePage"></q-btn>
        <ReadHealthyCardBtn class="header-btn" dense unelevated @read="onReadCard"></ReadHealthyCardBtn>
        <q-btn class="header-btn" label="自動結帳" dense unelevated @click="toPayTheCheck(selected[0])"></q-btn>
      </div>
    </my-title>

    <div class="grid grid-cols-4 gap-2">
      <q-card class="bg-grey-2" flat>
        <q-card-section>
          <div class="text-xl font-bold">病患基本資料</div>
          <my-input-group class="grid gap-1">
            <my-input-wrapper label="身分證號">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.Patient.PersonId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="病歷號碼">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.Patient.PatientId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="姓名">
              <q-input
                v-bind="QInputProps"
                :model-value="patientInfo.RoomBooking.Patient.Person.Name"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="性別">
              <q-input
                v-bind="QInputProps"
                :model-value="patientInfo.RoomBooking.Patient.Person.GenderCode"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="出生日期">
              <q-input
                v-bind="QInputProps"
                :model-value="patientInfo.RoomBooking.Patient.Person.BirthDate?.substring(0, 10)"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="批價狀態">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdCharge.ChargeStatus" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="看診日期">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDatetime?.substring(0, 10)" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="看診時段">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.TimeSlotName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="看診科別">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.DepartmentName" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>
      <q-card class="bg-grey-2" flat>
        <q-card-section>
          <div class="text-xl font-bold">就醫身分</div>
          <my-input-group class="grid gap-1">
            <my-input-wrapper label="就診身份">
              <q-input
                v-bind="QInputProps"
                :model-value="identityItems.find((item) => item.No === patientInfo.RoomBooking.Identity)?.Name"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="折扣身份">
              <q-input
                v-bind="QInputProps"
                :model-value="
                  identityDiscountItems.find((item) => item.No === patientInfo.RoomBooking.IdentityDiscount)?.Name
                "
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="部分負擔">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.PartialAfford" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="案件分類">
              <q-input
                v-bind="QInputProps"
                :model-value="caseTypeDropdown.find((item) => item.No === patientInfo.CaseType)?.Name"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="給付類別">
              <q-input
                v-bind="QInputProps"
                :model-value="payTypeDropdown.find((item) => item.No === patientInfo.PayType)?.Name"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="健保卡序">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.CardSerial" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="看診部門">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.DepartmentName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="診間">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.RoomName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="看診醫生">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.DoctorName" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>
      <q-card class="bg-grey-2" flat>
        <q-card-section>
          <div class="text-xl font-bold">診療資料</div>
          <my-input-group class="grid grid-cols-2 gap-1">
            <my-input-wrapper label="疾病碼一" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDiagnoses[0]?.Icd10Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="疾病碼二" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDiagnoses[1]?.Icd10Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="疾病碼三" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDiagnoses[2]?.Icd10Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="疾病碼四" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDiagnoses[3]?.Icd10Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="疾病碼五" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdDiagnoses[4]?.Icd10Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="特療碼一">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdChronics[0]?.Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="特療碼二">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdChronics[1]?.Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="特療碼三">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdChronics[2]?.Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="特療碼四">
              <q-input v-bind="QInputProps" :model-value="patientInfo.OpdChronics[3]?.Code" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="預防保健" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="patientInfo.RoomBooking.Prevent" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="調劑方式" class="col-span-full">
              <q-input
                v-bind="QInputProps"
                :model-value="patientInfo.Formula === '1' ? '交付調劑' : '自行調劑'"
                readonly
              >
              </q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>
      <q-card class="" flat>
        <q-card-section class="flex h-full flex-col">
          <q-space></q-space>
          <div>
            <q-btn color="primary" label="醫令明細" unelevated @click="toDrugDetailInfo"></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="chargeColumns"
      row-key="OpdId"
      :pagination="pagination"
      :selected="selected"
      @row-click="onRowClick"
      :loading="tableLoading"
    >
      <template v-slot:body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn
            color="edit"
            @click="onRowClick(null, row), toPayTheCheck(row)"
            label="批價結帳"
            unelevated
            dense
          ></q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-ChronicNote="{ col, row }">
        <q-td :props="{ col }">
          <q-icon :name="row.ChronicNote ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="pagination"
          v-on:update:model-value="GetCharge(route.query.PersonId)"
        ></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import {
  getCharge,
  getIdentityDiscountsList,
  getIdentityList,
  getCaseTypeList,
  getPayTypeDropdown,
  getExportReceipt,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar, scroll } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'
import PayTheCheckEditItem from '../charge/components/PayTheCheckEditItem.vue'
import DrugDetailInfoItem from '../charge/components/DrugDetailInfoItem.vue'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const pageRef = ref()

const chargeColumns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'OpdDatetime', label: '看診日期', field: (row) => row.OpdDatetime.substring(0, 10), align: 'left' },
  { name: 'TimeSlotName', label: '看診時段', field: (row) => row.RoomBooking.TimeSlotName, align: 'left' },
  { name: 'RoomName', label: '診間', field: (row) => row.RoomBooking.RoomName, align: 'left' },
  { name: 'Seq', label: '看診號', field: (row) => row.RoomBooking.Seq, align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: (row) => row.RoomBooking.Patient.PatientId, align: 'left' },
  { name: 'Name', label: '病患姓名', field: (row) => row.RoomBooking.Patient.Person.Name, align: 'left' },
  { name: 'ReceiptNo', label: '收據號碼', field: (row) => row.OpdCharge.ReceiptNo, align: 'left' },
  { name: 'CardSerial', label: '健保卡序', field: (row) => row.RoomBooking.CardSerial, align: 'left' },
  { name: 'ChargeStatus', label: '批價狀況', field: (row) => row.OpdCharge.ChargeStatus, align: 'left' },
  { name: 'ChronicNote', label: '慢箋', field: (row) => row.OpdCharge.ChronicNote, align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])

const GetCharge = async (personId) => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      chargeStatus: '6',
      isEr: true,
      personId: personId ? personId : route.query.PersonId,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $orderBy: orderBy.value,
    })
    const res = await getCharge(query)
    if (res.status === 200) {
      if (res.data.Items.length === 0) {
        router.go(-2)
      } else {
        rows.value = res.data.Items
        pagination.value.rowsNumber = res.data.Count
        selected.value = [rows.value[0]]
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  patientId: null,
  personId: null,
  patientName: null,
  birthDate: null,
  startDate: null,
  endDate: null,
  opdTime: null,
  departmentNo: null,
  doctorId: null,
}

const sortBy = ref([['CreateDatetime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const selected = ref([])

const onRowClick = (evt, row) => {
  selected.value = [row]
}

const patientInfo = computed(() => {
  return selected.value[0]
    ? selected.value[0]
    : {
        RoomBooking: {
          RoomName: null,
          BookingDate: null,
          TimeSlotName: null,
          DepartmentName: null,
          DoctorName: null,
          Identity: null,
          IdentityDiscount: null,
          PartialAfford: null,
          Prevent: null,
          CardSerial: null,

          Patient: {
            PatientId: null,
            PersonId: null,
            Person: {
              Name: null,
              GenderCode: null,
              BirthDate: null,
            },
          },
        },
        OpdCharge: {
          ChargeStatus: null,
        },
        OpdDiagnoses: [],
        OpdChronics: [],
        OpdChargeDetailList: [],
        PayType: null,
        CaseType: null,
        Formula: null,
      }
})

const toPayTheCheck = (row) => {
  const dialog = $q
    .dialog({
      component: PayTheCheckEditItem,
      componentProps: {
        id: row.OpdId,
        roomBooking: row.RoomBooking,
        editType: 'edit',
      },
    })
    .onOk(() => {
      dialog.hide()
      GetExportReceipt(row.OpdId)
      GetCharge()
    })
}

const toDrugDetailInfo = () => {
  if (selected.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: '請選擇病患',
      position: 'top',
    })
    return
  }

  const dialog = $q.dialog({
    component: DrugDetailInfoItem,
    componentProps: {
      rows: patientInfo.value.OpdChargeDetailList,
    },
  })
}

const onReadCard = async (data) => {
  if (data) {
    pagination.value.page = 1
    await GetCharge(data.PersonId)

    selected.value = rows.value[0]
  }
}

const identityItems = ref([])
const GetIdentityList = async () => {
  try {
    const res = await getIdentityList()
    if (res.status === 200) {
      identityItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const identityDiscountItems = ref([])
const GetIdentityDiscountsList = async () => {
  try {
    const res = await getIdentityDiscountsList()
    if (res.status === 200) {
      identityDiscountItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const caseTypeDropdown = ref([])
const GetCaseTypeDropdown = async () => {
  try {
    const res = await getCaseTypeList()
    if (res.status === 200) {
      caseTypeDropdown.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const payTypeDropdown = ref([])
const GetPayTypeDropdown = async () => {
  try {
    const res = await getPayTypeDropdown()
    if (res.status === 200) {
      payTypeDropdown.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}
const GetExportReceipt = async (id) => {
  try {
    const res = await getExportReceipt(id)

    if (res.status === 200) {
      const a = document.createElement('a')
      a.setAttribute('href', res.data)
      a.setAttribute('target', '_blank')
      a.click()
    }
  } catch (err) {
    console.log(err)
  }
}

const goChargePage = () => {
  router.push({ name: 'EmergencyCharge' })
}

const init = () => {
  GetCharge()
  GetIdentityList()
  GetIdentityDiscountsList()
  GetCaseTypeDropdown()
  GetPayTypeDropdown()
}
init()
</script>

<style lang="scss" scoped>
.more-search-enter-active,
.more-search-leave-active {
  @apply transition-[height];
  height: 88px;
}

.more-search-enter-from,
.more-search-leave-to {
  height: 0px;
}
</style>

