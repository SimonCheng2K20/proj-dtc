<template>
  <div class="my-2 flex flex-wrap">
    <div
      :class="[`grid grSSid-cols-${gridNum}`, { 'flex-1': isFull }]"
      :style="`grid-template-columns: repeat(${gridNum}, minmax(0, 1fr));`"
    >
      <DtxInputGroup
        v-for="item in sItems"
        :key="item.value"
        class="mb-2 mr-2"
        :class="[item.isbreak && 'col-start-1', item.span && `col-span-${item.span}`]"
        :title="item.text"
        :labelWidth="item.labelW || 130"
      >
        <InputText
          v-if="item.type === 'inputtext'"
          :disabled="item.isdisabled && enableDisable"
          v-model="results[item.value]"
          @keydown.enter="search"
        />
        <q-select
          v-bind="QSelectProps"
          v-if="item.type === 'select'"
          v-model="results[item.value]"
          :options="item.options"
          :placeholder="item.placeholder"
          optionLabel="text"
          optionValue="value"
          @update:model-value="handleChange(item.value, results[item.value])"
          :filter="item.filter"
        ></q-select>
        <div v-if="item.type === 'checkbox'" class="out mx-auto flex gap-1">
          <div v-for="check of item.checks" :key="check.value">
            <q-checkbox :id="check.value" name="value" :value="check" v-model="results[item.value]" />
            <label :for="check.value">{{ check.label }}</label>
          </div>
        </div>

        <div
          v-else-if="item.type === 'range' || item.type === 'range2'"
          class="flex w-60 items-center justify-between"
          :class="item.type === 'range2' && 'w-80'"
        >
          <my-date-input
            v-bind="QInputProps"
            v-model="results[item.value][0]"
            @keydown.enter="checkAndFormat"
            @date-select="checkAndFormat"
          ></my-date-input>
          <div class="mx-1 text-xl font-bold">~</div>
          <my-date-input
            v-bind="QInputProps"
            v-model="results[item.value][1]"
            @keydown.enter="checkAndFormat"
            @date-select="checkAndFormat"
          ></my-date-input>
        </div>
      </DtxInputGroup>
    </div>

    <div class="flex items-start gap-2">
      <Button :label="config.slabel" v-if="config.search" icon="pi pi-search" @click.stop="search" />
      <Button
        class="p-button-secondary"
        v-if="config.clear"
        :label="config.clabel"
        icon="pi pi-undo"
        @click.stop="clear"
      />
      <Button :label="config.alabel" v-if="config.add" class="btn-add" icon="pi pi-plus" @click.stop="add" />
      <slot name="buttonList" />
    </div>
  </div>
</template>

<script>
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props'
import dayjs from 'dayjs'
import _ from 'lodash'
export default {
  props: {
    sItems: {
      type: Array,
      default: () => [],
    },
    gridNum: {
      type: Number,
      default: 2,
    },
    results: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({
        search: true,
        slabel: '進行查詢',
        clear: true,
        clabel: '清除查詢',
        add: true,
        alabel: '新增資料',
      }),
    },
    isSetting: {
      type: Boolean,
      default: false,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    enableDisable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:results', 'sEvt', 'addEvt'],
  setup(props, context) {
    const search = () => context.emit('sEvt')
    const cur = dayjs().format('YYYY') - 1911 + '/' + dayjs().format('MM/DD')

    // const results = ref({});

    const clear = () => {
      _.forIn(props.results, function (value, key) {
        if (typeof props.results[key] === 'string' || 'boolean') {
          props.results[key] = null
        } else {
          props.results[key] = []
        }
      })
      context.emit('sEvt')
    }

    const add = () => context.emit('addEvt')
    function handleChange(key, value) {
      console.log(value, key, 'xxxxxxxxx')
    }
    context.emit('update:results', props.results)
    function ceYear(e) {
      return e
        .split('/')
        .map((elm, idx) => (idx === 0 ? +elm + 1911 : elm))
        .join('/')
    }
    function checkAndFormat(e) {
      if (!dayjs(e.target.value).isValid()) {
        e.target.value = ''
      } else if (props.isSetting && dayjs().diff(dayjs(ceYear(e.target.value))) > 0) {
        e.target.value = cur
      }
    }
    return {
      search,
      clear,
      add,
      handleChange,
      checkAndFormat,
    }
  },
}
</script>

<style lang="scss" scoped>
#app.dark .out {
  color: #fff;
}
</style>

