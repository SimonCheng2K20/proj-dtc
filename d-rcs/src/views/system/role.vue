<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">角色權限管理</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">啟用狀態</span>
          <div v-for="item of activates" :key="item.text" class="p-field-radiobutton mr-3 mt-3">
            <RadioButton :id="item.text" name="item" :value="item.value" v-model="selectedActivate" @change="getData" />
            <label :for="item.text">{{ item.text }}</label>
          </div>
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">角色代碼</span>
          <InputText type="text" v-model.trim="selectedNo" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">角色名稱</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" />
        </div>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #0c69e1"
          @click="getData"
        >
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #6a9f3e"
          @click="clearSearch"
        >
          清除
        </button>
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #fabf3e"
          @click="showEditModal(1)"
        >
          +新增角色
        </button>
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
    <main
      class="dtc-grid"
      v-for="(item, idx) in items"
      :key="`content${idx}`"
      style="color: #39312e"
      :style="idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color: #e7f2f3;'"
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #2196f3"
          @click="showEditModal(2, item)"
        >
          編輯角色
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #ff5a92"
          @click="showEditModal(3, item)"
        >
          刪除角色
        </button>
      </div>
      <div class="content" style="padding-top: 6px">
        <div class="flex justify-center">
          <InputSwitch :id="`authmana${idx}`" v-model="item.viewDetail" class="mr-1" @change="openDetail(item, idx)" />
          <label :for="`authmana${idx}`" class="cursor-pointer">授權作業</label>
        </div>
      </div>
      <div class="content" style="padding-top: 0px">
        <Checkbox :binary="true" v-model="item.IsActivated" @change="changeActivate(item)" />
      </div>
      <div class="content">
        {{ item.No || '' }}
      </div>
      <div class="content">
        {{ item.Name || '' }}
      </div>
      <div class="content">
        {{ levelItems.find((lvItem)=>lvItem.value === item.Level)?.text }}
      </div>
      <div class="modal-grid-search-2 full-content" v-if="item.viewDetail">
        <header>
          <div></div>
          <div>功能代碼</div>
          <InputText type="text" v-model.trim="item.searchDetailNo" placeholder="搜尋功能代碼" style="height: 33px" @keydown.enter="searchDetail(item, idx)" />
          <div></div>
          <div>功能名稱</div>
          <InputText
            type="text"
            v-model.trim="item.searchDetailName"
            placeholder="搜尋功能名稱"
            style="height: 33px"
            @keydown.enter="searchDetail(item, idx)"
          />
        </header>
      </div>
      <div class="view-details full-content" v-if="item.viewDetail">
        <label v-for="(row, rowId) in item.detailRowsShow" :key="`$detailRowsShow${rowId}`">
          <input
            class="mt-1 w-5 h-5 mr-2 border border-gray-300 rounded"
            type="checkbox"
            name="checkbox"
            value="value"
            @change="updateDetail(row, item, idx)"
            v-model="row.isActive"
          />

          <div>{{ row.No }}</div>
          <div>{{ row.Name }}</div></label
        >
      </div>
    </main>
    <main v-if="!items.length" class="mt-2 text-center text-xl font-semibold col-span-full" style="font-family: Microsoft JhengHei, Helvetica">No Data</main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator v-model:first="offset" v-model:rows="rows" :totalRecords="totalItemsCount" :rowsPerPageOptions="[5, 10, 50]"></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>

    <!-- //EditModal -->
    <Dialog v-model:visible="editModal" style="width: 800px" :draggable="false" :modal="true" class="custom-modal">
      <template #header>
        <h3>
          {{ nowType == 1 ? '新增角色' : nowType == 2 ? '編輯角色' : '刪除角色' }}
        </h3>
      </template>
      <section v-if="nowType == 1 || nowType == 2">
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">角色代碼</span>
          <InputText type="text" v-model.trim="modalItem.No" :disabled="nowType == 2" />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">角色名稱</span>
          <InputText type="text" v-model.trim="modalItem.Name" autofocus />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">機構層級</span>
          <Dropdown
            v-model="modalItem.Level"
            :options="levelItems"
            placeholder="選擇機構層級"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon special-addon">角色狀態</span>
          <Checkbox :binary="true" v-model="modalItem.IsActivated" style="margin-left: 8px !important; margin-top: 8px !important" />
        </div>
      </section>
      <section v-else>
        <div class="font-black">是否確定要{{ nowType == 3 ? '刪除角色' : '重置密碼' }}?</div>
        <div class="mt-3">
          {{ nowType == 3 ? '角色代碼: ' : '重置密碼為: ' }}
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

<script>
import { defineComponent, computed, ref, reactive, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import {
  getRoleList,
  putRoleList,
  postRoleList,
  deleteRoleList,
  getFunctionSelectList,
  getRoleFunctions,
  addRoleFunction,
  removeRoleFunction,
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
} from 'Service/searchFunction.js'

export default defineComponent({
  name: 'role',
  components: {},
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: '操作', key: '', sortDesc: null },
      { name: '授權作業', key: '', sortDesc: null },
      { name: '啟用', key: 'IsActivated', sortDesc: null },
      { name: '角色代碼', key: 'No', sortDesc: null },
      { name: '角色名稱', key: 'Name', sortDesc: null },
      { name: '機構層級', key: 'Level', sortDesc: null },
    ])

    const items = ref([
      // {
      //   No: "Admins",
      //   Name: "管理群",
      //   IsActivated: true,
      // },
      // {
      //   No: "qa",
      //   Name: "管理群2",
      //   IsActivated: true,
      // },
    ])

    const offset = ref(0)
    const rows = ref(10)
    const totalItemsCount = ref(1)
    const orderByArr = ref([])

    const toast = useToast()

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

        if (typeof selectedActivate.value === 'boolean') {
          qs = equalNumFilter('IsActivated', qs, selectedActivate.value)
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

        //top:筆數、skip:跳過幾筆
        const res = await getRoleList(`${qs}`)

        let { Items, Count } = res.data
        Items = Items.map((s) => {
          s.viewDetail = false
          s.detailRows = []
          s.detailRowsShow = []
          s.searchDetailNo = ''
          s.searchDetailName = ''
          return s
        })
        items.value = [...Items]
        totalItemsCount.value = Count
      } catch (e) {
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

    //for search
    const selectedActivate = ref(null)
    const selectedNo = ref('')
    const selectedName = ref('')

    const activates = ref([
      { value: true, text: '啟用' },
      { value: false, text: '已停用' },
    ])

    function clearSearch() {
      selectedActivate.value = ''
      selectedNo.value = ''
      selectedName.value = ''
      getData()
    }

    async function openDetail(item, key) {
      if (!item.viewDetail) return
      const res = await getRoleFunctions(item.No)
      const arr = allFunctionCode.map((s) => {
        s.parantNo = item.No
        s.isActive = res.data.find((k) => k == s.No) ? true : false
        return s
      })

      items.value[key].detailRows = JSON.parse(JSON.stringify(arr))
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr))
      items.value[key].searchDetailNo = ''
      items.value[key].searchDetailName = ''
    }
    async function updateDetail(item, originalitem, key) {
      const obj = {
        RoleNo: item.parantNo,
        FunctionNo: item.No,
      }

      const childIndexOf = originalitem.detailRows.findIndex((s) => s.No == item.No)

      try {
        item.isActive ? await addRoleFunction(obj) : await removeRoleFunction(obj)
        items.value[key].detailRows[childIndexOf].isActive = item.isActive

        toast.success(`${item.isActive ? '新增' : '移除'}功能成功`, {
          timeout: 2000,
          hideProgressBar: true,
        })
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }
    async function searchDetail(item, key) {
      let arr = []
      let allData = JSON.parse(JSON.stringify(item.detailRows))

      if (Boolean(item.searchDetailName)) {
        arr = allData.filter((s) => s.Name.includes(item.searchDetailName))
      }
      if (Boolean(item.searchDetailNo)) {
        arr = allData.filter((s) => s.No.includes(item.searchDetailNo))
      }
      if (!Boolean(item.searchDetailName) && !Boolean(item.searchDetailNo)) {
        arr = JSON.parse(JSON.stringify(item.detailRows))
      }
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr))
    }

    let allFunctionCode = reactive([])

    async function getAllOptions() {
      const res = await getFunctionSelectList()

      allFunctionCode = res.data
      allFunctionCode = allFunctionCode.filter((s) => s.Name !== '系統管理' && s.Name !== '統計作業' && s.Name !== '會診清單')
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
      No: '',
      Name: '',
      Level: '',
      IsActivated: true,
    })

    function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除

      if (type == 2 || type == 3) {
        modalItem.value = { ...item }
      } else {
        modalItem.value = {
          No: '',
          Name: '',
          IsActivated: true,
        }
      }
      nowType.value = type
      editModal.value = true
    }

    async function saveEditModal() {
      if (!Boolean(modalItem.value.No) || !Boolean(modalItem.value.Name)) {
        toast.error(`角色代碼和角色名稱為必填欄位`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        return
      }

      const obj = {
        No: modalItem.value.No,
        Name: modalItem.value.Name,
        IsActivated: modalItem.value.IsActivated,
      }

      try {
        // const res = await putInstitutionList(obj);
        if (nowType.value == 1) {
          const res1 = await postRoleList(obj)
        }
        if (nowType.value == 2) {
          const res2 = await putRoleList(obj)
        }
        if (nowType.value == 3) {
          const res3 = await deleteRoleList(modalItem.value.No)
        }

        toast.success(`${nowType.value == 1 ? '新增' : nowType.value == 2 ? '編輯' : nowType.value == 3 ? '刪除' : '重置密碼'}成功`, {
          timeout: 2000,
          hideProgressBar: true,
        })
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
      getData()
      editModal.value = false
    }

    async function changeActivate(item) {
      const obj = {
        No: item.No,
        Name: item.Name,
        IsActivated: item.IsActivated,
      }
      try {
        await putRoleList(obj)
        toast.success('狀態調整成功', {
          timeout: 2000,
          hideProgressBar: true,
        })
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    const levelItems = [
      {
        text: '醫療機構',
        value: 0,
      },
      {
        text: '各地衛生局',
        value: 20,
      },
      {
        text: '計畫管理者',
        value: 90,
      },
      {
        text: '系統管理群',
        value: 100,
      },
    ]

    return {
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      openDetail,
      updateDetail,
      searchDetail,

      getAllOptions,

      allFunctionCode, //functionArr

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedActivate,
      selectedNo,
      selectedName,

      activates,

      clearSearch,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      showEditModal,
      saveEditModal,

      changeActivate,
      levelItems,
    }
  },
})
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
    grid-template-columns: repeat(8, max-content);
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
  grid-template-columns: 244px 200px 200px 330px 1fr 1fr;
  // grid-auto-flow: column;
  text-align: center;
  // border-right: 0px;

  > div {
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
  > div:first-child {
    border-left: 2px solid #ffffff;
  }
  > .header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }
  > .content {
    padding: 6px;
    padding-top: 4px;
    height: 43px;
  }
  > .full-content {
    grid-column: 1 / -1;
  }
}

.my-dark {
  > div {
    background: #e9e9e9;
    color: #2f3c62;
    font-weight: bolder;
  }
}

.view-details {
  grid-column: 1 / -1;
  display: grid;
  background: #e6e6e6;
  color: white;
  min-height: 200px;
  font-size: 16px;
  margin: 8px;
  border-radius: 0px;
  text-align: left;
  line-height: 30px;
  margin-top: 0;
  overflow: auto !important;
  height: fit-content !important;

  label {
    all: unset;
  }

  label {
    display: grid;
    grid-template-columns: 90px 300px 1fr;
    background: #4e5357;
    border: none;
    border-bottom: 1px solid white;
    background: #e6e6e6;
    cursor: pointer;
    padding-left: 23px;
  }
}
.modal-grid-search-2 {
  grid-column: 1/-1;
  background: #b5b7be;
  color: white;
  font-size: 16px;
  margin: 8px;
  margin-bottom: 0;
  border-radius: 0px;
  text-align: left;
  line-height: 30px;
  overflow: hidden;

  header {
    display: grid;
    border: 1px solid white;
    border-top: none;
    border-bottom: none;
    grid-template-columns: 90px 100px 185px 15px 82px 185px;
    background: #747474;
    padding-left: 23px;
    color: #fcfdff;
  }
}
</style>
