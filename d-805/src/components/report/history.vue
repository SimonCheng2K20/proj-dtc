<template>
  <b-card bg-variant="transparent" no-body class="border position-relative">
    <b-tabs>
      <b-tab title="歷史報告" active>
        <div @click="$emit('showAlert', 2)" style="dislay: block; font-size: 13px; height: 30px; line-height: 30px; padding-left: 6px;">
          歷史診斷報告 <span style="font-size: 12px;">{{ this.historys && this.historys.length ? `(共${this.historys.length}筆 )` : '(暫無記錄)' }}</span>
        </div>
        <div style="height: 100%; overflow-y: scroll;" :style="showDetailHeight">
          <div class="dtc-his-grid text-white" style="background: #343a40">
            <template v-if="historys.length">
              <div style="padding-left: 12px" class="title">
                項目
              </div>
              <div>
                報告醫師
              </div>
              <div class="title">
                <span style="display: inline-block;" @click="changeSort">
                  檢查時間
                  <font-awesome-icon icon="sort" v-if="hisSort === 0" />
                  <font-awesome-icon icon="sort-up" v-if="hisSort === 1" />
                  <font-awesome-icon icon="sort-down" v-if="hisSort === 2" />
                </span>
              </div>
            </template>
          </div>
          <b-container
            v-if="hisLoading"
            class="d-flex flex-column text-center justify-content-center position-absolute w-100"
            style="left: 50%; top: 25%; transform: translate(-50%)"
          >
            <b-spinner type="grow" label="Spinning" class="pl-3 mx-auto"></b-spinner>
            <div>歷史診斷報告載入中, 請稍待 ..</div>
          </b-container>
          <b-container fluid class="p-0">
            <b-row no-gutters>
              <div
                style="position: relative; padding-top: 2px; padding-bottom: 2px; width: 100%; height: 100%; overflow-y: scroll;"
              >
                <div id="blkHistoryList" ref="blkHistoryList">
                  <a
                    class="dtc-his-grid link"
                    style="padding-top: 5px"
                    v-for="(item, i) in historyData"
                    :id="'dtc-history' + i"
                    :key="'dtc-history' + i"
                    :tabindex="i"
                    @focus="(e)=>{showReport(item, i, e)}"
                    @dblclick="hisShowPac(item)"
                    :class="i === 0 ? 'active-history' : ''"
                    href="javascript:void(0);"
                  >
                    <div class="procedure pl-1" :title="item.ProcedureNameList">
                      {{ item.Modality ? `${item.Modality} | ` : '' }}{{ item.ProcedureName }}
                    </div>
                    <!-- <div v-text="item.DxreportPhysicianName"></div> -->
                    <div v-text="item.IssuePhysicianName"></div>
                    <div class="time" :title="item.ProcedureNameList" v-text="item.ProcedureCompleted ? item.ProcedureCompletedForShow : '暫無資料'" />
                  </a>
                </div>
              </div>
            </b-row>
          </b-container>
        </div>
      </b-tab>
      <b-tab title="圖片" style="overflow: auto">
        <div style="display: flex; align-items: start; flex-direction: column; gap: 8px; overflow-y: scroll;" :style="showDetailHeight">
          <b-checkbox-group size="lg" v-model="selectedImageModelValue" style="display: flex; align-items: start; flex-direction: column; gap: 8px">
            <div
              v-for="(item, index) in Images"
              :key="index"
              style="display: flex; justify-content: center; align-items: center; border: 1px solid #123456; background: #dddddd; position: relative"
            >
              <b-img :src="item.src" style="width: 100%; cursor: pointer"></b-img>
              <b-checkbox :value="item.oid" @change="onCheckboxChange" style="position: absolute; top: 0; left: 4px; margin-right: 0"></b-checkbox>
            </div>
          </b-checkbox-group>
        </div>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    historys: {
      type: Array,
      default: () => [],
    },
    loadingHistory: {
      type: Boolean,
      default: false,
    },
    showDetailHeight: {
      type: Object,
    },
    Images: {
      type: Array,
      default: () => [],
    },
    selectedImage: {
      type: Array,
      default: () => [],
    },
    currentModality: {
      type: String,
      default: () => null,
    }
  },
  data() {
    return {
      selectedImageModelValue: this.selectedImage,
      hisSortRaw: 0,
      historyTemp: [],
      loadingTemp: true,
    }
  },
  computed: {
    hisSort: {
      get(){
        return this.hisSortRaw
      },
      set(val){
        this.hisSortRaw = val
      }
    },
    hisLoading: {
      get(){
        return this.loadingTemp
      },
      set(val){
        this.loadingTemp = val
      }
    },
    historyData: {
      get(){
        let tempArr = []
       
        if (this.hisSort === 0){

          let sortOrder = ['CT', 'MR', 'RF', 'CR', 'US', 'MG', 'BMD', 'EKG', 'ES', 'OT', 'XA', 'OTHERS']
          let priorityType = this.currentModality ? this.currentModality : null
          let tempIdx = null

          if(priorityType){
            if(sortOrder.includes(priorityType)){
              tempIdx = sortOrder.indexOf(priorityType)
              sortOrder.splice(tempIdx, 1)
              sortOrder.unshift(priorityType)
            }else{
              sortOrder.unshift(priorityType)
            }
          }

          let newArr = []
          let updateArr = []
          let cloneArr = _.cloneDeep(this.historyTemp)

          newArr = sortOrder.map((v)=>{
            return {[v]: []}
          })

          cloneArr.forEach((v)=>{

            newArr.forEach((w, j)=>{
              if(v.Modality && Object.keys(w)[0].includes(v.Modality)){
                newArr[j][v.Modality].push(v)
              }
            })

            if(
              v.Modality && !sortOrder.includes(v.Modality)
            ){
              newArr[newArr.length-1]['OTHERS'].push(v)
            }else if(
              v && !sortOrder.includes(v.Modality)
            ){
              newArr[newArr.length-1]['OTHERS'].push(v)
            }
          })

          newArr.forEach((v, i)=>{
            v[sortOrder[i]] = _.orderBy(v[sortOrder[i]], ['ProcedureCompleted'], ['desc'])
            if(v[sortOrder[i]] && v[sortOrder[i]].length){
               updateArr = updateArr.concat(v[sortOrder[i]])
            }
          })

          tempArr = _.cloneDeep(updateArr)

        } else if (this.hisSort === 1){
          tempArr = _.orderBy(this.historyTemp, ['ProcedureCompleted'], ['desc'])
        } else if (this.hisSort === 2){
          tempArr = _.orderBy(this.historyTemp, ['ProcedureCompleted'], ['asc'])
        }
        return tempArr
      }
    }
  },
  methods: {
    onCheckboxChange(val) {
      this.$emit('update:selectedImage', val)
    },
    showReport(item, i, e) {
      // if(e.detail == 2){
      //   this.$emit('showHistoryReport', { item, id: i })
      // }
      console.log(`showReport:`, item)

      this.$emit('showHistoryReport', { item, id: i })
    },
    hisShowPac(item){
      this.$emit('hisShowPac', { AccessionNo: item.AccessionNo, PatientId: item.PatientId })
    },
    changeSort(){
      this.hisSort++
    },
  },  
  async mounted() {
    console.log(`mounted ~`)
  },
  watch: {
    selectedImage(val) {
      this.selectedImageModelValue = val
    },
    historys: {
      handler(val){
        if(val && val.length){
          this.hisLoading = false
          this.hisSort = 0
          this.historyTemp = val
        }else{
          this.hisLoading = true
          setTimeout(()=>{
            this.hisLoading = false
          }, 1500)
          this.historyTemp = []
        }
      },
      deep: true,
      immediate: true,
    },
    hisSort: {
      handler(val){
        if(val > 2){
          this.hisSort = 0
        }
      },
      deep: true,
      immediate: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.cardHeader {
  padding: 0 1.25rem; /*2px 1.25rem;*/
  white-space: nowrap;
}

.dtc-his-grid {
  display: grid;
  width: 100%;
  grid-template-columns: 43.33% 23.33% 33.33%;
  border-bottom: 1px solid #ddd;
  //grid-row-gap: 15px;

  color: inherit;

  font-size: 12px;

  > div {
    margin-bottom: 5px;
    padding-right: 3px;
    cursor: pointer;
    padding-top: 3px;

    text-align: center;

    &:first-child{
      text-align: left;
    }

    &.time,
    &.procedure {
      font-size: 12px;
      white-space: normal;
      color: inherit;
    }
  }

  &.link{
    margin-right: auto;
    margin-left: auto;
    width: 98%;

    text-decoration: none;
    cursor: pointer;

    &:hover{
      background-color: rgba(255,193,7,0.5);
    }

    &:focus{
      background-color: var(--warning);
    }
  }

  /*
  &.active-history {
    background-color: var(--warning);
  }
  */

}
</style>
