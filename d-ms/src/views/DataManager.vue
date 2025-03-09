<template>
  <div class="FileCheckSearch">
    <Dialog title="新建上傳" v-model="showDialog">
      <DataManagerAddBox @close="showDialog=!showDialog" @addComplete="addComplete" />
    </Dialog>
    <Dialog title="閱覽" v-model="showImgViewBox">
      <ImgViewBox :type="1" :info="fileBoxData" @close="showImgViewBox=!showImgViewBox" />
    </Dialog>
    <Dialog title="編號" v-model="showFileBoxDialog" width="80vw">
      <FileBox ref="FileBox" :info="fileBoxData" @getData="getData" @close="showFileBoxDialog=!showFileBoxDialog" />
    </Dialog>
    <Dialog title="版次" v-model="showVersionBoxDialog" width="80vw">
      <VersionBox ref="VersionBox" :info="fileBoxData" @close="showVersionBoxDialog=!showVersionBoxDialog" />
    </Dialog>

    <el-row :gutter="10">
      <el-col :lg="6">
        <CardBox title="文件調閱查詢" contentClass="docSearchBox">
          <DataSearchBox ref="dataSearchBox" @getData="getData($event,true)" />
        </CardBox>
      </el-col>
      <el-col :lg="18">
        <CardBox title="文件借閱查詢輸出" contentClass="docSearchBox" v-if="tableData">
          <div class="FileCheckSearchTitle mb-1">
            <div class="FileCheckSearchInfo d-flex d-flex align-items-center">
              已選取：{{chooseList.length}} 筆資料
            </div>
            <div class="FileCheckSearchMenu">
              <Button class="buttonColor-10 ml-1" @click="showDialog=!showDialog">新建上傳</Button>
              <Button class="buttonColor-11 ml-1" v-if="$store.state.userData.showButton.IsPrint">列印</Button>
              <Button class="buttonColor-2 ml-1" v-if="$store.state.userData.showButton.IsEmail">Email</Button>
              <Button class="buttonColor-12 ml-1" :disabled="!chooseList.length" @click="exportSelectList">Excel</Button>
              <Button class="buttonColor-13 ml-1" :disabled="!chooseList.length" @click="exportSelectPDF">PDF</Button>
              <Button class="buttonColor-6 ml-1" :disabled="!chooseList.length" @click="del">刪除</Button>
            </div>
          </div>
          <div class="contentBox">
            <el-table row-key="Id" ref="table" :data="tableData.Items" border :default-sort="{prop:tableDataForm.page.sortKey,order:tableDataForm.page.sortOrder}" class="mb-1" style="width: 100%" @sort-change="sortChange" @selection-change="(e)=> chooseList=e">
              <el-table-column type="selection" width="55" reserve-selection></el-table-column>
              <el-table-column prop="date" label="功能" width="240px">
                <template slot-scope="scope">
                  <Button class="buttonColor-14 ml-1" @click="fileBoxData=scope.row;showImgViewBox=!showImgViewBox">閱覽</Button>
                  <!--<Button class="buttonColor-14 ml-1">索引</Button>-->
                  <Button class="buttonColor-14 ml-1" @click="fileBoxData=scope.row;showVersionBoxDialog=!showVersionBoxDialog">版次</Button>
                  <Button class="buttonColor-14 ml-1" @click="fileBoxData=scope.row;showFileBoxDialog=!showFileBoxDialog">編號</Button>
                </template>
              </el-table-column>
              <el-table-column prop="Type" label="類型" width="90px" sortable>
                <template slot-scope="scope">
                  <Button class="buttonColor-14" @click="preview(scope.row)">檢視</Button>
                </template>
              </el-table-column>
              <el-table-column prop="PatientId" label="病歷號" width="100px" sortable></el-table-column>
              <el-table-column prop="Patient.Cname" label="姓名"></el-table-column>
              <el-table-column prop="Patient.Identifier" label="身分證號" width="120px"></el-table-column>
              <el-table-column prop="RecordDate" label="病歷日期" width="120px" sortable>
                <template slot-scope="scope">
                  {{scope.row.RecordDateString}}
                </template>
              </el-table-column>
              <el-table-column prop="FolderId" label="病歷夾" width="120px" sortable>
                <template slot-scope="scope">
                  {{$store.getters.medicalRecordListObj[scope.row.FolderId] ? $store.getters.medicalRecordListObj[scope.row.FolderId].fullName:''}}
                </template>
              </el-table-column>
              <el-table-column prop="DocCategoryId" label="文件類別" width="140px" sortable>
                <template slot-scope="scope">
                  {{$store.getters.categoryListObj[scope.row.DocCategoryId] ? $store.getters.categoryListObj[scope.row.DocCategoryId].fullName:''}}
                </template>
              </el-table-column>
              <el-table-column prop="Volume" label="卷冊" sortable></el-table-column>
              <el-table-column prop="No" label="編號" sortable></el-table-column>
              <el-table-column prop="Version" label="版次" sortable></el-table-column>
              <el-table-column prop="Note" label="備註" sortable></el-table-column>
            </el-table>
            <el-pagination
              class="d-flex justify-content-center" background
              @size-change="getData(null,false)"
              @current-change="getData(null,false)"
              :current-page.sync="tableDataForm.page.page"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size.sync="tableDataForm.page.limit"
              layout="prev, pager, next, sizes, total"
              :total="tableData.Count" />
          </div>
        </CardBox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataSearchBox from '@/components/DataSearchBox.vue'
import DataManagerAddBox from '@/components/DataManagerAddBox.vue'
import ImgViewBox from '@/components/ImgViewBox.vue'
import FileBox from '@/components/FileBox.vue'
import VersionBox from '@/components/VersionBox.vue'
import moment from 'moment'
export default {
  components: {DataSearchBox,DataManagerAddBox,ImgViewBox,FileBox,VersionBox},
  data() {
    return {
      showDialog:false,
      showImgViewBox:false,
      showFileBoxDialog:false,
      showVersionBoxDialog:false,
      fileBoxData:null,
      tableData:null,
      chooseList:[],
      tableDataForm:{
        form:null,
        page: {
          sortKey:'PatientId',
          sortOrder:null,
          page:1,
          limit:10
        }
      },
    }
  },
  async created() {
  },
  methods: {
    async getData(e,initPage) {
      if(initPage) {
        this.tableDataForm.form=e
        this.tableDataForm.page.page=1
        if(this.$refs.table) this.$refs.table.clearSelection()
      }
      //console.log(123,this.tableDataForm.form)
      let filter=[]
      if(this.tableDataForm.form.Identifier) filter.push(`contains(Patient/Identifier,'${this.tableDataForm.form.Identifier}')`)
      if(this.tableDataForm.form.PatientId) filter.push(`contains(PatientId,'${this.tableDataForm.form.PatientId}')`)
      if(this.tableDataForm.form.RecordDate) {
        if(this.tableDataForm.form.RecordDate[0]) filter.push(`RecordDate ge ${this.tableDataForm.form.RecordDate[0]}`)
        if(this.tableDataForm.form.RecordDate[1]) filter.push(`RecordDate le ${this.tableDataForm.form.RecordDate[1]}`)
      }
      if(this.tableDataForm.form.dateType===1) {
        filter.push(`RecordDate ge ${moment(new Date()).add(-3, 'months').format('YYYY-MM-DD')} and RecordDate le ${moment(new Date()).format('YYYY-MM-DD')}`)
      }
      if(this.tableDataForm.form.dateType===2) {
        filter.push(`RecordDate ge ${moment(new Date()).add(-6, 'months').format('YYYY-MM-DD')} and RecordDate le ${moment(new Date()).format('YYYY-MM-DD')}`)
      }
      if(this.tableDataForm.form.dateType===3) {
        filter.push(`RecordDate ge ${moment(new Date()).add(-12, 'months').format('YYYY-MM-DD')} and RecordDate le ${moment(new Date()).format('YYYY-MM-DD')}`)
      }
      if(this.tableDataForm.form.Volume) filter.push(`Volume eq '${this.tableDataForm.form.Volume}'`)
      filter=filter.length ? filter.join(' and ') : null
      
      
      let filter2=[]
      
      let DocCategoryIdFilter=[]
      if(this.tableDataForm.form.DocCategoryId.length) {
        for(let item of this.tableDataForm.form.DocCategoryId) {
          DocCategoryIdFilter.push(`DocCategoryId eq ${item}`)
        }
      }
      DocCategoryIdFilter=DocCategoryIdFilter.length ? '('+DocCategoryIdFilter.join(' or ')+')' : null


      let FolderIdFilter=[]
      if(this.tableDataForm.form.FolderId.length) {
        for(let item of this.tableDataForm.form.FolderId) {
          FolderIdFilter.push(`FolderId eq ${item}`)
        }
      }
      FolderIdFilter=FolderIdFilter.length? '('+FolderIdFilter.join(' or ')+')' : null

      filter2=[DocCategoryIdFilter,FolderIdFilter].filter(r=>r).join(' and ')
      
      let filter3=[]
      if(filter) filter3.push(filter)
      if(filter2) filter3.push(filter2)
      filter3=filter3.length ? filter3.join(' and ') : null

      let data= {
        $filter:filter3,
        $orderby:this.$global.toODataOrder(this.tableDataForm.page.sortKey,this.tableDataForm.page.sortOrder),
        $top:this.tableDataForm.page.limit,
        $skip:this.tableDataForm.page.limit*(this.tableDataForm.page.page-1),
      }

      this.$store.commit('loading',true)
      this.tableData=await this.$api.getDocRecord(data)
      this.$store.commit('loading',false)
    },
    addComplete() {
      this.$refs.dataSearchBox.getData()
      this.$message.success('新增成功')
      this.showDialog=!this.showDialog
    },
    async sortChange(x) {
      let {order,prop} = x
      this.tableDataForm.page.sortKey=prop
      this.tableDataForm.page.sortOrder=order
      await this.getData()
    },
    async del() {
      if(!confirm(`確定刪除 ${this.chooseList.length} 筆資料?`)) return 0
      this.$store.commit('loading',true)
      let map=this.chooseList.map(r=> r.Id)
      await this.$api.delDocRecord(map)
      await this.getData()
      this.chooseList=[]
      this.$refs.table.clearSelection()
      this.$store.commit('loading',false)
    },
    async exportSelectList() {
      this.$store.commit('loading',true)
      let map=this.chooseList.map(r=> r.Id)
      let res=await this.$api.getDocRecordExportSelectList(map)
      window.open(res)
      this.chooseList=[]
      this.$refs.table.clearSelection()
      this.$store.commit('loading',false)
    },
    async exportSelectPDF() {
      this.$store.commit('loading',true)
      let map=this.chooseList.map(r=> r.Id)
      let res=await this.$api.getDocRecordImgExportSelectListPdf(map)
      let pdfURL = window.URL.createObjectURL(new Blob([res], {type: "application/pdf"}))
      window.open(pdfURL)
      this.chooseList=[]
      this.$refs.table.clearSelection()
      this.$store.commit('loading',false)
    },
    preview(x) {
      window.open(`${this.$api.baseURL}${x.Attachment}`)
    },
  }
}
</script>