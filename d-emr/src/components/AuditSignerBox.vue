<template>
  <div>
    <el-table class="mb-1" :data="data" border stripe style="width: 100%">
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="閱覽" placement="top">
            <img class="mr-1" src="../assets/img/svg/browse.svg" @click="previewPDF(scope.row)" />
          </el-tooltip>

          <el-tooltip class="item" effect="light" content="註銷" placement="top">
            <img src="../assets/img/svg/remove.svg" @click="onDeleteClick(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="病歷號" prop="SheetIndexChartNo" width="120px" sortable></el-table-column>
      <el-table-column label="病患身分證號" prop="SheetIndexIdNo" width="150px" sortable></el-table-column>
      <el-table-column label="病患姓名" prop="PatientName" width="120px" sortable></el-table-column>
      <el-table-column label="單張種類" prop="SheetTypeOid" width="120px" sortable>
        <template slot-scope="scope">
          {{ $store.getters.sheetTypeListObj[scope.row.SheetTypeOid].Name }}
        </template>
      </el-table-column>
      <el-table-column label="簽章狀態" prop="Status" width="120px" sortable>
        <template scope="scope">
          {{
            scope.row.Status === 1
              ? '已簽章(未逾時)'
              : scope.row.Status === 2
              ? '已簽章(已逾時)'
              : scope.row.Status === -1
              ? '未簽章(未逾時)'
              : scope.row.Status === -2
              ? '未簽章(已逾時)'
              : null
          }}
        </template>
      </el-table-column>
      <el-table-column label="單張編號" prop="SheetId" width="120px" sortable></el-table-column>
      <el-table-column label="簽章者代碼" prop="ApproverId" width="140px" sortable></el-table-column>
      <el-table-column label="簽章者姓名" prop="Approver" width="140px" sortable></el-table-column>
      <el-table-column label="病歷完成時間" prop="ApprovedDateTime" width="150px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.ApprovedDateTime">{{ $global.YYYYMMDD(scope.row.ApprovedDateTime.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="簽章時間" prop="SignatureDate" width="140px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.SignatureDate">{{ $global.YYYYMMDD(scope.row.SignatureDate.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="開單日期" prop="SheetDate" width="140px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.SheetDate">{{ $global.YYYYMMDD(scope.row.SheetDate.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="門診日期" prop="OrderDateTime" width="140px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.OrderDateTime">{{ $global.YYYYMMDD(scope.row.OrderDateTime.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogShow" title="是否確定註銷" show-close @close="onHide">
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-11 mr-1" @click="onHide">取消</Button>
        <Button class="buttonColor-1 mr-1" @click="deleteSheetArchive">儲存</Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      currentItem: null,
      dialogShow: false,
    }
  },
  methods: {
    async previewPDF(x) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.postSheetArchiveExport([x.SheetArchiveOid])
      let Url = window.URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
      window.open(Url + `#toolbar=0`)
      this.$store.commit('loading', false)
    },
    onHide() {
      this.dialogShow = false
      this.currentItem = null
    },
    onDeleteClick(row) {
      this.currentItem = row
      this.dialogShow = true
    },
    async deleteSheetArchive() {
      this.$store.commit('loading', true)
      try {
        await this.$api.delSheetArchive(this.currentItem.SheetArchiveOid)
        this.$message.success('註銷成功')
        this.dialogShow = false
        this.currentItem = null
        this.$emit('refresh')
      } catch (error) {
        this.$message.error('註銷失敗')
      } finally {
        this.$store.commit('loading', false)
      }
    },
  },
}
</script>
