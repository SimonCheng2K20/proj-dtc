<template>
  <div class="BasicInfo">
    <CardBox class="mb-1" title="稽核紀錄管理">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="110px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="使用者帳號">
              <el-input v-model="tableDataFormCopy.AccountNo" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="帳號姓名">
              <el-input v-model="tableDataFormCopy.AccountName" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="紀錄類型">
              <el-select v-model="tableDataFormCopy.Type" style="width:100%;">
                <el-option v-for="item in $store.state.typeList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="用戶端IP">
              <el-input v-model="tableDataFormCopy.HostAddress" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="建立時間">
              <el-date-picker type="daterange" range-separator="~" v-model="tableDataFormCopy.CreateTime" value-format="yyyy-MM-dd" style="width:100%;" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10" @click="clean">清除</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table ref="table" class="mb-1" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" :data="tableData.Items" border stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div style="padding: 10px 20px;">{{scope.row.Data}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="建立時間" sortable="custom">
          <template slot-scope="scope">
            {{$global.YYYYMMDDHHmm(scope.row.CreateTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="AccountNo" label="使用者帳號" sortable="custom"></el-table-column>
        <el-table-column prop="AccountName" label="帳號姓名"></el-table-column>
        <el-table-column prop="Type" label="紀錄類型" sortable="custom">
          <template slot-scope="scope">
            {{$store.getters.typeListObj[scope.row.Type].Name}}
          </template>
        </el-table-column>
        <el-table-column prop="DataType" label="資料類別" sortable="custom"></el-table-column>
        <el-table-column prop="HostAddress" label="用戶端IP" sortable="custom"></el-table-column>
        <el-table-column prop="ProcessStack" label="執行動作" sortable="custom"></el-table-column>
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
        AccountNo:'',
        AccountName:'',
        CreateTime:'',
        Type:'',
        HostAddress:'',
        sortKey:'CreateTime',
        sortOrder:'descending',
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
        LendingClassOid: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
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
      if(this.tableDataFormCopy.Type) filter.push(`Type eq ${this.tableDataFormCopy.Type}`)
      if(this.tableDataFormCopy.AccountNo) filter.push(`contains(AccountNo,'${this.tableDataFormCopy.AccountNo}')`)
      //if(this.tableDataFormCopy.AccountName) filter.push(`contains(AccountName,'${this.tableDataFormCopy.AccountName}')`)
      if(this.tableDataFormCopy.HostAddress) filter.push(`contains(HostAddress,'${this.tableDataFormCopy.HostAddress}')`)
      if(this.tableDataFormCopy.CreateTime) {
        if(this.tableDataFormCopy.CreateTime[0]) {
          filter.push(`CreateTime gt ${this.tableDataFormCopy.CreateTime[0]}T00:00:00Z`)
        }
        if(this.tableDataFormCopy.CreateTime[1]) {
          filter.push(`CreateTime lt ${this.tableDataFormCopy.CreateTime[1]}T23:59:59Z`)
        }
      }
      filter=filter.length ? filter.join(' and ') : null

      let tempSortKey = this.tableDataFormCopy.sortKey
      // if(this.tableDataFormCopy.sortKey === 'AccountName'){
      //   console.log(`error: `, this.tableDataFormCopy.sortKey)
      //   tempSortKey = 'Name'
      // }

      let data= {
        accountName:this.tableDataFormCopy.AccountName ? this.tableDataFormCopy.AccountName:null,
        $filter:filter,
        $orderby:this.$global.toODataOrder(
          tempSortKey,
          this.tableDataFormCopy.sortOrder
        ),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getAuditEvent(data)
      this.$store.commit('loading',false)
    },
    async changeActive(x) {
      this.$store.commit('loading',true)
      await this.$api.putLendingClass(x)
      await this.getData()
      this.$message.success('狀態更改成功')
      this.$store.commit('loading',false)
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