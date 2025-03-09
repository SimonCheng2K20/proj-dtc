<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="禁止設置之快捷鍵組合" width="1280px" @close="onDialogCancel">
      <div class="flex justify-center gap-2">
        <div v-for="(items, keyType) in blockHotkeyGroupBy" :key="keyType" class="p-2" :class="setColor(keyType)">
          <div class="font-bold text-xl">{{ keyType }}</div>
          <q-separator class="my-2"></q-separator>
          <div class="grid gap-2" :class="setGridCol(keyType)">
            <KeysItems v-for="(keys, index) in items" :key="index" :keys="keys"></KeysItems>
          </div>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { blockHotkeyItems } from 'utils/options'
import { groupBy } from 'lodash-es'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import KeysItems from './KeysItems.vue'

const $q = useQuasar()
const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const blockHotkeyGroupBy = computed(() => groupBy(blockHotkeyItems, (item) => item[0]))

const setColor = (keyType) => {
  switch (keyType) {
    case 'Control':
      return 'bg-blue-1'
    case 'Shift':
      return 'bg-amber-1'
    case 'Alt':
      return 'bg-green-1'
  }
}

const setGridCol = (keyType) => {
  switch (keyType) {
    case 'Control':
      return 'grid-cols-2'
    case 'Shift':
      return 'grid-cols-3'
    case 'Alt':
      return 'grid-cols-1'
  }
}
</script>

