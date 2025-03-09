<template>
  <my-elastic-wrapper v-bind="myElasticWrapperProps">
    <div :class="{ 'flex no-wrap': wrapperType !== 'page' }">
      <my-aside v-if="wrapperType === 'page'">
        <opd-aside @search="onSearch" @select="onSelect" :columns="asideColumns" :rows="asideRows" row-key="Id" :loading="asideTableLoading"></opd-aside>
      </my-aside>
      <opd-aside v-else @search="onSearch" @select="onSelect" :columns="asideColumns" :rows="asideRows" row-key="Id" :loading="asideTableLoading"></opd-aside>
      <div class="flex-1">
        <my-input-group class="grid grid-cols-4 gap-2">
          <my-input-wrapper label="病歷號碼">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="病患姓名">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申請科別">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申請醫師">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="檢體編號">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="檢體">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="檢驗師">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="核發者">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="確認時間">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
        </my-input-group>

        <q-separator class="my-4" color="primary"></q-separator>

        <q-table v-bind="QTableProps" title="血液檢驗報告" :columns="reportColumns" :rows="reportRows">
          <template #body-cell-chart="{ col }">
            <q-td :props="{ col }">
              <q-btn icon="show_chart" color="primary" unelevated dense round></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </my-elastic-wrapper>
</template>

<script setup>
import { ref, computed } from 'vue'
import OpdAside from 'pages/opd/components/OpdAside.vue'
import setSearchQuery from 'utils/setSearchQuery'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const props = defineProps({
  wrapperType: String,
  opdId: String,
  patientId: String,
})

const myElasticWrapperProps = computed(() => {
  const wrapperProps = {
    wrapperType: props.wrapperType,
  }
  switch (props.wrapperType) {
    case 'page':
      Object.assign(wrapperProps, { class: 'p-2' })
      break
    case 'dialog':
      Object.assign(wrapperProps, {
        fullWidth: true,
        fullHeight: true,
        myDialogContentProps: {
          header: '影像報告',
        },
      })
      break
    default:
      break
  }
  return wrapperProps
})

const reportColumns = [
  { name: 'chart', label: '圖表', field: 'chart', align: 'center' },
  { name: 'Name', label: '檢驗名稱', field: 'Name', align: 'left' },
  { name: 'NormalRange', label: 'Normal Range', field: 'NormalRange', align: 'left' },
  { name: 'Result', label: '結果值', field: 'Result', align: 'left' },
  { name: 'Unit', label: '單位', field: 'Unit', align: 'left' },
]

const reportRows = ref([{}])

const onSearch = (searchObject) => {
  const query = setSearchQuery(searchObject)
}

const onSelect = () => {}
const asideColumns = []
const asideRows = []
const asideTableLoading = ref(false)
</script>

