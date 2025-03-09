<template>
  <div>
    <header class="page-header justify-between">
      <div class="text-2xl">檢體報告輸入作業-待串API</div>
    </header>

    <div class="px-2 mt-4">

      <div class="bg-white">
        <div class="flex flex-wrap py-4" v-if="currentTab !== 'editReport'">
          <my-search-area grid-cols="4">
            <my-input-wrapper label="檢驗組別">
              <q-input v-bind="QInputProps" v-model="search.examinationGroup" @keydown.enter="searchSubmit"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="申請單號">
              <q-input v-bind="QInputProps" v-model="search.applyId" @keydown.enter="searchSubmit"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="申請日期" range-input class="col-span-2">
              <template #range-input-0>
                <my-date-input
                  v-bind="QInputProps"
                  v-model="search.applyDateStart"
                  @keydown.enter="searchSubmit"
                  @date-select="searchSubmit"
                ></my-date-input>
              </template>
              <template #range-input-1>
                <my-date-input
                  v-bind="QInputProps"
                  v-model="search.applyDateEnd"
                  @keydown.enter="searchSubmit"
                  @date-select="searchSubmit"
                ></my-date-input>
              </template>
            </my-input-wrapper>
            <my-input-wrapper label="病歷號碼">
              <q-input v-bind="QInputProps" v-model="search.patientId" @keydown.enter="searchSubmit"></q-input>
            </my-input-wrapper>
            <div class="flex mr-2 mb-2">
              <div class="flex items-center">
                <q-checkbox id="checkbox-1" class="mr-1" v-model="search.急作" binary />
                <label class="cursor-pointer" for="checkbox-1">急作</label>
              </div>
              <div class="flex items-center ml-2">
                <q-checkbox id="checkbox-2" class="mr-1" v-model="search.非急作" binary />
                <label class="cursor-pointer" for="checkbox-2">非急作</label>
              </div>
            </div>
          </my-search-area>
        </div>
        <div class="flex" v-if="currentTab === 'editReport'">
          <div>申請序號：</div>
          <div>病歷號碼：</div>
          <div>姓名：</div>
        </div>

        <div>
          <v-data-table v-if="currentTab === 'reportSearch'" :headers="reportSearchHeaders"></v-data-table>
          <v-data-table v-if="currentTab === 'editReport'" :headers="editReportHeaders"></v-data-table>
          <v-data-table v-if="currentTab === 'editReportSearch'" :headers="editReportSearchHeaders"></v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props'

const tabs = reactive([
  { label: '報告查詢', value: 'reportSearch' },
  { label: '報告輸入', value: 'editReport' },
  { label: '修改報告查詢', value: 'editReportSearch' },
])

const currentTab = ref('reportSearch')

const reportSearchHeaders = reactive([
  { text: '急作' },
  { text: '申請單號' },
  { text: '狀態' },
  { text: '病歷號碼' },
  { text: '姓名' },
  { text: '檢體名稱' },
  { text: '簽收時間' },
])

const editReportHeaders = reactive([
  { text: '急作' },
  { text: '檢驗號' },
  { text: '檢體名稱' },
  { text: '狀態' },
  { text: '醫令碼' },
  { text: '檢驗名稱' },
  { text: '檢驗結果' },
  { text: '單位' },
  { text: '標準(低)' },
  { text: '標準(高)' },
  { text: '簽收時間' },
  { text: '上次檢驗結果' },
  { text: '上次檢驗時間' },
])

const editReportSearchHeaders = reactive([
  { text: '急作' },
  { text: '申請單號' },
  { text: '檢驗號' },
  { text: '狀態' },
  { text: '病歷號碼' },
  { text: '姓名' },
  { text: '檢體名稱' },
  { text: '報告(修改)時間' },
])

const search = reactive({
  examinationGroup: '',
  applyId: '',
  applyDateStart: '',
  applyDateEnd: '',
  patientId: '',
})
</script>

