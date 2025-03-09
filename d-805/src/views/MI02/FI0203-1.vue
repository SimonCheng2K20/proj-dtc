<template>
  <div
    class="pageContent"
    style="min-height:829px;"
  >
    <b-card
      id="blockBaseInfo"
      no-body
      class="mx-1 border"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >藥品耗材登打頁面</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1 m-0">
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
                <b-input
                  v-model="masterData.AccessionNo"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="開單日期">
                <b-input
                  v-model="masterData.OrderDate"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="作業進度">
                <b-input
                  v-model="masterData.StatusName"
                  readonly
                />
              </b-input-group>
            </b-col>

            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患來源">
                <b-input
                  v-model="masterData.PatientSourceTypeName"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="身分證號">
                <b-input
                  v-model="masterData.OtherPatientId"
                  readonly
                />
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
                <b-input
                  v-model="masterData.PatientName"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病歷號">
                <b-input
                  v-model="masterData.PatientId"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="性別">
                <b-input
                  v-model="masterData.PatientSex"
                  readonly
                />
              </b-input-group>
            </b-col>

            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患年齡">
                <b-input
                  v-model="masterData.PatientAge"
                  readonly
                />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查代碼">
                <b-input
                  v-model="masterData.ProcedureCode"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="6"
              class="px-1"
            >
              <b-input-group prepend="檢查項目">
                <b-input
                  v-model="masterData.ProcedureName"
                  readonly
                />
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-text>
        <b-row no-gutters>
          <b-col>
            <div class="float-left ml-1 py-1">
              <b-btn
                ref="btnAppend"
                variant="danger"
                size="sm"
                @click="addMedication"
              > <i class="fas fa-plus"></i> 新增藥品 </b-btn>
              <!-- v-if="showbtn==1" -->
              <b-btn
                ref="btnAppend"
                v-if="showSave"
                variant="danger"
                class="ml-1"
                size="sm"
                @click="SaveAll"
              >
                <font-awesome-icon
                  icon="save"
                  class="mr-1"
                />儲存 </b-btn>
              <!-- v-if="showbtn==0 || this.masterData.IsMedicationActionName=='已完成'" -->
              <!--  :disabled="this.masterData.IsMedicationActionName=='已完成'" -->
              <b-btn
                ref="btnAppend"
                v-if="showNoData"
                :disabled="disabledNoData"
                :variant="disabledNoData ? 'dark' : 'danger'"
                class="ml-1"
                size="sm"
                @click="SaveAll"
              >
                <font-awesome-icon
                  :icon="disabledNoData ? '' : 'save'"
                  class="mr-1"
                />
                {{ disabledNoData ? "無藥品登打" : "儲存(無藥品紀錄)" }}
              </b-btn>
              <b-button
                variant="info"
                size="sm"
                class="ml-1"
                @click="reply"
              > <i class="fas fa-reply"></i> 返回 </b-button>
            </div>
          </b-col>
        </b-row>
        <!-- :CheckBox1Func="EditMedication" -->
        <!-- :RowData="MedicationContent" -->
        <twp
          v-if="!isFetchData"
          ref="medicationList"
          v-bind:FieldConfig="MedicationConfig"
          :DataFetch="GetDataContent"
          :OpButton1Func="addCount"
          OpButton1Text="+"
          :OpButton2Func="cutCount"
          OpButton2Text="-"
          :OpButton3Func="delData"
          OpButton3Text="刪除"
          :onRowdbClick="onRowClick"
          :EnDBClick="true"
        ></twp>
      </b-card-text>
    </b-card>
    <b-modal
      size="lg"
      ref="medicineMaintain"
      centered
      hide-footer
      title-class="lang-zh-Hant-TW"
      body-class="lang-zh-Hant-TW"
    >
      <template slot="modal-title">檢查項目:{{ masterData.ProcedureName }}</template>
      <b-container fluid>
        <b-row>
          <b-col
            cols="12"
            class="mt-1"
          >
            <b-input-group>
              <b-input-group-text
                slot="prepend"
                list="my-list-id"
                class="field-Must"
              >藥品耗材</b-input-group-text>

              <multiselect
                placeholder="請選擇"
                label="text"
                v-model="holder"
                :options="filterSelectedItem"
                style="max-width:640px;"
              ></multiselect>
            </b-input-group>
          </b-col>
          <b-col
            cols="12"
            class="mt-1"
          >
            <b-input-group prepend="計價方式">
              <b-select
                v-model="medicineList.selectType"
                :options="medicineList.optionsType"
              />
            </b-input-group>
          </b-col>
          <b-col
            cols="12"
            class="mt-1"
          >
            <b-input-group>
              <b-input-group-text
                slot="prepend"
                class="field-Must"
              >使用數量</b-input-group-text>
              <b-input
                type="number"
                min="1"
                v-model="medicineList.qty"
                class="text-left font-weight-bold"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1"></b-row>
        <b-row class="mt-1">
          <b-col class="text-right">
            <b-btn
              variant="info"
              class="mr-1"
              @click="cancel"
            >
              <b> <i class="fas fa-trash"></i> 取消 </b>
            </b-btn>
            <b-btn
              variant="danger"
              @click="SaveMedication"
            >
              <b> <i class="fas fa-save"></i> 確認 </b>
            </b-btn>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal
      ref="confirm"
      centered
      hide-footer
      title-class="lang-zh-Hant-TW"
      body-class="lang-zh-Hant-TW"
      title="資料有異動 是否儲存"
    >
      <b-row class="mt-1">
        <b-col class="text-right">
          <b-btn
            variant="info"
            class="mr-1"
            @click="CancelSave"
          >
            <b> <i class="fas fa-trash"></i> 取消 </b>
          </b-btn>
          <b-btn
            variant="danger"
            @click="confirmSave"
          >
            <b> <i class="fas fa-save"></i> 確認 </b>
          </b-btn>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      ref="showMessage"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
      title="貼心提醒"
    >
      <p>此筆檢查目前為無藥品狀態，是否繼續輸入藥品資料?</p>
      <b-btn
        variant="danger"
        @click="showmedicineMaintain(null)"
      >
        <b> <i class="fas fa-save"></i> 確認 </b>
      </b-btn>
      <b-btn
        variant="info"
        class="ml-1"
        @click="hideessage"
      >
        <b> <i class="fas fa-trash"></i> 取消 </b>
      </b-btn>
    </b-modal>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import twp from "@/components/TWPv5_1";
import { saveMedicationList } from "@/assets/service/dataManager.js";

export default {
  name: "FI0203-1",
  components: { twp, Multiselect },
  data () {
    return {
      isFetchData: true,
      holder: "",
      //按鈕顯示控制
      //儲存按鈕是否顯示
      showSave: true,
      //無藥品登打按鈕是否顯示
      showNoData: true,
      //無藥品登打按鈕是否啟用
      disabledNoData: true,

      isEditing: false,
      masterData: null,
      MedicationConfig: [
        {
          key: "No",
          label: "項次",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap text-right",
        },
        {
          key: "PriceTypeName",
          label: "計價方式",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap",
        },
        {
          key: "MedicationNo",
          label: "院內編號",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap font-weight-bold",
        },
        {
          key: "MedicationName",
          label: "藥品耗材名稱",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap text-left",
        },
        {
          key: "Quantity",
          label: "數量",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap font-weight-bold text-right",
        },
      ],
      MedicationContent: [],
      //第一次帶入的資料(用以比對前後的資料是否有異動)
      TempMedicationContent: [],
      //用來記錄原始藥品資料
      TempoptionsItems: [],
      medicineList: {
        //Note:有註解的資料要寫回DB內
        //所選的類別
        // classSelectedItem: "",
        // classOptionsItem: [],
        //所選的藥品耗材 用 -- 分開 前代碼 中名稱 後子代碼(說明)
        selectedItem: "",
        optionsItems: [],
        //計價方式(選)
        selectType: "001",
        //計價方式(Source)
        optionsType: window.medicineList_optionsType,
        //數量
        qty: 1,
      },
      //是否可以輸入資料
      inputDisable: false,
      medicineDisable: true,
      ObjApp: null,
      keyUpTimer: null,
      //判斷耗材登打畫面是新增 或 編輯
      //0:新增  1:編輯
      tempStoreItem: null,
      pagenation: {
        current: 1,
        perPage: 10,
      },
    };
  },
  computed: {
    // medications() {

    //   // this.MedicationContent

    //   this.MedicationContent.filter((item, index) => {
    //     const start = (this.pagenation.current - 1) * this.pagenation.perPage;
    //     const end = (this.pagenation.current * this.pagenation.perPage;
    //     index > this.pagenation.current - 1 && index < this.pagenation.perPage
    //   });

    //   this.pagenation.current

    // },
    filterSelectedItem () {
      return [...this.TempoptionsItems.filter(({ text, value }) => text && value)];
    },
  },
  methods: {
    GetDataContent (params, page, perPage) {
      // this.Rows = dataSet.Items;
      // this.RowCount = dataSet.Count;

      return {
        Count: this.MedicationContent.length,
        Items: this.MedicationContent.filter((item, index) => {
          const start = (page - 1) * perPage;
          const end = page * perPage;
          return index >= start && end;
        }),
      };

      // console.log({ params, page, perPage, rows: this.MedicationContent, twp: this.$refs.medicationList });
      // this.pagenation.current = page;
      // this.pagenation.perPage = perPage;

      // this.$refs.medicationList.refresh();
      // this.$refs.medicationList.OnForceRefresh();
      // this.$refs.medicationList.PagingCurrentPage
      // this.$refs.medicationList.PagingRowPerPage

      // PagingCurrentPage
      // PagingRowPerPage
    },
    priceTypeToPriceTypeName (type) {
      if (!this.medicineList.optionsType || this.medicineList.optionsType.length == 0) {
        return "計價代碼:" + (type ? type : "未設定");
      }
      let name = "";
      this.medicineList.optionsType.some((i) => {
        if (i.value == type && i.value != null) {
          name = i.text;
        }
      });
      if (name.length > 0) return name;
      return "計價代碼:" + (type ? type : "未設定");
    },
    cancel () {
      this.$refs["medicineMaintain"].hide();
    },
    //新增藥品數量
    addCount (x) {
      x.Quantity = x.Quantity + 1;
    },
    //減少藥品數量
    cutCount (x) {
      if (x.Quantity <= 1) {
        return;
      }
      x.Quantity = x.Quantity - 1;
    },
    keyupDelay (cb, ms) {
      let timer = 0;
      const context = this,
        args = arguments;
      if (this.keyUpTimer) clearTimeout(this.keyUpTimer);
      this.keyUpTimer = setTimeout(function () {
        cb.apply(context, args);
      }, ms || 0);
    },

    delData (item) {
      this.MedicationContent = this.MedicationContent.filter(({ MedicationId }) => item.MedicationId !== MedicationId);
      this.MedicationContent.forEach((s, i) => (s.No = i + 1));
      if (this.masterData.IsMedicationActionName != "已完成") {
        //有資料
        if (this.MedicationContent.length > 0) {
          this.showSave = true;
          this.showNoData = false;
          this.disabledNoData = true;
        } else {
          this.showSave = false;
          this.showNoData = true;
          this.disabledNoData = false;
        }
      }
      //已登打過
      else {
        if (this.MedicationContent.length > 0) {
          this.showSave = true;
          this.showNoData = false;
          this.disabledNoData = true;
        } else {
          this.showSave = false;
          this.showNoData = true;
          this.disabledNoData = false;
        }
      }
      this.$refs.medicationList.OnForceRefresh();
    },
    //取得藥品資料 savetemp判斷是否更改比對欄位
    async GetMedicationData (savetemp) {
      //呼叫modal 將相關資料打入...
      //打API取得藥品相關資料 SHOW在MedicationContent裡面
      let subPath = "../exam/GetExamMedicationList" + "?accessionNo=" + this.masterData.AccessionNo;

      //
      let _this = this;

      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query()) //.sortByDesc('Name')
        .then((r) => {
          // let data = r.actual.Items; //資料;

          let data = r.actual.Items.map((item, i) => ({
            ...item,
            No: i + 1,
            PriceType: item.PriceType || "001",
            MedicationName: item.Name + (item.SubName ? " - " + item.SubName : ""),
          }));

          // data = data.sort((t1, t2) => t1.MedicationNo > t2.MedicationNo ? 1 : -1);

          // console.log({ data });

          // data.forEach((item, i) => {
          //   if (!item.PriceType) item.PriceType = "001";
          //   item.No = i + 1;
          // });

          //先判斷有無登打過
          //未登打
          // console.log(_this.masterData.IsMedicationActionName);
          // console.log(data);
          //判斷畫面按鈕之邏輯
          if (_this.masterData.IsMedicationActionName != "已完成") {
            //有資料
            if (data.length > 0) {
              _this.showSave = true;
              _this.showNoData = false;
              _this.disabledNoData = true;
            } else {
              _this.showSave = false;
              _this.showNoData = true;
              _this.disabledNoData = false;
            }
          }
          //已登打過
          else {
            if (data.length > 0) {
              _this.showSave = true;
              _this.showNoData = false;
              _this.disabledNoData = true;
            } else {
              _this.showSave = false;
              _this.showNoData = true;
              _this.disabledNoData = true;
            }
          }

          this.MedicationContent = data;
          this.isFetchData = false;
          if (savetemp) {
            _this.TempMedicationContent = _this.$DeepCopy(data);
          }
          _this.$refs["medicineMaintain"].hide();
        });
    },
    //返回上一頁
    reply () {
      this.$router.replace({
        name: "FI0203",
      });
    },
    //雙擊 編輯藥品耗材輸入
    onRowClick (x) {
      this.showmedicineMaintain(x);
    },
    //新增藥品耗材 (show畫面)
    addMedication () {
      // console.log(this.MedicationContent);
      if (this.masterData.IsMedicationActionName == "已完成" && this.MedicationContent.length == 0) {
        this.$refs["showMessage"].show();
      } else {
        this.showmedicineMaintain(null);
      }
    },
    showmedicineMaintain (item) {
      (this.medicineList.selectedItem = ""), (this.medicineList.selectType = ""), (this.medicineList.qty = 1), (this.holder = null);

      this.tempStoreItem = item;
      if (item && item.MedicationNo) {
        //用來分辨 此筆資料 是新增或是編輯
        //0:新增
        //1:編輯
        const itemText = [item.MedicationNo, item.Name, item.SubName].filter((v) => !!v).join(" - ");
        this.holder = this.filterSelectedItem.find((item) => {
          if (itemText == item.text) return item;
        });
        this.medicineList.selectType = item.PriceType;
        this.medicineList.qty = item.Quantity;
        this.medicineList.selectType = item.PriceType;
        this.medicineList.qty = item.Quantity;
      } else {
        this.medicineList.selectType = "001";
      }

      this.$refs["showMessage"].hide();
      this.$refs["medicineMaintain"].show();
    },
    hideessage () {
      this.$refs["showMessage"].hide();
    },
    async SaveAll () {
      // let dataArray = this.MedicationContent.map(({ MedicationId, MedicationName, MedicationNo, Name, No, PriceType, PriceTypeName, Quantity, SubName }) => ({
      //   MedicationId, MedicationName, MedicationNo, Name, No, PriceType, PriceTypeName, Quantity, SubName
      // }));
      if (this.MedicationContent.length > 0) {
        this.showbtn = 1;
      } else {
        this.showbtn = 0;
      }

      try {
        await saveMedicationList(this.masterData.AccessionNo, this.$DeepCopy(this.MedicationContent));
        this.TempMedicationContent = this.$DeepCopy(this.MedicationContent);
        //若下方資料列為0 表示按下無藥品登打
        if (this.MedicationContent.length == 0) {
          this.$router.replace({
            name: "FI0203",
          });
        }
        this.ObjApp.TimingMessage("儲存作業已完成.", 1);
      } catch (err) {
        window.console.log(error);
      }
    },
    //不作任何儲存 回復TEMP資料
    async CancelSave () {
      try {
        await saveMedicationList(this.masterData.AccessionNo, this.$DeepCopy(this.TempMedicationContent));
        this.MedicationContent = this.$DeepCopy(this.TempMedicationContent);
        this.$refs["confirm"].hide();
        this.$router.replace({
          name: "FI0203",
        });
      } catch (err) {
        Swal.fire("儲存失敗！", err, "error");
      }
    },
    //取得藥品下拉選單
    async GetMedicationList () {
      // let convertedCollections = [{ value: null, text: "請選擇" }];
      //打API並塞入所有藥品
      let subPath = "../medication/ExamMedicationList";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query().sortBy("Id"))
        .then((r) => {
          this.medicineList.optionsItems = this.TempoptionsItems = r.result.map(({ MedicationNo, MedicationId, Name, SubName }) => ({
            value: MedicationNo,
            text: MedicationNo + " - " + Name + (SubName ? " - " + SubName : ""),
            id: MedicationId
          }));
        });
    },
    // //取得計價方式
    async GetPriceTypeList () {
      if (!this.medicineList.optionsType || this.medicineList.optionsType.length == 0) {
        let convertedCollections = [{ value: null, text: "請選擇" }];
        //打API並塞入所有藥品
        let subPath = "../generalData/SelectNoList?groupNo=PriceType";
        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true,
        })
          .executeQuery(new Query())
          .then((r) => {
            let data = r.result; //資料;

            data.forEach((i) => {
              let collection = {
                value: i.No,
                text: i.Name,
              };
              convertedCollections.push(collection);
            });

            this.medicineList.optionsType = convertedCollections;
          });
      }
    },
    //儲存 全面儲存
    async confirmSave () {

      try {
        await saveMedicationList(this.masterData.AccessionNo, this.$DeepCopy(this.MedicationContent));
        Swal.fire({
          type: "success",
          title: "儲存完成",
          timer: 1500,
        });
        this.TempMedicationContent = this.$DeepCopy(this.MedicationContent);
        this.$router.replace({
          name: "FI0203",
        });
      } catch (err) {
        Swal.fire("儲存失敗！", err, "error");
      }
    },
    //新增藥品 確定儲存(單筆寫入) (SaveM)
    async SaveMedication () {
      let success = true;
      const isNotOk = this.medicineList.selectedItem == "" && !this.holder;
      if (this.medicineList.qty <= 0 || isNotOk || this.medicineList.selectType == "") {
        success = false;
      }

      let _this = this;
      if (!success) {
        this.ObjApp.TimingMessage("資料登打有誤，請重新輸入.", 2);
      } else {
        //table裡面舊藥品data []
        let dataArray = this.$DeepCopy(this.MedicationContent);
        //to-do
        //非新增
        if (this.tempStoreItem) {
          dataArray.some((i) => {
            if (i.MedicationId == _this.tempStoreItem.MedicationId) {
              i.MedicationNo = this.holder.value; //_this.medicineList.selectedItem.split("--")[0];
              i.Quantity = _this.medicineList.qty;
              i.PriceType = _this.medicineList.selectType;
              return true;
            }
          });
        }
        //新增
        else {
          // 本次新增的資料;
          const { value, text, id } = this.holder;

          const PriceTypeName = this.medicineList.optionsType.find(({ value }) => this.medicineList.selectType === value)["text"];
          success = !!value && !!text && PriceTypeName;
          const [Name, SubName] = text.split(" - ").filter((t) => t != value);
          // console.log(Name, SubName);
          var inputdata = {
            MedicationNo: value,
            MedicationId: id,
            Quantity: this.medicineList.qty,
            PriceType: this.medicineList.selectType,
            Name,
            SubName,
            PriceTypeName,
          };

          console.log({ inputdata });
          // 確認有無重覆藥品 conditions = 藥品號碼, 子名稱, 計價方式 只要有重覆就算失敗
          success = !dataArray.some(
            ({ MedicationNo, MedicationId, SubName, PriceType }) =>
              MedicationNo == inputdata.MedicationNo &&
              SubName == inputdata.SubName &&
              PriceType == inputdata.PriceType &&
              MedicationId == inputdata.MedicationId
          );
        }

        if (success) {
          if (!this.tempStoreItem) dataArray.push(inputdata);

          try {
            await saveMedicationList(this.masterData.AccessionNo, dataArray);
            this.holder = null;
            Swal.fire({
              type: "success",
              title: "登打完成",
              timer: 1500,
            });
            //重刷畫面資料
            this.isFetchData = true;
            this.GetMedicationData(false);
          } catch (err) {
            let msg = "";
            if (err.response.data.Message) msg = err.response.data.Message;
            this.ObjApp.TimingMessage("儲存失敗!! " + msg, 2);
          }
        } else {
          this.ObjApp.TimingMessage("輸入之藥品已存在!!", 2);
        }
      }
    },
  },

  created () {
    this.masterData = this.$route.params.patientData;

    if (!this.masterData) {
      this.$router.replace({ name: "FI0203" });
    }
    //取得打API時 需 Hold住畫面的Mehtod
    // let methodName = "created";
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      // console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }

    //放入藥品資料
    this.$nextTick(() => {
      this.GetMedicationData(true);
    });
    //取藥品下拉選單(新增用)
    this.GetMedicationList();
    //取計價方式(新增用)
    this.GetPriceTypeList();
  },
  beforeRouteLeave (to, from, next) {
    let same = true;
    if (this.TempMedicationContent.length != this.MedicationContent.length) same = false;
    if (same) {
      same = this.TempMedicationContent.every((temp) =>
        this.MedicationContent.some((item) => item.MedicationNo === temp.MedicationNo && item.Quantity === temp.Quantity)
      );
    }

    if (same) {
      next();
    } else {
      this.$refs["confirm"].show();
    }
  },
  watch: {
    holder (val) {
      //alert(JSON.stringify(val));
      //this.medicineList.selectedItem = val.value;
    },
  },
};
</script>

<style lang="scss">
.modal-content {
  border: 1px solid;
}
</style>
