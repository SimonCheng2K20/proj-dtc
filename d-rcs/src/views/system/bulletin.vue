<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">公佈欄管理</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">主旨</span>
          <InputText
            type="text"
            v-model.trim="selectedSubject"
            @keydown.enter="getData"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">備註</span>
          <InputText
            type="text"
            v-model.trim="selectedNote"
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
          +新增公告
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
          編輯
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #fc5792"
          @click="showEditModal(3, item)"
        >
          刪除
        </button>
      </div>

      <div class="content" :title="item.Subject">
        {{ item.Subject || "" }}
      </div>
      <div class="content" :title="item.StartTime">
        {{ item.StartTime || "" }}
      </div>
      <div class="content" :title="item.EndTime">
        {{ item.EndTime || "" }}
      </div>
      <div class="content" :title="item.CreateAccountNo">
        {{ item.CreateAccountNo || "" }}
      </div>
      <div class="content" :title="item.CreateTime">
        {{ item.CreateTime || "" }}
      </div>
      <div class="content" :title="item.Note">
        {{ item.Note || "" }}
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
      style="width: 900px"
      :draggable="false"
      :modal="true"
      class="custom-modal bulletin"
      @show="clearFile"
    >
      <template #header>
        <h3>
          {{ nowType == 1 ? "新增公告" : nowType == 2 ? "編輯公告" : "刪除公告" }}
        </h3>
      </template>
      <section>
        <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">是否確定要刪除此公告?</h2>
        <ul
          class="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-2"
          id="tabs-tabFill"
        >
          <li
            class="nav-item flex-auto text-center cursor-pointer"
            @click="tabNow = '主要內容'"
          >
            <span
              class="nav-link w-full block font-medium text-md leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
              :class="tabNow == '主要內容' ? 'active' : ''"
              >主要內容</span
            >
          </li>
          <li
            class="nav-item flex-auto text-center cursor-pointer"
            @click="tabNow = '附件'"
          >
            <span
              class="nav-link w-full block font-medium text-md leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
              :class="tabNow == '附件' ? 'active' : ''"
              >附件</span
            >
          </li>
        </ul>
        <main v-show="tabNow == '主要內容'">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon red-star">主旨</span>
            <InputText
              type="text"
              v-model.trim="modalItem.Subject"
              :disabled="nowType == 3"
              class="custom-search"
              maxlength="100"
              placeholder="上限100字"
            />
          </div>
          <div class="p-inputgroup mt-2">
            <span class="p-inputgroup-addon">備註</span>
            <InputText
              type="text"
              v-model.trim="modalItem.Note"
              class="custom-search"
              :disabled="nowType == 3"
              autofocus
            />
          </div>

          <div
            class="mt-2"
            style="
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              grid-column-gap: 6px;
            "
          >
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon red-star">上線時間</span>
              <Calendar
                class="calendar"
                v-model="modalItem.StartTime"
                :showIcon="true"
                :manualInput="true"
                dateFormat="yy-mm-dd"
                :disabled="nowType == 3"
                v-date-input
              />
            </div>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon red-star">下線時間</span>
              <Calendar
                class="calendar"
                v-model="modalItem.EndTime"
                :showIcon="true"
                :manualInput="true"
                dateFormat="yy-mm-dd"
                :disabled="nowType == 3"
                v-date-input
              />
            </div>
          </div>
          <div class="p-inputgroup mt-2">
            <Editor
              class="w-full"
              v-model="modalItem.Body"
              editorStyle="height: 460px"
              :class="nowType == 3 ? 'avoid-clicks' : ''"
            />
          </div>
        </main>
        <main v-show="tabNow == '附件'" :class="nowType == 3 ? 'avoid-clicks' : ''">
          <div class="my-2 flex">
            <Button
              icon="pi pi-plus"
              label="新增附件"
              class="p-button-warning add-button"
              @click="selectFile(nowType)"
              title="新增公告時，新增附件一次可選擇多筆檔案；編輯公告時，新增附件一次僅可選擇一個檔案"
            />
            <!--<tailwind-btn
              wording="上傳"
              bgbolor="#166bde"
              @click="addBulltinAttach"
              class="mr-1 ml-1"
              :disabled="nowType != 2"
              title="僅可在編輯公告時做上傳單筆檔案用，新增公告時可直接按下確定即可完成新增公告和上傳檔案"
            />-->
            <tailwind-btn
              wording="清除"
              bgbolor="#f72222"
              @click="clearFile"
              class="ml-1 mr-2"
              v-if="(nowType===1)"
            />
            <tailwind-btn
              wording="清除"
              bgbolor="#f72222"
              @click="clearNowFile"
              class="ml-1 mr-2"
              v-if="(nowType===2)"
            />
            <div class="file" v-show="false">
              <input
                id="file-upload"
                type="file"
                @change="fileChange($event)"
                accept="image/bmp,image/x-bmp,image/jpeg,image/png,.pdf"
              />
            </div>
            <div class="files" v-show="false">
              <input
                id="files-upload"
                type="file"
                @change="fileChange($event)"
                accept="image/bmp,image/x-bmp,image/jpeg,image/png,.pdf"
                multiple
              />
            </div>
            <div class="font-normal" style="line-height: 40px" v-show="currentFileName">
              <span class="font-semibold">欲上傳的檔案:</span>
              <InputText
                placeholder="請輸入..."
                v-model.trim="currentFileName"
                v-show="currentFileName"
                style="height: 42px"
              />
            </div>
          </div>

          <div v-show="nowCurrentFiles.length">
            <span class="font-semibold">欲上傳的檔案:</span>
            <header class="dtc-grid-attach my-dark">
              <div
                v-for="(item, i) in attachsHeaders"
                :key="`headers${i}`"
                class="header"
              >
                {{ item.name }}
              </div>
            </header>
            <main
              class="dtc-grid-attach"
              v-for="(curItem, ids) in nowCurrentFilesNames"
              :key="`nowCurrentFilesNames${ids}`"
              style="color: #39312e"
              :style="
                ids % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color:#e7f2f3;'
              "
            >
              <div class="content" style="cursor: pointer; padding-top: 3px">
                <button
                  class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
                  type="button"
                  style="background: #fc5792"
                  @click="deleteSingleNowCurrentFile(ids)"
                >
                  刪除
                </button>
              </div>

              <div class="content" :title="curItem">
                <InputText
                  class="w-full"
                  v-model.trim="curItem.filename"
                  type="text"
                  placeholder="請輸入檔案名稱"
                  style="height: 34px"
                />
              </div>
            </main>
          </div>
          <span class="font-semibold" v-show="attachsArr.length">目前已上傳檔案:</span>
          <header class="dtc-grid-attach my-dark" v-show="attachsArr.length">
            <div v-for="(item, i) in attachsHeaders" :key="`headers${i}`" class="header">
              {{ item.name }}
            </div>
          </header>
          <main
            class="dtc-grid-attach"
            v-for="(item, idx) in attachsArr"
            :key="`attach${idx}`"
            style="color: #39312e"
            :style="
              idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color:#e7f2f3;'
            "
          >
            <div class="content" style="cursor: pointer; padding-top: 3px">
              <button
                class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
                type="button"
                style="background: #2a97f0"
                @click="showBulltinAttach(item.FilePath)"
              >
                檢視
              </button>
              <button
                class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
                type="button"
                style="background: #fc5792"
                @click="deleteBulltinAttach(item.Id, idx)"
              >
                刪除
              </button>
            </div>

            <div class="content" :title="item.FileName">
              {{ item.FileName || "" }}
            </div>
          </main>
        </main>
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
import dayjs from "dayjs";
import {
  getNotice,
  deleteNotice,
  postNotice,
  putNotice,
  postNoticeAttach,
  deleteNoticeAttach,
  getNoticeById,
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

export default defineComponent({
  name: "function",
  components: {},
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "主旨", key: "Subject", sortDesc: null },
      { name: "上線時間", key: "StartTime", sortDesc: null },
      { name: "下線時間", key: "EndTime", sortDesc: null },
      { name: "建立人", key: "CreateAccountNo", sortDesc: null },
      { name: "建立時間", key: "CreateTime", sortDesc: null },
      { name: "備註", key: "Note", sortDesc: null },
    ]);

    const items = ref([{}]);

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
            orderByArr.value.includes("CreateTime") ||
            orderByArr.value.includes("CreateTime desc")
          )
        ) {
          orderBy.push("CreateTime desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedSubject.value) {
          qs = substringofFilter("Subject", qs, selectedSubject.value.toLowerCase());
          bQs = true;
        }

        if (selectedNote.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Note", qs, selectedNote.value.toLowerCase());
          } else {
            qs = substringofFilter("Note", qs, selectedNote.value.toLowerCase());
          }
          bQs = true;
        }

        //top:筆數、skip:跳過幾筆

        const res = await getNotice(`${qs}`);
        let { Items, Count } = res.data;
        Items = Items.map((s) => {
          s.CreateTime = s.CreateTime ? dayjs(s.CreateTime).format("YYYY-MM-DD") : "";
          s.StartTime = s.StartTime ? dayjs(s.StartTime).format("YYYY-MM-DD") : "";
          s.EndTime = s.EndTime ? dayjs(s.EndTime).format("YYYY-MM-DD") : "";

          return s;
        });

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
    const selectedSubject = ref("");
    const selectedNote = ref("");

    function clearSearch() {
      selectedSubject.value = "";
      selectedNote.value = "";

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

    //uploadfile -- one file
    const currentFile = ref("");
    const currentFileName = ref("");

    const nowCurrentFiles = ref([]);
    const nowCurrentFilesNames = ref([]);

    const attachsHeaders = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "檔案", key: "", sortDesc: null },
    ]);
    const attachsArr = ref([]);

    const clearFile = () => {
      //put the file in it
      currentFile.value = "";
      currentFileName.value = "";

      document.getElementById("file-upload").value = "";

      nowCurrentFiles.value = [];
      nowCurrentFilesNames.value = [];
      document.getElementById("files-upload").value = "";
    };
    const selectFile = (type) => {
      if (+type == 1) {
        document.getElementById("files-upload").click();
      } else {
        document.getElementById("file-upload").click();
      }
    };

    const fileChange = async (e) => {
      if (nowType.value == 1) {
        if (!e.target.files.length) {
          return;
        }
        nowCurrentFiles.value = [...e.target.files];
        nowCurrentFilesNames.value = nowCurrentFiles.value.map((s) => ({
          filename: s.name.split(".")[0],
        }));
        // console.log("nowCurrentFilesNames.value", nowCurrentFilesNames.value);
      } else {
        currentFile.value = e.target.files[0];
        currentFileName.value = Boolean(e.target.files[0])
          ? e.target.files[0].name.split(".")[0]
          : "";

        await addBulltinAttach()
      }
    };
    const deleteSingleNowCurrentFile = (key) => {
      nowCurrentFiles.value.splice(key, 1);
      nowCurrentFilesNames.value.splice(key, 1);
    };

    const addBulltinAttach = async () => {
      if (!Boolean(currentFileName.value)) {
        toast.error("請先選擇檔案", {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      let form = new FormData();
      form.append("NoticeId", modalItem.value.Id);
      form.append("FileName", "" + currentFileName.value);
      form.append("File", currentFile.value);

      try {
        const res = await postNoticeAttach(form);
        toast.success(`上傳附件成功`, {
          timeout: 2000,
          hideProgressBar: true,
        });
        let { data } = await getNoticeById(modalItem.value.Id);
        attachsArr.value = data?.NoticeAttaches || [];
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
      clearFile();
    };
    const deleteBulltinAttach = async (id, arrid) => {
      try {
        await deleteNoticeAttach(id);
        toast.success(`刪除附件成功`, {
          timeout: 2000,
          hideProgressBar: true,
        });
        attachsArr.value.splice(arrid, 1);
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };
    const clearNowFile=async()=> {
      for(let index in attachsArr.value) {
        await deleteNoticeAttach(attachsArr.value[index].Id);
      }
      let { data } = await getNoticeById(modalItem.value.Id);
      attachsArr.value = data?.NoticeAttaches || [];
    }
    const showBulltinAttach = async (path) => {
      window.open(path);
    };

    //-----------editModal----------------

    const tabNow = ref("主要內容");
    const editModal = ref(false);
    const nowType = ref(1);
    const modalItem = ref({});

    async function showEditModal(type, item) {
      tabNow.value = "主要內容";
      //type- 1新增、2編輯、3刪除
      if (type == 1) {
        modalItem.value = {};
        attachsArr.value = [];
      } else if (type == 2) {
        let { data } = await getNoticeById(item.Id);
        data.StartTime = data.StartTime ? dayjs(data.StartTime).format("YYYY-MM-DD") : "";
        data.EndTime = data.EndTime ? dayjs(data.EndTime).format("YYYY-MM-DD") : "";

        modalItem.value = { ...data };
        attachsArr.value = data?.NoticeAttaches || [];
      } else {
        modalItem.value = { ...item };
      }
      nowType.value = type;
      editModal.value = true;
    }

    async function saveEditModal() {
      if (!modalItem.value.Subject) {
        toast.error(`主旨為必填內容`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }
      if (!modalItem.value.StartTime) {
        toast.error(`上線時間為必填內容`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }
      if (!modalItem.value.EndTime) {
        toast.error(`下線時間為必填內容`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      const obj = {
        ...modalItem.value,
      };

      if (Boolean(obj.StartTime)) {
        obj.StartTime = dayjs(obj.StartTime).format("YYYY-MM-DD");
      }
      if (Boolean(obj.EndTime)) {
        obj.EndTime = dayjs(obj.EndTime).format("YYYY-MM-DD");
      }

      let form = new FormData();
      if (nowType.value == 1) {
        const fileName = nowCurrentFilesNames.value.map((s) => `${s.filename}`).join(",");

        form.append("Subject", obj.Subject);
        form.append("Note", obj.Note || '');
        form.append("StartTime", obj.StartTime || null);
        form.append("EndTime", obj.EndTime || null);

        form.append("Body", obj.Body || null);

        form.append("FileNames", "" + fileName);
        nowCurrentFiles.value.forEach(function (item) {
          form.append("Files", item);
        });
      }

      try {
        if (nowType.value == 1) {
          const res1 = await postNotice(form);
        }
        if (nowType.value == 2) {
          const res2 = await putNotice(obj);
        }
        if (nowType.value == 3) {
          const res3 = await deleteNotice(modalItem.value.Id);
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
      selectedSubject,
      selectedNote,

      clearSearch,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      showEditModal,
      saveEditModal,

      currentFile,
      currentFileName, // for put-- only can upload one file

      nowCurrentFiles,
      nowCurrentFilesNames,

      attachsHeaders,
      attachsArr,

      clearFile,
      clearNowFile,
      selectFile,
      fileChange,
      deleteSingleNowCurrentFile,

      tabNow,
      addBulltinAttach,
      deleteBulltinAttach,
      showBulltinAttach,
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
  width: 110px;
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
.dtc-grid,
.dtc-grid-attach {
  display: grid;
  grid-template-columns: 168px 500px 150px 150px 150px 160px 1fr;
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
.dtc-grid-attach {
  grid-template-columns: 240px 1fr;
}

.my-dark {
  > div {
    background: #e9e9e9;
    color: #f3f3f3;
    font-weight: bolder;
  }
}
.p-editor-container {
  width: 100%;
}
.nav-tabs .nav-link.active {
  color: #2563eb;
  border-color: #2563eb;
}
</style>
<style>
.bulletin.p-dialog .p-dialog-content {
  background-color: #f5f5f5;
  padding: 0.75rem;
  min-height: 78vh;
}
</style>
