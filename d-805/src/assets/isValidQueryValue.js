const isValidSearchValue = (value) => {
  if ((typeof value === 'string' && !!value) || typeof value === 'number' || typeof value === 'boolean') return true
  else return false
}

export default isValidSearchValue
