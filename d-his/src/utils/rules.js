import { indexOf } from 'lodash-es'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const identifier = [
  (val) => (val !== null && val !== '') || '請輸入身分證',
  (val) => {
    const regexp = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/i
    return regexp.test(val) || '請輸入正確的身分證'
  },
  (val) => {
    // A = 10, B = 11 ...
    const arr = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'M',
      'N',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'X',
      'Y',
      'W',
      'Z',
      'I',
      'O',
    ]

    const index = indexOf(arr, val.substring(0, 1).toUpperCase())
    const firstNum = String(index + 10)

    const firstSum = Number(firstNum.substring(0, 1)) + Number(firstNum.substring(1, 2)) * 9

    let lastSum = 0
    for (let i = 0, str = val.substring(1, 9); i < 8; i++) {
      lastSum += Number(str[i]) * (8 - i)
    }

    const remainder = (firstSum + lastSum) % 10
    const checkNum = remainder !== 0 ? 10 - remainder : 0

    if (checkNum === Number(val[9])) {
      return true
    } else {
      return '請輸入正確的身分證'
    }
  },
]

/**
 * @param { Object } options { title: String, type: input, select, ... }
 */
export const useRequired = (options) => {
  if (options.type === 'multiple-select') return [(val) => val.length > 0 || `請選擇${options.title}`]
  else
    return [(val) => (val !== null && val !== '') || `請${options.type === 'input' ? '輸入' : '選擇'}${options.title}`]
}

/**
 * @param { Object } options { title: String, dateRange: [StartDate, EndDate] }
 */
export const useDate = (options) => {
  const ruleArr = [
    (val) => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val) || '無效的日期',
    (val) => dayjs(val).isValid() || '無效的日期',
  ]
  if (options.dateRange[0]) {
    const startDate = dayjs.isDayjs(options.dateRange[0]) ? options.dateRange[0] : dayjs(options.dateRange[0])
    ruleArr.push(
      (val) => dayjs(val).isSameOrAfter(startDate) || `${options.title}不得早於${startDate.format('YYYY-MM-DD')}`
    )
  }
  if (options.dateRange[1]) {
    const endDate = dayjs.isDayjs(options.dateRange[1]) ? options.dateRange[1] : dayjs(options.dateRange[1])
    ruleArr.push(
      (val) => dayjs(val).isSameOrBefore(dayjs(endDate)) || `${options.title}不得超過${endDate.format('YYYY-MM-DD')}`
    )
  }
  return ruleArr
}

