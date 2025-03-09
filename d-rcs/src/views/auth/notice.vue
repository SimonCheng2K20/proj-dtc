<template>
  <div class="notices">
    <div class="title flex pb-2">
      <img class="mr-2" src="/assets/dot-notice-title.png" />
      <span @click="showData">公告訊息</span>
      <button
        type="button"
        class="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-2 py-0 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 title-btn"
        style="height: 28px"
        @click="showMoreModal"
      >
        More..
      </button>
    </div>
    <div class="messages">
      <div
        class="message cursor-pointer"
        v-for="msg in messages"
        :key="msg.date"
        @click="openModal(msg)"
        :title="msg.Subject"
      >
        <div class="createTime" v-text="msg.CreateTime" />
        <div class="subject" v-text="msg.Subject" />
      </div>
    </div>
    <noticeItem
      ref="noticeItemComp"
      :noticeItemData="noticeItemData"
    ></noticeItem>
    <moreItems ref="moreItemsComp" :allMessages="allMessages"></moreItems>
  </div>
</template>

<script>
import { getActiveNotice, getNoticeById } from 'Service/apis.js';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';
import noticeItem from './noticeItem.vue';
import moreItems from './moreItems.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  components: { noticeItem, moreItems },
  setup() {
    const store = useStore();
    const toast = useToast();
    const messages = ref([]);
    const allMessages = ref([]);
    const noticeItemComp = ref(null);
    const noticeItemData = ref({});
    const moreItemsComp = ref(null);

    const router = useRouter();
    const route = useRoute();

    const getData = async () => {
      try {
        const res = await getActiveNotice('');
        let { Items, Count } = res.data;
        Items = Items.map((s) => {
          s.CreateTime = s.CreateTime
            ? dayjs(s.CreateTime).format('YYYY/MM/DD')
            : '';
          return s;
        });
        Items.sort((a, b) => {
          if (a.CreateTime > b.CreateTime) return -1;
          if (a.CreateTime < b.CreateTime) return 1;
        });
        allMessages.value = [...Items];
        if (Items.length > 3) {
          messages.value = Items.slice(0, 3);
        } else {
          messages.value = [...Items];
        }
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    const openModal = async (item) => {
      let { data } = await getNoticeById(item.Id);
      noticeItemData.value = { ...data };
      noticeItemComp.value.noticeItemModal = true;
    };
    const showMoreModal = async (item) => {
      moreItemsComp.value.moreItemsModal = true;
    };

    onMounted(() => {
      getData();
    });

    const showData = () => {
    };

    return {
      showData,
      messages,
      allMessages,
      getData,
      openModal,
      showMoreModal,
      noticeItemComp,
      noticeItemData,

      moreItemsComp,
    };
  },
};
</script>

<style lang="scss" scoped>
.notices {
  width: 560px;
  .title {
    position: relative;
    @apply text-3xl font-bold border-b-2 pl-8 mb-3;
    color: #0f2974;
    border-color: #0f2974;
    .title-btn {
      position: absolute;
      bottom: 6px;
      left: 181px;
    }
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

  &:hover {
    background: #cee3ffc2;
    > .subject {
      color: red;
    }
  }
}
</style>
