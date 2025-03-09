<template>
  <div class="px-2 py-3">
    <div class="d-grid base-info grid-col-10" style="grid-gap: 5px;">
      <div v-for="ipt in baseData" :key="ipt.key" :class="`grid-span-${ipt.span}`">
        <b-input-group size="sm" :prepend="ipt.label">
          
          <div v-if="ipt.options" class="flex-1 h-100">
            <treeselect v-model="ipt.value" :multiple="true" :searchable="true" :options="ipt.options" />
          </div>
          
          <b-input v-else v-model="ipt.value" :readonly="ipt.readonly" />
        </b-input-group>
      </div>
    </div>

    <div class="d-flex mt-2 lab-info">
      <div class="pr-2">實驗室數據:</div>
      <div class="flex-1 d-grid grid-col-6" style="grid-gap: 2px;">
        <div v-for="(ipt,idx) in laboratory" :key="ipt.key + idx" :class="`grid-span-${ipt.span} align-items-center`">
          <b-input-group size="sm" v-if="ipt.label!=='NONE'" :prepend="ipt.label" :append="`(${ipt.unit})`">
            <b-input v-model="ipt.value" :readonly="ipt.readonly" />
          </b-input-group>
          <div v-else />
        </div>
      </div>
    </div>

    <div class="d-flex mt-2 align-items-center">
      <div class="pr-2">⼼電圖報告:</div>
      <div class="flex-1">
        <b-input v-model="heartData" />
      </div>
    </div>

    <div class="form-radio mt-2">
      <div v-for="tread in treads" :key="tread.key" class="d-flex align-items-center my-2">
        <div class="pr-2 wpx-6" v-text="tread.label" />
        <div class="flex-1 d-flex">
          <k-radio dividClass="d-flex" :minWdt="85" @updateValue="(value)=> { tread.value = value}" v-model="tread.value" :options="tread.options" />
        </div>
      </div >
    </div>
  </div>
</template>

<script>
import { getPatientReportList } from "@/assets/service/dataManager.js";
import Treeselect from "@riophae/vue-treeselect";
export default {
  props: {
    patientId: {
      type: String,
      default: '12953909'
    }
  },
  components: {
    Treeselect
  },
  data() {
    return {
      baseData: [
        {label: '病 歷 號', key: 'PatientId', value: '', span: 2, readonly: true },
        {label: '姓　　名', key: 'PatientName', value: '', span: 2, readonly: true},
        {label: '年　　齡', key: 'PatientAge', value: '', span: 1, readonly: true},
        {label: '性　　別', key: 'PatientSex', value: '', span: 1, readonly: true},
        {label: '病　　床', key: 'BedNo', value: '', span: 2, readonly: true},
        {label: '檢查日期', key: 'ProcedureCompleted', value: '', span: 2, readonly: true},
        {label: '檢查單號', key: 'AccessionNo', value: '', span: 2, readonly: true},
        {label: '開單醫師', key: 'IssuePhysicianName', value: '', span: 2, readonly: true},
        {label: '過去病史', key: 'history', value: [], span: 6, readonly: false},
      ],
      laboratory: [
        {label: 'Hb', key: 'Hb', value: '', span: 1, readonly: false, unit: 'g/dL'},
        {label: 'Hct', key: 'Hct', value: '', span: 1, readonly: false, unit: '%'},
        {label: 'PLT', key: 'PLT', value: '', span: 1, readonly: false, unit: 'x10^3/ul'},
        {label: 'BUN', key: 'BUN', value: '', span: 1, readonly: false, unit: 'mg/dl'},
        {label: 'Scr', key: 'Scr', value: '', span: 1, readonly: false, unit: 'mg/dl'},
        {label: 'NONE', key: 'PT', value: '', span: 1, readonly: false, unit: 'sec'},
        {label: 'PT', key: 'PT', value: '', span: 1, readonly: false, unit: 'sec'},
        {label: 'aPTT', key: 'aPTT', value: '', span: 1, readonly: false, unit: 'sec'}, 
        {label: 'CHOL', key: 'CHOL', value: '', span: 1, readonly: false, unit: 'mg/dl'}, 
        {label: 'TG', key: 'TG', value: '', span: 1, readonly: false, unit: 'mg/dL'}, 
        {label: 'LDL', key: 'LDL', value: '', span: 1, readonly: false, unit: 'mg/dl'}, 
        {label: 'HDL', key: 'HDL', value: '', span: 1, readonly: false, unit: 'mg/dL'},
      ],
      heartData: '',
      treads: [
        {label: 'Treadmill test', key: 'treadmillTest', value: '', options: [{text: 'Negative', value: 'Negative'}, {text: 'Positive', value:'Positive'}]},
        {label: 'Thallium scan', key: 'thalliumScan', value: '', options: [{text: 'Mild', value: 'Mild'}, {text: 'Moderate', value: 'Moderate'},{text: 'Severe', value: 'Severe'},]},
        {label: 'DSCT', key: 'dsct', value: '', options: [{text: 'Negative', value: 'Negative'}, {text: 'Positive', value:'Positive'}]}
      ]
    };
  },
  created() {
    if(this.patientId) {
      // this.baseData.find(({key})=>key==='id').value = this.patientId;
      getPatientReportList(this.patientId).then(res=>{
        if(res.length) {
          const [patientSrc] = res;
          this.baseData.forEach(b=>{
            if(patientSrc.hasOwnProperty(b.key)) {
              b.value = patientSrc[b.key];
            }
          })

          const history = this.baseData.find(({key})=>key==='history');
          history['options'] = res.map(({DxrVersion})=>
            {
              const _short = DxrVersion.split('.').slice(-1)[0];
              return {label: _short, id: _short}
            }
          )
        }
      });
    }
  },
  computed: {
    profileData() { // 外部使用
      const conver2Obj = (acc,cur) => ({...acc, [cur.key]: cur.value});
      return {
        laboratoryData: this.laboratory.reduce(conver2Obj, {}),
        baseData: this.baseData.reduce(conver2Obj, {}),
        heartData: this.heartData,
        readmill: this.treads.reduce(conver2Obj, {})
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.cardiac {
  .base-info .input-group-text {
    min-width: 78px;
  }
  
  .lab-info {
    .input-group-prepend{
      .input-group-text {
        min-width: 55px;
        background-color: transparent;
        border: none;
      }
    }
    input.form-control {
      border: none;
    }
    .input-group-append .input-group-text {
      background-color: transparent;
      color: #999;
      text-align: right;
      border: none;
      font-size: 12px
    }
  }
  
}
</style>
