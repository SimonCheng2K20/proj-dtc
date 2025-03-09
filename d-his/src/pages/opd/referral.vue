<template>
  <q-page class="bg-gray-100 font-semibold">
    <data-header :items="patientTitle"></data-header>
    <my-title title="開立轉診單"> </my-title>
    <main class="py-3 px-5">
      <section class="bg-white px-28 shadow-gray-300 shadow">
        <h1 class="text-xl font-bold p-3 text-center">開立轉診單</h1>
        <div class="my-3">
          <my-input-group class="grid grid-cols-4 gap-4">
            <my-input-wrapper label="轉診單(轉診至)">
              <q-select
                v-bind="QSelectProps"
                v-model="transData.TransCode"
                :options="transHosFilterItems"
                option-label="Name"
                option-value="Code"
                map-options
                emit-value
                use-input
                :rules="rule.TransCode"
                :ref="(el) => inputRefs.push(el)"
                @filter="onTransHosFilter"
                @input-value="filterLoading = true"
              >
                <template #no-option="{ inputValue }">
                  <q-item v-if="!!inputValue">
                    <q-item-section class="text-grey">
                      <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                      <span v-else>找不到符合的資料</span>
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>
                        <div v-html="scope.opt.filterLabel"></div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </my-input-wrapper>

            <my-input-wrapper label="開立日期">
              <my-date-input
                v-bind="QInputProps"
                v-model="transData.CreateDate"
                :date-options="dateOption"
                :rules="rule.CreateDate"
                :ref="(el) => inputRefs.push(el)"
              >
              </my-date-input>
            </my-input-wrapper>

            <my-input-wrapper class="col-span-4" inputBorder label="轉診目的:">
              <div class="grow">
                <q-option-group
                  class="flex justify-between pr-2"
                  v-model="transData.TransPurpose"
                  :options="transPurposeOptions"
                  inline
                  color="primary"
                />
              </div>
            </my-input-wrapper>
          </my-input-group>

          <p class="mt-5">建議轉至院所 :</p>
          <my-input-group class="grid grid-cols-4 gap-4">
            <my-input-wrapper label="安排就醫日期">
              <my-date-input
                v-bind="QInputProps"
                v-model="transData.TransDate"
                :date-options="dateOption"
                :rules="rule.TransDate"
                :ref="(el) => inputRefs.push(el)"
              >
              </my-date-input>
            </my-input-wrapper>

            <my-input-wrapper label="科別">
              <q-input
                v-bind="QInputProps"
                v-model="transData.TransDepartment"
                :rules="rule.TransDepartment"
                :ref="(el) => inputRefs.push(el)"
              ></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="診間">
              <q-input
                v-bind="QInputProps"
                v-model="transData.TransRoom"
                :rules="rule.TransRoom"
                :ref="(el) => inputRefs.push(el)"
              ></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="看診號">
              <q-input
                v-bind="QInputProps"
                v-model="transData.TransBookingNo"
                :rules="rule.TransBookingNo"
                :ref="(el) => inputRefs.push(el)"
              ></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="醫師">
              <q-input
                v-bind="QInputProps"
                v-model="transData.SuggestDoctor"
                :rules="rule.SuggestDoctor"
                :ref="(el) => inputRefs.push(el)"
              ></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="有效期限">
              <my-date-input
                v-bind="QInputProps"
                v-model="transData.ValidDate"
                :date-options="dateOption"
                :rules="rule.ValidDate"
                :ref="(el) => inputRefs.push(el)"
              >
              </my-date-input>
            </my-input-wrapper>
          </my-input-group>
        </div>

        <div class="pt-5 pb-20">
          <p>※本轉診單限使用乙次。</p>
          <p>※以上欄位均屬於必填非屬本辦法第7條規定應包括之內容者，如無則填無。</p>
          <p>
            ※特約醫院、診所執行本保險之計畫或方案提供定點或巡迴醫療服務，將保險對象轉回同機構繼續接受診治者，得免填復第二聯。
          </p>
        </div>
      </section>
      <section class="flex justify-center p-5">
        <q-btn
          class="mr-2"
          unelevated
          color="grey"
          label="取消"
          @click="router.push(route.query.backpath ? route.query.backpath : router.push({ mame: 'OpdRecord-Detail' }))"
        ></q-btn>
        <q-btn unelevated color="edit" label="儲存並列印" @click="PostTransForm()"></q-btn>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOpdStore } from 'stores/opd.js'
import { useQuasar } from 'quasar'

//componet
import dataHeader from 'components/DataHeader.vue'

// plug
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import { postTransForm, getTransFormPDF, getTransOrganization } from 'api'

// utils
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const opdStore = useOpdStore()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const patientTitle = computed(() => {
  return [
    { label: '目前診號', value: opdStore.opdData.RoomBooking.Seq },
    { label: '病歷號', value: opdStore.opdData.PatientId },
    { label: '姓名', value: opdStore.opdData.PersonName },
    { label: '性別', value: opdStore.opdData.Gender },
    { label: '年齡', value: opdStore.opdData.Age },
    {
      label: '生日',
      value: opdStore.opdData.BirthDate ? dayjs(opdStore.opdData.BirthDate).format('YYYY-MM-DD') : null,
    },
    { label: '身分證號', value: opdStore.opdData.Idetifier },
    { label: '身份別', value: opdStore.opdData.IdentityName },
    { label: '過敏', value: opdStore.opdData.Allergy },
  ]
})

const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const transPurposeOptions = [
  { value: 1, label: '急診治療' },
  { value: 2, label: '住院治療' },
  { value: 3, label: '門診治療' },
  { value: 4, label: '進一步檢查,檢查項目' },
  { value: 5, label: '轉回轉出或適當院所繼續追蹤' },
  { value: 6, label: '其他' },
]

const filterLoading = ref(false)
const transHosKeys = ['Name']
const transHosItems = ref([])

const GetTransOrganization = async () => {
  try {
    filterLoading.value = true
    const res = await getTransOrganization()
    if (res.status === 200) {
      transHosItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: transHosFilterItems, filterHandler: onTransHosFilter } = useFilter(
  { items: transHosItems, filterKeys: transHosKeys },
  () => {
    filterLoading.value = false
  }
)

const initData = {
  OpdId: route.params.opdId,
  TransCode: '',
  TransPurpose: '1',
  CreateDate: dayjs(new Date()).format('YYYY/MM/DD'),
  TransDate: '',
  TransDepartment: '',
  TransRoom: '',
  TransBookingNo: '',
  SuggestDoctor: '',
  ValidDate: '',
}

const pdfLoading = ref(false)

const transData = reactive(cloneDeep(initData))

const PostTransForm = async () => {
  if (validate() === true && confirm('確定開立轉診單?')) {
    try {
      pdfLoading.value = true
      const body = transData
      const res = await postTransForm(body)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '轉診單開立成功',
          position: 'top',
        })
        await GetTransFormPDF()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '轉診單開立失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      pdfLoading.value = false
    }
  }
}

const GetTransFormPDF = async () => {
  try {
    pdfLoading.value = true
    const res = await getTransFormPDF(route.params.opdId)
    if (res.status === 200) {
      window.open(res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    pdfLoading.value = false
  }
}

// 表單驗證
const inputRefs = ref([])

const rule = {
  TransCode: [(val) => (val !== null && val !== '') || '請選擇轉診機構'],
  CreateDate: [(val) => (val !== null && val !== '') || '請輸入開立日期'],
  TransDate: [(val) => (val !== null && val !== '') || '請輸入就醫日期'],
  TransDepartment: [(val) => (val !== null && val !== '') || '請輸入科別'],
  TransRoom: [(val) => (val !== null && val !== '') || '請輸入診間'],
  TransBookingNo: [(val) => (val !== null && val !== '') || '請輸入看診號'],
  SuggestDoctor: [(val) => (val !== null && val !== '') || '請輸入看診醫師'],
  ValidDate: [(val) => (val !== null && val !== '') || '請輸入有效期限'],
}

const validate = () => {
  let errorInputRef = null

  const validationArr = inputRefs.value.map((inputRef) => {
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
  GetTransOrganization()
}

init()
</script>

