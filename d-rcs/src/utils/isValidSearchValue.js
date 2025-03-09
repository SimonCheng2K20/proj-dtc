import { isString, isNumber, isBoolean, isArray, isDate } from 'lodash-es'

const isValidSearchValue = (value) => {
  if (((isString(value) || isNumber(value) || isBoolean(value)) && !!String(value)) || (isArray(value) && value.length > 0) || isDate(value)) return true
  else return false
}

export default isValidSearchValue
