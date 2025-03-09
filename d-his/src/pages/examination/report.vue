<template>
  <div class="all">
    <header class="page-header mb-4">
      <div class="text-2xl">檢體報告查詢作業-待串API</div>
    </header>

    <div class="top">
      <searchBar
        :sItems="sItems"
        :gridNum="3"
        :config="{
          search: true,
          slabel: '進行查詢',
          clear: true,
          clabel: '清除查詢',
          add: false,
        }"
        :initSetup="sVal"
        v-model:results="sVal"
        @sEvt="handleSearch"
      />
    </div>
    <div class="sub">
      <div class="func flex justify-start mt-1 gap-2">
        <Button
          v-for="btn in btns"
          :key="btn.text"
          :label="btn.text"
          class="ml-2"
          :class="btn.isActive ? 'p-button-primary' : 'p-button-secondary'"
          @click.stop="handleClick(btn)"
        />
      </div>
      <div class="list mx-2">
        <side
          :headers="mode === 'track' ? headers1.slice(0, 2) : headers2.slice(0, 1)"
          :items="mode === 'track' ? opt1 : opt2"
          @rowClickEvt="handleAsideClick"
        />
        <v-data-table
          :headers="mode === 'track' ? headers1.slice(3) : headers2.slice(3)"
          :items="mode === 'track' ? items : items2"
          :pageOptions="pageOptions"
          :hideDefaultFooter="true"
        >
          <template #item-test="{ item }">
            <div
              :class="[
                item.test > item.high && 'text-red-500 font-bold text-xl',
                item.test < item.low && 'text-blue-500 font-bold text-xl',
              ]"
            >
              {{ item.test }}
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import _ from 'lodash'
import searchBar from 'components/searchBar.vue'
import side from './components/aside.vue'

export default {
  components: { side, searchBar },
  setup() {
    const sItems = ref([
      { text: '病歷號碼', value: 'num', width: '250px', type: 'inputtext' },
      { text: '申請單號', value: 'serial', type: 'inputtext' },
      { text: '申請日期', value: 'apply', type: 'range', isbreak: true },
      { text: '簽收日期', value: 'receive', type: 'range' },
      { text: '報告日期', value: 'r', type: 'range' },
    ])
    const headers1 = ref([
      { text: '病號號碼', value: 'no', width: '150px', isAside: true },
      { text: '姓名', value: 'tsia', isAside: true },
      { text: '申請單號', value: 'nam222e' },
      { text: '檢驗號', value: 'name' },
      { text: '醫令名稱', value: 'na' },
      { text: '狀態', value: 'status' },
      { text: '檢驗名稱', value: 'nasssme' },
      { text: '簽收人', value: 'ppl1' },
      { text: '簽收日期', value: 'date1' },
      { text: '報告人', value: 'ppl' },
      { text: '報告日期', value: 'date2' },
    ])
    const headers2 = ref([
      { text: '申請單號', value: 'no', width: '280px', isAside: true },
      { text: '檢體名稱', value: 'check', width: '150px' },

      { text: '醫令碼', value: 'na' },

      { text: '檢驗名稱', value: 'nasssme' },
      { text: '檢驗報告', value: 'test' },
      { text: '單位', value: 'unit' },
      { text: '標準(低)', value: 'low' },
      { text: '標準(高)', value: 'high' },
      { text: '申請日期', value: 'datasdfe12' },
      { text: '簽收日期', value: 'pasdfpl' },
      { text: '報告日期', value: 'date24454' },
    ])
    const sVal = ref({
      num: null,
      serial: null,
      apply: [null, null],
      receive: [null, null],
      r: [null, null],
    })

    const opt1 = ref([
      {
        tsia: 'ｏｏ新',
        no: '2002222199885',
        date2: 'date2date2',
        isSelected: true,
      },
      { no: '2002222191199', isSelected: false },
    ])
    const opt2 = ref([{ no: 'eee22e' }])
    const items = ref([
      {
        tsia: 'ｏｏ新',
        no: '2002222199885',
        date2: 'date2date2',
        isSelected: true,
      },
      { no: '2002222191199', isSelected: false },
    ])
    const items2 = ref([
      {
        no: '105059815035',
        date2: 'date2date22',
        isSelected: true,
        high: 50,
        low: 28,
        test: 20,
      },
      {
        no: '111/11/22',
        unit: 'ml',
        isSelected: false,
        high: 50,
        low: 28,
        test: 62,
      },
    ])
    const btns = ref([
      { text: '追蹤', isActive: true, key: 'track' },
      { text: '報告', isActive: false, key: 'report' },
    ])

    const handleClick = (e) => {
      btns.value.forEach((elm) => {
        elm.isActive = elm.text === e.text
      })
    }

    const handleAsideClick = (e) => {
      if (mode.value === 'track')
        _.forEach(opt1.value, (value) => {
          value.isSelected = false
        })
      else if (mode.value === 'report')
        _.forEach(opt2.value, (value) => {
          value.isSelected = false
        })

      e.isSelected = true
    }
    const pageOptions = reactive({
      firstIndex: 0,
      perPageCount: 10,
      totalItemsCount: 0,
      rowsPerPage: [10, 20, 30],
    })

    function handleSearch() {}

    const mode = computed(() => btns.value.find((elm) => elm.isActive).key)

    return {
      sItems,
      sVal,
      btns,
      headers1,
      headers2,
      items,
      items2,
      mode,
      handleClick,
      opt1,
      opt2,
      handleAsideClick,
      pageOptions,

      handleSearch,
    }
  },
}
</script>
<style lang="scss" scoped>
#app {
  &.light,
  &.dark {
    .all {
      // min-height: calc(100vh - 70px);
      .list {
        // @apply grid;
        // grid-template-columns: 300px 1fr;
      }
    }
  }
  &.light {
    .all {
      .top {
        background: #9abbdc;
      }
      .sub {
        @apply border-blue-700 border-t-2;
        .func {
          @apply bg-blue-200;
        }
      }
    }
  }
}
</style>

