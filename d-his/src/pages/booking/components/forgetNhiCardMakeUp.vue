<template>
  <div class="forgetNhiCardMakeUp">
    <div class="forgetNhiCardMakeUpTitle mb-2">上次的掛號紀錄</div>
    <template v-if="bookingDataObj">
      <div class="h-full grid grid-cols-12 mb-2">
        <div class="col-span-3">病歷號碼：{{ bookingDataObj.Patient.Person.Name }}</div>
        <div class="col-span-3">姓名：{{ bookingDataObj.Patient.PatientId }}</div>
        <div class="col-span-3">身分證號：{{ bookingDataObj.Patient.PersonId }}</div>
        <div class="col-span-3">
          出生年月日：{{ dayjs(bookingDataObj.Patient.Person.BirthDate).format('YYYY-MM-DD') }}
        </div>
        <div class="col-span-3">就診日：{{ dayjs(bookingDataObj.BookingDate).format('YYYY-MM-DD HH:mm') }}</div>
        <div class="col-span-3">科別：{{ bookingDataObj.DepartmentName }}</div>
        <div class="col-span-3">醫師：{{ bookingDataObj.DoctorName }}</div>
        <div class="col-span-3">診間：{{ bookingDataObj.RoomName }}</div>
        <div class="col-span-3">繳費狀態：{{ bookingDataObj.IdentityName }}</div>
        <div class="col-span-3" v-if="opdRecordData && opdRecordData.OpdDiagnoses.length">
          主診斷：{{ opdRecordData.OpdDiagnoses[0].Icd10Code }}
        </div>
      </div>
      <div>
        <table class="forgetNhiCardMakeUpTable mb-2" v-if="opdRecordData">
          <tr>
            <th>序號</th>
            <th>藥品代碼</th>
            <th>藥品名稱</th>
            <th>日劑量</th>
            <th>單位</th>
            <th>頻次</th>
            <th>日份</th>
            <th>自費<br />天數</th>
            <th>健保<br />天數</th>
            <th>調劑</th>
            <th>磨粉</th>
            <th>自費<br />總量</th>
            <th>健保<br />總量</th>
            <th>慢箋</th>
            <th>途徑</th>
          </tr>
          <tr v-for="(item, index) in opdRecordData.OpdMedications" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.MedicineId }}</td>
            <td>{{ item.CName }}</td>
            <td>{{ item.DoseOnce }}</td>
            <td>{{ item.MedicationUnitCode }}</td>
            <td>{{ item.FrequencyCode }}</td>
            <td>{{ item.MedicationDays + item.MedicationDays2 }}</td>
            <td>{{ item.MedicationDays }}</td>
            <td>{{ item.MedicationDays2 }}</td>
            <td>{{ item.Formula ? '是' : '否' }}</td>
            <td>{{ item.Mill ? '是' : '否' }}</td>
            <td>{{ item.TotalAmount }}</td>
            <td>{{ item.TotalAmount2 }}</td>
            <td>{{ item.ChronicNotes ? '是' : '否' }}</td>
            <td>{{ item.RouteCode }}</td>
          </tr>
        </table>
      </div>
      <div class="flex justify-end">
        <q-btn color="primary" @click="writeCard">確認</q-btn>
      </div>
    </template>
    <div v-else>查無資料</div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { reactive, ref, watch, onMounted, nextTick, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery'
import { useQuasar } from 'quasar'
import { getRoomBooking, postOpd, getOpdRecordItem, getWriteNhiCardBase64 } from 'api'
import { useCardReaderStore } from 'stores/card-reader'

const $q = useQuasar()
const cardReaderStore = useCardReaderStore()
const emit = defineEmits(['afterWrite'])

const props = defineProps({
  identitySelectData: {
    type: Object,
    default: null,
  },
  isEmergency: {
    type: Boolean,
    default: false,
  },
})

const bookingData = ref(null)
const opdRecordData = ref(null)
const base64Data = ref(null)

const bookingDataObj = computed(() => {
  if (bookingData.value && bookingData.value.Items[bookingData.value.Items.length - 1])
    return bookingData.value.Items[bookingData.value.Items.length - 1]
  else return null
})

const getData = async () => {
  if (!props.identitySelectData) return 0
  const data = {
    $filter: `Identity eq 'Z' and PatientId eq '${props.identitySelectData.PatientId}'`,
  }
  bookingData.value = await getRoomBooking(setSearchQuery(data)).then((res) => res.data)
  if (bookingDataObj.value) {
    let bookingId = await postOpd(bookingDataObj.value.RegId).then((res) => res.data)
    opdRecordData.value = await getOpdRecordItem(bookingId).then((res) => res.data)
    base64Data.value = await getWriteNhiCardBase64(bookingId).then((res) => res.data.base64)
  }
}

const writeCard = async () => {
  const { data, error } = await cardReaderStore.writeHeathyCard(base64Data.value)
  if (error) {
    $q.notify({
      type: 'negative',
      message: '寫入健保卡失敗：' + error,
      position: 'top',
    })
  }
  if (data) {
    emit('afterWrite', data)
  }
}

getData()
</script>

<style lang="scss" scoped>
.forgetNhiCardMakeUp {
  .forgetNhiCardMakeUpTitle {
    font-size: 26px;
    font-weight: bold;
  }
  .forgetNhiCardMakeUpTable {
    width: 100%;
    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 10px;
    }
  }
}
</style>

