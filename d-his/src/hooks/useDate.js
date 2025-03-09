import { computed, ref } from 'vue';
export default (_date = new Date()) => {
  const year = computed(() => {
    return {
      AD: _date.getFullYear(),
      Chi: _date.getFullYear() - 1911,
    };
  });

  const month = computed(() => {
    return _date.getMonth() + 1;
  });

  const day = computed(() => {
    return _date.getDate();
  });

  const allDays = computed(() => {
    return new Date(year.value.AD, month.value, 0).getDate();
  });

  const date = computed(() => {
    return {
      AD: `${year.value.AD}-${month.value < 10 ? `0${month.value}` : month.value}-${day.value < 10 ? `0${day.value}` : day.value}`,
      Chi: `${year.value.Chi}/${month.value < 10 ? `0${month.value}` : month.value}/${day.value < 10 ? `0${day.value}` : day.value}`,
    };
  });

  return {
    year: year.value,
    month: month.value,
    day: day.value,
    allDays: allDays.value,
    date: date.value,
    _date,
  };
};
