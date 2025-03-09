<template>
  <div class="BasicInfo">
    <Dialog v-model="showDialog" :title="isAdd ? '新增借閱原因':'編輯借閱原因'" :width="'40vw'">
      <el-form ref="postform" label-position="left" :model="formCopy" :rules="rules" label-width="140px" @keyup.enter.native="sub">
        <InputLabel class="mb-1" title="借閱原因代碼" prop="LendingClassId">
          <el-input v-model="formCopy.LendingClassId" />
        </InputLabel>
        <InputLabel class="mb-1" title="借閱天數">
          <el-input-number v-model="formCopy.DefaultLeadingDay" :min="1" style="width:100%;"></el-input-number>
        </InputLabel>
        <InputLabel class="mb-1" title="說明">
          <el-input v-model="formCopy.LendingClassDesc" />
        </InputLabel>
        <InputLabel class="mb-1" title="啟用狀態">
          <el-radio-group class="ml-1" v-model="formCopy.IsActive">
            <el-radio label="Y">啟用</el-radio>
            <el-radio label="N">停用</el-radio>
          </el-radio-group>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <CardBox class="mb-1" title="借閱原因設定">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="啟用狀態">
              <el-radio-group class="ml-1" v-model="tableDataFormCopy.IsActive">
                <el-radio label="Y">啟用</el-radio>
                <el-radio label="N">停用</el-radio>
              </el-radio-group>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="借閱原因">
              <el-input v-model="tableDataFormCopy.LendingClassId" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="說明">
              <el-input v-model="tableDataFormCopy.LendingClassDesc" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="add">新增借閱原因</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table ref="table" class="mb-1" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" :data="tableData.Items" border stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <Button class="buttonColor-3 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-2" @click="del(scope.row)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="LendingClassId" label="借閱原因" sortable="custom"></el-table-column>
        <el-table-column prop="DefaultLeadingDay" label="借閱天數" sortable="custom"></el-table-column>
        <el-table-column prop="LendingClassDesc" label="說明" sortable="custom"></el-table-column>
        <el-table-column prop="IsActive" label="啟用狀態" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsActive" true-label="Y" false-label="N" @change="changeActive(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="d-flex justify-content-center" background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableDataFormCopy.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataFormCopy.limit"
        layout="prev, pager, next, sizes, total"
        :total="tableData.Count" />
    </CardBox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog:false,
      isAdd:true,
      tableData: null,
      tableDataForm: {
        LendingClassId:'',
        LendingClassDesc:'',
        IsActive:'',
        sortKey:'LendingClassId',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        LendingClassOid:'',
        LendingClassId:'',
        LendingClassDesc:'',
        DefaultLeadingDay:1,
        IsActive:'Y'
      },
      formCopy: null,
      rules: {
        LendingClassId: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
    await this.getData()
  },
  methods: {
    async getData() {
      let filter=[]
      if(this.tableDataFormCopy.IsActive) filter.push(`IsActive eq '${this.tableDataFormCopy.IsActive}'`)
      if(this.tableDataFormCopy.LendingClassId) filter.push(`contains(LendingClassId,'${this.tableDataFormCopy.LendingClassId}')`)
      if(this.tableDataFormCopy.LendingClassDesc) filter.push(`contains(LendingClassDesc,'${this.tableDataFormCopy.LendingClassDesc}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getLendingClass(data)
      this.$store.commit('lendingClass',await this.$api.getLendingClass().then(res=>res.Items))
      this.$store.commit('loading',false)
    },
    async changeActive(x) {
      this.$store.commit('loading',true)
      await this.$api.putLendingClass(x)
      await this.getData()
      this.$message.success('狀態更改成功')
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
      if(!confirm('確定刪除?')) return false
      this.$store.commit('loading',true)
      await this.$api.delLendingClass(x.LendingClassOid)
      await this.getData()
      this.$store.commit('loading',false)
      this.$message.success('刪除成功')
    },
    async clean() {
      this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
      this.$refs.table.sort(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder)
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.page=1
      this.tableDataFormCopy.limit=x
      await this.getData()
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page=x
      await this.getData()
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
          if(this.isAdd) await this.$api.postLendingClass(this.formCopy)
          else await this.$api.putLendingClass(this.formCopy)
          await this.getData()
          this.showDialog=false
          this.$store.commit('loading',false)
          this.$message.success(this.isAdd ? '新增成功':'編輯成功')
        }
      })
    }
  }
}
</script>