<template>
  <div class="flex">
    <div class="border border-blue-300 rounded cursor-pointer overflow-hidden" style="width: 200px" @click="selectFile('file1')">
      <img src="/assets/upload.png" />
    </div>

    <my-table :headers="headers" :items="items" hide-defualt-footer></my-table>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const headers = reactive([
  { key: 'action', text: '操作', value: 'action' },
  { key: 'FileName', text: '檔名', value: 'FileName' },
  { key: 'Type', text: '檔案類型', value: 'Type' },
])

const items = ref([])
</script>
