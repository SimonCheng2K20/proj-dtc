<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">Pacs主機管理</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">主機機構</span>
          <Dropdown
            v-model="selectedInstitutionNo"
            :options="institutionNoOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="FullName"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedInstitutionNo) ? true : false"
          />
        </div>

        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">Host</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">Aet</span>
          <InputText type="text" v-model.trim="selectedAet" @keydown.enter="getData" />
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
          +新增Pacs主機
        </button>
        <Button @click.stop="exportSetting" class="p-button-danger mr-1"
          >匯出主機設定</Button
        >
      </div>
    </section>

    <header class="dtc-grid my-dark">
      <div
        v-for="(item, i) in headers"
        :key="`headers${i}`"
        @click="sortData(item)"
        class="header"
      >
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
          編輯主機
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #ff5a92"
          @click="showEditModal(3, item)"
        >
          刪除主機
        </button>
      </div>
      <div class="content" :title="item.InstitutionName">
        {{ item.InstitutionName || ""
        }}{{ item.InstitutionNo ? `【${item.InstitutionNo}】` : "" }}
      </div>
      <div class="content" :title="item.Aet">
        {{ item.Aet || "" }}
      </div>
      <div class="content" :title="item.Host">
        {{ item.Host || "" }}
      </div>
      <div class="content" :title="item.Port">
        {{ item.Port || "" }}
      </div>
      <div class="content" :title="item.TimeLimit">
        {{ item.TimeLimit || "" }}
      </div>
    </main>
    <main
      v-if="!items.length"
      class="mt-2 text-center text-xl font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica"
    >
      No Data
    </main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator
        v-model:first="offset"
        v-model:rows="rows"
        :totalRecords="totalItemsCount"
        :rowsPerPageOptions="[5, 10, 50]"
      ></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>

    <!-- //EditModal -->
    <Dialog
      v-model:visible="editModal"
      style="width: 800px"
      :draggable="false"
      :modal="true"
      class="custom-modal"
    >
      <template #header>
        <h3>
          {{
            nowType == 1 ? "新增Pacs主機" : nowType == 2 ? "編輯Pacs主機" : "刪除Pacs主機"
          }}
        </h3>
      </template>
      <section>
        <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">
          是否確定要刪除Pacs主機?
        </h2>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon red-star">主機機構</span>
          <Dropdown
            v-model="modalItem.InstitutionNo"
            :options="institutionNoOptions.slice(1)"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="FullName"
            optionValue="No"
            :filter="true"
            :disabled="nowType == 2 || nowType == 3 || !isAdminAccount"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon">AE Title</span>
          <InputText type="text" v-model.trim="modalItem.Aet" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">Host</span>
          <InputText type="text" v-model.trim="modalItem.Host" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon">Port</span>
          <InputText type="text" v-model.trim="modalItem.Port" :disabled="nowType == 3" />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon">資料撈取期限(月)</span>
          <InputText
            type="number"
            v-model.trim="modalItem.TimeLimit"
            :disabled="nowType == 3"
            :min="0"
          />
        </div>
      </section>

      <template #footer>
        <Button label="確定" @click="saveEditModal" />
        <Button label="取消" class="p-button-success" @click="editModal = false" />
      </template>
    </Dialog>
    <a id="downloadAnchorElem" style="display: none"></a>
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import {
  getPacsList,
  putPacsList,
  postPacsList,
  deletePacsList,
  getInstitutionNos,
  getPacsExport,
} from "Service/apis.js";
import buildQuery from "odata-query";
import {
  arrFilter,
  appendArrFilter,
  substringofFilter,
  appendSubstringofFilter,
  equalFilter,
  appendEqualFilter,
  equalNumFilter,
  appendEqualNumFilter,
} from "Service/searchFunction.js";
import { useStore } from "vuex";

export default defineComponent({
  name: "role",
  components: {},
  setup() {
    const store = useStore();
    const isAdminAccount = computed(() => {
      const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : [];

      return userRoles.includes("Admins");
    });
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "主機機構", key: "InstitutionNo", sortDesc: null },
      { name: "AE Title", key: "Aet", sortDesc: null },
      { name: "Host", key: "Host", sortDesc: null },
      { name: "Port", key: "Port", sortDesc: null },
      { name: "資料撈取期限(月)", key: "TimeLimit", sortDesc: null },
    ]);

    const items = ref([]);

    const offset = ref(0);
    const rows = ref(10);
    const totalItemsCount = ref(1);
    const orderByArr = ref([]);

    const toast = useToast();

    async function getData() {
      try {
        //odata3 qs
        const page = +offset.value / +rows.value + +1;
        const skip = (page - 1) * rows.value;
        const top = rows.value;
        const orderBy = orderByArr.value;

        if (
          !(
            orderByArr.value.includes("InstitutionNo") ||
            orderByArr.value.includes("InstitutionNo desc")
          )
        ) {
          orderBy.push("InstitutionNo desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedInstitutionNo.value) {
          qs = equalFilter("InstitutionNo", qs, selectedInstitutionNo.value);
          bQs = true;
        }

        if (selectedName.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Host", qs, selectedName.value.toLowerCase());
          } else {
            qs = substringofFilter("Host", qs, selectedName.value.toLowerCase());
          }
          bQs = true;
        }

        if (selectedAet.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Aet", qs, selectedAet.value.toLowerCase());
          } else {
            qs = substringofFilter("Aet", qs, selectedAet.value.toLowerCase());
          }
          bQs = true;
        }

        //top:筆數、skip:跳過幾筆
        const res = await getPacsList(`${qs}`);

        let { Items, Count } = res.data;

        items.value = [...Items];
        totalItemsCount.value = Count;
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    //sort
    function sortData(item) {
      if (!item.key) {
        return;
      }
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      orderByArr.value = [];

      headers.value.forEach((s) => {
        if (s.sortDesc !== null) {
          orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      getData();
    }

    //for search

    const selectedAet = ref("");
    const selectedName = ref("");
    const selectedInstitutionNo = ref(null);

    const institutionNoOptions = ref([]);

    async function getAllOptions() {
      try {
        let { data } = await getInstitutionNos("");
        data = data.map((s) => {
          s.FullName = `${s.Name}【${s.No}】`;
          return s;
        });
        institutionNoOptions.value = [...data];
        institutionNoOptions.value.unshift({
          No: null,
          Name: "全部",
          FullName: "全部",
        });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    function clearSearch() {
      selectedInstitutionNo.value = null;
      selectedAet.value = "";
      selectedName.value = "";
      getData();
    }

    onMounted(async () => {
      await getAllOptions();
      await getData();
    });

    watch(offset, (v, pv) => {
      getData();
    });

    watch(rows, (v, pv) => {
      getData();
    });

    //-----------editModal----------------
    const editModal = ref(false);
    const nowType = ref(1);
    const modalItem = ref({});

    function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除
      const accountInstitutionNo = store.state?.others
        ? store.state?.others.InstitutionNo
        : "";
      if (type == 2 || type == 3) {
        modalItem.value = { ...item };
      } else {
        modalItem.value = {
          InstitutionNo: isAdminAccount.value ? "" : accountInstitutionNo,
          Aet: "",
          Host: "",
          Port: "",
          TimeLimit: 1,
        };
      }
      nowType.value = type;
      editModal.value = true;
    }

    async function saveEditModal() {
      if (!Boolean(modalItem.value.InstitutionNo) || !Boolean(modalItem.value.Host)) {
        toast.error(`主機機構和Host為必填欄位`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      const obj = {
        ...modalItem.value,
      };

      try {
        // const res = await putInstitutionList(obj);
        if (nowType.value == 1) {
          const res1 = await postPacsList(obj);
        }
        if (nowType.value == 2) {
          const res2 = await putPacsList(obj);
        }
        if (nowType.value == 3) {
          // const id = `InstitutionNo(${modalItem.value.InstitutionNo}),PacsUrl(${modalItem.value.PacsUrl})`;
          const res3 = await deletePacsList(modalItem.value.Id);
        }

        toast.success(
          `${
            nowType.value == 1
              ? "新增"
              : nowType.value == 2
              ? "編輯"
              : nowType.value == 3
              ? "刪除"
              : ""
          }成功`,
          {
            timeout: 2000,
            hideProgressBar: true,
          }
        );
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
      getData();
      editModal.value = false;
    }

    const exportSetting = async () => {
      try {
        const res = await getPacsExport();
        const csvContent = "data:text/csv;charset=utf-8," + res.data;
        const encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    return {
      exportSetting,
      isAdminAccount,
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      getAllOptions,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedInstitutionNo,
      selectedAet,
      selectedName,

      institutionNoOptions,

      clearSearch,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      showEditModal,
      saveEditModal,
    };
  },
});
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
  width: 140px;
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
  grid-template-columns: 244px 400px 1fr 1fr 1fr 150px;

  text-align: center;

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
  background: #e8e8e8;
  color: white;
  min-height: 200px;
  font-size: 16px;
  margin: 8px;
  border-radius: 0px;
  text-align: left;
  line-height: 30px;
  margin-top: 0;
  overflow: auto !important;

  label {
    all: unset;
  }

  label {
    display: grid;
    grid-template-columns: 90px 300px 1fr;
    background: #4e5357;
    border: none;
    border-bottom: 1px solid white;
    background: #e8e8e8;
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
    background: #818181;
    padding-left: 23px;
    color: #fcfdff;
  }
}
</style>
