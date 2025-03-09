<template>
  <q-page>
    <my-title>
      <div>急診掛號作業</div>
      <q-space></q-space>
      <div class="flex gap-1">
        <q-btn class="header-btn" label="確認急診掛號" unelevated dense @click="onBookingClick"></q-btn>
      </div>
    </my-title>

    <my-aside width="120">
      <leftMenu ref="bookingAsideRef"></leftMenu>
    </my-aside>

    <booking-edit-item edit-type="booking" wrapperType="item"></booking-edit-item>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import BookingEditItem from 'pages/booking/components/BookingEditItem.vue'
import leftMenu from 'pages/booking/components/leftMenu.vue'
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'
import { useBookingStore } from 'stores/booking'
import BookingInfoItem from 'pages/booking/components/BookingInfoItem.vue'
import { getPatientItem, postPatientItem } from 'api'
import { pickBy, isNull } from 'lodash-es'

const $q = useQuasar()
const bookingStore = useBookingStore()

const bookingAsideRef = ref()

const GetPatientItem = async (patientId) => {
  try {
    const res = await getPatientItem(patientId)
    return { data: res.data, response: res }
  } catch (error) {
    return { error }
  }
}

const PostPatientItem = async (patientData) => {
  try {
    const res = await postPatientItem(patientData)
    return { data: res.data, response: res }
  } catch (error) {
    return { error }
  }
}

const onBookingClick = async () => {
  const result = await bookingStore.validate()

  if (result === false) {
    return
  }

  const bookingErrorMessage = (error) => {
    $q.notify({
      type: 'negative',
      message:
        '急診掛號發生錯誤：' +
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)),
      position: 'top',
    })
  }

  if (bookingStore.patientData.FallDownFlag) {
    const body = {
      PersonId: bookingStore.patientData.PersonId,
      Status: 1,
      Person: {
        PersonId: bookingStore.patientData.PersonId,
        Name: bookingStore.patientData.Name,
        GenderCode: bookingStore.patientData.GenderCode,
      },
    }
    const { data: patientId, error } = await PostPatientItem(body)
    if (error) {
      bookingErrorMessage(error)
      return
    }

    if (patientId) {
      const { data: patientData, error } = await GetPatientItem(patientId)
      if (error) {
        bookingErrorMessage(error)
        return
      }
      if (patientData) {
        const data = pickBy(patientData, (item) => !isNull(item))
        bookingStore.setPatientData(data)
      }
    }
  }

  $q.dialog({
    component: BookingInfoItem,
    componentProps: {
      bookingType: 'emergency',
      bookingData: Object.assign(bookingStore.patientData, {
        AsignDate: dayjs().format(),
      }),
    },
  })
}
</script>

