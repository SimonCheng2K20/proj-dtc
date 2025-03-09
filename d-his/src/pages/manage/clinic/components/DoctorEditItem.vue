<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此門診醫生管理？</div>
      <div class="grid grid-cols-6 gap-2">
        <div class="col-span-2">
          <my-input-group class="grid gap-2">
            <my-input-wrapper label="部門" required-mark>
              <my-filter-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.ParentDepartmentNo = el)"
                :rules="rules.ParentDepartmentNo"
                v-model="editItem.ParentDepartmentNo"
                :listKey="departmentLayer1ListKey"
                :readonly="editType === 'delete'"
              ></my-filter-select>
            </my-input-wrapper>
            <my-input-wrapper label="科別" required-mark>
              <my-filter-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.DepartmentNo = el)"
                :rules="rules.DepartmentNo"
                v-model="editItem.DepartmentNo"
                :listKey="departmentLayer2ListKey"
                :readonly="editType === 'delete'"
              ></my-filter-select>
            </my-input-wrapper>
            <my-input-wrapper label="醫生" required-mark>
              <my-filter-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.PersonId = el)"
                :rules="rules.PersonId"
                v-model="editItem.PersonId"
                :listKey="doctorListKey"
                :readonly="editType === 'delete'"
              ></my-filter-select>
            </my-input-wrapper>
            <my-input-wrapper label="初診上限" required-mark>
              <q-input
                v-bind="QInputProps"
                :ref="(el) => (inputRefs.FirstLimit = el)"
                :rules="rules.FirstLimit"
                v-model="editItem.FirstLimit"
                type="number"
                :readonly="editType === 'delete'"
              >
              </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="人數上限" required-mark>
              <q-input
                v-bind="QInputProps"
                :ref="(el) => (inputRefs.Limit = el)"
                :rules="rules.Limit"
                v-model="editItem.Limit"
                type="number"
                :readonly="editType === 'delete'"
              >
              </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="啟用狀態" required-mark>
              <q-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.IsActive = el)"
                :rules="rules.IsActive"
                v-model="editItem.IsActive"
                :options="activeStatusItems"
                option-label="label"
                option-value="value"
                map-options
                emit-value
                :readonly="editType === 'delete'"
              >
              </q-select>
            </my-input-wrapper>
            <my-input-wrapper label="排班顏色">
              <q-input
                v-bind="QInputProps"
                v-model="editItem.PreferColor"
                type="color"
                :readonly="editType === 'delete'"
              >
              </q-input>
            </my-input-wrapper>
          </my-input-group>
        </div>
        <NoRulePatternGrid v-model:noRulePattern="editItem.GiveNoRule" class="col-span-4"></NoRulePatternGrid>
      </div>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        >
        </q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onDeleteClick"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getDoctorItem, postDoctorItem, putDoctorItem, deleteDoctorItem } from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import NoRulePatternGrid from './NoRulePatternGrid.vue'
import { range } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增門診醫生管理`
    case 'edit':
      return `編輯門診醫生管理`
    case 'delete':
      return `刪除門診醫生管理`
    default:
      return null
  }
})

const editItem = reactive({
  ParentDepartmentNo: null,
  DepartmentNo: null,
  PersonId: null,
  FirstLimit: null,
  Limit: null,
  PreferColor: null,
  IsActive: true,
  GiveNoRule: range(1, 201),
})

const getDataLoading = ref(false)
const GetDoctorItem = async () => {
  getDataLoading.value = true
  const { data } = await getDoctorItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  ParentDepartmentNo: useRequired({ title: '部門', type: 'select' }),
  DepartmentNo: useRequired({ title: '科別', type: 'select' }),
  PersonId: useRequired({ title: '醫生', type: 'select' }),
  FirstLimit: useRequired({ title: '初診上限', type: 'input' }),
  Limit: useRequired({ title: '人數上限', type: 'input' }),
  IsActive: useRequired({ title: '啟用狀態', type: 'select' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postDoctorItem,
    edit: putDoctorItem,
    delete: deleteDoctorItem,
  }

  let error
  try {
    await api[props.editType](param)
  } catch (err) {
    error = err
  }

  $q.notify({
    type: error ? 'negative' : 'positive',
    message: editHeader.value + (!error ? '成功' : `失敗：${JSON.stringify(error.data)}`),
    position: 'top',
  })

  if (!error) {
    onDialogOK()
  }

  editLoading.value = false
}

const onSaveClick = () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (!result) {
    errorInputRef.focus()
    return
  }

  callApi(editItem)
}

const onDeleteClick = () => {
  callApi(editItem.Id)
}

const doctorListKey = ['employee', '?roleNo=Doctor']
const departmentLayer1ListKey = ['department', '?layer=1']
const departmentLayer2ListKey = ['department', '?layer=2']

const init = () => {
  if (props.id) GetDoctorItem()
}
init()
</script>

