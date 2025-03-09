<template>
  <div>
    <data-header :items="patientTitle" type="gray" style="width: 50%"></data-header>

    <div class="grid gap-2 mt-2">
      <div class="flex">
        <div class="left-section">
          <div>記錄日期：{{ today }}</div>
          <div>護理師　：李</div>
          <div>狀態　　：</div>
        </div>
        <div class="right-section">
          <q-input type="textarea" class="w-full" rows="10"></q-input>
          <div class="text-end">
            <Button label="儲存"></Button>
          </div>
        </div>
      </div>
      <div class="flex" v-for="(item, index) in recordList" :key="index">
        <div class="left-section">
          <div>記錄日期：{{ item.recordDate }}</div>
          <div>護理師　：{{ item.nurseName }}</div>
          <div>狀態　　：{{ item.status }}</div>
        </div>
        <div class="right-section" :class="{ show: item.show }" @click="item.show = !item.show">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import dataHeader from 'components/DataHeader.vue'

const today = computed(() => {
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()

  return `${y - 1911}/${m < 10 ? `0${m}` : m}/${d < 10 ? `0${d}` : d}`
})

const recordList = ref([
  {
    recordDate: '110/03/10',
    nurseName: '王',
    status: '交接完成',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum a tenetur, itaque eligendi illum molestias ab ut doloremque nam debitis perspiciatis fuga natus totam animi pariatur est voluptatibus explicabo? Facilis.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum a tenetur, itaque eligendi illum molestias ab ut doloremque nam debitis perspiciatis fuga natus totam animi pariatur est voluptatibus explicabo? Facilis.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum a tenetur, itaque eligendi illum molestias ab ut doloremque nam debitis perspiciatis fuga natus totam animi pariatur est voluptatibus explicabo? Facilis.',
    show: false,
  },
  {
    recordDate: '110/03/09',
    nurseName: '王',
    status: '交接完成',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores sint ullam, asperiores alias delectus, hic sequi cumque architecto, expedita tempora recusandae. Rerum dolor impedit placeat rem iusto, possimus obcaecati. Praesentium!',
    show: false,
  },
])

const patientTitle = reactive([
  { label: '床號', value: '201A' },
  { label: '病歷號', value: '123' },
  { label: '姓名', value: '王先生' },
  { label: '性別', value: '男' },
  { label: '生日', value: '060/06/06 (51)' },
])
</script>

<style lang="scss" scoped>
.left-section {
  width: 240px;
  background: #eeeeee;
  flex-shrink: 0;
  border: thin solid rgba(33, 92, 186, 0.4);
  padding: 4px;
}
.right-section {
  flex-grow: 1;
  border: thin solid rgba(33, 92, 186, 0.4);
  border-left: none;
  padding: 4px;
  &:not(.show) {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>

