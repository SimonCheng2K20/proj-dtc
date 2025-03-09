<template>
  <section class="dtc-main-section px-3" style="min-width: 1920px;">
    <applyaccountschedule ref="applyaccountscheduleRef"></applyaccountschedule>
    <section class="search-block">
      <h5 class="big-title">
        <div class="flex border-b border-gray-200 dark:border-gray-700" v-if="hasAuditfunction">
          <button
            class="flex items-center h-10 px-2 py-2 -mb-px text-center text-indigo-600 bg-transparent border-b-2 border-indigo-500 sm:px-4 -px-1 dark:border-indigo-400 dark:text-indigo-300 whitespace-nowrap focus:outline-none"
            @click.prevent="$router.push({ name: 'accountMaintain' })">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-1 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span class="mx-1 text-sm sm:text-base">帳號維護管理</span>
          </button>
          <button
            class="flex items-center h-10 px-2 py-2 -mb-px text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:px-4 -px-1 dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
            @click.prevent="$router.push({ name: 'accountauditMaintain' })">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 13.0002C4 11.1146 4 10.1718 4.58579 9.58603C5.17157 9.00024 6.11438 9.00024 8 9.00024H16C17.8856 9.00024 18.8284 9.00024 19.4142 9.58603C20 10.1718 20 11.1146 20 13.0002V15.0002C20 17.8287 20 19.2429 19.1213 20.1216C18.2426 21.0002 16.8284 21.0002 14 21.0002H10C7.17157 21.0002 5.75736 21.0002 4.87868 20.1216C4 19.2429 4 17.8287 4 15.0002V13.0002Z"
                stroke="#222222" />
              <path
                d="M16.4999 9.00006L16.5775 8.37947C16.8364 6.30788 15.9043 4.2675 14.1688 3.10709V3.10709C12.1023 1.72543 9.36726 1.89573 7.48819 3.52305L6.66986 4.23174"
                stroke="#222222" stroke-linecap="round" />
              <circle cx="12" cy="15" r="2" fill="#222222" />
            </svg>
            <span class="mx-1 text-sm sm:text-base"> 帳號審核 </span>
          </button>
        </div>
        <div v-else>帳號維護管理</div>
      </h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup mr-5">
          <span class="p-inputgroup-addon">帳號狀態</span>
          <Dropdown v-model="selectedStatus" :options="statusOptions" placeholder="全部" style="padding-top: 5px"
            optionLabel="Name" optionValue="Id" @change="getData" :filter="true"
            :showClear="Boolean(selectedStatus) ? true : false" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">使用者帳號</span>
          <InputText type="text" v-model.trim="selectedNo" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">帳號姓名</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" />
        </div>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button" style="background: #0c69e1" @click="getData">
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button" style="background: #6a9f3e" @click="clearSearch">
          清除
        </button>
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button" style="background: #fabf3e" @click="showEditModal(1)">
          +新增帳號
        </button>
      </div>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">系統角色</span>
          <Dropdown v-model="selectedRole" :options="roleOptions" placeholder="全部" style="padding-top: 5px"
            optionLabel="Name" optionValue="No" :filter="true" @change="getData"
            :showClear="Boolean(selectedRole) ? true : false" />
        </div>
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">網絡類型</span>
          <Dropdown v-model="selectedType" :options="typeOptions" placeholder="全部" style="padding-top: 5px"
            optionLabel="text" optionValue="value" :filter="true" @change="getData"
            :showClear="Boolean(selectedType) ? true : false" />
        </div>
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">隸屬單位</span>
          <Dropdown v-model="selectedInstitutionNo" :options="institutionNoOptions" placeholder="全部"
            style="padding-top: 5px" optionLabel="FullName" optionValue="No" :filter="true" @change="getData"
            :showClear="Boolean(selectedInstitutionNo) ? true : false" />
        </div>
      </div>
    </section>

    <header class="dtc-grid my-dark">
      <div v-for="(item, i) in headers" :key="`headers${i}`" @click="sortData(item)" class="header">
        {{ item.name }}
        <span v-show="item.sortDesc === null" v-if="item.key">
          <i class="pi pi-sort"></i>
        </span>
        <span v-show="item.sortDesc === false" v-if="item.key">
          <i class="pi pi-caret-up"></i>
        </span>
        <span v-show="item.sortDesc" v-if="item.key">
          <i class="pi pi-caret-down"></i>
        </span>
      </div>
    </header>
    <main class="dtc-grid" v-for="(item, idx) in items" :key="`content${idx}`" style="color: #39312e;"
      :style="idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color: #e7f2f3;'">
      <div class="content icon-conent " style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button" style="background: #3439af" @click="showEditModal(4, item)" v-if="+item.Status != 3">
          重置密碼
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button" style="background: #2196f3" @click="showEditModal(2, item)" v-if="+item.Status != 3">
          編輯
        </button>

        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button" style="background: #ff5a92" @click="showEditModal(3, item)" v-if="+item.Status != 3">
          刪除
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button" style="background: #89b04f" @click="showEditModal(5, item)" v-if="+item.Status != 3"
          title="解除帳號鎖定">
          解除
        </button>
        <!-- 123<img style="width: 36px" class="cursor-pointer" src="/assets/history2.png" /> -->
        <div @click="showAudit(item)" title="申請帳號審核">
          <img style="width: 36px" class="cursor-pointer" src="/assets/history2.png" />
        </div>
      </div>
      <div class="content" :title="item.InstitutionNoName">
        {{ item.InstitutionNoName || '' }}
      </div>
      <div class="content" :title="item.No">
        {{ item.No || '' }}
      </div>
      <div class="content" :title="item.Name">
        {{ item.Name || '' }}
      </div>
      <div class="content" :title="item.RoleNosName">
        {{ item.RoleNosName || '' }}
      </div>
      <div class="content" :title="item.StatusName">
        {{ item.StatusName || '' }}
      </div>
      <div class="content" :title="item.Phone">
        {{ item.Phone || '' }}
      </div>
      <div class="content" :title="item.Email">
        {{ item.Email || '' }}
      </div>
      <div class="content" :title="item.Expiration">
        {{ item.Expiration ? item.Expiration.split('T')[0] : '' }}
      </div>
      <div class="content" :title="item.Identifier">
        {{ item.Identifier || '' }}
      </div>
      <div class="content" :title="item.DepartmentName">
        {{ item.DepartmentName || '' }}
      </div>
      <div class="content">
        {{ +item.Type == 1 ? '醫事司' : +item.Type == 2 ? '照護司' : '' }}
      </div>
    </main>
    <main v-if="!items.length" class="mt-2 text-center text-xl font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica">No Data</main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator v-model:first="offset" v-model:rows="rows" :totalRecords="totalItemsCount"
        :rowsPerPageOptions="[5, 10, 50]"></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>

    <!-- //EditModal -->
    <Dialog v-model:visible="editModal" style="width: 950px" :draggable="false" :modal="true" class="custom-modal">
      <template #header>
        <h3>
          {{ nowType == 1 ? '新增帳號' : nowType == 2 ? '編輯帳號' : nowType == 3 ? '刪除帳號' : nowType == 4 ? '重置密碼' : '解除帳號鎖定' }}
        </h3>
      </template>
      <section v-if="nowType == 1 || nowType == 2">
        <main class="grid grid-cols-2 gap-2">
          <section>
            <div class="font-extrabold ml-0.5">帳號資料</div>
            <div class="p-inputgroup mr-5">
              <span class="p-inputgroup-addon red-star">網絡類型</span>
              <Dropdown v-model="modalItem.Type" :options="typeOptions" style="padding-top: 5px" optionLabel="text"
                optionValue="value" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon red-star">使用者帳號</span>
              <InputText type="text" v-model.trim="modalItem.No" :disabled="nowType == 2" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon red-star">帳號姓名</span>
              <InputText type="text" v-model.trim="modalItem.Name" autofocus />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon">連絡電話</span>
              <InputText type="text" v-model.trim="modalItem.Phone" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon">E-MAIL</span>
              <InputText type="text" v-model.trim="modalItem.Email" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon special-addon red-star">隸屬單位</span>
              <Dropdown v-model="modalItem.InstitutionNo" :options="institutionNoOptions.slice(1)" placeholder="隸屬單位"
                style="padding-top: 5px" optionLabel="FullName" optionValue="No" :filter="true"
                :disabled="nowType == 2 || !isAdminAccount" :showClear="Boolean(modalItem.InstitutionNo) ? true : false"
                :class="{ ['gray-color']: nowType == 2 || !isAdminAccount }" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon">兼診單位</span>
              <MultiSelect v-model="modalItem.SubInstitutionNos" :options="SubInstitutionNosOptions" placeholder="選擇單位"
                optionLabel="FullName" :resetFilterOnHide="true" :filter="true"
                :disabled="(modalItem.SubInstitutionNos.length === 0) && (SubInstitutionNosOptions.length === 0)" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon special-addon red-star">帳號狀態</span>
              <Dropdown v-model="modalItem.Status" :options="statusOptions.slice(1)" placeholder="帳號狀態"
                style="padding-top: 5px" optionLabel="Name" optionValue="Id" @change="getData" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon" :class="{
                'red-star': modalItem.RoleNos.includes('Doctor'),
              }">身分證字號</span>
              <InputText type="text" v-model.trim="modalItem.Identifier"
                :placeholder="modalItem.RoleNos.includes('Doctor') ? '角色有選擇醫生時，身分證字號為必填欄位' : ''" maxlength="10" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon special-addon" :class="{
                'red-star': modalItem.RoleNos.includes('Doctor'),
              }">科別</span>
              <Dropdown v-model="modalItem.DepartNo" :options="departItems" optionLabel="Name" optionValue="No"
                :placeholder="modalItem.RoleNos.includes('Doctor') ? '角色有選擇醫生時，科別為必填欄位' : ''"
                :class="{ ['gray-color']: modalItem.RoleNos.includes('Doctor') }" />
            </div>
            <div class="p-inputgroup mt-2">
              <span class="p-inputgroup-addon special-addon">到期日</span>
              <Calendar v-model="modalItem.Expiration" :showIcon="true" dateFormat="yy-mm-dd" v-date-input />
            </div>
          </section>
          <section>
            <div class="font-extrabold ml-0.5">授權角色</div>
            <div class="d-flex py-2" v-for="(item, index) of roleOptions.slice(1)" :key="index">
              <Checkbox :id="`${item.No}${index}`" :value="item.No" v-model="modalItem.RoleNos" class="mr-1" />
              <label class="cursor-pointer" :for="`${item.No}${index}`">{{ item.Name }}</label>
            </div>
          </section>
        </main>
      </section>
      <section v-else>
        <div class="font-black">是否確定要{{ nowType == 3 ? '刪除帳號' : nowType == 4 ? '重置密碼' : '解除帳號鎖定' }}?</div>
        <div class="mt-3">
          {{ nowType == 3 ? '使用者帳號: ' : nowType == 4 ? '重置密碼為: ' : '使用者帳號: ' }}
          <span class="font-black">{{ modalItem.No || '' }}</span>
        </div>
      </section>
      <template #footer>
        <Button label="確定" @click="saveEditModal" />
        <Button label="取消" class="p-button-success" @click="editModal = false" />
      </template>
    </Dialog>
  </section>
</template>

<script setup>
import { defineComponent, computed, ref, onMounted, watch, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import {
  getAccountList,
  putAccountList,
  postAccountList,
  deleteAccountList,
  getInstitutionNos,
  getRoleSelectNos,
  getAccountStatusNos,
  resetPassword,
  authUnlock,
  getDepart,
  getAccountNetGroupInstitutions,
} from 'Service/apis.js'
import buildQuery from 'odata-query'
import {
  arrFilter,
  appendArrFilter,
  substringofFilter,
  appendSubstringofFilter,
  equalFilter,
  appendEqualFilter,
  equalNumFilter,
  appendEqualNumFilter,
  getLocalISOString,
} from 'Service/searchFunction.js'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import applyaccountschedule from '@/components/layout/applyaccountschedule.vue'
import { cloneDeep } from 'lodash'
import { clone } from 'lodash-es'

const store = useStore()
const isAdminAccount = computed(() => {
  const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : []

  return userRoles.includes('Admins')
})

const hasAuditfunction = computed(() => {
  const userHasAuditFunction = store.state?.dakar?.FunctionNos.find((k) => k == 'accountauditMaintain') ? true : false

  return userHasAuditFunction
})

//-----------ListData----------------
//for list
const headers = ref([
  { name: '操作', key: '', sortDesc: null },
  { name: '隸屬單位', key: 'InstitutionNo', sortDesc: null },
  { name: '使用者帳號', key: 'No', sortDesc: null },
  { name: '帳號姓名', key: 'Name', sortDesc: null },
  { name: '系統角色', key: '', sortDesc: null },
  { name: '帳號狀態', key: 'Status', sortDesc: null },
  { name: '連絡電話', key: 'Phone', sortDesc: null },
  { name: 'E-MAIL', key: 'Email', sortDesc: null },
  { name: '到期日', key: 'Expiration', sortDesc: null },
  { name: '身分證字號', key: 'Identifier', sortDesc: null },
  { name: '科別', key: 'DepartmentName', sortDesc: null },
  { name: '網絡類型', key: 'Type', sortDesc: null },
])

const items = ref([])

const offset = ref(0)
const rows = ref(10)
const totalItemsCount = ref(1)
const orderByArr = ref([])

const toast = useToast()

//for search
const selectedStatus = ref(null)
const selectedNo = ref('')
const selectedName = ref('')
const selectedRole = ref(null)
const selectedInstitutionNo = ref(null)
const selectedType = ref(null)
const institutionNoOptions = ref([])
const institutionNoOptionsA = ref([])
const SubInstitutionNosOptions = ref([])

const roleOptions = ref([])
const statusOptions = ref([
  // { Name: "啟用", No: "1" },
  // { Name: "停用", No: "2" },
])

const typeOptions = ref([
  { text: '醫事司', value: 1 },
  { text: '照護司', value: 2 },
])

const GetNetGroupInstitutions = async (type, no) => {
  try {
    let query = {
      type: type,
      no: no
    }
    let { data } = await getAccountNetGroupInstitutions(query)
    return data
  } catch (e) {
    console.log(e)
    return e
  }
}

async function getAllOptions() {
  try {
    let { data } = await getInstitutionNos('')
    data = data.map((s) => {
      s.FullName = `${s.Name}【${s.No}】`
      return s
    })

    institutionNoOptions.value = [...data]
    institutionNoOptionsA.value = cloneDeep(institutionNoOptions.value)
    institutionNoOptions.value.unshift({
      No: null,
      Name: '全部',
      FullName: '全部',
    })

    // SubInstitutionNosOptions.value = cloneDeep(institutionNoOptionsA.value)

    let { data: data2 } = await getRoleSelectNos('')
    data2 = data2.map((s) => {
      s.FullName = `${s.Name}【${s.No}】`
      return s
    })

    roleOptions.value = [...data2]
    roleOptions.value.unshift({ No: null, Name: '全部', FullName: '全部' })

    let { data: data3 } = await getAccountStatusNos()
    data3 = data3.filter((s) => !`${s.Name}`.includes('已拒絕') && !`${s.Name}`.includes('待審核'))
    statusOptions.value = [...data3]
    statusOptions.value.unshift({ Id: null, Name: '全部' })
  } catch (e) {
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

async function getData() {
  try {
    //odata3 qs
    const page = +offset.value / +rows.value + +1
    const skip = (page - 1) * rows.value
    const top = rows.value
    const orderBy = orderByArr.value
    const obj = { top, skip, orderBy }
    let qs = buildQuery(obj)
    let bQs = false

    if (selectedStatus.value || selectedStatus.value == 0) {
      qs = equalNumFilter('Status', qs, selectedStatus.value)
      bQs = true
    }

    if (selectedNo.value) {
      if (bQs) {
        qs = appendSubstringofFilter('No', qs, selectedNo.value.toLowerCase())
      } else {
        qs = substringofFilter('No', qs, selectedNo.value.toLowerCase())
      }
      bQs = true
    }

    if (selectedName.value) {
      if (bQs) {
        qs = appendSubstringofFilter('Name', qs, selectedName.value.toLowerCase())
      } else {
        qs = substringofFilter('Name', qs, selectedName.value.toLowerCase())
      }
      bQs = true
    }

    if (selectedRole.value) {
      if (bQs) {
        qs = appendArrFilter('Roles', 'No', qs, selectedRole.value)
      } else {
        qs = arrFilter('Roles', 'No', qs, selectedRole.value)
      }
      bQs = true
    }

    if (selectedInstitutionNo.value) {
      if (bQs) {
        qs = appendEqualFilter('InstitutionNo', qs, selectedInstitutionNo.value)
      } else {
        qs = equalFilter('InstitutionNo', qs, selectedInstitutionNo.value)
      }
      bQs = true
    }

    if (selectedType.value) {
      if (bQs) {
        qs = appendEqualNumFilter('Type', qs, selectedType.value)
      } else {
        qs = equalNumFilter('Type', qs, selectedType.value)
      }
      bQs = true
    }

    if (bQs) {
      qs = qs + ` and Status ne 3 and Status ne 2`
    } else {
      qs = qs + `&$filter=Status ne 3 and Status ne 2`
    }

    //top:筆數、skip:跳過幾筆
    const res = await getAccountList(`${qs}`)

    let { Items, Count } = res.data

    console.log(`getAccountList: original > `, res.data)

    Items = Items.map((s) => {
      // s.RoleNosName = s.RoleNos.map((k) => `${k.Name}`).join();
      s.RoleNosNameArr = s.RoleNos.map((k) => {
        return roleOptions.value.find((j) => j.No == k) ? roleOptions.value.find((j) => j.No == k).Name : ''
      })
      s.StatusName = statusOptions.value.find((k) => k.Id == s.Status) ? statusOptions.value.find((k) => k.Id == s.Status).Name : ''
      s.InstitutionNoName = institutionNoOptions.value.find((k) => k.No == s.InstitutionNo)
        ? institutionNoOptions.value.find((k) => k.No == s.InstitutionNo).Name
        : s.OtherInstitution
      s.AuthName = !!s.Authorizer ? `${s.Authorizer}`.split('▲')[0] : ''
      s.AuthInstitutionName = !!s.Authorizer ? institutionNoOptions.value.find((k) => k.No == `${s.Authorizer}`.split('▲')[1])?.Name : ''
      return s
    })

    Items = Items.map((s) => {
      s.RoleNosName = s.RoleNosNameArr.join('、')
      return s
    })

    items.value = Items
    totalItemsCount.value = Count

  } catch (e) {
    console.log(e)
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

//sort
function sortData(item) {
  if (!item.key) {
    return
  }
  if (item.sortDesc) {
    item.sortDesc = null
  } else if (false === item.sortDesc) {
    item.sortDesc = true
  } else if (null === item.sortDesc) {
    item.sortDesc = false
  }
  orderByArr.value = []

  headers.value.forEach((s) => {
    if (s.sortDesc !== null) {
      orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`)
    }
  })
  getData()
}

function clearSearch() {
  selectedStatus.value = null
  selectedNo.value = ''
  selectedName.value = ''
  selectedRole.value = null
  selectedInstitutionNo.value = null
  selectedType.value = null
  getData()
}

onMounted(async () => {
  await getAllOptions()
  await getData()
})

watch(offset, (v, pv) => {
  getData()
})

watch(rows, (v, pv) => {
  getData()
})

//-----------editModal----------------
const editModal = ref(false)
const nowType = ref(1)
const modalItem = ref({
  PartnerHospitals: [
    {
      No: '',
      Name: '',
      IsActivated: true,
    },
  ],
  ResponsibilityHospitals: [
    {
      No: '',
      Name: '',
      IsActivated: true,
    },
  ],
  No: '',
  Name: '',
  IsActivated: true,
  DepartNo: '',
  SubInstitutionNos: []
})

const selectCheck = ref({
  type: null,
})

async function showEditModal(type, item) {
  
  //type- 1新增、2編輯、3刪除、4重置密碼、5解除帳號鎖定
  
  const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''
  if (type == 2 || type == 3 || type == 4 || type == 5) {

    selectCheck.value.type = null

    let resNetGroup = await GetNetGroupInstitutions(item.Type, item.InstitutionNo)

    resNetGroup = resNetGroup.map((s) => {
      s.FullName = `${s.Name}【${s.No}】`
      return s
    })

    modalItem.value = {
      ...item
    }

    let tempArr = []
    let tempCheck = cloneDeep(institutionNoOptions.value.slice(1))

    tempCheck.forEach((v) => {
      for (let val of modalItem.value.SubInstitutionNos) {
        if (val === v.No) {
          tempArr.push(v)
        }
      }
    })

    modalItem.value.SubInstitutionNos = tempArr

    if (resNetGroup && resNetGroup.length >= 1) {
      SubInstitutionNosOptions.value = [...resNetGroup]
    } else {
      SubInstitutionNosOptions.value = tempArr
    }

    if (!!item.Expiration) {
      modalItem.value.Expiration = dayjs(item.Expiration).format('YYYY-MM-DD')
    }
  } else {

    modalItem.value = {
      Type: 1,
      No: '',
      InstitutionNo: isAdminAccount.value ? '' : accountInstitutionNo,
      Name: '',
      Phone: '',
      Email: '',
      Expiration: '',
      Status: 100,
      RoleNos: [''],
      DepartNo: '',
      SubInstitutionNos: [],
    }

    console.log(modalItem.value)

    SubInstitutionNosOptions.value = []
    selectCheck.value.type = type

    // SubInstitutionNosOptions.value = cloneDeep(institutionNoOptionsA.value)

  }

  nowType.value = type
  editModal.value = true
}

watch(
  () => [modalItem.value.Type, modalItem.value.InstitutionNo],
  async (val) => {
    if (val[0] && (selectCheck.value.type === 1)) console.log(`0 chk:`, val[0])
    if (val[1] && (selectCheck.value.type === 1)) console.log(`1 chk:`, val[1])
    if (val[0] && val[1] && (selectCheck.value.type === 1)) {
      console.log(`0 1 chk:`, val[0], val[1])

      let resNetGroupNew = await GetNetGroupInstitutions(modalItem.value.Type, modalItem.value.InstitutionNo)
      resNetGroupNew = resNetGroupNew.map((s) => {
        s.FullName = `${s.Name}【${s.No}】`
        return s
      })

      SubInstitutionNosOptions.value = cloneDeep(resNetGroupNew)
    }
  },
  {
    deep: true,
  }
)

async function saveEditModal() {
  const _columnObj = {
    Type: '網絡類型',
    InstitutionNo: '隸屬單位',
    No: '使用者帳號',
    Name: '帳號姓名',
    Status: '帳號狀態',
    // Identifier: '身分證字號',
    // DepartNo: '科別',
  }

  const _invalidKeys = Object.keys(_columnObj)

  if (_invalidKeys.some((key) => !Boolean(modalItem.value[key])) && (nowType.value == 1 || nowType.value == 2)) {
    const _invalidValues = _invalidKeys.filter((key) => !Boolean(modalItem.value[key])).map((key) => _columnObj[key])
    toast.error(`${_invalidValues.join(', ')} \n 為 *必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  const obj = {
    ...modalItem.value,
  }

  console.log(`obj: `, obj)

  obj.Expiration = typeof obj.Expiration === 'string' ? obj.Expiration : getLocalISOString(obj.Expiration)

  obj.RoleNos = modalItem.value.RoleNos.map((s) => {
    return s
  })
  obj.RoleNos = obj.RoleNos.filter((s) => s)

  obj.SubInstitutionNos = modalItem.value.SubInstitutionNos.map((s) => {
    return s.No
  })

  console.log(obj.SubInstitutionNos)

  if (
    obj.RoleNos.includes('Doctor')
    &&
    (
      !Boolean(obj.Identifier)
      ||
      !Boolean(obj.DepartNo)
      // ||
      // (obj.SubInstitutionNos.length === 0)
    )
    &&
    (
      nowType.value == 1
      ||
      nowType.value == 2
    )
  ) {
    toast.error(`角色選擇 "醫師" 時，"身分證字號" 與 "科別" 為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  try {
    if (nowType.value == 1) {
      console.log(`post: `, obj)
      const res1 = await postAccountList(obj)
    }
    if (nowType.value == 2) {
      const res2 = await putAccountList(obj)
    }
    if (nowType.value == 3) {
      const id = `InstitutionNo(${modalItem.value.InstitutionNo}),No(${modalItem.value.No})`
      const res3 = await deleteAccountList(id)
    }

    if (nowType.value == 4) {
      const res4 = await resetPassword(modalItem.value.No)
    }

    if (nowType.value == 5) {
      const res4 = await authUnlock(modalItem.value.No)
    }

    toast.success(
      `${nowType.value == 1 ? '新增' : nowType.value == 2 ? '編輯' : nowType.value == 3 ? '刪除' : nowType.value == 4 ? '重置密碼' : '解除帳號鎖定'}成功`,
      {
        timeout: 2000,
        hideProgressBar: true,
      }
    )
  } catch (e) {
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }

  editModal.value = false
  clearSearch()
}

const applyaccountscheduleRef = ref(null)

const showAudit = (item) => {
  applyaccountscheduleRef.value.modalItem = { ...item }
  applyaccountscheduleRef.value.isShowApplyAccountAuditSchedule = true
}

const departItems = ref([])
const GetDepart = async () => {
  try {
    const res = await getDepart()
    if (res.status === 200) departItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  GetDepart()
}

init()

</script>

<style lang="scss" scoped>
.search-block {
  .big-title {
    background: #e1e8f6;
    padding: 5px;
    color: #333;
    border-radius: 0.15rem 0.15rem 0 0;
    font-size: 20px;
    font-weight: bold;
  }

  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem 0.25rem 0 0;

  .search-section {
    display: grid;
    grid-template-columns: 276px repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 108px;
  background: #f1f9e7;
  color: #1f2d56;
  font-weight: bold;
  border: 0px !important;
}

.special-addon {
  border-right: 0.5px solid #dbdcdd;
}

.dtc-grid {
  display: grid;
  // grid-template-columns: 387px 380px 130px 238px repeat(6, 1fr) 110px 100px;
  grid-template-columns: 387px 200px 160px 160px repeat(8, 1fr);
  grid-auto-flow: column;
  text-align: center;

  >div {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 15px;
    padding: 4px 0;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    display: -webkit-box;
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: rgb(46, 45, 45);
  }

  >div:first-child {
    border-left: 2px solid #ffffff;
  }

  >.header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }

  >.content {
    padding: 6px;
    padding-top: 4px;
    height: 43px;
  }
}

@media screen and (max-width: 1300px) {
  // .dtc-grid {
  //   grid-template-columns: 387px 250px 130px repeat(9, 1fr);
  // }
}

.my-dark {
  >div {
    background: #e9e9e9;
    color: #2f3c62;
    font-weight: bolder;
  }
}

.icon-conent {
  display: flex !important;
  justify-content: center;
  padding: 5px 20px 0 !important;
}

.border-a {
  border: #ccc 1px solid;
}
</style>
