import dayjs from 'dayjs';
import { computed, ref } from 'vue';
export default (current = 0, rangeNumber = 10) => {
  const weekName = [ '日', '一', '二', '三', '四', '五', '六'].map(v => `星期${v}`);
  const weekEnName = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentWeek = ref(current);
  
  const days = computed(() => {
    const startDay = dayjs().add(currentWeek.value, 'week').startOf('week');
    return new Array(7).fill(null).map((v, i) => {
      const date = startDay.add(i, 'day')
      return { date, show: date.format('MM-DD'), week: weekName[i], weekEn: weekEnName[i]};
    });
  })

  const weeks = computed(() => {
    const _half = Math.floor(rangeNumber * .5);
    

    return new Array(rangeNumber).fill(null).map((v, i) => {
      const value = i - _half;
      const baseDay = dayjs().add(value, 'week').startOf('week');
      const startDay = baseDay.add(0, 'day').format('YYYY/MM/DD');
      const endDay = baseDay.add(6, 'day').format('YYYY/MM/DD');
      return {
        text: `${startDay}~${endDay}`, value
      }
    });
  })

  const range = computed(() => {
    const _start = days.value[0].date.format('YYYY/MM/DD');
    const _end = days.value[days.value.length - 1].date.format('YYYY/MM/DD');
    return `${_start} ~ ${_end}`;
  })
  
  function nextEvent (key) {
    currentWeek.value += 1;
  }

  function prevEvent (key) {
    currentWeek.value -= 1;
  }

  return { days, weeks, range, nextEvent, prevEvent, currentWeek }
}
