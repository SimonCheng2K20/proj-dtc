<template>
  <div>
    <Dialog title="編輯自定義查詢" v-model="showDialog">
      <QuickSearchBox @close="showDialog=!showDialog" style="width:50vw;" />
    </Dialog>
    <el-form label-width="100px" label-position="left">
      <InputLabel title="病歷號" class="mb-1">
        <el-input v-model="formCopy.PatientId"></el-input>
      </InputLabel>
      <InputLabel title="身分證號" class="mb-1">
        <el-input v-model="formCopy.Identifier"></el-input>
      </InputLabel>
      <InputLabel title="病歷日期" class="mb-1">
        <el-date-picker v-model="formCopy.RecordDate" value-format="yyyy-MM-dd" type="daterange" range-separator="~" style="width:100%;" @change="formCopy.dateType=null" />
      </InputLabel>
      <div class="d-flex justify-content-end mb-1">
        <el-radio-group v-model="formCopy.dateType" @change="formCopy.RecordDate=null">
          <el-radio :label="1">三個月內</el-radio>
          <el-radio :label="2">半年內</el-radio>
          <el-radio :label="3">一年內</el-radio>
        </el-radio-group>
      </div>
      <InputLabel title="卷冊" class="mb-1">
        <el-input v-model="formCopy.Volume"></el-input>
      </InputLabel>
      <InputLabel title="病歷夾" class="mb-1">
        <el-select v-model="formCopy.FolderId" style="width:100%;" multiple>
          <el-option v-for="(item,index) in $store.state.medicalRecordList" :key="index" :value="item.Id" :label="item.fullName"></el-option>
        </el-select>
      </InputLabel>
      <InputLabel title="文件類別" class="mb-1">
        <el-select v-model="formCopy.DocCategoryId" style="width:100%;" multiple>
          <el-option v-for="(item,index) in $store.state.categoryList" :key="index" :value="item.Id" :label="item.fullName"></el-option>
        </el-select>
      </InputLabel>
    </el-form>
    <div class="d-flex justify-content-end mb-1">
      <Button class="buttonColor-5 mr-1" @click="showDialog=!showDialog">編輯查詢條件</Button>
      <Button class="buttonColor-2 mr-1" @click="clear">清空</Button>
      <Button class="buttonColor-1" @click="getData">查詢</Button>
    </div>
    <div class="FileCheckSearchBarTitle mb-1">查詢條件：</div>
    <el-card shadow="never">
      <div class="d-flex flex-wrap">
        <Button class="buttonColor-8 mr-1 mb-1" v-for="(item,index) in $store.state.quickSearchList" :key="index" @click="quickSearch(item)">{{item.Name}}</Button>
      </div>
      <el-card shadow="never">
        <el-tabs type="card" v-model="tabKey">
          <el-tab-pane label="病歷夾" name="1">
            <el-tree node-key="Id" ref="tree1" :expand-on-click-node="false" :data="medicalRecordListTree" :props="defaultProps" default-expand-all highlight-current check-strictly show-checkbox @check="checkChange(1)"></el-tree>
          </el-tab-pane>
          <el-tab-pane label="文件類別" name="2">
            <el-tree node-key="Id" ref="tree2" :expand-on-click-node="false" :data="categoryListTree" :props="defaultProps" default-expand-all highlight-current check-strictly show-checkbox @check="checkChange(2)"></el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import QuickSearchBox from './QuickSearchBox.vue'

export default {
  components: {QuickSearchBox},
  data() {
    return {
      showDialog:false,
      tabKey:'1',
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      form: {
        PatientId:null,
        FolderId:[],
        DocCategoryId:[],
        Volume:null,
        RecordDate:null,
        dateType:null,
        Identifier:null
      },
      formCopy: null
    }
  },
  computed: {
    medicalRecordListTree() {
      return this.$global.arrToTree(this.$store.state.medicalRecordList)
    },
    categoryListTree() {
      return this.$global.arrToTree(this.$store.state.categoryList)
    },
  },
  async created() {
    //this.$store.commit('loading',true)
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    //this.medicalRecordList=await this.$api.getFolder().then(res=>res.Items)
    //this.categoryList=await this.$api.getDocCategory().then(res=>res.Items)
    await this.getData()
    //this.$store.commit('loading',false)
  },
  methods: {
    async getData() {
      this.$emit('getData',this.formCopy)
    },
    clear() {
      this.formCopy=JSON.parse(JSON.stringify(this.form))
      this.$refs.tree1.setCheckedKeys([])
      this.$refs.tree2.setCheckedKeys([])
      this.$emit('getData',this.formCopy)
    },
    quickSearch(x) {
      let data=JSON.parse(JSON.stringify(x))
      data.DocCategoryId=data.QsearchCategories.map(r=>r.CategoryId)
      data.FolderId=data.QsearchFolders.map(r=>r.FolderId)
      data.dateType=data.DateRange
      this.$refs.tree1.setCheckedKeys(data.FolderId)
      this.$refs.tree2.setCheckedKeys(data.DocCategoryId)
      this.formCopy=data
      this.$emit('getData',this.formCopy)
    },
    checkChange(x) {
      if(x===1) {
        this.formCopy.FolderId=this.$refs.tree1.getCheckedKeys()
      }
      else {
        this.formCopy.DocCategoryId=this.$refs.tree2.getCheckedKeys()
      }
      this.$emit('getData',this.formCopy)
    }
  }
}
</script>