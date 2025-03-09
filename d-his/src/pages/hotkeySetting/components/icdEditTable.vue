<template>
  <div class="mt-2 bg-white border border-[#0d118e] rounded-[4px]">
    <q-table :rows="editItem.DepPresetDiagnosisItems" :columns="columns" row-key="Icd10Code" :pagination="pagination" hide-pagination separator="none" flat>
      <template #top v-if="editType !== 'delete' && editType !== 'view'">
        <div class="w-full text-end">
          <q-btn label="新增欄位" color="indigo-5" @click="editItem.DepPresetDiagnosisItems.push(cloneDeep(initData.icdItems))" unelevated></q-btn>
        </div>
      </template>
      <template #body-cell-Seq="{ col, row, rowIndex }">
        <q-td :props="{ col }">
          {{ row.Seq === 1 || rowIndex === 0 ? '主診斷' : '次診斷' }}
        </q-td>
      </template>
      <template #body-cell-Icd10="{ col, row, rowIndex }">
        <q-td :props="{ col }">
          <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
          <q-select
            :ref="(el) => (inputRefs[`Icd10-${rowIndex}`] = el)"
            :rules="rules.Icd10"
            v-model="row.Icd10Code"
            :options="icdItems"
            option-label="Icd10"
            clearable
            outlined
            dense
            use-input
            lazy-rules
            @input-value="filterLoading = true"
            @filter="icdFilterHandler"
            @clear="Object.assign(row, initData.icdItems)"
            @update:model-value="(val) => (!!val ? onIcdSelect(val, row) : Object.assign(row, initData.icdItems))"
            :disable="editType === 'delete'"
            :readonly="editType === 'delete'"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps" :disable="editItem.DepPresetDiagnosisItems.find((item) => item.Icd10Code === scope.opt.Icd10) !== undefined">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel || `${scope.opt.Name}`"></div>
                  </q-item-label>
                  <q-item-label v-if="editItem.DepPresetDiagnosisItems.find((item) => item.Icd10Code === scope.opt.Icd10) !== undefined" class="text-negative">
                    此 ICD-10 已存在
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-td>
      </template>

      <template #body-cell-action="{ col, rowIndex }">
        <q-td :props="{ col }">
          <q-btn color="delete" @click="editItem.DepPresetDiagnosisItems.splice(rowIndex, 1)" label="刪除" unelevated dense></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, watch, inject, computed } from 'vue'
import { cloneDeep, replace } from 'lodash-es'
import { getIcd9ToIcd10 } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useDialogPluginComponent, useQuasar } from 'quasar'

const editItem = inject('editItem')
const editType = inject('editType')
const emit = defineEmits(['dialogOK'])

const initData = {}
initData.icdItems = {
  Icd10Code: null,
  Icd10Cht: null,
  Icd10Eng: null,
  Icd9Code: null,
  Icd9Cht: null,
  Icd9Eng: null,
}

const test = () => {
  console.log(editType)
}

const columns = computed(() => {
  const arr = [
    { name: 'Seq', field: 'Seq', align: 'left' },
    { name: 'Icd10', label: 'ICD-10', field: 'Icd10Code', align: 'left' },
    { name: 'Icd9', label: 'ICD-9', field: 'Icd9Code', align: 'left' },
    { name: 'Cht', label: '中文名稱', field: 'Icd10Cht', align: 'left' },
    { name: 'Eng', label: '英文名稱', field: 'Icd10Eng', align: 'left' },
  ]
  if (editType !== 'delete')
    arr.push({
      name: 'action',
      label: '操作',
      field: 'action',
      align: 'center',
    })

  return arr
})

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

const icdItems = ref([])
const GetIcd9ToIcd10 = async (val) => {
  try {
    const query = setSearchQuery({
      $top: 10,
      $filter: `contains(Icd10,'${val}')`,
    })
    const res = await getIcd9ToIcd10(query)
    if (res.status === 200) {
      icdItems.value = res.data.Items.map((item) => {
        const regex = new RegExp(val, 'gi')

        const filterStrings = ['Icd10', 'Icd10Eng', 'Icd10Cht'].map((__key) =>
          replace(item[__key], regex, (match) => {
            return '<span class="bg-amber-300">' + match + '</span>'
          })
        )

        return { ...item, filterLabel: filterStrings.join(' - ') }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const filterLoading = ref(false)
const icdFilterHandler = (val, update) => {
  if (val === '') {
    update(() => {
      icdItems.value = []
      filterLoading.value = false
    })
    return
  }
  update(async () => {
    await GetIcd9ToIcd10(val)
    filterLoading.value = false
  })
}

const onIcdSelect = (opt, row) => {
  row.Icd10Code = opt.Icd10
  row.Icd10Cht = opt.Icd10Cht
  row.Icd10Eng = opt.Icd10Eng
  row.Icd9Code = opt.Icd9
  row.Icd9Cht = opt.Icd9Cht
  row.Icd9Eng = opt.Icd9Eng
}

const inputRefs = reactive({})
const rules = {
  Icd10: [(val) => !!val || '請輸入 ICD-10'],
}

defineExpose({ inputRefs })
</script>

