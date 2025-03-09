export const validate = (inputRefs) => {
  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (inputRef) {
      const data = { result: false }
      data.result = inputRef.validate()
      if (!data.result) data.errorInputRef = inputRef

      return data
    } else {
      // inputRef 找不到就略過
      return { result: true }
    }
  })

  const errorItem = validationArr.find((item) => !item.result)

  if (errorItem === undefined) return { result: true }
  else return errorItem
}

