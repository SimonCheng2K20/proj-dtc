<template>
  <div>
    <q-tabs
      v-model="tab"
      content-class="gap-2"
      indicator-color="primary"
      active-bg-color="primary"
      active-color="white"
      align="left"
      dense
    >
      <q-route-tab
        v-for="(tab, index) in tabs"
        :key="index"
        v-bind="tab"
        class="border border-blue-500"
        @click="onTabClick($event, tab.to)"
      ></q-route-tab>
    </q-tabs>

    <q-separator></q-separator>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useIpdStore } from 'stores/ipd'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const ipdStore = useIpdStore()
const route = useRoute()

const tab = ref()
const tabs = computed(() => {
  return [
    { label: '病患清單', to: { name: 'NursingStation-Implement-BedList' } },
    { label: '執行給藥', to: { name: 'NursingStation-Implement-DrugToDo' } },
    {
      label: 'Vital Signs',
      to: { name: 'NursingStation-Implement-VitalSign', params: { ipdId: ipdStore.ipdData.IpdId } },
    },
    {
      label: '管灌及營養照護紀錄',
      to: { name: 'NursingStation-Implement-NutritionalCare', params: { ipdId: ipdStore.ipdData.IpdId } },
    },
  ]
})

const onTabClick = (evt, to) => {
  if (to.name === 'NursingStation-Implement-VitalSign' || to.name === 'NursingStation-Implement-NutritionalCare') {
    if (!ipdStore.ipdData.IpdId) {
      $q.notify({
        type: 'negative',
        message: '請選擇病患',
        position: 'top',
      })
      evt.preventDefault()
      return
    }
  }
}

const init = () => {
  ipdStore.GetIpdRecordList({ $filter: `Status eq '2'`, $orderBy: 'ModifyDatetime desc' })
  if (route.params.ipdId && !ipdStore.ipdData.IpdId) ipdStore.GetIpdRecordItem(route.params.ipdId)
}
init()
</script>

