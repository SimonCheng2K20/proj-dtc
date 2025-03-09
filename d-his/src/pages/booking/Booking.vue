<template>
  <q-page>
    <my-title>
      <div>
        {{ route.name === 'TodayBooking' ? '當日掛號作業' : '預約掛號作業' }}
      </div>
      <q-space></q-space>
      <q-btn
        class="header-btn"
        label="預約掛號"
        dense
        unelevated
        @click="router.push({ name: 'ReserveBooking' })"
        v-if="route.name === 'TodayBooking'"
      ></q-btn>
      <q-btn
        class="header-btn"
        label="當日掛號"
        dense
        unelevated
        @click="router.push({ name: 'TodayBooking' })"
        v-else
      ></q-btn>
    </my-title>

    <my-aside width="120" :border="false">
      <div class="flex no-wrap h-full justify-center">
        <left-menu class="shrink-0"></left-menu>
      </div>
    </my-aside>
    <div class="mx-2 relative">
      <q-btn
        class="w-full font-extrabold"
        :style="!showPatientData ? '' : 'display:none'"
        style="border: 1px solid #1e40af"
        dense
        unelevated
        label="病患資料-點擊展開"
        icon-right="expand_more"
        @click="patientDataClick"
      ></q-btn>

      <q-btn
        class="w-full font-extrabold leading-7 text-center bg-grey-2 cursor-pointer absolute z-10 left-0"
        :style="showPatientData ? '' : 'display:none'"
        dense
        unelevated
        @click="patientDataClick"
        icon="expand_less"
      ></q-btn>

      <booking-edit-item
        class="grow scroll pt-6"
        :style="showPatientData ? '' : 'display:none'"
        ref="bookingSearchRef"
        edit-type="booking"
        wrapper-type="item"
      ></booking-edit-item>
    </div>

    <schedule-table class="p-2" ref="scheduleTableBox"></schedule-table>
  </q-page>
</template>

<script setup>
import BookingEditItem from './components/BookingEditItem.vue'
import LeftMenu from './components/LeftMenu.vue'
import ScheduleTable from './components/ScheduleTable.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

const showPatientData = ref(true)

const patientDataClick = () => {
  showPatientData.value = !showPatientData.value
}
</script>

