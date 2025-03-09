<template>
  <div class="comps-src">
    <div
      class="flex flex-col"
      :style="`max-height: ${maxHeight}; min-height: ${minHeight};`"
    >
      <div
        style="flex: 1 0 0; width: 100% !important"
        class="px-2 overflow-y-auto custom-scroll-bar"
        ref="symptomRef"
      >
        <!-- <div v-text="modelValue.display.length + ' - ' + modelValue.keys.length" /> -->
        <div
          class="symptom"
          v-for="(symptom, idx) in visibleTables"
          :key="idx + symptom.title + modelValue.propsKey"
        >
          <h5>{{ symptom.title }}</h5>
          <div
            v-if="symptom.isText"
            class="bg-white border overflow-y-auto"
            :class="{ 'p-2': symptom.items.length > 0 }"
            style="max-height: 300px"
          >
            <div
              v-for="(sitem, sidx) in symptom.items"
              :key="sidx"
              class="border-b py-1"
            >
              <div v-for="column in symptom.columns" :key="column.key + sidx">
                <div
                  class="text-xs"
                  v-text="sitem[column.key]"
                  style="word-break: break-all"
                />
              </div>
            </div>
          </div>
          <div v-else class="table-zone" style="width: inherit">
            <tableField
              class="table-field rounded-t-lg overflow-y-hidden"
              v-show="showTables && symptom.items.length > 0"
              :itemsData="symptom"
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
      style="max-height: 90vh"
    >
      <div class="date-list">
        <template v-for="[key, timeItems] in Object.entries(dataList)">
          <div
            class="edata relative"
            v-if="checkIsAvailable(key)"
            :key="key + modelValue.propsKey"
          >
            <div
              class="title"
              v-text="convertKeyName(key)"
              @click.stop="chosenTimeEvent({ key, time: null })"
            />
            <div
              class="time"
              :class="{
                active: modelValue.key === key && modelValue.time === time,
              }"
              :key="key + time"
              v-for="time in Object.keys(timeItems)"
              v-text="convertToChineseYear(time)"
              @click.stop="chosenTimeEvent({ key, time })"
            />
          </div>
        </template>
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
      type: Object,
      default: () => [],
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
    showWholeColumn: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const symptomRef = ref();
    const showTables = ref(false);
    const $chineseYear = inject("$chineseYear");
    const eletricsNameObject = {
      "28579-1": "門診病歷",
      "18842-5": "出院病摘",
      "18747-6": "醫療影像及報告",
      "11502-2": "檢驗報告",
      "57833-6": "門診用藥紀錄",
    };

    const isTextObject = {
      cloud: [],
      his: ["Conditions"],
      electronic: ["Complaints", "DiagnosticReports"],
    };

    function checkIsAvailable(key) {
      return (
        props.modelValue.propsKey !== "electronic" ||
        eletricsNameObject.hasOwnProperty(key)
      );
    }

    function checkIsText(key) {
      return isTextObject[props.modelValue.propsKey].some((k) => k === key);
    }

    function convertKeyName(key) {
      return (
        { ...eletricsNameObject, ...props.modelValue.keyName }[key] || "---"
      );
    }

    const visibleTables = computed(() =>
      props.modelValue.display.map((key) => ({
        key,
        title: props.modelValue.keyName[key], // 左欄項目的標題
        columns:
          props.modelValue.list[props.showWholeColumn ? "long" : "normal"][key], // 所使用的column
        isText: checkIsText(key), // 是否為textarea
        per: 5,
        first:
          props.modelValue.first && props.modelValue.first[key]
            ? props.modelValue.first[key]
            : 0,
        // page:  1,
        get items() {
          if (
            !props.modelValue.key ||
            !props.modelValue.time ||
            !key ||
            Object.keys(props.dataList).length === 0
          )
            return [];
          return props.dataList[props.modelValue.key][props.modelValue.time]
            .flatMap((item) => item[key])
            .map((item, index) => Object.assign(item, { index })); //暴力
        },
        get total() {
          return this.items.length;
        },
      }))
    );

    onMounted(() => {
      // symptomRef.value.style.width = symptomRef.value.clientWidth + "px";
      showTables.value = true;
    });

    function convertToChineseYear(_date) {
      return $chineseYear(_date);
    }
    function chosenTimeEvent(_data) {
      // if (props.modelValue.key === _data.key && !!props.modelValue.time && props.modelValue.time === _data.time) return;
      // if (props.modelValue.key == _data.key ) {
      //   emit('update:modelValue', Object.assign(props.modelValue, { key: null, time: null }))
      //   return
      // }

      emit("update:modelValue", Object.assign(props.modelValue, _data));
    }

    function getFirstTime(key) {
      const _times = Object.keys(props.dataList[key]);
      if (_times.legnth === 0) return null;
      return _times[0];
    }

    function changePageEvent(data, key) {
      const first = { ...props.modelValue.first, [key]: data.first };
      emit("update:modelValue", Object.assign(props.modelValue, { first }));
    }

    function initialKeyAndTime() {
      const _keys = Object.keys(props.dataList);
      if (_keys.length === 0) return;
      const key = _keys[0];
      const time = getFirstTime(key);
      chosenTimeEvent({ key, time });
    }

    initialKeyAndTime();

    return {
      visibleTables,
      symptomRef,
      showTables,
      eletricsNameObject,
      convertToChineseYear,
      chosenTimeEvent,
      changePageEvent,
      initialKeyAndTime,
      checkIsAvailable,
      convertKeyName,
    };
  },
};
</script>

<style lang="scss" scoped>
.comps-src {
  @apply grid h-full overflow-y-hidden;
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
    &.title {
      @apply cursor-pointer;
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
