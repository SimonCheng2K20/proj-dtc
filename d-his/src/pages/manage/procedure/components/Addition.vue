<template>
  <div class="grid grid-cols-3 gap-2">
    <my-input-wrapper v-for="(item, index) in dataList" :key="index" :label="item.label" labelWidth="150">
      <q-input v-bind="QInputProps" v-model="editItem[item.key]" type="number" :readonly="readonly">
        <template #append>{{ item.unit }}</template>
      </q-input>
    </my-input-wrapper>
    <!-- <my-input-wrapper v-for="(key, index) in dataList" :key="index" :label="item.label" labelWidth="150">
      <q-input v-bind="QInputProps" v-model="editItem[key]" type="number" :readonly="readonly">
        <template #append>%</template>
      </q-input>
    </my-input-wrapper> -->
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { addition } from 'assets/procedure/addition.js'
import { QInputProps } from 'utils/quasar-extends/base-props'

const props = defineProps({
  data: Object,
  readonly: Boolean,
  showAll: Boolean,
  nhiSect: String,
  hospitalLevel: String,
})

const editItem = toRef(props, 'data')

const dataList = computed(() => {
  // console.log(editItem.value)
  // const entries = Object.entries(editItem.value)
  // if (props.showAll) return entries.map(([key]) => key)
  // else return entries.filter(([key, value]) => value).map(([key]) => key)

  return addition?.[props.nhiSect]?.[props.hospitalLevel] || []
})
</script>

