<template>
  <Dialog
    v-model:visible="moreItemsModal"
    class="custom-modal moreItemsModal"
    :draggable="false"
    :modal="true"
    style="width: 60vw"
    @show="setData"
  >
    <template #header>
      <h3>全部公告</h3>
    </template>

    <header class="dtc-grid-more my-dark">
      <div v-for="(item, i) in headers" :key="`headers${i}`" class="header">
        {{ item.name }}
      </div>
    </header>
    <main
      class="dtc-grid-more"
      v-for="(item, idx) in items"
      :key="`attach${idx}`"
      style="color: #39312e"
      :style="
        idx % 2 == 0
          ? 'background-color:#ffffff ;'
          : 'background-color:#e7f2f3;'
      "
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #353bac"
          @click="openModal(item)"
        >
          檢視
        </button>
      </div>
      <div class="content" :title="item.CreateTime">
        {{ item.CreateTime || "" }}
      </div>

      <div class="content" :title="item.Subject">
        {{ item.Subject || "" }}
      </div>
    </main>

    <template #footer>
      <Button class="p-button-success" @click.stop="moreItemsModal = flase"
        >關閉</Button
      >
    </template>
    <noticeItem
      ref="noticeItemComp"
      :noticeItemData="noticeItemData"
    ></noticeItem>
  </Dialog>
</template>

<script>
import { getActiveNotice } from "Service/apis.js";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import dayjs from "dayjs";
import noticeItem from "./noticeItem.vue";
import { getNoticeById } from "Service/apis.js";
export default {
  props: {
    allMessages: {
      type: Array,
      default: () => [],
    },
  },
  components: { noticeItem },
  setup(props, { emit }) {
    const toast = useToast();
    const noticeItemComp = ref(null);
    const moreItemsModal = ref(false);
    const noticeItemData = ref({});

    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "公告時間", key: "", sortDesc: null },
      { name: "主旨", key: "", sortDesc: null },
    ]);
    const items = ref([]);

    const setData = async () => {
      items.value = [...props.allMessages];
    };
    const openModal = async (item) => {
      let { data } = await getNoticeById(item.Id);
      noticeItemData.value = { ...data };
      noticeItemComp.value.noticeItemModal = true;
    };

    return {
      moreItemsModal,
      setData,

      headers,
      items,

      noticeItemComp,
      noticeItemData,
      openModal,
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

.dtc-grid-more {
  display: grid;
  grid-template-columns: 120px 130px 1fr;
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
.moreItemsModal.p-dialog .p-dialog-content {
  background-color: #f5f5f5;
  padding: 0.75rem;
  min-height: 78vh;
}
</style>
