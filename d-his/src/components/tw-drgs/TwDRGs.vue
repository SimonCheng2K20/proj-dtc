<template>
  <div
    ref="tableRef"
    class="border border-[#215cba66] p-2"
    :class="{ 'bg-[#ffe082]': focusOptions.isFocus }"
    @click.capture="focusOptions.onFocus"
  >
    <div class="flex gap-2">
      <q-space></q-space>
      <q-btn unelevated dense color="primary" label="診斷處置組套" @click="toPreset"></q-btn>
      <q-btn unelevated dense color="primary" label="設為組套" @click="toPresetAdd"></q-btn>
    </div>

    <div class="grid grid-cols-2 gap-2 mt-2">
      <IcdTable
        ref="icdTableRef"
        :title="'手術診斷'"
        :rows="twDRGsIcdTable"
        :columns="icdColumns"
        :procedureId="procedureId"
        :loading="loading"
        :use-hotkey="false"
        :DclDepartmentNo="DclDepartmentNo"
        @update:rows="updateIcdTable"
      ></IcdTable>
      <PCSTable
        ref="pcsTableRef"
        :procedureId="procedureId"
        :rows="twDRGsPcsTable"
        :columns="pcsColumns"
        :loading="loading"
        @update:rows="updatePcsTable"
      ></PCSTable>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { usePresetStore } from 'stores/preset.js'

import PCSTable from 'components/tw-drgs/PCSTable.vue'
import IcdTable from 'components/opd/IcdTable.vue'
import EditTwDRGsPreset from 'components/tw-drgs/EditTwDRGsPreset.vue'
import TwDRGsPresets from 'components/tw-drgs/TwDRGsPresets.vue'

const $q = useQuasar()
const route = useRoute()
const presetStore = usePresetStore()

const props = defineProps({
  procedureId: Number,
  loading: Boolean,
  useHotkey: {
    type: Boolean,
    default: true,
  },
  icdColumns: Array,
  pcsColumns: Array,
  presetHotkeyItems: Array,
  twDRGsIcdTable: Array,
  twDRGsPcsTable: Array,
  DclDepartmentNo: String,
})
const emit = defineEmits(['freshCheck', 'update:twDRGsIcdTable', 'update:twDRGsPcsTable'])

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.twdrg)

const icdTableRef = ref()
const pcsTableRef = ref()

const validate = () => {
  return [icdTableRef.value.validate(), pcsTableRef.value.validate()]
}
defineExpose({ validate })

// 預編輯物件資料

watch(props, (nV, oV) => {
  emit('freshCheck')
})

const toPreset = () => {
  const dialog = $q.dialog({
    component: TwDRGsPresets,
    componentProps: {
      onPaste(row) {
        dialog.hide()
        emit('update:twDRGsIcdTable', row.DiagnosisItems)
        emit('update:twDRGsPcsTable', row.Icd10PcsItems)
      },
    },
  })
}

const toPresetAdd = () => {
  const dialog = $q.dialog({
    component: EditTwDRGsPreset,
    componentProps: {
      editType: 'add',
      icdTableData: props.twDRGsIcdTable,
      pcsTableData: props.twDRGsPcsTable,
    },
  })
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})
const tableRef = ref()
const presetKeydownCallback = (item) => {
  emit('update:twDRGsIcdTable', item.DiagnosisItems)
  emit('update:twDRGsPcsTable', item.Icd10PcsItems)
}

const updateIcdTable = (rows) => {
  emit('update:twDRGsIcdTable', rows)
}
const updatePcsTable = (rows) => {
  emit('update:twDRGsPcsTable', rows)
}

const init = async () => {
  if (!props.presetHotkeyItems) presetStore.getPreset('twdrg')
  const { isFocus, onFocus } = usePresetKeydown({
    presetItems: presetHotkeyItems,
    target: tableRef,
    callback: presetKeydownCallback,
  })

  Object.assign(focusOptions, { isFocus, onFocus })
}
init()
</script>

