<template>
  <div class="SystemAccount">
    <Dialog v-model="showDialog" :title="isAdd ? '新增帳號':'修改帳號'" width="50vw">
      <el-row :gutter="10">
        <el-col :md="12">
          <CardBox title="帳號資料" class="cardBoxColor2">
            <el-form ref="postform" label-position="left" label-width="100px" :model="formCopy" :rules="rules">
              <InputLabel class="mb-1" title="帳號" prop="No">
                <el-input v-model="formCopy.No" :disabled="!isAdd" />
              </InputLabel>
              <InputLabel class="mb-1" title="姓名" prop="Name">
                <el-input v-model="formCopy.Name" />
              </InputLabel>
              <InputLabel class="mb-1" title="身分證號">
                <el-input v-model="formCopy.Identifier" />
              </InputLabel>
              <InputLabel class="mb-1" title="電話">
                <el-input v-model="formCopy.Phone" />
              </InputLabel>
              <InputLabel class="mb-1" title="Email">
                <el-input v-model="formCopy.Email" />
              </InputLabel>
              <InputLabel class="mb-1" title="狀態">
                <el-select v-model="formCopy.Status" style="width:100%;">
                  <el-option v-for="item in $store.state.statusList" :key="item.value" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
              </InputLabel>
            </el-form>
          </CardBox>
        </el-col>
        <el-col :md="12">
          <CardBox title="授權角色" class="cardBoxColor2">
            <el-checkbox-group v-model="formCopy.RoleNos">
              <div v-for="(item,index) in roleList" :key="index" class="mb-1">
                <el-checkbox :label="item.No"><span style="font-size: 16px;">{{item.Name}}</span></el-checkbox>
              </div>
            </el-checkbox-group>
          </CardBox>
        </el-col>
      </el-row>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-2 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <div class="searchBar">
      <el-form label-position="left" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="帳號">
              <el-input v-model="tableDataFormCopy.No" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="姓名">
              <el-input v-model="tableDataFormCopy.Name"></el-input>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-3" @click="add">新增帳號</Button>
      </div>
    </div>
    <div class="contentBox" v-if="tableData">
      <el-table ref="table" :data="tableData.Items" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" border class="mb-1" style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="date" label="操作" width="360">
          <template slot-scope="scope">
            <Button class="buttonColor-4 mr-1" @click="resetPassword(scope.row.No)">重置密碼</Button>
            <Button class="buttonColor-5 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-6 mr-1" @click="del(scope.row.No)">刪除</Button>
            <Button class="buttonColor-7" @click="getAccountUnlock(scope.row.No)">解除鎖定</Button>
          </template>
        </el-table-column>
        <el-table-column prop="No" label="帳號" sortable></el-table-column>
        <el-table-column prop="Name" label="姓名" sortable></el-table-column>
        <el-table-column prop="Identifier" label="身分證號" sortable></el-table-column>
        <el-table-column prop="Email" label="Email" sortable></el-table-column>
        <el-table-column prop="Status" label="帳號狀態" sortable>
          <template slot-scope="scope">
            {{$store.getters.statusListObj[scope.row.Status].Name}}
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
        Phone: null,
        Email: null,
        Expiration: null,
        Status: 100,
        Identifier: null,
        RoleNos: []
      },
      formCopy:null,
      roleList:[],
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
    this.roleList=await this.$api.getRole().then(res=>res.Items)
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
      this.tableData=await this.$api.getAccount(data)
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
      await this.$api.delAccount(x)
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
    async getAccountUnlock(x) {
      this.$store.commit('loading',true)
      await this.$api.getAccountUnlock({account:x})
      await this.getData()
      this.$message.success('帳號解鎖成功')
      this.$store.commit('loading',false)
    },
    async resetPassword(x) {
      this.$store.commit('loading',true)
      await this.$api.resetPassword({account:x})
      await this.getData()
      this.$message.success('密碼重置完成')
      this.$store.commit('loading',false)
    },
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          if(this.isAdd) await this.$api.postAccount(this.formCopy)
          else await this.$api.putAccount(this.formCopy)
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