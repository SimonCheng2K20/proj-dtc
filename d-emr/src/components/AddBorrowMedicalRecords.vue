<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8">
        <CardBox class="cardBoxType2 mb-1" title="借閱者">
          <el-form
            ref="postform"
            label-position="left"
            label-width="170px"
            :rules="rules"
            :model="form"
          >
            <!--<InputLabel class="mb-1" title="借閱單號" prop="LendingClassId">
              <el-input />
            </InputLabel>-->
            <InputLabel class="mb-1" title="借閱者代號">
              <el-select
                v-model="form.LendingAccountNo"
                filterable
                remote
                reserve-keyword
                placeholder="請輸入"
                style="width: 100%"
              >
                <!-- <el-option v-for="item in accountList" :key="item.No" :label="`${item.No} - ${item.Name} (${item.EmpNo})`" :value="item.No"></el-option> -->
                <el-option
                  v-for="item in accountList"
                  :key="item.No"
                  :label="`${item.No} - ${item.Name}`"
                  :value="item.No"
                ></el-option>
              </el-select>
            </InputLabel>
            <!--<InputLabel class="mb-1" title="借閱者院內員工代號" prop="LendingClassId">
              <el-input />
            </InputLabel>-->
            <InputLabel class="mb-1" title="借閱原因" prop="LendingClassOid">
              <el-select v-model="form.LendingClassOid" style="width: 100%">
                <el-option
                  v-for="item in lendingClassSelect"
                  :key="item.LendingClassOid"
                  :label="item.LendingClassId"
                  :value="item.LendingClassOid"
                >
                </el-option>
              </el-select>
            </InputLabel>
            <InputLabel class="mb-1" title="借閱期間起" prop="LendingFromDate">
              <el-date-picker
                v-model="form.LendingFromDate"
                type="date"
                value-format="yyyyMMdd"
              ></el-date-picker>
            </InputLabel>
            <InputLabel class="mb-1" title="借閱期間迄" prop="LendingToDate">
              <el-date-picker
                v-model="form.LendingToDate"
                type="date"
                value-format="yyyyMMdd"
              ></el-date-picker>
            </InputLabel>
            <InputLabel class="mb-1" title="單張種類">
              <el-select
                v-model="SheetTypes"
                style="width: 100%"
                multiple
                clearable
                collapse-tags
                placeholder="請選擇"
                @change="handleSelect"
              >
                <div
                  style="
                    padding-left: 20px;
                    line-height: 34px;
                    background: #e8f2ff;
                  "
                >
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                    >全選</el-checkbox
                  >
                </div>
                <el-checkbox-group v-model="SheetTypes">
                  <el-option
                    v-for="item in $store.state.sheetTypeList"
                    :key="item.No"
                    :label="item.Name"
                    :value="item.No"
                  >
                  </el-option>
                </el-checkbox-group>
              </el-select>
            </InputLabel>
            <InputLabel class="mb-1" title="備註">
              <el-input v-model="form.Remark" />
            </InputLabel>
            <el-card shadow="never">
              <el-checkbox
                label="所有病患"
                true-label="Y"
                false-label="N"
                v-model="form.AllPatient"
              ></el-checkbox>
              <el-checkbox
                label="允許列印"
                true-label="Y"
                false-label="N"
                v-model="form.CanPrint"
              ></el-checkbox>
              <el-checkbox
                label="允許匯出"
                true-label="Y"
                false-label="N"
                v-model="form.CanExport"
              ></el-checkbox>
            </el-card>
          </el-form>
        </CardBox>
      </el-col>
      <el-col :md="16">
        <CardBox class="cardBoxType2 mb-1" title="借閱的病歷">
          <el-row :gutter="10" class="mb-1">
            <el-col :md="24">
              <el-form>
                <InputLabel
                  class="cus-select-layout"
                  title="病歷號/病患姓名"
                  prop="SheetIndexOid"
                >
                  <el-select
                    v-model="choosePatient"
                    style="display: block; width: 100%"
                    value-key="ChartNo"
                    :remote-method="remoteMethod"
                    placeholder="請輸入"
                    remote
                    reserve-keyword
                    multiple
                    filterable
                    clearable
                    @change="getDictionaryMedical"
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
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </InputLabel>
              </el-form>
            </el-col>
          </el-row>
          <CardBox class="cardBoxTypeX mb-1" title="病歷身分">
            <el-table
              :data="patientClassList"
              border
              stripe
              style="width: 100%"
              highlight-current-row
              @row-click="tableSelect"
            >
              <el-table-column
                prop="ChartNo"
                label="病歷號碼"
                sortable
              ></el-table-column>
              <el-table-column
                prop="PatientName"
                label="姓名"
                sortable
              ></el-table-column>
              <el-table-column
                prop="WrapWords"
                label="敏感身分狀態"
                sortable
              ></el-table-column>
            </el-table>
          </CardBox>
          <CardBox
            class="cardBoxTypeX"
            style="text-align: left"
            title="敏感病歷"
          >
            <el-table
              ref="table"
              :data="tableData"
              border
              stripe
              style="width: 100%"
              @selection-change="typeSelect"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="date" label="敏感病歷" sortable>
                <template slot-scope="scope">
                  {{
                    $store.getters.sheetEventClassObj[
                      scope.row.SheetEventClassOid
                    ].SheetEventClassName
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="部門" sortable>
                <template slot-scope="scope">
                  {{
                    $store.getters.deptListObj[scope.row.SheetEventDeptId].Name
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="就診時間起" sortable>
                <template slot-scope="scope">
                  {{ $global.YYYYMMDDHHmm(scope.row.SheetEventFromDate) }}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="就診時間迄" sortable>
                <template slot-scope="scope">
                  {{ $global.YYYYMMDDHHmm(scope.row.SheetEventEndDate) }}
                </template>
              </el-table-column>
            </el-table>
          </CardBox>
        </CardBox>
      </el-col>
    </el-row>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-10 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1 mr-1" @click="sub" v-if="isAdd">建立</Button>
      <Button class="buttonColor-2" @click="edit" v-if="!isAdd">更新</Button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";

export default {
  props: ["lendingClassSelect", "isAdd", "editData"],
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      rules: {
        LendingClassOid: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        LendingFromDate: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        LendingToDate: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
      },
      isSelectAll: false,
      sheetIndexList: [],
      accountList: [],
      tableData: [],
      SheetTypes: [],
      choosePatient: [],
      form: {
        LendingAccountNo: null,
        LendingClassOid: null,
        ClaimerOid: null,
        LendingFromDate: null,
        LendingToDate: null,
        CanPrint: "N",
        CanExport: "N",
        AllPatient: "N",
        AllSheetType: "N",
        Remark: null,
        LendingSheetIndexRefs: [],
        SheetTypes: [],
      },
      tempPatientData: [],
      tempPD: null,
      tempNote: null,
    };
  },
  computed: {
    patientClassList() {
      //console.log(this.$store.getters.sheetIndexObj[this.form.LendingSheetIndexRefs.LendingSheetIndexOid])
      if (!this.choosePatient) {
        return []
      }else{
        return [...this.choosePatient];
      }
    },
  },
  async created() {
    this.$store.commit("loading", true);
    await this.getData();
    this.$store.commit("loading", false);
  },
  async mounted() {
    
    if (this.isAdd) {
      console.log(`新增+`);
    } else {
      console.log(`編輯~`);
      let resEdit = await this.$api
        .getLendingById(this.editData.LendingId)
        .then((res) => res);

      if (resEdit) {
        // console.log(`resEdit: `, resEdit);
        this.form = {
          ...this.form,
          ...resEdit,
        };
        console.log(`this.form: `, this.form);
      } else {
        this.form = {
          ...this.form,
          ...this.editData,
        };
      }

      if (this.form.AllSheetType === "Y") {
        this.SheetTypes = this.$store.state.sheetTypeList.map((v) => {
          return v.No;
        });
        this.checkAll = true;
      }else{
        this.SheetTypes = this.form.SheetTypes.map((v) => {
          return v.SheetTypeOid;
        });
      }

      if (this.form.AllPatient === "N") {
        if (
          this.form.LendingSheetIndices
          &&
          this.form.LendingSheetIndices.length
        ) {
          this.form.LendingSheetIndices.forEach((v)=>{
            console.log(`v,SheetIndex: `, v.SheetIndex)
            this.choosePatient.push(v.SheetIndex)
          })

          await this.getDictionaryMedical();

          if(this.choosePatient && this.choosePatient.length){
            this.sheetIndexList = cloneDeep(this.choosePatient)
          }
        }
      }
      
    }
  },
  methods: {
    handleSelect(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.$store.state.sheetTypeList.length;
      this.isIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.$store.state.sheetTypeList.length;
    },
    handleCheckAllChange(val) {
      const data = this.$store.state.sheetTypeList.map((item) => {
        return item.No;
      });

      this.SheetTypes = val ? data : [];
      this.isIndeterminate = false;
    },
    async getData() {
      this.accountList = await this.$api
        .getAccountAllList()
        .then((res) => res.Items);

      if(
        this.isAdd
        &&
        this.$store.state.userData
        &&
        this.$store.state.userData.No
      ){
        // console.log(`ready ~`)
        // console.log(`No: `, this.$store.state.userData.No)
        // console.log(`this.accountList: `, this.accountList)
        this.accountList = this.accountList.filter((v)=>{
          return v.No !== this.$store.state.userData.No
        })
      }

    },
    async remoteMethod(e) {
      /*if(e) {
        e=e.toUpperCase()
        this.sheetIndexList=this.$store.state.sheetIndex.filter(res=>res.PatientName.toUpperCase().includes(e)||res.ChartNo.toUpperCase().includes(e)||res.IdNo.toUpperCase().includes(e)).slice(0,20)
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
        // console.log(`remoteMethod: `, this.sheetIndexList);
      } else this.sheetIndexList = [];
    },
    async getDictionaryMedicalById(id) {
      this.tempPD = null;
      let filter = [];
      filter.push(`SheetIndexOid eq '${id}'`);
      filter = filter.length ? filter.join(" and ") : null;

      let data = {
        $filter: filter,
      };

      this.$store.commit("loading", true);
      this.tempPD = await this.$api
        .getSheetEvent(data)
        .then((res) => res.Items);
    },
    async getDictionaryMedical() {
      if (this.choosePatient) {
        this.patientClassList.forEach(async (v, i) => {
          this.tempPD = null;
          await this.getDictionaryMedicalById(v.SheetIndexOid);
          let tempArr = [];
          let tempData = [];

          if (this.tempPD && this.tempPD.length) {
            this.tempPD.forEach((v) => {
              tempArr.push(v.SheetEventOid);
              tempData.push(v);
            });
          }

          this.tempPatientData[i] = {
            SheetIndexOid: v.SheetIndexOid,
            LendingSheetEventOids: tempArr && tempArr.length ? tempArr : [],
            tempSave: tempData,
          };
        });

        console.log(`this.tempPatientData`, this.tempPatientData);

        this.$refs.table.clearSelection();
        this.$store.commit("loading", false);
      } else {
        this.tempPatientData = [];
        this.tableData = [];
        this.$refs.table.clearSelection();
      }
    },
    async tableSelect(e) {
      this.tempNote = e.SheetIndexOid;

      if (this.tempPatientData && this.tempPatientData.length) {
        this.tempPatientData.forEach((v) => {
          v.tempSave.forEach((w) => {
            if (w.isSelected === undefined) {
              w.isSelected = true;
            }
          });
          if (v.SheetIndexOid === e.SheetIndexOid) {
            this.tableData = cloneDeep(v.tempSave);
          }
        });
      }
      if (this.tableData && this.tableData.length) {
        this.$nextTick(() => {
          this.tableData.forEach((v) => {
            if (v.isSelected === true) {
              this.$refs.table.toggleRowSelection(v, true);
            }
          });
        });
      }
    },
    async typeSelect(e) {
      console.log(`typeSelect: `, e);

      let tempIdx = null;

      this.tempPatientData.forEach((v, i) => {
        if (v.SheetIndexOid === this.tempNote) {
          tempIdx = i;
        }
      });

      if (
        tempIdx !== null &&
        this.tableData &&
        e
      ) {
        console.log(`ok, do something ~`);
        this.tempPatientData[tempIdx].tempSave.forEach((v) => {
          v.isSelected = false;
          e.forEach((w) => {
            if(w.SheetEventOid === v.SheetEventOid){
              v.isSelected = true;
            }
          });
        });
      } else {
        console.log(`empty, do nothing ~`);
      }
    },
    async sub() {
      this.$refs.postform.validate((valid) => {
        if (valid) {

          this.$store.commit("loading", true);

          let obj = cloneDeep(this.form);

          let tempSheetType = []

          for (let item of this.SheetTypes) {
            tempSheetType.push({
              SheetTypeOid: item,
            });
          }

          obj.SheetTypes = cloneDeep(tempSheetType)

          if (obj.SheetTypes && obj.SheetTypes.length) {
            if (
              obj.SheetTypes.length === this.$store.state.sheetTypeList.length
            ) {
              obj.AllSheetType = "Y";
              obj.SheetTypes = [];
            } else {
              obj.AllSheetType = "N";
            }
          } else {
            obj.AllSheetType = "N";
          }

          obj.ClaimerOid = obj.LendingAccountNo;

          let tempArr = this.tempPatientData.map((v)=>{
            let temp = v.tempSave.filter((w)=>{
              return w.isSelected === true
            })

            let resultTemp = temp.map((x)=>{
              return x.SheetEventOid
            })

            return {
              SheetIndexOid: v.SheetIndexOid,
              LendingSheetEventOids: resultTemp ? resultTemp : []
            }
          })

          obj.LendingSheetIndexRefs = cloneDeep(tempArr)

          console.log(`postBody: `, obj)

          this.$emit("sub", obj);
          this.$store.commit("loading", false);
        }
      });
    },
    async edit() {
      this.$refs.postform.validate((valid) => {
        if (valid) {
          
          this.$store.commit("loading", true);

          let obj = cloneDeep(this.form);

          let tempSheetType = []

          for (let item of this.SheetTypes) {
            tempSheetType.push({
              SheetTypeOid: item,
            });
          }

          obj.SheetTypes = cloneDeep(tempSheetType)

          if (obj.SheetTypes && obj.SheetTypes.length) {
            if (
              obj.SheetTypes.length === this.$store.state.sheetTypeList.length
            ) {
              obj.AllSheetType = "Y";
              obj.SheetTypes = [];
            } else {
              obj.AllSheetType = "N";
            }
          } else {
            obj.AllSheetType = "N";
          }

          obj.ClaimerOid = obj.LendingAccountNo;

          let tempArr = this.tempPatientData.map((v)=>{
            let temp = v.tempSave.filter((w)=>{
              return w.isSelected === true
            })

            let resultTemp = temp.map((x)=>{
              return x.SheetEventOid
            })

            return {
              SheetIndexOid: v.SheetIndexOid,
              LendingSheetEventOids: resultTemp ? resultTemp : []
            }
          })

          obj.LendingSheetIndexRefs = cloneDeep(tempArr)

          console.log(`putBody: `, obj)

          this.$emit("edit", obj);
          this.$store.commit("loading", false);
        }
      });
    },
  },
  watch: {
    // SheetTypes: {
    //   handler(val) {
    //     console.log(`SheetTypes: `, val);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    choosePatient: {
      handler(val) {
        if (val && val.length) {
          console.log(`choosePatient: `, val)
          this.form.AllPatient = "N";
        }
      },
      immediate: true,
      deep: true,
    },
    "form.AllPatient": {
      handler(val) {
        if (val === "Y") {
          this.choosePatient = [];
          this.tableData = [];
          this.tempPatientData = [];
        }
      },
      immediate: true,
      deep: true,
    },
    // patientClassList: {
    //   handler(val) {
    //     console.log(`patientClassList: `, val);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
};
</script>
