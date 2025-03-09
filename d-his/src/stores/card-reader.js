import { defineStore } from 'pinia'
import dayjs from 'dayjs'

export const useCardReaderStore = defineStore('card-reader', {
  state: () => ({
    cardReader: null,
  }),
  actions: {
    connectCardReader() {
      return new Promise((resolve) => {
        this.cardReader = new WebSocket('ws://127.0.0.1:8889/Chat')

        this.cardReader.onopen = () => resolve({ result: true })

        this.cardReader.onerror = (evt) => {
          this.cardReader = null
          const errorMessage = '連線發生錯誤'
          console.log(`${errorMessage}:`, evt)
          resolve({ error: errorMessage })
        }

        this.cardReader.onclose = (evt) => {
          this.cardReader = null
          const errorMessage = '連線已關閉'
          console.log(`${errorMessage}:`, evt)
          resolve({ error: errorMessage })
        }
      })
    },
    async writeHeathyCard(base64Data) {
      if (this.cardReader === null) {
        const { error } = await this.connectCardReader()
        if (error) return { error }
      }

      return new Promise((resolve) => {
        const onmessage = (evt) => {
          try {
            const error = evt.data.match(/^讀卡程式錯誤，(.*)/)?.[1]
            this.cardReader.onmessage = null
            if (!!error) {
              resolve({ error })
            } else {
              resolve({ data: JSON.parse(evt.data) })
            }
          } catch (error) {
            // data 錯誤的話可能不會是 JSON，需要 catch
            resolve({ error })
          }
        }

        this.cardReader.send(`WriteNhiCard:${base64Data}`)
        this.cardReader.onmessage = onmessage
      })
    },
    async readHealthyCard() {
      if (this.cardReader === null) {
        const { error } = await this.connectCardReader()
        if (error) return { error }
      }

      // 用來讀取健保卡
      return new Promise((resolve) => {
        const onmessage = (evt) => {
          try {
            const error = evt.data.match(/^讀卡程式錯誤，(.*)/)?.[1]
            this.cardReader.onmessage = null
            if (!!error) {
              resolve({ error })
            } else {
              resolve({ data: JSON.parse(evt.data) })
            }
          } catch (error) {
            // data 錯誤的話可能不會是 JSON，需要 catch
            resolve({ error })
          }
        }

        this.cardReader.send(`GetRegisterBasic`)
        this.cardReader.onmessage = onmessage
      })
    },
  },
})
