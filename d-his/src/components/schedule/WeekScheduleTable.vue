<template>
  <div class="flex items-center gap-2">
    <q-btn color="primary" label="上個月" unelevated @click="preMonth"></q-btn>
    <q-btn color="primary" label="上一周" unelevated @click="preWeek"></q-btn>
    <q-btn
      :label="firstDateInWeek.format('YYYY-MM-DD') + ' ~ ' + firstDateInWeek.add(6, 'day').format('YYYY-MM-DD')"
      unelevated
    >
      <q-popup-proxy :ref="(el) => (popupProxyRefs.week = el)" @hide="weekDiff = 0">
        <q-card>
          <q-card-section class="flex">
            <q-btn icon="chevron_left" dense unelevated @click="weekDiff--"></q-btn>
            <div class="grid">
              <q-btn
                v-for="(week, index) in weekSelectItems"
                :color="
                  week.StartDate.format('YYYY-MM-DD') === firstDateInWeek.format('YYYY-MM-DD') ? 'amber-3' : undefined
                "
                text-color="default"
                :key="index"
                :label="week.StartDate.format('YYYY-MM-DD') + ' ~ ' + week.EndDate.format('YYYY-MM-DD')"
                unelevated
                @click="
                  () => {
                    firstDateInWeek = week.StartDate
                    popupProxyRefs.week.hide()
                  }
                "
              ></q-btn>
            </div>
            <q-btn icon="chevron_right" dense unelevated @click="weekDiff++"></q-btn>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
    </q-btn>
    <q-btn color="primary" label="下一周" unelevated @click="nextWeek"></q-btn>
    <q-btn color="primary" label="下個月" unelevated @click="nextMonth"></q-btn>
    <slot name="btn-expend"></slot>
  </div>

  <q-table
    class="mt-2"
    v-bind="QTableProps"
    :columns="columns"
    :rows="rows"
    :loading="loading"
    :pagination="{ rowsPerPage: -1 }"
  >
    <template v-for="(slot, key) in $slots" v-slot:[key]="props">
      <slot :name="key" v-bind="props"></slot>
    </template>

    <template v-for="week in weekColumns" :key="week.name" v-slot:[`body-cell-${week.field}`]="{ col, row, rowIndex }">
      <slot :name="week.field" :col="col" :row="row" :rowIndex="rowIndex" :date="week.date"></slot>
    </template>
  </q-table>
</template>

<script setup>
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import { weekNameItems } from 'utils/options.js'
import { ref, reactive, computed, watch } from 'vue'
import dayjs from 'dayjs'

const popupProxyRefs = reactive({})

const props = defineProps({
  prependColumns: Array,
  rows: Array,
  label: [String, Function],
  // color: String,
  itemKey: String,
  loading: Boolean,
})
const emit = defineEmits(['update:rows', 'date-change', 'move-edit', 'edit', 'delete', 'weekChange'])

const firstDateInWeek = ref(dayjs().get('day') === 6 ? dayjs().add(1, 'day').day(0) : dayjs().day(0))
const firstDateInMonth = computed(() => firstDateInWeek.value.date(1))

watch(firstDateInWeek, () => {
  emit('date-change', firstDateInWeek.value.format('YYYY-MM-DD'))
})

const preWeek = () => {
  firstDateInWeek.value = firstDateInWeek.value.subtract(1, 'week')
  emit('weekChange')
}

const preMonth = () => {
  firstDateInWeek.value = firstDateInWeek.value.subtract(1, 'month')
  emit('weekChange')
}

const nextWeek = () => {
  firstDateInWeek.value = firstDateInWeek.value.add(1, 'week')
  emit('weekChange')
}

const nextMonth = () => {
  firstDateInWeek.value = firstDateInWeek.value.add(1, 'month')
  emit('weekChange')
}

const weekDiff = ref(0)
const weekSelectItems = computed(() => {
  const firstDate = firstDateInMonth.value.add(weekDiff.value, 'month').day(0)
  const endDate = firstDate.add(6, 'day')
  const arr = [{ StartDate: firstDate, EndDate: firstDate.add(6, 'day') }]
  let i = 1
  while (arr[arr.length - 1].EndDate.$M === arr[0].EndDate.$M) {
    arr.push({ StartDate: firstDate.add(i * 7, 'day'), EndDate: endDate.add(i * 7, 'day') })
    i++
  }

  return arr
})

const columns = computed(() => {
  return props.prependColumns.concat(weekColumns.value)
})

const weekColumns = computed(() => {
  return weekNameItems.map((item, index) => {
    const date = firstDateInWeek.value.add(index, 'day')
    return {
      name: item.EName,
      label: `${date.format('MM/DD')} ${item.CName}`,
      field: item.EName,
      align: 'center',
      style: 'height: 100px',
      date: date,
    }
  })
})

defineExpose({
  getDate: () => firstDateInWeek.value,
})
</script>

