import dayjs from 'dayjs';
import { computed, ref } from 'vue';
export default (current = '') => {
  const currentMonth = ref(current ? dayjs(current) : dayjs());

  const returnChineseDate = (date) => {
    const y = date.getFullYear() - 1911;
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return `${y < 100 ? `0${y}` : y}/${m < 10 ? `0${m}` : m}/${d < 10 ? `0${d}` : d}`;
  };

  const days = computed(() => {
    const startDay = currentMonth.value.startOf('month');
    const endNumber = parseInt(currentMonth.value.endOf('month').format('DD'));
    return new Array(endNumber).fill(null).map((v, i) => {
      const date = startDay.add(i, 'day');
      const chineseDate = returnChineseDate(date.$d);
      return {
        date,
        show: date.format('DD'),
        key: date.format('YYYYMMDD'),
        isCurrent: true,
        chineseDate,
      };
    });
  });

  const preDays = computed(() => {
    const startDay = currentMonth.value.startOf('month');
    const prevNumber = startDay.day();
    return new Array(prevNumber).fill(null).map((v, i) => {
      const date = startDay.subtract(prevNumber - i, 'day');
      const chineseDate = returnChineseDate(date.$d);
      return {
        date,
        show: date.format('DD'),
        key: date.format('YYYYMMDD'),
        isCurrent: false,
        chineseDate,
      };
    });
  });

  const nextDays = computed(() => {
    const startDay = currentMonth.value.endOf('month');
    const nextNumber = 6 - startDay.day();
    return new Array(nextNumber).fill(null).map((v, i) => {
      const date = startDay.add(i + 1, 'day');
      const chineseDate = returnChineseDate(date.$d);
      return {
        date,
        show: date.format('DD'),
        key: date.format('YYYYMMDD'),
        isCurrent: false,
        chineseDate,
      };
    });
  });

  const months = computed(() => {
    const startDay = currentMonth.value.startOf('year');
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

  const years = computed(() => {
    const startDay = currentMonth.value.startOf('year');
    return new Array(10).fill(null).map((v, i) => {
      const baseDay = startDay.subtract(i, 'year');
      const value = baseDay.format('YYYY');
      return {
        text: value,
        value,
      };
    });
  });

  function changeByKey(range, isAdd) {
    currentMonth.value = currentMonth.value[isAdd ? 'add' : 'subtract'](
      1,
      range
    );
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

  function changeYear(year) {
    const _diff = parseInt(year) - parseInt(currentMonth.value.format('YYYY'));
    currentMonth.value = currentMonth.value.add(_diff, 'year');
  }

  function changeMonth(month) {
    const _diff = parseInt(month) - parseInt(currentMonth.value.format('MM'));
    currentMonth.value = currentMonth.value.add(_diff, 'month');
  }

  return {
    years,
    months,
    days,
    preDays,
    nextDays,
    nextMonthEvent,
    prevMonthEvent,
    nextYearEvent,
    prevYearEvent,
    changeYear,
    changeMonth,
    currentMonth,
  };
};
