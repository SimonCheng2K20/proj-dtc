<template>
  <div
    class="pageContent"
    style="min-height:829px;"
  >
    <b-card
      id="blockBaseInfo"
      no-body
      class="mx-1"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >
            檢查作業．檢查室︰
            <span class="font-weight-bold">{{ labRoomId }} - {{ masterData.cId }}</span>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left m-0">
        <b-container
          id="baseInfo"
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="申請單號">
                <b-input v-model="masterData.cId" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="開單日期">
                <b-input v-model="masterData.cDt" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="作業進度">
                <b-input v-model="masterData.oStName" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病歷號">
                <b-input v-model="masterData.hId" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患來源">
                <b-input v-model="masterData.pSrName" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查項目">
                <b-input v-model="masterData.iNe" />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="4"
              class="px-1"
            >
              <b-input-group prepend="病患姓名">
                <b-input v-model="masterData.pNe" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="性別">
                <b-input v-model="masterData.pGd" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="身分證號">
                <b-input v-model="masterData.pId" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="出生日期">
                <b-input v-model="masterData.bdy" />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col class="px-1">
              <b-button
                variant="primary"
                class="mr-1"
                :disabled="!buttonState4CheckIn"
                @click="Click4CheckIn"
              >
                <font-awesome-icon icon="check-circle" />報到完成
              </b-button>
              <b-button
                variant="success"
                class="mr-1"
                :disabled="!buttonState4CancelCheckIn"
                @click="Click4CancelCheckIn"
              >
                <font-awesome-icon icon="eraser" />取消報到
              </b-button>
              <b-button
                variant="danger"
                class="mr-1"
                :disabled="!buttonState4BeginCheck"
                @click="Click4BeginCheck"
              >
                <font-awesome-icon icon="radiation" />開始檢查
              </b-button>
              <b-button
                variant="info"
                class="mr-1"
                @click="Click4Exit"
              >
                <font-awesome-icon icon="reply" />返回
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-card
      id="blockInputForm"
      no-body
      class="mx-1 mt-1"
      v-show="blockState4InputForm"
    >
      <b-card-header class="bg-success text-white cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >檢查作業．登錄區</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="放射師">
                <b-select
                  v-model="selectedRadiographer"
                  :options="optionsRadiographer"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="護理師">
                <b-select
                  v-model="selectedNurse"
                  :options="optionsNurse"
                />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="3"
              class="pr-1"
            >
              <b-card no-body>
                <b-card-header class="bg-warning font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >檢驗報告</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text>
                  <twp
                    ref="twp4Lab"
                    v-bind:FieldConfig="tableConfig4QueryLab"
                    v-bind:RowData="tableContent4QueryLab"
                    NoPaging
                  ></twp>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              sm="3"
              class="pr-1"
            >
              <b-card no-body>
                <b-card-header class="bg-info text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >過敏記錄</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text>
                  <twp
                    ref="twp4ADR"
                    v-bind:FieldConfig="tableConfig4QueryADR"
                    v-bind:RowData="tableContent4QueryADR"
                    NoPaging
                  ></twp>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col>
              <b-card no-body>
                <b-card-header class="bg-primary text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >檢查註記</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-1">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <b-textarea
                        no-resize
                        rows="5"
                      ></b-textarea>
                    </b-row>
                    <b-row
                      no-gutters
                      class="text-right my-1"
                    >
                      <b-col class="float-right">
                        <b-button variant="success">
                          <font-awesome-icon icon="eraser" />清除
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col>
              <b-card no-body>
                <b-card-header class="bg-danger text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >藥品耗材</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-1">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <b-col>
                        <twp
                          ref="twp4MaS"
                          v-bind:FieldConfig="tableConfig4MandS"
                          v-bind:RowData="tableContent4MandS"
                          OpButton1Text="編輯"
                          v-bind:OpButton1Func="RowClickFunc1"
                          OpButton2Text="刪除"
                          v-bind:OpButton2Func="RowClickFunc2"
                        ></twp>
                      </b-col>
                    </b-row>
                    <b-row
                      no-gutters
                      class="mt-1"
                    >
                      <b-col
                        cols="6"
                        class="float-left text-left ml-1"
                      >
                        <b-button
                          variant="outline-primary"
                          @click="Click4NewMaS"
                        >
                          <font-awesome-icon icon="plus" />新增記錄
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1 text-right"
          >
            <b-col class="px-1">
              <b-button
                variant="success"
                class="mr-1"
                @click="Click4CancelOp"
              >
                <font-awesome-icon icon="eraser" />取消登錄
              </b-button>
              <b-button
                variant="info"
                class="mr-1"
                @click="Click4Exit"
              >
                <font-awesome-icon icon="power-off" />檢查完畢
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-modal
      :ref="id4EditWindow"
      id="editWindow"
      centered
      hide-footer
      title-class="lang-zh-Hant-TW"
      body-class="lang-zh-Hant-TW"
    >
      <template slot="modal-title">{{ editWindowTitle }}</template>
      <b-container
        fluid
        id="editWindowForm"
      >
        <b-row>
          <b-col>
            <b-input-group prepend="檢查項目">
              <b-input
                v-model="masterData.iNe"
                disabled
                class="text-primary"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col>
            <b-input-group>
              <b-input-group-text
                slot="prepend"
                class="field-Must"
              >藥品耗材</b-input-group-text>
              <b-select
                ref="select4MaS"
                autofocus
                v-model="editWindowForm.selectedItem"
                :options="editWindowForm.optionsItem"
                class="font-weight-bold"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col>
            <b-input-group>
              <b-input-group-text
                slot="prepend"
                class="field-Must"
              >使用數量</b-input-group-text>
              <b-input
                type="number"
                min="1"
                v-model="editWindowForm.qtyItem"
                class="text-right font-weight-bold"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col class="text-right">
            <b-btn
              variant="info"
              @click="OnAbortSave"
              class="mr-1"
            >
              <b>
                <i class="fas fa-trash"></i> 取消
              </b>
            </b-btn>
            <b-btn
              variant="danger"
              @click="OnRecordSave"
            >
              <b>
                <i class="fas fa-save"></i> 確認
              </b>
            </b-btn>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
/*
- Free T4 = 定量偵測人類血清血清中游離甲狀腺素(Free T4)的含量，以評估甲狀腺功能
> 濃度(單位) : (組合標準量測不確定度(±2SD) 95%信賴區間) (1) 0.81 ng/dL: 0.7 ~ 0.9 ng/dL； (2) 2.61 ng/dL: 2.3 ~ 2.9 ng/dL； (3) 4.77 ng/dL: 4.5 ~ 5.1 ng/dL
- eGFR = estimated Glomerular Filtration Rate (估算的腎絲球過濾率), 用來篩檢早期腎損傷幫助診斷慢性腎臟疾病（CKD）的指標。它是根據血液中的肌酸酐、年齡、性別、種族換算發展出來的一個簡單的公式，單位是mL / min / 1.73m2
> 慢性腎病依 eGFR 區分為 5 期:
第一期：eGFR 90-100 mL/min/1.73m2,正常或微小的腎臟損傷與正常腎絲球過濾率，尿液中的蛋白質或白蛋白可能是高值，此期尿液中很少見到細胞或圓柱體。
第二期：eGFR 60-89 mL/min/1.73m2,腎絲球過濾率輕度下降，尿液中的蛋白質或白蛋白可能是高值，此期尿液中很少見到細胞或圓柱體。
第三期：eGFR 30-59 mL/min/1.73m2,腎絲球過濾率中度降低，腎臟發生了一些損傷。可以重複測試以查看異常結果是否仍然存在，超過三個月時，慢性腎病。
第四期：eGFR 15-29 mL/min/1.73m2，腎絲球過濾率嚴重下降。
第五期：eGFR ＜ 15 mL/min/1.73m2，腎衰竭。
*/
const id4EditWindow = "WinEdit0202";
import { mapGetters, mapMutations } from "vuex";
import twp from "@/components/TWPv2";
import { getEmployeeDataByType } from "@/assets/service/dataManager.js";
const queryResult = require("@/assets/DataSource/DR0101001");
const checkItem = require("@/assets/DataSource/DR0407001");
const patientSource = require("@/assets/DataSource/DR0431001");
const opProgress = require("@/assets/DataSource/DR04X1001");
const opPRadiographer = require("@/assets/DataSource/DR0423002");
const opPNurse = require("@/assets/DataSource/DR0423003");
const queryLaboratory = require("@/assets/DataSource/DR04Y1001");
const queryADR = require("@/assets/DataSource/DR04Y2001");
const opMandS = require("@/assets/DataSource/DR0408001");
const dsMandS = require("@/assets/DataSource/DR0408002");

/**
 * 為指定的 html tag id 加上或取消遮罩
 * @param {string} id HTML tag id
 * @param {boolean} flag 加上或取消遮罩, 預設: true-加上遮罩
 */
function areaBlock (id, flag = true) {
  if (flag) {
    $("#" + id).block({
      message: "",
      overlayCSS: { backgroundColor: "#fff", opacity: 0.3, cursor: "wait" },
      fadeIn: 0,
      fadeOut: 0
    });
  } else {
    $("#" + id).unblock();
  }
}

export default {
  name: "FI0202",
  components: { twp },
  data () {
    return {
      BasePath: this.$route.path,
      id4EditWindow: id4EditWindow,
      labRoomId: "CR001",
      masterGUId: null,
      masterData: {},
      buttonState4CheckIn: true,
      buttonState4CancelCheckIn: false,
      buttonState4BeginCheck: false,
      buttonState4CheckCompleted: false,
      blockState4InputForm: false,
      selectedRadiographer: "e56e700ed92140fe8ee43c9d466e4df1",
      optionsRadiographer: [],
      selectedNurse: "01212b396afd425882c620d8db081b57",
      optionsNurse: [],
      tableConfig4QueryLab: [],
      tableContent4QueryLab: [],
      tableConfig4QueryADR: [],
      tableContent4QueryADR: [],
      tableConfig4MandS: [],
      tableContent4MandS: [],
      editWindowTitle: "",
      editWindowForm: {
        editState: 0,
        xuid: "",
        selectedItem: null,
        optionsItem: [],
        qtyItem: 0
      }
    };
  },
  computed: {
    ...mapGetters(['getDxDrs']),
    allowCheckIn () {
      return this.masterData && this.masterData.oSt !== 31;
    }
  },
  methods: {
    ...mapMutations(['SET_DX_DR']),
    async GetDxPhysician () {
      if (this.getDxDrs.length === 0) {
        const empDx = await getEmployeeDataByType("21,23,25,27,28,29");
        this.SET_DX_DR(empDx.result);
      }
    },
    GetEditWindowTitle () {
      return (
        (this.editWindowForm.editState === 1 ? "新增" : "修改") + "︰藥品、耗材"
      );
    },
    Click4CheckIn () {
      this.masterData.oSt = 41;
      this.masterData.oStName = opProgress.GetText(this.masterData.oSt);
      this.$nextTick(() => {
        this.buttonState4CheckIn = false;
        this.buttonState4CancelCheckIn = true;
        this.buttonState4BeginCheck = true;
      });
    },
    Click4CancelCheckIn () {
      this.masterData.oSt = 31;
      this.masterData.oStName = opProgress.GetText(this.masterData.oSt);
      this.$nextTick(() => {
        this.buttonState4CheckIn = true;
        this.buttonState4CancelCheckIn = false;
        this.buttonState4BeginCheck = false;
      });
    },
    Click4BeginCheck () {
      this.masterData.oSt = 51;
      this.masterData.oStName = opProgress.GetText(this.masterData.oSt);
      areaBlock("blockBaseInfo");
      this.blockState4InputForm = true;
    },
    Click4Exit () {
      this.$router.replace(
        this.BasePath.replace("/" + this.$route.params.guid, "")
      );
    },
    Click4CancelOp () {
      this.masterData.oSt = 41;
      this.masterData.oStName = opProgress.GetText(this.masterData.oSt);
      areaBlock("blockBaseInfo", false);
      this.blockState4InputForm = false;
    },
    Click4NewMaS () {
      this.editWindowForm.editState = 1;
      this.editWindowTitle = this.GetEditWindowTitle();
      this.editWindowForm.optionsItem = opMandS.Options(this.masterData.iId);
      this.editWindowForm.selectedItem = null;
      this.editWindowForm.qtyItem = 1;
      //
      this.$refs[id4EditWindow].show();
    },
    RowClickFunc1 (x) {
      if (x) {
        this.editWindowForm.editState = 2;
        this.editWindowTitle = this.GetEditWindowTitle();
        this.editWindowForm.optionsItem = opMandS.Options(this.masterData.iId);
        this.editWindowForm.selectedItem = x.guid;
        this.editWindowForm.qtyItem = x.dose;
        this.editWindowForm.xuid = x.xuid;
        //
        var set4MaS = [];
        set4MaS = opMandS.GetRow(this.editWindowForm.selectedItem);
        //
        this.$refs[id4EditWindow].show();
      }
    },
    RowClickFunc2 (x) {
      if (x) {
        var index = -1;
        this.tableContent4MandS.some((e, idx, ary) => {
          if (e.xuid === x.xuid) {
            index = idx;
            return true;
          }
        });
        if (index > -1) {
          this.tableContent4MandS.splice(index, 1);
          var newOrder = 0;
          this.tableContent4MandS.forEach(e => {
            newOrder++;
            e.tdId = newOrder;
          });
        } else {
          alert("??!!");
        }
      }
    },
    OnAbortSave () {
      this.$refs[id4EditWindow].hide();
      alert("abort");
    },
    OnRecordSave () {
      var opNew = this.editWindowForm.editState === 1;
      console.log(
        this.$logs(
          `${opNew ? "新增" : "修改"} - sI:${this.editWindowForm.selectedItem}`
        )
      );
      if (this.editWindowForm.selectedItem) {
        this.$refs[id4EditWindow].hide();
        //
        var set4MaS = opMandS.GetRow(this.editWindowForm.selectedItem);
        if (set4MaS && set4MaS.length > 0) {
          var newItem = JSON.parse(JSON.stringify(set4MaS[0]));
          //
          if (opNew) {
            //
            newItem.xuid = this.$GetGUID();
            newItem.tdId = this.tableContent4MandS.length + 1;
            newItem.dose = this.editWindowForm.qtyItem;
            //
            this.tableContent4MandS.push(newItem);
            //
          } else {
            //
            var orig;
            var index = -1;
            this.tableContent4MandS.some((e, idx) => {
              if (e.xuid === this.editWindowForm.xuid) {
                orig = JSON.parse(JSON.stringify(e));
                index = idx;
                return true;
              }
            });
            if (index > -1) {
              //
              newItem.xuid = orig.xuid;
              newItem.tdId = orig.tdId;
              newItem.pId = orig.pId;
              newItem.dose = this.editWindowForm.qtyItem;
              //
              this.tableContent4MandS[index] = newItem;
              //
              this.$refs.twp4MaS.OnForceRefresh();
              //
            } else {
              console.log(`Not found`);
            }
          }
          //
        } else {
          console.log(`Can't get MaS`);
        }
        //
      } else {
        alert("藥品、耗材尚未選定!");
        this.$refs.select4MaS.$el.focus();
      }
    }
  },
  created () {
    // console.clear();
    // console.log(this.$DateTimeNow());
    // console.log(this.$GetTimeStamp());
    this.GetDxPhysician(); // 取得分派醫師
    this.masterGUId = this.$route.params.guid;
    if (this.masterGUId) {
      var res = [];
      res = queryResult.DataRow(this.masterGUId);
      if (res && res.length > 0) {
        this.masterData = res[0];
        this.$set(
          this.masterData,
          "pSrName",
          patientSource.GetText(this.masterData.pSr)
        );
        this.$set(this.masterData, "oSt", 31);
        this.$set(
          this.masterData,
          "oStName",
          opProgress.GetText(this.masterData.oSt)
        );
        //this.masterData.pNe = '壹貳参肆伍陸柒捌玖拾壹貳参肆伍陸柒捌玖'
      }
      //console.log(this.masterData)
    }
    //
    this.optionsRadiographer = opPRadiographer.Options();
    this.optionsNurse = opPNurse.Options();
    //
    this.tableConfig4QueryLab = queryLaboratory.PresentConfig();
    this.tableContent4QueryLab = queryLaboratory.DataSet();
    this.tableConfig4QueryADR = queryADR.PresentConfig();
    this.tableContent4QueryADR = queryADR.DataSet();
    //
    this.tableConfig4MandS = dsMandS.PresentConfig();
    this.tableContent4MandS = dsMandS.DataSet(this.masterData.pId);
  },
  mounted () { }
};
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
input:disabled {
  background-color: rgba(250, 250, 250, 0.7);
}
.input-group-text {
  background-color: rgba(255, 255, 255, 0.7);
}
.field-Must {
  color: #f00;
}
</style>
