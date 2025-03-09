<template>
  <q-page>
    <my-title title="檢驗簽收作業-待串API"></my-title>

    <div class="px-2">
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
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" v-model="search.patientId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <div class="flex">
          <div class="flex items-center">
            <q-checkbox id="checkbox-1" v-model="search.急作" binary ></q-checkbox>
            <label for="checkbox-1">急作</label>
          </div>
          <div class="flex items-center ml-2">
            <q-checkbox id="checkbox-2" v-model="search.非急作" binary ></q-checkbox>
            <label for="checkbox-2">非急作</label>
          </div>
        </div>
      </my-search-area>

      <div class="bg-white">
        <div class="flex justify-end">
          <Button>簽收</Button>
        </div>
        <div class="flex" style="height: 640px">
          <div class="w-full">
            <div class="bg-[#2968AC] text-white text-center px-2 py-1">可選取項目</div>
            <q-table :columns="columns" :rows="canSelectList"> </q-table>
          </div>
          <div
            class="bg-[#003D82] flex justify-center items-center cursor-pointer"
            style="width: 60px"
            @click="moveData"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right-arrow-left']" class="text-white" />
          </div>
          <div class="w-full">
            <div class="bg-[#2968AC] text-white text-center px-2 py-1">已選取項目</div>
            <q-table :columns="columns" :rows="selectedList"> </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import _ from 'lodash'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props'

const columns = [
  { name: '急作', label: '急作', field: '急作' },
  { name: '申請單號', label: '申請單號', field: '申請單號' },
  { name: '病歷號碼', label: '病歷號碼', field: '病歷號碼' },
  { name: '姓名', label: '姓名', field: '姓名' },
  { name: '檢體名稱', label: '檢體名稱', field: '檢體名稱' },
  { name: '狀態', label: '狀態', field: '狀態' },
  { name: '醫令碼', label: '醫令碼', field: '醫令碼' },
  { name: '檢驗名稱', label: '檢驗名稱', field: '檢驗名稱' },
]

const canSelectList = ref([
  { dataId: 0, applyId: 'a' },
  { dataId: 1, applyId: 'b' },
  { dataId: 2, applyId: 'c' },
  { dataId: 3, applyId: 'd' },
  { dataId: 4, applyId: 'e' },
  { dataId: 5, applyId: 'f' },
  { dataId: 6, applyId: 'g' },
  { dataId: 7, applyId: 'h' },
  { dataId: 8, applyId: 'i' },
  // { dataId: 9, applyId: 'j' },
  // { dataId: 10, applyId: 'k' },
  // { dataId: 11, applyId: 'l' },
])

const selectedList = ref([])

const canSelectList_selected = ref([])
const selectedList_selected = ref([])

const search = reactive({
  examinationGroup: '',
  applyId: '',
  applyDateStart: '',
  applyDateEnd: '',
  patientId: '',
})

const searchSubmit = () => {
  // const query = `?limit=${pageOptions.perPageCount}&${searchQuery.value}`
  // GetBedLevel(query)
  // pageOptions.firstIndex = 0
}

const searchClear = () => {
  // const query = `?limit=${pageOptions.perPageCount}`
  // _.forEach(Object.keys(search), (key) => {
  //   search[key] = ''
  // })
  // GetBedLevel(query)
  // pageOptions.firstIndex = 0
}

const moveData = () => {
  if (canSelectList_selected.value.length > 0) {
    _.forEach(canSelectList_selected.value, (selectedItem) => {
      _.remove(canSelectList.value, (item) => item.dataId === selectedItem.item.dataId)
      selectedList.value.push(selectedItem.item)
    })
    selectedList.value = _.sortBy(selectedList.value, ['applyId'])
    canSelectList_selected.value = []
  }

  if (selectedList_selected.value.length > 0) {
    _.forEach(selectedList_selected.value, (selectedItem) => {
      _.remove(selectedList.value, (item) => item.dataId === selectedItem.item.dataId)
      canSelectList.value.push(selectedItem.item)
    })
    canSelectList.value = _.sortBy(canSelectList.value, ['applyId'])
    selectedList_selected.value = []
  }
}
</script>

