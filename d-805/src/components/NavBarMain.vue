<template>
  <div>
    <b-container id="topNav" fluid>
      <b-navbar
        fixed="top"
        toggleable="sm"
        type="dark"
        id="mainNav"
        v-show="
          getToggleReport.navigation || ($route.name !== 'FI0301' && $route.name !== 'SubReport')
        "
      >
        <b-navbar-brand to="/" replace>
          <!-- <b-img
            src="../../public/Logo-new-dark.png"
            class="mr-1 logo"
            style="width: 23rem"
          /> -->
          <b-img :src="logoImagePath" :style="logoImageSize" class="mr-1" />
          <!-- <span class="title"
            >慈濟醫院．{{ department === "sub" ? "次專科" : "影像" }}報告系統</span
          > -->
          <span class="title">{{ title }}</span>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="mr-auto">
            <b-nav-item
                v-if="functions.includes('FI0304')"
                :to="`/MI03/FI0304${department === 'sub' ? 'ForSub' : ''}`"
                replace
            >報告待打清單</b-nav-item>

            <!-- <b-nav-item
              v-if="functions.includes('FI0307')"
              to="/MI03/FI0307"
              replace
            >進階搜尋</b-nav-item> -->

            <b-nav-item
              v-if="functions.includes('FI0307')"
              @click="toFI0307"
            >進階搜尋</b-nav-item>

            <b-nav-item-dropdown v-if="counter && functions.includes('FI0101')" text="櫃台作業">
              <b-dropdown-item v-if="functions.includes('FI0101')" to="/MI01/FI0101" replace>報到櫃台</b-dropdown-item>
              <!-- <b-dropdown-item v-if="functions.includes('FI0102')" to="/MI01/FI0102" replace>健診櫃台</b-dropdown-item> -->
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="checkRoom" text="檢查室作業">
              <b-dropdown-item to="/MI02/FI0201" replace>報到前台</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('FI0203')" to="/MI02/FI0203" replace>藥品耗材登打</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('BadImageReport')"
                to="/FailureImageProcess"
                replace
              >不良影像報告</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="report" text="診斷報告">
              <!-- <b-dropdown-item v-if="functions.includes('FI0302')" to="/MI03/FI0302" replace>報告片語維護</b-dropdown-item> -->
              <!-- <b-dropdown-item v-if="functions.includes('FI0303')" to="/MI03/FI0303" replace>癌篩樣版維護</b-dropdown-item> -->
              <b-dropdown-item v-if="functions.includes('FI0301')" hidden to="/MI03/FI0301" replace>報告撰寫作業v1</b-dropdown-item>
              <!-- JAMES UPDATED -->
              <b-dropdown-item
                v-if="functions.includes('FI0303') && department !== 'sub'"
                to="/MI03/FI0303"
                replace
              >癌篩樣版維護</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('FI0303') && department === 'sub'"
                to="/SubReport/templateMaintain"
                replace
              >次專科樣版維護</b-dropdown-item>
              <!-- JAMES UPDATED -->
              <!-- thomas UPDATED -->
              <b-dropdown-item v-if="functions.includes('FI0305')" to="/MI03/FI0305" replace>審單及交班記錄</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('FI0306')" to="/MI03/FI0306" replace>匿名評分</b-dropdown-item>
              <!-- JAMES UPDATED -->
              <!-- Simon Updated -->
              <!-- <b-dropdown-item v-if="functions.includes('FI0310')" to="/MI03/FI0310" replace>不良片查詢</b-dropdown-item> -->
              <!--
              <b-dropdown-item to="/" replace disabled>Home</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item to="/about" replace disabled>About</b-dropdown-item>
              -->
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="Author" text="系統安全性管理">
              <b-dropdown-item v-if="functions.includes('Account')" to="/Account" replace>系統帳號管理</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Role')" to="/Role" replace>系統角色管理</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Function')" to="/Function" replace>系統作業管理</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('AuditEvent')" to="/AuditEvent" replace>稽核記錄</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="GernerData" text="基本資料維護">
              <b-dropdown-item
                v-if="functions.includes('ProcedureGroup')"
                to="/ProcedureGroup"
                replace
              >專長群組維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Employee')" to="/Employee" replace>員工管理</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('CodeName')" to="/CodeName" replace>放射師簡碼維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Patient')" to="/Patient" replace>病患管理</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('CheckCategory')"
                to="/CheckCategory"
                replace
              >檢查類別維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('CheckCombo')" to="/CheckCombo" replace>檢查套餐維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('CheckItem')" to="/CheckItem" replace>檢查項目維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Medication')" to="/Medication" replace>藥品維護</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('SubMedication')"
                to="/SubMedication"
                replace
              >科別藥品子代碼維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Institution')" to="/Institution" replace>科室維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Room')" to="/Room" replace>檢查室維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Device')" to="/Device" replace>檢查儀器維護</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('ModalityCategory')"
                to="/ModalityCategory"
                replace
              >儀器類別自訂分類</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Hospital')" to="/Hospital" replace>轉診(轉檢)醫院維護</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('HrrWord')" to="/HrrWord" replace>高風險通報關鍵字維護</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="schedule" text="排程維護">
              <b-dropdown-item
                v-if="functions.includes('DefaultSpecialTime')"
                to="/DefaultSpecialTime"
                replace
              >檢查室每週例行排程</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('SpecialTime')" to="/SpecialTime" replace>檢查室特定時段排程</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Schedule')" to="/Schedule" replace>排程總覽</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('BookingTest')" to="/BookingTest" replace>排程 Booking</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('DefaultSpecialTime')"
                to="/HolidayArrangement"
                replace
              >假日設定</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="doctor" text="報告醫師排程維護">
              <b-dropdown-item
                v-if="functions.includes('WeekScheduling')"
                to="/WeekScheduling"
                replace
              >日班週排程</b-dropdown-item>
              <!-- <b-dropdown-item v-if="functions.includes('MonthScheduling')" to="/MonthScheduling" replace>小夜班月排程</b-dropdown-item> -->
              <b-dropdown-item v-if="functions.includes('ManualAssign')" to="/ManualAssign" replace>手動分派報告醫師</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('WorkScheduling')"
                to="/WorkingSchedule"
                replace
              >全日週排程</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('Holiday')" to="/Holiday" replace>醫師請假</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-if="statistics" text="統計作業">
              <b-dropdown-item
                v-if="functions.includes('EmployeeWorkload')"
                to="/EmployeeWorkload"
                replace
              >放射師個人工作量統計</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('DeviceWorkload')"
                to="/DeviceWorkload"
                replace
              >儀器使用量</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('MI02/FI0204')" to="/MI02/FI0204" replace>藥品耗材統計作業</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('ImageStat')" @click="imageStat" replace>影像統計表</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('CheckRoomStat')"
                @click="checkRoomStat"
                replace
              >檢查室統計表</b-dropdown-item>
              <b-dropdown-item
                v-if="functions.includes('ReportRoomStat')"
                @click="reportStat"
                replace
              >報告統計表</b-dropdown-item>
              <b-dropdown-item v-if="functions.includes('FI0308')" to="/MI03/FI0308" replace>個案追蹤</b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- v-if="isLocal" -->
            <b-nav-item-dropdown text="心導管" v-if="functions.includes('Cardioreport')">
              <template v-for="(item, i) in menus">
                <b-dropdown-item
                  v-if="isLocal || i === menus.length - 1"
                  :to="`/cardiac/doc${i + 1}`"
                  :key="i"
                  replace
                >{{ item }}</b-dropdown-item>
              </template>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="次專科" v-if="isLocal && functions.includes('SubReport')">
              <b-dropdown-item
                v-for="(item, i) in subMenus"
                :to="`/sub/doc${i + 1}`"
                :key="i"
                replace
              >{{ item }}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <div
            v-if="Profile4User && Profile4User.employeeName"
            class="bg-white px-2 py-1 rounded mr-3 text-primary"
          >
            {{ Profile4User.employeeName }}
          </div>

          <!-- <b-navbar-nav>
            <b-nav-item-dropdown
              text="登出"
              right
            >
              <b-dropdown-item
                @click.prevent="logout"
                replace
              >登出</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav> -->

          <div
            class="text-white cursor-pointer d-flex justify-content-center align-items-center"
            id="ellipsis"
            @click="ellipsisClick"
          >
            <font-awesome-icon icon="ellipsis-h" />
          </div>

          <b-popover
            ref="popover"
            id="planePad"
            target="ellipsis"
            placement="bottomleft"
            triggers="click blur"
            style="width: 320px"
          >
            <div class="p-1">
              <b-form-group label="偏好色系">
                <b-form-radio-group v-model="colorSelected" :options="colors" />
              </b-form-group>
              <div class="border-bottom my-2 px-2"></div>
              <div class="d-flex justify-content-between">
                <b-button size="sm" variant="outline-secondary" @click.prevent="logout"
                  >登出</b-button
                >
                <b-button size="sm" variant="outline-secondary" @click.stop="troggleModifyPassword">
                  修改密碼
                </b-button>
              </div>
            </div>
          </b-popover>

        </b-collapse>
      </b-navbar>
    </b-container>

    <b-modal id="modifyPassword" ref="passwordModal" title="修改密碼">
      <div>
        <!-- <input
          type="password"
          name="oldPassword"
        /> -->
        <b-input-group prepend="原先密碼" class="mb-2">
          <b-input
            v-model="passwords.old"
            autocomplete="off"
            name="oldPassword"
            :type="showEyes ? 'text' : 'password'"
          />
          <b-input-group-append>
            <b-button variant="primary" @click="showEyes = !showEyes">
              <font-awesome-icon :icon="showEyes ? 'eye' : 'eye-slash'" />
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-input-group prepend="新設密碼" class="mb-2">
          <b-input
            v-model="passwords.new"
            autocomplete="off"
            name="newPassword"
            :type="showEyes ? 'text' : 'password'"
          />
          <b-input-group-append>
            <b-button variant="primary" @click="showEyes = !showEyes">
              <font-awesome-icon :icon="showEyes ? 'eye' : 'eye-slash'" />
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-input-group prepend="確認密碼">
          <b-input
            name="confirmPassword"
            autocomplete="off"
            v-model="passwords.confirm"
            :type="showEyes ? 'text' : 'password'"
          />
          <b-input-group-append>
            <b-button variant="primary" @click="showEyes = !showEyes">
              <font-awesome-icon :icon="showEyes ? 'eye' : 'eye-slash'" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <template v-slot:modal-footer>
        <b-button @click.stop="confirmModifyPassword" variant="danger">確定</b-button>
        <b-button @click.stop="cancelModifyPassword" variant="primary">取消</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import store from '../store/index';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { themes } from '@/assets/js/common.js';
import { authChangePassword } from '@/assets/service/dataManager.js';
const menus = [
  '心導管紀錄',
  'LAAO Report',
  'Permanent Pacemaker',
  '心臟電生理紀錄',
  '周邊血管檢查治療報告',
  '心導管檢查術前評估',
  '心導管報告撰寫作業',
  '病患基本資料與術前評估',
];
const subMenus = [
  '內視鏡膽管胰管檢查',
  '心臟超音波系統畫面',
  '消化內科內視鏡檢查報告',
  '高層次超音波檢查報告',
  '產科五個月超音波檢查報告',
  '產科早期懷孕超音波檢查報告',
  '耳鼻喉科頭頸超音波1',
  '耳鼻喉科頭頸超音波2',
];
export default {
  data() {
    return {
      title: $setting.name,
      logoImagePath: process.env.BASE_URL + $setting.logoImageName,
      logoImageSize: $setting.logoImageSize,
      isLocal: false,
      menus,
      subMenus,
      colorSelected: null,
      themes,
      passwords: {
        old: '',
        new: '',
        confirm: '',
      },
      showEyes: false,
      department: process.env.VUE_APP_DEPARTMENT,
    };
  },
  computed: {
    ...mapState(['Profile4User']),
    ...mapGetters(['getThemeColors', 'getToggleReport']),
    colors() {
      return Object.values(this.themes).map(({ key, label }) => ({
        text: label,
        value: key,
      }));
    },
    //櫃檯作業
    counter: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (x.includes('FI0101') || x.includes('FI0102')) {
            show = true;
          }
        });
        return show;
      },
    },

    //檢查室作業
    checkRoom: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (x.includes('FI0201') || x.includes('FI0203')) {
            show = true;
          }
        });
        return show;
      },
    },
    //診斷報告
    report: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        // let Fn = store.state.Profile4User.functions;
        // Fn.forEach((x) => {
        //   if (
        //     x.includes('FI0301') ||
        //     x.includes('FI0302') ||
        //     x.includes('FI0303') ||
        //     x.includes('FI0304') ||
        //     x.includes('FI0305') ||
        //     x.includes('FI0306') ||
        //     x.includes('FI0307') ||
        //     x.includes('FI0308')
        //   ) {
        //     show = true;
        //   }
        // });
        return show;
      },
    },
    //權限管理作業
    Author: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (
            x.includes('Account') ||
            x.includes('Role') ||
            x.includes('Function') ||
            x.includes('AuditEvent')
          ) {
            show = true;
          }
        });
        return show;
      },
    },
    //基本資料維護
    GernerData: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (
            x.includes('Employee') ||
            x.includes('Patient') ||
            x.includes('CheckCategory') ||
            x.includes('CheckCombo') ||
            x.includes('CheckItem') ||
            x.includes('Medication') ||
            x.includes('SubMedication') ||
            x.includes('Institution') ||
            x.includes('HrrWord') ||
            x.includes('Hospital') ||
            x.includes('ModalityCategory') ||
            x === 'Room' ||
            x.includes('CodeName') ||
            x.includes('ProcedureGroup') ||
            x.includes('Device')
          ) {
            show = true;
          }
        });
        return show;
      },
    },
    //排程維護
    schedule: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (
            x.includes('DefaultSpecialTime') ||
            x.includes('SpecialTime') ||
            x.includes('Schedule') ||
            x.includes('BookingTest')
          ) {
            show = true;
          }
        });
        return show;
      },
    },
    //報告醫師排程維護
    doctor: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach((x) => {
          if (
            x.includes('WeekScheduling') ||
            x.includes('MonthScheduling') ||
            x.includes('ManualAssign')
          ) {
            show = true;
          }
        });
        return show;
      },
    },
    //統計
    statistics: {
      get: function () {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        // console.log(Fn);
        Fn.forEach((x) => {
          if (
            x.includes('EmployeeWorkload') ||
            x.includes('DeviceWorkload') ||
            x.includes('MI02/FI0204') ||
            x.includes('ImageStat') ||
            x.includes('CheckRoomStat') ||
            x.includes('ReportRoomStat')
          ) {
            show = true;
          }
        });
        return show;
      },
    },
    functions: {
      get: function () {
        return store.state.Profile4User.functions;
      },
    },
  },
  methods: {
    ...mapMutations(['SET_THEME', 'SET_SIDE_MESSAGE']),
    ...mapActions(['action_savingPersonalSetting']),
    ellipsisClick() {
      setTimeout(() => {
        document.getElementById('planePad').focus();
      }, 500);
    },
    confirmModifyPassword() {
      if (
        this.passwords.new !== this.passwords.confirm ||
        Object.values(this.passwords).some((v) => !v)
      ) {
        this.SET_SIDE_MESSAGE({ msg: '密碼未填或不一，請重新輸入' });
        document
          .getElementById('modifyPassword___BV_modal_content_')
          .classList.toggle('shake-active');
        Object.keys(this.passwords).forEach((k) => (this.passwords[k] = ''));
        setTimeout(() => {
          document
            .getElementById('modifyPassword___BV_modal_content_')
            .classList.toggle('shake-active');
        }, 700);
        return;
      }
      authChangePassword(this.passwords.old, this.passwords.new).then(() => {
        this.SET_SIDE_MESSAGE({ msg: '密碼更換成功' });
      });
      this.$refs.passwordModal.hide();
    },
    cancelModifyPassword() {
      this.$refs.passwordModal.hide();
    },
    troggleModifyPassword() {
      this.$refs.popover.$emit('close');
      this.$refs.passwordModal.show();
    },
    logout() {
      //呼叫Store內的mutations才可更改state內的值
      this.$store.state.isLogin = false;
      this.$store.commit({
        type: 'UserLogout',
        userData: this.$store.state.Profile4User,
      });
      this.$router.replace('/Login');
    },
    imageStat() {
      this.$router.replace({ name: 'ImageStat', query: { id: 'ImgStat' } });
    },
    checkRoomStat() {
      this.$router.replace({ name: 'CRStat', query: { id: 'CRStat' } });
    },
    reportStat() {
      this.$router.replace({ name: 'ReportStat', query: { id: 'RptStat' } });
    },
    popUpWindow(url, width, height){
      let lPosit = null
      let tPosit = null
      
      lPosit = (window.screen.width / 2) - ((width / 2) + 10) 
      tPosit = (window.screen.height / 2) - ((height / 2) + 50) 
      
      window.open(url, '', `
        status=no,
        width=${width},
        height=${height},
        resizable=yes,
        left=${lPosit},
        top=${tPosit},
        screenX=${lPosit},
        screenY=${tPosit},
        toolbar=no,
        menubar=no,
        scrollbars=no,
        location=no,
        directories=no
      `)
    },
    toFI0307(){
      let routeData = this.$router.resolve({
          path: '/MI03/FI0307',
          name: 'FI0307' 
      })
      // // new tab
      // window.open(routeData.href, '_blank')

      // new window
      // window.open(routeData.href, '', 'width=600,height=600')

      let popWidth = parseInt(window.screen.width * 0.8)
      let popHeight = parseInt(window.screen.height * 0.8)

      // console.log(`popWidth: `, popWidth)
      // console.log(`popHeight: `, popHeight)

      this.popUpWindow(routeData.href, popWidth, popHeight)
    }
  },
  created() {
    if (location.href.indexOf('192.168.1.200') > -1 || process.env.NODE_ENV !== 'production') {
      this.isLocal = true;
      window.dtcDebug = true;
    }
    this.colorSelected = this.getThemeColors.key;
    console.log(`this.functions: `, this.functions);
  },
  watch: {
    colorSelected(val) {
      this.SET_THEME(val);
      this.action_savingPersonalSetting();
    },
    getThemeColors({ key }) {
      this.colorSelected = key;
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/animation.scss';
#planePad fieldset {
  border: none;
  .custom-control-label {
    color: #333;
  }
}

#ellipsis {
  width: 25px;
  height: 25px;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.25);
  &:active {
    background-color: rgba(255, 255, 255, 0.5);
  }
}

#planePad {
  width: 200px;
}
</style>
