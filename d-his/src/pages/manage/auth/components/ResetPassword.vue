<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="重置密碼" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <my-input-group class="grid gap-2 pb-1">
        <my-input-wrapper label="帳號">
          <q-input v-bind="QInputProps" v-model="data.No" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" v-model="data.Name" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="重置密碼">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Permit = el)"
            :rules="rules.Permit"
            v-model="editItem.Permit"
            :type="isPwdShow1 ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="isPwdShow1 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdShow1 = !isPwdShow1"
              ></q-icon>
            </template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="確認密碼">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.PermitConfirm = el)"
            :rules="rules.PermitConfirm"
            v-model="editItem.PermitConfirm"
            :type="isPwdShow2 ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="isPwdShow2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdShow2 = !isPwdShow2"
              ></q-icon>
            </template>
          </q-input>
        </my-input-wrapper>
      </my-input-group>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          unelevated
          color="secondary"
          label="重置密碼"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { putResetPassword } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  data: Object,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增帳戶`
    case 'edit':
      return `編輯帳戶`
    case 'delete':
      return `刪除帳戶`
    default:
      return null
  }
})

const isPwdShow1 = ref(false)
const isPwdShow2 = ref(false)

const editItem = reactive({
  Permit: null,
  PermitConfirm: null,
})

const getDataLoading = ref(false)
const GetAccountItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getAccountItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  Permit: useRequired({ title: '重置密碼', type: 'input' }),
  PermitConfirm: [
    ...useRequired({ title: '確認密碼', type: 'input' }),
    (val) => val === editItem.Permit || '確認密碼與重置密碼不相符',
  ],
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  PutResetPassword()
}

const editLoading = ref(false)
const PutResetPassword = async () => {
  try {
    editLoading.value = true
    const res = await putResetPassword(props.data.No, editItem.Permit)
    $q.notify({
      type: 'positive',
      message: '重製密碼成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '重製密碼失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}
</script>

