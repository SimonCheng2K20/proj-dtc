<template>
  <q-select
    ref="nurseSelectionRef"
    v-bind="QSelectProps"
    :model-value="selectedNurseData"
    :options="nurseFilterItems"
    option-label="Name"
    :rules="rulesMessage ? [(val, rules) => val || rulesMessage] : null"
    :use-input="useInput"
    @input-value="nurseFilterLoading = true"
    @filter="nurseFilterHandler"
    @update:model-value="(val) => onSelect(val)"
    :input-style="`width:${width}`"
    :readonly="readonly"
    v-if="noLabel"
  >
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
  <my-input-wrapper :label="labelName" :required-mark="requiredMark" v-else>
    <q-select
      ref="nurseSelectionRef"
      v-bind="QSelectProps"
      :model-value="selectedNurseData"
      :options="nurseFilterItems"
      option-label="Name"
      :rules="rulesMessage ? [(val, rules) => val || rulesMessage] : null"
      :use-input="useInput"
      @input-value="nurseFilterLoading = true"
      @filter="nurseFilterHandler"
      @update:model-value="(val) => onSelect(val)"
      :input-style="`width:${width}`"
      :readonly="readonly"
    >
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
import { getIpdEmployeeList } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const q = useQuasar()
const props = defineProps({
  labelName: String,
  refName: String,
  selectedNurseData: Object,
  rulesMessage: String,
  requiredMark: Boolean,
  useInput: Boolean,
  width: String,
  options: Array,
  noLabel: Boolean,
  readonly: Boolean,
})
const emit = defineEmits(['update:selectedNurseData'])

const nurseSelectionRef = ref(null)
const validate = () => {
  nurseSelectionRef.value.validate()
}
defineExpose({ validate })

const nurseOptions = ref([])
//可選護士
const GetIpdEmployeeList = async () => {
  try {
    const res = await getIpdEmployeeList('?role=2')
    if (res.status === 200 || res.status === 204) {
      nurseOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}
const nurseFilterLoading = ref(false)
const { filterItems: nurseFilterItems, filterHandler: nurseOptionsFilterHandler } = useFilter(
  { items: nurseOptions, filterKeys: ['Name'] },
  () => {
    nurseFilterLoading.value = false
  }
)

const nurseFilterHandler = async (val, update) => {
  nurseFilterLoading.value = true
  nurseOptionsFilterHandler(val, update)
}

const onSelect = (val) => {
  emit('update:selectedNurseData', val)
}

const init = () => {
  if (!props.options) {
    GetIpdEmployeeList()
  } else {
    nurseOptions.value = props.options
  }
}
init()
</script>

<style lang="scss" scoped></style>

