<template>
  <div class="SystemAccount">
    <Dialog title="歸檔" v-model="showDialog">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="歸檔資料" name="1">
          <DataManagerAddBox :isArchive="true" :data="formCopy" @close="showDialog=!showDialog" @addComplete="sub" />
        </el-tab-pane>
        <el-tab-pane label="歸檔文件" name="2">
          <ImgViewBox :type="2" :info="formCopy" @close="showDialog=!showDialog" />
        </el-tab-pane>
      </el-tabs>
    </Dialog>
    <div class="searchBar">
      <el-form label-position="left" label-width="120px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="8">
            <InputLabel class="mb-1" title="掃描日期">
              <el-date-picker v-model="tableDataFormCopy.ScanDate" value-format="yyyy-MM-dd" type="daterange" range-separator="~" style="width:100%;" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="掃描工作站">
              <el-input v-model="tableDataFormCopy.ScanStation"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷號">
              <el-input v-model="tableDataFormCopy.Patientid"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="身分證號">
              <el-input v-model="tableDataFormCopy.Identifier"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="掃描人員">
              <el-input v-model="tableDataFormCopy.ScanEmpId"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="文件類別">
              <el-select v-model="tableDataFormCopy.CategoryId" style="width:100%;">
                <el-option v-for="item in $store.state.categoryList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-2 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-12 mr-1" @click="exportSelectList" :disabled="!chooseList.length">匯出Excel</Button>
        <Button class="buttonColor-6 mr-1" @click="del" :disabled="!chooseList.length">刪除</Button>
      </div>
    </div>
    <div class="contentBox" v-if="tableData">
      <el-table row-key="Id" ref="table" :data="tableData.Items" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" border class="mb-1" style="width: 100%" @sort-change="sortChange" @selection-change="(e)=> chooseList=e">
        <el-table-column type="selection" width="55" reserve-selection></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <Button class="buttonColor-17" @click="archive(scope.row)">歸檔</Button>
          </template>
        </el-table-column>
        <el-table-column prop="PatientId" label="病歷號" sortable></el-table-column>
        <el-table-column prop="Patient.Cname" label="姓名"></el-table-column>
        <el-table-column prop="Patient.Identifier" label="身分證號"></el-table-column>
        <el-table-column prop="DocCategoryName" label="文件類別" sortable></el-table-column>
        <el-table-column prop="ScanDate" label="掃描日期" sortable>
          <template slot-scope="scope">
            {{$global.YYYYMMDD(scope.row.ScanDate)}}
          </template>
        </el-table-column>
        <el-table-column prop="ScanEmpId" label="掃描人員" sortable></el-table-column>
        <el-table-column prop="ScanStation" label="掃描工作站" sortable></el-table-column>
        <el-table-column prop="ScanPages" label="頁數" sortable></el-table-column>
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
import Dialog from '@/components/Dialog.vue'
import DataManagerAddBox from '@/components/DataManagerAddBox.vue'
import ImgViewBox from '@/components/ImgViewBox.vue'

export default {
    data() {
        return {
            showDialog:false,
            chooseList:[],
            activeName:'1',
            tableData: null,
            tableDataForm: {
                ScanDate: "",
                ScanStation: "",
                Patientid: "",
                Identifier: "",
                ScanEmpId: "",
                CategoryId: "",
                sortKey: "Patientid",
                sortOrder: null,
                page: 1,
                limit: 10,
            },
            tableDataFormCopy: null,
            form: {
              Id: 0,
              Patientid: null,
              ScanDate: null,
              DocCategoryId: 1,
              FolderId: 1,
              Volume: 1,
              ScanEmpId: null,
              ScanStation: null,
              ScanPages: 0,
              RecordDate:null,
            },
            formCopy: null,
            rules: {
              Name: [
                { required: true, message: '此為必填欄位', trigger: 'blur' },
              ]
            }
        };
    },
    async created() {
        this.$store.commit("loading", true);
        this.formCopy = JSON.parse(JSON.stringify(this.form));
        this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
        await this.getData();
        this.$store.commit("loading", false);
    },
    methods: {
        async getData() {
            let filter = [];
            if (this.tableDataFormCopy.ScanDate) {
                if (this.tableDataFormCopy.ScanDate[0])
                    filter.push(`ScanDate ge ${this.tableDataFormCopy.ScanDate[0]}`);
                if (this.tableDataFormCopy.ScanDate[1])
                    filter.push(`ScanDate ge ${this.tableDataFormCopy.ScanDate[1]}`);
            }
            if (this.tableDataFormCopy.ScanStation)
                filter.push(`contains(ScanStation,'${this.tableDataFormCopy.ScanStation}')`);
            if (this.tableDataFormCopy.Patientid)
                filter.push(`contains(Patientid,'${this.tableDataFormCopy.Patientid}')`);
            if (this.tableDataFormCopy.Identifier)
                filter.push(`contains(Patient/Identifier,'${this.tableDataFormCopy.Identifier}')`);
            if (this.tableDataFormCopy.ScanEmpId)
                filter.push(`contains(ScanEmpId,'${this.tableDataFormCopy.ScanEmpId}')`);
            if (this.tableDataFormCopy.CategoryId)
                filter.push(`DocCategoryName eq ${this.tableDataFormCopy.CategoryId}`);
            filter = filter.length ? filter.join(" and ") : null;
            let data = {
                $filter: filter,
                $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
                $top: this.tableDataFormCopy.limit,
                $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
            };
            this.$store.commit("loading", true);
            this.tableData = await this.$api.getDocArchive(data);
            this.$store.commit("loading", false);
        },
        async clear() {
            this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
            this.$refs.table.sort(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder);
        },
        async sortChange(x) {
            let { order, prop } = x;
            this.tableDataFormCopy.sortKey = prop;
            this.tableDataFormCopy.sortOrder = order;
            await this.getData();
        },
        async archive(x) {
            this.formCopy = JSON.parse(JSON.stringify(x));
            this.showDialog=!this.showDialog
            /*this.$store.commit("loading", true);
            let data = JSON.parse(JSON.stringify(x));
            delete data.Patient;
            await this.$api.putDocArchive(data);
            await this.getData();
            this.$message.success("歸檔完成");
            this.$store.commit("loading", false);*/
        },
        async sub() {
            this.$store.commit("loading", true);
            await this.getData();
            this.$message.success("歸檔完成");
            this.showDialog=!this.showDialog
            this.$store.commit("loading", false);
        },
        async del() {
          if(!confirm(`確定刪除 ${this.chooseList.length} 筆資料?`)) return 0
          this.$store.commit('loading',true)
          let map=this.chooseList.map(r=> r.Id)
          await this.$api.delDocArchive(map)
          await this.getData()
          this.chooseList=[]
          this.$refs.table.clearSelection()
          this.$store.commit('loading',false)
        },
        async exportSelectList() {
          this.$store.commit('loading',true)
          let map=this.chooseList.map(r=> r.Id)
          let res=await this.$api.getDocArchiveExportSelectList(map)
          window.open(res)
          this.chooseList=[]
          this.$refs.table.clearSelection()
          this.$store.commit('loading',false)
        }
    },
    components: { Dialog,DataManagerAddBox,ImgViewBox }
}
</script>