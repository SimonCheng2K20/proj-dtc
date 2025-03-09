<template>
  <div class="filters-fields" :class="{ 'with-border': !!title }">
    <div v-if="title" class="filter-title">{{ title }}</div>
    <div class="filter-columns">
      <!-- {{ specColum }} -->
      <div
        class="condition-columns"
        :style="
          specColum
            ? specColum
            : `grid-template-columns: repeat(${gridNum}, 1fr)`
        "
        :class="{ 'one-column': gridNum === 1 }"
      >
        <div
          v-for="col in columns"
          :key="col.key"
          :style="`grid-template-columns: ${labelWidth}px 1fr; ${
            col.span ? `grid-column: span ${col.span}` : ''
          }`"
          :class="{
            column: col.type !== 'textarea' && !!col.label,
            'column-area': col.type === 'textarea',
          }"
        >
          <div
            class="condition-title"
            v-text="col.label"
            :class="Boolean(col.needRedStar) ? 'red-star' : ''"
          />
          <div class="condition-insert">
            <InputText
              :disabled="col.disabled"
              v-if="col.type === 'inputText' || col.type === 'text'"
              :placeholder="col.placeholder || '請輸入...'"
              class="input-formate p-input"
              :class="{ 'p-invalid': col.needRedStar }"
              type="text"
              v-model.trim="filterData[dataKey][col.key]"
              @keydown.enter="searchEvent"
            />

            <InputText
              :disabled="col.disabled"
              v-if="col.type === 'number'"
              :placeholder="col.placeholder || '請輸入...'"
              class="input-formate p-input"
              type="number"
              v-model.trim="filterData[dataKey][col.key]"
              @keydown.enter="searchEvent"
            />

            <Textareaprime
              class="w-full rounded-t-none"
              v-if="col.type === 'textarea'"
              v-model="filterData[dataKey][col.key]"
            />

            <Dropdown
              class="selection w-full"
              :class="{ 'p-invalid': col.needRedStar }"
              v-else-if="col.type === 'select'"
              v-model="filterData[dataKey][col.key]"
              :options="col.options"
              optionValue="value"
              optionLabel="text"
              :placeholder="col?.placeholder || '請選擇'"
              :filter="true"
              :disabled="col.disabled"
              :showClear="col.showClear"
              @change="searchEvent"
            />

            <!-- <select :disabled="col.disabled" class="w-full h-11 rounded-r bg-transparent border border-l-0 border-gray-400" v-else-if="col.type === 'select'" v-model="filterData[dataKey][col.key]">
              <option v-for="option in col.options" :value="option.value" :key="option.value" >
                {{ option.text }}
              </option>
            </select> -->

            <div
              v-else-if="col.type === 'checkbox'"
              class="checkbox-format dark-white"
            >
              <div
                v-for="(item, index) in col.options"
                :key="index"
                class="flex mr-4 items-center h-10"
              >
                <Checkbox
                  @change="searchEvent"
                  :disabled="col.disabled"
                  :name="'checkbox' + col.key"
                  :value="item.value"
                  v-model="filterData[dataKey][col.key]"
                  :id="'radio' + item.value"
                />
                <label :for="'radio' + item.value" class="m-2">{{
                  item.text
                }}</label>
              </div>
            </div>

            <div v-else-if="col.type === 'radio'" class="radio-format">
              <div
                v-for="(item, index) in col.options"
                :key="index"
                class="flex mr-4 items-center"
              >
                <RadioButton
                  :disabled="col.disabled"
                  :name="'radio' + item.value"
                  :value="item.value"
                  v-model="filterData[dataKey][col.key]"
                />
                <label :for="'radio' + item.value" class="m-2">{{
                  item.text
                }}</label>
              </div>
            </div>

            <InputOptions
              class="ml-2"
              v-else-if="/^combo/.test(col.type)"
              :inputType="col.type === 'comboRadio' ? 'radio' : 'checkbox'"
              :options="col.options"
              :itemData="filterData[dataKey]"
              :itemKey="col.key || 'purposeTarget'"
              :isDisabled="col.disabled"
            />

            <CheckboxButton
              v-model="filterData[dataKey][col.key]"
              v-else-if="col.type === 'checkboxButton'"
              @changeEvent="changeEvent(col.key)"
              :options="col.options"
            />

            <Calendar
              v-else-if="col.type === 'date'"
              :selectionMode="col.mode || 'single'"
              class="w-full"
              v-model="filterData[dataKey][col.key]"
              placeholder="請輸入"
              :disabled="col.disabled"
              :showIcon="true"
              dateFormat="yy-mm-dd"
              v-date-input
            />

            <AutoComplete
              class="w-full h-full"
              v-else-if="col.type === 'autoComplete'"
              placeholder="請輸入"
              :delay="300"
              :spellcheck="false"
              v-model="filterData[dataKey][col.key]"
              :suggestions="col.items"
              :disabled="col.disabled"
              @complete="
                (e) => {
                  fetchAutoCompleteData(e.query, col);
                }
              "
            />

            <Checkbox
              v-else-if="col.type === 'checkboxSingle'"
              :binary="true"
              :disabled="col.disabled"
              v-model="filterData[dataKey][col.key]"
            />
            <MultiSelect
              v-else-if="col.type === 'multiSelect'"
              v-model="filterData[dataKey][col.key]"
              :options="col.options"
              optionLabel="text"
              :placeholder="col.placeholder"
              :disabled="col.disabled"
            />

            <slot
              v-if="col.slot"
              :name="col.key"
              :params="{ value: filterData[dataKey][col.key] }"
            />
          </div>

          <div
            class="col-span-full text-right text-red-500 text-sm bg-red-100 p-1 mb-2"
            v-if="col.message"
            v-text="col.message"
          />
        </div>
      </div>
      <div v-if="showBtns" class="btns">
        <Button @click.stop="searchEvent">查詢</Button>
        <Button @click.stop="cleanEvent" class="p-button-success">清除</Button>
        <slot />
      </div>
    </div>
    <div v-if="!showBtns">
      <slot />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import dayjs from "dayjs";
export default {
  props: {
    specColum: {
      type: String,
      default: "",
    },
    gridNum: {
      type: Number,
      default: 3,
    },
    labelWidth: {
      type: Number,
      default: 146,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    filterData: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
    showBtns: {
      type: Boolean,
      default: true,
    },
    enableParams: {
      type: Boolean,
      default: true,
    },
    dataKey: {
      type: String,
      default: "data",
    },
  },
  emits: ["search"],
  setup(props, { emit }) {
    // props.filterData.params = computed(() => props.filterData[dataKey])
    // const filterData = props.filterData;
    if (props.enableParams)
      props.filterData.filters = computed(() => {
        const _divide = props.columns.reduce(
          (acc, col) =>
            col.contains
              ? { ...acc, contains: acc.contains.concat(col.key) }
              : col.num
              ? { ...acc, nums: acc.nums.concat(col.key) }
              : col.disOdata
              ? { ...acc, disOdata: acc.disOdata.concat(col.key) }
              : col.range
              ? { ...acc, range: acc.range.concat(col.key) }
              : col.date
              ? { ...acc, date: acc.date.concat(col.key) }
              : acc,
          { contains: [], nums: [], disOdata: [], range: [], date: [] }
        );

        const generateIsArr = (key, value, middle, isString = "") => {
          const _arrString = []
            .concat(value)
            .map((item) => `${key} ${middle} ${isString}${item}${isString}`)
            .join(" or ");
          return `(${_arrString})`;
        };

        const generateCondition = (key, value) => {
          return _divide.contains.includes(key)
            ? `(contains(${key}, '${value}'))`
            : _divide.nums.includes(key)
            ? generateIsArr(key, value, "eq")
            : _divide.range.includes(key)
            ? (Array.isArray(value) ? value : Object.values(value)).every(
                (v) => !!v
              )
              ? `(${key} gt ${dayjs(value[0]).format(
                  "YYYY-MM-DDT00:00:00"
                )}%2b08:00 and ${key} lt ${dayjs(value[1]).format(
                  "YYYY-MM-DDT23:59:59"
                )}%2b08:00)`
              : ""
            : _divide.date.includes(key)
            ? `(${key} eq '${dayjs(value).format("YYYY-MM-DDTHH:mm:ss")}')`
            : generateIsArr(key, value, "eq", "'");
        };

        const _value = Object.entries(props.filterData[props.dataKey])
          .reduce((acc, [key, value]) => {
            if (value && !_divide.disOdata.includes(key)) {
              const _codit = generateCondition(key, value);
              // if (Array.isArray(value) && value.length > 0 || !Array.isArray(value) && !!value) {
              if (!!value) {
                return acc.concat(_codit);
              } else {
                return acc;
              }
            } else {
              return acc;
            }
          }, [])
          .join(" and ");
        const odata =
          _value !== "" && _value !== "()" ? "&$filter=" + _value : "";
        const params = Object.entries(props.filterData[props.dataKey])
          .reduce((acc, [key, value]) => acc.concat(`${key}=${value}`), [])
          .join("&");
        return { params, odata };
      });

    async function fetchAutoCompleteData(query, col) {
      col.items = await col.search(query);
    }

    function selectedAutoComplete(value, col) {
      col.items = [];
      col.selected(value);
    }

    function searchEvent() {
      emit("search");
    }

    function cleanEvent() {
      props.filterData.data = {};
      emit("search");
    }

    function changeEvent(key) {
      emit("changeValue", key);
    }

    return {
      // filterData,
      // filter,
      // clearValues,
      selectedAutoComplete,
      fetchAutoCompleteData,
      searchEvent,
      cleanEvent,
      changeEvent,
    };
  },
};
</script>
<style lang="scss" scoped>
.filters-fields {
  @apply rounded-t my-3;
  &.with-border {
    border: 1px solid #aaa;
  }
  .filter-title {
    @apply text-xl p-2;
    background-color: #e1e8f6;
  }
}
.filter-columns {
  @apply flex p-2;
  .condition-columns {
    @apply flex-1 grid gap-2;
    &.one-column {
      @apply gap-1 pr-0 flex-none;
    }
    .label {
      @apply text-white flex justify-center items-center;
    }
    .column {
      @apply grid items-stretch;
    }
    .condition-title {
      @apply w-full h-full;
      font-size: 16px;
      color: #1f2d56;
      font-weight: bold;
    }
    .condition-insert {
      @apply flex justify-items-stretch items-stretch;
    }
    select {
      border-color: #ccc;
      border-left: 1px solid #ccc;
      @apply rounded-l;
    }
  }
  .btns {
    @apply pl-2;
    ::v-deep(.p-button) {
      margin-left: 5px !important;
    }
  }
  .one-column {
    @apply w-full;
  }
}

.input-formate {
  @apply text-sm shadow-none w-full;
}
.checkbox-format {
  @apply flex items-center justify-center rounded rounded-l-none;
}
.radio-format {
  @apply flex items-center justify-center border rounded border-l-0 rounded-l-none;
}
</style>
