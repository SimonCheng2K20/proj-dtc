import isValidQueryValue from './isValidQueryValue.js'

const setSearchQuery = (queryOptions) => {
  if (!!queryOptions === false) return ''

  const queryArr = Object.entries(queryOptions)
    .filter(([key, value]) => isValidQueryValue(value))
    .map(([key, value]) => `${key}=${value}`)

  return queryArr.length > 0 ? '?' + queryArr.join('&') : ''
}

export default setSearchQuery
