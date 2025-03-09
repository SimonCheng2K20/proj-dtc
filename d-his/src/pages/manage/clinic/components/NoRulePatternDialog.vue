<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="套用給號 PATTERN" width="960px" @close="onDialogCancel" :loading="getDataLoading">
      <my-input-wrapper label="給號原則">
        <q-select
          v-bind="QSelectProps"
          v-model="pattern"
          :options="noRulePatternItems"
          optionLabel="No"
          optionValue="Name"
          @update:model-value="onPatternUpdate"
        >
        </q-select>
      </my-input-wrapper>

      <NoRulePatternGrid class="mt-2" :noRulePattern="rulePattern" readonly></NoRulePatternGrid>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="primary" label="確定" @click="onDialogOK(rulePattern)"> </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { getNoRulePatternDropdown } from 'api'
import { range } from 'lodash-es'
import { ref } from 'vue'
import NoRulePatternGrid from './NoRulePatternGrid.vue'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const noRulePatternItems = ref([])
const GetNoRulePatternDropdown = async () => {
  await getNoRulePatternDropdown().then(({ data }) => {
    if (data) noRulePatternItems.value = data
  })
}

const pattern = ref()
const onPatternUpdate = (val) => {
  if (val) {
    rulePattern.value = val.Name.split('')
  } else {
    rulePattern.value = range(1, 201)
  }
}

const rulePattern = ref(range(1, 201))

const init = () => {
  GetNoRulePatternDropdown()
}
init()
</script>

