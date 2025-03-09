<template>
  <div class="container float-left overflow-y-auto">
    <div
      class="grid top py-2 text-xl font-bold sticky top-0"
      :style="`grid-template-columns: ${columns};`"
    >
      <div v-for="item in headers" :key="item.value">{{ item.text }}</div>
    </div>
    <div class="bottom">
      <div
        v-for="(rows, idx) in items"
        :key="idx"
        class="grid cursor-pointer"
        :style="`grid-template-columns: ${columns};`"
        :class="rows.isSelected && 'bg-blue-400 text-white'"
        @click.stop="rowClick(rows)"
      >
        <div
          v-for="(col, cidx) in headers"
          :key="cidx + idx"
          class="py-2 text-xl font-bold"
        >
          {{ rows[col.value] }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const columns = computed(() =>
      props.headers.map(({ width }) => width || "1fr").join(" ")
    );
    const rowClick = (e) => {
      context.emit("rowClickEvt", e);
    };
    return { columns, rowClick };
  },
};
</script>
<style lang="scss" scoped>
#app {
  &.light,
  &.dark {
    .container {
      height: calc(100vh - 290px);
      width: 300px;
    }
  }
  &.light {
    .container {
      background-color: #fff;
      .top {
        border-top: 1px solid #0000ff;
        @apply bg-purple-300;
      }
    }
  }
  &.dark {
    .container {
      background-color: #8193ab;
      .top {
        border-top: 1px solid #fff;
        @apply bg-gray-200;
      }
      .bottom {
        @apply text-white;
      }
    }
  }
}
</style>
