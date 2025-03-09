<template>
  <div
    class="cps-options"
    :class="{
      'flex items-center justify-start flex-wrap': ['checkbox', 'radio'].some(
        (v) => v === inputType
      ),
    }"
  >
    <span v-if="title" v-text="title" class="mr-5 title" />

    <Dropdown
      class="selection w-full"
      v-if="inputType === 'select'"
      v-model="itemData[itemKey]"
      :options="options"
      optionLabel="text"
      placeholder="請選擇"
      :disabled="isDisabled"
    />

    <MultiSelect
      class="selection"
      v-else-if="inputType === 'multiSelect'"
      v-model="itemData[itemKey]"
      :options="options"
      optionLabel="text"
      optionValue="value"
      placeholder="請選擇"
      :disabled="isDisabled"
    />

    <template v-else-if="inputType === 'checkbox'">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="flex mr-4 items-center"
        :class="{ 'w-full mb-1': isVertical }"
      >
        <Checkbox
          @change="changeEvent"
          :name="'checkbox' + item.value"
          :value="item.value"
          v-model="itemData[itemKey]"
          :disabled="isDisabled"
        />
        <label :for="'checkbox' + item.value" class="m-2 whitespace-nowrap">{{
          item.text
        }}</label>
        <InputText
          v-if="item.other"
          :disabled="isDisabledEvent(item.value)"
          class="p-button-sm"
          v-model.trim="itemData[item.otherKey || itemKey + '_' + item.value]"
        />
        <slot
          v-if="item.sub"
          :name="'sub' + item.value"
          :params="{ disabled: isDisabledEvent(item.value) }"
        />
      </div>
    </template>

    <template v-else-if="inputType === 'radio'">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="flex mr-4 items-center"
        :class="{ 'w-full mb-1': isVertical }"
      >
        <RadioButton
          @change="changeEvent"
          :name="'radio' + item.value"
          :value="item.value"
          v-model="itemData[itemKey]"
          :disabled="isDisabled"
          :id="'radio' + item.value + item.text"
        />
        <label
          :for="'radio' + item.value + item.text"
          class="m-2 whitespace-nowrap"
          >{{ item.text }}</label
        >
        <InputText
          v-if="item.other"
          :disabled="isDisabledEvent(item.value)"
          class="p-button-sm"
          v-model.trim="itemData[item.otherKey || itemKey + '_' + item.value]"
        />
        <slot
          v-if="item.sub"
          :name="'sub' + item.value"
          :params="{ disabled: isDisabledEvent(item.value) }"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { computed, watch } from "vue";
export default {
  props: {
    inputType: {
      type: String,
      default: "checkbox",
    },
    options: {
      type: Array,
      default: () => [],
    },
    itemKey: {
      type: String,
      required: true,
    },
    itemData: {
      type: Object,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isVertical: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const mainValue = computed(() =>
      Object.keys(props.itemData).length === 0 ||
      (!props.itemData[props.itemKey] && props.itemData[props.itemKey] != 0)
        ? []
        : props.inputType === "checkbox"
        ? Object.values(props.itemData[props.itemKey])
        : [props.itemData[props.itemKey]]
    );

    watch(
      () => props.isDisabled,
      (_, nValue) => {
        if (!nValue) {
          Object.keys(props.itemData).forEach((key) => {
            if (new RegExp(`^${props.itemKey}`).test(key))
              delete props.itemData[key];
          });
        }
      }
    );

    function changeEvent() {
      Object.keys(props.itemData)
        .filter((key) => key.includes(props.itemKey) && key !== props.itemKey)
        .forEach((key) => {
          const _value = key.split("_")[1];

          if (!mainValue.value.some((v) => v == _value)) {
            delete props.itemData[key];
          }
        });
      window.scrollTo(0, 0);
    }

    function isDisabledEvent(value) {
      return Object.keys(props.itemData).length === 0
        ? true
        : !mainValue.value.some((v) => v === value);
    }
    return { changeEvent, isDisabledEvent };
  },
};
</script>

<style lang="scss" scoped>
.selection {
  @apply w-full;
}
</style>
