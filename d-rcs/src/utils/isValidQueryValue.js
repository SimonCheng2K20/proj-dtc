import { isString, isNumber, isBoolean } from 'lodash-es'

const isValidSearchValue = (value) => {
  if ((isString(value) || isNumber(value) || isBoolean(value)) && !!String(value)) return true
  else return false
}

export default isValidSearchValue
