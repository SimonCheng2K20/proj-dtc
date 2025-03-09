import { isString, isNumber, isBoolean } from 'lodash-es'

const isValidSearchValue = (value) => {
  if ((isString(value) && !!value) || isNumber(value) || isBoolean(value)) return true
  else return false
}

export default isValidSearchValue

