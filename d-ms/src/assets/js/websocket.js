export default {
  checkCard(x) {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket('ws://127.0.0.1:9889/Chat')
  
      ws.onopen = () => {
        // console.log("webSocket connection open");
        ws.send(x)
      }
  
      ws.onerror = (err) => {
        console.log(err)
        // console.log("webSocket connection error");
        reject('webSocket connection Error')
      }
      ws.onmessage = (event) => {
        // console.log('webSocket event', event, event.data);
  
        if (`${event?.data}`.includes('Error')||`${event?.data}`.includes('失敗')) {
          reject(event?.data)
          ws.close()
        } else {
          resolve(event?.data)
          ws.close()
        }
      }
    })
  }
}
