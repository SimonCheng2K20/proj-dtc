<template>
  <q-page>
    <my-title :title="title"></my-title>

    <q-tabs
      v-model="tab"
      class="mt-2 pr-2 pl-2"
      content-class="gap-2"
      indicator-color="primary"
      active-bg-color="primary"
      active-color="white"
      align="left"
      dense
    >
      <q-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :name="tab.to.name"
        :label="tab.label"
        class="border border-blue-500"
        @click="router.push(tab.to)"
      ></q-tab>
    </q-tabs>

    <!-- <q-separator></q-separator> -->

    <div class="p-2">
      <router-view></router-view>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { label: '護理站書記', to: { name: 'NursingStation-Clerk' } },
  { label: '護理站作業', to: { name: 'NursingStation-Task' } },
  { label: '護理站執行', to: { name: 'NursingStation-Implement-BedList' } },
  { label: '護理交班', to: { name: 'NursingStation-ChangeShift' } },
]

const tab = ref(
  (() => {
    const currentTab = tabs.find((tab) => route.name.includes(tab.to.name))
    return currentTab?.to?.name || 'NursingStation-Clerk'
  })()
)

const title = computed(() => {
  const find = tabs.find((tab) => route.name.includes(tab.to.name))

  const subTitleList = {
    // 入院作業
    'NursingStation-Clerk-InHospital-InHospitalData': '入院作業 - 入院資料',
    'NursingStation-Clerk-InHospital-IdentityChange': '入院作業 - 身分變更',
    'NursingStation-Clerk-InHospital-BedChange': '入院作業 - 轉床/互轉',
    'NursingStation-Clerk-InHospital-Food': '入院作業 - 伙食',

    // 病患資訊
    'NursingStation-Task-MedicationRecord': '病患資訊 - 用藥紀錄',
    'NursingStation-Task-ProcedureRecord': '病患資訊 - 檢查處置紀錄',
    'NursingStation-Task-IpdRecord': '病患資訊 - 歷史病歷',
    'NursingStation-Task-ExaminationReport': '病患資訊 - 檢驗報告',
    'NursingStation-Task-ImageReport': '病患資訊 - 影像報告',

    // 帳務作業
    'NursingStation-Clerk-Accounting-PricingSearch': '批價查詢',
    // 'NursingStation-Clerk-Accounting-ProcedureSearch': '醫令查詢',
    // 'NursingStation-Clerk-Accounting-BedPriceSearch': '病床費固定費用查詢',
  }

  const subTitle = subTitleList[route.name]

  let title = ''
  if (find) {
    title = find.label

    if (subTitle) {
      title += ` - ${subTitle}`
    }
  }

  return title
})
</script>

