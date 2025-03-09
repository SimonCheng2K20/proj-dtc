<template>
  <div class="majorInjury">
    <v-data-table class="list" :headers="headers" :items="showList" hide-default-footer showAll>
      <template #item-Icd10Cht="{ item }">
        <div>
          <div v-for="(value, index) in item.list" :key="index">{{ index + 1 }}. {{ value.Icd10Cht }}<br /></div>
        </div>
      </template>
      <template #item-Valid="{ item }">
        <div>
          <div v-for="(value, index) in item.list" :key="index">{{ index + 1 }}. {{ value.Valid }}<br /></div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { getMajorInjury } from 'api'
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
})

const showList = ref([])

const getData = async () => {
  let res = [...props.data]
  for (let item of res) {
    let obj = {
      $filter: `contains(Icd10,'${item.MajorInjuryCode}')`,
    }
    item.list = await getMajorInjury(obj).then((res) => res.data.Items)
  }
  showList.value = res
}

getData()

const headers = reactive([
  { text: 'ICD-10-CM/PCS碼', value: 'MajorInjuryCode', width: '200px' },
  { text: '中文疾病名稱', value: 'Icd10Cht' },
  { text: '重大傷病證明有效期限', value: 'Valid' },
])
</script>

<style lang="scss" scoped></style>

