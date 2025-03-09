<template>
  <div class="cvs">
    <header class="dtc-header">
      <div>高層次超音波檢查報告</div>
      <b-button
        size="sm"
        variant="primary"
        style="max-height:30px;margin-top:1px"
      >
        <font-awesome-icon
          size="sm"
          icon="edit"
        />儲存變更 </b-button>
      <b-form-group style="margin-left:1rem;margin-top:3px;">
        <b-form-radio-group
          inline
          v-model="type"
        >
          <b-form-radio value="Basic">檢查報告基本資料</b-form-radio>
          <b-form-radio value="Lmp">LMP</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <cus-info
      class='mt-1'
      v-show="type == 'Basic'"
      :inputs="basicInfo"
    />
    <cus-info
      class='mt-1'
      v-show="type == 'Lmp'"
      :inputs="lmpInfo"
    />

    <header class="my-1 bg-cyan d-flex align-items-center">
      <div class="mr-3">Sonar Findings: </div>
      <b-form-group class="m-0 p-0 sonar">
        <b-form-radio-group v-model="sonarType">
          <b-form-radio
            v-for="(sonar,idx) in sonars"
            :key="idx"
            :value="sonar"
          >{{sonar}}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <template v-show="sonarType == 'Pregnancy'">
      <cus-info
        :numberOfColumn="[[4,1]]"
        :inputs="PregnancySelect"
      />
      <cus-info
        style="margin-top: -3px;"
        :inputs="PregnancyIngreds"
      />
      <b-tabs>
        <b-tab title="Brain">
          <cus-info
            :numberOfColumn="[[3,1]]"
            class='mt-1'
            :inputs="brain"
          />
        </b-tab>
        <b-tab title="Face">
          <cus-info
            :numberOfColumn="[[2,1]]"
            class='mt-1'
            :inputs="face"
          />
        </b-tab>
      </b-tabs>
    </template>

  </div>
</template>

<script>

//Intervention
//Hemodynamic
import CusInfo from '@/components/Cardiac/cusInfo.vue';
export default {
  data () {
    return {
      type: "Basic",
      sonarType: 'Pregnancy',
      sonars: ['Pregnancy', 'Pregnancy2', 'Pregnancy3', 'Pregnancy4'],
      basicInfo: [],
      lmpInfo: [],
      PregnancySelect: [],
      PregnancyIngreds: [],
      brain: [],
      face: []
    };
  },
  components: { CusInfo },
  created () {
    this.basicInfo = [
      { label: '病患姓名', type: 'text', value: '' },
      { label: '性別', type: 'text', value: 'F' },
      { label: '檢查日期', type: 'date', value: new Date() },
      { label: '病歷號碼', type: 'text', value: '' },
      { label: '病床號碼', type: 'text', value: '' },
      { label: '檢查時間', type: 'text', value: '' },
      { label: '檢查項目', type: 'text', value: '' },
      { label: '年齡', type: 'text', value: 'age' },
      { label: '開單日期', type: 'date', value: new Date() },
      { label: '報告日期', type: 'date', value: new Date() },
      { label: '報告時間', type: 'text', value: this.$moment().format('HH:mm:ss') },
      { label: '開單醫師', type: 'text', value: '' }
    ];
    this.lmpInfo = [
      { label: 'LMP', type: 'text', value: '' },
      { label: 'EDC(LMP)', type: 'text', value: '' },
      { label: 'GA(LMP)', type: 'text', value: '' }
    ];
    this.PregnancySelect = [
      {
        label: 'Fetus', type: 'select', value: '', options: [
          { text: 'BW loss', value: 1 },
          { text: 'Anemia', value: 2 },
          { text: 'Anorexia', value: 3 },
        ]
      },
      {
        label: 'Presentation', type: 'select', value: '', options: [
          { text: 'Dysphagia', value: 5 },
          { text: 'Esophageal varices', value: 6 },
          { text: 'Epigastralgia', value: 7 },
          { text: 'Gastric malignancy', value: 8 }
        ]
      },
      {
        label: 'FHB', type: 'select', value: '', options: [
          { text: 'BW loss', value: 1 },
          { text: 'Anemia', value: 2 },
          { text: 'Anorexia', value: 3 },
        ]
      },
      {
        label: 'Sex', type: 'select', value: '', options: [
          { text: 'Male', value: 'm' },
          { text: 'Female', value: 'f' }
        ]
      },
    ];
    this.PregnancyIngreds = [
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
    this.brain = [
      { label: 'Lateral Ventricle', type: 'text', value: '', unit: 'mm' },
      { label: 'Falx', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'Cerebellum', type: 'text', value: '', unit: 'mm' },
      { label: 'CSP', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'Cisternal magna', type: 'text', value: '', unit: 'mm' },
      { label: 'Choroid plexus', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] }
    ];
    this.face = [
      { label: 'Profile', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
      { label: 'Lips', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] }
    ];
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/subProject.scss";
</style>
