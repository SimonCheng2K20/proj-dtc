<template>
  <div class="main-table-section" :style="`min-width:${minwidth}px`">
    <div class="main-header-out">
      <header class="dtc-grid my-dark main-header-inside" :style="columnstyle">
        <div
          v-for="(item, i) in headers"
          :key="`headers${i}`"
          class="header"
          :title="item.name"
          :style="`font-size: ${headerSize}px`"
        >
          {{ item.name }}
        </div>
      </header>
    </div>
    <div v-if="items.length" class="all-content">
      <main
        class="dtc-grid main-content"
        v-for="(item, idx) in itemsForShow"
        :key="`content${idx}`"
        style="color: #39312e"
        :style="columnstyle"
      >
        <div
          v-for="(itemk, ik) in headers"
          :key="`content${ik}`"
          class="content"
          :title="item[`${itemk.key}`]"
        >
          {{
            item[`${itemk.key}`] == 0 || item[`${itemk.key}`]
              ? item[`${itemk.key}`]
              : ''
          }}
        </div>
      </main>
    </div>
    <main
      v-if="!items.length"
      class="mt-2 text-center text-md font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica"
    >
      No Data
    </main>
    <footer
      class="grid grid-flow-col auto-cols-max justify-center"
      style="background: #fcfcfc"
    >
      <Paginator
        @page="pageChange"
        v-model:first="offset"
        v-model:rows="rows"
        :totalRecords="totalItemsCount"
        :rowsPerPageOptions="isShowRowNum ? [5, 10, 50] : null"
      ></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  computed,
  onMounted,
  onUpdated,
} from 'vue';

export default defineComponent({
  name: 'DefaultLayoutTable',
  components: {},
  props: {
    headers: {
      type: Array,
      default: [],
    },
    items: {
      // means all table data
      type: Array,
      default: [],
    },
    columnstyle: {
      type: String,
      default: '',
    },
    minwidth: {
      type: String,
      default: '300',
    },
    rowsNum: {
      type: Number,
      default: 5,
    },
    headerSize: {
      type: Number,
      default: 14,
    },
    isShowRowNum: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const totalItemsCount = computed(() => {
      return props.items.length;
    });

    const offset = ref(0);
    const rows = ref(props.rowsNum);
    let itemsForShow = ref([]);
    const allItems = ref([...props.items]);

    const itemsString = computed(() => {
      return JSON.stringify(props.items);
    });

    watch(itemsString, (v, pv) => {
      // console.log("v", v);
      allItems.value = JSON.parse(v);
      pageChange();
    });

    const pageChange = () => {
      const page = +offset.value / +rows.value + +1;
      const skip = (page - 1) * rows.value;
      const top = rows.value;
      itemsForShow.value = allItems.value.slice(+skip, +skip + +top);
    };
    pageChange();
    // onUpdated(() => {
    //   console.log("props", props);
    //   //   allItems.value = props.items;
    //   pageChange();
    // });
    // onMounted(() => {
    //   console.log("props", props);
    //   //   allItems.value = props.items;
    //   pageChange();
    // });

    onUpdated(() => {
      // 在資料更改導致virtual DOM重新渲染後調用
      // console.log("props.items", props.items);
    });

    return {
      offset,
      rows,
      itemsForShow,
      allItems,
      pageChange,
      itemsString,
      totalItemsCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-table-section {
  margin: 0 auto;
  width: 100%;
  // background-color: #fff;
  background-color: #fcfcfc;
  > .main-header-out {
    background: #f1f9e9;
    > .main-header-inside {
      background-color: #e9e9e9;
      border-radius: 8px 8px 0 0;
      > div {
        color: #1c2a54;
        line-height: 2rem;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
  > .all-content {
    // background-color: red;
    > .main-content {
      height: 43px;
      > div {
        padding: 6px;
        padding-top: 4px;
        height: 43px;
      }
    }

    > .main-content:nth-child(2n + 1) {
      background: #ffffff;
    }
    > .main-content:nth-child(2n) {
      background: #e7f2f3;
    }
  }

  .dtc-grid {
    display: grid;
    grid-auto-flow: column;
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
  }
}
.p-paginator {
  background-color: #fcfcfc;
}
</style>
