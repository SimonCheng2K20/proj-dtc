import moment from 'moment'
import store from '../../store/index.js'
import { Message } from 'element-ui'
import { indexOf } from 'lodash'

export default {
  delay(x) {
    return new Promise(function (resolve) {
      setTimeout(() => {
        resolve()
      }, x)
    })
  },
  YYYYMMDD(x) {
    return moment(x).format('YYYY-MM-DD')
  },
  YYYYMMDDHHmm(x) {
    return moment(x).format('YYYY-MM-DD HH:mm')
  },
  arrToObj(x, key) {
    let res = {}
    for (let item of x) {
      res[item[key]] = item
    }
    return res
  },
  treeToArr(x, first = true) {
    if (first) {
      let res = []
      for (let item of x) {
        res.push(...this.treeToArr(item, false))
      }
      return res
    } else {
      if (x.children && x.children.length) {
        let res = [x]
        for (let item of x.children) {
          let data = JSON.parse(JSON.stringify(item))
          data.pid = x.id
          res.push(...this.treeToArr(data, false))
        }
        return res
      } else return [x]
    }
  },
  arrToTree(x, first = true, arr) {
    if (first) {
      let res = []
      let nonePid = x.filter((r) => !r.pid)
      for (let item of nonePid) {
        res.push(this.arrToTree(item, false, x))
      }
      return res
    } else {
      let children = arr.filter((r) => r.pid === x.id)
      if (children.length) {
        let data = { ...x, children: [] }
        for (let item of children) {
          data.children.push(this.arrToTree(item, false, arr))
        }
        return data
      } else return x
    }
  },
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },
  randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16)
  },
  permissionsCheck(x, y) {
    let res = true
    for (let item of Object.keys(x)) {
      if (!y[item]) {
        res = false
        break
      }
    }
    console.log(x, y)
    return res
  },
  toODataOrder(prop, order) {
    if (!prop || !order) return null
    else {
      if (order === 'ascending') return `${prop}`
      else if (order === 'descending') return `${prop} desc`
    }
  },
  stringToDate(x, arr = []) {
    let res = []
    for (let item of arr) {
      res.push(x.substr(item[0], item[1]))
    }
    return res.join('-')
  },
  cardReader: null,
  connectCardReader() {
    return new Promise((resolve) => {
      this.cardReader = new WebSocket('ws://127.0.0.1:9889/Chat')

      this.cardReader.onopen = () => {
        resolve({ data: true })
      }

      this.cardReader.onerror = (error) => {
        console.log('onerror:', error)
        resolve({ error })
      }

      this.cardReader.onclose = (error) => {
        this.cardReader = null
        console.log('onclose:', error)
        resolve({ error })
      }

    })
  },
  async medicalCardCheck() {

    if (this.cardReader === null) {
      const { error } = await this.connectCardReader()
      if (error) {
        return { error: '找不到讀卡程式' }
      }
    }

    return new Promise((resolve) => {
      const onmessage = (evt) => {
        const successReg = /^此卡片醫事人員身份證號為『(.*)』,姓名為『(.*)』!/;
        
        const error = evt.data.match(/^Error:(.*)/)?.[1]

        const successId = evt.data.match(successReg)?.[1]
        const successName = evt.data.match(successReg)?.[2]

        this.cardReader.onmessage = null

        if (error) {
          resolve({ error })

          store.commit('cardInfo', {
            Id: null,
            Name: null,
            Connect: false,
          })
        }
        else {
          // console.log(`medicalCardCheck > blablabla:`, evt, evt.data)
          // console.log(`successId: `, successId)
          // console.log(`successName: `, successName)
          resolve({ data: {
            Name: successId,
            Id: successName
          }})

          store.commit('cardInfo', {
            Id: successId,
            Name: successName,
            Connect: true,
          })

        }
      }

      this.cardReader.send(`checkCard:`)
      this.cardReader.onmessage = onmessage
    })
  },
  async medicalCardCertify(identifier) {

    if (this.cardReader === null) {
      const { error } = await this.connectCardReader()
      if (error) {
        return { error: '找不到讀卡程式' }
      }
    }

    return new Promise((resolve) => {
      const onmessage = (evt) => {
        const error = evt.data.match(/^Error:(.*)/)?.[1]
        this.cardReader.onmessage = null
        if (error) {
          resolve({ error })
        }
        else if(evt.data === 'OK'){
          resolve({ data: '醫事人員卡認證成功' })
        }
        else {
          Message.error(`醫事卡身分證號 與 登入帳號身分證號不符`)
          resolve(`醫事卡身分證號 與 登入帳號身分證號不符`)
        }
      }

      this.cardReader.send(`checkCard:${identifier}`)
      this.cardReader.onmessage = onmessage
    })
  },
  async medicalCardCheckPassword(password) {
    if (this.cardReader === null) {
      const { data, error } = await this.connectCardReader()
      if (error) {
        return { data, error: '找不到讀卡程式' }
      }
    }

    return new Promise((resolve) => {
      const onmessage = (evt) => {
        const error = evt.data.match(/^Error:(.*)/)?.[1]
        this.cardReader.onmessage = null
        if (error) resolve({ error })
        else {
          console.log(`evt.data: `, evt.data)
          store.commit('setSignature', evt.data)
          resolve({ data: '醫事人員卡認證成功' })
        }
      }

      this.cardReader.send(`signCert:${password}`)
      this.cardReader.onmessage = onmessage
    })
  },
  checkIdValid(val){
    
    // let startVal = (val) => (val !== null && val !== '') || '請輸入身分證'
    // let processVal = (val) => {
    //   const regexp = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/i
    //   return regexp.test(val) || '請輸入正確的身分證'
    // }

    let finalVal = (val) => {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O']
  
      const index = indexOf(arr, val.substring(0, 1).toUpperCase())
      const firstNum = String(index + 10)
  
      const firstSum = Number(firstNum.substring(0, 1)) + Number(firstNum.substring(1, 2)) * 9
  
      let lastSum = 0
      for (let i = 0, str = val.substring(1, 9); i < 8; i++) {
        lastSum += Number(str[i]) * (8 - i)
      }
  
      const remainder = (firstSum + lastSum) % 10
      const checkNum = remainder !== 0 ? 10 - remainder : 0
  
      if (checkNum === Number(val[9])) {
        return true
      } else {
        return '請輸入正確的身分證'
      }
    }

    return finalVal(val)
    
  }
}
