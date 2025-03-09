<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="更改密碼" width="1280px" @close="onDialogCancel">
      <div v-if="!!firstLoginData">{{ firstLoginData.Message }}</div>
      <my-input-group class="grid gap-2 pb-1">
        <my-input-wrapper label="使用者帳號">
          <q-input v-bind="QInputProps" :model-value="authStore.userData.No || firstLoginData.No" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="使用者姓名">
          <q-input v-bind="QInputProps" :model-value="authStore.userData.Name || firstLoginData.Name" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="原先密碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Old = el)"
            :rules="rules.Old"
            lazy-rules
            v-model="editItem.Old"
            :type="isOldPwdShow ? 'text' : 'password'"
          >
            <template #append>
              <q-icon :name="isOldPwdShow ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isOldPwdShow = !isOldPwdShow"></q-icon>
            </template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="新設密碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.New = el)"
            :rules="rules.New"
            lazy-rules
            v-model="editItem.New"
            :type="isNewPwdShow ? 'text' : 'password'"
          >
            <template #append>
              <q-icon :name="isNewPwdShow ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isNewPwdShow = !isNewPwdShow"></q-icon>
            </template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="再次確認密碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.confirm = el)"
            :rules="rules.confirm"
            lazy-rules
            v-model="editItem.confirm"
            :type="isConfirmPwdShow ? 'text' : 'password'"
          >
            <template #append>
              <q-icon :name="isConfirmPwdShow ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isConfirmPwdShow = !isConfirmPwdShow"></q-icon>
            </template>
          </q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn unelevated color="primary" label="儲存" @click="onSaveClick" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { putChangePassword } from 'api'

const authStore = useAuthStore()
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  firstLoginData: Object,
})

const isOldPwdShow = ref(false)
const isNewPwdShow = ref(false)
const isConfirmPwdShow = ref(false)

const editItem = reactive({
  Old: null,
  New: null,
  confirm: null,
})

const inputRefs = reactive({})
const rules = {
  Old: [(val) => (val !== '' && val !== null) || '請輸入原先密碼'],
  New: [
    (val) => (val !== '' && val !== null) || '請輸入新設密碼',
    // (val) =>
    //   /(?=^.{6,}$)((?=.*\d))(?![.\n])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W]).*$/.test(val) ||
    //   '密碼長度至少 6 碼（含）以上，且密碼必須包含英文大寫字母、英文小寫字母、阿拉伯數字及特殊符號',
  ],
  confirm: [(val) => (val !== '' && val !== null) || '請輸入再次確認密碼', (val) => val === editItem.New || '再次確認密碼與新設密碼不相符'],
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

  PutChangePassword(editItem)
}

const PutChangePassword = async (editItem) => {
  try {
    const res = await putChangePassword(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更改密碼成功，請重新登入',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '更改密碼失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  }
}
</script>

