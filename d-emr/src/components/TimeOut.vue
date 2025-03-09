<template>
  <el-dialog title="閒置提示" :visible.sync="showDialog" width="360px">
    <div class="timeOutHeight">
      <div>已閒置超過 1 小時</div>
      <div>
        系統將在 <strong>{{ time }}</strong> 秒後自動登出
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      time: 60,

      interval: null,
    }
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    logout() {
      this.$store.commit('reset')
      sessionStorage.token = ''
      sessionStorage.cardCert = ''
      location.href = './#/login'
      this.clear()
    },
    clear() {
      clearInterval(this.interval)
    },
  },
  created() {
    this.showDialog = true
    this.interval = setInterval(() => {
      this.time--
      if (this.time <= 0) {
        this.logout()
      }
    }, 1000)
  },
}
</script>
<style lang="scss" scoped>
.timeOutHeight {
  box-sizing: border-box;

  width: 320px;
  min-height: 120px;

  padding: 10px 30px;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-content: flex-start;
  align-items: flex-start;

  > div {
    width: 100%;
    height: auto;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    > strong {
      color: red;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1px;
      text-indent: 1px;
    }
  }
}
</style>
