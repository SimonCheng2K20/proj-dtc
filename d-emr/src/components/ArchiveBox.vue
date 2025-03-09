<template>
  <div>
    <el-table class="mb-1" :data="data" border stripe style="width: 100%">
      <el-table-column label="操作" min-width="160px">
        <template slot-scope="scope">
          <div class="action-row">
            <a class="action-btn-x" href="javascript:;" title="閱覽">
              <img src="../assets/img/svg/browse.svg" @click="previewPDF(scope.row)" />
            </a>
            <a class="action-btn-x" href="javascript:;" title="列印">
              <img src="../assets/img/svg/print.svg" @click="printPDF(scope.row)" />
            </a>
            <a class="action-btn-x" href="javascript:;" title="下載">
              <img src="../assets/img/svg/pdf.svg" @click="downloadPDF(scope.row)" />
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="抽審" prop="SpotCheck" width="120px" sortable>
        <template slot-scope="scope">
          <div class="d-flex" style="gap: 8px">
            <el-checkbox v-model="scope.row.SpotCheck" @change="changeActive(scope.row)" />
            <Button v-if="scope.row.SpotCheck" class="buttonColor-1" @click="toSpotRemark(scope.row)">備註</Button>
          </div>
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
      <el-table-column label="開單日期" prop="OrderDateTime" width="140px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.OrderDateTime">{{ $global.YYYYMMDD(scope.row.OrderDateTime.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="門診日期" prop="SheetDate" width="140px" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.SheetDate">{{ $global.YYYYMMDD(scope.row.SheetDate.slice(0, 8)) }}</div>
        </template>
      </el-table-column>
    </el-table>

    <SpotRemarkDialog
      v-if="dialogShow"
      :SpotDesc="currentItem?.SpotDesc"
      @ok="onSetSpotClick"
      @hide="onHide"
    ></SpotRemarkDialog>
  </div>
</template>

<script>
import SpotRemarkDialog from './SpotRemarkDialog.vue'
export default {
  props: ['data'],
  components: { SpotRemarkDialog },
  data() {
    return {
      dialogShow: false,
      currentItem: null,
    }
  },
  methods: {
    openDownload(url, name) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    async previewPDF(x) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.postSheetArchiveExport([x.SheetArchiveOid])
      let Url = window.URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
      window.open(Url + `#toolbar=0`)
      this.$store.commit('loading', false)
    },
    async printPDF(x) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.postSheetArchiveExport([x.SheetArchiveOid])
      let Url = window.URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
      window.open(Url)
      this.$store.commit('loading', false)
    },
    async downloadPDF(x) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.postSheetArchiveExport([x.SheetArchiveOid])
      let Url = window.URL.createObjectURL(new Blob([fileData]))
      this.openDownload(Url, `signatureReport_${x.SheetArchiveOid}.pdf`)
      this.$store.commit('loading', false)
    },
    onHide() {
      this.currentItem = null
      this.dialogShow = false
    },
    toSpotRemark(row) {
      this.currentItem = row
      this.dialogShow = true
    },
    async onSetSpotClick(remark) {
      try {
        await this.$api.postSheetSetSpotDesc([
          {
            SheetArchiveOid: this.currentItem.SheetArchiveOid,
            SpotDesc: remark,
          },
        ])
        this.$emit('refresh')
        this.$message.success('儲存成功')
        this.onHide()
      } catch (error) {
        console.log(error)
        this.$message.error('儲存失敗')
      }
    },
    async changeActive(data) {
      try {
        this.$store.commit('loading', true)

        console.log(`changeActive: `, data)

        let tempArr = null

        if (data && data.SheetArchiveOid) {
          tempArr = [
            {
              SheetArchiveOid: data.SheetArchiveOid,
              SpotCheck: data.SpotCheck,
            },
          ]
        }

        await this.$api.postSheetSetSpotCheck(tempArr)
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.$emit('refresh')
        this.$store.commit('loading', false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.action-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 8px;
  gap: 4px;

  .action-btn-x {
    display: block;
    max-width: 36px;
    max-height: 24px;
    position: relative;
    cursor: pointer;

    > img {
      display: block;
      margin: 0 auto;
      width: auto;
      height: 100%;
    }

    &:hover {
      -webkit-animation: scale-down-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      animation: scale-down-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  }
}
</style>
