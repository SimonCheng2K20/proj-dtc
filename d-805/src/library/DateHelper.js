export default class DateHelper {
  //取得上個月第一天
  static getPrevMonthFirst() {
    let date = new Date();
    date.setDate(1); //設置到當月第一天
    date.setMonth(date.getMonth() - 1); //再設置成下個月
    date.setHours(0, 0, 0, 0);
    return date;
  }
  //取得上個月最後一天
  static getPrevMonthLast() {
    let date = new Date();
    date.setDate(1); //設置到當月第一天
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth()); //再設置成下下個月
    date.setTime(date.getTime() - 1);
    return date;
  }
  //取得下個月第一天
  static getNextMonthFirst() {
    let date = new Date();
    date.setDate(1); //設置到當月第一天
    date.setMonth(date.getMonth() + 1); //再設置成下個月
    date.setHours(0, 0, 0, 0);
    return date;
  }
  //取得下個月最後一天
  static getNextMonthLast() {
    let date = new Date();
    date.setDate(1); //設置到當月第一天
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() + 2); //再設置成下下個月
    date.setTime(date.getTime() - 1);
    return date;
  }
  /**
   * 獲取當前月的最後一天
   */
  static getMonthLast(date) {
    date = new Date(date.getTime());
    date.setDate(1); //設置到當月第一天
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() + 1); //再設置成下個月
    date.setTime(date.getTime() - 1);
    return date;
  }
  /**
   * 獲取當前月的最後一天
   */
  static getYearLast(date) {
    date = new Date(date.getTime());
    date.setDate(1); //設置到當月第一天
    date.setHours(0, 0, 0, 0);
    date.setFullYear(date.getFullYear() + 1); //再設置成下個月
    date.setTime(date.getTime() - 1);
    return date;
  }
  //取得當週第一天(sundayFirst=0第一天為週日)
  static getWeekFist(date, sundayFirst) {
    if (date == null || !(date instanceof Date)) date = new Date();
    else date = new Date(date.getTime());
    if (sundayFirst == false) {
      let day = date.getDay();
      if (day === 0)
        day = 7;
      date.setDate(date.getDate() - (day - 1)); //設置到當週第一天
    } else {
      let day = date.getDay();
      date.setDate(date.getDate() - day); //設置到當週第一天
    }
    date.setHours(0, 0, 0, 0);
    return date;
  }
  //取得當週最後一天(sundayFirst=0第一天為週日)
  static getWeekLast(date, sundayFirst) {
    if (date == null || !(date instanceof Date)) date = new Date();
    else date = new Date(date.getTime());
    date.setHours(0, 0, 0, 0);
    if (sundayFirst == false) {
      let day = date.getDay();
      if (day === 0)
        day = 7;
      date.setDate(date.getDate() + (8 - day)); //設置到下週第一天
    } else {
      let day = date.getDay();
      date.setDate(date.getDate() + 7 - day); //設置到下週第一天
    }
    date.setTime(date.getTime() - 1);
    return date;
  }
  //檢查兩時間區段是否重疊
  static dateRangeOverlaps(start1, end1, start2, end2) {
    return Math.max(new Date(start1).getTime(), new Date(start2).getTime()) < Math.min(new Date(end1).getTime(), new Date(end2).getTime());
  }

  /**
   * 取得此月份的所有星期N (ex.所有星期一, 所有星期二...)
   * ** JSON format {"value": N, "label": "M月D日 (週N)}
   * @param {月份日期}} date 
   */
  static getAllSpecificDayInDaMonth(date, targetDay) {
    let t0 = performance.now();
    let iterateDay = 1;
    date.setDate(iterateDay);
    let days = [];
    let daMonth = date.getMonth();
    while (date.getMonth() == daMonth) {
      if (date.getDay() == targetDay) {
        let valueObj = {
          "value": date.getDate(),
          "label": (date.getMonth() + 1) + "月" + date.getDate() + "日 (" + this.parseWeekDayToChinese(date.getDay()) + ")"
        }
        days.push(valueObj);
      }
      iterateDay += 1;
      date.setDate(iterateDay);
    }
    let t1 = performance.now();
    console.log("Getting all days in month takes: " + (t1 - t0) + "ms");
    return days;
  }

  static addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  /**
   * 取得此月份的所有星期N (ex.所有星期一, 所有星期二...)
   * ** JSON format {"value": N, "label": "M月D日 (週N)}
   * @param {月份日期}} date 
   */
  static parseWeekDayToChinese(day) {
    if (day == 1)
      return "週一";
    else if (day == 2)
      return "週二";
    else if (day == 3)
      return "週三";
    else if (day == 4)
      return "週四";
    else if (day == 5)
      return "週五";
    else if (day == 6)
      return "週六";
    else
      return "週日";
  }
}
