<template>
  <div>
    <my-search-area>
      <my-input-wrapper label="住院日" range-input>
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
    </my-search-area>

    <q-table class="mt-2" v-bind="QTableProps" :columns="columns"></q-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import dayjs from 'dayjs'

const columns = [
  { name: '住院日', label: '住院日', field: '住院日' },
  { name: '病床號', label: '病床號', field: '病床號' },
  { name: '住院天數', label: '住院天數', field: '住院天數' },
  { name: '病床費', label: '病床費', field: '病床費' },
  { name: '診察費', label: '診察費', field: '診察費' },
  { name: '護理費', label: '護理費', field: '護理費' },
  { name: '藥事服務費', label: '藥事服務費', field: '藥事服務費' },
  { name: '伙食費', label: '伙食費', field: '伙食費' },
  { name: '其他一', label: '其他一', field: '其他一' },
  { name: '其他二', label: '其他二', field: '其他二' },
  { name: '其他三', label: '其他三', field: '其他三' },
]

const search = reactive({
  dateStart: dayjs().format('YYYY-MM-DD'),
  dateEnd: dayjs().format('YYYY-MM-DD'),
})
</script>

