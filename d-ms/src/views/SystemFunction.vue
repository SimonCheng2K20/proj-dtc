<template>
  <div class="SystemAccount">
    <Dialog v-model="showDialog" :title="isAdd ? '新增功能':'修改功能'">
        <el-form ref="postform" label-position="left" label-width="120px" :model="formCopy" :rules="rules">
          <InputLabel class="mb-1" title="功能代碼" prop="No">
            <el-input v-model="formCopy.No" :disabled="!isAdd" />
          </InputLabel>
          <InputLabel class="mb-1" title="功能名稱" prop="Name">
            <el-input v-model="formCopy.Name" />
          </InputLabel>
          <InputLabel class="mb-1" title="啟用否">
            <el-radio-group class="ml-1" v-model="formCopy.IsActivated">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </InputLabel>
        </el-form>
        <div class="d-flex justify-content-end">
          <Button class="buttonColor-2 mr-1" @click="showDialog=!showDialog">取消</Button>
          <Button class="buttonColor-1" @click="sub">建立</Button>
        </div>
    </Dialog>
    <div class="searchBar">
      <el-form label-position="left" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="功能代碼">
              <el-input v-model="tableDataFormCopy.No"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="功能名稱">
              <el-input v-model="tableDataFormCopy.Name"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="5">
            <InputLabel class="mb-1" title="啟用否">
              <el-radio-group class="ml-1" v-model="tableDataFormCopy.IsActivated">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-3" @click="add">新增功能</Button>
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
        <el-table-column prop="No" label="功能代碼" sortable></el-table-column>
        <el-table-column prop="Name" label="功能名稱" sortable></el-table-column>
        <el-table-column prop="IsActivated" label="啟用否" sortable width="100px">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.IsActivated" />
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
export default {
  data() {
    return {
      showDialog:false,
      isAdd:false,
      tableData:null,
      tableDataForm: {
        No:null,
        Name:null,
        IsActivated:null,
        sortKey:'No',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy:null,
      form: {
        No: null,
        Name: null,
        Seq: 0,
        IsActivated: true,
        Type: 0,
        TypeName: null
      },
      formCopy:null,
      rules: {
        No: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Name: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
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
      if(this.tableDataFormCopy.IsActivated!==null) filter.push(`IsActivated eq ${this.tableDataFormCopy.IsActivated}`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getFunction(data)
      this.$store.commit('functionList',await this.$api.getFunction().then(res=>res.Items))
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
      await this.$api.delFunction(x)
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
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          if(this.isAdd) await this.$api.postFunction(this.formCopy)
          else await this.$api.putFunction(this.formCopy)
          await this.getData()
          this.$message.success(this.isAdd ? '新增成功':'修改成功')
          this.showDialog=false
          this.$store.commit('loading',false)
        }
      })
    }
  }
}
</script>