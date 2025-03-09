<template>
  <div class="BasicInfo">
    <Dialog
      v-model="showDialog"
      :title="isAdd ? '新增敏感身分' : '編輯敏感身分'"
      :width="'40vw'"
    >
      <el-form
        ref="postform"
        label-position="left"
        :model="formCopy"
        :rules="rules"
        label-width="160px"
        @keyup.enter.native="sub"
      >
        <InputLabel class="mb-1" title="病歷號/病患姓名" prop="SheetIndexOid">
          <el-select
            v-model="formCopy.SheetIndexOid"
            filterable
            :remote-method="remoteMethod"
            remote
            reserve-keyword
            placeholder="請輸入"
            :disabled="!isAdd"
            style="width: 100%"
          >
            <el-option
              v-if="!isAdd"
              :key="sheetIndexListEdit.SheetIndexOid"
              :label="`病歷號：${sheetIndexListEdit.ChartNo} / 姓名：${sheetIndexListEdit.PatientName} / 身分證字號：${sheetIndexListEdit.IdNo}`"
              :value="sheetIndexListEdit.SheetIndexOid"
            >
            </el-option>
            <el-option
              v-for="item in sheetIndexList"
              :key="item.SheetIndexOid"
              :label="
                '病歷號：' +
                item.ChartNo +
                ' / 姓名： ' +
                item.PatientName +
                ' / 身分證字號： ' +
                item.IdNo
              "
              :value="item.SheetIndexOid"
            >
            </el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="敏感身分" prop="PatientClassOid">
          <el-select
            v-model="formCopy.PatientClassOid"
            :disabled="!isAdd"
            style="width: 100%"
          >
            <el-option
              v-for="item in patientClassSelects"
              :key="item.PatientClassOid"
              :label="item.PatientClassName"
              :value="item.PatientClassOid"
            ></el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="備註">
          <el-input v-model="formCopy.Remark" />
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog = !showDialog"
          >取消</Button
        >
        <Button class="buttonColor-1" @click="submit">建立</Button>
      </div>
    </Dialog>
    <CardBox class="mb-1" title="敏感身分維護">
      <el-form
        label-position="left"
        :model="tableDataFormCopy"
        @keyup.enter.native="getData"
      >
        <el-row :gutter="10">
          <el-col :md="12">
            <InputLabel class="mb-1" title="病歷號/病患姓名">
              <el-select
                v-model="tableDataFormCopy.SheetIndexOid"
                filterable
                :remote-method="remoteMethod"
                remote
                reserve-keyword
                placeholder="請輸入"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in sheetIndexList"
                  :key="item.ChartNo"
                  :label="
                    '病歷號：' +
                    item.ChartNo +
                    ' / 姓名： ' +
                    item.PatientName +
                    ' / 身分證字號： ' +
                    item.IdNo
                  "
                  :value="item.SheetIndexOid"
                >
                </el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="敏感身分">
              <el-select
                v-model="tableDataFormCopy.PatientClassOid"
                style="width: 100%"
              >
                <el-option
                  v-for="item in patientClassSelects"
                  :key="item.PatientClassOid"
                  :label="item.PatientClassName"
                  :value="item.PatientClassOid"
                ></el-option>
              </el-select>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button
          class="buttonColor-1 mr-1"
          @click="
            tableDataFormCopy.page = 1;
            getData();
          "
          >查詢</Button
        >
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="add">新增敏感身分</Button>
      </div>
    </CardBox>

    <CardBox class="mb-1" v-if="tableData">
      <el-table
        ref="table"
        class="mb-1"
        :default-sort="{
          prop: tableDataFormCopy.sortKey,
          order: tableDataFormCopy.sortOrder,
        }"
        :data="tableData.Items"
        border
        stripe
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <Button class="buttonColor-3 mr-1" @click="edit(scope.row)"
              >編輯</Button
            >
            <Button class="buttonColor-2" @click="del(scope.row)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column prop="SheetIndexChartNo" label="病歷號">
        </el-table-column>
        <el-table-column prop="PatientClassOid" label="敏感身分">
          <template slot-scope="scope">
            {{
              $store.getters.patientClassObj[scope.row.PatientClassOid]
                ?.PatientClassName
            }}
          </template>
        </el-table-column>
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
import dayjs from "dayjs";
export default {
  data() {
    return {
      showDialog: false,
      isAdd: true,
      sheetIndexList: [],
      sheetIndexListEdit: [],
      tableData: null,
      tableDataForm: {
        SheetIndexOid: "",
        PatientClassOid: "",
        SheetIndexChartNo: "",
        Remark: "",
        sortKey: "SheetIndexOid",
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      form: {
        SheetIndexOid: "",
        PatientClassOid: "",
        SheetIndexChartNo: "",
        Remark: "",
      },
      formCopy: null,
      rules: {
        SheetIndexOid: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        PatientClassOid: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
      },

      dayjs,
      patientClassSelects: [],
    };
  },
  async created() {
    this.formCopy = JSON.parse(JSON.stringify(this.form));
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
    await this.getPatientClassSelect();
    await this.getData();
  },
  methods: {
    async getPatientClassSelect() {
      let filter = [];
      filter.push(`OnNotGrant eq '0'`);
      filter = filter.length ? filter.join(" and ") : null;
      let data = {
        $filter: filter,
      };
      let res = await this.$api.getPatientClass(data);
      if (res) {
        this.patientClassSelects = res.Items;
      }
    },
    async getData() {
      let filter = [];
      if (this.tableDataFormCopy.SheetIndexOid) {
        filter.push(
          `SheetIndexOid eq '${this.tableDataFormCopy.SheetIndexOid}'`
        );
      }
      if (this.tableDataFormCopy.PatientClassOid) {
        filter.push(
          `PatientClassOid eq '${this.tableDataFormCopy.PatientClassOid}'`
        );
      }
      if (this.tableDataFormCopy.SheetIndexChartNo) {
        filter.push(`ChartNo eq '${this.tableDataFormCopy.SheetIndexChartNo}'`);
      }
      filter = filter.length ? filter.join(" and ") : null;

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(
          this.tableDataFormCopy.sortKey,
          this.tableDataFormCopy.sortOrder
        ),
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      };

      this.$store.commit("loading", true);
      this.tableData = await this.$api.getSheetIndexSensitive(data);
      this.$store.commit("loading", false);
    },
    async changeActive(x) {
      this.$store.commit("loading", true);
      await this.$api.putSheetEvent(x);
      await this.getData();
      this.$message.success("狀態更改成功");
      this.$store.commit("loading", false);
    },
    add() {
      this.formCopy = JSON.parse(JSON.stringify(this.form));
      this.sheetIndexList = [];
      this.isAdd = true;
      this.showDialog = true;
    },
    edit(x) {
      this.formCopy = JSON.parse(JSON.stringify(x));
      // this.remoteMethod(this.formCopy.SheetIndexOid);
      this.remoteMethodEdit(this.formCopy.SheetIndexOid);
      this.isAdd = false;
      this.showDialog = true;
    },
    async del(x) {
      if (!confirm("確定刪除?")) return false;
      this.$store.commit("loading", true);
      await this.$api.deleteSheetIndexSensitive(x.SheetIndexSensitiveOid);
      await this.getData();
      this.$store.commit("loading", false);
      this.$message.success("刪除成功");
    },
    async clean() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
      this.getData();
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.page = 1;
      this.tableDataFormCopy.limit = x;
      await this.getData();
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page = x;
      await this.getData();
    },
    async sortChange(x) {
      let { order, prop } = x;
      this.tableDataFormCopy.sortKey = prop;
      this.tableDataFormCopy.sortOrder = order;
      await this.getData();
    },
    async remoteMethod(e) {
      /*if(e) {
        this.sheetIndexList=this.$store.state.sheetIndex.filter(res=>res.SheetIndexOid===e||res.PatientName.includes(e)||res.ChartNo.includes(e)).slice(0,20)
      }
      else this.sheetIndexList=[]*/
      if (e) {
        let data = {
          $filter: `contains(ChartNo,'${e}') or contains(tolower(PatientName),'${e.toLocaleLowerCase()}') or contains(IdNo,'${e}')`,
          $top: 10,
        };
        this.sheetIndexList = await this.$api
          .getAllPatient(data)
          .then((res) => res.Items);
      } else this.sheetIndexList = [];
    },
    async remoteMethodEdit(e) {
      if (e) {
        let data = {
          $filter: `SheetIndexOid eq '${e}'`,
        };
        this.sheetIndexListEdit = await this.$api
          .getAllPatient(data)
          .then((res) => res.Items[0]);
      } else {
        this.sheetIndexListEdit = [];
      }
    },
    async submit() {
      this.$refs.postform.validate(async (valid) => {
        if (valid) {
          this.$store.commit("loading", true);
          if (this.isAdd)
            await this.$api.postSheetIndexSensitive(this.formCopy);
          else await this.$api.postSheetIndexSensitive(this.formCopy);
          await this.getData();
          this.showDialog = false;
          this.$store.commit("loading", false);
          this.$message.success(this.isAdd ? "新增成功" : "編輯成功");
        }
      });
    },
  },
};
</script>
