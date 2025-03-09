import dayjs from 'dayjs';
import { computed, ref } from 'vue';
export default (current = '') => {
  // const currentDay = ref(dayjs(dayjs().endOf('week').format("YYYY-MM-DD 00:00:00")));
  const currentDay = ref(dayjs());
  const fillZero = (str, num = 2) => ('' + str).padStart(num, 0) 
  const getChineseDate = (date) => `${ fillZero(date.getFullYear() - 1911, 3)}/${fillZero(date.getMonth() + 1)}/${fillZero(date.getDate())}`;
  const weekObj = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat']
  
  const getDayList = (start, endNumber) => new Array(endNumber).fill(null).map((v, i) => {
    const date = start.add(i, 'day');
    const key = date.format('YYYY/MM/DD');
    const weekDay = weekObj[date.day()]
    return {
      date,
      show: `${weekDay}<br />${date.format('DD')}`,
      key,
      isToday: dayjs().isSame(key, 'day'),
      chineseDate: getChineseDate(date.$d),
    };
  })

  const generateDays = (key) => {
    const startDay = currentDay.value.startOf(key);
    const endNumber = Math.abs(startDay.diff(currentDay.value.endOf(key), 'd'))
    return getDayList(startDay, endNumber + 1);
  }

  const getCurrentWeekValue = (key = 'month') => {  // 取得是否在範圍內的週數
    return weeks[key].findIndex(item => {
      const _current = dayjs(currentDay.value.format('YYYY-MM-DD 12:00:00'))
      return item.start.isBefore(_current) && item.end.isAfter(_current)
    } )
  } 

  const currentWeek = computed({
    get: () => getCurrentWeekValue('month'),
    set: value => {
      currentDay.value = weeks.month[value].start
      // console.log({ value })
    }
  })

  const currentYear = computed({
    get: () => parseInt(currentDay.value.format('YYYY')),
    set: value => {
      changeYear (value)
    }
  })
  const currentMonth = computed({
    get: () => parseInt(currentDay.value.format('MM')),
    set: value => {
      changeMonth (value)
    }
  })
  // const currentMonth = ref(new Date().getMonth + 1)

  const generateWeeks = (key) => {  // 生成週次的物件
    const _start = currentDay.value.startOf(key).startOf('week');
    const _end = currentDay.value.endOf(key).endOf('week');
    return new Array(Math.abs(_start.diff(_end, 'w')) + 1).fill(null).map((v, i) => {
      const date = _start.add(i, 'week')
      const start = date.startOf('week')
      const end = date.endOf('week')
      const key = date.format('YYYY/MM/DD');
      return {
        start,
        end,
        isThisWeek: dayjs().isSame(key, 'week'),
        show: `${start.format('YYYY-MM-DD')} ~ ${end.format('YYYY-MM-DD')}`,
        value: i
      }
    })
  } 

  const days = {
    get week () { return generateDays('week') },
    get month () { return generateDays('month') },
    get year () { return generateDays('year') }
  }

  const weeks = {
    get month () { return generateWeeks('month') },
    get year () { return generateWeeks('year') }
  }

  const months = computed(() => {
    const startDay = currentDay.value.startOf('year');
    return new Array(12).fill(null).map((v, i) => {
      const baseDay = startDay.add(i, 'month');
      const value = baseDay.format('YYYY-MM');
      return {
        text: value,
        value,
        date: baseDay,
      };
    });
  });

  const years = computed(() => new Array(10).fill(new Date().getFullYear()).map((v, idx) => { const value = v - idx; return { text: value, value } }));

  function changeByKey(range, isAdd) {
    currentDay.value = currentDay.value.add(isAdd ? 1 : -1, range);
  }

  function nextWeekEvent() {
    changeByKey('week', true);
  }

  function prevWeekEvent() {
    changeByKey('week', false);
  }

  function nextMonthEvent() {
    changeByKey('month', true);
  }

  function prevMonthEvent() {
    changeByKey('month', false);
  }

  function nextYearEvent() {
    changeByKey('year', true);
  }

  function prevYearEvent() {
    changeByKey('year', false);
  }

  function changeMoment (value, format, key) {
    const _diff = parseInt(value) - parseInt(currentDay.value.format(format));
    currentDay.value = currentDay.value.add(_diff, key);
  }

  function changeWeek (value) {
    currentDay.value = currentDay.value.add(value, 'week');
  }

  function changeMonth(month) {
    changeMoment(month, 'MM', 'month')
  }

  function changeYear(year) {
    changeMoment(year, 'YYYY', 'year')
  }
  

  return {
    years,
    months,
    weeks,
    days,
    currentDay,
    currentWeek,
    currentYear,
    currentMonth,
    nextWeekEvent,
    prevWeekEvent,
    nextMonthEvent,
    prevMonthEvent,
    nextYearEvent,
    prevYearEvent,
    changeYear,
    changeMonth,
    changeWeek
  };
};
