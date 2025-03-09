<template>
  <div id="Login">
    <!-- 設置背景顏色 吃全畫面 -->
    <b-container
      class="modal-backdrop"
      fluid
    >
      <b-row class="locate">
        <b-img
          src="/DTC_Icon.png"
          width="300"
        ></b-img>
        <b-form-input
          placeholder="帳號"
          ref="Account"
          class="mt-5 text-black"
          v-model="myAuth.AccId"
          @keyup.191="rebootCheatEvent"
          @keydown.enter="accountEnter"
        ></b-form-input>
        <b-form-input
          placeholder="密碼"
          class="mt-3 text-black"
          ref="pwd"
          type="password"
          v-model="myAuth.Password"
          @keydown.enter="login"
        ></b-form-input>
        <b-button
          block
          class="mt-3 button"
          @click="login"
        >Log In</b-button>
        <b-form-checkbox
          v-if="showCheat"
          id="checkbox-1"
          v-model="status"
          class="text-white"
          name="checkbox-1"
        >
          <font class="text-white">是否長久登入</font>
        </b-form-checkbox>
      </b-row>
      <div
        style="font-size: 12px;"
        class="text-white"
        v-text="'Version Time: ' + $moment(versionTime).format('YYYY-MM-DD HH:mm:ss')"
      />
    </b-container>
    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      ref="LoginFailed"
      centered
      hide-footer
      title="帳號或密碼錯誤"
      @close="AddMethod"
    >
      <b-col class="px-1 text-center">
        <b-button
          variant="info"
          ref="btn"
          class="mr-1"
          @click="confirm"
        >
          <font-awesome-icon
            icon="trash"
            class="mr-1"
          />確定 </b-button>
      </b-col>
    </b-modal>

  </div>
</template>

<script>
// 載入模組:KeyPressIdentifier
// import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
// import * as configs from "@/config";
import { mapMutations, mapGetters } from "vuex";
import { getPersonalSetting } from "@/assets/service/dataManager.js";
export default {
  name: "Login",
  data () {
    return {
      myAuth: {
        AccId: "",
        Password: "",
      },
      Loginmethod: null,
      status: false,
      //是否開啟作弊按鈕
      showCheat: false,
      versionTime: window.versionTime
    };
  },
  methods: {
    ...mapMutations(["UserAuthorized", "SHOW_LOADING", "HIDE_LOADING", "setLoginStatus", "clearProcedureData", "CLEAR_REPORT_DR", "CLEAR_DOCTORS", "SET_ATTENDING_DR", "CLEAR_PHRASE", "SET_SETTING", "CLEAR_LOCATIONLIST", "SET_PATIENT_SOURCE_LIST", "SET_SERVICE_SOURCE_LIST", "SET_RADIOGRAPHER", "SET_NURSES", "SET_RADIOGRAPHER_BRIEF", "CLEAR_ISBACK_REPORT_ITEMS"]),
    AddMethod () {
      this.$refs["LoginFailed"].hide();
    },
    //之後會打API傳入後台查詢是否符合 並回傳True及相關變數(待定)判定畫面上的資料呈現
    //需有加密手段將資料加密後傳入API
    //用replace目的是不要殘留history的資料
    HKWatch (event) {
      if (event.key === "Enter") {
        this.login();
      }
      if (event.key === "/") {
        this.showCheat = !this.showCheat;
        if (this.showCheat) {
          return;
        } else {
          this.status = false;
        }
      }
    },
    //     new Date() - new Date(this.$store.state.Profile4User.ActionTime)
    confirm () {
      this.$refs["LoginFailed"].hide();
    },
    rebootCheatEvent () {
      if (this.myAuth.AccId === "/") {
        this.showCheat = !this.showCheat;
        if (this.showCheat) {
          return;
        } else {
          this.status = false;
        }
      }
    },
    accountEnter () {
      this.$refs["pwd"].focus();
    },
    async login () {
      //之後會打API傳入後台查詢是否符合 並回傳True及相關變數(待定)判定畫面上的資料呈現
      //需有加密手段將資料加密後傳入API TO-do
      //用replace目的是不要殘留history的資料
      let Account = {
        Name: this.myAuth.AccId,
        Password: this.myAuth.Password,
        IsLongTime: true,
      };
      //呼叫Store內的mutations才可更改state內的值
      this.SHOW_LOADING();

      try {
        const result = await window.axios.post("/auth/Login", Account);
        this.UserAuthorized(result);
        if (!this.status) this.setLoginStatus(true);
        // if (this.status) {
        //   console.log("不增加定時功能");
        // } else {
        //   console.log("增加定時功能");
        //   this.setLoginStatus(true);
        // }

        this.clearProcedureData();
        this.CLEAR_DOCTORS();
        this.SET_ATTENDING_DR();
        this.CLEAR_PHRASE();
        this.CLEAR_LOCATIONLIST();
        this.SET_PATIENT_SOURCE_LIST([]);
        this.SET_SERVICE_SOURCE_LIST([]);
        this.SET_RADIOGRAPHER([]);
        this.SET_RADIOGRAPHER_BRIEF({});
        this.SET_NURSES([]);
        this.CLEAR_ISBACK_REPORT_ITEMS();

        getPersonalSetting(this.getProfile4User.id).then((res) => {
          // console.log('getPersonalSetting', res);
          if (res && Object.keys(res).length > 0) {
            this.SET_SETTING(JSON.parse(res));

            // console.log(`this.$store.state.Profile4User.setting: `, this.$store.state.Profile4User.setting)
            
            this.$nextTick(() => {
              document.body.setAttribute("style", `--themeBgColor: ${this.getThemeColors.bgColor}; --themeTextColor: ${this.getThemeColors.textColor}`);
            });
          }
        });

        this.$router.replace("/home");
      } catch (err) {
        this.myAuth.AccId = "";
        this.myAuth.Password = "";
        this.$refs["LoginFailed"].show();
        setTimeout(() => {
          this.$nextTick(() => this.$refs["btn"].focus());
        }, 500);
      } finally {
        console.log(`this.$store.state.Profile4User: `, this.$store.state.Profile4User)
        this.HIDE_LOADING();
      }
    },
  },
  computed: {
    ...mapGetters(["getProfile4User", "getThemeColors"]),
  },
  async mounted () {
    setTimeout(()=>{
      if(this.$refs["Account"]){
        this.$nextTick(() => this.$refs["Account"].focus());
      }
    },1000)
  },
};
</script>
<style lang="scss" scoped>
.modal-backdrop {
  background-color: #01579b;
  opacity: 1;
}
.locate {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -150px;
  margin-left: -150px;
  width: 300px;
}
::placeholder {
  color: #01579b;
  font-weight: bold;
}
button {
  background-color: #013e6d;
  font-weight: bold;
}
/deep/ .modal-dialog.modal-md header h5 {
  color: #013e6d;
}
</style>
