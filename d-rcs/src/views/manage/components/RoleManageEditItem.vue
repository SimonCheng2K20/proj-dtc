<template>
  <Dialog v-model:visible="editShow" :draggable="false" modal :header="editHeader" style="width: 768px" class="custom-modal">
    <div v-if="editType === 'delete'" class="font-bold">是否確定刪除此角色？</div>

    <my-input-group class="grid gap-2">
      <my-input-wrapper label="角色代碼"><input-text v-model="editItem.No" :disabled="editType === 'delete'"></input-text></my-input-wrapper>
      <my-input-wrapper label="角色名稱"><input-text v-model="editItem.Name" :disabled="editType === 'delete'"></input-text></my-input-wrapper>
      <my-input-wrapper label="機構層級">
        <dropdown v-model="editItem.Level" :options="levelItems" option-label="Name" option-value="No" :disabled="editType === 'delete'"></dropdown>
      </my-input-wrapper>
      <my-input-wrapper label="啟用狀態">
        <div class="p-2">
          <checkbox v-model="editItem.IsActivated" :binary="true" :disabled="editType === 'delete'"></checkbox>
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
import { getRoleItem, postRoleItem, putRoleItem, deleteRoleItem } from 'api'
import { cloneDeep } from 'lodash-es'
import { useToast } from 'vue-toastification'

const toast = useToast()
const props = defineProps({
  levelItems: Array,
})
const emit = defineEmits(['ok'])

const id = ref()

const editShow = ref(false)
const editType = ref()

const editHeader = computed(() => {
  switch (editType.value) {
    case 'add':
      return `新增角色`
    case 'edit':
      return `編輯角色`
    case 'delete':
      return `刪除角色`
    default:
      return null
  }
})

const initData = {}
initData.editItem = {
  No: null,
  Name: null,
  Level: null,
  IsActivated: null,
}
const editItem = reactive(cloneDeep(initData.editItem))

const GetRoleItem = async (__id) => {
  try {
    const res = await getRoleItem(__id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const validate = () => {
  const errorArr = []

  // if (!!editItem.No === false) errorArr.push('代碼')

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
const PostRoleItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postRoleItem(editItem)
    if (res.status === 200 || res.status === 204) {
      toast.success('新增角色成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    toast.error('新增角色失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    editLoading.value = false
  }
}

const PutRoleItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putRoleItem(editItem)
    if (res.status === 200 || res.status === 204) {
      toast.success('編輯角色成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    toast.error('編輯角色失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteRoleItem = async (__id) => {
  try {
    editLoading.value = true
    const res = await deleteRoleItem(__id || id.value)
    if (res.status === 200 || res.status === 204) {
      toast.success('刪除角色成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    toast.error('刪除角色失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data), {
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
      PostRoleItem(editItem)
      break
    case 'edit':
      if (validate() === false) return
      PutRoleItem(editItem)
      break
    case 'delete':
      DeleteRoleItem(id.value)
      break
  }
}

defineExpose({
  show({ id: __id, type }) {
    Object.assign(editItem, cloneDeep(initData.editItem))

    if (!!__id) {
      id.value = __id
      GetRoleItem(id.value)
    }

    editType.value = type
    editShow.value = true
  },
  hide() {
    editShow.value = false
  },
  getEditItem() {
    return cloneDeep(editItem)
  },
  GetRoleItem,
  PostRoleItem,
  PutRoleItem,
  DeleteRoleItem,
})

const init = () => {}
init()
</script>
