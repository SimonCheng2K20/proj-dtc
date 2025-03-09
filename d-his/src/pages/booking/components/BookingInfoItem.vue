<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="掛號資料" @close="onDialogCancel">
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="掛號日期" require-mark>
          <q-input
            v-bind="QInputProps"
            :model-value="bookingData.AsignDate?.substring(0, 10) || bookingData.BookingDate?.substring(0, 10)"
            readonly
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper v-if="bookingType !== 'emergency'" label="醫生姓名" require-mark>
          <q-input
            v-bind="QInputProps"
            :model-value="bookingData.PersonName || bookingData.DoctorName"
            readonly
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="看診號" require-mark>
          <q-input
            v-bind="QInputProps"
            :model-value="(bookingData.Booking || bookingData.Seq || 0) + 1"
            readonly
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病歷號碼" require-mark>
          <q-input v-bind="QInputProps" :model-value="bookingData.PatientId" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名" require-mark>
          <q-input v-bind="QInputProps" :model-value="bookingData.Name" readonly></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn unelevated color="secondary" :label="btnLabel" :loading="submitLoading" @click="onBookingClick" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { deleteRoomBooking, postRoomBooking } from 'api'
import BookingSubItem from 'pages/booking/components/BookingSubItem.vue'
import dayjs from 'dayjs'
import { pick } from 'lodash-es'

const route = useRoute()
const router = useRouter()

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  bookingType: String, // booking, reserve, emergency, change, cancel
  bookingData: Object,
})

const btnLabel = computed(() => {
  switch (props.bookingType) {
    case 'change':
      return '修改轉掛'
    case 'cancel':
      return '取消掛號'
    default:
      return '確認掛號'
  }
})
const submitLoading = ref(false)
const onBookingClick = async () => {
  switch (props.bookingType) {
    case 'cancel': {
      const { error } = await DeleteRoomBooking(props.bookingData.RegId)
      if (error) {
        $q.notify({
          type: 'negative',
          message: `取消掛號失敗：` + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
          position: 'top',
        })
      } else {
        $q.notify({
          type: 'positive',
          message: '取消掛號成功',
          position: 'top',
        })
      }
      break
    }
    default: {
      try {
        submitLoading.value = true
        const body = {
          // bookingData Attend 不能給，以防有其他欄位也會出錯，只挑出需要打的欄位
          ...pick(props.bookingData, [
            'TransCode',
            'ErDepartmentNo',
            'RegId',
            'RoomNo',
            'TimeSlotNo',
            'PatientId',
            'PersonId',
            'Identity',
            'IdentityDiscount',
            'PartialAfford',
            'SeekMedical',
            'Prevent',
            'CardSerial',
            'CaseType',
            'NhicardCode',
            'AttendCategory',
            'InjuredGrade',
            'ErTrend',
            'ErAfterProcess',
            'ErStatus',
            'FallDownFlag',
          ]),
          BookingDate: props.bookingData.AsignDate,
          Type: dayjs(props.bookingData.AsignDate).isSame(dayjs(), 'day') ? 'O' : 'R',
        }
        //把健保卡讀到的 NhicardCode 塞給 CardSerial 後端要
        body.CardSerial = body.NhicardCode
        console.log('掛號成功', body)
        //婦產科不能讓男性掛號
        if (props.bookingData.GenderCode === 'M' && props.bookingData.DepartmentNo === '05') {
          $q.notify({
            type: 'negative',
            message: `此病患非女性`,
            position: 'top',
          })
          return
        }
        if (props.bookingType === 'change') {
          const { error } = await DeleteRoomBooking(props.bookingData.changeBookingRegId)
          if (error) {
            $q.notify({
              type: 'negative',
              message: `掛號失敗：` + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
              position: 'top',
            })
            return
          }
        }

        const res = await postRoomBooking(body)
        $q.notify({
          type: 'positive',
          message: props.bookingType === 'change' ? '轉診成功' : '掛號成功',
          position: 'top',
        })
        onDialogOK()
        if (route.name === 'EmergencyBooking') {
          confirmInfo()
        }
      } catch (err) {
        console.log(err)
        $q.notify({
          type: 'negative',
          message: `掛號失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
          position: 'top',
        })
      } finally {
        submitLoading.value = false
      }
    }
  }
}

const DeleteRoomBooking = async (id) => {
  try {
    const { data } = await deleteRoomBooking(id)
    return { data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}
const confirmInfo = (Data, Doc) => {
  $q.dialog({
    component: BookingSubItem,
    componentProps: {
      bookingType: 'emergency',
      bookingData: props.bookingData,
      bookingNo: (props.bookingData.Booking || props.bookingData.Seq || 0) + 1,
      bookingDoctor: props.bookingData.PersonName || props.bookingData.DoctorName,
    },
  })
}
</script>

