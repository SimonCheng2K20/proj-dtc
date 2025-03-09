<template>
  <div>
    <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper label="醫令類別">
        <q-input v-bind="QInputProps" v-model="search.code" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="自購註記">
        <q-input v-bind="QInputProps" v-model="search.name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="執行起訖日期" range-input class="col-span-2">
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.dateStart"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.dateEnd"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="醫令代碼">
        <q-input v-bind="QInputProps" v-model="search.code" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="醫令名稱">
        <q-input v-bind="QInputProps" v-model="search.name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
    </my-search-area>

    <q-table ref="tableRef" v-bind="QTableProps" :rows="tableData" :columns="tableColumns" :pagination="pagination">
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="pageChange"></my-pagination>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ProcedureTable from 'components/opd/ProcedureTable.vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props'

const search = reactive({})
const tableColumns = ref([
  {
    name: 'class',
    label: '類別',
    field: 'class',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'code',
    label: '醫令代碼',
    field: 'code',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[120px]',
  },
  {
    name: 'codeName',
    label: '醫令名稱',
    field: 'codeName',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'doseOne',
    label: '單次劑量',
    field: 'doseOne',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'unit',
    label: '單位',
    field: 'unit',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'frequency',
    label: '頻率',
    field: 'frequency',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'startDate',
    label: '執行起日',
    field: 'startDate',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'endDate',
    label: '執行迄日',
    field: 'endDate',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'amount',
    label: '總量',
    field: 'amount',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'paySelf',
    label: '健保/自費',
    field: 'paySelf',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'level',
    label: '成數',
    field: 'level',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'state',
    label: '狀態',
    field: 'state',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'payDay',
    label: '計價日',
    field: 'payDay',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'healthPrice',
    label: '健保單價',
    field: 'healthPrice',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'healthPriceTotal',
    label: '健保總價',
    field: 'healthPriceTotal',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'selfPrice',
    label: '自費單價',
    field: 'selfPrice',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'selfPriceTotal',
    label: '自費總價',
    field: 'selfPriceTotal',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'doctor',
    label: '執行醫師',
    field: 'doctor',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'priceClerk',
    label: '批價員',
    field: 'priceClerk',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
])

const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })
const tableData = []
</script>

