<template>
  <div>
    <!-- 
      <div v-text="'first:' + itemsData.first" />
    <div v-text="'page:' + itemsData.page" />
    <div v-text="'items:' + itemsData.items.length" />
    <div v-text='"list:" + itemList.length' /> -->

    <div class="fields" :style="`grid-template-columns: ${fieldGridWidth};`">
      <div
        class="th customth"
        :class="thSize"
        v-for="col in columns"
        :key="col.label"
      >
        <slot
          v-if="/^titleCustom/.test(col.label)"
          :name="col.label"
          :params="{ col, index: idx }"
        />
        <template v-else>
          <span v-html="col.label" />
        </template>
      </div>
      <template
        v-for="(item, idx) in itemList"
        :key="'tdsrow-' + idx"
        class="fields"
        :style="`grid-template-columns: ${fieldGridWidth};`"
      >
        <div
          v-for="(col, cidx) in columns"
          :key="`item-${idx}-${cidx}`"
          class="item td"
          :class="{
            'cursor-pointer': isChosenAble,
            'is-chosen': JSON.stringify(chosenItem) == JSON.stringify(item),
            'is-even': idx % 2 == 0,
            'is-odd': idx % 2 == 1,
          }"
          @dblclick="doubleClickRowEvent(item)"
          @click.stop="clickRowEvent(item)"
          :title="item[col.key]"
        >
          <slot
            v-if="/^custom/.test(col.key)"
            :name="col.key"
            :params="{ item, index: idx, colIndex: cidx }"
          />

          <select
            class="w-full h-9 rounded bg-black bg-opacity-40"
            v-else-if="col.type === 'select'"
            v-model="item[col.key]"
          >
            <option
              v-for="option in col.options"
              class="text-black bg-white bg-opacity-0"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </option>
          </select>

          <InputText
            v-else-if="col.type === 'inputText'"
            :placeholder="col.placeholder || '請輸入...'"
            class="p-inputtext-sm h-8"
            type="text"
            v-model.trim="item[col.key]"
          />

          <InputText
            v-else-if="col.type === 'inputNumber'"
            class="p-inputtext-sm h-8"
            type="number"
            v-model.trim="item[col.key]"
          />

          <!-- <InputText v-else-if="col.type === 'text'" class="p-inputtext-sm h-8" type="text" :disabled="true" v-model="item[col.key]" :title="col.hint === true ? item[col.key] : null" /> -->

          <Checkbox
            v-else-if="col.type === 'checkbox'"
            :binary="true"
            v-model="item[col.key]"
            :disabled="col.disabled"
          />

          <Calendar
            v-else-if="col.type === 'calendar'"
            class="h-10 w-full"
            v-model="item[col.key]"
            placeholder="請輸入"
            :showIcon="true"
            dateFormat="yy-mm-dd"
            v-date-input
          />

          <AutoComplete
            v-else-if="col.type === 'autocomplete'"
            v-model="item[col.key]"
            :key="col.options.length"
            :suggestions="col.options"
            :delay="300"
            @complete="searchAutoCompleteEvent($event)"
            field="name"
            @item-select="finishSearchAutoCompleteEvent(col)"
          />

          <template v-else-if="col.type === 'index'">
            {{ (page - 1) * per + (idx + 1) }}
          </template>

          <template v-else>{{ item[col.key] }}</template>
        </div>
      </template>
    </div>
    <Paginator
      @page="pageChangeEvent"
      v-if="showPagination"
      :totalRecords="itemsData.total"
      v-model:rows="itemsData.per"
      v-model:first="itemsData.first"
      :rowsPerPageOptions="[5, 10, 20, 30, 50]"
    />
  </div>
</template>

<script>
import { computed, ref, reactive } from "vue";
export default {
  props: {
    itemsData: {
      type: Object,
      default: () => ({ items: [], total: 0, page: 0, per: 10 }),
    },
    columns: {
      type: Array,
      default: () => [],
    },
    isLocal: {
      // 資料分頁是否由api來串接
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    chosenItem: {
      type: Object,
    },
    thSize: {
      type: String,
      default: "text-md",
    },
  },
  setup(props, context) {
    if (!props.itemsData["first"]) props.itemsData["first"] = 0;
    if (!props.itemsData["per"]) props.itemsData["per"] = 10;
    props.itemsData["page"] = computed({
      get: () => {
        return Math.floor(props.itemsData.first / props.itemsData.per) + 1;
      },
      set: (val) => {
        props.first = (val - 1) * props.itemsData;
      },
    });

    props.itemsData["paginationParams"] = computed(
      () => `&$top=${props.itemsData.per}&$skip=${props.itemsData.first}`
    );
    const itemList = computed(() =>
      props.isLocal
        ? props.itemsData.items.slice(
            props.itemsData.first,
            props.itemsData.first + props.itemsData.per
          )
        : props.itemsData.items
    );
    const isChosenAble = props.chosenItem != null;
    const fieldGridWidth = props.columns
      .reduce((acc, cur) => acc.concat(cur["width"] ? cur["width"] : "1fr"), [])
      .join(" ");
    function mouseOver(event) {
      // console.log(event);
    }

    function doubleClickRowEvent(item) {
      context.emit("doubleClickRowEvent", item);
    }

    function clickRowEvent(item) {
      context.emit("clickRowEvent", item);
    }

    function pageChangeEvent(event) {
      context.emit("changePage", { ...event, page: event.page + 1 });
    }

    function searchAutoCompleteEvent(event) {
      context.emit("searchComplete", event);
    }

    function finishSearchAutoCompleteEvent(column) {
      column.options.length = 0;
    }

    return {
      itemList,
      fieldGridWidth,
      mouseOver,
      doubleClickRowEvent,
      pageChangeEvent,
      clickRowEvent,
      searchAutoCompleteEvent,
      finishSearchAutoCompleteEvent,
      isChosenAble,
    };
  },
};
</script>

<style lang="scss" scoped>
.fields {
  @apply grid;
  gap: 2px;
  > div {
    @apply text-center;
    .p-inputtext {
      width: 100%;
    }
    &.item {
      overflow-wrap: anywhere;
      @apply flex items-center justify-center p-1;
      // border-right: 1px solid;
    }
    &.th {
      overflow-wrap: anywhere;
      background-color: #e9e9e9;
      @apply flex justify-center items-center font-bold px-6 py-1;
      color: #1c2a54;
    }
    &.td {
      @apply px-6;
      color: #293a6e;
      background-color: #e7f2f3;
      &.is-even {
        background-color: #fff;
      }
      ::v-deep(.p-button) {
        margin-left: 2px !important;
      }
    }
  }
}
.customth {
  // padding: 30px auto !important;
  min-height: 40px;
}
</style>
