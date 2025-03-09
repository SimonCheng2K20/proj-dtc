//any(d:d/No--過濾此資料型態是array底下的資料

const arrFilterWork = (key, arrkey, qs, v, first = false) =>
  qs + // 累積的參數
  (first ? "&$filter=" : " and ") + // 是不是第一個
  key + // 主項目屬性
  `/any(d:d${Boolean(arrkey) ? "/" : ""}` + // 是否有該物件下的參數有的話給予斜線
  arrkey + // 子參數
  ` eq '${v}')`; // 等於該值

export const arrFilter = (key, arrkey, qs, v) =>
  arrFilterWork(key, arrkey, qs, v, true); // 第一個filter

export const appendArrFilter = (key, arrkey, qs, v) =>
  arrFilterWork(key, arrkey, qs, v); // 先前有註冊過的

//此種是過濾資料為object底下的資料
// export const objFilter = function (key, objkey, qs, v) {
//   return qs + `&$filter=${key}/${objkey} eq '${v}'`;
// };
export const objFilter = function (key, objkey, qs, v) {
  return qs + `&$filter=contains(${key}/${objkey}, '${v}')`;
};

export const appendObjFilter = function (key, objkey, qs, v) {
  return qs + ` and contains(${key}/${objkey}, '${v}')`;
};

export const substringofFilter = function (key, qs, v) {
  return qs + `&$filter=contains(tolower(${key}),'${v}' )`;
};

export const appendSubstringofFilter = function (key, qs, v) {
  return qs + ` and contains(tolower(${key}),'${v}' )`;
};

export const equalFilter = function (key, qs, v) {
  return qs + `&$filter=${key} eq '${v}'`;
};

export const appendEqualFilter = function (key, qs, v) {
  return qs + ` and ${key} eq '${v}'`;
};

export const equalNumFilter = function (key, qs, v) {
  return qs + `&$filter=${key} eq ${v}`;
};

export const appendEqualNumFilter = function (key, qs, v) {
  return qs + ` and ${key} eq ${v}`;
};

export const equalSpecificNumFilter = function (key, qs, v) {
  return (
    qs +
    `&$filter=(${key} eq 9${v} or ${key} eq 1${v} or ${key} eq 2${v} or ${key} eq 3${v} or ${key} eq 4${v} or ${key} eq 5${v})`
  );
};

export const appendEqualSpecificNumFilter = function (key, qs, v) {
  return (
    qs +
    ` and (${key} eq 9${v} or ${key} eq 1${v} or ${key} eq 2${v} or ${key} eq 3${v} or ${key} eq 4${v} or ${key} eq 5${v})`
  );
};

export const equalNumsFilter = function (key, qs, v) {
  let qStr = "";
  v.forEach((s) => {
    if (v.indexOf(s) == 0) {
      qStr = qStr + `${key} eq ${s}`;
    } else {
      qStr = qStr + ` or ${key} eq ${s}`;
    }
  });
  return qs + `&$filter=(${qStr})`;
};

export const appendEqualNumsFilter = function (key, qs, v) {
  let qStr = "";
  v.forEach((s) => {
    if (v.indexOf(s) == 0) {
      qStr = qStr + `${key} eq ${s}`;
    } else {
      qStr = qStr + ` or ${key} eq ${s}`;
    }
  });
  return qs + ` and (${qStr})`;
};

export const timeFilter = function (key, qs, timeone, timetwo) {
  return (
    qs +
    `&$filter=${key} ge ${timeone}T00:00:00%2b08:00 and ${key} le ${timetwo}T23:59:59%2b08:00`
  );
};

export const appendTimeFilter = function (key, qs, timeone, timetwo) {
  return (
    qs +
    ` and ${key} ge ${timeone}T00:00:00%2b08:00 and ${key} le ${timetwo}T23:59:59%2b08:00`
  );
};

export const timeFilterGe = function (key, qs, time) {
  return qs + `&$filter=${key} ge ${time}T00:00:00%2b08:00`;
};
export const appendTimeFilterGe = function (key, qs, time) {
  return qs + ` and ${key} ge ${time}T00:00:00%2b08:00`;
};
export const timeFilterLe = function (key, qs, time) {
  return qs + `&$filter=${key} le ${time}T23:59:59%2b08:00`;
};
export const appendTimeFilterLe = function (key, qs, time) {
  return qs + ` and ${key} le ${time}T23:59:59%2b08:00`;
};

export const timeFilterEqual = function (key, qs, time, type) {
  return qs + `&$filter=${type}(${key}) eq ${time}`;
};

export const appendTimeFilterEqual = function (key, qs, time, type) {
  return qs + ` and ${type}(${key}) eq ${time}`;
};

export const getLocalISOString = function (date) {
  if (!Boolean(date)) return;
  return (
    date.getFullYear() +
    "-" +
    `${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }` +
    "-" +
    `${date.getDate() + 1 < 10 ? "0" + date.getDate() : date.getDate()}`
  );
};
