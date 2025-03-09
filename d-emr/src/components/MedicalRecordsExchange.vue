<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="$emit('tabChange',activeName)">
      <el-tab-pane label="待驗證" name="P">
        <el-table class="mb-1" :data="data.Items" border stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="閱覽" sortable></el-table-column>
          <el-table-column prop="ChartNo" label="病歷號" sortable></el-table-column>
          <el-table-column prop="PatientName" label="姓名" sortable></el-table-column>
          <el-table-column prop="SheetTypeId" label="單張種類" sortable></el-table-column>
          <el-table-column prop="SignerName" label="簽章者" sortable></el-table-column>
          <el-table-column prop="CreateOn" label="建立日期" sortable></el-table-column>
          <el-table-column prop="SignatureDate" label="簽章日期" sortable></el-table-column>
          <el-table-column prop="ApprovedDateTime" label="病歷完成日期" sortable></el-table-column>
          <el-table-column prop="ExchangeOid" label="單張編號" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="上傳失敗" name="E">
        <el-table class="mb-1" :data="data.Items" border stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="ChartNo" label="病歷號" sortable></el-table-column>
          <el-table-column prop="PatientName" label="姓名" sortable></el-table-column>
          <el-table-column prop="date" label="單張種類" sortable></el-table-column>
          <el-table-column prop="date" label="簽章者" sortable></el-table-column>
          <el-table-column prop="date" label="上傳狀態" sortable></el-table-column>
          <el-table-column prop="date" label="執行動作" sortable></el-table-column>
          <el-table-column prop="date" label="上傳日期" sortable></el-table-column>
          <el-table-column prop="date" label="上傳訊息" sortable></el-table-column>
          <el-table-column prop="date" label="簽章日期" sortable></el-table-column>
          <el-table-column prop="date" label="病歷完成日期" sortable></el-table-column>
          <el-table-column prop="date" label="單張編號" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已上傳" name="Y">
        <el-table class="mb-1" :data="data.Items" border stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="病歷號" sortable></el-table-column>
          <el-table-column prop="date" label="姓名" sortable></el-table-column>
          <el-table-column prop="date" label="單張種類" sortable></el-table-column>
          <el-table-column prop="date" label="簽章者" sortable></el-table-column>
          <el-table-column prop="date" label="執行動作" sortable></el-table-column>
          <el-table-column prop="date" label="上傳日期" sortable></el-table-column>
          <el-table-column prop="date" label="上傳訊息" sortable></el-table-column>
          <el-table-column prop="date" label="簽章日期" sortable></el-table-column>
          <el-table-column prop="date" label="病歷完成日期" sortable></el-table-column>
          <el-table-column prop="date" label="單張編號" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-pagination
        class="d-flex justify-content-center" background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="10"
        layout="prev, pager, next, sizes, total"
        :total="data.Count" />
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      activeName:'P',
      tableData:[]
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