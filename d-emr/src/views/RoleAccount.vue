<template>
  <div class="BasicInfo">
    <Dialog v-model="showDialog" :title="isAdd ? '新增帳號':'編輯帳號'" :width="'40vw'">
      <el-form ref="postform" label-position="left" :model="formCopy" :rules="rules" label-width="120px" @keyup.enter.native="sub">
        <el-row :gutter="10">
          <el-col :md="12">
            <CardBox class="mb-1" title="帳號資料">
              <InputLabel class="mb-1" title="使用者帳號" prop="No">
                <el-input v-model="formCopy.No" :disabled="!isAdd" />
              </InputLabel>
              <InputLabel class="mb-1" title="院內代碼">
                <el-input v-model="formCopy.EmpNo" />
              </InputLabel>
              <InputLabel class="mb-1" title="帳號姓名" prop="Name">
                <el-input v-model="formCopy.Name" />
              </InputLabel>
              <InputLabel class="mb-1" title="連絡電話">
                <el-input v-model="formCopy.Phone" />
              </InputLabel>
              <InputLabel class="mb-1" title="E-MAIL">
                <el-input v-model="formCopy.Email" />
              </InputLabel>
              <InputLabel class="mb-1" title="帳號狀態" prop="Status">
                <el-select v-model="formCopy.Status" style="width:100%;">
                  <el-option v-for="item in $store.state.statusList" :key="item.Id" :label="item.Name"   :value="item.Id"></el-option>
                </el-select>
              </InputLabel>
              <InputLabel class="mb-1" title="身分證字號" prop="Identifier">
                <el-input v-model="formCopy.Identifier" />
              </InputLabel>
              <InputLabel class="mb-1" title="到期日">
                <el-date-picker v-model="formCopy.Expiration" type="date"></el-date-picker>
              </InputLabel>
            </CardBox>
          </el-col>
          <el-col :md="12">
            <CardBox class="mb-1" title="授權角色">
              <el-tree ref="tree" default-expand-all :data="updateRoleList" :props="{label:'Name'}" show-checkbox node-key="No" check-strictly @check="checkRoleList">
              </el-tree>
            </CardBox>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <CardBox class="mb-1" title="帳號管理維護作業">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="110px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="帳號狀態">
              <el-select v-model="tableDataFormCopy.Status" style="width:100%;">
                <el-option v-for="item in $store.state.statusList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="系統角色">
              <el-select v-model="tableDataFormCopy.RoleNos" style="width:100%;">
                <el-option v-for="item in $store.state.roleList" :key="item.No" :label="item.Name" :value="item.No"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="使用者帳號">
              <el-input v-model="tableDataFormCopy.No" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="帳號姓名">
              <el-input v-model="tableDataFormCopy.Name" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="add">新增帳號</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table ref="table" class="mb-1" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" :data="tableData.Items" border stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <Button class="buttonColor-4 mr-1" @click="reset(scope.row)">重置密碼</Button>
            <Button class="buttonColor-3 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-2" @click="del(scope.row)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="No" label="使用者帳號" sortable="custom"></el-table-column>
        <el-table-column prop="Name" label="帳號姓名" sortable="custom"></el-table-column>
        <el-table-column prop="RoleNos" label="系統角色" sortable="custom">
          <template slot-scope="scope">
            {{scope.row.RoleNos.map(res=>$store.getters.roleListObj[res].Name).join('、')}}
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="帳號狀態" sortable="custom">
          <template slot-scope="scope">
            {{scope.row.Status ? $store.getters.statusListObj[scope.row.Status].Name : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="Phone" label="連絡電話" sortable="custom"></el-table-column>
        <el-table-column prop="Email" label="E-MAIL" sortable="custom"></el-table-column>
        <el-table-column prop="Expiration" label="到期日" sortable="custom"></el-table-column>
        <el-table-column prop="Identifier" label="身分證字號" sortable="custom"></el-table-column>
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
        No:'',
        Name:'',
        Status:'',
        RoleNos:'',
        sortKey:'No',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        No:'',
        EmpNo:'',
        Name:'',
        Phone:'',
        Email:'',
        Expiration:'',
        Status:'',
        Identifier:'',
        RoleNos:[],
      },
      formCopy: null,
      rules: {
        No: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Name: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Status: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Identifier: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      },
      updateRoleList: null,
    }
  },
  async created() {
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    this.tableDataFormCopy=JSON.parse(JSON.stringify(this.tableDataForm))
    await this.getData()

    if(this.$store.state.roleList && this.$store.state.roleList.length){
      // console.log(`this.$store.state.roleList: `, this.$store.state.roleList)
      this.updateRoleList = this.$store.state.roleList.filter((v)=>{
        return v.IsActivated === true
      })
    } 

  },
  methods: {
    async getData() {
      let filter=[]
      if(this.tableDataFormCopy.Status!=='') filter.push(`Status eq ${this.tableDataFormCopy.Status}`)
      if(this.tableDataFormCopy.No) filter.push(`contains(No,'${this.tableDataFormCopy.No}')`)
      if(this.tableDataFormCopy.Name) filter.push(`contains(Name,'${this.tableDataFormCopy.Name}')`)
      if(this.tableDataFormCopy.RoleNos) filter.push(`Roles/any(d:d/No eq '${this.tableDataFormCopy.RoleNos}')`)
      filter=filter.length ? filter.join(' and ') : null
      
      let data= {
        $filter:filter,
        $orderby:this.$global.toODataOrder(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder),
        $top:this.tableDataFormCopy.limit,
        $skip:this.tableDataFormCopy.limit*(this.tableDataFormCopy.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getAccountAllList(data)
      this.$store.commit('loading',false)
    },
    async changeActive(x) {
      this.$store.commit('loading',true)
      await this.$api.putAccount(x)
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
      this.$nextTick(()=> {
        this.$refs.tree.setCheckedKeys(this.formCopy.RoleNos)
      })
    },
    async del(x) {
      if(!confirm('確定刪除?')) return false
      this.$store.commit('loading',true)
      await this.$api.delAccount(x.No)
      await this.getData()
      this.$store.commit('loading',false)
      this.$message.success('刪除成功')
    },
    async reset(x) {
      if(!confirm('是否確定要重置密碼? 密碼將重置為使用者帳號')) return false
      this.$store.commit('loading',true)
      let data= {
        userName:x.No,
        newPermit:x.No
      }
      await this.$api.resetPassword(data)
      this.$message.success('密碼重置成功')
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
    checkRoleList() {
      let list=this.$refs.tree.getCheckedKeys()
      this.formCopy.RoleNos=list
    },
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          if(this.isAdd) await this.$api.postAccount(this.formCopy)
          else await this.$api.putAccount(this.formCopy)
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