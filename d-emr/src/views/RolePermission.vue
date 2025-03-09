<template>
  <div class="BasicInfo">

    <Dialog v-model="showDialogSys" :title="'操作內容'" :width="'40vw'">
      <div>
        設定內容
      </div>
      <NewFeaturesList :list="featuresList" :role="settingNo" />
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialogSys=!showDialogSys">關閉</Button>
      </div>
    </Dialog>

    <Dialog v-model="showDialog" :title="isAdd ? '新增角色':'編輯角色'" :width="'40vw'">
      <el-form ref="postform" label-position="left" :model="formCopy" :rules="rules" label-width="120px" @keyup.enter.native="sub">
        <InputLabel class="mb-1" title="角色代碼" prop="No">
          <el-input v-model="formCopy.No" :disabled="!isAdd" />
        </InputLabel>
        <InputLabel class="mb-1" title="角色名稱" prop="Name">
          <el-input v-model="formCopy.Name" />
        </InputLabel>
        <InputLabel class="mb-1" title="啟用狀態">
          <el-radio-group class="ml-1" v-model="formCopy.IsActivated">
            <el-radio :label="true">啟用</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立角色</Button>
      </div>
    </Dialog>

    <CardBox class="mb-1" title="角色權限管理維護作業">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="啟用狀態">
              <el-radio-group class="ml-1" v-model="tableDataFormCopy.IsActivated">
                <el-radio :label="true">啟用</el-radio>
                <el-radio :label="false">停用</el-radio>
              </el-radio-group>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="角色代碼">
              <el-input v-model="tableDataFormCopy.No" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="角色名稱">
              <el-input v-model="tableDataFormCopy.Name" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="add">新增角色</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table ref="table" class="mb-1" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" :data="tableData.Items" border stripe style="width: 100%" @sort-change="sortChange">
        <!-- <el-table-column type="expand">
          <template slot-scope="scope">
            <NewFeaturesList :list="featuresList" :role="scope.row.No" />
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <Button class="buttonColor-4 mr-1" @click="setting(scope.row.No)">設定</Button>
            <Button class="buttonColor-3 mr-1" @click="edit(scope.row)">編輯</Button>
            <Button class="buttonColor-2" @click="del(scope.row)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="No" label="角色代碼" sortable="custom"></el-table-column>
        <el-table-column prop="Name" label="角色名稱" sortable="custom"></el-table-column>
        <el-table-column prop="IsActivated" label="啟用狀態" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsActivated" @change="changeActive(scope.row)" />
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
import NewFeaturesList from '@/components/NewFeaturesList.vue'

export default {
  components: {NewFeaturesList},
  data() {
    return {
      showDialog:false,
      showDialogSys:false,
      isAdd:true,
      tableData: null,
      featuresList: null,
      tableDataForm: {
        No:'',
        Name:'',
        IsActivated:'',
        sortKey:'No',
        sortOrder:null,
        page:1,
        limit:10,
      },
      tableDataFormCopy: null,
      form: {
        No:'',
        Name:'',
        IsActivated:true,
      },
      formCopy: null,
      rules: {
        No: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Name: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      },
      settingNo: null,
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
      if(this.tableDataFormCopy.IsActivated!=='') filter.push(`IsActivated eq ${this.tableDataFormCopy.IsActivated}`)
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
      this.$store.commit('roleList',await this.$api.getRole().then(res=>res.Items))
      this.featuresList=await this.$api.getFunction().then(res=>res.Items)
      this.$store.commit('loading',false)
    },
    async changeActive(x) {
      this.$store.commit('loading',true)
      await this.$api.putRole(x)
      await this.getData()
      this.$message.success('狀態更改成功')
      this.$store.commit('loading',false)
    },
    add() {
      this.formCopy=JSON.parse(JSON.stringify(this.form))
      this.isAdd=true
      this.showDialog=true
    },
    setting(x) {
      this.settingNo = x
      this.showDialogSys=true
    },
    edit(x) {
      this.formCopy=JSON.parse(JSON.stringify(x))
      this.isAdd=false
      this.showDialog=true
    },
    async del(x) {
      if(!confirm('確定刪除?')) return false
      this.$store.commit('loading',true)
      await this.$api.delRole(x.No)
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
          if(this.isAdd) await this.$api.postRole(this.formCopy)
          else await this.$api.putRole(this.formCopy)
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