<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">常見問題管理</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">常見問題分類</span>
          <InputText
            type="text"
            v-model.trim="selectedCategory"
            @keydown.enter="getData"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">問題說明</span>
          <InputText
            type="text"
            v-model.trim="selectedQuestion"
            @keydown.enter="getData"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">回覆說明</span>
          <InputText
            type="text"
            v-model.trim="selectedReply"
            @keydown.enter="getData"
            class="custom-search"
          />
        </div>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #0c69e1"
          @click="getData"
        >
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #6a9f3e"
          @click="clearSearch"
        >
          清除
        </button>
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #f9be4a"
          @click="showEditModal(1)"
        >
          +新增問題
        </button>
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
      :style="idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color:#e7f2f3;'"
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #2a97f0"
          @click="showEditModal(2, item)"
        >
          編輯問題
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #fc5792"
          @click="showEditModal(3, item)"
        >
          刪除問題
        </button>
      </div>

      <div class="content" :title="item.Category">
        {{ item.Category || "" }}
      </div>
      <div class="content" :title="item.Question">
        {{ item.Question || "" }}
      </div>
      <div class="content" :title="item.Reply">
        {{ item.Reply || "" }}
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
          {{ nowType == 1 ? "新增問題" : nowType == 2 ? "編輯問題" : "刪除問題" }}
        </h3>
      </template>
      <section>
        <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">是否確定要刪除此問題?</h2>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">問題分類</span>
          <InputText
            type="text"
            v-model.trim="modalItem.Category"
            :disabled="nowType == 3"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">問題說明</span>

          <Textareaprime
            class="w-full rounded-t-none"
            v-model="modalItem.Question"
            maxlength="100"
            placeholder="字數上限: 100字"
            :autoResize="true"
            rows="3"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">回覆說明</span>
          <Textareaprime
            class="w-full rounded-t-none"
            v-model="modalItem.Reply"
            maxlength="300"
            placeholder="字數上限: 300字"
            :autoResize="true"
            rows="3"
            :disabled="nowType == 3"
          />
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
import { defineComponent, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { getQuestion, deleteQuestion, postQuestion, putQuestion } from "Service/apis.js";
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

export default defineComponent({
  name: "function",
  components: {},
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "問題分類", key: "Category", sortDesc: null },
      { name: "問題說明", key: "Question", sortDesc: null },
      { name: "回覆說明", key: "Reply", sortDesc: null },
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
        let orderBy = orderByArr.value;

        if (!(orderBy.includes("Category") || orderBy.includes("Category desc"))) {
          orderBy.unshift("Category desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedReply.value) {
          qs = substringofFilter("Reply", qs, selectedReply.value);
          bQs = true;
        }

        if (selectedCategory.value) {
          if (bQs) {
            qs = appendSubstringofFilter(
              "Category",
              qs,
              selectedCategory.value.toLowerCase()
            );
          } else {
            qs = substringofFilter("Category", qs, selectedCategory.value.toLowerCase());
          }
          bQs = true;
        }

        if (selectedQuestion.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Question", qs, selectedQuestion.value);
          } else {
            qs = substringofFilter("Question", qs, selectedQuestion.value);
          }
          bQs = true;
        }

        //top:筆數、skip:跳過幾筆

        const res = await getQuestion(`${qs}`);
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
    const selectedReply = ref(null);
    const selectedCategory = ref("");
    const selectedQuestion = ref("");

    function clearSearch() {
      selectedReply.value = "";
      selectedCategory.value = "";
      selectedQuestion.value = "";
      getData();
    }

    onMounted(async () => {
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
    const modalItem = ref({
      Category: "",
      Question: "",
      Answer: "",
    });

    function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除

      if (type == 2 || type == 3) {
        modalItem.value = { ...item };
      } else {
        modalItem.value = {
          Category: "",
          Question: "",
          Reply: "",
        };
      }
      nowType.value = type;
      editModal.value = true;
    }

    async function saveEditModal() {
      const obj = {
        Id: modalItem.value.Id,
        Category: modalItem.value.Category,
        Question: modalItem.value.Question,
        Reply: modalItem.value.Reply,
      };

      try {
        // const res = await putInstitutionList(obj);
        if (nowType.value == 1) {
          delete obj["Id"];
          const res1 = await postQuestion(obj);
        }
        if (nowType.value == 2) {
          const res2 = await putQuestion(obj);
        }
        if (nowType.value == 3) {
          const res3 = await deleteQuestion(modalItem.value.Id);
        }

        toast.success(
          `${nowType.value == 1 ? "新增" : nowType.value == 2 ? "編輯" : "刪除"}成功`,
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

    return {
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedReply,
      selectedCategory,
      selectedQuestion,

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
    background: #e1e8f5;
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
  width: 135px;
  background: #f1f9e7;
  color: #1f2d56;
  font-weight: bold;
  border: 0px !important;
}
.special-addon {
  border-right: 0.5px solid #dbdcdd;
}
.custom-search {
  // height: 42px;
}
.p-dropdown {
  line-height: 12px;
}
.dtc-grid {
  display: grid;
  grid-template-columns: 240px 220px 1fr 1fr;
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
    color: #f3f3f3;
    font-weight: bolder;
  }
}
</style>
