<template>
  <div class="BasicInfo">
    <CardBox class="mb-1" title="批次簽章作業">
      <el-form label-position="left" label-width="150px" @submit.native.prevent>
        <el-row :gutter="10">
          <el-col :md="5">
            <InputLabel class="mb-1" title="單張種類">
              <el-select
                v-model="tableDataFormCopy.SheetTypeOid"
                style="width: 100%"
              >
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
            <InputLabel class="mb-1" title="病歷號碼">
              <el-input v-model="tableDataFormCopy.SheetIndexOid" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="病患姓名">
              <el-input v-model="tableDataFormCopy.PatientName" />
            </InputLabel>
          </el-col>
          <el-col :md="7">
            <InputLabel class="mb-1" title="病歷完成日期">
              <el-date-picker
                v-model="tableDataFormCopy.ApprovedDateTime"
                type="daterange"
                range-separator="~"
                value-format="yyyyMMdd"
                style="width: 100%"
              />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-space-between">
        <div>
          目前狀態：<span
            :style="{ color: isAutoSignature ? '#28BB32' : '#f00' }"
            >{{ isAutoSignature ? "已認證" : "未認證" }}</span
          >
        </div>
        <div class="d-flex">
          <div>
            <span style="margin-right: 10px">簽章逾時原因: </span>
            <el-select
              v-model="signatureFailData"
              placeholder="請選擇"
              style="margin-right: 14px"
            >
              <el-option
                v-for="item in signatureFailItems"
                :key="item.ReasonId"
                :label="item.ReasonDesc"
                :value="item.ReasonId"
              >
              </el-option>
            </el-select>
          </div>
          <Button class="buttonColor-1 mr-1" @click="getData('skip')">查詢</Button>
          <Button class="buttonColor-10 mr-1" @click="clear">清除</Button>
          <Button
            class="buttonColor-7 mr-1"
            v-if="!isAutoSignature"
            @click="isAutoSignatureChange()"
            >醫事人員卡認證</Button
          >
          <Button class="buttonColor-6" @click="onSignatureClick"
            >執行簽章</Button
          >
        </div>
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table
        class="mb-1"
        ref="table"
        :data="tableData.Items"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{
          prop: tableDataFormCopy.sortKey,
          order: tableDataFormCopy.sortOrder,
        }"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column 
          prop="content"
          label="待簽章內容"
          sortable
        >
        </el-table-column> -->
        <el-table-column
          prop="SheetIndexChartNo"
          label="病歷號碼"
          sortable
        ></el-table-column>
        <el-table-column
          prop="PatientName"
          label="病患姓名"
          sortable
        ></el-table-column>
        <el-table-column
          prop="SheetName"
          label="單張名稱"
          sortable
        ></el-table-column>
        <el-table-column prop="ApprovedDateTime" label="病歷完成日期" sortable>
          <template scope="{ row }">
            {{ formatedDate(row.ApprovedDateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="簽章狀態">
          <template scope="{ row }">
            {{ statusItems.find(({ value }) => value === row.Status)?.label }}
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

    <MedicalCardCheckPassword
      v-model="medicalCardCheckPasswordShow"
      @ok="onMedicalCardCheckOk"
      @error="onMedicalCardCheckError"
    ></MedicalCardCheckPassword>

    <Dialog title="系統提示" v-model="sysInfoBox" :width="'30vw'">
      <p style="padding: 20px 0; text-align: center; color: red">
        請先認證醫事人員卡
      </p>
      <Button
        @click="
          sysInfoBox = false;
          medicalCardCertify();
        "
        style="color: #000000"
        >確定</Button
      >
    </Dialog>
  </div>
</template>

<script>
import moment from "moment";
import MedicalCardCheckPassword from "@/components/MedicalCardCheckPassword.vue";

export default {
  components: { MedicalCardCheckPassword },
  data() {
    return {
      showDialog: false,
      isAdd: true,
      tableDataForm: {
        SheetTypeOid: null,
        SheetIndexChartNo: null,
        SheetIndexOid: null,
        PatientName: null,
        ApprovedDateTime: [
          moment().add(-7, "days").format("YYYYMMDD"),
          moment().format("YYYYMMDD"),
        ],
        sortKey: "AccountNo",
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      formCopy: null,
      tableData: null,
      medicalCardCheckPasswordShow: false,
      multipleSelection: [],
      statusItems: [
        { label: "已簽章", value: 1 },
        { label: "未簽章(未逾時)", value: -1 },
        { label: "未簽章(已逾時)", value: -2 },
      ],
      sysInfoBox: false,
      signatureFailData: "001",
      signatureFailItems: [],
    };
  },
  async created() {
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
    await this.getData();
    await this.getSignatureFailData();
  },
  methods: {
    formatedDate(date) {
      return moment(date, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
    },
    async getSignatureFailData() {
      let res = await this.$api.getOverTimeReason();
      if (res && res.Items) {
        this.signatureFailItems = res.Items;
      }
      console.log(`this.signatureFailItems: `, this.signatureFailItems);
    },
    async getData(skip) {
      let filter = [];
      if (this.tableDataFormCopy.SheetTypeOid)
        filter.push(
          `contains(SheetTypeOid,'${this.tableDataFormCopy.SheetTypeOid}')`
        );
      if (this.tableDataFormCopy.SheetIndexOid)
        filter.push(
          `contains(SheetIndex/ChartNo,'${this.tableDataFormCopy.SheetIndexOid}')`
        );
      if (this.tableDataFormCopy.PatientName)
        filter.push(
          `contains(PatientName,'${this.tableDataFormCopy.PatientName}')`
        );
      if (
        this.tableDataFormCopy.ApprovedDateTime &&
        this.tableDataFormCopy.ApprovedDateTime[0]
      ) {
        filter.push(
          `ApprovedDateTime ge '${this.tableDataFormCopy.ApprovedDateTime[0]}000000'`
        );
      }
      if (
        this.tableDataFormCopy.ApprovedDateTime &&
        this.tableDataFormCopy.ApprovedDateTime[1]
      ) {
        filter.push(
          `ApprovedDateTime le '${this.tableDataFormCopy.ApprovedDateTime[1]}999999'`
        );
      }
      if (
        this.tableDataFormCopy.SignatureDate &&
        this.tableDataFormCopy.SignatureDate[0]
      ) {
        filter.push(
          `SignatureDate ge '${this.tableDataFormCopy.SignatureDate[0]}000000'`
        );
      }
      if (
        this.tableDataFormCopy.SignatureDate &&
        this.tableDataFormCopy.SignatureDate[1]
      ) {
        filter.push(
          `SignatureDate le '${this.tableDataFormCopy.SignatureDate[1]}999999'`
        );
      }

      filter = filter.length ? filter.join(" and ") : null;

      // console.log(
      //   `this.tableDataFormCopy.sortKey: `,
      //   this.tableDataFormCopy.sortKey
      // );
      // console.log(
      //   `this.tableDataFormCopy.sortOrder: `,
      //   this.tableDataFormCopy.sortOrder
      // );

      let tempSortKey = this.tableDataFormCopy.sortKey;
      if (this.tableDataFormCopy.sortKey === "SheetIndexChartNo") {
        tempSortKey = `SheetIndex/ChartNo`;
      }

      console.log(`skip: `, skip)

      let data = {
        status: "-3",
        $filter: filter,
        $orderby: this.$global.toODataOrder(
          tempSortKey,
          this.tableDataFormCopy.sortOrder
        ),
        $top: this.tableDataFormCopy.limit,
        $skip: skip ? 0 : (this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1)),
      };

      this.$store.commit("loading", true);
      this.tableData = await this.$api.getSheetArchive(data);
      this.$store.commit("loading", false);
    },
    clear() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
      this.$refs.table.sort(
        this.tableDataFormCopy.sortKey,
        this.tableDataFormCopy.sortOrder
      );
      this.getData();
    },
    async sortChange(x) {
      let { order, prop } = x;
      this.tableDataFormCopy.sortKey = prop;
      this.tableDataFormCopy.sortOrder = order;
      await this.getData();
    },
    async isAutoSignatureChange() {      
      // this.isSignatured = null
      this.medicalCardCertify();
    },
    async medicalCardCertify() {
      try {
        this.$store.commit("loading", true);

        const { data, error } = await this.$global.medicalCardCertify(
          this.$store.state.userData.Identifier
        );

        if (error) {
          this.$message.error(error);
          this.onMedicalCardCheckError();
          return;
        }

        if (data === undefined || data === null) {
          console.log(`no matched ID`);
          this.isAutoSignature = false;
        }

        // if (data && this.isSignatured) {
        //   this.$message.success("醫事人員卡已認證");
        //   return;
        // }

        if (data) {
          this.medicalCardCheckPasswordShow = true;
        }
      } catch (err) {
        console.log(`error: `, err);
      } finally {
        this.$store.commit("loading", false);
      }
    },
    async onMedicalCardCheckOk() {
      const res = await this.$api.postSetAutoSignature({
        AutoSignature: true,
        HcaSignature: this.$store.state.signature,
      });

      if (res.status === 200 || res.status === 204) {
        this.$store.commit("userData", { AutoSignature: true });
      }
    },
    onMedicalCardCheckError() {
      this.isAutoSignature = false;
    },
    async onSignatureClick() {
      try {
        this.$store.commit("loading", true);

        if (this.multipleSelection.length === 0) {
          this.$message.error("請選擇欲簽章之項目");
          this.$store.commit("loading", false);
          return;
        }

        let tempPostBody = null;

        this.signatureFailItems.forEach((v) => {
          if (v.ReasonId === this.signatureFailData) {
            tempPostBody = v;
          }
        });

        await this.$api.postSheetArchive({
          SheetArchiveOids: this.multipleSelection.map(
            (item) => item.SheetArchiveOid
          ),
          OverTimeReasonDesc: tempPostBody.ReasonDesc,
          HcaSignature: this.$store.state.signature,
        });

        this.$store.commit("loading", false);
        this.$message.success("簽章成功");
        this.getData();
      } catch (err) {
        console.log(`err: `, err);
        this.$store.commit("loading", false);
        this.showErrBox();
      } finally {
        this.$store.commit("loading", false);
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showErrBox() {
      this.sysInfoBox = true;
    },
  },
  computed: {
    isAutoSignature: {
      get() {
        return this.$store.state.userData.AutoSignature;
      },
      set(val) {
        this.$store.commit("userData", { AutoSignature: val });
      },
    },
    isSignatured: {
      get() {
        return this.$store.state.signature;
      },
      set(val) {
        this.$store.commit("setSignature", val);
      },
    },
  },
};
</script>
