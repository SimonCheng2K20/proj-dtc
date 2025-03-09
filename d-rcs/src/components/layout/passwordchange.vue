<template>
  <Dialog
    v-model:visible="isShowDialog"
    :draggable="false"
    style="width: 800px"
    header="更改密碼"
    :closable="true"
    :modal="true"
    @show="setData"
    class="custom-modal"
  >
    <div class="modal-section">
      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">系統帳號</span>
        <InputText
          placeholder="系統帳號"
          class="p-inputtext-sm shadow-none w-full h-10 rounded-l-none border-l-0"
          type="text"
          v-model.trim="accountData"
          disabled
        />
      </div>

      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">原先密碼</span>
        <InputText
          placeholder="原先密碼"
          autocomplete="off"
          v-model.trim="modalItem.originalPassword"
          :type="modalItem.passwordType"
        />
        <span
          v-show="modalItem.passwordType == 'text'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'password'"
        >
          <i class="pi pi-eye"></i>
        </span>
        <span
          v-show="modalItem.passwordType == 'password'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'text'"
        >
          <i class="pi pi-eye-slash"></i>
        </span>
      </div>

      <div class="p-inputgroup mb-2">
        <span class="p-inputgroup-addon">新設密碼</span>
        <InputText
          placeholder="新設密碼"
          v-model.trim="modalItem.newPassword"
          :type="modalItem.passwordType"
          autocomplete="off"
        />
        <span
          v-show="modalItem.passwordType == 'text'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'password'"
        >
          <i class="pi pi-eye"></i>
        </span>
        <span
          v-show="modalItem.passwordType == 'password'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'text'"
        >
          <i class="pi pi-eye-slash"></i>
        </span>
      </div>

      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">確認密碼</span>
        <InputText
          placeholder="確認密碼"
          v-model.trim="modalItem.confirmedPassword"
          :type="modalItem.passwordType"
          autocomplete="off"
        />
        <span
          v-show="modalItem.passwordType == 'text'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'password'"
        >
          <i class="pi pi-eye"></i>
        </span>
        <span
          v-show="modalItem.passwordType == 'password'"
          class="p-inputgroup-addon"
          style="fontsize: 2rem; background-color: #3f5777; color: white"
          @click="modalItem.passwordType = 'text'"
        >
          <i class="pi pi-eye-slash"></i>
        </span>
      </div>

      <div style="color: rgb(226, 46, 46)" class="pt-2">
        <span><i class="fas fa-exclamation-circle"></i></span
        ><span>
          ※密碼長度設定至少6碼(含)以上，密碼必須包含英文大寫字母、英文小寫字母、阿拉伯數字及特殊符號</span
        >
      </div>
    </div>
    <template #footer>
      <Button label="確定" @click="saveModal" />
      <Button class="p-button-success" label="取消" @click.stop="hideDialog" />
    </template>
  </Dialog>
</template>
<script>
import { ref, toRef, toRefs, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { changePassword } from "Service/apis.js";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const accountData = ref("");
    const modalItem = ref({
      originalPassword: "",
      newPassword: "",
      confirmedPassword: "",
      passwordType: "password",
    });

    const store = useStore();
    const toast = useToast();

    // const isShowDialog = computed(() => store.state.isShowPwdDialog);
    const isShowDialog = ref(false);

    function hideDialog() {
      isShowDialog.value = false;
    }

    async function saveModal() {
      let check1 = false;
      let check2 = false;
      let check3 = false;
      let check4 = false;
      let check5 = false;

      const matches = modalItem.value.newPassword.match(/\d+/g);
      if (matches == null) {
        check1 = true;
      }
      const matches2 = modalItem.value.newPassword.match(/[A-Z]+/g);
      if (matches2 == null) {
        check2 = true;
      }

      const matches3 = modalItem.value.newPassword.match(/[a-z]+/g);
      if (matches3 == null) {
        check3 = true;
      }

      // const matches4 = modalItem.value.newPassword.match(
      //   /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]+/g
      // );
      const matches4 = modalItem.value.newPassword.match(/\W+/g);

      if (matches4 == null) {
        check4 = true;
      }

      if (modalItem.value.newPassword.length < 6) {
        check5 = true;
      }

      let allCheck = [
        {
          checkItem: "數字",
          isNotMatch: check1,
        },
        {
          checkItem: "大寫英文",
          isNotMatch: check2,
        },
        {
          checkItem: "小寫英文",
          isNotMatch: check3,
        },
        {
          checkItem: "特殊字元",
          isNotMatch: check4,
        },
        {
          checkItem: "長度至少6碼(含)以上",
          isNotMatch: check5,
        },
      ];
      allCheck = allCheck.filter((s) => s.isNotMatch);
      const allCheckString = allCheck.map((s) => `${s.checkItem}`).join("、");

      if (allCheck.length) {
        toast.error(`密碼不符合規定，密碼須包含${allCheckString}，請重新輸入`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      if (modalItem.value.newPassword != modalItem.value.confirmedPassword) {
        toast.error("密碼更新失敗，兩次密碼輸入不同", {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      const obj = {
        Old: modalItem.value.originalPassword,
        New: modalItem.value.newPassword,
      };
      try {
        await changePassword(obj);
        toast.success(`密碼更新成功`, {
          timeout: 2000,
          hideProgressBar: true,
        });
        hideDialog();
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    const setData = () => {
      modalItem.value = {
        originalPassword: "",
        newPassword: "",
        confirmedPassword: "",
        passwordType: "password",
      };
    };

    return { modalItem, isShowDialog, hideDialog, saveModal, setData, accountData };
  },
};
</script>
