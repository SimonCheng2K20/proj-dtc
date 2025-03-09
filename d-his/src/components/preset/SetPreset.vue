<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss @hide="onHide">
    <my-dialog-content header="設置快捷鍵" width="600px" @close="onDialogCancel">
      <div class="text-end">
        <q-btn color="primary" label="禁用快捷鍵列表" @click="toPresetBlockTable" unelevated></q-btn>
      </div>
      <div class="mt-2">
        <div class="flex items-center">
          已設置的快捷鍵為：
          <KeysItems :keys="shortcutArr"></KeysItems>
        </div>
        <div class="flex items-center">
          您目前設置的快捷鍵為：
          <KeysItems :keys="currentShortcut"></KeysItems>
          <div v-show="isShortcutAlreadyUsed" class="text-negative">，此熱鍵已存在</div>
          <div v-show="isShortcutBlock" class="text-negative">，此熱鍵無法被設置</div>
        </div>
      </div>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn unelevated color="primary" label="確定" @click="onSaveClick" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import PresetBlockTable from './PresetBlockTable.vue'
import KeysItems from './KeysItems.vue'
import { usePresetStore } from 'stores/preset.js'
import { blockHotkeyItems } from 'utils/options'

const presetStore = usePresetStore()
const $q = useQuasar()
const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
const props = defineProps({
  shortcut: String,
  presetKey: String,
})

const shortcutArr = computed(() => (props.shortcut ? props.shortcut.split(',') : []))

const toPresetBlockTable = () => {
  const dialog = $q.dialog({
    component: PresetBlockTable,
  })
}

const isKeyingStop = ref(false)
const currentShortcut = ref([])
const keyUpHandler = ref(null)
const setShortcutHandler = (evt) => {
  evt.preventDefault()

  if (isKeyingStop.value) {
    currentShortcut.value = []
    isKeyingStop.value = false
  }

  const addKeyupEvent = () => {
    keyUpHandler.value = window.addEventListener(
      'keyup',
      () => {
        keyUpHandler.value = null
        if (evt.key === 'Shift') {
          // Shift + 任意鍵組合會自動觸發 keyup
          addKeyupEvent()
        } else {
          isKeyingStop.value = true
        }
      },
      { once: true }
    )
  }
  if (!keyUpHandler.value) addKeyupEvent()

  if (currentShortcut.value.map((item) => item.toLocaleUpperCase()).includes(evt.key.toLocaleUpperCase())) return
  else currentShortcut.value.push(evt.key)
}

const isShortcutAlreadyUsed = computed(() => {
  return !!presetStore.presetItems[props.presetKey].find((item) =>
    item.Shortcut ? item.Shortcut.toLocaleUpperCase() === currentShortcut.value.join(',').toLocaleUpperCase() : false
  )
})

const isShortcutBlock = computed(() => {
  for (let i = 0; i < blockHotkeyItems.length; i++) {
    const items = blockHotkeyItems[i]
    const validArr = []

    for (let j = 0; j < items.length; j++) {
      if (currentShortcut.value.map((item) => item.toLocaleUpperCase()).includes(items[j].toLocaleUpperCase())) {
        validArr.push(false)
      } else {
        validArr.push(true)
      }
    }

    if (!validArr.includes(true)) {
      return true
    }
  }

  return false
})

const check = () => {
  if (isShortcutAlreadyUsed.value) {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: '此熱鍵已存在',
    })
    return false
  }

  if (isShortcutBlock.value) {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: '此熱鍵無法被設置',
    })
    return false
  }
}

const onSaveClick = () => {
  if (check() === false) return
  onDialogOK(currentShortcut.value.join(','))
}

const onHide = () => {
  window.removeEventListener('keydown', setShortcutHandler)
}

const init = () => {
  window.addEventListener('keydown', setShortcutHandler)
}
init()
</script>

