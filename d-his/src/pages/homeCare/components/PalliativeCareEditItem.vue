<template>
  <q-dialog ref="dialogRef" full-width full-height>
    <my-dialog-content header="建立安寧居家療護收案申請書" width="1280px" @close="onDialogCancel()">
      <my-input-wrapper label="申請類別">
        <q-select v-bind="QSelectProps" v-model="data.申請類別"> </q-select>
      </my-input-wrapper>

      <q-option-group v-model="data.Type" type="checkbox" :options="typeOptions" inline> </q-option-group>

      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="病歷號">
          <q-input v-bind="QInputProps" v-model="data.病歷號"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="受理日期">
          <q-input v-bind="QInputProps" v-model="data.受理日期"></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="姓名" class="col-start-1">
          <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="性別">
          <q-input v-bind="QInputProps" v-model="data.性別"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="出生日期">
          <my-date-input v-bind="QInputProps" v-model="data.出生日期"></my-date-input>
        </my-input-wrapper>

        <my-input-wrapper label="身分證字號" class="col-start-1">
          <q-input v-bind="QInputProps" v-model="data.身分證字號"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="電話">
          <q-input v-bind="QInputProps" v-model="data.電話"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="原受理編號">
          <q-input v-bind="QInputProps" v-model="data.原受理編號"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="受理編號">
          <q-input v-bind="QInputProps" v-model="data.受理編號"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated dense color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated dense color="indigo-14" label="暫存"></q-btn>
        <q-btn unelevated dense color="add" label="提交申請書並列印"></q-btn>
        <q-btn unelevated dense color="edit" label="提交申請書"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar, useDialogPluginComponent } from 'quasar'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const data = {
  Type: [],
}

const typeOptions = [
  { label: '新收案', value: '新收案' },
  { label: '新收案申復', value: '新收案申復' },
  { label: '延長護照', value: '延長護照' },
  { label: '延長護照申復', value: '延長護照申復' },
]
</script>

