<template>
  <my-elastic-wrapper v-bind="myElasticWrapperProps">
    <div :class="{ 'flex no-wrap': wrapperType !== 'page' }">
      <my-aside v-if="wrapperType === 'page'">
        <opd-aside
          @search="onSearch"
          @select="onSelect"
          :columns="asideColumns"
          :rows="asideRows"
          row-key="Id"
          :loading="asideTableLoading"
        ></opd-aside>
      </my-aside>

      <opd-aside
        v-else
        @search="onSearch"
        @select="onSelect"
        :columns="asideColumns"
        :rows="asideRows"
        row-key="Id"
        :loading="asideTableLoading"
      ></opd-aside>

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
          <my-input-wrapper label="檢查項目">
            <q-input v-bind="QInputProps" :model-value="selectedItem?.Modality" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="部位">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="技師">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="報告醫師">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="確認時間">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
        </my-input-group>

        <q-separator class="my-4" color="primary"></q-separator>

        <q-table v-bind="QTableProps" title="影像報告" :columns="reportColumns" :rows="reportRows">
          <template #body-cell-pacs="{ col }">
            <q-td :props="{ col }">
              <q-btn icon="image" color="primary" unelevated dense round @click="toDC600"> </q-btn>
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
import { getOpdPacsOrder, getOpdPacsOrderItem } from 'api'

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
  { name: 'pacs', label: '影像', field: 'pacs', align: 'center' },
  { name: 'Content', label: '報告內容', field: 'Content', align: 'left' },
]

const reportRows = computed(() => (selectedItem.value ? [{}] : []))

const onSearch = (searchObject) => {
  GetOpdPacsOrder()
}

const asideColumns = [
  { name: 'OrderDate', label: '日期', field: 'OrderDate', align: 'center' },
  { name: 'StudyDescription', label: '報告名稱', field: 'StudyDescription', align: 'center' },
]

const asideTableLoading = ref(false)
const asideRows = ref([])
const GetOpdPacsOrder = async () => {
  try {
    asideTableLoading.value = true
    const query = setSearchQuery({
      $filter: props.opdId ? `OpdId eq '${props.opdId}'` : null,
    })
    const res = await getOpdPacsOrder(query)
    asideRows.value = res.data.Items
  } catch (error) {
    console.log(error)
  } finally {
    asideTableLoading.value = false
  }
}

const selectedItem = ref(null)
const onSelect = (row) => {
  selectedItem.value = row
  // GetOpdPacsOrderItem(row.Id)
}

const GetOpdPacsOrderItem = async (id) => {
  try {
    const res = await getOpdPacsOrderItem(id)
  } catch (error) {
    console.log(error)
  }
}

const toDC600 = () => {
  const path = `pacs://PatientID=${props.patientId},AccessionNo=${selectedItem.value.AccessionNo},StudyDate=${selectedItem.value.OrderDate},AccountID=A001,Password=`
  window.open(path)
}
</script>

