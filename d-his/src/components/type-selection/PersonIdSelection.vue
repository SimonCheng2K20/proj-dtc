<template>
  <my-input-wrapper :label="labelName" :required-mark="requiredMark">
    <q-select
      ref="selectionRef"
      v-bind="QSelectProps"
      :model-value="selectedData"
      :options="filterHandler"
      option-label="PersonId"
      :rules="rulesMessage ? [(val, rules) => val || rulesMessage] : null"
      :use-input="useInput"
      @input-value="filterLoading = true"
      @filter="selectionFilterHandler"
      @update:model-value="(val) => onSelect(val)"
      :input-style="`width:${width}`"
    >
      <template #no-option="{ inputValue }">
        <q-item v-if="!!inputValue" clickable @click="toWriteFirstVisitSheet('PersonId', inputValue)">
          <q-item-section class="text-grey">
            <q-spinner v-if="filterLoading" color="primary"></q-spinner>
            <q-item-label v-else>
              <div>找不到符合的資料</div>
              <div class="text-primary">前往填寫初診病歷</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>
              <div v-html="scope.opt.filterLabel"></div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </my-input-wrapper>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getPatient } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const q = useQuasar()
const props = defineProps({
  labelName: String,
  refName: String,
  selectedData: Object || String,
  rulesMessage: String,
  requiredMark: Boolean,
  useInput: Boolean,
  width: String,
})
const emit = defineEmits(['update:selectedData'])

const selectionRef = ref(null)
const validate = () => {
  selectionRef.value.validate()
}
defineExpose({ validate })

const options = ref([])
const GetPatient = async (searchString, searchBy) => {
  try {
    const query = setSearchQuery({
      $filter: `contains(${searchBy === 'Name' ? 'Person/Name' : searchBy},'${searchString}')`,
    })
    const res = await getPatient(query)
    if (res.status === 200) {
      options.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const filterLoading = ref(false)
const { filterItems: filterHandler, filterHandler: optionsFilterHandler } = useFilter(
  { items: options, filterKeys: ['PersonId'] },
  () => {
    filterLoading.value = false
  }
)

const selectionFilterHandler = async (val, update) => {
  filterLoading.value = true
  if (val !== '') {
    await GetPatient(val, 'PersonId')
  }
  optionsFilterHandler(val, update)
}

const toWriteFirstVisitSheet = (key, inputValue) => {
  const routeOptions = { name: 'PatientManage' }
  if (key && inputValue) {
    Object.assign(routeOptions, { query: { [key]: inputValue } })
  }
  router.push(routeOptions)
}

const onSelect = (val) => {
  emit('update:selectedData', val)
}

const init = () => {}
init()
</script>

<style lang="scss" scoped></style>

