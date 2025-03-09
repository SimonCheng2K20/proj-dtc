<template>
  <div class="p-2 bg-white">
    <div class="flex flex-center gap-2 px-8">
      <q-btn label="上一年" color="primary" unelevated :disable="preYearDisable" @click="setYear(year - 1)"></q-btn>
      <q-btn label="上個月" color="primary" unelevated :disable="preMonthDisable" @click="preMonth"></q-btn>

      <q-btn :label="year + ' 年'" color="purple" unelevated>
        <q-popup-proxy :ref="(el) => (popupProxyRefs.year = el)" @hide="yearDiff = 0">
          <q-card>
            <q-card-section class="flex">
              <q-btn icon="chevron_left" dense unelevated @click="yearDiff--" :disable="yearItems[0].value === 0"></q-btn>
              <div class="grid grid-cols-3">
                <q-btn
                  v-for="year in yearItems"
                  :key="year.value"
                  :label="year.label"
                  unelevated
                  @click="
                    () => {
                      setYear(year.value)
                      popupProxyRefs.year.hide()
                    }
                  "
                ></q-btn>
              </div>
              <q-btn icon="chevron_right" dense unelevated @click="yearDiff++"></q-btn>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>
      <q-btn :label="month + ' 月'" color="green" unelevated>
        <q-popup-proxy :ref="(el) => (popupProxyRefs.month = el)">
          <q-card>
            <q-card-section class="grid grid-cols-3">
              <q-btn
                v-for="month in monthItems"
                :key="month.value"
                :label="month.label"
                unelevated
                @click="
                  () => {
                    setMonth(month.value)
                    popupProxyRefs.month.hide()
                  }
                "
              ></q-btn>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>

      <q-btn label="下個月" color="primary" unelevated @click="nextMonth"></q-btn>
      <q-btn label="下一年" color="primary" unelevated @click="setYear(year + 1)"></q-btn>
    </div>

    <div class="grid grid-cols-7 border mt-2">
      <div
        v-for="(week, index) in weekNameItems"
        :key="index"
        class="p-2 border-b text-center bg-[#cbe3f3] border-[rgba(33,92,186,0.4)]"
        :class="{ 'border-r': index % 7 < 6 }"
      >
        {{ week.CName }}
      </div>
      <div
        v-for="(date, index) in calendarDates"
        :key="index"
        class="p-2 min-h-[96px] border-[rgba(33,92,186,0.4)]"
        :class="{ 'border-b': index < 35, 'border-r': index % 7 < 6 }"
      >
        <div class="text-end" :class="{ 'text-gray-400': date.month() + 1 !== month }">
          {{ date.date() }}
        </div>
        <div>
          <slot :name="date.format('YYYY-MM-DD')" :date="date"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { monthItems, weekNameItems } from 'utils/options.js'
import { useCalendar } from 'utils/useCalendar.js'

const emit = defineEmits(['change'])
const popupProxyRefs = reactive({})

const { year, month, calendarDates } = useCalendar()

const yearDiff = ref(0)
const yearItems = computed(() => {
  const startYear = Math.floor((year.value + 20 * yearDiff.value) / 20) * 20

  return Array.from(new Array(21)).map((_, index) => {
    const value = startYear + index
    return {
      label: value + ' 年',
      value,
    }
  })
})

const changeDate = ({ year, month }) => {
  if (year) setYear(year)
  if (month) setMonth(month)
  emit('change', { year, month })
}

const setYear = (y) => {
  year.value = y
}

const setMonth = (m) => {
  month.value = m
}

const preMonth = () => {
  if (month.value === monthItems[0].value) {
    changeDate({ year: year.value - 1, month: 12 })
  } else {
    changeDate({ month: month.value - 1 })
  }
}

const nextMonth = () => {
  if (month.value === monthItems[11].value) {
    changeDate({ year: year.value + 1, month: 1 })
  } else {
    changeDate({ month: month.value + 1 })
  }
}

const preYearDisable = computed(() => year.value === 0)
const preMonthDisable = computed(() => preYearDisable.value && month.value === monthItems[0].value)

defineExpose({
  getYear: () => year.value,
  getMonth: () => month.value,
})
</script>

