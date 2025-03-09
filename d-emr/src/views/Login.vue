<template>
  <div class="login">
    <div class="loginInner">
      <el-row class="loginInnerRow" :gutter="60">
        <el-col :lg="15">
          <Proclamation class="mb-1" />
        </el-col>
        <el-col :lg="9">
          <div class="loginBox">
            <div class="loginBoxInner">
              <div class="loginBoxInnerTitle mb-2">
                <img
                  class="loginBoxInnerTitleIcon mr-1"
                  src="../assets/img/svg/system.svg"
                />
                <div class="loginBoxInnerTitleText">
                  <div class="loginBoxInnerTitleTextBig">電子病歷管理系統</div>
                  <div class="loginBoxInnerTitleTextSmall">系統登入</div>
                </div>
              </div>
              <div class="loginBoxInnerForm">
                <div class="loginBoxInnerFormInput mb-1">
                  <el-input
                    placeholder="請輸入帳號"
                    v-model="form.Name"
                    @keyup.enter.native="login"
                  >
                    <i slot="prefix" class="customIcon mr-1">
                      <img
                        style="width: 25px; height: 25px"
                        src="../assets/img/svg/account – 2.svg"
                        alt
                      />
                    </i>
                  </el-input>
                </div>
                <div class="loginBoxInnerFormInput mb-1">
                  <el-input
                    placeholder="請輸入密碼"
                    v-model="form.Permit"
                    show-password
                    @keyup.enter.native="login"
                  >
                    <i slot="prefix" class="customIcon mr-1">
                      <img
                        style="width: 25px; height: 25px"
                        src="../assets/img/svg/password – 1.svg"
                        alt
                      />
                    </i>
                  </el-input>
                </div>
                <!-- <div class="loginBoxInnerFormInput mb-1">
                  <el-input placeholder="請輸入醫事人員密碼 (電子簽章用)" v-model="cardCert.cert" show-password @keyup.enter.native="login" disabled>
                    <i slot="prefix" class="customIcon mr-1">
                      <img style="width:25px;height:25px;" src="../assets/img/svg/password – 1.svg" alt/>
                    </i>
                  </el-input>
                </div> -->
                <!--<div class="loginBoxInnerFormInput mb-1">
                  <el-input class="mr-1" placeholder="請輸入驗證碼" v-model="enterIdentifyCode" @keyup.enter.native="login">
                    <i slot="prefix" class="customIcon mr-1">
                      <img style="width:25px;height:25px;" src="../assets/img/svg/code – 1.svg" alt/>
                    </i>
                  </el-input>
                  <img class="refreshIcon mr-1" src="../assets/img/svg/turn – 1.svg" @click="refreshCode" />
                  <Identify :identifyCode="identifyCode" />
                </div>-->
                <div class="loginBoxInnerFormInput mb-1">
                  <Button
                    class="buttonColor-1 mr-1"
                    type="primary"
                    style="width: 60%"
                    @click="login"
                    >登入</Button
                  >
                  <Button
                    class="buttonColor-11"
                    style="width: calc(40% - 10px)"
                    @click="clear"
                    >重新輸入</Button
                  >
                </div>
                <!-- <div class="loginBoxInnerFormInput">
                  <Button class="buttonColor-7" style="width:100%;" @click="check">讀取醫事人員卡</Button>
                </div> -->
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Proclamation from "@/components/Proclamation.vue";
//import Identify from '@/components/Identify.vue'

export default {
  components: { Proclamation },
  data() {
    return {
      // form: {
      //   Name: process.env.NODE_ENV === "development" ? "Admin" : null,
      //   Permit: process.env.NODE_ENV === "development" ? "manager" : null,
      // },
      form: {
        Name: null,
        Permit: null,
      },
      needCardCert: false,
      cardCert: {},
      enterIdentifyCode: null,
      identifyCode: null,
    };
  },
  methods: {
    async login() {
      /*if(this.enterIdentifyCode!==this.identifyCode) {
        alert('驗證碼不正確')
        return 0
      }*/
      this.$store.commit("loading", true);
      await this.$api
        .login(this.form)
        .then(async (res) => {
          sessionStorage.token = res.Token;
          this.$store.commit("userData", res);
          await this.$store.dispatch("getInit");

          if (res) {
            console.log(`res: `, res);
            await this.GetMyOverStatus()
          }

          this.$router.push({ path: "/" });
          this.$store.commit("loading", false);
        })
        .catch(() => {
          this.$store.commit("loading", false);
        });
    },
    async tokenLogin() {
      this.$store.commit("loading", true);
      await this.$api
        .getAccountInfo()
        .then(async (res) => {
          sessionStorage.token = res.Token;
          this.$store.commit("userData", res);
          await this.$store.dispatch("getInit");

          if (res) {
            console.log(`res: `, res);
            await this.GetMyOverStatus()
          }

          this.$router.push({ path: "/" });
          this.$store.commit("loading", false);
        })
        .catch(() => {
          this.$store.commit("loading", false);
        });
    },
    async onAutoSignatureOk() {
      await this.$api.postSetAutoSignature({
        AutoSignature: true,
        HcaSignature: null,
      });
    },
    async GetMyOverStatus() {
      try {
        let res = await this.$api.getMyOverStatus();
        if (res) {
          // console.log(`getMyOverStatus > res: `, res);
          this.$store.commit("setSheetArchiveStatus", res);
        }
      } catch (err) {
        console.log(`error: `, err);
      }
    },
    refreshCode() {
      this.identifyCode = String(this.$global.randomNum(1000, 9999));
    },
    clear() {
      this.form.Name = "";
      this.form.Permit = "";
      this.enterIdentifyCode = "";
      this.cardCert = {};
      sessionStorage.cardCert = "";
    },
  },
  async created() {
    this.refreshCode();

    const queryToken = new URL(window.location.href.replace('/#', '')).searchParams.get('token')
    
    if (queryToken) {
      window.sessionStorage.setItem('token', queryToken)
      if(sessionStorage.token){
        await this.tokenLogin()
        this.$router.replace({ path: "/" });
      }
    }
  },
};
</script>
