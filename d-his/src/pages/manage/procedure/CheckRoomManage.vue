<template>
  <q-page>
    <my-title no-fixed title="檢查室維護"></my-title>
    <div class="p-2">
      <my-search-area gridCols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="檢查室代號">
          <q-input v-bind="QInputProps" v-model="exRoomData.No"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢查室名稱">
          <q-input v-bind="QInputProps" v-model="exRoomData.Name"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="儀器類別">
          <q-select
            v-bind="QSelectProps"
            use-input
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :options="modalityFilterItems"
            v-model="exRoomData.Modality"
            @filter="onModalityFilter"
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
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            :options="options"
            v-model="exRoomData.IsActive"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="systemMsgShow('add')"></q-btn>
        </template>
      </my-search-area>

      <div class="my-2">
        <q-table
          v-bind="QTableProps"
          :columns="columns"
          :rows="rows"
          row-key="No"
          :pagination="pagination"
          :loading="tableLoading"
        >
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col, row }">
              <q-btn class="mr-2" unelevated dense color="delete" label="刪除" @click="systemMsgShow('delete', row)">
              </q-btn>
              <q-btn unelevated dense color="edit" label="編輯" @click="systemMsgShow('edit', row)"> </q-btn>
            </q-td>
          </template>
          <template v-slot:bottom>
            <my-pagination
              class="mx-auto p-4"
              v-model="pagination"
              @update:model-value="GetExaminationRoom"
            ></my-pagination>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="systemMsg.show" no-backdrop-dismiss full-width>
      <my-dialog-content :header="systemMsg.title" width="563px" @close="systemMsgOff"
        ><p v-if="systemMsg.type === 'delete'" class="font-semibold text-xl mb-1">是否確定刪除此檢查室?</p>
        <div class="pb-1">
          <my-input-group class="grid gap-2.5 grid-cols-1">
            <my-input-wrapper label="檢查室代號">
              <q-input
                :readonly="systemMsg.type !== 'add'"
                :bg-color="systemMsg.type !== 'add' ? 'blue-grey-1' : null"
                v-bind="QInputProps"
                v-model="systemMsgData.No"
                :rules="rule.No"
                :ref="(el) => (inputRefs.No = el)"
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="檢查室名稱">
              <q-input
                :readonly="systemMsg.type === 'delete'"
                :bg-color="systemMsg.type === 'delete' ? 'blue-grey-1' : null"
                v-bind="QInputProps"
                v-model="systemMsgData.Name"
                :rules="rule.Name"
                :ref="(el) => (inputRefs.Name = el)"
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="儀器類別">
              <q-select
                :readonly="systemMsg.type === 'delete'"
                :bg-color="systemMsg.type === 'delete' ? 'blue-grey-1' : null"
                v-bind="QSelectProps"
                :use-input="systemMsg.type !== 'delete'"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
                :rules="rule.Modality"
                :ref="(el) => (inputRefs.Modality = el)"
                :options="modalityFilterOptions"
                v-model="systemMsgData.Modality"
                @filter="onDepartmentFilter"
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
                        <div v-html="scope.opt.filterLabel || `${scope.opt.No} - ${scope.opt.Name}`"></div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </my-input-wrapper>
            <my-input-wrapper label="啟用狀態">
              <q-select
                :readonly="systemMsg.type === 'delete'"
                :bg-color="systemMsg.type === 'delete' ? 'blue-grey-1' : null"
                v-bind="QSelectProps"
                emit-value
                map-options
                :rules="rule.IsActive"
                :ref="(el) => (inputRefs.IsActive = el)"
                :options="options"
                v-model="systemMsgData.IsActive"
              ></q-select>
            </my-input-wrapper>
          </my-input-group>
        </div>

        <template #actions>
          <q-btn label="取消" color="grey" dense unelevated @click="systemMsgOff"></q-btn>
          <q-btn
            :label="systemMsg.type === 'delete' ? '確定刪除' : '確定'"
            dense
            unelevated
            :color="systemMsg.type === 'delete' ? 'negative' : 'primary'"
            :loading="btnLoading"
            @click="makeRequest"
          ></q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>

    <q-dialog v-model="systemMsg.errorMsgShow" persistent>
      <q-card>
        <q-card-section class="pb-2 flex items-center">
          <q-icon class="bg-[#C60B28] rounded-full mr-2" name="close" size="30px" color="white"></q-icon>
          <span class="font-semibold text-xl">{{ systemMsg.errorMsg }}</span>
        </q-card-section>

        <q-card-actions align="right" class="">
          <q-btn
            class="font-semibold"
            label="確定"
            dense
            unelevated
            size="14px"
            text-color="white"
            color="primary"
            @click="systemMsg.errorMsgShow = false"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'

// api
import { getModality, getExaminationRoom, deleteExaminationRoom, postExaminationRoom, putExaminationRoom } from 'api'

// utils
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'

const options = [
  { value: true, label: '啟用' },
  { value: false, label: '未啟用' },
]

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = computed(() => {
  return [
    { name: 'action', label: '操作', align: 'center', field: 'action', style: 'width:250px' },
    { name: 'No', label: '檢查室代號', align: 'center', field: 'No' },
    { name: 'Name', label: '檢查室名稱', align: 'center', field: 'Name' },
    { name: 'Modality', label: '儀器類別', align: 'center', field: 'Modality' },
    {
      name: 'IsActive',
      label: '啟用狀態',
      align: 'center',
      field: (row) => (row.IsActive ? '啟用' : '未啟用'),
    },
  ]
})

const rows = ref([])

// 儀器類別
const filterLoading = ref(false)
const modalityItems = ref([])
const modalityFilterKeys = ['Code', 'Name']
const GetModality = async () => {
  try {
    const res = await getModality()
    modalityItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: modalityFilterItems, filterHandler: onModalityFilter } = useFilter(
  { items: modalityItems, filterKeys: modalityFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 初始資料
const initData = {
  No: null,
  Name: null,
  Modality: null,
  IsActive: null,
}

const exRoomData = ref({ ...initData })

const filter = computed(() => {
  const str = Object.entries(exRoomData.value)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'No':
        case 'Name':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'Modality':
        case 'IsActive':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')

  return str
})

// 表單資料請求
const tableLoading = ref(false)

const GetExaminationRoom = async () => {
  tableLoading.value = true
  try {
    const query = setSearchQuery({
      $filter: filter.value,
      $top: pagination.value.rowsPerPage,
      $skip: pagination.value.rowsPerPage * (pagination.value.page - 1),
    })
    const res = await getExaminationRoom(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const searchSubmit = () => {
  pagination.value.page = 1
  GetExaminationRoom()
}

const searchClear = () => {
  pagination.value.page = 1
  exRoomData.value = { ...initData }
  GetExaminationRoom()
}

// 新增、編輯、刪除彈出框
const systemMsg = reactive({
  show: false,
  type: null,
  title: null,
  errorMsgShow: false,
  errorMsg: '檢查室代碼重複，請修改！',
})

const systemMsgShow = (type, row = {}) => {
  systemMsg.show = true
  systemMsg.type = type
  let { No, Name, IsActive, Modality } = row

  switch (systemMsg.type) {
    case 'add':
      systemMsg.title = '新增檢查室'
      break
    case 'edit':
      systemMsgData.value = { No, Name, IsActive, Modality }
      systemMsg.title = '編輯檢查室'
      break
    case 'delete':
      systemMsgData.value = { No, Name, IsActive, Modality }
      systemMsg.title = '刪除資料'
      break
  }
}

const systemMsgOff = () => {
  systemMsgData.value = { ...initData }
  systemMsg.show = false
}

const systemMsgData = ref({ ...initData })

// 新增請求
const btnLoading = ref(false)

const PostExaminationRoom = async () => {
  if (validate() === true && confirm('確定新增此檢查室資料?')) {
    btnLoading.value = true
    try {
      const body = { ...systemMsgData.value }
      const res = await postExaminationRoom(body)
      if (res.status === 204) {
        systemMsgOff()
        GetExaminationRoom()
      }
    } catch (err) {
      console.log(err)
      if (err.data === '錯誤:檢查室代碼重複，請修改！') systemMsg.errorMsgShow = true
    } finally {
      btnLoading.value = false
    }
  }
}

// 編輯請求
const PutExaminationRoom = async () => {
  if (validate() === true && confirm('確定編輯此檢查室資料?')) {
    btnLoading.value = true
    try {
      const body = { ...systemMsgData.value }
      const res = await putExaminationRoom(body)
      if (res.status === 204) {
        console.log(res.data)
        systemMsgOff()
        GetExaminationRoom()
      }
    } catch (err) {
      console.log(err)
    } finally {
      btnLoading.value = false
    }
  }
}

// 刪除請求
const DeleteExaminationRoom = async () => {
  if (validate() === true && confirm('確定刪除此檢查室資料?')) {
    btnLoading.value = true
    try {
      const id = systemMsgData.value.No
      const res = await deleteExaminationRoom(id)
      if (res.status === 204) {
        console.log(res.data)
        systemMsgOff()
        const prePage = pagination.value.page - 1
        if (prePage > 0) {
          if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
        }
        GetExaminationRoom()
      }
    } catch (err) {
      console.log(err)
    } finally {
      btnLoading.value = false
    }
  }
}

const makeRequest = async () => {
  switch (systemMsg.type) {
    case 'add':
      await PostExaminationRoom()
      break
    case 'edit':
      await PutExaminationRoom()
      break
    case 'delete':
      await DeleteExaminationRoom()
      break
  }
}

// 表單驗證
const inputRefs = reactive({})

const rule = {
  No: [(val) => (val !== null && val !== '') || '請輸入檢查室代號'],
  Name: [(val) => (val !== null && val !== '') || '請輸入檢查室名稱'],
  Modality: [(val) => (val !== null && val !== '') || '請輸入儀器類別'],
  IsActive: [(val) => (val !== null && val !== '') || '請輸入啟用狀態'],
}

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
  GetExaminationRoom()
  GetModality()
}

init()
</script>
