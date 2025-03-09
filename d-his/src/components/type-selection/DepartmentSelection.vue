<template>
  <q-select
    v-bind="QSelectProps"
    :model-value="modelValue"
    :options="filterHandler"
    option-label="Name"
    option-value="No"
    use-input
    emit-value
    map-options
    @input-value="filterLoading = true"
    @filter="optionsFilterHandler"
    @update:model-value="onSelect"
  >
    <template #no-option="{ inputValue }">
      <q-item v-if="inputValue">
        <q-item-section class="text-grey">
          <q-spinner v-if="filterLoading" color="primary"></q-spinner>
          <span v-else>找不到符合的資料</span>
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
</template>

<script setup>
import { ref } from 'vue'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getDepartmentDropdown } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:model-value'])

const options = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({
      layer: 2,
    })
    const res = await getDepartmentDropdown(query)
    if (res.data) options.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const filterLoading = ref(false)
const { filterItems: filterHandler, filterHandler: optionsFilterHandler } = useFilter(
  { items: options, filterKeys: ['No', 'Name'] },
  () => {
    filterLoading.value = false
  }
)

const onSelect = (val) => {
  emit('update:model-value', val)
}

const init = () => {
  GetDepartmentDropdown()
}
init()
</script>

