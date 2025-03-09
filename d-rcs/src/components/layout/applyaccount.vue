<template>
  <Dialog v-model:visible="isShowApplyAccount" :draggable="false" style="width: 860px"
    :header="step == 1 ? '註冊帳號' : '申請人須知'" :closable="true" :modal="true" @show="setData" class="custom-modal">
    <div class="modal-section" v-if="step == 1">
      <div class="title mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471"
            stroke="#222222" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="12" cy="8" r="4" fill="#2A4157" fill-opacity="0.24" stroke="#222222" stroke-width="1.2"
            stroke-linecap="round" />
        </svg>
        個人基本資料
      </div>
      <div class="block">
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon red-star">使用者帳號</span>
          <InputText placeholder="請輸入英文數字(上限30字)"
            class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0" type="text"
            v-model.trim="modalItem.No" autofocus maxlength="30" />
        </div>
        <div></div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon red-star">使用者姓名</span>
          <InputText placeholder="請輸入姓名(上限50字)" class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
            type="text" v-model.trim="modalItem.Name" maxlength="50" />
        </div>
        <div></div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">聯絡電話</span>
          <InputText placeholder="請輸入聯絡電話(上限20字)"
            class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0" type="text"
            v-model.trim="modalItem.Phone" maxlength="20" />
        </div>
        <div></div>
        <div class="p-inputgroup mb-0">
          <span class="p-inputgroup-addon red-star">E-mail</span>
          <InputText placeholder="請輸入E-mail(上限200字)"
            class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0" type="text"
            v-model.trim="modalItem.Email" maxlength="200" />
        </div>
        <div></div>
        <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
          (請填寫正確，如帳號核准，將會發信通知)
        </div>
        <div></div>
      </div>

      <div class="title mb-1">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 12.5L15.5 12.5" stroke="#222222" stroke-linecap="round" />
          <path d="M8.5 15.5L12.5 15.5" stroke="#222222" stroke-linecap="round" />
          <path
            d="M5.5 5.9C5.5 5.05992 5.5 4.63988 5.66349 4.31901C5.8073 4.03677 6.03677 3.8073 6.31901 3.66349C6.63988 3.5 7.05992 3.5 7.9 3.5H12.5059C12.8728 3.5 13.0562 3.5 13.2288 3.54145C13.3819 3.57819 13.5282 3.6388 13.6624 3.72104C13.8138 3.8138 13.9435 3.94352 14.2029 4.20294L17.7971 7.79706C18.0565 8.05648 18.1862 8.1862 18.279 8.33757C18.3612 8.47178 18.4218 8.6181 18.4586 8.77115C18.5 8.94378 18.5 9.12723 18.5 9.49411V18.1C18.5 18.9401 18.5 19.3601 18.3365 19.681C18.1927 19.9632 17.9632 20.1927 17.681 20.3365C17.3601 20.5 16.9401 20.5 16.1 20.5H7.9C7.05992 20.5 6.63988 20.5 6.31901 20.3365C6.03677 20.1927 5.8073 19.9632 5.66349 19.681C5.5 19.3601 5.5 18.9401 5.5 18.1V5.9Z"
            stroke="#222222" />
          <path
            d="M12.5 3.5V7.1C12.5 7.94008 12.5 8.36012 12.6635 8.68099C12.8073 8.96323 13.0368 9.1927 13.319 9.33651C13.6399 9.5 14.0599 9.5 14.9 9.5H18.5"
            stroke="#222222" />
        </svg>
        帳號權限資料
      </div>

      <div class="block mt-0">
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon red-star">所屬單位</span>
          <Dropdown v-model="modalItem.InstitutionNo" :options="institutionOptions" style="padding-top: 5px"
            optionLabel="text" optionValue="value" class="custom-height" :filter="true"
            @change="modalItem.OtherInstitution = ''" />
        </div>
        <div>
          <InputText placeholder="所屬單位機構代碼(選其他時此欄位必填)"
            class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0" type="text"
            v-model.trim="modalItem.OtherInstitution" v-show="modalItem.InstitutionNo == '0000000000'"
            :class="!modalItem.OtherInstitution ? 'p-invalid' : ''" />
        </div>
        <div class="p-inputgroup mb-2 col-span-full">
          <span class="p-inputgroup-addon red-star mr-2">職務</span>
          <section class="form-check">
            <div class="mr-2" v-for="(item, index) in jobOptions" :key="index">
              <input
                class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio" :id="'radiojobOptions' + item.value + item.text" v-model="modalItem.job"
                :value="item.value" @change="modalItem.otherJob = ''" />
              <label class="form-check-label inline-block text-gray-800 cursor-pointer"
                :for="'radiojobOptions' + item.value + item.text">
                {{ item.text }}
              </label>
            </div>

            <InputText class="p-button-sm" v-model.trim="modalItem.otherJob" :disabled="modalItem.job != '其他'"
              style="width: 230px; font-size: 14px"
              :class="modalItem.job == '其他' && !modalItem.otherJob ? 'p-invalid' : ''" placeholder="職務選擇其他時，此欄位必填" />
          </section>

          <!-- <div style="width: 26%"></div> -->
        </div>
        <div class="p-inputgroup mb-0">
          <span class="p-inputgroup-addon">身分證字號</span>
          <InputText placeholder="請輸入身分證字號" class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
            type="text" v-model.trim="modalItem.Identifier"
            :class="modalItem.job == '醫生' && !modalItem.Identifier ? 'p-invalid' : ''" maxlength="10" />
        </div>
        <div></div>
        <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
          (如職務為醫師，則須填寫身分證字號)
        </div>
        <div></div>
        <div class="p-inputgroup mb-0">
          <span class="p-inputgroup-addon">科別</span>
          <!-- <InputText placeholder="請輸入科別" class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
            type="text" v-model.trim="modalItem.DepartmentName" :class="
              modalItem.job == '醫生' && !modalItem.DepartmentName ? 'p-invalid' : ''
            " /> -->
          <Dropdown v-model="modalItem.DepartmentName" :options="departmentOptions" style="padding-top: 5px"
            optionLabel="Name" optionValue="No" class="custom-height" :filter="true" />
        </div>
        <div></div>
        <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
          (如職務為醫師，則須選擇科別)
        </div>
        <div></div>
        <div class="p-inputgroup mb-2 col-span-full spec-column-goal">
          <span class="p-inputgroup-addon red-star">使用目的</span>
          <!-- <Dropdown
            v-model="modalItem.reason"
            :options="reasonOptions"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            class="custom-height"
            :filter="false"
          /> -->
          <section>
            <div class="form-check ml-2 mr-2" v-for="(item, index) in reasonOptions" :key="index">
              <input
                class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio" :id="'radioPatientRelationType' + item.value + item.text" v-model="modalItem.reason"
                :value="item.value" />
              <label class="form-check-label flex text-gray-800 cursor-pointer"
                :for="'radioPatientRelationType' + item.value + item.text">
                {{ item.text }}
                <span :title="item.text">
                  <svg class="ml-1" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#222222" />
                    <path
                      d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z"
                      fill="#222222" />
                    <path d="M12 17V10" stroke="#222222" />
                  </svg>
                </span>
              </label>
            </div>
          </section>
        </div>
      </div>

      <div style="color: red; padding-left: 20px" class="font-semibold">
        <span><i class="fas fa-exclamation-circle"></i></span><span> * 代表為必填欄位</span>
      </div>
    </div>
    <div v-if="step == 2">
      <div class="block2">
        <div class="title2 mb-1 underline">申請人應遵守下列使用規範:</div>
        <section>
          <div class="mark">a.</div>
          <div>
            使用者於<span>第一次登錄系統時，應立即更改預設密碼</span>，並妥善保管帳號與維持密碼之機密性。
          </div>
          <div class="mark">b.</div>
          <div>
            使用者之密碼長度設定至少6碼(含)以上，密碼必須包含英文大寫字母、英文小寫字母、阿拉伯數字及特殊符號四個類別中。
          </div>
          <div class="mark">c.</div>
          <div>
            使用者須負密碼保護之責，不得對任何人透露或以任何形式公開自己帳號及密碼。
          </div>
          <div class="mark">d.</div>
          <div>
            禁止與他人共用帳號及密碼，密碼被他人知悉或發現疑遭盜用或破解時，應立即更改密碼。
          </div>
          <div class="mark">e.</div>
          <div>不得利用本系統資源從事與業務無關之活動或違法行為。</div>
          <div class="mark">f.</div>
          <div>其他相關規定依資訊安全管理制度(ISMS)之相關規範辦理。</div>
          <div class="mark">g.</div>
          <div>
            若因電腦處理資料業務而知悉或持有他人個人資料者，不得無故洩漏。並應遵守個人資料保護法相關規定。
          </div>
        </section>
        <div class="mt-6 title2">
          如有違反上述事項時，得終止違反者之使用權或採取其他處罰措施。
        </div>

        <div class="mt-12 flex justify-center mb-20">
          <Button class="p-button-danger" label="我已閱讀並充分了解" @click="saveModal" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button v-if="step == 1" label="提出申請" @click="applyAccount" />
      <Button v-if="step == 1" class="p-button-success" label="取消" @click.stop="isShowApplyAccount = false" />
    </template>
  </Dialog>
</template>
<script>
import { ref, toRef, toRefs, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";

import { useToast } from "vue-toastification";

import { getInstitutionNos, postUserRegister, getReasonRoleList, getDepart } from "Service/apis.js";

export default {
  setup() {
    const step = ref(1);
    const modalItem = ref({});

    const store = useStore();
    const toast = useToast();

    const isShowApplyAccount = ref(false);

    const jobOptions = ref([
      { text: "醫生", value: "醫生" },
      { text: "護理人員", value: "護理人員" },
      { text: "行政人員", value: "行政人員" },

      { text: "其他", value: "其他" },
    ]);

    const reasonOptions = ref([
      {
        text: "偏遠地區遠距醫療建置計畫(醫事司)",
        value: "偏遠地區遠距醫療建置計畫(醫事司)",
      },
      {
        text: "緊急救護零時差多方資訊影像會診計畫(照護司)",
        value: "緊急救護零時差多方資訊影像會診計畫(照護司)",
      },
      {
        text: "優化兒童醫療照護計畫(醫事司)",
        value: "優化兒童醫療照護計畫(醫事司)",
      },

      { text: "其他", value: "其他" },
    ]);

    const institutionOptions = ref([
      { text: "衛生福利部桃園醫院", value: "衛生福利部桃園醫院" },
      { text: "臺北市立聯合醫院", value: "臺北市立聯合醫院" },
      { text: "衛生福利部苗栗醫院", value: "衛生福利部苗栗醫院" },
      { text: "國立陽明大學附設醫院", value: "國立陽明大學附設醫院" },
      { text: "其他", value: "其他" },
    ]);

    const departmentOptions = ref([])

    const saveModal = async () => {
      const objAll = { ...modalItem.value };

      const obj = {
        No: objAll.No || "",
        Identifier: objAll.Identifier || "",
        InstitutionNo: objAll.InstitutionNo || "",
        OtherInstitution: objAll.OtherInstitution || "",
        Name: objAll.Name || "",
        Phone: objAll.Phone || "",
        Email: objAll.Email || "",
        DepartmentName: objAll.DepartmentName || "",
        Title: objAll.job == "其他" ? `${objAll.job}${objAll.otherJob}` : objAll.job,
        ReasonRoleNo: objAll.reason || "",
        // objAll.reason == "OtherManager"
        //   ? `${objAll.reason}${objAll.otherReason}`
        //   : objAll.reason,
      };

      // if (obj.institutionNo == "其他") {
      //   obj.InstitutionNo = obj.institutionNo + obj.OtherInstitution;
      // } else {
      //   obj.InstitutionNo = obj.institutionNo;
      // }

      // if (obj.job == "其他") {
      //   obj.Title = obj.job + obj.otherJob;
      // } else {
      //   obj.Title = obj.job;
      // }

      // if (obj.reason == "OtherManager") {
      //   obj.ReasonRoleNo = obj.reason + obj.otherReason;
      // } else {
      //   obj.ReasonRoleNo = obj.reason;
      // }

      try {
        await postUserRegister(obj);
        toast.success(`帳號申請成功`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
      isShowApplyAccount.value = false;
    };

    const setData = async () => {
      step.value = 1;
      modalItem.value = {};
      await getOptions();
      await GetDepart();
    };

    const getOptions = async () => {
      const res = await getInstitutionNos("");
      let institutionNos = res.data;
      institutionNos = institutionNos.map((s) => {
        s.text = s.Name + `【${s.No}】`;
        s.value = s.No;
        return s;
      });
      institutionNos = institutionNos.filter((s) => !`${s.Name}`.includes("系統管理"));

      institutionOptions.value = [...institutionNos];

      const res2 = await getReasonRoleList("");
      let reasonRoles = res2.data;
      reasonRoles = reasonRoles.map((s) => {
        s.text = s.Name;
        s.value = s.No;
        return s;
      });

      reasonRoles = reasonRoles.filter((s) => !`${s.text}`.includes("其他"));

      reasonOptions.value = [...reasonRoles];
    };

    const applyAccount = () => {
      const obj = { ...modalItem.value };

      if (obj.job == "醫生" && (!obj.DepartmentName || !obj.Identifier)) {
        toast.error(`職務選擇醫生時，請完成身分證字號與科別填寫才可提出申請`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      if (obj.InstitutionNo == "0000000000" && !obj.OtherInstitution) {
        toast.error(
          `所屬單位機構選擇其他時，需完成其他機構代碼欄位內容填寫才可提出申請`,
          {
            timeout: 5000,
            hideProgressBar: true,
          }
        );
        return;
      }

      if (obj.job == "其他" && !obj.otherJob) {
        toast.error(`職務選擇其他時，需完成其他職務欄位內容填寫才可提出申請`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      let checkData = [
        {
          text: "使用者帳號",
          value: obj.No,
        },
        {
          text: "使用者姓名",
          value: obj.Name,
        },
        {
          text: "E-mail",
          value: obj.Email,
        },
        {
          text: "所屬單位",
          value: obj.InstitutionNo,
        },
        {
          text: "職務",
          value: obj.job,
        },
        {
          text: "使用目的",
          value: obj.reason,
        },
      ];

      checkData = checkData
        .filter((s) => !s.value)
        .map((s) => {
          return s.text;
        });

      checkData = checkData.join("、");
      if (!!checkData) {
        toast.error(`${checkData}為必填欄位，請完成填寫才可提出申請`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      step.value = 2;
    };

    const GetDepart = async () => {
      try {
        const res = await getDepart()
        if (res.status === 200) departmentOptions.value = res.data.Items
      } catch (err) {
        console.log(err)
      }
    }

    return {
      modalItem,
      isShowApplyAccount,

      saveModal,
      setData,
      step,
      jobOptions,
      reasonOptions,
      institutionOptions,
      departmentOptions,

      getOptions,
      GetDepart,
      applyAccount,
    };
  },
};
</script>
<style lang="scss" scoped>
.title {
  color: rgb(73, 80, 87);
  font-size: 16px;
  font-weight: 600;
  display: grid;
  grid-template-columns: 26px 1fr;
  grid-column-gap: 8px;
}

.title2 {
  color: rgb(73, 80, 87);
  font-size: 16px;
  font-weight: 600;
}

.block {
  display: grid;
  grid-template-columns: 460px 1fr;
  grid-column-gap: 8px;
  background: transparent;
  padding: 0px 20px;
}

.block2 {
  background: transparent;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  height: 576px;

  section {
    display: grid;
    grid-template-columns: 36px 1fr;
    grid-column-gap: 8px;
    color: rgb(14, 13, 13);

    .mark {
      color: #e43033;
    }

    div {
      span {
        color: #e43033;
        font-style: oblique;
        font-weight: 600;
      }
    }
  }
}

.p-inputgroup {
  .p-inputgroup-addon {
    background: #f1f9e8;
    color: #1f2d56;
    font-weight: bold;
    height: 40px;
    border: 0px;
    width: 120px;
    font-size: 16px;
    margin-top: 1px;
    // font-weight: 600;
  }

  .content {
    height: 40px;
    line-height: 40px;
    border: 1px solid #e2e5e9;
    width: calc(100% - 120px);
    padding-left: 5px;
  }
}

.p-inputtext {
  // border-color: #53595b;
  height: 40px;
}

.p-dropdown {
  height: 40px;
}

::v-deep(.p-dropdown-label.p-inputtext) {
  padding-top: 3px;
}

.form-check {
  display: flex;
  align-items: center;
}

.spec-column-goal {
  display: grid;
  grid-template-columns: 120px 1fr;

  section {
    >div {
      margin-bottom: 3px;
    }
  }
}
</style>
