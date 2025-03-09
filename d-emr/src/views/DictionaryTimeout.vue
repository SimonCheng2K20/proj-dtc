<template>
  <div class="BasicInfo">
    <Dialog v-model="showDialog" :title="isAdd ? '新增逾時原因':'編輯逾時原因'" :width="'40vw'">
      <el-form ref="postform" label-position="left" :model="formCopy" :rules="rules" label-width="140px" @keyup.enter.native="sub">
        <InputLabel class="mb-1" title="逾時原因代碼" prop="ReasonId">
          <el-input v-model="formCopy.ReasonId" />
        </InputLabel>
        <InputLabel class="mb-1" title="逾時原因" prop="ReasonDesc">
          <el-input v-model="formCopy.ReasonDesc" />
        </InputLabel>
        <InputLabel class="mb-1" title="排列順序" prop="OrderSeq">
          <el-input-number v-model="formCopy.OrderSeq" :min="1" style="width:100%;"></el-input-number>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <CardBox class="mb-1" title="逾時原因設定">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="逾時原因">
              <el-input v-model="tableDataFormCopy.ReasonDesc" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="排列順序">
              <el-input v-model="tableDataFormCopy.OrderSeq" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="add">新增逾時原因</Button>
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
        <el-table-column prop="ReasonDesc" label="逾時原因" sortable="custom"></el-table-column>
        <el-table-column prop="OrderSeq" label="排列順序" sortable="custom"></el-table-column>
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
        ReasonDesc:'',
        OrderSeq:'',
        sortKey:'ReasonDesc',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        Oid:'',
        ReasonId:'',
        ReasonDesc:'',
        OrderSeq:'',
      },
      formCopy: null,
      rules: {
        ReasonId: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        ReasonDesc: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        OrderSeq: [
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
      if(this.tableDataFormCopy.OrderSeq) filter.push(`OrderSeq eq '${this.tableDataFormCopy.OrderSeq}'`)
      if(this.tableDataFormCopy.ReasonDesc) filter.push(`contains(ReasonDesc,'${this.tableDataFormCopy.ReasonDesc}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getOverTimeReason(data)
      this.$store.commit('overTimeReason',await this.$api.getOverTimeReason().then(res=>res.Items))
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
      await this.$api.delOverTimeReason(x.Oid)
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
          if(this.isAdd) await this.$api.postOverTimeReason(this.formCopy)
          else await this.$api.putOverTimeReason(this.formCopy)
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