<template>
  <div class="cvs">
    <header>耳鼻喉科頭頸超音波2</header>
    <cus-info
      :numberOfColumn="[[3,1]]"
      :inputs="contentInfo"
    />
    <header class="bg-secondary text-white">Sonar Findings</header>
    <cus-info
      :numberOfColumn="[[5,1]]"
      :inputs="sonar"
    />

    <header class="bg-secondary text-white">Examiner</header>
    <cus-info
      :numberOfColumn="[[3,1]]"
      :inputs="examiner"
    />
    <!-- <header class="my-1 bg-pink">Salivary gland</header>
    <cus-info :inputs="salivary" />
    <cus-info
      :numberOfColumn="[[4,1]]"
      :inputs="salivarySlt"
    />

    <grid-frame :numberOfColumn="[[2,1]]">
      <div>
        <header class="bg-secondary text-white">Location</header>
        <cus-info
          :numberOfColumn="[[2,1]]"
          :inputs="location"
        />

      </div>
      <div>
        <header class="bg-secondary text-white">Others</header>
        <cus-info
          :numberOfColumn="[[1,1]]"
          :inputs="others"
        />
      </div>
    </grid-frame>

    <header class="my-1 bg-green text-white d-flex aling-items-center sonar">
      <div class="mr-3">NECKS</div>
      <b-form-radio-group
        inline
        v-model="type"
      >
        <b-form-radio
          :value="`neck${i}`"
          v-for="i in 8"
          :key="i"
        > {{`neck(${i})`}}</b-form-radio>
      </b-form-radio-group>
    </header>

    <grid-frame :numberOfColumn="[[2,1]]">
      <div>
        <grid-frame
          style="margin-top: -3px;"
          :numberOfColumn="[[1,5],[2,1]]"
        >
          <header class="bg-secondary text-white">SIZE</header>
          <header class="bg-secondary text-white">R'T</header>
          <header class="bg-secondary text-white">L'T</header>
        </grid-frame>
        <cus-info
          :numberOfColumn="[[1,5],[2,1]]"
          :inputs="nect1"
        />
      </div>
      <div>
        <header class="bg-secondary text-white">Location Level</header>
        <cus-info
          :numberOfColumn="[[1,1]]"
          :inputs="nectLevel1"
        />

        <header class="bg-secondary text-white">Others</header>
        <cus-info
          :numberOfColumn="[[1,1]]"
          :inputs="nectOther1"
        />
      </div>
    </grid-frame> -->

  </div>
</template>

<script>
import cusInfo from '@/components/Cardiac/cusInfo.vue';
import gridFrame from '@/components/Cardiac/frame.vue'
export default {
  data () {
    return {
      type: 'neck1',
      contentInfo: [],
      examiner: [],
      sonar: [],
    };
  },
  components: { cusInfo, gridFrame },
  created () {
    this.contentInfo = [
      { label: 'Clinical Diagnosis', type: 'textarea', value: '' },
      { label: 'Sonar Impression', type: 'textarea', value: '' },
      { label: 'Remarks', type: 'textarea', value: '' }
    ]
    this.examiner = [
      { label: '', type: 'select', value: '', option: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: '', type: 'select', value: '', option: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: '', type: 'select', value: '', option: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
    ]
    this.sonar = [
      { label: 'Lump No', type: 'text', value: '' },
      { label: '', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Site1', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Site2', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Site3', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Size', type: 'text', value: '' },
      { label: '', type: 'text', value: '', unit: 'cm', before: 'X' },
      { label: 'Shape', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Bounday', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Internal echo', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Internal Level', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Calcifiication', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Architeture', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Hilus echo', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Posterior shadowings', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Lymph node', type: 'text', value: '' },
      { label: '', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },
      { label: 'Adjacent soft tissue', type: 'select', value: '', options: [{ text: 'option1', value: 1 }, { text: 'option2', value: 2 }, { text: 'option3', value: 3 }] },


    ]
    // this.basicInfo = [
    //   { label: '姓名', type: 'text', value: '' },
    //   { label: '姓別', type: 'select', value: '', options: [{ text: 'Male', value: 'm' }, { text: 'Female', value: 'f' }] },
    //   { label: '檢查日期', type: 'date', value: new Date() },
    //   { label: '病歷號碼', type: 'text', value: '' },
    //   { label: '病床號碼', type: 'text', value: '' },
    //   { label: '檢查日期', type: 'date', value: new Date() },
    //   { label: '年齡', type: 'text', value: '' },
    //   { label: '檢查項目', type: 'text', value: '' },
    //   { label: '出生日期', type: 'date', value: new Date() },
    //   { label: '開單日期', type: 'date', value: new Date() },
    //   { label: '報告完成日期', type: 'date', value: new Date() },
    //   { label: '報告完成時間', type: 'date', value: new Date() },
    //   { label: '開單醫師', type: 'text', value: '' },
    // ];
    // this.salivary = [
    //   { label: 'Size', type: 'text', value: '', after: 'X' },
    //   { label: '', type: 'text', value: '', unit: 'cm' },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: 'R', value: 'r' }, { text: 'L', value: 'l' }] }
    // ]
    // this.salivarySlt = [
    //   { label: 'Echogenicity', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: 'Margin', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: 'Content', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: 'FNAC', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] }
    // ]
    // this.location = [
    //   { label: '', type: 'checkbox', value: '', options: [{ text: 'Parotid gland', value: 'parotidgland' }] },
    //   { label: '', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: 'submandibular gland', value: 'submandibulargland' }] },
    //   { label: '', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] }
    // ]
    // this.others = [
    //   { label: '', type: 'textarea', value: '' }
    // ]
    // this.nect1 = [
    //   { label: 'Nodularty', type: 'text', value: '' },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: 'Nodularty', type: 'text', value: '' },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: 'Echogenicity', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: 'Margin', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: 'Content', type: 'select', value: '', options: [{ text: 'opt1', value: 1 }, { text: 'opt2', value: 2 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] },
    //   { label: '', type: 'checkbox', value: '', options: [{ text: '', value: 1 }] }
    // ]
    // this.nectLevel1 = [
    //   { label: '', type: 'checkbox', value: '', options: [{ text: 'I', value: 1 }, { text: 'I', value: 1 }, { text: 'II', value: 2 }, { text: 'IV', value: 3 }, { text: 'V', value: 4 }, { text: 'SCF', value: 5 }] },
    // ]
    // this.nectOther1 = [
    //   { label: '', type: 'textarea', value: '' }
    // ]
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/subProject.scss";
/deep/ fieldset.form-group {
  margin-bottom: 0;
  max-height: 40px;
}
</style>
