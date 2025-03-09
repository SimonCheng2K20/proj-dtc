<template>
  <div class="login">
    <img class="loginImg" src="../assets/img/background2.png" />
    <div class="loginBox">
      <el-tabs v-model="loginType" type="card">
        <el-tab-pane label="一般登入" name="1">
          <div>
            <div class="loginBoxTitle">一般登入</div>
            <div class="loginInputBox">
              <div class="loginInputBoxItem">
                <img class="loginInputBoxItemIcon" src="../assets/img/account.png" />
                <el-input class="loginInputBoxItemInput" v-model="form.Name" placeholder="請輸入帳號" @keyup.native.enter="login" />
              </div>
              <div class="loginInputBoxItem">
                <img class="loginInputBoxItemIcon" src="../assets/img/password.png" />
                <el-input class="loginInputBoxItemInput" v-model="form.Permit" placeholder="請輸入密碼" show-password @keyup.native.enter="login" />
              </div>
              <div class="loginInputBoxItem">
                <img class="loginInputBoxItemIcon" src="../assets/img/code.png" />
                <el-input v-model="identifyCodeInput" class="loginInputBoxItemInput" placeholder="請輸入驗證碼" @keyup.native.enter="login" />
              </div>      
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自然人憑證登入" name="2">
          <div>
            <div class="loginBoxTitle">自然人憑證登入</div>
            <div class="loginInputBox">
              <div class="loginInputBoxItem">
                <img class="loginInputBoxItemIcon" src="../assets/img/password.png" />
                <el-input class="loginInputBoxItemInput" v-model="form2.Pincode" placeholder="Pincode" maxlength="6" show-password @keyup.native.enter="login" />
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="醫事人員卡登入" name="3">
          <div>
            <div class="loginBoxTitle">醫事人員卡登入</div>
            <div class="loginInputBox">
              <div class="loginInputBoxItem">
                <img class="loginInputBoxItemIcon" src="../assets/img/password.png" />
                <el-input class="loginInputBoxItemInput" v-model="form3.pincode" placeholder="Pincode" maxlength="6" show-password @keyup.native.enter="login" />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="d-flex align-items-center justify-content-end mb-1" v-if="loginType==='1'">
        <img class="loginRefreshIdentify mr-1" src="../assets/img/turn.png" @click="refreshIdentify" />
        <Identify :identifyCode="identifyCode" />
      </div>
      <div class="loginInputMenu">
        <el-row :gutter="10">
          <el-col :md="10">
            <div class="loginInputMenuItem loginInputMenuClear mb-1" @click="clear">重新輸入</div>
          </el-col>
          <el-col :md="14">
            <div class="loginInputMenuItem loginInputMenuLogin" @click="login">確認登入</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Identify from '@/components/Identify.vue'
export default {
  components: {Identify},
  data() {
    return {
      loginType:'1',
      identifyCode:'',
      identifyCodeInput:'',
      form: {
        Name: "",
        Permit: "",
      },
      form2: {
        pincode:null,
      },
      form3: {
        pincode:null,
      },
    }
  },
  created() {
    this.refreshIdentify()
  },
  methods: {
    async login() {
      if(this.loginType==='1'&&this.identifyCodeInput!==this.identifyCode) {
        alert('驗證碼不正確')
        return 0
      }
      this.$store.commit('loading',true)
      try {
        if(this.loginType==='1') {
          await this.$api.login(this.form).then(res=> {
            this.$store.commit('userData',res)
          })
          .catch(err=>{throw err})
        }
        else if(this.loginType==='2') {
          await this.$api.loginHicard(this.form2).then(res=> {
            this.$store.commit('userData',res)
          })
          .catch(err=>{throw err})
        }
        else if(this.loginType==='3') {
          await this.checkCard()
          .catch(err=>{throw err})
        }
      }
      catch (err) {
        if(this.loginType==='3') {
          this.$message.error(err)
          this.$store.commit('loading',false)
        }
        return 0
      }
      this.$store.commit('loading',false)
      let list=this.$store.state.userData.FunctionNos.filter(res=>res!=='Data'&&res!=='System')
      if(!list.length) alert('該帳號無法瀏覽任何頁面，請確認角色權限')
      this.$router.push({name:list[0]})
    },
    refreshIdentify() {
      this.identifyCode=String(this.$global.randomNum(1000,9999))
    },
    clear() {
      this.form.Name=''
      this.form.Permit=''
      this.form3.Pincode=''
      this.identifyCodeInput=''
    },
    async checkCard() {  //讀取醫事人員卡
      this.$store.commit('loading',true)
      console.log(this.form3.pincode)
      await this.$websocket.checkCard(`signCert:${this.form3.pincode}`)
      .then(async ()=> {
        //this.form3.Cert=res
        this.$message.success('Pincode驗證成功')
        await this.$websocket.checkCard('checkCard:')
        .then(async res=> {
          let regex =/『(.*?)』/gm
          let found =res.match(regex).map(r=>r.replace(/『/,"").replace(/』/,""))
          let data= {
            Identifier:found[0]
          }
          await this.$api.loginNhicard(data).then(res=> {
            this.$store.commit('userData',res)
          })
          this.$message.success(res)
        })
      })
      .catch(err=> {
        throw err
      })
      this.$store.commit('loading',false)
    }
  }
}
</script>