const isValidSearchValue = (value) => {
  if ((typeof value === 'string' && !!value) || typeof value === 'number' || typeof value === 'boolean' || (Array.isArray(value) && value.length > 0))
    return true
  else return false
}

export default isValidSearchValue
