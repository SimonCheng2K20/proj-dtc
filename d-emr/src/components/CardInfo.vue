<template>
  <div>
    <div class="mb-1">
      目前狀態：<span :style="{ color: isAutoSignature ? '#28BB32' : '#f00' }"
        ><i
          class="mr-1"
          :class="isAutoSignature ? 'el-icon-success' : 'el-icon-warning'"
        ></i
        >{{ isAutoSignature ? "已認證" : "未認證" }}</span
      >
    </div>
    <div v-if="isAutoSignature && cardInfo.Connect">
      <el-form ref="postform" label-position="left" label-width="110px">
        <el-row :gutter="10">
          <el-col>
            <InputLabel class="mb-1" title="身分證字號">
              <el-input v-model="cardInfo.Id" disabled />
            </InputLabel>
          </el-col>
          <el-col>
            <InputLabel class="mb-1" title="使用者名稱">
              <el-input v-model="cardInfo.Name" disabled />
            </InputLabel>
          </el-col>
          <!-- <el-col>
            <InputLabel class="mb-1" title="卡片憑證">
              <el-input v-model="isSignatured" disabled />
            </InputLabel>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div class="mb-1" style="color: #f00" v-else>
      <p>
        查無醫事人員卡資料，請於讀卡機插入醫事人員卡後點擊「醫事人員卡認證」或「刷新」按鈕。
      </p>
    </div>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-11 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1 mr-1" v-if="cardInfo.Connect" @click="$emit('close')">確定</Button>
      <Button
        class="buttonColor-5 mr-1"
        v-if="!cardInfo.Connect"
        @click="medicalCardCheck"
        >刷新</Button
      >
      <Button
        class="buttonColor-7"
        v-if="!isAutoSignature"
        @click="isAutoSignatureChange()"
      >
        醫事人員卡認證
      </Button>
    </div>
    <MedicalCardCheckPassword
      v-model="medicalCardCheckPasswordShow"
      @ok="onMedicalCardCheckOk"
      @error="onMedicalCardCheckError"
    ></MedicalCardCheckPassword>
  </div>
</template>

<script>
import MedicalCardCheckPassword from "./MedicalCardCheckPassword.vue";

export default {
  components: {
    MedicalCardCheckPassword,
  },
  data() {
    return {
      medicalCardCheckPasswordShow: false,
    };
  },
  computed: {
    isAutoSignature: {
      get() {
        return this.$store.state.userData.AutoSignature;
      },
      set(val) {
        this.$store.commit("userData", { AutoSignature: val });
      },
    },
    isSignatured: {
      get() {
        return this.$store.state.signature;
      },
      set(val) {
        this.$store.commit("setSignature", val);
      },
    },
    cardInfo: {
      get() {
        return this.$store.state.cardInfo;
      },
      set(val) {
        this.$store.commit("cardInfo", val);
      },
    },
  },
  methods: {
    async isAutoSignatureChange() {
      this.medicalCardCertify();
    },
    async medicalCardCheck() {
      try {
        const { data, error } = await this.$global.medicalCardCheck();

        if (error) {
          console.log(`error`);
        }

        if (data) {
          console.log(`reader data: `, data);
        }
      } catch (err) {
        console.log(`error: `, err);
      }
    },
    async medicalCardCertify() {
      try {
        this.$store.commit("loading", true);

        const { data, error } = await this.$global.medicalCardCertify(
          this.$store.state.userData.Identifier
        );

        if (error) {
          this.$message.error(error);
          this.onMedicalCardCheckError();
          return;
        }

        if (data === undefined || data === null) {
          console.log(`no matched ID`);
          this.isAutoSignature = false;
        }

        if (data) {
          this.medicalCardCheckPasswordShow = true;
        }
      } catch (err) {
        console.log(`error: `, err);
      } finally {
        this.$store.commit("loading", false);
      }
    },
    async onMedicalCardCheckOk() {
      const res = await this.$api.postSetAutoSignature({
        AutoSignature: true,
        HcaSignature: this.$store.state.signature,
      });

      if (res.status === 200 || res.status === 204) {
        this.$store.commit("userData", { AutoSignature: true });
      }
    },
    onMedicalCardCheckError() {
      this.isAutoSignature = false;
    },
    // async GetAccountSignatureById() {
    //   try {
    //     const res = await this.$api.getAccountSignatureById(
    //       this.$store.state.userData.No
    //     );

    //     if (res) {
    //       this.isSignatured = res.HcaSignature;
    //     }
    //   } catch (err) {
    //     console.log(`error: `, err)
    //   }
    // },
  },
  async mounted() {
    // if (this.$store.state.userData.No) {
    //   console.log(
    //     `this.$store.state.userData.No: `,
    //     this.$store.state.userData.No
    //   );
    //   await this.GetAccountSignatureById(this.$store.state.userData.No);
    // }
    await this.medicalCardCheck();
  },
};
</script>
