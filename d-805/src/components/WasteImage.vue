<template>
  <b-modal
    ref="wasteImage"
    id="wasteImage"
    centered
    button-size="sm"
    header-bg-variant="primary"
    header-text-variant="white"
    size="xl"
  >
    <template slot="modal-title">不良影像與重照片要因記錄表</template>
    <b-container>
      <div
        class="d-grid grid-col-3"
        style="grid-gap: 2px;"
        v-if="patient"
      >
        <b-input-group
          v-for="col in columns"
          :key="col.value"
          :prepend="col.label"
        >
          <b-input
            :value="patient[col.value]"
            readonly
          />
        </b-input-group>
      </div>

      <div
        class="d-grid grid-col-3"
        style="grid-gap: 2px; margin-top: 2px;"
      >
        <b-input-group prepend="分類">
          <div class="flex-1 rounded-right border-right border-bottom border-top d-flex align-items-center pl-2 text-black bg-white">
            <b-form-radio-group
              v-model="imageKind"
              :options="imageKinds"
            />

          </div>
        </b-input-group>

        <b-input-group prepend="分類">
          <div class="flex-1 rounded-right border-right border-bottom border-top d-flex align-items-center pl-2 text-black bg-white">
            <b-form-radio-group
              v-model="imageType"
              :value="imageType"
              :options="imageOptions"
              :disabled="true"
            />
          </div>
        </b-input-group>

        <b-form-checkbox
          class="ml-3 mt-2"
          id="savingImage"
          v-model="savingImage"
          v-show="imgKeep.display"
        >影像已保留</b-form-checkbox>

      </div>

      <b-card
        class="mt-2"
        header-bg-variant="primary"
        header-text-variant="white"
        header-class="p-1 pl-3"
        header="發現階段"
        body-class="p-1 pl-3 bg-white rounded-bottom"
        v-show="savingImage"
      >
        <b-form-radio-group
          class="text-black"
          v-model="step"
          :options="stepOptions"
        />
      </b-card>

      <b-card
        header-bg-variant="success"
        header-text-variant="white"
        header-class="p-1 pl-3"
        body-class="p-1 pl-3 bg-white rounded-bottom"
        header="原因"
        class="mt-2"
        v-show="savingImage"
      >
        <b-form-radio-group
          class="text-black"
          v-model="reason"
          :options="reasonOptions"
        />
      </b-card>

      <b-card
        v-if="reason===6"
        header-bg-variant="warning"
        header-text-variant="black"
        header-class="p-1 pl-3"
        body-class="p-1 pl-3 bg-white rounded-bottom"
        header="其他原因分類"
        class="mt-2"
        id="reasonDetail"
      >
        <b-form-radio-group
          class="text-black"
          v-model="other"
          :options="otherOptions"
        />
      </b-card>

      <b-form-checkbox
        class="ml-3 mt-2"
        v-if="showDelFailImageCheckbox"
        id="removeImagePermission"
        v-model="removeFailImage"
      >PACS可修改影像</b-form-checkbox>

    </b-container>
    <template v-slot:modal-footer>
      <b-button
        variant="primary"
        @click="cancelEvent"
      >
        取消
      </b-button>

      <b-button
        variant="warning"
        @click="confirmEvent"
        :disabled="!isFinish"
      >
        確認
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { postFailImageReason } from "@/assets/service/dataManager.js";
import { stepOptions, reasonOptions, otherOptions, columns } from "@/assets/js/wasteOptions.js";
import { mapMutations } from "vuex";
export default {
  data () {
    return {
      columns,
      imageOptions: [{ text: 'X-RAY', value: 'CR' }, { text: 'SPECIAL', value: 'special' }],
      imageType: 'special',
      imageKinds: [{ text: '不良影像', value: 1 }, { text: '重照片', value: 2 }],
      imageKind: null,
      stepOptions,
      reasonOptions,
      otherOptions,
      step: null,
      reason: '',
      other: '',
      removeFailImage: false,
      savingImage: false
    }
  },
  computed: {
    wasteImgShow () {
      return this.show && this.$refs.wasteImage
        ? this.$refs.wasteImage.isShow
        : false;
    },
    isFinish () {
      return (this.imageKind != null && this.step && this.reason) && (this.reason < 6 || this.other)
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    patient: {
      type: Object,
      default: null
    },
    normalDisable: {
      type: Boolean,
      default: false
    },
    stepDefault: {
      type: Number,
      default: ''
    },
    showDelFailImageCheckbox: {
      type: Boolean,
      default: false
    },
    imgKeep: {
      type: Object,
      default: () => ({ check: false, display: true })
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$refs.wasteImage.show();
        if (this.patient.Modality === 'CR') this.imageType = 'CR';
      } else {
        this.$refs.wasteImage.hide();
        this.imageKind = 0;
        this.step = '';
        this.reason = '';
        this.other = '';
        this.savingImage = false;
        Array.from(document.getElementById('reasonDetail').querySelectorAll('input[type=text]')).forEach(el => el.value = '');
      }
    },
    wasteImgShow (val) {
      if (!val) this.$emit('update:show', false);
    }
  },
  created () {

    if (this.normalDisable) {
      this.imageKinds.find(({ text }) => text === '正常')['disabled'] = true;
    }
    if (this.stepDefault) this.step = this.stepDefault;
    this.savingImage = this.imgKeep.check
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    cancelEvent () {
      this.$emit('update:show', false);
    },
    async confirmEvent () {
      const { AccessionNo, PatientId, Modality, OrderNo } = this.patient;
      const data = {
        OrderNo: OrderNo ? OrderNo : AccessionNo.substr(0, 9),
        PatientId,
        Modality,
        Type: this.imageKind,
        Step: this.step,
        ReasonType: this.reason < 6 ? this.reason : this.other,
        Reason: '',
        RemoveFailImage: this.removeFailImage
      }

      if (this.reason === 6 && this.other <= 6.3) {
        const _position = this.other * 10 - 61;
        const _instruction = Array.from(document.getElementById('reasonDetail').querySelectorAll('input[type=text]'))[_position].value;
        data.Reason = _instruction;
      }

      this.SHOW_LOADING();
      try {
        await postFailImageReason(data);
        this.$emit('update:show', false);
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + '! 稍候再重試', type: 2 });
      } finally {
        this.HIDE_LOADING();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// #wasteImage {
//   /deep/ .custom-control-input:disabled ~ .custom-control-label {
//     color: inherit !important;
//   }
// }
</style>
