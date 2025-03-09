export default {
  methods: {
    async CheckinService({
      Accessions,
      ScheduleLocation,
      ScheduleLocationName,
      isCheckUp
    }) {
      const res = await this.hubProxy.invoke("checkIn", Accessions, ScheduleLocation, true, isCheckUp, this.$store.state.Profile4User.JWTToke);
      this.SET_SIDE_MESSAGE({ msg: `報到完成 檢查室: ${ScheduleLocationName}, 報到序號: ${res.Info.CallNo}`, type: 1 });
      // this.ObjApp.TimingMessage(`報到完成 檢查室: ${ScheduleLocationName}, 報到序號: ${res.Info.CallNo}`, 1);
      this.$refs.daily.reFreshData();
    },
    CheckoutService(CancelCheckinList) {
      // console.log(CancelCheckinList);
      this.hubProxy
        .invoke("checkInBack", CancelCheckinList, this.$store.state.Profile4User.JWTToke)
        .then(() => {
          this.SET_SIDE_MESSAGE({ msg: '報到取消完成', type: 1 });
          // this.ObjApp.TimingMessage("報到取消完成");
          this.$refs.daily.reFreshData();
        })
        .catch(err => {
          this.SET_SIDE_MESSAGE({ msg: '存取時發生錯誤! 請稍後再試.', type: 2 });
          // this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
        });
    },
    async changeRoomService({
      RoomNo,
      AccessionNos
    }) {
      // console.log({ RoomNo, AccessionNos });
      try {
        const result = await this.hubProxy.invoke("assignRoom", {
          RoomNo,
          AccessionNos
        }, this.$store.state.Profile4User.JWTToke);
        if (result.Success) {
          const itemPack = result.Exams; //資料;
          let msg = "";
          itemPack.forEach(i => {
            msg += i.AccessionNo + "\r\n";
          });
          this.SET_SIDE_MESSAGE({ msg: "以下單號已完成檢查室變更:\n" + msg, type: 1 });
          // this.ObjApp.TimingMessage("以下單號已完成檢查室變更:\n" + msg, 1);
          // this.ObjApp.WaitingHide();
          if (this.$refs.changeRoomModal) this.$refs.changeRoomModal.hide();
          this.$refs.daily.reFreshData();
        } else {
          throw new Error("無資料");
        }
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "檢查室變更失敗! 請稍後再試. <" + err + ">", type: 2 });
        // this.ObjApp.WaitingHide();
        // this.ObjApp.TimingMessage("檢查室變更失敗! 請稍後再試. <" + err + ">", 2);
      }
    },
    async changeTimeService(slot) {
      try {
        const result = await this.bookingProxy.invoke("addTimeSlot", slot, this.$store.state.Profile4User.JWTToke);
        if (result.Success) {
          this.SET_SIDE_MESSAGE({ msg: "檢查室變更成功", type: 1 });
          // this.ObjApp.TimingMessage("檢查室變更成功", 1);
          // this.ObjApp.WaitingHide();
          if (this.$refs.changeRoomModal) this.$refs.changeRoomModal.hide();
          this.$refs.daily.reFreshData();
        } else {
          throw new Error("無資料");
        }
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "檢查室變更失敗! 請稍後再試. <" + err + ">", type: 2 });
        // this.ObjApp.WaitingHide();
        // this.ObjApp.TimingMessage("檢查室變更失敗! 請稍後再試. <" + err + ">", 2);
      }
    }
  }
};
