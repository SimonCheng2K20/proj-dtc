<template>
  <div class="px-2 py-3 report-form">
    <div ref="btns" class="d-flex align-items-center justify-content-end px-1 flex-1">
      <funcBtns @savingEvent="saveEvent" />
    </div>

    <b-tabs ref="bTabs" content-class="mt-3">
      <b-tab title="CAG PCI" active>
        <b-card-text>
          <div class="d-flex flex-wrap report-group" style="margin: 0 -2px;">

            <!-- <b-input-group size="sm" prepend="導管號碼" class="wpx-11">
              <b-input v-model="report.cagPci.no" />
            </b-input-group> 
            <b-input-group size="sm" prepend="執⾏醫師" class="wem-15">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.mainDr" :multiple="true" :searchable="true" :options="doctors" />
              </div>
            </b-input-group>
            <b-input-group size="sm" prepend="助⼿醫師" class="wem-15">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.secDr" :multiple="true" :searchable="true" :options="doctors" />
              </div>
            </b-input-group>
            <div class="system-radio-btns wpx-10">
              <b-input-group size="sm" prepend="組 織 庫">
                <b-form-radio-group class="flex-1 d-flex align-items-center justify-content-center" v-model="report.cagPci.system" :options="[{text: '是', value: true}, {text: '否', value: false}]" />
              </b-input-group>
            </div>
            <b-input-group size="sm" prepend="護 理 師" class="wem-17">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.nurse" :multiple="true" :searchable="true" :options="nurses" />
              </div>
            </b-input-group>
            <b-input-group size="sm" prepend="放 射 師" class="wem-15">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.rads" :multiple="true" :searchable="true" :options="radors" />
              </div>
            </b-input-group>
            -->

            <k-form :label="{ text: '導管號碼', class: 'wpx-7' }" :dividWidth="9" class="mr-3 mb-2">
              <b-input v-model="report.cagPci.no" />
            </k-form>

            <k-form :label="{ text: '執⾏醫師', class: 'wpx-5' }" :dividWidth="19" class="mr-3 mb-2" :border="false">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.mainDr" :multiple="true" :searchable="true" :options="doctors" />
              </div>
            </k-form>

            <k-form :label="{ text: '助⼿醫師', class: 'wpx-5' }" :dividWidth="19" class="mr-3 mb-2" :border="false">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.secDr" :multiple="true" :searchable="true" :options="doctors" />
              </div>
            </k-form>

            <k-form :label="{ text: '組 織 庫', class: 'wpx-5' }" :dividWidth="10" class="mr-3 mb-2" :border="false">
              <b-form-radio-group class="flex-1 d-flex align-items-center justify-content-center" v-model="report.cagPci.system" :options="[{text: '是', value: true}, {text: '否', value: false}]" />
            </k-form>

            <k-form :label="{ text: '護 理 師', class: 'wpx-5' }" :dividWidth="22" class="mr-3 mb-2" :border="false">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.nurse" :multiple="true" :searchable="true" :options="nurses" />
              </div>
            </k-form>

            <k-form :label="{ text: '放 射 師', class: 'wpx-5' }" :dividWidth="19" class="mb-2" :border="false">
              <div class="flex-1 h-100">
                <treeselect v-model="report.cagPci.rads" :multiple="true" :searchable="true" :options="radors" />
              </div>
            </k-form>
            

            

            
          </div>

          <div v-for="(cath,cIdx) in [report.cagPci.pre, report.cagPci.post]" :key="cath.key" class="d-flex my-2">
            <div v-text="`${cath.key.charAt(0).toUpperCase() + cath.key.slice(1)}-cath diagnosis: `" class="wpx-8" />
            <div class="d-flex flex-1">
              <b-input-group :class="`wpx-${cath.key==='pre' ? 9:19}`" size="sm" :key="cath.key + 'cathKey'">
                <!-- <b-select v-model="cath.diagnosis" :options="cIdx===0 ? preOptions:postOptions" @change="()=> cath.killip = cath.timi = ''" /> -->
                <!-- <treeselect v-model="cath.diagnosis" :multiple="false" :searchable="true" :options="cIdx===0 ? preOptions:postOptions" /> -->
                <k-list-input @updateValue="v => { cath.diagnosis = v }" :value="cath.diagnosis" :options="(cIdx===0 ? preOptions:postOptions).map(({label})=>label)" :listName="cath.key" />
              </b-input-group>

              <template v-if="cath.key=== 'pre' && (cath.diagnosis === 'NSTEMI' || cath.diagnosis === 'STEMI')">
                <b-input-group class="pr-2 ml-2 wpx-10" size="sm" :prepend="cath.diagnosis === 'NSTEMI' ? 'TIMI' : 'Killip'" :key="cath.key + 'cathKeyInput'">
                  <b-input type="text" />
                </b-input-group>
              </template>
            </div>
          </div>

          <div class="d-flex flex-wrap report-group" style="margin: 0 -2px;">
            <div class="wpx-24 d-flex">
              <div class="wpx-8">Procedure: </div>
              <b-input-group size="sm" class="flex-1" style="padding-left: 2px;">
                <div class="flex-1 h-100">
                  <treeselect v-model="report.cagPci.procedure.value" :multiple="true" :searchable="true" :options="procedureOptions" />
                </div>
              </b-input-group>
            </div>

            <div class="w-100 mb-2" />

            <div class="wpx-30 d-flex mr-1">
              <div class="wpx-8">Puncture: </div>
              <b-input-group size="sm" class="flex-1" style="padding-left: 2px;">
                <div class="h-100">
                  <treeselect v-model="report.cagPci.puncture.value" :multiple="true" :searchable="true" :options="punctureOptions" />
                </div>
              </b-input-group>
            </div>

            <div class="d-flex wpx-23 ml-2">

              <div class="d-flex align-items-center flex-wrap lab-info flex-1">
                <k-input :minNum="0" :label="{text: '局部⿇醉 2% Lidocane', class:'wmpx-9'}" type="number" :dividWidth="12" class="mr-1" />
                <div class="ml-1 unit-text">(cc)</div>
              </div>

              <div class="d-flex align-items-center px-1 wpx-9">
                <div class="px-1 mx-1">at</div>
                <div style="box-shadow: 0 0 0 1px rgb(206, 212, 218) inset; padding: 1px;" class="d-flex flex-1 align-items-center h-100 rounded">
                  <b-select size="sm" class="no-border" style="height: 25px;" :options="new Array(24).fill('').map((v,i)=>({text: $number2Digits(i), value: i}))" />
                  <div class="px-1 mx-1">:</div>
                  <b-select size="sm" class="no-border" style="height: 25px;" :options="new Array(60).fill('').map((v,i)=>({text: $number2Digits(i), value: i}))" />
                </div>
              </div>


              <!-- <b-input-group size="sm" prepend="局部⿇醉 2% Lidocane" class="flex-1">
                <b-input value="" />
              </b-input-group> -->


              <!-- <b-input-group size="sm" append="cc" class="wpx-5 mx-1">
                <b-input type="number" max="999" min="0" />
              </b-input-group> -->
              
              
              <!-- <div class="d-flex align-items-center border wpx-8">
              </div> -->

            </div>

            <!-- <div class="input-group wpx-7">
              <b-input size="sm" type="time" />
            </div> -->

            <div class="w-100 mb-1" />

            <div class="d-flex align-items-center wpx-8">Fluoroscopy: </div>
            
            <b-input-group size="sm" prepend="Contrast medium" class="wpx-13">
              <!-- <b-select v-model="report.cagPci.contrastMedium" :options="contrastMediumOptions" /> -->
              <div class="h-100 flex-1">
                <treeselect v-model="report.cagPci.contrastMedium" :multiple="false" :searchable="true" :options="contrastMediumOptions" class="cus-treeselect" />
              </div>
            </b-input-group>

            <!-- <b-input-group size="sm" append="cc" class="wpx-6">
              <b-input type="number" max="999" />
            </b-input-group> -->
            <k-input type="number" size="sm" :dividWidth="4" :minNum="0" unit="cc"  />

            <b-input-group size="sm" prepend="Fluoro Time" class="wpx-10">
              <k-input type="number" :dividWidth="4"  unit="mins" :minNum="0"  />
            </b-input-group>
            <!-- <b-input-group size="sm" prepend="Fluoro Time" append="mins" class="wpx-10">
              <b-input type="number" max="999" />
            </b-input-group> -->

          </div>


          <div class="d-flex mt-2">
            <div class="pr-2 d-flex wpx-8" >Diagnosisc catheter: </div>
            <div class="flex-1">

              <div class="d-flex pb-2 w-100" :class="{'pt-2': index > 0}" v-for="(diagnosisc,index) in ['right', 'left', 'other']" :key="diagnosisc">
                <div class="wpx-3 pr-2" v-text="`${diagnosisc.charAt(0).toUpperCase() + diagnosisc.slice(1)}:`" />
                <div class='flex-1 d-flex flex-wrap'>
                  <b-input-group v-for="(rig,idx) in report.cagPci[diagnosisc]" class="wpx-5 mr-1 mb-1" :key="diagnosisc+idx">
                    <!-- <b-select size="sm" v-model="rig.value" :options="diagnosiscOpts" @change="updateValues(report.cagPci[diagnosisc], rig.value)" /> -->
                    <div class="h-100 flex-1">
                      <treeselect v-model="rig.value" :multiple="false" :searchable="true" :options="diagnosiscOpts" @select="updateValues(report.cagPci[diagnosisc], rig)" class="cus-treeselect" :class="{'half-transparent': !rig.value}" />
                    </div>
                  </b-input-group>
                </div>
              </div>
            </div>
          </div>

        </b-card-text>
      </b-tab>

      <b-tab :title="tab" v-for="(tab,idx) in ['EPS ABL', 'PTA PAOD', 'R\'H PAG', 'TPM PPM', 'LAAO', 'RDN']" :key="tab">
        <b-card-text>Tab contents {{idx + 2}}</b-card-text>
      </b-tab>

    </b-tabs>


  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import funcBtns from "./funcBtns.vue";

export default {
  props: {},
  components: {
    Treeselect, funcBtns
  },
  data() {
    const doctors = new Array(10).fill('').map((v,i)=>({label: 'doctor' + (i+1), id: 'v' + (i+1)}));
    const nurses = new Array(10).fill('').map((v,i)=>({label: 'nurse' + (i+1), id: 'v' +(i+1)}));
    const radors = new Array(10).fill('').map((v,i)=>({label: 'rador' + (i+1), id:'v' +(i+1)}));
    const contrastMediumOptions = [{label: '', id: ''}].concat(new Array(10).fill('').map((v,i)=>({label: 'option' + (i+1), id:'opt' +(i+1)})));
    const diagnosiscOpts = [{label: '', id: ''}].concat(new Array(10).fill('').map((v,i)=>
      {
        const rand = Math.floor(Math.random() * 10000);
        return {
          label: rand, id: rand
        }
      }));

    const procedureOptions = [
      {label: 'L\'H', id: 'lh'}, {label: 'CAG', id: 'cag'}, {label: 'PTCA', id: 'ptca'}, {label: 'Stenting', id: 'stenting'}, {label: 'Peripheral angiography', id: 'peripheralAngiography'}, {label: 'LVG', id: 'lvg'}, {label: 'AoG', id: 'aog'}
    ];
    const punctureOptions = [
      {label: 'R\'TRA', id: 'rtra'}, {label: 'L\'TRA', id: 'ltra'}, {label: 'RFA', id: 'rfa'}, {label: 'LFA', id: 'lfa'}, {label: 'L\'TDRA', id: 'ltdra'}
    ];
    const preOptions = [
      {label: 'CAD', id: 'CAD'}, {label: 'STEMI', id: 'STEMI'}, {label: 'NSTEMI', id: 'NSTEMI'}
    ];
    const postOptions = [
      {label: 'CAD, SVD', id: 'CAD-SVD'}, {label: 'CAD, DVD', id: 'CAD-DVD'}, {label: 'CAD, TVD', id: 'CAD-TVD'},
      {label: 'CAD, LM + SVD', id: 'CAD-LM-SVD'}, {label: 'CAD, LM + DVD', id: 'CAD-LM-DVD'}, {label: 'CAD, LM + TVD', id: 'CAD-LM-TVD'},
      {label: 'Myocardial bridge', id: 'myocardialBridge'}, {label: 'Coronaropathy', id: 'coronaropathy'}, {label: 'Insignificant CAD', id: 'insignificantCAD'}
    ];

    return {
      btns: [
        {label: '歷史', key: 'history', img: 'monument'},
        {label: '設定', key: 'setting', img: 'cog'},
        {label: 'PACS', key: 'pacs', img: 'images'},
        {label: '暫存', key: 'save', img: 'save'},
        {label: '認證', key: 'confirm', img: 'check'}
      ],
      doctors,
      nurses,
      radors,
      report: {
        cagPci: {
          no: '',
          mainDr: [],
          secDr: [],
          system: true,
          nurse: [],
          rads: [],
          right: [{value: ''}],
          left: [{value: ''}],
          other: [{value: ''}],
          pre: {
            key: 'pre',
            diagnosis: null
          },
          post: { 
            key: 'post',
            diagnosis: null
          },
          lidocane: '',
          procedure: { label: 'Procedure', value: [] },
          puncture: { label: 'Puncture', value: [] },
          contrastMedium: ''
        }
      },
      contrastMediumOptions,
      diagnosiscOpts,
      procedureOptions,
      punctureOptions,
      preOptions,
      postOptions
    };
  },
  methods: {
    callValue(v) {
      alert(v)
    },
    saveEvent() {
      this.$emit('savingEvent')
      // alert("TEST");
    },
    updateValues(items, item) {
      setTimeout(()=>{
        const _last = items.slice(-1)[0];
        if(!!_last.value) {
          const _newLast = JSON.parse(JSON.stringify(_last));
          Object.keys(_newLast).forEach(k=>{
            _newLast[k] = '';
          })
          items.push(_newLast);
        }
  
        if(!currentValue && !_last.value) items.pop();
      }, 0)
    }
  },
  mounted() {
    const ulElemnt = this.$refs.bTabs.$el.querySelector('ul');
    
    const titleSpan = document.createElement('span');
    const btnSpan = this.$refs.btns;

    titleSpan.className = 'd-flex align-items-center'
    titleSpan.innerText = '報告種類：';
    ulElemnt.prepend(titleSpan);
    ulElemnt.append(btnSpan);


    // Array.from(listElemnt).forEach(a => {
    //   console.log(a);
    // })
    setTimeout(()=> {
      Array.from(this.$refs.bTabs.$el.querySelectorAll('li a')).forEach(item => {
        item.innerHTML = item.innerText.split(' ').join('<br />');
        item.classList.add('d-flex');
        item.classList.add('align-items-center');
        // item.classList.add('h-100');
      })
    }, 50)
  }
};
</script>

<style lang="scss" scoped>

/deep/ .vue-treeselect__control {
  padding: 0 0 0 2px;
}

/deep/ .nav-tabs {
  border-bottom: 3px solid var(--thirColor);
  display: flex;
  .nav-link.active {
    background-color: var(--thirColor);
    color: black;
    border: none !important;
  }
  .nav-item {
    margin-bottom: -2px;
  }
}

.system-radio-btns {
  /deep/ .btn.btn-secondary {
    background-color: #fff;
    border: 1px solid #aaa;
    &:not(:disabled):not(.disabled).active {
      background-color: var(--thirColor);
    }
  }
}

.report-form {
  .input-group-text {
    .input-group-append {
      min-width: 90px;
    }
  }
  /deep/ .vue-treeselect__control {
    height: 30px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  /deep/ .vue-treeselect__multi-value {
    margin: 2px;
  }

  /deep/ .vue-treeselect__multi-value-item-container {
    padding-top: 2px;
  }

  /deep/ .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value .vue-treeselect__input-container {
    padding-top: 0;
  }

  .cus-treeselect {
    /deep/ .vue-treeselect__control {
      padding: 3px 0;
    }
  }
}

.report-group {
  > div.input-group {
    margin: 2px;
  }
}



</style>

<style lang="scss" scoped>
.no-border {
  border-width: 0px;
}

/deep/.nav.nav-tabs {
  li.nav-item {
     a.nav-link {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}

.vue-treeselect--focused {
  opacity: 1 !important;
}
</style>
