<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此{{ typeText }}排班資料？</div>

      <my-input-group class="grid gap-2 pb-1">
        <my-input-wrapper label="排班日期">
          <q-input v-bind="QInputProps" :model-value="data.AsignDate.substring(0, 10)" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="排班時段">
          <q-input v-bind="QInputProps" :model-value="data.TimeSlotName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper :label="`${typeText}身分證號`">
          <q-input v-bind="QInputProps" :model-value="data.PersonId" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper :label="`${typeText}姓名`">
          <q-input v-bind="QInputProps" :model-value="data.PersonName || data.Name" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="護理站名稱">
          <q-input v-bind="QInputProps" :model-value="data.StationName" readonly></q-input>
        </my-input-wrapper>
        <!-- <my-input-wrapper label="樓層">
          <q-select v-bind="QSelectProps"></q-select>
        </my-input-wrapper> -->
        <my-input-wrapper label="病房號" required-mark v-if="isNurse === '2'">
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.Beds = el)"
            :rules="rules.Beds"
            v-model="editItem.Beds"
            :options="bedItems"
            option-label="Bed"
            option-value="Id"
            emit-value
            map-options
            use-chips
            multiple
            :readonly="editType === 'delete'"
            :filter="bedItemsLoading"
          >
            <!-- <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section @click="optSelect(scope.opt)">
                  <q-item-label>
                    <div v-html="scope.opt.Bed"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template> -->
          </q-select>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="secondary" label="確定" @click="onSaveClick"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getHospitalBed } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  data: Object,
  isNurse: String,
  bedsInCharge: Array,
})

const typeText = computed(() => (props.data.Type === '1' ? '醫師' : '護理師'))

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增${typeText.value}排班資料`
    case 'edit':
      return `編輯${typeText.value}排班資料`
    case 'delete':
      return `刪除${typeText.value}排班資料`
    default:
      return null
  }
})

const editItem = reactive({
  Beds: props.data?.Beds || [],
})

const inputRefs = reactive({})
const rules = {
  Beds: [(val) => (val !== null && Array.isArray(val) && val.length > 0) || '請選擇病床號'],
}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  onDialogOK({ ...props.data, Beds: editItem.Beds })
}
const bedItemsLoading = ref(false)
const bedItems = ref([])
const GetHospitalBed = async () => {
  bedItemsLoading.value = true
  try {
    const query = setSearchQuery({
      $filter: setOdataFilter({ key: 'NursingStation', value: props.data.StationId, operator: 'eq' }),
    })
    const res = await getHospitalBed(query)
    bedItems.value = cloneDeep(res.data.Items).filter((d) => {
      return !props.bedsInCharge.includes(d.Id)
    })
  } catch (err) {
    console.log(err)
  } finally {
    bedItemsLoading.value = false
  }
}

const optSelect = (opt) => {
  setTimeout(() => {
    if (opt.Id === 'all') {
      editItem.Beds = bedItems.value
        .filter((d) => d.Id !== 'all')
        .map((d) => {
          return d.Id
        })
    }
  }, 0)
}

const init = () => {
  GetHospitalBed()
}
init()
</script>

<style lang="scss"></style>

