//年度
let resultYear = [{ value: null, text: "請選擇" }];
let dt = new Date();
for (var i = 2015; i <= dt.getFullYear(); i++) {
  let y = {
    value: "" + i,
    text: "" + i
  };
  resultYear.unshift(y);
}
const year = resultYear;
//季度
const season = [
  {
    value: null,
    text: "請選擇"
  },
  {
    value: "s1",
    text: "第一季"
  },
  {
    value: "s2",
    text: "第二季"
  },
  {
    value: "s3",
    text: "第三季"
  },
  {
    value: "s4",
    text: "第四季"
  }
];

//月度
let resultMnth = [{ value: null, text: "請選擇" }];
for (let i = 1; i <= 12; i++) {
  let y = {
    value: "" + i,
    text: "" + i
  };
  resultMnth.push(y);
}
const Mnth = resultMnth;

export { season, year, Mnth };
