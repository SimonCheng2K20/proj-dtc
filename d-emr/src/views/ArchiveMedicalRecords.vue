<template>
  <div class="searchMedicalRecords">
    <CardBox class="mb-1" title="抽審查詢">
      <!-- <el-form label-position="left" label-width="150px" @submit.native.prevent /> -->
      <el-form label-position="left" label-width="150px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="24">
            <el-row :gutter="10">
              <el-col :md="6">
                <InputLabel class="mb-1" title="單張種類">
                  <el-select v-model="tableDataFormCopy.SheetTypeOid" style="width: 100%">
                    <el-option
                      v-for="item in $store.state.sheetTypeList"
                      :key="item.No"
                      :label="item.Name"
                      :value="item.No"
                    ></el-option>
                  </el-select>
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="單張編號">
                  <el-input v-model="tableDataFormCopy.SheetId" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="單張名稱">
                  <el-input v-model="tableDataFormCopy.SheetName" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="病歷號">
                  <el-input v-model="tableDataFormCopy.ChartNo" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="病患身分證號">
                  <el-input v-model="tableDataFormCopy.SheetIndexIdNo" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="病患姓名">
                  <el-input v-model="tableDataFormCopy.PatientName" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="簽章者代碼">
                  <el-input v-model="tableDataFormCopy.ApproverId" />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="簽章者姓名">
                  <el-input v-model="tableDataFormCopy.Approver" />
                </InputLabel>
              </el-col>
              <el-col :md="12">
                <InputLabel class="mb-1" title="簽章時間">
                  <el-date-picker
                    v-model="tableDataFormCopy.SignatureDate"
                    type="daterange"
                    range-separator="~"
                    value-format="yyyyMMdd"
                    style="width: 100%"
                  />
                </InputLabel>
              </el-col>
              <el-col :md="6">
                <InputLabel class="mb-1" title="審查">
                  <el-select v-model="tableDataFormCopy.SpotCheck" style="width: 100%">
                    <el-option
                      v-for="item in spotCheckItems"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </InputLabel>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="getData">查詢</Button>
        <Button class="buttonColor-10" @click="clean">清除</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-row :gutter="10">
        <el-col :md="5">
          <el-table
            height="50vh"
            ref="table"
            highlight-current-row
            class="mb-1"
            :data="tableData"
            border
            stripe
            style="width: 100%"
            :default-sort="{
              prop: tableDataFormCopy.sortKey,
              order: tableDataFormCopy.sortOrder,
            }"
            @sort-change="sortChange"
            @row-click="changePatient"
          >
            <el-table-column prop="No" label="簽章者代碼" sortable></el-table-column>
            <el-table-column prop="Name" label="簽章者姓名" sortable></el-table-column>
          </el-table>
        </el-col>
        <el-col :md="19">
          <div v-if="choosePatientSheetArchive">
            <ArchiveBox :data="choosePatientSheetArchive.Items" @refresh="toGetPatient" />
            <el-pagination
              class="d-flex justify-content-center"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableDataFormCopy.page"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="tableDataFormCopy.limit"
              layout="prev, pager, next, sizes, total"
              :total="choosePatientSheetArchive.Count"
            />
          </div>
          <div class="searchMedicalRecordsEmpty" v-else>請選擇病患</div>
        </el-col>
      </el-row>
    </CardBox>
  </div>
</template>

<script>
import moment from 'moment'
import ArchiveBox from '@/components/ArchiveBox.vue'

export default {
  components: { ArchiveBox },
  data() {
    return {
      radio: '1',
      tableData: null,
      tableDataForm: {
        ChartNo: '',
        PatientName: '',
        SheetIndexIdNo: '',
        SignerOid: '',
        ApproverId: '',
        Approver: '',
        SpotCheck: null,
        SheetTypeOid: '',
        SheetId: '',
        SheetName: '',
        SheetDate: '',
        SignatureDate: [moment().add(-1, 'months').format('YYYYMMDD'), moment().format('YYYYMMDD')],
        OrderDateTime: '',
        SignerDeptId: '',
        Status: null,
        sortKey: 'No',
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      choosePatientData: null,
      choosePatientSheetArchive: null,

      spotCheckItems: [
        { label: '未審查', value: false },
        { label: '已審查', value: true },
      ],
    }
  },
  async created() {
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
    // await this.getData();
  },
  methods: {
    getFilter() {
      let filter = []

      if (this.tableDataFormCopy.ChartNo)
        filter.push(`contains(SheetIndex/ChartNo,'${this.tableDataFormCopy.ChartNo}')`)
      if (this.tableDataFormCopy.PatientName)
        filter.push(`contains(PatientName,'${this.tableDataFormCopy.PatientName}')`)
      if (this.tableDataFormCopy.SheetIndexIdNo)
        filter.push(`contains(SheetIndex/IdNo,'${this.tableDataFormCopy.SheetIndexIdNo}')`)
      if (this.tableDataFormCopy.SignerDeptId)
        filter.push(`contains(SignerDeptId,'${this.tableDataFormCopy.SignerDeptId}')`)
      if (this.tableDataFormCopy.ApproverId)
        filter.push(`contains('${this.tableDataFormCopy.ApproverId.toLowerCase()}',tolower(ApproverId))`)
      if (this.tableDataFormCopy.SignerOid)
        filter.push(`contains('${this.tableDataFormCopy.SignerOid.toLowerCase()}',tolower(SignerOid))`)
      if (this.tableDataFormCopy.Approver)
        filter.push(`contains('${this.tableDataFormCopy.Approver.toLowerCase()}',tolower(Approver))`)
      if (this.tableDataFormCopy.SheetTypeOid)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetTypeOid.toLowerCase()}'),tolower(SheetTypeOid))`)
      if (this.tableDataFormCopy.SheetId)
        filter.push(`contains('${this.tableDataFormCopy.SheetId.toLowerCase()}',tolower(SheetId))`)
      if (this.tableDataFormCopy.SheetName)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetName.toLowerCase()}'),tolower(SheetName))`)
      if (this.tableDataFormCopy.SheetDate && this.tableDataFormCopy.SheetDate[0]) {
        filter.push(`SheetDate ge '${this.tableDataFormCopy.SheetDate[0]}000000'`)
      }
      if (this.tableDataFormCopy.SheetDate && this.tableDataFormCopy.SheetDate[1]) {
        filter.push(`SheetDate lt '${this.tableDataFormCopy.SheetDate[1]}999999'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[0]) {
        filter.push(`SignatureDate ge '${this.tableDataFormCopy.SignatureDate[0]}000000'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[1]) {
        filter.push(`SignatureDate lt '${this.tableDataFormCopy.SignatureDate[1]}999999'`)
      }
      if (this.tableDataFormCopy.SpotCheck !== null) {
        filter.push(`SpotCheck eq ${this.tableDataFormCopy.SpotCheck}`)
      }

      filter = filter.length ? filter.join(' and ') : null

      return filter
    },
    async getData() {
      const filter = this.getFilter()

      try {
        let data = {
          $filter: filter,
          $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
          status: this.tableDataFormCopy.Status,
          $top: this.tableDataFormCopy.limit,
          $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
        }

        this.$store.commit('loading', true)

        // this.tableData = await this.$api.getSheetArchiveApproverList(data);
        const res = await this.$api.getSheetArchiveApproverList(data)

        if (res) {
          console.log(`res: `, res)
          this.tableData = res
        }
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.choosePatientSheetArchive = null
        this.$store.commit('loading', false)
      }
    },
    toDownload(url, name) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      // link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    toFileName(header, prop) {
      let fileName = null
      fileName = decodeURI(header['content-disposition']).split('; ')
      fileName = fileName[prop].replace("filename*=UTF-8''", '')
      fileName = fileName.trim()
      return fileName
    },
    async getExportList(data) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.getSheetArchiveStatsExportList(data)
      const url = window.URL.createObjectURL(new Blob([fileData.data]))
      let fileName = null
      if (fileData.headers && fileData.headers['content-disposition']) {
        fileName = this.toFileName(fileData.headers, 2)
      }
      this.toDownload(url, fileName ? fileName : 'List.xls')
      this.$store.commit('loading', false)
    },
    async getExportSummary(data) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.getSheetArchiveStatsExportSummary(data)
      const url = window.URL.createObjectURL(new Blob([fileData.data]))
      let fileName = null
      if (fileData.headers && fileData.headers['content-disposition']) {
        fileName = this.toFileName(fileData.headers, 2)
      }
      this.toDownload(url, fileName ? fileName : 'Summary.xls')
      this.$store.commit('loading', false)
    },
    async getExportDetail(data) {
      this.$store.commit('loading', true)
      let fileData = await this.$api.getSheetArchiveStatsExportDetail(data)
      const url = window.URL.createObjectURL(new Blob([fileData.data]))
      let fileName = null
      if (fileData.headers && fileData.headers['content-disposition']) {
        fileName = this.toFileName(fileData.headers, 2)
      }
      this.toDownload(url, fileName ? fileName : 'Detail.xls')
      this.$store.commit('loading', false)
    },
    async exportData(radio) {
      const filter = this.getFilter()

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
        status: this.tableDataFormCopy.Status,
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      }

      switch (radio) {
        case '1':
          await this.getExportList(data)
          break
        case '2':
          await this.getExportSummary(data)
          break
        case '3':
          await this.getExportDetail(data)
          break
        default:
          await this.getExportList(data)
      }
    },
    async clean() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
      if (this.$refs.table) {
        this.$refs.table.sort(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder)
      }
      this.tableData = null
    },
    async sortChange(x) {
      // let { order, prop } = x;
      // this.tableDataFormCopy.sortKey = prop;
      // this.tableDataFormCopy.sortOrder = order;
      // await this.getData();
      if (x && x.order) {
        let { order, prop } = x
        this.tableDataFormCopy.sortKey = prop
        this.tableDataFormCopy.sortOrder = order
        await this.getData()
      }
      {
        let { order, prop } = x
        this.tableDataFormCopy.sortKey = prop
        this.tableDataFormCopy.sortOrder = order
      }
    },
    async changePatient(x) {
      this.choosePatientData = x
      this.tableDataFormCopy.page = 1
      await this.toGetPatient()
    },

    async toGetPatient() {
      const filter = this.getFilter()

      let data = {
        $filter: filter,
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
        approverId: this.choosePatientData.No,
        Status: this.tableDataFormCopy.Status,
      }
      this.$store.commit('loading', true)
      this.choosePatientSheetArchive = await this.$api.getApproverSheetArchive(data)
      this.$store.commit('loading', false)
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.page = 1
      this.tableDataFormCopy.limit = x
      await this.toGetPatient()
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page = x
      await this.toGetPatient()
    },
  },
}
</script>
<style lang="scss" scoped>
.auditState-radio-box {
  .el-radio {
    width: 100%;
  }
}

.cus-btn-export {
  display: inline-block;
  padding: 8px 24px;
  color: #fff;
  border-width: 0px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
}
</style>
