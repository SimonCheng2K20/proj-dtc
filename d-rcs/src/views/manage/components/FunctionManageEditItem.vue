<template>
  <Dialog v-model:visible="editShow" :draggable="false" modal :header="editHeader" style="width: 768px" class="custom-modal">
    <div v-if="editType === 'delete'" class="font-bold">是否確定刪除此功能？</div>
    <my-input-group class="grid gap-2">
      <my-input-wrapper label="功能代碼" require-mark><InputText v-model="editItem.No" :disabled="editType !== 'add'"></InputText></my-input-wrapper>
      <my-input-wrapper label="功能名稱" require-mark><InputText v-model="editItem.Name" :disabled="editType === 'delete'"></InputText></my-input-wrapper>
      <my-input-wrapper label="顯示順序" require-mark>
        <InputText v-model="editItem.Seq" type="number" :disabled="editType === 'delete'"></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="啟用狀態">
        <div class="p-2">
          <Checkbox :binary="true" v-model="editItem.IsActivated" :disabled="editType === 'delete'" />
        </div>
      </my-input-wrapper>
    </my-input-group>

    <template #footer>
      <Button class="p-button-cancel" @click="editShow = false">取消</Button>
      <Button v-if="editType === 'add'" class="p-button-add" @click="onOKClick" :disabled="editLoading">建立</Button>
      <Button v-if="editType === 'edit'" class="p-button-edit" @click="onOKClick" :disabled="editLoading">儲存</Button>
      <Button v-if="editType === 'delete'" class="p-button-delete" @click="onOKClick" :disabled="editLoading">刪除</Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getFunctionItem, postFunctionItem, putFunctionItem, deleteFunctionItem } from 'api'
import { cloneDeep } from 'lodash-es'
import { useToast } from 'vue-toastification'

const toast = useToast()

const emit = defineEmits(['ok'])

const id = ref()

const editShow = ref(false)
const editType = ref()

const editHeader = computed(() => {
  switch (editType.value) {
    case 'add':
      return `新增功能`
    case 'edit':
      return `編輯功能`
    case 'delete':
      return `刪除功能`
    default:
      return null
  }
})

const initData = {}
initData.editItem = {}
const editItem = reactive(cloneDeep(initData.editItem))

const GetFunctionItem = async (__id) => {
  try {
    const res = await getFunctionItem(__id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const validate = () => {
  const errorArr = []

  if (!!editItem.No === false) errorArr.push('功能代碼')
  if (!!editItem.Name === false) errorArr.push('功能名稱')
  if (!!editItem.Seq === false) errorArr.push('顯示順序')

  if (errorArr.length === 0) return true
  else {
    toast.error(errorArr.join('、') + ' 為必填欄位！', {
      timeout: 5000,
      hideProgressBar: true,
    })
    return false
  }
}

const editLoading = ref(false)
const PostFunctionItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postFunctionItem(editItem)
    if (res.status === 200 || res.status === 204) {
      toast.success('新增功能成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok', editType.value)
    }
  } catch (err) {
    console.log(err)
    toast.error('新增功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    editLoading.value = false
  }
}

const PutFunctionItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putFunctionItem(editItem)
    if (res.status === 200 || res.status === 204) {
      toast.success('編輯功能成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok', editType.value)
    }
  } catch (err) {
    console.log(err)
    toast.error('編輯功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteFunctionItem = async (__id) => {
  try {
    editLoading.value = true
    const res = await deleteFunctionItem(__id)
    if (res.status === 200 || res.status === 204) {
      toast.success('刪除功能成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok', editType.value)
    }
  } catch (err) {
    console.log(err)
    toast.error('刪除功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    editLoading.value = false
  }
}

const onOKClick = () => {
  switch (editType.value) {
    case 'add':
      if (validate() === false) return
      PostFunctionItem(editItem)
      break
    case 'edit':
      if (validate() === false) return
      PutFunctionItem(editItem)
      break
    case 'delete':
      DeleteFunctionItem(id.value)
      break
  }
}

// GetDropdownReplace

defineExpose({
  show({ id: __id, type }) {
    Object.assign(editItem, cloneDeep(initData.editItem))

    if (!!__id) {
      id.value = __id
      GetFunctionItem(id.value)
    }

    editType.value = type
    editShow.value = true
  },
  hide() {
    editShow.value = false
    console.log(editShow.value)
  },
  getEditItem() {
    return cloneDeep(editItem)
  },
  GetFunctionItem,
  PostFunctionItem,
  PutFunctionItem,
  DeleteFunctionItem,
})

const init = () => {
  // InitDropdownReplace
}
init()
</script>
