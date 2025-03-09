<template>
  <main class="header-content">
    <StepInstructions ref="stepInstructionsRef"></StepInstructions>
    <div class="main-content">
      <div class="logo">
        <b-img :src="`${publicPath}radiologyLogo.svg`" class="mr-1 logo" />
      </div>
      <div class="patient-data">
        <div>
          <span class="item-content">申請單號:</span>

          <span class="data-content">{{ patientInfoData.orderNo || "" }}</span>
        </div>
        <div>
          <span class="item-content">病患姓名:</span>

          <span class="data-content">{{ patientInfoData.Name || "" }}</span>
        </div>
        <div>
          <span class="item-content">病患性別:</span
          ><span class="data-content">{{ patientInfoData.genderChinese || "" }}</span>
        </div>
        <div>
          <span class="item-content">電話[住家]:</span
          ><span class="data-content">{{ patientInfoData.PhoneNo4Residence || "" }}</span>
        </div>

        <div>
          <span class="item-content">病患號碼:</span
          ><span class="data-content">{{ patientInfoData.hrNum || "" }} </span>
        </div>
        <div>
          <span class="item-content">身分證號:</span
          ><span class="data-content">{{ patientInfoData.hrNum || "" }}</span>
        </div>
        <div>
          <span class="item-content">病患生日:</span
          ><span class="data-content">{{ patientInfoData.birthChinese || "" }}</span>
        </div>
        <div>
          <span class="item-content">電話[手機]:</span
          ><span class="data-content">{{ patientInfoData.PhoneNo4Mobile || "" }}</span>
        </div>

        <div></div>
        <div>
          <span class="item-content">病患來源:</span
          ><span class="data-content">{{ patientInfoData.sourceType || "" }}</span>
        </div>
        <div></div>
        <div>
          <span class="item-content">電話[工作]:</span
          ><span class="data-content">{{ patientInfoData.PhoneNo4Work || "" }}</span>
        </div>

        <!-- {{ patientInfo }} -->
      </div>

      <div class="manual-content">
        <div class="mr-1">
          <b-button variant="manualbtn" @click="openIllu"
            ><svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" fill="#1572CA" fill-opacity="0.24" />
              <path
                d="M13 7C13 7.55228 12.5523 8 12 8C11.4477 8 11 7.55228 11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7Z"
                fill="#fff"
              />
              <path
                d="M12 16.5V11.5C12 11.035 12 10.8025 11.9489 10.6118C11.8102 10.0941 11.4059 9.68981 10.8882 9.55111C10.6975 9.5 10.465 9.5 10 9.5V9.5M12 16.5H13.5M12 16.5H10.5"
                stroke="#fff"
              />
            </svg>
            操作說明</b-button
          >
        </div>
        <div>
          <b-button class="back-btn" variant="primary" @click="setWholeDay">
            <font-awesome-icon icon="times" />
          </b-button>
        </div>
      </div>
    </div>
    <div class="bar-content"></div>
  </main>
</template>

<script>
import StepInstructions from "@/components/Booking/StepInstructions";
export default {
  props: {
    patientInfo: {
      type: Object,
      default: () => {},
    },
    when: {
      type: String,
      default: "",
    },
    dialogOpened: {
      type: Boolean,
      default: false,
    },
    rooms: {
      type: Array,
      default: () => [],
    },
    variants: {
      type: Array,
      default: () => [],
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    defaultIsAll: {
      type: Boolean,
      default: false,
    },
    dtcBtnId: {
      type: [String, Number],
      default: "",
    },
  },
  components: { StepInstructions },
  data() {
    return {
      patientInfoData: {},
      publicPath: process.env.BASE_URL,
    };
  },

  methods: {
    openIllu() {
      this.$refs["stepInstructionsRef"].showIlluDetail();
    },
    setWholeDay() {
      // this.when = '全天';
      this.$emit("update:when", "全天");
      this.$emit("update:dialogOpened", false);
      this.$emit("executeAfterFresh");
      this.$emit("UpView");
    },
    setData() {
      let obj = { ...this.patientInfo };
      obj.birthChinese = obj.Birthday
        ? this.$moment(obj.Birthday).format("YYYY-MM-DD")
        : "";
      obj.genderChinese = obj.Sex == "M" ? "男" : obj.Sex == "F" ? "女" : "";
      this.patientInfoData = { ...obj };
    },
  },
  mounted() {
    this.setData();
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
/* /deep/ .modal-dialog.modal-dialog-centered {
  max-width: calc(100% - 60px);
}

@media (min-width: 1020px) {
  .menufunc-btns {
    width: 100%;
  }
} */

.header-content {
  background-color: #f9fafb;
  width: 100%;
  color: #1c2a54;

  .main-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    height: 120px;
    width: 90%;
    margin: 0 auto;
    .patient-data {
      display: grid;
      grid-template-columns: 250px 250px 250px 250px;
      grid-column-gap: 10px;
      grid-row-gap: 5px;

      .item-content {
      }

      .data-content {
        color: #4c6eb9;
      }
    }
  }
  .bar-content {
    background: rgb(244, 246, 248);
    background: linear-gradient(
      90deg,
      rgba(244, 246, 248, 1) 0%,
      rgba(42, 152, 240, 1) 47%,
      rgba(244, 246, 248, 1) 100%
    );
    height: 10px;
  }
}
.manual-content {
  display: flex;
}
/deep/ .btn-manualbtn {
  background: #fff 0% 0% no-repeat padding-box;
  color: #353b41;
  padding: 6.2px 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.3rem;
  border: 1px solid #d6d6d6;
  cursor: pointer;
}
/deep/ .btn-manualbtn:hover {
  background: rgb(235, 235, 235) 0% 0% no-repeat padding-box;
}
/deep/ .btn-manualbtn:focus {
  box-shadow: 0 0 0 0.2rem rgb(196, 196, 196);
}
</style>
