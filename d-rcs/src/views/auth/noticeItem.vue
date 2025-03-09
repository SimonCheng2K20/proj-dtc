<template>
  <Dialog
    v-model:visible="noticeItemModal"
    class="custom-modal2 noticeItemModal"
    :draggable="false"
    :modal="true"
    style="width: 60vw"
    @show="setData"
  >
    <template #header>
      <h3>{{ noticeItemData.Subject || "" }}</h3>
    </template>
    <ul
      class="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-2"
      id="tabs-tabFill"
    >
      <li
        class="nav-item flex-auto text-center cursor-pointer"
        @click="tabNow = '公告內文'"
      >
        <span
          class="nav-link w-full block font-medium text-md leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
          :class="tabNow == '公告內文' ? 'active' : ''"
          >公告內文</span
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

    <div
      class="notic-main-content"
      v-html="noticeItemData.Body"
      v-show="tabNow == '公告內文'"
    ></div>
    <header class="dtc-grid-attach my-dark" v-show="tabNow == '附件'">
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
      v-for="(item, idx) in attachsArr"
      :key="`attach${idx}`"
      style="color: #39312e"
      :style="
        idx % 2 == 0
          ? 'background-color:#ffffff ;'
          : 'background-color:#e7f2f3;'
      "
      v-show="tabNow == '附件'"
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #353bac"
          @click="showBulltinAttach(item.FilePath)"
        >
          檢視
        </button>
      </div>

      <div class="content" :title="item.FileName">
        {{ item.FileName || "" }}
      </div>
    </main>

    <template #footer>
      <Button class="p-button-success" @click.stop="noticeItemModal = flase"
        >關閉</Button
      >
    </template>
  </Dialog>
</template>

<script>
import { getActiveNotice } from "Service/apis.js";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import dayjs from "dayjs";
export default {
  props: {
    noticeItemData: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const toast = useToast();
    const tabNow = ref("公告內文");
    const noticeItemModal = ref(false);

    const attachsHeaders = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "檔案", key: "", sortDesc: null },
    ]);
    const attachsArr = ref([]);

    const setData = async () => {
      tabNow.value = "公告內文";
      attachsArr.value = [...props.noticeItemData?.NoticeAttaches];
    };
    const showBulltinAttach = async (path) => {
      window.open(path);
    };

    return {
      noticeItemModal,
      setData,
      tabNow,
      attachsHeaders,
      attachsArr,
      showBulltinAttach,
    };
  },
};
</script>

<style lang="scss" scoped>
.notices {
  width: 560px;
  .title {
    @apply text-3xl font-bold border-b-2 pl-8 mb-3;
    color: #0f2974;
    border-color: #0f2974;
  }
}
.message {
  @apply grid py-2;
  border-top: 1px solid #c6cbdf;
  grid-template-columns: 107px 1fr;
  &:nth-child(1) {
    border-top: none;
  }
  div:nth-child(1) {
    color: #0b3ae6;
  }
  div:nth-child(2) {
    color: #0f2974;
  }
}
.nav-tabs .nav-link.active {
  color: #2563eb;
  border-color: #2563eb;
}

.dtc-grid-attach {
  display: grid;
  grid-template-columns: 240px 1fr;
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
    color: #f3f3f3;
    font-weight: bolder;
  }
}
.notic-main-content {
  background-color: rgb(255, 255, 255);

  min-height: calc(100vh - 307px);
  padding: 12px;
  border: 1px solid rgb(190, 190, 190);
}
</style>
<style>
.noticeItemModal.p-dialog .p-dialog-content {
  background-color: #f5f5f5;
  padding: 0.75rem;
  min-height: 78vh;
}
</style>
