<template>
  <div class="SystemAccount">
    <Dialog v-model="showDialog" :title="isAdd ? '新增病患':'修改病患'">
      <el-form ref="postform" label-position="left" label-width="120px" :model="formCopy" :rules="rules">
        <InputLabel class="mb-1" title="病歷號" prop="PatientId">
          <el-input v-model="formCopy.PatientId" :disabled="!isAdd" />
        </InputLabel>
        <InputLabel class="mb-1" title="姓名" prop="Cname">
          <el-input v-model="formCopy.Cname" />
        </InputLabel>
        <InputLabel class="mb-1" title="身分證號" prop="Identifier">
          <el-input v-model="formCopy.Identifier" />
        </InputLabel>
        <InputLabel class="mb-1" title="性別">
          <el-select v-model="formCopy.Gender" style="width:100%;">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="生日">
          <el-date-picker v-model="formCopy.BirthDate" type="date" value-format="yyyy-MM-dd" style="width:100%;"></el-date-picker>
        </InputLabel>
        <InputLabel class="mb-1" title="病患狀態">
          <el-select v-model="formCopy.Status" style="width:100%;">
            <el-option v-for="(item,index) in patStatus" :key="index" :label="item.Name" :value="item.No"></el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="連絡電話一">
          <el-input v-model="formCopy.MobilePhone" />
        </InputLabel>
        <InputLabel class="mb-1" title="連絡電話二">
          <el-input v-model="formCopy.HomePhone" />
        </InputLabel>
        <InputLabel class="mb-1" title="郵遞區號">
          <el-input v-model="formCopy.PostNo" />
        </InputLabel>
        <InputLabel class="mb-1" title="地址">
          <el-input v-model="formCopy.Address" />
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
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷號">
              <el-input v-model="tableDataFormCopy.PatientId"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="姓名">
              <el-input v-model="tableDataFormCopy.Cname"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="性別">
              <el-select v-model="tableDataFormCopy.Gender" style="width:100%;">
                <el-option label="男" value="male"></el-option>
                <el-option label="女" value="female"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="身分證號">
              <el-input v-model="tableDataFormCopy.Identifier"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="生日">
              <el-date-picker v-model="tableDataFormCopy.BirthDate" type="date" value-format="yyyy-MM-dd" style="width:100%;"></el-date-picker>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-3" @click="add">新增病患</Button>
      </div>
    </div>
    <div class="contentBox" v-if="tableData">
      <el-table ref="table" :data="tableData.Items" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" border class="mb-1" style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="date" label="操作" width="170">
          <template slot-scope="scope">
            <Button class="buttonColor-5 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-6 mr-1" @click="del(scope.row.PatientId)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="PatientId" label="病歷號" sortable></el-table-column>
        <el-table-column prop="Identifier" label="身分證號" sortable></el-table-column>
        <el-table-column prop="Cname" label="姓名" sortable></el-table-column>
        <el-table-column prop="BirthDate" label="生日" sortable></el-table-column>
        <el-table-column prop="GenderName" label="性別" sortable></el-table-column>
        <el-table-column prop="StatusName" label="病患狀態" sortable></el-table-column>
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
      patStatus:[],
      tableData:null,
      tableDataForm: {
        PatientId:null,
        Cname:null,
        Gender:null,
        Identifier:null,
        BirthDate:null,
        sortKey:'PatientId',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        PatientId: null,
        Cname: null,
        Ename: null,
        Identifier: null,
        BirthDate: null,
        Gender: null,
        HomePhone: null,
        MobilePhone: null,
        PostNo: null,
        Address: null,
        OfficePhone: null,
        Status: null,
        Institution: null,
        Secret: 1,
        FolderId: 1
      },
      formCopy:null,
      roleList:[],
      rules: {
        PatientId: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Cname: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Identifier: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
    this.$store.commit('loading',true)
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
    this.patStatus=await this.$api.getPatStatus()
    await this.getData()
    this.$store.commit('loading',false)
  },
  methods: {
    async getData() {
      let filter=[]
      if(this.tableDataFormCopy.PatientId) filter.push(`contains(PatientId,'${this.tableDataFormCopy.PatientId}')`)
      if(this.tableDataFormCopy.Cname) filter.push(`contains(Cname,'${this.tableDataFormCopy.Cname}')`)
      if(this.tableDataFormCopy.Gender) filter.push(`Gender eq '${this.tableDataFormCopy.Gender}'`)
      if(this.tableDataFormCopy.Identifier) filter.push(`contains(Identifier,'${this.tableDataFormCopy.Identifier}')`)
      if(this.tableDataFormCopy.BirthDate) filter.push(`contains(BirthDate,'${this.tableDataFormCopy.BirthDate}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getPatient(data)
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
      await this.$api.delPatient(x)
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
          if(this.isAdd) await this.$api.postPatient(this.formCopy)
          else await this.$api.putPatient(this.formCopy)
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