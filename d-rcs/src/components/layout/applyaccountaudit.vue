<template>
  <div>
    <Dialog
      v-model:visible="isShowApplyAccountAudit"
      :draggable="false"
      :header="+modalItem.Status == 3 ? '帳號審核' : '檢視'"
      :closable="true"
      :modal="true"
      @show="setData"
      class="custom-modal"
    >
      <div class="modal-section">
        <div class="main-section">
          <div class="left-side avoid-clicks">
            <div class="title mb-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.7274 20.4471C19.2716 19.1713 18.2672 18.0439 16.8701 17.2399C15.4729 16.4358 13.7611 16 12 16C10.2389 16 8.52706 16.4358 7.12991 17.2399C5.73276 18.0439 4.72839 19.1713 4.27259 20.4471"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  fill="#2A4157"
                  fill-opacity="0.24"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>

              個人基本資料
            </div>
            <div class="block">
              <div class="p-inputgroup mb-2">
                <span class="p-inputgroup-addon red-star">使用者帳號</span>
                <InputText
                  placeholder="請輸入英文數字"
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.No"
                />
              </div>
              <div></div>
              <div class="p-inputgroup mb-2">
                <span class="p-inputgroup-addon red-star">使用者姓名</span>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.Name"
                />
              </div>
              <div></div>
              <div class="p-inputgroup mb-2">
                <span class="p-inputgroup-addon">聯絡電話</span>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.Phone"
                />
              </div>
              <div></div>
              <div class="p-inputgroup mb-0">
                <span class="p-inputgroup-addon red-star">E-mail</span>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.Email"
                />
              </div>
              <div></div>
              <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
                (請填寫正確，如帳號核准，將會發信通知)
              </div>
              <div></div>
            </div>

            <div class="title mb-1">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.5 12.5L15.5 12.5" stroke="#222222" stroke-linecap="round" />
                <path d="M8.5 15.5L12.5 15.5" stroke="#222222" stroke-linecap="round" />
                <path
                  d="M5.5 5.9C5.5 5.05992 5.5 4.63988 5.66349 4.31901C5.8073 4.03677 6.03677 3.8073 6.31901 3.66349C6.63988 3.5 7.05992 3.5 7.9 3.5H12.5059C12.8728 3.5 13.0562 3.5 13.2288 3.54145C13.3819 3.57819 13.5282 3.6388 13.6624 3.72104C13.8138 3.8138 13.9435 3.94352 14.2029 4.20294L17.7971 7.79706C18.0565 8.05648 18.1862 8.1862 18.279 8.33757C18.3612 8.47178 18.4218 8.6181 18.4586 8.77115C18.5 8.94378 18.5 9.12723 18.5 9.49411V18.1C18.5 18.9401 18.5 19.3601 18.3365 19.681C18.1927 19.9632 17.9632 20.1927 17.681 20.3365C17.3601 20.5 16.9401 20.5 16.1 20.5H7.9C7.05992 20.5 6.63988 20.5 6.31901 20.3365C6.03677 20.1927 5.8073 19.9632 5.66349 19.681C5.5 19.3601 5.5 18.9401 5.5 18.1V5.9Z"
                  stroke="#222222"
                />
                <path
                  d="M12.5 3.5V7.1C12.5 7.94008 12.5 8.36012 12.6635 8.68099C12.8073 8.96323 13.0368 9.1927 13.319 9.33651C13.6399 9.5 14.0599 9.5 14.9 9.5H18.5"
                  stroke="#222222"
                />
              </svg>
              帳號權限資料
            </div>

            <div class="block mt-0">
              <div class="p-inputgroup mb-2">
                <span class="p-inputgroup-addon red-star">所屬單位</span>
                <Dropdown
                  v-model="modalItem.InstitutionNo"
                  :options="institutionOptions"
                  style="padding-top: 5px"
                  optionLabel="text"
                  optionValue="value"
                  class="custom-height"
                />
              </div>
              <div>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.OtherInstitution"
                  v-show="modalItem.InstitutionNo == '0000000000'"
                />
              </div>
              <div class="p-inputgroup mb-2 col-span-full">
                <span class="p-inputgroup-addon red-star mr-2">職務</span>
                <section class="form-check">
                  <div
                    class="form-check mr-2"
                    v-for="(item, index) in jobOptions"
                    :key="index"
                  >
                    <input
                      class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="radio"
                      :id="'radiojobOptions' + item.value + item.text"
                      v-model="modalItem.job"
                      :value="item.value"
                    />
                    <label
                      class="form-check-label inline-block text-gray-800"
                      :for="'radiojobOptions' + item.value + item.text"
                    >
                      {{ item.text }}
                    </label>
                  </div>

                  <InputText
                    class="p-button-sm"
                    v-model.trim="modalItem.otherJob"
                    :disabled="modalItem.job != '其他'"
                    style="width: 230px; font-size: 14px"
                  />
                </section>

                <!-- <div style="width: 26%"></div> -->
              </div>
              <div class="p-inputgroup mb-0">
                <span class="p-inputgroup-addon">身分證字號</span>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.Identifier"
                />
              </div>
              <div></div>
              <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
                (如職務為醫師，則須填寫身分證字號)
              </div>
              <div></div>
              <div class="p-inputgroup mb-0">
                <span class="p-inputgroup-addon">科別</span>
                <InputText
                  placeholder="請輸入..."
                  class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
                  type="text"
                  v-model.trim="modalItem.DepartmentName"
                />
              </div>
              <div></div>
              <div class="text-right text-red-500 text-sm p-1 pt-0 mb-0 font-semibold">
                (如職務為醫師，則須填寫科別)
              </div>
              <div></div>
              <div class="p-inputgroup mb-2">
                <span class="p-inputgroup-addon red-star">使用目的</span>
                <Dropdown
                  v-model="modalItem.ReasonRoleNo"
                  :options="reasonOptions"
                  style="padding-top: 5px"
                  optionLabel="text"
                  optionValue="value"
                  class="custom-height"
                />
              </div>
            </div>
          </div>
          <div class="right-side">
            <div class="font-extrabold ml-0.5 flex">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5447 6.15207L12.6303 3.61734C12.2278 3.44484 11.7722 3.44484 11.3697 3.61734L5.45535 6.15207C4.79996 6.43295 4.40953 7.11362 4.49798 7.82116L5.11096 12.725C5.31853 14.3856 6.14916 15.9053 7.43478 16.9767L10.9757 19.9274C11.5691 20.4219 12.4309 20.4219 13.0243 19.9274L16.5652 16.9767C17.8508 15.9053 18.6815 14.3856 18.889 12.725L19.502 7.82116C19.5905 7.11362 19.2 6.43295 18.5447 6.15207Z"
                  fill="#2A4157"
                  fill-opacity="0.24"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M9 12L11.5687 14.5687C11.7918 14.7918 12.1633 14.7551 12.3383 14.4925L16 9"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
              <span class="inline-block ml-2"> 授權角色</span>
            </div>
            <div class="d-flex py-2" v-for="(item, index) of roleOptions" :key="index">
              <Checkbox
                :id="`${item.No}${index}`"
                :value="item.No"
                v-model="modalItem.RoleNos"
                class="mr-1"
              />
              <label class="cursor-pointer" :for="`${item.No}${index}`">{{
                item.Name
              }}</label>
            </div>
          </div>
        </div>

        <div class="title mb-1 mt-2" v-if="+modalItem.Status == 2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="#222222" />
            <path
              d="M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9"
              stroke="#222222"
            />
          </svg>

          拒絕原因
        </div>
        <div
          v-if="+modalItem.Status == 2"
          class="mb-2"
          style="
            margin-left: 20px;
            border: 1px solid #ced4da;
            padding: 8px;
            border-radius: 3px;
          "
          v-html="modalItem.RejectReason"
        ></div>
      </div>

      <template #footer>
        <Button label="核准" @click.stop="approved" v-if="+modalItem.Status == 3" />
        <Button
          class="p-button-danger"
          label="拒絕"
          @click.stop="showDenyPop"
          v-if="+modalItem.Status == 3"
        />
        <Button
          class="p-button-success"
          label="關閉"
          @click.stop="isShowApplyAccountAudit = false"
        />
      </template>
    </Dialog>

    <div class="pop-out" v-show="isShowPopout">
      <div
        id="popup-modal"
        tabindex="-1"
        class="overflow-y-auto overflow-x-hidden z-50 md:inset-0 h-modal justify-center items-center"
        aria-hidden="true"
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 830px;
        "
      >
        <div
          class="relative bg-white rounded-lg shadow dark:bg-gray-700"
          style="border: 1px solid rgb(229 225 225 / 69%)"
        >
          <button
            type="button"
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
            @click="isShowPopout = false"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>

          <div class="px-4 py-2 text-start">
            <div
              class="text-2xl font-normal"
              style="color: rgb(29 118 207); font-weight: 800"
            >
              請填寫拒絕核准帳號原因
            </div>
            <div class="schedule">
              <Textareaprime
                class="textarea-content"
                maxlength="2000"
                style="width: 100%; min-height: 125px; grid-column: 1 / -1"
                v-model="denyreason"
                ref="denyRef"
              />
            </div>
            <div class="flex justify-center">
              <Button style="margin-right: 12px" label="確定" @click="denined" />

              <Button
                label="關閉"
                class="p-button-success"
                @click="isShowPopout = false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, toRef, toRefs, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { getInstitutionNos, getReasonRoleList, putAccountList } from "Service/apis.js";
import { useToast } from "vue-toastification";
import dayjs from "dayjs";

export default {
  setup(props, { emit }) {
    const denyRef = ref(null);
    const modalItem = ref({});
    const isShowPopout = ref(false);
    const denyreason = ref("");

    const store = useStore();
    const toast = useToast();

    const isShowApplyAccountAudit = ref(false);

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
    ]);

    const institutionOptions = ref([
      { text: "衛生福利部桃園醫院", value: "衛生福利部桃園醫院" },
      { text: "臺北市立聯合醫院", value: "臺北市立聯合醫院" },
      { text: "衛生福利部苗栗醫院", value: "衛生福利部苗栗醫院" },
      { text: "國立陽明大學附設醫院", value: "國立陽明大學附設醫院" },
    ]);

    const getOptions = async () => {
      const res = await getInstitutionNos("");
      let institutionNos = res.data;
      institutionNos = institutionNos.map((s) => {
        s.text = s.Name + `【${s.No}】`;
        s.value = s.No;
        return s;
      });

      institutionNos.push({
        text: "其他",
        value: "其他",
      });

      institutionOptions.value = [...institutionNos];

      const res2 = await getReasonRoleList("");
      let reasonRoles = res2.data;
      reasonRoles = reasonRoles.map((s) => {
        s.text = s.Name;
        s.value = s.No;
        return s;
      });

      reasonOptions.value = [...reasonRoles];
    };

    const saveModal = async () => {
      try {
        // await changePassword(obj);
        // toast.success(`密碼更新成功`, {
        //   timeout: 2000,
        //   hideProgressBar: true,
        // });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    const setData = async () => {
      denyreason.value = "";
      await getOptions();

      if (`${modalItem.value?.Title}`.includes("其他")) {
        modalItem.value.job = "其他";
        modalItem.value.otherJob = `${modalItem.value?.Title}`.split("其他")[1];
      } else {
        modalItem.value.job = modalItem.value.Title;
        modalItem.value.otherJob = "";
      }
      modalItem.value.RejectReason = `${modalItem.value.RejectReason}`.replace(
        /\n/g,
        "<br>"
      );
    };

    const approved = async () => {
      const obj = {
        ...modalItem.value,
      };
      obj.Status = 100;
      obj.ApprovalTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm");
      obj.Authorizer =
        `${store.state?.dakar?.Name || store.state?.dakar?.No}` +
        "▲" +
        `${store.state?.others?.InstitutionNo}`;

      try {
        await putAccountList(obj);
        toast.success(`帳號核准成功`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        emit("update");
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
      isShowApplyAccountAudit.value = false;
      isShowPopout.value = false;
    };

    const denined = async () => {
      if (!denyreason.value) {
        toast.error(`請填寫拒絕核准帳號原因才可確定`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }
      const obj = {
        ...modalItem.value,
      };

      obj.RoleNos = [];
      obj.Status = 2;
      obj.RejectReason = denyreason.value;
      obj.ApprovalTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm");
      obj.Authorizer =
        `${store.state?.dakar?.Name || store.state?.dakar?.No}` +
        "▲" +
        `${store.state?.others?.InstitutionNo}`;

      try {
        await putAccountList(obj);
        toast.success(`帳號拒絕成功`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        emit("update");
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }

      isShowApplyAccountAudit.value = false;
      isShowPopout.value = false;
    };

    const showDenyPop = () => {
      isShowPopout.value = true;
    };

    const roleOptions = ref([]);

    return {
      denyreason,
      modalItem,
      isShowApplyAccountAudit,
      isShowPopout,

      saveModal,
      setData,
      approved,
      denined,

      jobOptions,
      reasonOptions,
      institutionOptions,
      denyRef,
      showDenyPop,
      roleOptions,
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

.block {
  display: grid;
  grid-template-columns: 507px 1fr;
  grid-column-gap: 8px;
  background: transparent;
  padding: 0px 20px;
}

.block2 {
  background: transparent;
  padding: 20px;
  font-size: 18px;
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

.pop-out {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: grid;
  place-items: center;

  z-index: 100000000000000020000;
}
.schedule {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 10px 23px;
}
.main-section {
  display: grid;
  grid-template-columns: auto auto;
  padding-right: 16px;
  .left-side {
    display: grid;
    justify-content: center;
  }
}
</style>
