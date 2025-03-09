<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">機構單位維護</h5>
      <div class="p-2 search-section" :style="!isAdminAccount ? 'grid-template-columns: repeat(1, 290px) repeat(8, max-content);' : ''">
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">單位名稱</span>
          <Dropdown
            v-model="selectedName"
            :options="allUnitOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="Name"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedName) ? true : false"
          />
          <!-- <InputText
            type="text"
            v-model.trim="selectedName"
            @keydown.enter="getData"
            placeholder="輸入單位名稱"
          /> -->
        </div>
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">單位代碼</span>
          <Dropdown
            v-model="selectedNo"
            :options="allUnitOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="No"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedNo) ? true : false"
          />
          <!-- <InputText
            type="text"
            v-model.trim="selectedNo"
            @keydown.enter="getData"
            placeholder="輸入單位代碼"
          /> -->
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">啟用狀態</span>
          <div v-for="item of activates" :key="item.text" class="p-field-radiobutton mr-3 mt-3">
            <RadioButton :id="item.text" name="item" :value="item.value" v-model="selectedActivate" @change="getData" />
            <label :for="item.text">{{ item.text }}</label>
          </div>
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
          +新增機構
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
          編輯
        </button>

        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #ff5a92"
          @click="showEditModal(3, item)"
        >
          刪除
        </button>
      </div>
      <div class="content" style="padding-top: 6px">
        <Checkbox :binary="true" v-model="item.IsActivated" @change="changeActivate(item)" />
      </div>
      <div class="content" style="padding-top: 6px">
        <Checkbox :binary="true" v-model="item.IsAirReferralUser" @change="changeActivate(item)" />
      </div>
      <div class="content" style="padding-top: 6px">
        <div class="flex justify-center" v-if="!item.Name.includes('醫院') && item.Level != 0">
          <InputSwitch :id="`authmana${idx}`" v-model="item.viewDetail" class="mr-1" @change="openDetail(item, idx)" />
          <label class="cursor-pointer" :for="`authmana${idx}`">可檢視網絡</label>
        </div>
        <div v-else>
          {{ '' }}
        </div>
      </div>
      <div class="content" :title="item.No">
        {{ item.No || '' }}
      </div>
      <div class="content" :title="item.Name">
        {{ item.Name || '' }}
      </div>
      <div class="content" :title="item.ShortName">
        {{ item.ShortName || '' }}
      </div>
      <div class="content" :title="item.levelName">
        {{ item.levelName || '' }}
      </div>
      <div class="content" :title="item.Area">
        {{ item.Area || '' }}
      </div>

      <div class="modal-grid-search-2 full-content" v-if="item.viewDetail">
        <header>
          <div></div>
          <div>網絡</div>
          <InputText
            type="text"
            v-model.trim="item.searchDetailGroupName"
            placeholder="搜尋網絡"
            style="height: 33px"
            @keydown.enter="searchDetail(item, idx)"
          />
          <div></div>
          <div>急診醫療站</div>
          <InputText
            type="text"
            v-model.trim="item.searchDetailStations"
            placeholder="搜尋急診醫療站"
            style="height: 33px"
            @keydown.enter="searchDetail(item, idx)"
          />
        </header>
      </div>
      <div class="view-details full-content" v-if="item.viewDetail">
        <!-- {{ item.detailRowsShow }} -->
        <label v-for="(row, rowId) in item.detailRowsShow" :key="`$detailRowsShow${rowId}`">
          <input
            class="mt-1 w-5 h-5 mr-2 border border-gray-300 rounded"
            type="checkbox"
            name="checkbox"
            value="value"
            @change="updateDetail(row, item, idx)"
            v-model="row.isActive"
          />

          <div :title="row.Name">{{ row.Name }}</div>
          <div :title="row.stationsName">{{ row.stationsName }}</div>
        </label>
      </div>
    </main>
    <main v-if="!items.length" class="mt-2 text-center text-xl font-semibold col-span-full" style="font-family: Microsoft JhengHei, Helvetica">No Data</main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator v-model:first="offset" v-model:rows="rows" :totalRecords="totalItemsCount" :rowsPerPageOptions="[5, 10, 50]"></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>

    <!-- //EditModal -->
    <Dialog class="custom-modal" v-model:visible="editModal" style="width: 1200px" :modal="true" :draggable="false">
      <template #header>
        <h3>{{ nowType == 1 ? '新增' : nowType == 2 ? '編輯' : '刪除' }}機構單位</h3>
      </template>
      <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">是否確定要刪除此機構單位?</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon red-star">機構單位代碼</span>
          <InputText type="text" v-model.trim="modalItem.No" maxlength="10" placeholder="最多10碼" :disabled="nowType != 1" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">機構單位名稱</span>
          <InputText type="text" v-model.trim="modalItem.Name" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">機構單位簡稱</span>
          <InputText type="text" v-model.trim="modalItem.ShortName" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">縣市別</span>
          <Dropdown
            v-model="modalItem.Area"
            :options="areaArr"
            placeholder="選擇縣市別"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            :disabled="nowType == 3"
            :filter="true"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon red-star">單位層級</span>
          <Dropdown
            v-model="modalItem.Level"
            :options="levelArr"
            placeholder="選擇單位層級"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">電話</span>
          <InputText type="text" v-model.trim="modalItem.Tel" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">傳真</span>
          <InputText type="text" v-model.trim="modalItem.Fax" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">E-mail</span>
          <InputText type="text" v-model.trim="modalItem.EMail" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup col-span-full">
          <span class="p-inputgroup-addon">地址</span>
          <InputText type="text" v-model.trim="modalItem.Address" :disabled="nowType == 3" />
        </div>
        <!-- <div class="p-inputgroup col-span-full">
          <span class="p-inputgroup-addon">醫院 HIS 介接程式庫路徑</span>
          <InputText
            type="text"
            v-model.trim="modalItem.HisSyncPluginPath"
            :disabled="nowType == 3"
          />
        </div> -->

        <div class="p-inputgroup">
          <span class="p-inputgroup-addon special-addon">是否啟用</span>
          <InputSwitch v-model="modalItem.IsActivated" :disabled="nowType == 3" style="margin-left: 8px !important; margin-top: 8px !important" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon special-addon">是否空轉使用者</span>
          <InputSwitch v-model="modalItem.IsAirReferralUser" :disabled="nowType == 3" style="margin-left: 8px !important; margin-top: 8px !important" />
        </div>

        <div class="p-inputgroup">
          <span class="p-inputgroup-addon special-addon">影像委外判讀</span>
          <InputSwitch v-model="modalItem.IsOutsideReading" :disabled="nowType == 3" style="margin-left: 8px !important; margin-top: 8px !important" />
        </div>
      </div>
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
  getInstitutionList,
  putInstitutionList,
  postInstitutionList,
  deleteInstitutionList,
  getInstitutionGroups,
  addInstitutionGroup,
  removeInstitutionGroup,
  getNetGroup,
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
import { levelArr, areaArr } from 'Service/constants.js'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'DefaultLayout',
  components: {},
  setup() {
    const store = useStore()
    const isAdminAccount = computed(() => {
      const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : []

      return userRoles.includes('Admins')
    })
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: '操作', key: '', sortDesc: null },
      { name: '啟用', key: 'IsActivated', sortDesc: null },
      { name: '空轉使用者', key: '', sortDesc: null },
      { name: '可檢視網絡', key: '', sortDesc: null },
      { name: '單位代碼', key: 'No', sortDesc: null },
      { name: '單位名稱', key: 'Name', sortDesc: null },
      { name: '單位簡稱', key: 'ShortName', sortDesc: null },
      { name: '單位層級', key: 'Level', sortDesc: null },
      { name: '縣市別', key: 'Area', sortDesc: null },
    ])

    const items = ref([])

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

        if (selectedName.value) {
          qs = substringofFilter('Name', qs, selectedName.value)
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

        if (typeof selectedActivate.value === 'boolean') {
          if (bQs) {
            qs = appendEqualNumFilter('IsActivated', qs, selectedActivate.value)
          } else {
            qs = equalNumFilter('IsActivated', qs, selectedActivate.value)
          }
          bQs = true
        }

        //top:筆數、skip:跳過幾筆
        const res = await getInstitutionList(`${qs}`)

        let { Items, Count } = res.data
        Items = Items.map((s) => {
          s.levelName = levelArr.find((k) => k.value == s.Level) ? levelArr.find((k) => k.value == s.Level).text : ''
          s.viewDetail = false
          s.detailRows = []
          s.detailRowsShow = []
          s.searchDetailGroupName = ''
          s.searchDetailStations = ''

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

    //for search
    const selectedName = ref('')
    const selectedNo = ref('')
    const selectedActivate = ref('')

    const activates = ref([
      { value: true, text: '啟用' },
      { value: false, text: '已停用' },
    ])

    function clearSearch() {
      selectedName.value = ''
      selectedNo.value = ''
      selectedActivate.value = ''
      getData()
    }

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
      IsActivated: true,
      IsAirReferralUser: true,
      ShortName: '',
      Level: 0,
      Tel: '',
      Fox: '',
      EMail: '',
      Address: '',
      Area: '',
      HisSyncPluginPath: '',
      IsOutsideReading: null,
    })

    async function changeActivate(item) {
      const obj = {
        No: item.No,
        Name: item.Name,
        IsActivated: item.IsActivated,
        IsAirReferralUser: item.IsAirReferralUser,
        ShortName: item.ShortName,
        Level: item.Level,
        Tel: item.Tel,
        Fox: item.Fox,
        EMail: item.EMail,
        Address: item.Address,
        Area: item.Area,
        HisSyncPluginPath: item.HisSyncPluginPath,
      }
      try {
        await putInstitutionList(obj)
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

    function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除

      if (type == 2 || type == 3) {
        modalItem.value = { ...item }
      } else {
        modalItem.value = {
          No: '',
          Name: '',
          IsActivated: true,
          IsAirReferralUser: true,
          ShortName: '',
          Level: 0,
          Tel: '',
          Fox: '',
          EMail: '',
          Address: '',
          Area: '',
          HisSyncPluginPath: '',
        }
      }
      nowType.value = type
      editModal.value = true
    }

    async function saveEditModal() {
      const _columnObj = {
        No: '機構單位代碼',
      }

      const _invalidKeys = Object.keys(_columnObj)

      const isEmpty = (key) => !Boolean(modalItem.value[key])

      const check = _invalidKeys.some(isEmpty)

      if (check) {
        const _invalidValues = _invalidKeys.filter((key) => !Boolean(modalItem.value[key])).map((key) => _columnObj[key])
        toast.error(`${_invalidValues.join(',')}為必填欄位`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        return
      }

      if (!modalItem.value.Level && modalItem.value.Level != 0) {
        toast.error(`單位層級為必填欄位`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        return
      }

      const obj = {
        ...modalItem.value,
      }

      delete obj.detailRows
      delete obj.detailRowsShow
      delete obj.levelName
      delete obj.searchDetailGroupName
      delete obj.searchDetailStations
      delete obj.viewDetail

      delete obj.Identities
      delete obj.PartnerHospitals
      delete obj.ResponsibilityHospitals

      try {
        if (nowType.value == 1) {
          const res0 = await postInstitutionList(obj)
        }
        if (nowType.value == 2) {
          const res = await putInstitutionList(obj)
        }
        if (nowType.value == 3) {
          const res3 = await deleteInstitutionList(modalItem.value.No)
        }

        toast.success(`${nowType.value == 1 ? '新增' : nowType.value == 2 ? '編輯' : '刪除'}成功`, {
          timeout: 2000,
          hideProgressBar: true,
        })
      } catch (e) {
        console.log(e)
        toast.error(`${e.data ? e.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }

      getData()
      getAllInstitutions()
      editModal.value = false
    }

    //detail
    const allGroupCode = ref([])

    const getAllOptions = async () => {
      const res = await getNetGroup('')
      let { Items } = res.data
      Items = Items.map((s) => {
        s.stationsName = s.Stations.length ? s.Stations.map((k) => `【${k.No}】${k.Name}`).join('、') : ''
        return s
      })

      allGroupCode.value = Items
    }

    const openDetail = async (item, key) => {
      if (!item.viewDetail) return
      const res = await getInstitutionGroups(item.No)
      const arr = allGroupCode.value.map((s) => {
        s.parantNo = item.No
        s.isActive = res.data.find((k) => k == s.Id) ? true : false
        return s
      })

      items.value[key].detailRows = JSON.parse(JSON.stringify(arr))
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr))
      items.value[key].searchDetailGroupName = ''
      items.value[key].searchDetailStations = ''
    }

    const updateDetail = async (item, originalitem, key) => {
      const obj = {
        InstitutionNo: item.parantNo,
        NetGroupId: item.Id,
      }

      const childIndexOf = originalitem.detailRows.findIndex((s) => s.Id == item.Id)

      try {
        item.isActive ? await addInstitutionGroup(obj) : await removeInstitutionGroup(obj)
        items.value[key].detailRows[childIndexOf].isActive = item.isActive

        toast.success(`${item.isActive ? '新增' : '移除'}網絡成功`, {
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

    const searchDetail = async (item, key) => {
      let arr = []
      let allData = JSON.parse(JSON.stringify(item.detailRows))

      if (Boolean(item.searchDetailStations)) {
        arr = allData.filter((s) => s.stationsName.includes(item.searchDetailStations))
      }
      if (Boolean(item.searchDetailGroupName)) {
        arr = allData.filter((s) => s.Name.includes(item.searchDetailGroupName))
      }
      if (!Boolean(item.searchDetailStations) && !Boolean(item.searchDetailGroupName)) {
        arr = JSON.parse(JSON.stringify(item.detailRows))
      }
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr))
    }

    const allUnitOptions = ref([])

    const getAllInstitutions = async () => {
      try {
        const res = await getInstitutionList('')
        let { Items, Count } = res.data

        allUnitOptions.value = [...Items]
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    onMounted(async () => {
      await getAllOptions()
      await getAllInstitutions()
      await getData()
    })

    return {
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      //Detail
      openDetail,
      updateDetail,
      searchDetail,

      getAllOptions,
      allGroupCode,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedName,
      selectedNo,
      selectedActivate,

      activates,

      clearSearch,

      levelArr,
      areaArr,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      changeActivate,
      showEditModal,
      saveEditModal,

      isAdminAccount,

      allUnitOptions,

      getAllInstitutions,
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
    border-radius: 6px 6px 0 0;
    font-size: 20px;
    font-weight: bold;
  }

  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 8px 8px 0 0;

  .search-section {
    display: grid;
    grid-template-columns: 370px 303px 290px repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 145px;
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
  grid-template-columns: 168px 97px 110px 165px 140px 400px repeat(3, 1fr);
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
    grid-template-columns: 88px 313px 1fr;
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
    grid-template-columns: 90px 91px 210px 18px 90px 185px;
    background: #747474;
    padding-left: 23px;
    color: #fcfdff;
  }
}
</style>
