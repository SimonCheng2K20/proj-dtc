<template>
  <div
    class="cloud-src h-full overflow-y-hidden"
    :class="{ reverse: isReverse }"
  >
    <div
      class="flex flex-col"
      :style="`max-height: ${maxHeight}; min-height: ${minHeight};`"
    >
      <div
        style="flex: 1 0 0"
        class="px-2 overflow-y-auto custom-scroll-bar"
        ref="symptomRef"
      >
        <div
          class="symptom"
          v-for="(symptom, idx) in visibleTables"
          :key="idx + symptom.title"
        >
          <!-- <h5 v-text="symptom.title" /> -->
          <h5>{{ symptom.title }}</h5>
          <div v-if="symptom.isText" class="bg-white border p-2">
            <template v-for="(sitem, sidx) in symptom.items">
              <div v-for="column in symptom.columns" :key="column.key + sidx">
                <div v-text="column.label" />
                <div class="text-xs" v-text="sitem[column.key]" />
              </div>
            </template>
          </div>
          <div v-else class="table-zone" style="width: inherit">
            <tableField
              v-show="symptom.items.length && showTables"
              :itemsData="symptom"
              class="table-field rounded-t-lg overflow-y-hidden"
              :columns="symptom.columns"
              thSize="text-sm"
              :showPagination="true"
              :isLocal="true"
              @changePage="
                (data) => {
                  changePageEvent(data, symptom.key);
                }
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-40 h-full overflow-y-auto custom-scroll-bar"
      v-if="dataList.length > 0"
    >
      <div class="date-list">
        <div
          class="edata relative"
          v-for="eData in dataList"
          :key="eData.label"
        >
          <div class="title" v-text="nameObject[eData.key]" />
          <div
            class="time"
            v-text="convertToChineseYear(eEvent.time)"
            v-for="eEvent in eData.items"
            :key="eEvent.key + eEvent.time"
            :class="{
              active:
                modelValue.key === eData.key && modelValue.time === eEvent.time,
            }"
            @click.stop="chosenTimeEvent({ key: eData.key, time: eEvent.time })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, computed, onMounted } from "vue";
// import { cloudNameObject } from './diagnosisSource.js'
import tableField from "comps/datafields/tables.vue";
export default {
  components: { tableField },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    isReverse: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
    },
    maxHeight: {
      type: String,
      default: "100vh",
    },
    minHeight: {
      type: String,
      default: "75vh",
    },
    sourceList: {
      type: Object,
      require: true,
    },
    nameObject: {
      type: Object,
      require: true,
    },
    keyName: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const symptomRef = ref();
    const showTables = ref(false);
    const $chineseYear = inject("$chineseYear");
    const isTextObject = {
      his: ["Conditions"],
      electronic: ["clinic"],
    };
    function checkIsText(key) {
      return isTextObject.hasOwnProperty(props.keyName)
        ? isTextObject[props.keyName].some((k) => k === key)
        : false;
    }

    const visibleTables = computed(() =>
      props.modelValue.display.map((key) => ({
        key,
        title: props.modelValue.keyName[key],
        columns: props.sourceList[key],
        isText: checkIsText(key),
        per: 4,
        first:
          props.modelValue.first && props.modelValue.first[key]
            ? props.modelValue.first[key]
            : 0,
        // page:  1,
        get items() {
          if (["electronic", "his"].includes(props.keyName)) {
            const _wholeTimes = Object.values(props.dataList).flatMap(
              ({ items }) => items
            );
            const _items = _wholeTimes.flatMap(({ time, items }) => {
              // console.log(time, props.modelValue.time)
              return (props.modelValue.time &&
                time === props.modelValue.time) ||
                !props.modelValue.time
                ? items
                : items;
            });
            // console.log(Object.values(props.dataList).flatMap(({ items }) => items))
            return _items.reduce((acc, cur) => {
              return cur[key] ? acc.concat(cur[key]) : acc;
            }, []);
            // console.log(props.dataList)
            // return []
          } else {
            if (
              props.modelValue.key &&
              props.modelValue.time &&
              props.modelValue.key !== key
            )
              return [];
            const _item = props.dataList.find((item) => item.key === key);
            return !_item
              ? []
              : props.modelValue.key && props.modelValue.time // 有選擇要顯示的時間和key
              ? _item.items.find(({ time }) => time === props.modelValue.time)
                  .items
              : _item.items.flatMap(({ items }) => items);
          }
        },
        get total() {
          return this.items.length;
        },
      }))
    );

    onMounted(() => {
      symptomRef.value.style.width = symptomRef.value.clientWidth + "px";
      showTables.value = true;
    });

    function convertToChineseYear(_date) {
      return $chineseYear(_date);
    }
    function chosenTimeEvent(_data) {
      const _state =
        props.modelValue.key === _data.key &&
        props.modelValue.time === _data.time
          ? Object.keys(_data).reduce(
              (acc, key) => ({ ...acc, [key]: null }),
              {}
            )
          : { ..._data };
      emit("update:modelValue", Object.assign(props.modelValue, _state));
    }

    function changePageEvent(data, key) {
      // console.log(data)
      // const page = { ...props.modelValue.page, [key]: data.page }
      const first = { ...props.modelValue.first, [key]: data.first };
      emit("update:modelValue", Object.assign(props.modelValue, { first }));
    }

    if (props.keyName === "his") {
      // console.log(props.dataList);
    }

    return {
      visibleTables,
      symptomRef,
      showTables,
      convertToChineseYear,
      chosenTimeEvent,
      changePageEvent,
    };
  },
};
</script>

<style lang="scss" scoped>
.cloud-src {
  @apply grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  &.reverse {
    direction: rtl;
  }
  // @apply flex;
  // > div {
  //   // width: auto;
  //   &:nth-child(1) {
  //     flex: 1 0 0;
  //   }
  // }
}

.edata {
  @apply relative;
  > div.title {
    @apply mb-1;
  }
  > div {
    @apply text-center;
    &.time {
      @apply cursor-pointer;
      &.active {
        @apply bg-yellow-100 rounded-xl;
      }
    }
  }
}

.symptom {
  background-color: #f1f9e7;
  border: 1px solid #004e8a;
  @apply rounded overflow-y-hidden mb-2;
  h5 {
    @apply py-1 px-2 text-lg font-bold;
  }
  .table-field {
    @apply bg-white;
    border-top: 1px solid #004e8a;
  }

  ::v-deep(.fields) {
    @apply overflow-x-auto;
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 9px;
      height: 9px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
      background-color: #999;
    }
    > div.th {
      white-space: nowrap;
    }
  }
}
</style>
