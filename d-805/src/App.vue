<template>
  <div
    id="app"
    :class="getThemeColors.key==='white' || getThemeColors.key==='lightGray' ? 'lightTheme':'darkTheme'"
  >
    <MainMenu v-if="$route.query.token == null && $route.name!=='ReportWindow'" />
    <router-view />
    <div v-if="isLogin">
      <ModalIdle v-if="isIdle" />
    </div>
    <b-modal id="WinWait" ref="Window4Wait" hide-header hide-footer no-fade :no-close-on-backdrop="true" :no-close-on-ese="true" >
      <div class="d-block text-center text-primary">
        <b-spinner class="align-middle mr-2"></b-spinner>
        <strong>{{ this.waitMsg }}載入中, 請稍待 ...</strong>
      </div>
    </b-modal>
    <b-modal
      id="WinHelp"
      ref="Window4Help"
      centered
      hide-footer
      no-fade
      scrollable
      size="xl"
      body-class="py-1 themeModal"
      :header-bg-variant="window4Help.windowHeadBgV"
      :header-text-variant="window4Help.windowHeadTxV"
      :body-bg-variant="window4Help.windowBodyBgV"
      :body-text-variant="window4Help.windowBodyTxV"
      
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="question"
          class="mr-1"
        />
        <span class="zhTW">{{ window4Help.windowTitle }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col class="px-1">
            <div
              v-html="window4Help.windowContent"
              class="helpBlock"
            ></div>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MainMenu from "@/components/NavBarMain.vue";
import { setCulture, L10n, loadCldr } from "@syncfusion/ej2-base";
import { i18n } from "@/i18n/zh-Hant";
import { mapState, mapGetters, mapMutations } from "vuex";
import ModalIdle from "@/components/ModalIdle";
import "@/library/Common"; // in order to fix dataManager with token temp
import { getPersonalSetting } from "@/assets/service/dataManager.js";

L10n.load(i18n);
setCulture("zh-Hant");
loadCldr(
  require("cldr-data/supplemental/numberingSystems.json"),
  require("cldr-data/main/zh-Hant/ca-gregorian.json"),
  require("cldr-data/main/zh-Hant/numbers.json"),
  require("cldr-data/main/zh-Hant/timeZoneNames.json")
);

export default {
  name: "App",
  components: { MainMenu, ModalIdle },
  data () {
    return {
      waitMsg: "",
      traceMode: false,
      window4Help: {
        windowTitle: "",
        htmlContent: false,
        windowContent: "",
        windowHeadBgV: "",
        windowHeadTxV: "",
        windowBodyBgV: "",
        windowBodyTxV: ""
      },
      options: {},
    };
  },
  computed: {
    ...mapState(['rightSideMessage', 'showLoading']),
    ...mapGetters(['getThemeColors', 'getProfile4User']),
    isIdle () {
      return this.$store.state.idleVue.isIdle;
    },
    isLogin () {
      return this.$store.state.isLogin;
    }
  },
  methods: {
    ...mapMutations(["SET_SETTING", "SET_THEME", "SET_SIDE_MESSAGE", "CLEAR_SIDE_MESSAGE"]),
    personInfoData () {
      if (!this.getProfile4User.id) return;
      getPersonalSetting(this.getProfile4User.id).then(res => {
        if (res) {
          this.SET_SETTING(JSON.parse(res));
          if (this.getProfile4User.setting.theme) this.SET_THEME(this.getProfile4User.setting.theme);
        }
        document.body.setAttribute('style', `--themeBgColor: ${this.getThemeColors.bgColor}; --themeTextColor: ${this.getThemeColors.textColor}`);
      });
    },
    WaitingShow (msg) {
      //console.log(this.$logs())
      this.waitMsg = msg ? msg : "";
      if (this.$refs["Window4Wait"]) this.$refs["Window4Wait"].show();
    },
    WaitingHide () {
      //console.log(this.$logs())
      setTimeout(x => {
        this.waitMsg = "";
        this.$nextTick(() => { if (this.$refs["Window4Wait"]) this.$refs["Window4Wait"].hide() });
      }, 500);
    },
    HelpShow (cfg) {
      //
      this.window4Help.htmlContent = false;
      this.window4Help.windowTitle = "功能說明";
      this.window4Help.windowContent = "說明內容";
      this.window4Help.windowHeadBgV = "primary";
      this.window4Help.windowHeadTxV = "white";
      this.window4Help.windowBodyBgV = "";
      this.window4Help.windowBodyTxV = "";
      if (cfg) {
        // 依參數物件(object)內容來調整相關 property 之值
        if (this.$Exists(cfg.Content)) {
          this.window4Help.windowContent = cfg.Content;
        }
      }
      this.$refs["Window4Help"].show();
    },
    HelpHide () {
      setTimeout(x => {
        this.$nextTick(() => this.$refs["Window4Help"].hide());
      }, 500);
    },
    TimingMessage (v, t = 1, dt = 1500) {
      // 限時自動消失的訊息
      // Bootstrap component: Toast 應用
      let hClass = [];
      let bClass = [];

      let autoHideDelay = Number(dt);

      if (t === 2) {
        hClass = ["bg-danger", "text-light", "zhTW"];
        bClass = ["bg-light", "text-danger", "zhTW"];
        autoHideDelay = Number(dt) + 1500;
      } else {
        hClass = ["bg-success", "text-light", "zhTW"];
        bClass = ["bg-light", "text-dark", "zhTW"];
      }
      const h = this.$createElement;
      let vMessage = h("p", { class: ["text-left", "mb-0"] }, [h("strong", {}, v)]);
      //
      let vTitle = h("div", { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] }, [
        h("strong", { class: "mr-2" }, "系統訊息"),
        h("small", { class: "ml-auto text-italics" }, `${this.$GetTimeStamp()}`)
      ]);
      this.$bvToast.toast([vMessage], {
        title: [vTitle],
        headerClass: hClass,
        bodyClass: bClass,
        //noCloseButton: true,
        autoHideDelay: autoHideDelay,
      });
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), autoHideDelay * 1.2);
      })

    },
    async CommonGet (path) {
      // 傳回 dataTable
      // console.log(this.$logs(path, "CommonGet"));
      let message = "error";
      let methodName = path;
      return await this.$http
        .get(path)
        .then(r => {
          // console.log(this.$logs("Done", methodName));
          if (r && r.data) {
            if (r.data.Success) {
              return this.$DeepCopy(r.data.Data);
            } else {
              message = r.data.Message;
            }
          }
          // console.log(this.$logs(message, path));
          return [];
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return [];
        });
    },
    async TemplateGet (path) {
      // 傳回 template 用的 dataRow
      let message = "error";
      path = `${path}/template`;
      let methodName = path;
      return await this.$http
        .get(path)
        .then(r => {
          if (r && r.data) {
            if (r.data.Success) {
              return this.$DeepCopy(r.data.Data[0]);
            } else {
              message = r.data.Message;
            }
          }
          // console.log(this.$logs(message, path));
          return {};
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return {};
        });
    },
    async CommonPost (path, paramObj) {
      // 傳回 dataTable
      // console.log(this.$logs(path, "CommonPost"));
      let message = "error";
      let methodName = path;
      return await this.$http
        .post(path, paramObj)
        .then(r => {
          // console.log(this.$logs("Done", methodName));
          if (r && r.data) {
            if (r.data.Success) {
              return true;
            } else {
              message = r.data.Message;
            }
          }
          // console.log(this.$logs(message, path));
          return false;
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return false;
        });
    },
    async CommonPut (path, paramObj) {
      // 傳回 dataTable
      let message = "error";
      let methodName = "PUT:" + path;
      return await this.$http
        .put(path, paramObj)
        .then(r => {
          if (r && r.data) {
            if (r.data.Success) {
              return true;
            } else {
              message = r.data.Message;
            }
          }
          // console.log(this.$logs(message, path));
          return false;
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return false;
        });
    },
    async CommonDelete (path, id) {
      // 傳回 dataTable
      let message = "error";
      let methodName = `DELETE: ${path}/${id}`;
      return await this.$http
        .delete(`${path}/${id}`)
        .then(r => {
          if (r && r.data) {
            if (r.data.Success) {
              return true;
            } else {
              message = r.data.Message;
            }
          }
          // console.log(this.$logs(message, path));
          return false;
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return false;
        });
    },
    async OptionsLoader (GDSGroupId, GDSDataType) {
      let methodName = "OLoader";
      let success = false;
      //if(GDSGroupId) {
      methodName += ":" + GDSGroupId;
      // console.log(this.$logs("Call", methodName));
      let message = "ERROR";
      //
      if (!GDSDataType) {
        GDSDataType = "T";
      }
      let valueField = GDSDataType === "T" ? "Value4Text" : GDSDataType === "N" ? "Value4Numeric" : GDSDataType === "B" ? "Value4Boolean" : "Value4DateTime";
      //
      this.options[GDSGroupId] = [];
      //console.log(this.$logs(`${this.$Exists(this.options[GDSGroupId])}`, methodName))
      //console.log(this.$logs(``, methodName))
      success = await this.$http
        .get(`GDSet/${GDSGroupId}`)
        .then(r => {
          let resultState = false;
          if (r && r.data) {
            if (r.data.Success) {
              resultState = true;
              //
              let raw = this.$DeepCopy(r.data.Data);
              if (raw && raw.length > 0) {
                raw.forEach(e => {
                  if (e.RecActivated) {
                    this.options[GDSGroupId].push({
                      text: e.GDataName,
                      value: e[valueField],
                      //
                      // 額外附加-1, 如為 deteled 則設為 disabled
                      //disabled: !e.RecActivated,
                      //
                      // 額外附加-2, GUID
                      guid: e.GDSetGUID
                    });
                  }
                });
              }
              //
            } else {
              message = r.data.Message;
            }
          }
          return resultState;
        })
        .catch(err => {
          this.$stdErr(err, methodName);
          return false;
        });
      //}
      return success;
    },
    async CallLoader () {
      let methodName = "CallLoader";
      // console.log(this.$logs(null, methodName));
      //
      let option2load = [
        { groupId: "Activation", dataType: "T" },
        { groupId: "ImageQuality", dataType: "T" }
      ];
      option2load.forEach(async e => {
        if (e) {
          // console.log(this.$logs(`Call ${e.groupId}`, methodName));
          await this.OptionsLoader(e.groupId, e.dataType);
        }
      });
      // console.log(this.$logs("Done", methodName));
    }
  },
  created () {
    // if (!localStorage["theme-modal-bg-color"]) {
    //   localStorage["theme-modal-bg-color"] = "black";
    // }
    if (this.getProfile4User.id) {
      this.personInfoData();
    }
  },
  async mounted () {
    // let methodName = "App.mounted";
    // console.log(this.$logs(null, methodName));
    //
    // 先留下解析度資訊, 日後或許有用...
    //console.log(this.$logs(`BView:${document.body.clientWidth}x${document.body.clientHeight}`, methodName))
    //console.log(this.$logs(`WView:${window.innerWidth}x${window.innerHeight}`, methodName))
    //
    this.WaitingShow();
    //
    // 用 CallLoader 不能達到 等待 的效果, 再研究看看...
    //await this.CallLoader()
    // 暫時先逐一叫用吧
    // await this.OptionsLoader("ImageQuality");  打了也沒用
    // await this.OptionsLoader('Activation')
    //
    /*
    // 20191103 Pollux, 測試 RESTful API
    console.log((await this.CommonGet('GDSet/Groups'))[0])
    console.log((await this.TemplateGet('GDSet/item')))
    let gtemp = await this.TemplateGet('GDSet/Group')
    console.log(gtemp)
    gtemp.GDSetGrpId = 'MT1'
    gtemp.GDSetGrpName = 'MTest1'
    gtemp.GDSetDesc = 'My Test #1'
    let result = await this.CommonPost('GDSet/Group', gtemp)
    console.log(result)
    result = await this.CommonPut('GDSet/Group', gtemp)
    console.log(result)
    result = await this.CommonDelete('GDSet/Group', gtemp.GDSetGrpId)
    console.log(result)
    //
    // 20191104 Pollux, 測試 RESTful API
    let itemp = await this.TemplateGet('GDSet/Item')
    console.log(itemp)
    itemp.GDSetGrpId = 'MT1'
    itemp.GDataId = 'Test1'
    itemp.GDataName = itemp.GDataId
    itemp.GDataDesc = 'Item Test #1'
    itemp.Value4Text = 'Item Test #1 for TEXT value'
    result = await this.CommonPost('GDSet/Item', itemp)
    console.log(result)
    itemp.GDataDesc = 'Item Test #1 (updated)'
    result = await this.CommonPut('GDSet/Item', itemp)
    console.log(result)
    result = await this.CommonDelete(`GDSet/${itemp.GDSetGrpId}`, itemp.GDataId)
    console.log(result)
    */
    // 20191104 Pollux, VueX + JWT Testing
    /*
    this.$store.commit('UserAuthorized', 'xyz')
    console.log(this.$store.state.Profile4User)
    let t1 = await this.CommonGet('GDSet1/Group1')
    console.log(t1)
    */
    /*
    console.log(await this.TemplateGet('CST'))
    console.log(await this.CommonGet(`CST/123`))
    console.log(await this.CommonGet(`CST/iTems`))
    */
    //
    this.WaitingHide();
    //
    // let GDSGroupId = "ImageQuality";
    // console.log(this.$logs(`[${this.options[GDSGroupId] ? this.options[GDSGroupId].length : "none"}]`, methodName));
    // //
    // console.log(this.$logs("END", methodName));
    // document.body.setAttribute('style', `--themeBgColor: ${this.getThemeColors.bgColor}; --themeTextColor: ${this.getThemeColors.textColor}`);
  },
  watch: {
    rightSideMessage (vals) {
      if (vals.length > 0) {
        vals.forEach(val => {
          if (val.msg) this.TimingMessage(val.msg, val.type, val.delay).then(() => {
            // this.SET_SIDE_MESSAGE({ msg: '' });
          });
          this.CLEAR_SIDE_MESSAGE(val);
        });

      }
    },
    showLoading (val) {
      if (val != null) {
        this.WaitingShow(val);
      } else {
        this.WaitingHide();
      }
    },
    getThemeColors (theme) {
      // const { id, setting } = this.getProfile4User;
      // const newSetting = { ...setting, theme: theme.key };
      // if (id != 'admin') savePersonalSetting(id, newSetting);
      document.body.setAttribute('style', `--themeBgColor: ${theme.bgColor}; --themeTextColor: ${theme.textColor}`);
    },
    "getProfile4User.id" (newVal, oldVal) {
      if (!oldVal) {
        this.personInfoData();
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/LayoutBase.scss";
@import "@/assets/styles/definedStyle.scss";
.modal-dialog {
  fieldset {
    border: none !important;
  }
}

.mu-dialog {
  background-color: var(--themeBgColor) !important;
}
</style>

<style lang="scss" scoped>
#app.no-scroll {
  overflow: hidden;
  height: 100vh;
}
.helpBlock {
  min-height: 300px;
}
.ag-watermark {
  display: none !important;
}

.vue-tabs {
  position: relative;
}
.nav-tabs-navigation {
  position: sticky;
  top: 0;
  z-index: 8;
  background-color: black;
}

/deep/ .super-select-dropdown {
  z-index: 200;
}
#app.noPrint {
  margin-bottom: 500px;
}
</style>
