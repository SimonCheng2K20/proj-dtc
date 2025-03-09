let errorCount = 0

const connectHub = (cb) => {
  const hub = $.hubConnection(process.env.NODE_ENV === 'production' ? $setting.apiHost : 'http://192.168.1.200' + $setting.apiHost)

  hub
    .start({ jsonp: true, transport: ['webSockets', 'serverSentEvents'] })
    .done((data) => {
      // console.log("----------------CONNECTION----------------");
      console.log('Now connected, connection ID=' + data.id)
      console.log('Connected, transport = ' + data.transport.name)
    })
    .fail((error) => {
      errorCount += 1
      console.log(error)

      if (errorCount < 5) {
        connectHub(cb)
      }
    })

  const hubProxy = hub.createHubProxy('examHub')

  hubProxy.on('statusChanged', (data) => {
    cb(data)
  })
}

export const useHubStatusChanged = (cb) => {
  connectHub(cb)
}
