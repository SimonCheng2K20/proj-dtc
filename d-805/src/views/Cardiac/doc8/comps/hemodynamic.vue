<template>
  <div class="px-2 py-3">

    <div class="mb-1 font-weight-bold">Pressure:</div >

    <div class="d-flex align-items-center flex-wrap lab-info">
      <k-input :minNum="0" :label="{text: 'Ao', class:'wpx-2'}" type="number" :dividWidth="5" @blurEvent="checkValue(aog)" @updateValue="v => aog.value = v" v-model="aog.value" class="mr-1" />
      <div class="ml-1 unit-text">(mmHg)</div>
      <div class="pl-1">/</div>
      <k-input style="margin-left: -22px;" :minNum="0" :label="{text: ' ', class:'wpx-2'}" @blurEvent="checkValue(aog)" type="number" :dividWidth="5" @updateValue="v => aog.mmHg = v" v-model="aog.mmHg" />
      <div class="mr-3 ml-1 unit-text">(mmHg)</div>

      <k-input :minNum="0" :label="{text: 'LV', class:'wpx-2'}" @blurEvent="checkValue(lvg)" type="number" :dividWidth="5" @updateValue="v => lvg.value = v" v-model="lvg.value" />
      <div class="ml-1 unit-text">(mmHg)</div>
      <div class="pl-1">/</div>
      <k-input style="margin-left: -22px;" :minNum="0" :label="{text: ' ', class:'wpx-2'}" @blurEvent="checkValue(lvg)" type="number" :dividWidth="5" @updateValue="v => lvg.mmHg = v" v-model="lvg.mmHg" />
      <div class="mr-3 ml-1 unit-text">(mmHg)</div>
    </div>
    
    <div class="d-flex align-items-center mb-2 py-2" v-if="hasLVG">
      <div class="pr-2 font-weight-bold wpx-12">Left ventriculography (LVG):</div >
      <k-radio :marginRight="1" dividClass="flex-1 d-flex align-items-center" @updateValue="(value)=> { lvg.active = value}" v-model="lvg.active" :options="[{text: 'Yes', value: true}, {text: 'No', value: false}]" />
    </div>

    
    <div v-if="lvg.active && hasLVG">
      <k-input class="my-2" :dividWidth="20" :label="{text: 'Cardiac output', class:'wmpx-9'}" @updateValue="v => lvg.cardiacOutput = v" v-model="lvg.cardiacOutput" unit="%" />

      <k-form class="mb-2" :dividWidth="20" :label="{text: 'Mitral regurgitation(MR)', class:'wmpx-9'}" >
        <!-- <b-select v-model="lvg.mr" :options="mitralOpts" /> -->
        <treeselect v-model="lvg.mr" :multiple="false" :searchable="true" :options="mitralOpts.map(({text: label, value: id}) => ({label, id}))" />
      </k-form>

      <k-form class="mb-2" :dividWidth="20" :label="{text: 'Aortic stenosis(AS)', class:'wmpx-9'}" >
        <!-- <b-select v-model="lvg.as" :options="mitralOpts" /> -->
        <treeselect v-model="lvg.as" :multiple="false" :searchable="true" :options="mitralOpts.map(({text: label, value: id}) => ({label, id}))" />
      </k-form>

    </div>

    <div class="d-flex align-items-center mb-2 py-2" v-if="hasAoG">
      <div class="pr-2 font-weight-bold wpx-12">Aortography (AoG):</div >
      <k-radio :marginRight="1" dividClass="flex-1 d-flex align-items-center" @updateValue="(value)=> { aog.active = value}" v-model="aog.active" :options="[{text: 'Yes', value: true}, {text: 'No', value: false}]" />
    </div>
    
    <div class="d-grid mb-1 grid-col-3" style="grid-gap: 5px;" v-if="aog.active && hasAoG">
      <k-form class="mb-2" :dividWidth="20" :label="{text: 'Aortic regurgitation(AR)', class:'wmpx-9'}" >
        <treeselect :multiple="false" :searchable="true" :options="mitralOpts.map(({text: label, value: id}) => ({label, id}))" />
        <!-- <b-select v-model="aog.value" :options="mitralOpts" /> -->
      </k-form>
      <!-- <k-input class="mt-2" :dividWidth="20" :label="{text: 'Cardiac output', class:'wmpx-9'}" @updateValue="v => aog.cardiacOutput = v" v-model="aog.cardiacOutput" unit="%" /> -->
    </div>

  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    procedure: {
      type: Array,
      default: []
    },
  },
  components: {
    Treeselect
  },
  data() {
    const base = () => ({
      value: null,
      mmHg: '',
      active: null,
      cardiacOutput: ''
    });

    return {
      mitralOpts: [{text: 'Severe', value: 'severe'}, {text: 'Moderate', value: 'moderate'}, {text: 'Mild', value: 'mild'}, {text: 'Nil', value: 'nil'}],
      isLvg: null,
      isAog: null,
      lvg: {
        ...base(),
        mr: null,
        as: null
      },
      aog: {
        ...base()
      }
    }
  },
  computed: {
    hasLVG() {
      return !this.procedure
        ? false
        : this.procedure.includes('lvg');
    },
    hasAoG() {
      return !this.procedure
        ? false
        : this.procedure.includes('aog');
    },
    hemodynamicData() {
      return {
        lvg: this.lvg,
        aog: this.aog
      }
    }
  },
  methods: {
    checkValue (item) {
      Object.keys(item).forEach(k => {
        if(item[k] && item[k] >= 1000) item[k] = 999;
      });
    }
  }
};
</script>

<style scoped>
.unit-text {
  font-size: 12px;
  color: #999;
}
</style>
