<template>
  <div class="externalMedicalRecords">
    <Dialog v-model="showDialog" :title="isAdd ? '新增帳號':'編輯帳號'" :width="'40vw'">

    </Dialog>
    <CardBox class="mb-1" title="外院電子病歷">
      <el-row :gutter="10">
        <el-col :md="6">
          <el-card shadow="never">
            <div class="title-1 mb-2">請選擇上傳檔案:</div>
            <div class="d-flex justify-content-end">
              <Button class="buttonColor-11">瀏覽檔案</Button>
            </div>
            <el-divider></el-divider>
            <div class="title-2 mb-2">檔案名稱:</div>
            <ul>
              <li>20220415</li>
              <li>20220415</li>
              <li>20220415</li>
              <li>20220415</li>
              <li>20220415</li>
              <li>20220415</li>
              <li>20220415</li>
            </ul>
            <div class="d-flex justify-content-end">
              <Button class="buttonColor-1">確認上傳</Button>
            </div>
          </el-card>
        </el-col>
        <el-col :md="18">
          <el-card shadow="never">
            <div class="title-1 mb-2">上傳檔案結果</div>
            <el-table class="mb-1" :data="tableData" border stripe style="width: 100%">
              <el-table-column prop="date" label="檢閱" sortable></el-table-column>
              <el-table-column prop="date" label="病患身分證號" sortable></el-table-column>
              <el-table-column prop="date" label="病患姓名" sortable></el-table-column>
              <el-table-column prop="date" label="檔案名稱" sortable></el-table-column>
              <el-table-column prop="date" label="上傳電子病歷狀態" sortable></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </CardBox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogBoxKey:'content',
      showDialog:false,
      isAdd:true,
      formData: {
        page:1,
        limit:10,
      },
      tableData: [
        {date:'123'},
        {date:'123'},
        {date:'123'},
      ],
      form: {
        v1:''
      }
    }
  },
  methods: {
    handleSizeChange() {

    },
    handleCurrentChange() {

    }
  }
}
</script>