<template>
  <div class="SystemAccount">
    <div class="searchBar">
      <el-form label-position="left" label-width="120px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="使用者帳號">
              <el-input v-model="tableDataFormCopy.AccountNo"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="使用者姓名">
              <el-input v-model="tableDataFormCopy.AccountName"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="紀錄類型">
              <el-select v-model="tableDataFormCopy.Type" style="width: 100%;">
                <el-option v-for="item in typeList" :key="item.value" :label="item.Name" :value="item.Id"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="執行動作">
              <el-input v-model="tableDataFormCopy.ProcessStack"></el-input>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2" @click="clear">清除</Button>
      </div>
    </div>
    <div class="contentBox" v-if="tableData">
      <el-table ref="table" :data="tableData.Items" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" border class="mb-1" style="width: 100%" @sort-change="sortChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <div style="padding: 10px;">{{scope.row.Data}}</div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="建立時間" sortable>
          <template slot-scope="scope">
            {{$global.YYYYMMDDHHmm(scope.row.CreateTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="AccountNo" label="使用者帳號" sortable></el-table-column>
        <el-table-column prop="AccountName" label="姓名" sortable></el-table-column>
        <el-table-column prop="Type" label="紀錄類型" sortable>
          <template slot-scope="scope">
            {{typeListObj[scope.row.Type].Name}}
          </template>
        </el-table-column>
        <el-table-column prop="DataType" label="資料類別" sortable></el-table-column>
        <el-table-column prop="HostAddress" label="用戶端IP" sortable></el-table-column>
        <el-table-column prop="ProcessStack" label="執行動作" sortable></el-table-column>
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
      typeList:[],
      tableData:null,
      tableDataForm: {
        AccountNo:null,
        AccountName:null,
        Type:null,
        ProcessStack:null,
        sortKey:'CreateTime',
        sortOrder:'descending',
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
    }
  },
  async created() {
    this.$store.commit('loading',true)
    this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
    this.typeList=await this.$api.getAuditEventTypes()
    await this.getData()
    this.$store.commit('loading',false)
  },
  computed: {
    typeListObj() {
      return this.$global.arrToObj(this.typeList,'Id')
    }
  },
  methods: {
    async getData() {
      let filter=[]
      if(this.tableDataFormCopy.AccountNo) filter.push(`contains(AccountNo,'${this.tableDataFormCopy.AccountNo}')`)
      if(this.tableDataFormCopy.AccountName) filter.push(`contains(Account/Name,'${this.tableDataFormCopy.AccountName}')`)
      if(this.tableDataFormCopy.Type) filter.push(`Type eq ${this.tableDataFormCopy.Type}`)
      if(this.tableDataFormCopy.ProcessStack) filter.push(`contains(ProcessStack,'${this.tableDataFormCopy.ProcessStack}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getAuditEvent(data)
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