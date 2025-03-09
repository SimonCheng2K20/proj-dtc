<template>
  <q-page class="grid grid-cols-2 p-3 gap-3">
    <div class="bg-[#E9E9E9] px-6 font-semibold">
      <div class="w-6/12 py-3">
        <my-input-group ref="searchWrapper" class="grid gap-2">
          <my-input-wrapper label="科別"
            ><q-select v-bind="QSelectProps" v-model="search.Departments"></q-select
          ></my-input-wrapper>
          <my-input-wrapper label="主治醫師"
            ><q-select v-bind="QSelectProps" v-model="search.Doctor"></q-select
          ></my-input-wrapper>
        </my-input-group>
      </div>
      <div class="py-3">
        <p class="text-lg">(主治醫師)看診時間:</p>
        <MyCalendarGrid>
          <template v-slot:[date]> Btn at here </template>
        </MyCalendarGrid>
      </div>
    </div>
    <div class="font-semibold border border-solid border-sky-600 p-2">
      <p class="text-xl">預約:</p>
      <q-table v-bind="QTableProps" :columns="columns" :row="rows"> </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import MyCalendarGrid from 'components/MyCalendarGrid.vue'
import dayjs from 'dayjs'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const date = dayjs().format('YYYY-MM-DD')

const columns = reactive([
  { name: 'action', label: '操作' },
  { name: 'Date', label: '日期' },
  { name: 'Departments', label: '科別' },
  { name: 'Doctor', label: '醫師' },
  { name: 'action', label: '診間' },
  { name: 'number', label: '就診號' },
])

const rows = ref([])

const initData = {
  Doctor: null,
  Departments: null,
}

const search = reactive({ ...initData })
</script>
