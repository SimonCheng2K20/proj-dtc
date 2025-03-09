<template>
  <my-input-wrapper :label="labelName" :required-mark="requiredMark">
    <q-select
      ref="selectionRef"
      v-bind="QSelectProps"
      :model-value="selectedData"
      :options="filterHandler"
      option-label="Name"
      :rules="rulesMessage ? [(val, rules) => val || rulesMessage] : null"
      :use-input="useInput"
      @input-value="filterLoading = true"
      @filter="selectionFilterHandler"
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
import { getTimeSlot } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const q = useQuasar()
const props = defineProps({
  labelName: String,
  refName: String,
  selectedData: Object,
  rulesMessage: String,
  requiredMark: Boolean,
  useInput: Boolean,
  width: String,
  readonly: Boolean,
})
const emit = defineEmits(['update:selectedData'])

const selectionRef = ref(null)
const validate = () => {
  selectionRef.value.validate()
}
defineExpose({ validate })

const options = ref([])
//可選病床
const GetTimeSlot = async () => {
  try {
    const query = ``
    const res = await getTimeSlot(query)

    if (res.status === 200 || res.status === 204) {
      options.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}
const filterLoading = ref(false)
const { filterItems: filterHandler, filterHandler: optionsFilterHandler } = useFilter(
  { items: options, filterKeys: ['Name'] },
  () => {
    filterLoading.value = false
  }
)

const selectionFilterHandler = async (val, update) => {
  filterLoading.value = true
  optionsFilterHandler(val, update)
}

const onSelect = (val) => {
  emit('update:selectedData', val)
}

const init = () => {
  GetTimeSlot()
}
init()
</script>

<style lang="scss" scoped></style>

