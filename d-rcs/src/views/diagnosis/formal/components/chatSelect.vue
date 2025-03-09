<template>
  <my-table :headers="headers" :items="items" hide-default-footer style="height: calc(100vh - 275px)">
    <template #header-select>
      <div class="flex justify-center gap-1">
        <Button
          style="background: white; color: black; padding: 4px 8px"
          label="全選"
          :icon="isSelectAll ? 'pi pi-check' : undefined"
          @click="onSelectAllClick"
        ></Button>
        <Button
          style="background: white; color: black; padding: 4px 8px"
          label="全選自己"
          :icon="isSelectSelf ? 'pi pi-check' : undefined"
          @click="onSelectSelfClick"
        />
      </div>
    </template>

    <template #item-select="{ item }">
      <Checkbox v-model="selectedItems" :value="item" @change="onCheckboxChange"></Checkbox>
    </template>
  </my-table>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { getChatById } from 'Service/apis.js'

const store = useStore()

const props = defineProps({
  id: Number,
})

const headers = reactive([
  { text: '選取', key: 'select', value: 'select', minWidth: '174px', width: '174px' },
  { text: '使用者', key: 'AccountNo', value: 'AccountNo' },
  { text: '內容', key: 'Text', value: 'Text' },
  { text: '對話時間', key: 'CreateTime', value: (row) => row.CreateTime.replace('T', ' ') },
])

const items = ref([])
const GetChatById = async () => {
  try {
    const res = await getChatById(props.id)
    if (res.status === 200) items.value = res.data.filter((item) => item.Text?.includes('已上傳附件') === false)
  } catch (err) {
    console.log(err)
  }
}

const isSelectAll = ref(false)
const isSelectSelf = ref(false)

const selectedItems = ref([])
const onSelectAllClick = () => {
  isSelectAll.value = !isSelectAll.value
  isSelectSelf.value = false
  if (isSelectAll.value) selectedItems.value = items.value
  else selectedItems.value = []
}

const onCheckboxChange = () => {
  if (selectedItems.value.length === items.value.length) isSelectAll.value = true
  else {
    isSelectAll.value = false
    isSelectSelf.value = false
  }
}

const selectedInit = () => {
  isSelectAll.value = false
  isSelectSelf.value = false
  selectedItems.value = []
}

const onSelectSelfClick = () => {
  isSelectSelf.value = !isSelectSelf.value
  isSelectAll.value = false
  if (isSelectSelf.value) selectedItems.value = items.value.filter((item) => item.AccountNo === store.state.dakar.No)
  else selectedItems.value = []
}

defineExpose({
  getSelected() {
    return selectedItems.value.map((item) => item.Text).join('\n')
  },
})

const init = () => {
  GetChatById()
}
init()
</script>
