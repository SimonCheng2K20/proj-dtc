import { ref, computed } from 'vue'
import dayjs from 'dayjs'

export const useCalendar = (type = 'month') => {
  const today = dayjs()
  const year = ref(today.year())
  const month = ref(today.month() + 1)

  const calendarDates = computed(() => {
    const firstDayOnMonth = dayjs(`${year.value}-${month.value}-01`)
    const firstDate = firstDayOnMonth.subtract(firstDayOnMonth.$W, 'day')

    const calendarArr = Array.from(new Array(type === 'month' ? 42 : 7)).map((_, index) => firstDate.add(index, 'day'))

    return calendarArr
  })

  return { year, month, calendarDates }
}

