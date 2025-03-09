<template>
  <q-card class="w-full bg-grey-2" flat>
    <q-card-section class="grid gap-2">
      <div class="text-xl font-bold flex justify-between pr-5">
        病患個人掛號清單
        <q-btn
          label="返回"
          color="primary"
          text-color="white"
          dense
          unelevated
          @click="bookingStore.isPatientBookingListShow = !bookingStore.isPatientBookingListShow"
        ></q-btn>
      </div>
      <div class="grid gap-2 h-60 scroll">
        <q-card v-for="item in patientBookingList" :key="item.RegId">
          <q-card-section class="flex gap-2 justify-end">
            <div class="grow flex items-center">
              <div class="mr-5">
                掛號日期：{{ dayjs(item.BookingDate).format('YYYY/MM/DD') }} -
                {{ item.TimeSlotNo === '1' ? '上午' : item.TimeSlotNo === '2' ? '下午' : '晚間' }}
              </div>
              <div class="mr-5">醫師姓名：{{ item.DoctorName }}</div>
              <div class="mr-5">看診號：{{ item.Seq }}</div>
              <div>看診狀態：{{ item.AttendName }}</div>
            </div>
            <div class="flex gap-2">
              <q-btn
                label="取消掛號"
                color="purple"
                dense
                unelevated
                :disable="isChangeBooking"
                @click="onCancelBookingClick(item)"
              ></q-btn>
              <q-btn
                :label="isChangeBooking && changeBookingRegId === item.RegId ? '取消修改轉掛' : '修改轉掛'"
                :color="isChangeBooking && changeBookingRegId === item.RegId ? 'warning' : 'primary'"
                :text-color="isChangeBooking ? 'default' : 'white'"
                dense
                unelevated
                :disable="isChangeBooking && changeBookingRegId !== item.RegId"
                @click="onChangeBookingClick(item)"
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getPatientBooking } from 'api'
import BookingInfoItem from './BookingInfoItem.vue'
import { useQuasar } from 'quasar'
import { useBookingStore } from 'stores/booking.js'
import dayjs from 'dayjs'
import setSearchQuery from 'utils/setSearchQuery'

const $q = useQuasar()
const bookingStore = useBookingStore()

const patientBookingList = ref([])
const GetPatientBooking = async () => {
  try {
    const query = setSearchQuery({ identify: bookingStore.patientData.PersonId })
    const res = await getPatientBooking(query)
    if (res.status === 200) {
      patientBookingList.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const onCancelBookingClick = async (bookingItem) => {
  const result = await bookingStore.validate()

  if (result) {
    $q.dialog({
      component: BookingInfoItem,
      componentProps: {
        bookingType: 'cancel',
        bookingData: Object.assign(bookingItem, bookingStore.patientData),
      },
    }).onOk(() => {
      GetPatientBooking()
      GetDayBooking()
    })
  }
}

const isChangeBooking = ref(false)
const changeBookingRegId = ref(null)
const onChangeBookingClick = (bookingItem) => {
  isChangeBooking.value = !isChangeBooking.value
  if (isChangeBooking.value) {
    changeBookingRegId.value = bookingItem.RegId
  } else {
    changeBookingRegId.value = null
  }

  bookingStore.setPatientData({
    isChangeBooking: isChangeBooking.value,
    changeBookingRegId: changeBookingRegId.value,
  })
}

const init = () => {
  bookingStore.emitter.on('GetPatientBooking', () => {
    GetPatientBooking()
  })
}
init()
</script>

