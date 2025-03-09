<template>
  <div class="px-2 py-3">
    
    <div class="d-flex align-items-center mb-1">
      <div class="pr-2">Time:</div >
      <div class="flex-1 d-flex flex-wrap">
        <b-input-group v-for="time in times" :key="time.label" :prepend="time.label" class="wpx-11 mx-1">
          <!-- <b-input type="time" v-model="time.value" /> -->
          <!-- <b-time v-model="time.value" /> -->
          <div class="flex-1 d-flex align-items-center border rounded-right">
            <b-select size="sm" class="no-border" v-model="time.hour" :options="new Array(24).fill('').map((v,i)=>({text: $number2Digits(i), value: i}))" />
            <div class="px-1 mx-1">:</div>
            <b-select size="sm" class="no-border" v-model="time.min" :options="new Array(60).fill('').map((v,i)=>({text: $number2Digits(i), value: i}))" />
          </div>
        </b-input-group  >
      </div>
    </div>

    <div class="target-lesion">
      <div class="font-weight-bold py-2">Target lesion: </div>

      <div class="flex-1 d-grid grid-col-30" style="grid-gap: 5px;">
        <div class="grid-span-3 text-center">Position</div>
        <div class="text-center">Balloon</div >
        <div class="text-center">Stent</div >
        <div class="grid-span-4 text-center">Dilation</div>
      </div>
      <!-- target.position -->
      <div v-for="(target,idx) in listOfTarget" :key="idx" class="flex-1 d-grid grid-col-30 my-1" style="grid-gap: 5px;"  >
        
        <div class="grid-span-3 d-flex">
          <div v-text="idx + 1" style="width: 30px" />
          <treeselect :class="{'half-transparent': !target.position}" v-model="target.position" :multiple="false" :searchable="true" @select="(option) => { changeEvent(option, target) }" :options="options.map(({text: label, value: id}) => ({label, id}))" />
        </div >

        <template v-if="target.position">

          <div class="d-flex align-items-center justify-content-center" :class="{'half-transparent': !target.position}">
            <b-form-checkbox v-model="target.ballonOrStent" :name="'target' + idx" value="ballon" />
          </div >

          <div class="d-flex align-items-center justify-content-center" :class="{'half-transparent': !target.position}">
            <b-form-checkbox v-model="target.ballonOrStent" :name="'target' + idx" value="stent" />
          </div>

          <div class="d-flex align-items-center grid-span-2" :class="{'half-transparent': !target.position}">
            <b-input v-model="target.bar" class="flex-1" />
            <div class="ml-1">Bar</div>
          </div>

          <div class="d-flex align-items-center grid-span-2" :class="{'half-transparent': !target.position}">
            <b-input v-model="target.sec" class="flex-1" />
            <div class="ml-1">Sec</div>
          </div>

        </template>

      </div>
    </div>

    
    <div class="equipments">
      <div class="font-weight-bold py-2">Equipments: </div>

      <div class="d-flex mb-2" v-for="(module, midx) in modules" :key="'module' + midx">
        <div class="wmpx-6 pt-2" v-text="module.label + (['Guiding', 'Balloon'].some(k => module.label === k) ? ' catheter': '')" />
        <div class="flex-1 d-flex flex-wrap">
          <template v-for="(ging,index) in module.items">
            <!-- <b-select size="sm" :key="'select' + module.key + index" class="wpx-6 mx-1 mb-1" v-model="ging.value" :options="module.key === 'medication' ? medicationOptions:options" @change="addItem(module.items, ging.value)" /> -->

            <treeselect v-model="ging.value" @select="(option) => { ging.value = option.id; addItem(module.items, ging.value) }" class="wpx-15 mx-1 mb-1" :key="'select' + module.key + index" :multiple="false" :searchable="true" :options="(module.key === 'medication' ? medicationOptions:options).map(({text: label, value: id}) => ({label, id}))" />

            <template v-if="module.key === 'medication'">
              <k-input class="mr-4" v-model="ging.weight" @updateValue="v=>ging.weight = v" :dividWidth="5" :tail="{text: ging.value.includes('mg') ? 'mg':'Unit', class: 'mx-1'}" :key="'input' + module.key + index" />
                
              <div class="w-100" :key="'break' + module.key + index" />
            </template>

            <template v-if="module.key === 'ballon' || module.key === 'stent'">
              <k-input :dividWidth="7" :label="{text: 'Max', class: 'mx-1'}" :tail="{text: 'bar', class: 'mx-1'}" :key="'bsnput' + module.key + index" class="mr-2" />

              <k-input :dividWidth="5" :tail="{text: 'Sec', class: 'mx-1'}" :key="'ssnput' + module.key + index" class="mx-2" />

              <k-input v-if="module.key==='stent'" :dividWidth="7" :tail="{text: 'Position', class: 'mx-1'}" :key="'psnput' + module.key + index" class="mx-2" />
              
              <div class="w-100" :key="'break' + module.key + index" />
            </template>


          </template>
        </div>
      </div>


      <!-- <div class="d-grid py-3" :class="`grid-col-${module.key === 'medication' ? 4: 7}`" style="grid-gap: 5px;" v-for="(module, midx) in modules" :key="'module' + midx">
        <div v-for="(ging,index) in module.items"  :key="'select' + module.key + index" :class="{'d-flex': module.key === 'medication'}" >
          <b-input-group :prepend="index === 0 ? module.label + ' catheter':''" :class="{'half-transparent': !ging.value}">
            <b-select  v-model="ging.value" :options="module.key === 'medication' ? medicationOptions:options" @change="addItem(module.items, ging.value)" />
          </b-input-group >

          <b-input-group style="width: 120px;" class="ml-1" v-if="module.key === 'medication'" :append="!ging.value ? null:ging.value.includes('mg') ? 'mg':'g'" :key="'input' + module.key + index">
            <b-input v-model="ging.weight" type="number" />
          </b-input-group>
        </div>
      </div> -->
    </div>

    

    <div class="d-flex align-items-center mb-2 mt-4">
      <div class="pr-2">Success:</div >
      <div class="flex-1">
        <b-form-radio-group v-model="isSuccess" :options="[{text: 'Yes', value: true}, {text: 'No', value: false}]" />
      </div>
    </div>

    <div class="position-relative">

      <div class="mb-2">
        <div class="textarea-title">Comments</div >
        <b-form-textarea v-model="comments" rows="5" @mousedown.stop @contextmenu.prevent @contextmenu="showContextMenu" style="resize: none;" />
        <!-- @mousedown.stop @contextmenu.prevent -->
      </div >

      <div class="mb-2">
        <contextMenu
          ref="contextMenu"
          :show="contextMenuVisible"
          :offset="contextMenuOffset"
          @update:show="show => (contextMenuVisible = show)"
        >
          <div class="bg-white text-black func-panel py-1 border">
            <div class="px-3 py-1" v-for="btn in btns" :key="btn.key" v-text="`${btn.label} ${btn.enLabel}`" @click.stop="btnEvent(btn.key)" />
          </div>
        </contextMenu>
      </div>
    </div>
</div>
</template>

<script>
import contextMenu from "./contextMenu.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {

  },
  components: { contextMenu, Treeselect },
  data() {
    const times = ['ER', 'Arrive', 'Start', 'Wire', 'Balloon', 'End'].map(label=>({label, key: label.toLowerCase(), hour: 0, min: 0 }));
    const options = [{text: '', value: ''}].concat(new Array(10).fill('').map((v,i)=>({text: 'option' + (i+1), value: i+1})));
    const medicationOptions = [{text: '', value: ''}].concat(new Array(10).fill('').map((v,i)=>({text: 'option' + (i+1) + (i%2===1 ? 'g':'mg'), value: `${i+1}${i%2===1 ? 'g':'mg'}`})));
    return {
      options,
      medicationOptions,
      times,
      listOfTarget: [
        { position: '', ballonOrStent: [], bar: '', sec: '' },
        // { position: '', ballonOrStent: '', bar: '', sec: '' },
        // { position: '', ballonOrStent: '', bar: '', sec: '' }
      ],
      
      isSuccess: null,

      modules: [
        {key:'guiding', items: [{value: ''}]},
        {key:'guidewire', items: [{value: ''}]},
        {key:'balloon', items: [{value: ''}]},
        {key:'stent', items: [{value: ''}]},
        {key:'medication', items: [{value: '', weight: ''}]},
        {key:'other', items: [{value: ''}]}
      ],
      comments: '',
      contextMenuVisible: false,
      contextMenuOffset: {
        left: 0,
        top: 0
      },
      btns: [
        {label: '帶入範本', enLabel: 'Template', key: 'template'},
        {label: '剪下', enLabel: 'Cut', key: 'cut'},
        {label: '複製', enLabel: 'Copy', key: 'copy'},
        {label: '貼上', enLabel: 'Paste', key: 'paste'},
        {label: '復原', enLabel: 'Undo', key: 'undo'},
        {label: '取消復原', enLabel: 'Re-do', key: 'redo'}
      ]
    }
    
  },
  created() {
    this.modules.forEach(module=>{
      module['label'] = module.key[0].toUpperCase() + module.key.substr(1);
    });
  },
  methods: {
    targetPositionEvent () {
      alert("cc");
    },
    addGuiding() {
      const _last = this.guidingList.find((v,i)=> i === this.guidingList.length - 1);
      if(!!_last.value) this.guidingList.push({value: ''});
    },
    addItem(items, currentValue) {      
      const _last = items.find((v,i)=> i === items.length - 1);
      if(!!_last.value) {
        const addition = JSON.parse(JSON.stringify(_last));
        Object.keys(addition).forEach(k=>{addition[k] = ''});
        items.push(addition);
      }

      if(!_last.value && !currentValue) {
        items.pop();
      }
    },
    changeEvent({ id: currentValue }, item) {
      item.position = currentValue;
      const items = this.listOfTarget;
      const _last = items.slice(-1)[0];

      if(!!_last.position) {

        const newItem = JSON.parse(JSON.stringify(_last));
        Object.keys(newItem).forEach(k=>{
          newItem[k] = '';
        });
        items.push(newItem);
      }

      if(!_last.position && !currentValue) {
        items.pop();
      }
    },
    showContextMenu(e) {
      this.contextMenuVisible = true;
      this.$nextTick(()=>{
        const { scrollHgt } = this.$refs.contextMenu;
        const top = e.pageY - 10 < scrollHgt
          ? e.pageY - 10
          : scrollHgt;
        // const top = e.pageY - 10;

        this.contextMenuOffset = {
          left: e.pageX + 10,
          top
        };
      });
    },
    btnEvent(key) {
      this.contextMenuVisible = false;
    }
  },
  computed: {
    percutaneousData() {
      // { position: '', ballonOrStent: '', bar: '', sec: '' },
      // {key:'guiding', items: [{value: ''}]},
      const conver2Obj = (acc,cur) => ({...acc, [cur.key]: cur.value});
      return { 
        times: this.times.reduce(conver2Obj, {}),
        targetLesion: this.listOfTarget.filter(({position})=>position),
        equipments: this.modules.reduce((acc, cur)=>({...acc, [cur.key]: cur.items.filter(({value})=> value)}), {}),
        success: this.isSuccess,
        comments: this.comments
      }
    }
  },
  watch: {
    times: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.func-panel {
  min-width: 200px;
  box-shadow: 2px 2px 5px #888;
  > div {
    font-size: 15px;
    cursor: pointer;
    &:hover {
      background-color: #aaa;
    }
  }
}
.no-border {
  border-width: 0px;
}

.vue-treeselect--focused {
  opacity: 1 !important;
}

</style>

