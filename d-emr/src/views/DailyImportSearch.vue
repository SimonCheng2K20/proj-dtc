<template>
  <div class="BasicInfo">
    <CardBox class="mb-1" title="單張匯入查詢">
      <el-form label-position="left" :model="tableDataFormCopy" label-width="150px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="7">
            <InputLabel class="mb-1" title="病歷號">
              <el-input v-model="tableDataFormCopy.ChartNo" />
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="單張種類">
              <el-select v-model="tableDataFormCopy.SheetType" style="width: 100%">
                <el-option v-for="item in sheetTypeList" :key="item.No" :label="item.Name" :value="item.No"> </el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="處理狀態">
              <el-select v-model="tableDataFormCopy.ProcFlag" style="width: 100%">
                <el-option v-for="(item, index) in Object.keys(procFlagList)" :key="index" :value="item" :label="procFlagList[item].title"></el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="錯誤訊息">
              <el-input v-model="tableDataFormCopy.ErrorMessage" />
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="病歷確認者代碼">
              <el-input v-model="tableDataFormCopy.ApproverId" />
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="病歷確認者">
              <el-input v-model="tableDataFormCopy.Approver" />
            </InputLabel>
          </el-col>
          <!-- <el-col :md="7">
            <InputLabel class="mb-1" title="病歷確認者院內代碼" :labelWidth="'320px'">
              <el-input />
            </InputLabel>
          </el-col> -->
        </el-row>
        <el-row :gutter="10">
          <el-col :md="7">
            <InputLabel class="mb-1" title="上傳日期">
              <el-date-picker type="daterange" range-separator="~" style="width: 100%" v-model="tableDataFormCopy.EventDate" value-format="yyyyMMdd" />
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="病歷完成日期">
              <el-date-picker type="daterange" range-separator="~" style="width: 100%" v-model="tableDataFormCopy.ApprovedDateTime" value-format="yyyyMMdd" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button
          class="buttonColor-1 mr-1"
          @click="
            tableDataFormCopy.page = 1
            getData()
          "
          >查詢</Button
        >
        <Button class="buttonColor-10" @click="clean">清除</Button>
      </div>
    </CardBox>

    <CardBox class="mb-1" v-if="tableData">
      <el-table
        ref="table"
        class="mb-1"
        :data="tableData.Items"
        :default-sort="{ prop: tableDataFormCopy.sortKey, order: tableDataFormCopy.sortOrder }"
        border
        stripe
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ChartNo" label="病歷號" sortable></el-table-column>
        <el-table-column prop="SheetType" label="單張種類" sortable>
          <template slot-scope="scope">
            {{ sheetTypeList.find((item) => item.No === scope.row.SheetType)?.Name }}
          </template>
        </el-table-column>
        <el-table-column prop="EventType" label="類別" sortable></el-table-column>
        <el-table-column prop="ProcFlag" label="處理狀態" sortable>
          <template slot-scope="scope">
            {{ procFlagList[scope.row.ProcFlag].title }}
          </template>
        </el-table-column>
        <el-table-column prop="ApproverId" label="病歷確認者代碼" sortable></el-table-column>
        <el-table-column prop="Approver" label="病歷確認者" sortable></el-table-column>
        <el-table-column prop="EventDate" label="上傳日期" sortable>
          <template slot-scope="scope">
            {{
              $global.stringToDate(scope.row.EventDate, [
                [0, 4],
                [4, 2],
                [6, 2],
              ])
            }}
          </template>
        </el-table-column>
        <el-table-column prop="ApprovedDateTime" label="病歷完成日期" sortable>
          <template slot-scope="scope">
            {{
              $global.stringToDate(scope.row.ApprovedDateTime, [
                [0, 4],
                [4, 2],
                [6, 2],
              ])
            }}
          </template>
        </el-table-column>
        <el-table-column prop="ErrorMessage" label="錯誤訊息" width="500px" sortable></el-table-column>
      </el-table>
      <el-pagination
        class="d-flex justify-content-center"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableDataFormCopy.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataFormCopy.limit"
        layout="prev, pager, next, sizes, total"
        :total="tableData.Count"
      />
    </CardBox>
  </div>
</template>

<script>
const today = new Date()
const [y, m, d] = [today.getFullYear(), today.getMonth() + 1, today.getDate()]

export default {
  data() {
    return {
      showDialog: false,
      isAdd: true,
      tableData: null,
      tableDataForm: {
        ChartNo: null,
        SheetType: null,
        ProcFlag: null,
        ErrorMessage: null,
        ApproverId: null,
        Approver: null,
        EventDate: ['' + y + (m >= 10 ? m : `0${m}`) + (d >= 10 ? d : `0${d}`), '' + y + (m >= 10 ? m : `0${m}`) + (d >= 10 ? d : `0${d}`)],
        ApprovedDateTime: null,
        sortKey: 'ChartNo',
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      sheetTypeList: [],
      procFlagList: {
        N: { title: '未處理' },
        Y: { title: '已匯入' },
        E: { title: '匯入錯誤' },
      },
    }
  },
  created() {
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
    this.getData()
    this.getSheetTypeTypeIdList()
  },
  methods: {
    async getData() {
      let filter = []
      if (this.tableDataFormCopy.ChartNo) filter.push(`contains(ChartNo,'${this.tableDataFormCopy.ChartNo}')`)
      if (this.tableDataFormCopy.SheetType) filter.push(`SheetType eq '${this.tableDataFormCopy.SheetType}'`)
      if (this.tableDataFormCopy.ProcFlag) filter.push(`ProcFlag eq '${this.tableDataFormCopy.ProcFlag}'`)
      if (this.tableDataFormCopy.ErrorMessage) filter.push(`contains(ErrorMessage,'${this.tableDataFormCopy.ErrorMessage}')`)
      if (this.tableDataFormCopy.ApproverId) filter.push(`contains(ApproverId,'${this.tableDataFormCopy.ApproverId}')`)
      if (this.tableDataFormCopy.Approver) filter.push(`contains(Approver,'${this.tableDataFormCopy.Approver}')`)
      if (this.tableDataFormCopy.EventDate && this.tableDataFormCopy.EventDate[0]) {
        filter.push(`EventDate ge '${this.tableDataFormCopy.EventDate[0]}'`)
      }
      if (this.tableDataFormCopy.EventDate && this.tableDataFormCopy.EventDate[1]) {
        filter.push(`EventDate le '${this.tableDataFormCopy.EventDate[1]}'`)
      }
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[0]) {
        filter.push(`ApprovedDateTime ge '${this.tableDataFormCopy.ApprovedDateTime[0]}000000'`)
      }
      if (this.tableDataFormCopy.ApprovedDateTime && this.tableDataFormCopy.ApprovedDateTime[1]) {
        filter.push(`ApprovedDateTime lt '${this.tableDataFormCopy.ApprovedDateTime[1]}999999'`)
      }

      filter = filter.length ? filter.join(' and ') : null

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      }

      this.$store.commit('loading', true)
      this.tableData = await this.$api.getSheetMid(data)
      this.$store.commit('loading', false)
    },
    async clean() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm))
      this.$refs.table.sort(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder)
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
    async sortChange(x) {
      let { order, prop } = x
      this.tableDataFormCopy.sortKey = prop
      this.tableDataFormCopy.sortOrder = order
      await this.getData()
    },
    async getSheetTypeTypeIdList() {
      const data = await this.$api.getSheetTypeTypeIdList()
      this.sheetTypeList = data
    },
  },
}
</script>
