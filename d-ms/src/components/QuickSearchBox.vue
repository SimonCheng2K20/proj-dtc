<template>
  <div class="quickSearchBox">
    <Dialog :title="isAdd ? '新增自定義查詢':'編輯自定義查詢'" v-model="showDialog">
      <el-form label-position="left" label-width="120px" style="width:40vw;">
        <InputLabel class="mb-1" title="搜索名稱">
          <el-input v-model="formCopy.Name"></el-input>
        </InputLabel>
        <InputLabel class="mb-1" title="備註">
          <el-input v-model="formCopy.Note"></el-input>
        </InputLabel>
        <InputLabel class="mb-1" title="病歷日期">
          <el-radio-group v-model="formCopy.DateRange" class="ml-1">
            <el-radio :label="1">三個月內</el-radio>
            <el-radio :label="2">半年內</el-radio>
            <el-radio :label="3">一年內</el-radio>
          </el-radio-group>
        </InputLabel>
        <InputLabel class="treeBox mb-1" title="病歷夾">
          <el-tree ref="tree1" node-key="Id" :expand-on-click-node="false" :data="medicalRecordListTree" :props="defaultProps" default-expand-all highlight-current show-checkbox check-strictly></el-tree>
        </InputLabel>
        <InputLabel class="treeBox mb-1" title="文件類別">
          <el-tree ref="tree2" node-key="Id" :expand-on-click-node="false" :data="categoryListTree" :props="defaultProps" default-expand-all highlight-current show-checkbox check-strictly></el-tree>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-2 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <div class="d-flex justify-content-end mb-1">
      <Button class="buttonColor-3" @click="add">新增</Button>
    </div>
    <el-table border class="mb-1" :data="$store.state.quickSearchList" style="width: 100%">
      <el-table-column prop="Name" label="搜索名稱" />
      <el-table-column prop="Note" label="備註" />
      <el-table-column prop="CreateDate" label="建立日期">
        <template slot-scope="scope">
          {{$global.YYYYMMDD(scope.row.CreateDate)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <Button class="buttonColor-5 mr-1" @click="edit(scope.row)">編輯</Button>
          <Button class="buttonColor-6" @click="del(scope.row.Id)">刪除</Button>
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-2 mr-1" @click="$emit('close')">關閉</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdd:false,
      showDialog:false,
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      form: {
        Name: null,
        Note: null,
        DateRange: 1,
        Actived: true,
        QsearchFolders: [],
        QsearchCategories: []
      },
      formCopy:null
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
  created() {
    this.formCopy=JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    add() {
      this.isAdd=true
      this.showDialog=!this.showDialog
      this.formCopy=JSON.parse(JSON.stringify(this.form))
    },
    edit(x) {
      this.isAdd=false
      this.showDialog=!this.showDialog
      this.formCopy=JSON.parse(JSON.stringify(x))
      this.$nextTick(()=> {
        if(x.QsearchFolders.length) this.$refs.tree1.setCheckedKeys(x.QsearchFolders.map(r=>r.FolderId))
        if(x.QsearchCategories.length) this.$refs.tree2.setCheckedKeys(x.QsearchCategories.map(r=>r.CategoryId))
      })
    },
    async del(x) {
      this.$store.commit('loading',true)
      await this.$api.delQuickSearch(x)
      this.$store.commit('quickSearchList',await this.$api.getQuickSearch().then(res=>res.Items))
      this.$store.commit('loading',false)
    },
    async sub() {
      this.$store.commit('loading',true)
      this.formCopy.QsearchFolders=this.$refs.tree1.getCheckedKeys().map(r=>{return {FolderId:r}})
      this.formCopy.QsearchCategories=this.$refs.tree2.getCheckedKeys().map(r=>{return {CategoryId:r}})
      if(this.isAdd) await this.$api.postQuickSearch(this.formCopy)
      else await this.$api.putQuickSearch(this.formCopy)
      this.showDialog=!this.showDialog
      this.$store.commit('quickSearchList',await this.$api.getQuickSearch().then(res=>res.Items))
      this.$store.commit('loading',false)
    }
  }
}
</script>