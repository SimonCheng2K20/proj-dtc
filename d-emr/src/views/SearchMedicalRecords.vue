<template>
  <div class="searchMedicalRecords">
    <CardBox class="mb-1" title="電子病歷查詢">
      <el-form label-position="left" label-width="142px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="單張種類" prop="">
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
              <el-input v-model="tableDataFormCopy.SignerId" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="簽章者姓名">
              <el-input v-model="tableDataFormCopy.SignerName"/>
            </InputLabel>
          </el-col>
          <!-- <el-col :md="6">
            <InputLabel class="mb-1" title="簽章者院內代碼">
              <el-input v-model="tableDataFormCopy.SignerOid" />
            </InputLabel>
          </el-col> -->
          <!-- <el-col :md="7">
            <InputLabel class="mb-1" title="病歷完成日期">
              <el-date-picker v-model="tableDataFormCopy.ApprovedDateTime" type="daterange" range-separator="~" value-format="yyyyMMdd" style="width: 100%" />
            </InputLabel>
          </el-col> -->
          <el-col :md="8">
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
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="getData">查詢</Button>
        <Button class="buttonColor-10" @click="clean">清除</Button>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-row :gutter="10">
        <el-col :md="7">
          <el-table
            ref="table"
            highlight-current-row
            class="mb-1"
            :data="tableData.Items"
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
            <el-table-column prop="ChartNo" label="病歷號" sortable></el-table-column>
            <el-table-column prop="PatientName" label="病患姓名" sortable></el-table-column>
            <el-table-column prop="WrapWords" label="註記" sortable></el-table-column>
          </el-table>
          <el-pagination
            class="rwd-flex pb-cus"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableDataFormCopy.page"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="tableDataFormCopy.limit"
            layout="prev, pager, next, sizes, total"
            :total="tableData.Count"
          />
        </el-col>
        <el-col :md="17">
          <MedicalRecords :data="choosePatientSheetArchive" @refresh="refresh" v-if="choosePatientSheetArchive" />
          <div class="searchMedicalRecordsEmpty" v-else>請選擇病患</div>
        </el-col>
      </el-row>
    </CardBox>
  </div>
</template>

<script>
import moment from 'moment'
import MedicalRecords from '@/components/MedicalRecords.vue'

export default {
  components: { MedicalRecords },
  data() {
    return {
      showDialog: false,
      isAdd: true,
      tableData: null,
      tableDataForm: {
        ChartNo: '',
        PatientName: '',
        SheetIndexIdNo: '',
        SignerOid: '',
        SignerId: '',
        SignerName: '',
        SheetTypeOid: '',
        SheetId: '',
        SheetName: '',
        ApprovedDateTime: '',
        SignatureDate: [moment().add(-7, 'days').format('YYYYMMDD'), moment().format('YYYYMMDD')],
        sortKey: 'ChartNo',
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      choosePatientSheetArchive: null,
      lastTimeForm: null,
    }
  },
  async created() {
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
    // await this.getData();
  },
  methods: {
    async getData() {
      let filter = []
      if (this.tableDataFormCopy.ChartNo)
        filter.push(`contains(SheetIndex/ChartNo,'${this.tableDataFormCopy.ChartNo}')`)
      if (this.tableDataFormCopy.PatientName)
        filter.push(`contains(PatientName,'${this.tableDataFormCopy.PatientName}')`)
      if (this.tableDataFormCopy.SheetIndexIdNo)
        filter.push(`contains(SheetIndex/IdNo,'${this.tableDataFormCopy.SheetIndexIdNo}')`)
      // if (this.tableDataFormCopy.SignerId) filter.push(`SignerUserId eq '${this.tableDataFormCopy.SignerId.toLowerCase()}'`)
      if (this.tableDataFormCopy.SignerId)
        filter.push(`contains('${this.tableDataFormCopy.SignerId.toLowerCase()}',tolower(SignerUserId))`)
      if (this.tableDataFormCopy.SignerOid)
        filter.push(`contains('${this.tableDataFormCopy.SignerOid.toLowerCase()}',tolower(SignerOid))`)
      if (this.tableDataFormCopy.SignerName)
        filter.push(`contains('${this.tableDataFormCopy.SignerName.toLowerCase()}',tolower(SignerName))`)
      if (this.tableDataFormCopy.SheetTypeOid)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetTypeOid.toLowerCase()}'),tolower(SheetTypeOid))`)
      if (this.tableDataFormCopy.SheetId)
        filter.push(`contains('${this.tableDataFormCopy.SheetId.toLowerCase()}',tolower(SheetId))`)
      if (this.tableDataFormCopy.SheetName)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetName.toLowerCase()}'),tolower(SheetName))`)
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[0]) {
        filter.push(`ApprovedDateTime ge '${this.tableDataFormCopy.ApprovedDateTime[0]}000000'`)
      }
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[1]) {
        filter.push(`ApprovedDateTime le '${this.tableDataFormCopy.ApprovedDateTime[1]}999999'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[0]) {
        filter.push(`SignatureDate ge '${this.tableDataFormCopy.SignatureDate[0]}000000'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[1]) {
        filter.push(`SignatureDate le '${this.tableDataFormCopy.SignatureDate[1]}999999'`)
      }
      filter = filter.length ? filter.join(' and ') : null

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      }

      this.$store.commit('loading', true)
      this.tableData = await this.$api.getSheetArchivePatientList(data)

      this.choosePatientSheetArchive = null
      this.$store.commit('loading', false)
    },
    async clean() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
      // this.$refs.table.sort(
      //   this.tableDataFormCopy.sortKey,
      //   this.tableDataFormCopy.sortOrder
      // );
      this.tableData = null
    },
    async sortChange(x) {
      console.log(`x: `, x)
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
    async changePatient(e) {
      let filter = []
      if (this.tableDataFormCopy.ChartNo)
        filter.push(`contains(SheetIndex/ChartNo,'${this.tableDataFormCopy.ChartNo}')`)
      if (this.tableDataFormCopy.PatientName)
        filter.push(`contains(PatientName,'${this.tableDataFormCopy.PatientName}')`)
      if (this.tableDataFormCopy.SheetIndexIdNo)
        filter.push(`contains(SheetIndex/IdNo,'${this.tableDataFormCopy.SheetIndexIdNo}')`)
      // if (this.tableDataFormCopy.SignerId) filter.push(`SignerUserId eq '${this.tableDataFormCopy.SignerId.toLowerCase()}'`)
      if (this.tableDataFormCopy.SignerId)
        filter.push(`contains('${this.tableDataFormCopy.SignerId.toLowerCase()}',tolower(SignerUserId))`)
      if (this.tableDataFormCopy.SignerOid)
        filter.push(`contains('${this.tableDataFormCopy.SignerOid.toLowerCase()}',tolower(SignerOid))`)
      if (this.tableDataFormCopy.SignerName)
        filter.push(`contains('${this.tableDataFormCopy.SignerName.toLowerCase()}',tolower(SignerName))`)
      if (this.tableDataFormCopy.SheetTypeOid)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetTypeOid.toLowerCase()}'),tolower(SheetTypeOid))`)
      if (this.tableDataFormCopy.SheetId)
        filter.push(`contains('${this.tableDataFormCopy.SheetId.toLowerCase()}',tolower(SheetId))`)
      if (this.tableDataFormCopy.SheetName)
        filter.push(`contains(tolower('${this.tableDataFormCopy.SheetName.toLowerCase()}'),tolower(SheetName))`)
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[0]) {
        filter.push(`ApprovedDateTime ge '${this.tableDataFormCopy.ApprovedDateTime[0]}000000'`)
      }
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[1]) {
        filter.push(`ApprovedDateTime le '${this.tableDataFormCopy.ApprovedDateTime[1]}999999'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[0]) {
        filter.push(`SignatureDate ge '${this.tableDataFormCopy.SignatureDate[0]}000000'`)
      }
      if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[1]) {
        filter.push(`SignatureDate le '${this.tableDataFormCopy.SignatureDate[1]}999999'`)
      }
      filter = filter.length ? filter.join(' and ') : null

      try {
        this.choosePatientSheetArchive = null

        let data = {
          personData: e,
          data: [],
        }
        this.$store.commit('loading', true)
        const result = await this.$api
          .getSheetArchivePatientSheetArchive({
            chartNo: e.ChartNo,
            $filter: filter,
          })
          .then((res) => res.Items)

        if (result && result.length) {
          data.data = result
          this.lastTimeForm = {
            personData: e,
            chartNo: e.ChartNo,
            $filter: filter,
          }
          this.choosePatientSheetArchive = data
        } else {
          this.getData()
          this.$message.error('無資料')
        }
      } catch (err) {
        console.log(`error: `, err)
        this.$message.error('資料讀取失敗')
      } finally {
        this.$store.commit('loading', false)
      }
    },
    async refresh() {
      this.$store.commit('loading', true)
      let data = {
        personData: this.lastTimeForm.personData,
        data: await this.$api
          .getSheetArchivePatientSheetArchive({
            chartNo: this.lastTimeForm.chartNo,
            $filter: this.lastTimeForm.$filter,
          })
          .then((res) => res.Items),
      }

      if (data.data.length === 0) {
        this.$message.error('當前病患已無資料')
        this.getData()
        return
      }

      this.choosePatientSheetArchive = data
      this.$store.commit('loading', false)
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.page = 1
      this.tableDataFormCopy.limit = x
      await this.getData()
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page = x
      await this.getData()
    },
  },
}
</script>
