<template>
  <div class="main-menu">
    <div v-for="(items, itemIdx) in Object.values(menu.items)" :key="itemIdx">
      <div
        v-for="(button, idx) in items"
        :class="{ 'mt-1': idx > 0 }"
        :key="button.key"
      >
        <Button
          class="w-full p-button-text p-button-lg"
          :class="{ active: modelValue === button.key }"
          @click.stop="btnClickEvent(button)"
        >
          <span v-html="button.label" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  props: {
    modelValue: {
      type: [String, Number],
    },
  },
  setup(_, { emit }) {
    const router = useRouter();
    // console.log(router.getRoutes().filter(({ path, name }) => new RegExp(`^${'/diagnosisManage'}`).test(path) && !!name && name !== 'diagnosisManage' && name !== 'recordingMaintain'))
    const menu = reactive({
      current: null,
      items: {
        one: [
          { label: "會診單", key: "draftForm" },
          { label: "HIS歷史資料", key: "his" },
          { label: "健保署<br />雲端藥歷", key: "cloud" },
          { label: "電子病歷<br />交換中心", key: "electronic" },
          { label: "調閱PACS", key: "pacs" },
          { label: "檢視附件", key: "attach" },
        ],
        // two: [{ label: "回主畫面", key: "back" }],
      },
    });

    function btnClickEvent(button) {
      // console.log("left-btnClickEvent-draft");
      emit("callGetUrl", button.key);
      if (["pacs"].includes(button.key)) {
        return;
      }

      menu.current = menu.current !== button.key ? button.key : "";

      emit("update:modelValue", menu.current);
      emit("change");
    }

    const closeDraftRightComp = () => {
      menu.current = "";
      emit("update:modelValue", menu.current);
    };

    return { menu, btnClickEvent, closeDraftRightComp };
  },
};
</script>

<style lang="scss" scoped>
.main-menu {
  height: 90vh;
  @apply w-40 rounded py-16 px-2 mb-2 flex flex-col justify-between;
  background-color: #849aeb;

  ::v-deep(.p-button) {
    @apply justify-center text-white px-1 font-bold;
    &:hover,
    &.active {
      @apply bg-white;
    }
    &.active {
      @apply text-blue-600;
    }
    span {
      text-shadow: 1px 1px 2px #888;
      line-height: 1.2;
    }
  }
}

@media screen and (max-width: 500px) {
  .main-menu {
    display: none;
  }
}
</style>
