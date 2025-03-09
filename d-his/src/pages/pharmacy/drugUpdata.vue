<template>
  <div>
    <header class="page-header">
      <div>藥價更新作業-待串API</div>
      <div class="spacer"></div>
      <div class="flex gap-1">
        <q-btn class="btn-sp" dense unelevated label="匯入藥價更新資料" @click="toUplaod"></q-btn>
        <q-btn class="btn-sp" dense unelevated label="匯出Excel" @click="null"></q-btn>
        <q-btn class="btn-sp" dense unelevated label="更新藥價" @click="postUpdata"></q-btn>
      </div>
    </header>

    <div class="p-2">
      <v-data-table :headers="headers" :items="[]" :pageOptions="pageOptions" @pageChange="pageChange"> </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import numberFormat from 'utils/numberFormat'
console.log(numberFormat('aa'))
const headers = reactive([
  { text: '停用', value: 'disabled' },
  { text: '健保代碼', value: 'healthCode' },
  { text: '院內碼', value: 'drugCode' },
  { text: '藥品名稱', value: 'drugName' },
  { text: '原單價', value: 'originPrice' },
  { text: '新單價', value: 'newPrice' },
  { text: '價差', value: 'differencePrice' },
  { text: '廠商', value: 'company' },
  { text: '生效日期', value: 'effectDate' },
  { text: '選取', value: 'select' },
])

const toUplaod = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', '.txt')
  input.click()
}

const postUpdata = () => {}
</script>
