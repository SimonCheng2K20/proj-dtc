<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="醫令申報註記" width="600px" @close="dialogRef.hide()">
      <div class="flex flex-nowrap border border-solid border-[#215dbb]">
        <p
          class="flex items-center p-2 bg-[#deecff] font-bold border-r border-solid border-[#215dbb]"
          style="white-space: nowrap"
        >
          申報註記
        </p>
        <p class="p-2">{{ reMark }}</p>
      </div>

      <template #actions>
        <q-btn color="light-green-7" label="知道了" dense unelevated @click="dialogRef.hide()"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

// utils
import { QInputProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const dialogRef = ref()

const props = defineProps({
  reMark: String,
})
</script>
