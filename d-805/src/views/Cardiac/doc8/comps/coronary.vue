<template>
  <div class="px-2 py-3 coronary">
    
    <!-- <div class="d-flex align-items-center mb-2">
      <div class="pr-2">Dominance:</div >
      <div class="flex-1 d-grid grid-col-5" style="grid-gap: 5px;">
        <b-form-radio-group ref="radioGroup" v-model="dominance" @click="pickupDominance" :options="[{text: 'Left', value: 'left'}, {text: 'Right', value: 'right'}]" />
      </div>  
    </div> -->

    <div class="d-flex align-items-center mb-2">
      <div class="pr-2 font-weight-bold">Dominance:</div >
      <k-radio :marginRight="1" dividClass="flex-1 d-flex align-items-center" @updateValue="(value)=> { dominance = value}" v-model="dominance" :options="[{text: 'Left', value: 'left'}, {text: 'Right', value: 'right'}]" />
    </div>

    <div v-for="[key, aData] in Object.entries(angisData)" :key="'angis' + key" class="mb-1 d-flex">
      <div class="wpx-2 d-flex pt-1" v-text="aData.label + ':'" />
      <div class="flex-1">
        <div class="d-flex align-items-center tree-select" v-for="(item,idx) in aData.items" :key="key + idx"  >
          <b-input-group class="wpx-11">
            <treeselect @input="val => { updateValue(aData.items, item, val, idx) }" @select="addAngisItem(aData.items, item, idx)" :class="{'half-transparent': !item.value1}" v-model="item.value1" :multiple="false" :searchable="true" :options="options.map(({text: label, value: id}) => ({label, id}))" />
          </b-input-group >

          <template v-if="firstOptions.some(({value})=>value === item.value1)">
            <!-- <b-input-group class="wpx-5 mx-1" append="%">
              <b-input v-model="item.value2" type="number" max="100" min="0" step="5" @change="percentageEvent(item, 'value2')" />
            </b-input-group > -->

            <k-input class="mx-2" :minNum="0" :maxNum="100" :dividWidth="5" type="number" @updateValue="v => item.value2 = v" v-model="item.value2" unit="%" />
            
            <b-form-checkbox-group class="mr-4" v-model="item.value3" :options="[{text: 'ISR', value: 'isr'}, {text: 'Calcified', value: 'calcified'}]" />
          </template>
        </div>
      </div>
    </div>

    <div class="mb-2">
      <div class="textarea-title">Other</div >
      <b-form-textarea @keyup.native.119="findReportPhraseStr" v-model="other" rows="3" style="resize: none;" />
    </div >

    <div class="mb-4">
      <div class="textarea-title">Diagnosis</div >
      <b-form-textarea @keyup.native.119="findReportPhraseStr" v-model="diagnosis" rows="3" style="resize: none;" />
    </div>

    <div class="d-flex flex-wrap align-items-center mb-2">

      <b-input-group prepend="Syntax score" class="wpx-9">
        <b-input v-model="syntaxScore" type="number" />
      </b-input-group >

      <img class="ml-3" :src="require('@/assets/imgs/calculator.png')" />

      <div class="ml-3 flex-1" v-if="syntaxScore > 32">
        Surgical intervention suggested
      </div >

      <div class="w-100" />

      <div class="d-flex align-items-center mb-2 mt-4">
        <div class="pr-2 font-weight-bold">介⼊治療 Intervention:</div >
        <div class="flex-1 d-flex align-items-center">
          <form>
            <label class="mb-0">
              <input type="radio" v-model="intervention" :value="false" />
              No
            </label>
          </form>
          <form class="ml-3">
            <label class="mb-0">
              <input type="radio" v-model="intervention" :value="true" />
              YES
            </label>
          </form>       
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

function itemStructure() {
  return {
    value1: null, value2: '', value3: []
  }
}

function itemStructure2() {
  return {
    value: ''
  }
}

function createItemStructure(num = 1) {
  return new Array(num).fill('').reduce((acc, cur, idx)=> ({...acc, ['value'+(idx+1)]: ''}), {})
}

export default {
  props: {

  },
  components: {
    Treeselect
  },
  data() {
    const baseData = ['LM','LAD','LCx','RCA'];
    const angisData = baseData.reduce((acc,cur)=>{
      return { ...acc,
        [cur.toLowerCase()]: {
          label: cur,
          items: [new itemStructure()]
        }
      }
    }, {});
    const interventions = baseData.reduce((acc,cur)=>{
      return { ...acc,
        [cur.toLowerCase()]: {
          label: cur,
          items: [new createItemStructure(1)]
        }
      }
    }, {});

    return {
      firstOptions: [{ text: 'O', value: 'o' }, { text: 'O-P', value: 'o-p' }, { text: 'P', value: 'p' }, { text: 'P-M', value: 'p-m' }, { text: 'M', value: 'm' }, { text: 'M-D', value: 'm-d' }, { text: 'D', value: 'd' }],
      secondOptions: [{ text: 'Patent', value: 'patent' }, { text: 'coronaropathy', value: 'coronaropathy' }, { text: 'insignificant', value: 'insignificant' }, { text: 'Luminal irregularity', value: 'luminalIrregularity' }, { text: 'Myocardial bridge', value: 'myocardialBridge' }],
      dominance: '',
      angisData,
      other: '',
      diagnosis: '',
      intervention: '',
      syntaxScore: 0,
      interventions
    }
  },
  computed: {
    ...mapGetters(['gPrivatePhrase', 'gPublicPhrase']),
    options() {
      return this.firstOptions.concat(this.secondOptions);
    },
    coronaryData() {
      return !this.intervention
        ? {
          dominance: this.dominance,
          other: this.other,
          diagnosis: this.diagnosis,
          syntaxScore: this.syntaxScore,
          intervention: '',
          angisData: this.angisData,
          // interventions: this.interventions
        }
        : {
          dominance: this.dominance,
          other: this.other,
          diagnosis: this.diagnosis,
          syntaxScore: this.syntaxScore,
          intervention: this.intervention,
          angisData: this.angisData,
          // interventions: this.interventions
        }
    }
  },
  created() {
    // console.log(this.gPublicPhrase);
  },
  mounted() {
    
      // this.$refs.radioGroup.$el.addEventListener("keydown", ({ code, target }) => {
      //   if( code === "Space") {
          
      //     if(target.value === this.dominance) { 
      //       setTimeout(()=>{
      //         this.dominance = '';
      //         target.value = '';

      //         this.$refs.dominanceTxt.$el.click();

      //       }, 200)
      //     }
          
      //   }
      // })
    
  },
  methods: {
    pickupDominance(e) {
      console.log(e);
    },
    findReportPhraseStr(e) {
      const { target: { value, selectionStart } } = e;
      if(!value) return;
      const lastString = value
                            .substr(0, selectionStart).split('\n').slice(-1)[0] // 取得當前行
                            .split(' ').slice(-1)[0]; // 取得最後一個字串
      if(!lastString) return;
      const findingOutPhrase = function (k, list) {
        // let _phrase = '';
        // let _keyword = '';
        // while(_keyword != k && _keyword.length <= k.length && !_phrase) { // 找尋的文字 不等於 keyword 或長度大於找尋的文字，或是還沒找到片語
        // _keyword = k.slice(-(_keyword.length + 1));
        // pList
        //   .filter(({PhraseCode})=> PhraseCode.length === _keyword.length)  // 過瀘多餘的
        //   .some((p)=>{  // 找出符合的
        //     const flag = p.PhraseCode === _keyword;
        //     if(flag) _phrase = p.Replacement
        //     return flag;
        //   });
        // }
        const pList = list.filter(({PhraseCode})=>PhraseCode.length === k.length);
        if(pList.length === 0) return '';
        const _phraseObj = pList.find(({PhraseCode})=> PhraseCode === k);
        return _phraseObj
          ? _phraseObj.Replacement
          : '';
      }
      let phrase = findingOutPhrase(lastString, this.gPrivatePhrase);
      if(!phrase) phrase = findingOutPhrase(lastString, this.gPublicPhrase); //在私人片語找不到就到公用片語找
      if(phrase) {
        const _headString = value.slice(0, selectionStart - lastString.length);
        const _tailString = value.slice(selectionStart);
        e.target.value = `${_headString}${phrase}${_tailString}`;
        e.target.selectionStart = _headString.length + phrase.length;
        e.target.selectionEnd = _headString.length + phrase.length;
      }

    },
    percentageEvent(item, key) {
      if(item[key] == 100) item[key] = 5
      else if(item[key] == 0) item[key] = 95
    },
    addAngisItem(items, item, idx) {
      const _last = items.slice(-1)[0];
      this.$nextTick(()=>{
        if (items.length - 1 === idx && item.value1) {
          items.push(new itemStructure());
        } else if (items.length - 1 === idx && !item.value1 && !_last.value1) {
          items.pop();
        }
      });

      // if(index === items.length - 1 && this.firstOptions.some(({value})=> item.value1 === value) ) {
      //   this.$nextTick(()=>{
      //     items.push(new itemStructure());
      //   });
      // }
    },
    updateValue (items, item, value, idx) {
      const _last = items.slice(-1)[0];
      if(!value && items.length - 2 === idx && !_last.value1) items.pop();
    },
    addInterventionItem(items) {

      const _last = items.slice(-1)[0];
      if(!!_last.value && this.firstOptions.some(({value})=> value === _last.value)) {
        this.$nextTick(()=>{
          items.push(new itemStructure2());
        });
      }

      
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ textarea.form-control {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

div.coronary {
  .input-group-prepend {
    .input-group-text {
      min-width: 60px;
    }
  }
}

.vue-treeselect--focused {
  opacity: 1 !important;
}
</style>
