export const get = (source, pathStr) => {
  // a[0].b -> a.0.b -> ['a', '0', 'b']
  const paths = pathStr.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = source
  for (const path of paths) {
    result = Object(result)[path]
  }
  return result
}

export const set = (source, pathStr, value) => {
  // a[0].b -> a.0.b -> ['a', '0', 'b']
  const paths = pathStr.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = source
  const length = paths.length
  for (const [index, path] of paths.entries()) {
    if (length === index + 1) {
      result[path] = value
    } else {
      result = Object(result)[path]
    }
  }
  return result
}
