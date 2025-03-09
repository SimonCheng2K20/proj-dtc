const setKeyOperatorValueString = (item) => {
  switch (item.operator) {
    case 'gt':
    case 'ge':
    case 'lt':
    case 'le': {
      let key = item.key
      if (item.dateMethod) {
        key = `${item.dateMethod}(${key})`
      }
      return `${key} ${item.operator} ${item.value}`
    }
    case 'eq':
    case 'ne': {
      if (typeof item.value === 'string') {
        return `${item.key} ${item.operator} '${item.value}'`
      } else {
        let key = item.key
        if (item.dateMethod) key = `${item.dateMethod}(${key})`
        return `${key} ${item.operator} ${item.value}`
      }
    }
    case 'contains':
      return `contains(${item.key},'${item.value}')`
    case 'startswith':
      return `startswith(${item.key},'${item.value}')`
  }
}

const setLambdaString = (item) => {
  return `${item.lambda}(c:c/${setKeyOperatorValueString(item)})`
}

const setOdataFilter = (item) => {
  if (item.lambda) return setLambdaString(item)
  else return setKeyOperatorValueString(item)
}

export default setOdataFilter
