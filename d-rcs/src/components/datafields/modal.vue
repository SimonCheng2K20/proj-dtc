<template>
  <Dialog v-model:visible="modalData.show" class="custom-modal" :closable="isClosable" :draggable="false" :modal="true"
    style="width: 600px" :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    @hide="modalBtnsEvent('hide')"
  >
    <template #header>
      <h3 v-if="title" class="w-full text-center text-xl" v-text="title" />
    </template>

    <slot name="bodyTop" />

    <filters class="w-full"
      :filterData="filterData"
      :columns="columns"
      :gridNum="gridNum"
      :showBtns="false"
      :enableParams="false"
    />

    <template #footer>
      <Button @click.stop="modalBtnsEvent('confirm')">確認</Button>
      <Button class="p-button-success" @click.stop="modalBtnsEvent('cancel')">取消</Button>
      <slot name="footer" />
    </template>
  </Dialog>
</template>

<script>
import filters from "./filters.vue";
export default {
  components: { filters },
  props: {
    title: {
      type: String,
      default: "",
    },
    modalData: {
      type: Object,
      required: true,
    },
    filterData: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Array,
      default: () => [],
    },
    gridNum: {
      type: Number,
      default: 1,
    },
    isClosable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    function modalBtnsEvent(key) {
      if (key === "confirm") {
        context.emit("confirm", props.filterData.data);
        // props.modalData.show = false;
      } else if (key === "cancel") {
        props.modalData.show = false;
      } else if (key === "hide") {
        props.filterData.data = {};
      }
    }
    return { modalBtnsEvent };
  },
};
</script>
