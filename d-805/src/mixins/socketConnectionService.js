import * as configs from "@/config";

//web socket connection
//hub connection
export default {
  methods: {
    ConnectionHubConnection(bookingOnly) {
      let _this = this;

      // connect
      if (this.sockConnection == null) {
        // $.connection.hub.logging = true;
        this.sockConnection = $.hubConnection(process.env.NODE_ENV === 'production' ? $setting.apiHost : 'http://192.168.1.200' + $setting.apiHost);
        this.sockConnection.disconnected(() => {
          setTimeout(() => {
            _this.sockConnection.stop();
            _this.sockConnection = null;
            if (!_this.destroyed) {
              _this.hubReconnectCount++;
              if (_this.hubReconnectCount <= 100) {
                // let msg = ''
                // if (this.sockConnection.lastError) msg = this.sockConnection.lastError.message
                _this.ConnectionHubConnection(bookingOnly);
                console.log('websocket 開始重新連線');
              } else {
                console.log('websocket 重新連線超過次數');
                // _this.SET_SIDE_MESSAGE({ msg: "websocket連線中斷, 及時連線功能將暫停, 請嘗試重新開啟頁面, 或通報資訊人員." });
                // _this.ObjApp.TimingMessage("注意!", "websocket連線中斷, 及時連線功能將暫停, 請嘗試重新開啟頁面, 或通報資訊人員.", 2);
              }
            }
          }, 10000);
        });
        this.sockConnection.reconnecting(() => {
          console.log(this.$logs('hubconnection 重新連線中...'))
        });

        this.sockConnection.reconnected(() => {
          _this.useWebSocket = true;
          _this.hubReconnectCount = 0;
          console.log(this.$logs('hubconnection 已重新連線.'))
        });
        if(bookingOnly != true){
          this.hubProxy = this.sockConnection.createHubProxy("examHub");
          this.hubProxy.on("statusChanged", (exam) => {
            if(_this.socketChangeStatus)
              _this.socketChangeStatus(exam, "hubProxy");
            // exam.some(e => {
            //   if (this.selectedLabRoom == e) {
            //     this.$refs.twp1.OnForceRefresh()
            //     return true
            //   }
            // })
          });
        }

        if (_this.hasOwnProperty('localBookingProxy')) {
          this.localBookingProxy = this.sockConnection.createHubProxy("bookingHub");
          this.localBookingProxy.on("scheduleChanged", (timeSlot) => {
            _this.socketChangeStatus(timeSlot, "localBookingProxy");
            // this.$refs.daily.reFreshData()
          });
        } else {
          this.bookingProxy = this.sockConnection.createHubProxy("bookingHub");
          this.bookingProxy.on("scheduleChanged", (timeSlot) => {
            _this.socketChangeStatus(timeSlot, "bookingProxy");
            // this.$refs.daily.reFreshData()
          });
        }

        this.sockConnection
          .start({ jsonp: true, transport: ["webSockets",'serverSentEvents'] })
          .done(function(conn) {
            //將斷線偵測的timeout 調整到12秒 (預設為30秒)
            conn.disconnectTimeout = 12000;
            _this.useWebSocket = true;
            _this.hubReconnectCount = 0;
            // console.log("----------------CONNECTION----------------");
            console.log("Now connected, connection ID=" + conn.id);
            console.log("Connected, transport = " + conn.transport.name);
          })
          .fail(function(e) {
            _this.useWebSocket = false;
            // console.log('Could not connect')
          });
      }
    },
  },
};
