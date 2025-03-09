<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content :header="header" width="600px" @close="onDialogCancel()">
      <my-input-group class="grid grid-cols-1 gap-2" @close="onDialogCancel">
        <my-input-wrapper label="廠商編號">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.VendorId"
            :rules="rule.VendorId"
            :ref="(el) => (inputRefs.VendorId = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="廠商名稱">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Name"
            :rules="rule.Name"
            :ref="(el) => (inputRefs.Name = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="廠商地址">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Address"
            :rules="rule.Address"
            :ref="(el) => (inputRefs.Address = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="廠商聯絡人">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Contact"
            :rules="rule.Contact"
            :ref="(el) => (inputRefs.Contact = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="廠商電話">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Phone"
            :rules="rule.Phone"
            :ref="(el) => (inputRefs.Phone = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper class="pb-1" label="統一發票">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.TaxId"
            :rules="rule.TaxId"
            :ref="(el) => (inputRefs.TaxId = el)"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn color="grey" label="取消" dense unelevated @click="onDialogCancel"></q-btn>
        <q-btn
          :label="editType === 'delete' ? '刪除' : '儲存'"
          dense
          unelevated
          :color="editType === 'delete' ? 'negative' : 'primary'"
          :loading="subLoading"
          :disable="getDataLoading"
          @click="onSaveClick()"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { computed, reactive, ref } from 'vue'

// api
import { getMedVenderItem, postMedVender, putMedVender, deleteMedVender } from 'api'

// utils
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { useRequired } from 'utils/rules.js'

const $q = useQuasar()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: {
    type: String,
    require: true,
  },
  id: {
    type: [String, Number],
    default: '',
  },
})

const header = computed(() => {
  switch (props.editType) {
    case 'add':
      return '新增藥品廠商'
    case 'edit':
      return '編輯藥品廠商'
    case 'delete':
      return '刪除藥品廠商'
    default:
      return ''
  }
})

const initData = {
  VendorId: '',
  Name: '',
  Address: '',
  Phone: '',
  Contact: '',
  TaxId: '',
  Status: 0,
}

const editItem = reactive({ ...initData })

const onSaveClick = () => {
  switch (props.editType) {
    case 'add':
      if (validate() === true && confirm('確定新增廠商資料?')) PostMedVender()
      break
    case 'edit':
      if (validate() === true && confirm('確定編輯廠商資料?')) PutMedVender()
      break
    case 'delete':
      if (confirm('確定刪除廠商資料?')) DeleteMedVender()
      break
  }
}

const getDataLoading = ref(false)

const GetMedVenderItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getMedVenderItem(props.id)

    switch (res.status) {
      case 200:
        Object.assign(editItem, res.data)
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const subLoading = ref(false)

// 新增
const PostMedVender = async () => {
  try {
    subLoading.value = true
    const res = await postMedVender(editItem)
    switch (res.status) {
      case 204:
        $q.notify({
          type: 'positive',

          message: '新增藥品廠商成功',
          position: 'top',
        })
        onDialogOK()
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '新增藥品廠商失敗',
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

// 修改
const PutMedVender = async () => {
  try {
    subLoading.value = true
    const res = await putMedVender(editItem)
    switch (res.status) {
      case 204:
        $q.notify({
          type: 'positive',

          message: '編輯藥品廠商成功',
          position: 'top',
        })
        onDialogOK()
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '編輯藥品廠商失敗',
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

// 刪除
const DeleteMedVender = async () => {
  try {
    subLoading.value = true
    const res = await deleteMedVender(editItem.VendorId)
    switch (res.status) {
      case 204:
        $q.notify({
          type: 'positive',

          message: '刪除藥品廠商成功',
          position: 'top',
        })
        onDialogOK()
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '刪除藥品廠商失敗',
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

const rule = {
  VendorId: useRequired({ title: '廠商編號', type: 'input' }),
  Name: useRequired({ title: '廠商名稱', type: 'input' }),
  Address: useRequired({ title: '廠商地址', type: 'input' }),
  Phone: useRequired({ title: '廠商電話', type: 'input' }),
  Contact: useRequired({ title: '廠商聯絡人', type: 'input' }),
  TaxId: useRequired({ title: '統一發票', type: 'input' }),
}

const inputRefs = reactive({})

// const validate = () => {
//   let errorInputRef = null

//   return Object.values(inputRefs).every((inputRef) => {
//     if (!!inputRef) {
//       const validatedResult = inputRef.validate()
//       if (errorInputRef === null && validatedResult === false) {
//         errorInputRef = inputRef
//         errorInputRef.focus()
//       }
//       return validatedResult
//     } else {
//       return null
//     }
//   })
// }

const validate = () => {
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

const init = () => {
  GetMedVenderItem()
}

init()
</script>
