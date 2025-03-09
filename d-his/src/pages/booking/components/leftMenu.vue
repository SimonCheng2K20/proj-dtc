<template>
  <div class="flex flex-col pt-2 gap-2">
    <q-dialog v-model="openBarCode" full-width>
      <my-dialog-content header="補印條碼" width="40vw" @close="openBarCode = false">
        <barCode :getData="bookingStore.patientData" />
      </my-dialog-content>
    </q-dialog>
    <q-dialog v-model="openForgetNhiCardMakeUp" full-width>
      <my-dialog-content header="補卡取號" width="90vw" @close="openForgetNhiCardMakeUp = false">
        <forgetNhiCardMakeUp
          :identitySelectData="bookingStore.patientData"
          @afterWrite="openForgetNhiCardMakeUp = !openForgetNhiCardMakeUp"
        />
      </my-dialog-content>
    </q-dialog>
    <div class="relative pt-8 px-1">
      <img class="absolute top-0 left-1/2 translate-x-[-50%] w-10" src="../../../assets/ic_card.png" />
      <div class="border border-blue-500 rounded pt-2 flex flex-col">
        <read-healthy-card-btn
          class="white-nowrap"
          :q-btn-props="{
            color: 'white',
            'text-color': 'default',
            dense: true,
          }"
          @read="onReadCard"
        ></read-healthy-card-btn>
        <q-btn
          label="IC卡內容"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="router.push({ name: 'bookingICCard' })"
        ></q-btn>
        <q-btn
          label="補卡取號"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="openForgetNhiCardMakeUpBox"
        ></q-btn>
      </div>
    </div>
    <div class="relative pt-8 px-1" v-if="!isEmergency">
      <img class="absolute top-0 left-1/2 translate-x-[-50%] w-10" src="../../../assets/edit.png" />
      <div class="border border-blue-500 rounded pt-2 flex flex-col">
        <q-btn
          label="取消/轉診"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="bookingStore.isPatientBookingListShow = !bookingStore.isPatientBookingListShow"
        ></q-btn>
        <q-btn label="掛號查詢" color="white" text-color="default" dense unelevated @click="toBookedSearch"></q-btn>
        <q-btn
          label="查看進度"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="router.push({ name: 'BookingProgress' })"
        ></q-btn>
      </div>
    </div>
    <div class="relative pt-8 px-1">
      <img class="absolute top-0 left-1/2 translate-x-[-50%] w-10" src="../../../assets/case.png" />
      <div class="border border-blue-500 rounded pt-2 flex flex-col">
        <q-btn
          v-if="isEmergency"
          label="看診進度"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="
            router.push({
              name: 'ConsultationProgress',
            })
          "
        ></q-btn>
        <q-btn
          v-if="isEmergency"
          label="病患資料編修"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="
            router.push({
              name: 'PatientDataEdit',
            })
          "
        ></q-btn>
        <q-btn
          :label="bookingStore.patientData.PatientId ? '修改病歷' : '初診病歷'"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="onPatientInfoClick"
        ></q-btn>
        <q-btn
          v-if="isEmergency"
          label="補印條碼"
          color="white"
          text-color="default"
          dense
          unelevated
          @click="showBarCode(bookingStore)"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import ReadHealthyCardBtn from 'components/action-btns/ReadHealthyCardBtn.vue'
import barCode from './barCode.vue'
import forgetNhiCardMakeUp from './forgetNhiCardMakeUp.vue'
import BookedSearch from './BookedSearch.vue'
import { ref, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import PatientManageEditItem from './PatientManageEditItem.vue'
import { useBookingStore } from 'stores/booking.js'

const bookingStore = useBookingStore()
const $q = useQuasar()
const isEmergency = computed(() => route.name === 'EmergencyBooking')
const openBarCode = ref(false)
const openForgetNhiCardMakeUp = ref(false)

const router = useRouter()
const route = useRoute()

const emit = defineEmits(['showBookingList', 'readHealthyCard'])
const onReadCard = (data) => {
  console.log('read-health-card',data)
  if (data) {
    bookingStore.emitter.emit('read-health-card', data)
  }
}

const onPatientInfoClick = () => {
  router.push({
    name: 'PatientManage',
    query: { PatientId: route.query.PatientId },
  })
}

const openForgetNhiCardMakeUpBox = () => {
  if (bookingStore.patientData) {
    openForgetNhiCardMakeUp.value = !openForgetNhiCardMakeUp.value
  } else {
    $q.notify({
      type: 'negative',
      message: '未選擇病患' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const toBookedSearch = () => {
  const dialog = $q.dialog({
    component: BookedSearch,
  })
}

const showBarCode = () => {
  openBarCode.value = true
}
</script>
