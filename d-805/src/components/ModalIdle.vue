<template>
  <div>
    <b-modal ref="modal-1" centered hide-footer hide-header>
      <p style="color: black !important; text-align: center;"><strong>您已經超過一段時間未操作，<br>如需繼續使用，請移動滑鼠或鍵盤 !!!</strong></p>
      <p style="color: black !important; text-align: center;">系統將在 <strong style="color: red;">{{ Waittingtime_show }}</strong> 秒後登出 ~</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  computed: {
    Waittingtime_show() {
      return (this.Logouttime - this.Waittingtime) / 1000;
    },
    realWaittingtime() {
      return this.Time / 1000;
    },
  },
  data() {
    return {
      // // 共閒置時間 > 預設為5分鐘後顯示
      Waittingtime: 5 * 60 * 1000, // 5 * 60 * 1000
      // // 剩下60秒 > 若未動作則強制登出
      Logouttime: 6 * 60 * 1000, // 6 * 60 * 1000
      // 顯示目前閒置多久
      Time: 0
    };
  },
  created() {
    let timerId = setInterval(() => {
      this.Waittingtime -= 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId);
      if (this.Waittingtime < 1) {
        //彈視窗提醒告知已閒置 預設七分鐘
        this.$refs["modal-1"].show();
        clearInterval(timerId);
      }
    }, 1000);
    let timerId2 = setInterval(() => {
      this.Logouttime -= 1000;
      this.Time += 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId2);
      if (this.Logouttime < 1) {
        clearInterval(timerId2);
        this.$store.state.isLogin = false;
        this.$store.commit({
          type: "UserLogout",
          userData: this.$store.state.Profile4User,
        });
        this.$router.replace("/Login");
        //Logout
      }
    }, 1000);
  },
};
</script>
