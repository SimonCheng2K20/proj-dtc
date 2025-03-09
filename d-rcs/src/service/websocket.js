import store from '@/store'
import router from '@/router'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

const toast = useToast()
//醫事人員卡認證: STEP1:先認證卡片身分證是否與登入帳號的身分證相同 ， STEP2:認證卡片密碼(此步驟錯誤達三次醫事人員卡就會被鎖住)--主要用在首頁登入且輸入醫事人員卡密碼時
//this originnal: all combined
export const medicalCardWebSocket = (accountIdentifier, inputcode) => {
  //check Identifier and inputcode
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.onopen = () => {
      ws.send(`checkCard:${accountIdentifier}`)
    }

    ws.onerror = (err) => {
      // console.log("webSocket connection error");
      reject(err)
    }

    ws.onclose = () => {
      // console.log("webSocket connection close");
    }

    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      // console.log("webSocket event", event);

      if (`${event?.data}`.includes('此卡片醫事人員身分證號為')) {
        toast.error(`登入的醫師帳號身分證字號與卡片不符合`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('密碼模組失敗')) {
        toast.error(`初始化失敗，裝置不存在(偵測不到憑證載具 or 晶片接觸不良 or 此帳號未設定身分證)`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('超過裝置設定次數')) {
        toast.error(`輸入錯誤超過三次，已進行鎖卡`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('失敗PIN碼錯誤')) {
        toast.error(`醫事人員卡密碼錯誤`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('OK')) {
        // console.log("account match ok");

        ws.send(`signCert:${inputcode}`)
      } else {
        store.commit('m_setMedicalCardData', `${event?.data}`)
        toast.success(`醫事人員卡認證成功!`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        resolve('codematchok')
      }
    }
  }).catch((e) => {
    // console.log(e);
    return e
  })
}

export const medicalCardWebSocketCheckIdentifier = () => {
  //only for check Identifier
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.onopen = () => {
      const accountIdentifier = store.state?.others ? store.state?.others.Identifier : ''

      if (!Boolean(accountIdentifier)) {
        toast.error(`查無目前帳號身分證，請在帳號管理完成此醫師帳號的身分證填寫才可進行醫事人員卡認證`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('查無目前帳號身分證')
      }

      // console.log("webSocket connection open");
      ws.send(`checkCard:${accountIdentifier}`)
    }

    ws.onerror = (err) => {
      // console.log("webSocket connection error");
      reject(err)
    }

    ws.onclose = () => {
      // console.log("webSocket connection close");
    }

    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      // console.log("webSocket event", event);

      if (`${event?.data}`.includes('此卡片醫事人員身分證號為')) {
        toast.error(`登入的醫師帳號身分證字號與卡片不符合`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('密碼模組失敗')) {
        toast.error(`初始化失敗，裝置不存在(偵測不到憑證載具 or 晶片接觸不良)`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('OK')) {
        // console.log("matchok");
        toast.success('帳號身分證與卡片身分證符合，請輸入密碼', {
          timeout: 5000,
          hideProgressBar: true,
        })
        resolve('matchok')
        ws.close()
      } else {
        // console.log(`${event?.data}`);
        ws.close()
      }
    }
  }).catch((e) => {
    console.log(e)
    return e
  })
}

export const medicalCardWebSocketCheckCode = (inputcode) => {
  //only for check Code
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.onopen = () => {
      // console.log("webSocket connection open");
      ws.send(`signCert:${inputcode}`)
    }

    ws.onerror = (err) => {
      // console.log("webSocket connection error");
      reject(err)
    }

    ws.onclose = () => {
      // console.log("webSocket connection close");
    }

    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      if (`${event?.data}`.includes('密碼模組失敗')) {
        toast.error(`初始化失敗，裝置不存在(偵測不到憑證載具 or 晶片接觸不良)`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('失敗PIN碼錯誤')) {
        toast.error(`醫事人員卡密碼錯誤`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('超過裝置設定次數')) {
        toast.error(`輸入錯誤超過三次，已進行鎖卡`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else if (`${event?.data}`.includes('金鑰失敗')) {
        toast.error(`取私祕金鑰失敗指定的物件不存在`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        reject('error')
      } else {
        store.commit('m_setMedicalCardData', `${event?.data}`)
        toast.success(`醫事人員卡認證成功!`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        ws.close()
        resolve('matchok')
      }
    }
  }).catch((e) => {
    console.log(e)
    return e
  })
}

export const medicalWebSocketCheckServer = () => {
  //only for check 是否已開啟讀卡機軟體
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.onopen = () => {
      resolve(ws)
      // console.log("webSocket connection open");
    }

    ws.onerror = (err) => {
      // console.log("webSocket connection error");
      reject(err)
    }
  }).catch((e) => {
    console.log(e)
    return e
  })
}

export const healthIDCardWebSocketServer = () => {
  //用來讀取健保卡
  return new Promise((resolve, reject) => {
    let ws = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.onopen = () => {
      // console.log("webSocket connection open");
      ws.send(`checkNhiCard`)
    }

    ws.onerror = (err) => {
      // console.log("webSocket connection error");
      reject(err)
    }
    ws.onmessage = (event) => {
      // console.log('webSocket event', event, event.data);

      if (`${event?.data}`.includes('Error')) {
        reject(event?.data)
        ws.close()
      } else {
        // 舊的卡片 ' ' 會讀出 unicode
        const data = event.data.split(/\u0000|\x00| /g).filter((item) => item !== '')
        const no = data[0].match(/^[0-9]*/)[0]
        const name = data[0].slice(no.length)
        const id = data[1].slice(0, 10)
        const birthday = data[1].slice(10, 17)
        const gender = data[1].slice(17, 18)

        resolve({ no, name, id, birthday, gender })
        ws.close()
      }
    }
  })
}

const ws = new WebSocket('ws://127.0.0.1:8889/Chat')

export const hisWebSocketServerCallServer = () => {
  //用來觸發his & pacs-Step1:註冊遠距醫療資訊平台Server網址
  return new Promise((resolve, reject) => {
    const serverurl = `https://${window.location.hostname}`

    ws.onopen = () => {
      ws.send(`serverUrl=${serverurl}`)
    }

    ws.onerror = (err) => {
      reject(err)
    }

    ws.onclose = (err) => {
      reject(err)
    }

    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      console.log('webSocket event', event)
      if (`${event?.data}`.includes('OK')) {
        resolve('ok')
        ws.close()
      } else {
        reject(event?.data)
        ws.close()
      }
    }
  })
}

export const hisWebSocketServerCallPatientData = (identifier) => {
  //用來觸發his & pacs--Step2:向HIS要求病患病歷--用身分證去取得his資料

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    ws.onopen = () => {
      ws.send(`identifier=${identifier},token=${tokendata}`)
    }

    ws.onerror = (err) => {
      reject(err)
    }

    ws.onclose = (err) => {
      reject(err)
    }
    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      // console.log("webSocket event HIS", event);
      if (`${event?.data}`) {
        resolve(event?.data)
        ws.close()
      } else {
        reject(event?.data)
        ws.close()
      }
    }
  })
}

export const hisWebSocketServerCallPatientDataUsePatientId = (patientId) => {
  //用來觸發his & pacs--Step2:向HIS要求病患病歷--用病歷號去取得his資料

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    ws.onopen = () => {
      ws.send(`patientId=${patientId},token=${tokendata}`)
    }

    ws.onerror = (err) => {
      reject(err)
    }

    ws.onclose = (err) => {
      reject(err)
    }
    //接收 Server 發送的訊息
    ws.onmessage = (event) => {
      // console.log("webSocket event HIS", event);
      if (`${event?.data}`) {
        resolve(event?.data)
        ws.close()
      } else {
        reject(event?.data)
        ws.close()
      }
    }
  })
}
