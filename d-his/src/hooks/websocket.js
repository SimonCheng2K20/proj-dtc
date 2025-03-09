let cardReader = null

const connectCardReader = () => {
  return new Promise((resolve) => {
    cardReader = new WebSocket('cardReader://127.0.0.1:8889/Chat')

    cardReader.onopen = () => resolve({ result: true })

    cardReader.onerror = (error) => {
      console.log('onerror:', error)
      resolve({ error })
    }

    cardReader.onclose = (error) => {
      cardReader = null
      console.log('onclose:', error)
      resolve({ error })
    }
  })
}

export const writeMedicalCard = async (base64Data) => {
  if (cardReader === null) {
    const { result, error } = await connectCardReader()
    if (error) return { error }
  }

  return new Promise((resolve) => {
    const onmessage = (evt) => {
      const error = evt.data.match(/^讀卡程式錯誤，(.*)/)?.[1]
      cardReader.onmessage = null
      if (!!error) {
        resolve({ error })
      } else {
        resolve({ data: JSON.parse(evt.data) })
      }
    }

    cardReader.send(`WriteNhiCard:${base64Data}`)
    cardReader.onmessage = onmessage
  })
}

export const checkNhiCard = async () => {
  if (cardReader === null) {
    const { result, error } = await connectCardReader()
    if (error) return { error }
  }

  //用來讀取健保卡
  return new Promise((resolve) => {
    const onmessage = (evt) => {
      const error = evt.data.match(/^讀卡程式錯誤，(.*)/)?.[1]
      cardReader.onmessage = null
      if (!!error) {
        resolve({ error })
      } else {
        resolve({ data: JSON.parse(evt.data) })
      }
    }

    cardReader.send(`checkNhiCard`)
    cardReader.onmessage = onmessage
  })
}

