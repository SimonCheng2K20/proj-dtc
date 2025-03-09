<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="預約檢驗排程" width="1280px" @close="onDialogCancel">
      <div v-if="row">
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="儀器類別">
            <q-select
              v-bind="QSelectProps"
              use-input
              option-label="Name"
              option-value="No"
              map-options
              emit-value
              :options="modalityFilterItems"
              v-model="editItem.Modality"
              @filter="onModalityFilter"
              @input-value="filterLoading = true"
            >
              <template #no-option="{ inputValue }">
                <q-item v-if="!!inputValue">
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
          </my-input-wrapper>
          <my-input-wrapper label="預約檢查項目">
            <q-input v-bind="QInputProps" v-model="editItem.ProcedureCode"> </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="檢查描述">
            <q-input v-bind="QInputProps" v-model="editItem.ProcedureName"> </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="開始時間">
            <my-date-input v-bind="QInputProps" v-model="editItem.BookingStartTime"> </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="結束時間">
            <my-date-input v-bind="QInputProps" v-model="editItem.BookingEndTime"> </my-date-input>
          </my-input-wrapper>
        </my-input-group>
      </div>
      <div class="text-xl text-bold" v-else>請先選取欲安排檢查治療項目， 在進行檢驗預約。</div>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="pink" label="確認預約" :loading="editLoading" @click="onSaveClick" v-if="row"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { getModality } from 'api'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  row: Object,
})
const editItem = reactive(cloneDeep(props.row))
const editLoading = ref(false)

// 儀器類別

const filterLoading = ref(false)
const modalityItems = ref([])
const modalityFilterKeys = ['Code', 'Name']
const GetModality = async () => {
  try {
    const res = await getModality()
    modalityItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: modalityFilterItems, filterHandler: onModalityFilter } = useFilter(
  { items: modalityItems, filterKeys: modalityFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const onSaveClick = () => {
  onDialogOK(editItem)
}

const init = () => {
  GetModality()
}
init()
</script>

