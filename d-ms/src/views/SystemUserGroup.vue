<template>
  <div class="SystemAccount">
    <Dialog :title="isAdd ? '新增群組':'編輯群組'" v-model="showDialog">
      <UserGroupAddBox :data="formCopy" :isAdd="isAdd" @addComplete="showDialog=!showDialog;getData()" @close="showDialog=!showDialog" />
    </Dialog>
    <div class="searchBar">
      <el-form label-position="left" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="群組代號">
              <el-input v-model="tableDataFormCopy.No"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="群組名稱">
              <el-input v-model="tableDataFormCopy.Name"></el-input>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-3" @click="add">新增群組</Button>
      </div>
    </div>
    <div class="contentBox" v-if="tableData">
      <el-table ref="table" :data="tableData.Items" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" border class="mb-1" style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="date" label="操作" width="160">
          <template slot-scope="scope">
            <Button class="buttonColor-5 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-6" @click="del(scope.row.No)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="No" label="代號" sortable></el-table-column>
        <el-table-column prop="Name" label="群組名稱" sortable></el-table-column>
        <el-table-column prop="IsActivated" label="啟用" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsActivated" />
          </template>
        </el-table-column>
        <el-table-column prop="IsBrowse" label="文件權限可瀏覽" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsBrowse" />
          </template>
        </el-table-column>
        <el-table-column prop="IsModify" label="文件權限可修改" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsModify" />
          </template>
        </el-table-column>
        <el-table-column prop="IsPrint" label="文件權限可列印" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsPrint" />
          </template>
        </el-table-column>
        <el-table-column prop="IsEmail" label="文件權限可Email" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsEmail" />
          </template>
        </el-table-column>
        <el-table-column prop="IsDocCategory" label="篩選文件類別" sortable>
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsDocCategory" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="d-flex justify-content-center" background
        @size-change="getData"
        @current-change="getData"
        :current-page.sync="tableDataFormCopy.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size.sync="tableDataFormCopy.limit"
        layout="prev, pager, next, sizes, total"
        :total="tableData.Count" />
    </div>
  </div>
</template>

<script>
import UserGroupAddBox from '@/components/UserGroupAddBox.vue'
import Dialog from '../components/Dialog.vue'

export default {
  components: { UserGroupAddBox, Dialog },
  data() {
    return {
      showDialog:false,
      isAdd:false,
      tableData:null,
      tableDataForm: {
        No:'',
        Name:'',
        sortKey:'No',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        No: null,
        Name: null,
        IsActivated: true,
        IsBrowse: true,
        IsModify: true,
        IsPrint: true,
        IsEmail: true,
        IsDocCategory: true
      },
      formCopy:null,
    }
  },
  async created() {
    this.$store.commit('loading',true)
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
    await this.getData()
    this.$store.commit('loading',false)
  },
  methods: {
    async getData() {
      let filter=[]
      if(this.tableDataFormCopy.No) filter.push(`contains(No,'${this.tableDataFormCopy.No}')`)
      if(this.tableDataFormCopy.Name) filter.push(`contains(Name,'${this.tableDataFormCopy.Name}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }
      this.$store.commit('loading',true)
      this.tableData=await this.$api.getRole(data)
      this.$store.commit('loading',false)
    },
    add() {
      this.formCopy=JSON.parse(JSON.stringify(this.form))
      this.isAdd=true
      this.showDialog=true
    },
    edit(x) {
      this.formCopy=JSON.parse(JSON.stringify(x))
      this.isAdd=false
      this.showDialog=true
    },
    async del(x) {
      if(!confirm(`確定刪除${x}?`)) return null
      this.$store.commit('loading',true)
      await this.$api.delRole(x)
      await this.getData()
      this.$message.success('刪除成功')
      this.$store.commit('loading',false)
    },
    async clear() {
      this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
      this.$refs.table.sort(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder)
    },
    async sortChange(x) {
      let {order,prop} = x
      this.tableDataFormCopy.sortKey=prop
      this.tableDataFormCopy.sortOrder=order
      await this.getData()
    },
  }
}
</script>