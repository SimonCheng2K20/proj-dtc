<template>
  <div class="iccard">
    <header class="page-header justify-between fixed">
      <div class="text-2xl">檢閱IC卡內容</div>
      <div class="flex gap-1">
        <q-btn class="btn-sp" dense unelevated label="回上一頁" @click="router.go(-2)"></q-btn>
      </div>
    </header>
    <div class="iccardTitle p-2">基本資料</div>
    <div class="p-2 grid grid-cols-12 gap-4">
      <div class="col-span-3">
        <div class="iccardItem">卡片號碼： {{ cardData.Cardcode || '' }}</div>
        <div class="iccardItem">身分證號: {{ cardData.Idenifier || '' }}</div>
        <div class="iccardItem">姓名： {{ cardData.Name || '' }}</div>
        <div class="iccardItem">出生年月日： {{ cardData.Birthday || '' }}</div>
      </div>
      <div class="col-span-3">
        <div class="iccardItem">性別：{{ cardData.Gender === 'M' ? '男' : '女' }}</div>
        <div class="iccardItem">發卡日期：</div>
        <div class="iccardItem">卡片註銷註記： {{ cardData.Remark || '' }}</div>
      </div>
    </div>
    <div v-if="currentTab === 'type1'">
      <div class="iccardTitle p-2">最近就醫紀錄</div>
      <div class="p-2 grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <div class="iccardItem">最近一次就醫序號：</div>
          <div class="iccardItem">就醫醫療費用紀錄：</div>
        </div>
      </div>
      <v-data-table class="p-5" :headers="headersTab1" :items="itemsTab1" hide-default-footer></v-data-table>
    </div>
    <div v-if="currentTab === 'type2'">
      <div class="iccardTitle p-2">用藥紀錄</div>
      <v-data-table class="mt-3 p-5" :headers="headersTab2" :items="itemsTab2" hide-default-footer></v-data-table>
    </div>
    <div v-if="currentTab === 'type3'">
      <div class="iccardTitle p-2">檢查紀錄</div>
      <v-data-table class="mt-3 p-5" :headers="headersTab3" :items="itemsTab3" hide-default-footer></v-data-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCardReaderStore } from 'stores/card-reader'
import { useQuasar } from 'quasar'

const cardReaderStore = useCardReaderStore()

const router = useRouter()
const $q = useQuasar()

const tabs = reactive([
  { label: '就醫紀錄', value: 'type1' },
  { label: '用藥紀錄', value: 'type2' },
  { label: '檢查紀錄', value: 'type3' },
])

//就醫紀錄
const headersTab1 = reactive([
  { text: '序號', value: 'No' },
  { text: '費用', value: 'Fee' },
])
const itemsTab1 = ref([])

//用藥紀錄
const headersTab2 = reactive([
  { text: '序號', value: 'No' },
  { text: '藥品名稱', value: 'Name' },
  { text: '日劑量', value: 'DoseDay' },
  { text: '頻次', value: 'FrequencyCode' },
  { text: '途徑', value: 'RoutCode' },
  { text: '天數', value: 'MedDay' },
])
const itemsTab2 = ref([])

//檢查紀錄
const headersTab3 = reactive([
  { text: '序號', value: 'No' },
  { text: '檢查名稱', value: 'Name' },
])
const itemsTab3 = ref([])

const currentTab = ref('type1')

const cardData = ref({})

const readIdCard = async () => {
  try {
    const res = await cardReaderStore.readHealthyCard()

    console.log('res', res, JSON.parse(res))

    const allCardData = JSON.parse(res)
    cardData.value = { ...allCardData }

    //itemsTab1.value = [...allCardData?.Attend];
    //itemsTab2.value = [...allCardData?.Medication];
    //itemsTab3.value = [...allCardData?.Inspection];
  } catch (error) {
    console.log('error', error)
    $q.notify({
      type: 'negative',

      message: 'IC卡內容取得失敗' + ' ' + error?.type,
      position: 'top',
    })
  }
}

onMounted(() => {
  readIdCard()
})
</script>

<style lang="scss" scoped>
.iccard {
  margin-top: 50px;
  height: calc(100vh - 70px - 50px);
  background-color: #fff;
  .iccardTitle {
    background-color: #cbe3f3;
    color: #0a2548;
    font-size: 20px;
    font-weight: bold;
  }
  .iccardItem {
    font-weight: bold;
  }
}
</style>
