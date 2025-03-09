<template>
  <div class="cvs">
    <header class="dtc-header">
      <div>產科五個月超音波檢查報告</div>
      <b-button
        size="sm"
        variant="primary"
        style="max-height:30px;margin-top:1px"
      >
        <font-awesome-icon
          size="sm"
          icon="edit"
        />儲存變更 </b-button>
    </header>
    <CusInfo
      :numberOfColumn="[[3,1]]"
      :inputs="basicInfo"
    />

    <header class="my-1 bg-cyan d-flex align-items-center">診斷報告</header>
    <CusInfo
      style="margin-top: -3px;"
      :numberOfColumn="[[2,1]]"
      :inputs="command"
    />
    <cus-info
      :numberOfColumn="[[3,1]]"
      style="margin-top: -3px;"
      :inputs="lmpInfo"
    />

    <header class="my-1 bg-pink d-flex align-items-center sonar">
      <div class="mr-3">Ultrasound Findings</div>
      <b-form-radio-group
        inline
        v-model="type"
      >
        <b-form-radio value="Pregnancy">Pregnancy</b-form-radio>
        <b-form-radio value="Pregnancy2">Pregnancy2</b-form-radio>
        <b-form-radio value="Pregnancy3">Pregnancy3</b-form-radio>
      </b-form-radio-group>
    </header>
    <template v-if="type==='Pregnancy'">
      <cus-info
        :numberOfColumn="[[4,1]]"
        :inputs="Pregnancy"
      />
      <cus-info
        style="margin-top: -3px;"
        :inputs="quality"
      />
    </template>
  </div>
</template>

<script>
import CusInfo from '@/components/Cardiac/cusInfo.vue';

export default {
  data () {
    return {
      type: 'Pregnancy',
      basicInfo: [],
      command: [],
      lmpInfo: [],
      Pregnancy: [],
      quality: []
    };
  },
  components: { CusInfo },
  created () {
    this.basicInfo = [
      { label: '姓名', type: 'text', value: '' },
      { label: '年齡', type: 'text', value: '' },
      { label: '檢查日期', type: 'date', value: new Date() },
      { label: '病歷號碼', type: 'text', value: '' },
      { label: '申請醫師', type: 'text', value: '' },
      { label: '檢查項目', type: 'text', value: '' }
    ];
    this.command = [
      { label: 'Chief Complaint', type: 'textarea', value: '' },
      { label: 'Clinical Diagnosis', type: 'textarea', value: '' }
    ];
    this.lmpInfo = [
      { label: 'LMP', type: 'text', value: '' },
      { label: 'EDC(LMP)', type: 'text', value: '' },
      { label: 'GA(LMP)', type: 'text', value: '' }
    ];
    this.Pregnancy = [
      { label: 'Fetus No', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'Presentation', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'FHB', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'Sex', type: 'select', value: '', options: [{ text: 'Male', value: 'm' }, { text: 'Female', value: 'f' }] }
    ];
    this.quality = [
      { label: 'BDP', type: 'text', value: '', unit: "mm" },
      { label: '', type: 'text', value: '', unit: "wks", before: ' = ', after: '' },
      { label: 'OFD', type: 'text', value: '', unit: "mm" },
      { label: 'HC', type: 'text', value: '', unit: "mm" },
      { label: '', type: 'text', value: '', unit: "wks", before: ' = ', after: '' },
      { label: 'AC', type: 'text', value: '', unit: "mm" },
      { label: '', type: 'text', value: '', unit: "wks", before: ' = ', after: '' },
      { label: 'HC/AC', type: 'text', value: '', unit: "mm" },
      { label: 'FL', type: 'text', value: '', unit: "mm" },
      { label: '', type: 'text', value: '', unit: "wks", before: ' = ', after: '' },
      { label: 'EBW', type: 'text', value: '', unit: "mm" },
      { label: '', type: 'text', value: '', unit: "wks", before: ' = ', after: '' },
    ];
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/subProject.scss";
</style>
