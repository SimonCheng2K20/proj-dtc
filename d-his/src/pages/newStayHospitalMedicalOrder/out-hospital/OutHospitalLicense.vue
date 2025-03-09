<template>
  <q-page class="p-2">
    <div class="w-[400px] m-auto">
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="出院日期">
          <my-date-input v-bind="QInputProps"></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="出院轉歸代碼">
          <q-input v-bind="QInputProps"></q-input>
        </my-input-wrapper>
      </my-input-group>
    </div>
  </q-page>
</template>

<script setup>
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
</script>

