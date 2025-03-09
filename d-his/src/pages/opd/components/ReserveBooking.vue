<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="預約掛號" width="1280px" height="90%" @close="onDialogCancel" :loading="getDataLoading">
      <my-calendar-grid ref="calendarRef" @change="onDateChange">
        <template v-for="(items, key) in weekScheduleGroupByDate" :key="key" v-slot:[key]>
          <div class="grid gap-2">
            <q-btn
              v-for="(bookingItem, index) in items"
              :key="index"
              :label="bookingItem.TimeSlotName"
              dense
              unelevated
              :color="getBtnColor(bookingItem.TimeSlotNo)"
              @click="onBookingClick(bookingItem)"
            ></q-btn>
          </div>
        </template>
      </my-calendar-grid>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getWeekSchedule } from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import dayjs from 'dayjs'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import MyCalendarGrid from 'components/MyCalendarGrid.vue'
import { useAuthStore } from 'stores/auth'
import { cloneDeep, groupBy, orderBy } from 'lodash-es'
import BookingInfoItem from 'pages/booking/components/BookingInfoItem.vue'
import { useOpdStore } from 'stores/opd'

const calendarRef = ref()
const authStore = useAuthStore()
const opdStore = useOpdStore()
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const weekScheduleGroupByDate = computed(() => {
  const data = groupBy(orderBy(weekScheduleItems.value, ['TimeSlotNo'], ['asc']), (item) =>
    item.AsignDate ? item.AsignDate.substring(0, 10) : false
  )
  return data
})

const getBtnColor = (TimeSlotNo) => {
  switch (TimeSlotNo) {
    case '1':
      return 'green'
    case '2':
      return 'orange'
    case '3':
      return 'indigo'
  }
}

const getDataLoading = ref(false)
const weekScheduleItems = ref([])
const GetWeekSchedule = async () => {
  console.log('test', authStore.userData)
  try {
    getDataLoading.value = true
    const query = setSearchQuery({
      $filter: filter.value,
      // doctorId: opdStore.opdData.RoomBooking.PersonId,
    })
    const res = await getWeekSchedule(query)
    if (res.status === 200) weekScheduleItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const filter = computed(() => {
  const today = dayjs()

  const currentYear = today.year()
  const currentMonth = today.month() + 1

  let firstDayOnMonth = dayjs(`${currentYear}-${currentMonth}-01`)

  if (calendarRef.value) {
    const year = calendarRef.value.getYear()
    const month = calendarRef.value.getMonth()

    firstDayOnMonth = dayjs(`${year}-${month}-01`)
  }

  const firstDayOnNextMonth = firstDayOnMonth.add(1, 'month')

  const dateFilter = `AsignDate ge ${encodeURIComponent(
    firstDayOnMonth.format()
  )} and AsignDate lt ${encodeURIComponent(firstDayOnNextMonth.format())}`

  return dateFilter + ` and PersonId eq '${opdStore.opdData.RoomBooking.PersonId}'`
})

const onDateChange = () => {
  weekScheduleItems.value = []
  GetWeekSchedule()
}

const onBookingClick = async (bookingItem) => {
  const cloneBookingItem = cloneDeep(bookingItem)
  $q.dialog({
    component: BookingInfoItem,
    componentProps: {
      bookingType: 'reserve',
      bookingData: Object.assign(
        cloneBookingItem,
        { Name: opdStore.opdData.RoomBooking.Patient.Person.Name },
        opdStore.opdData.RoomBooking
      ),
    },
  }).onOk(() => {
    onDialogOK()
  })
}
const init = () => {
  GetWeekSchedule()
}
init()
</script>

