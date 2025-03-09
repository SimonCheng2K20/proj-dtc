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
          >
            檢查作業．檢查室︰
            <span class="font-weight-bold">{{ labRoomId }}</span>
          </b-col>
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
                  v-model="masterData.cId"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="4"
              class="px-1"
            >
              <b-input-group prepend="開單日期">
                <b-input
                  v-model="masterData.cDt"
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
                  v-model="masterData.oStName"
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
                  v-model="masterData.pSrName"
                  readonly
                />
              </b-input-group>
            </b-col>

            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="儀器類型">
                <b-input
                  v-model="masterData.modality"
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
              <b-input-group prepend="病歷號">
                <b-input
                  v-model="masterData.hId"
                  readonly
                />
              </b-input-group>
            </b-col>

            <b-col
              sm="4"
              class="px-1"
            >
              <b-input-group prepend="病患姓名">
                <b-input
                  v-model="masterData.pNe"
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
                  v-model="masterData.pGd"
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
                  v-model="masterData.pId"
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
                  v-model="masterData.pAge"
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
              sm="12"
              class="px-1"
            >
              <b-input-group prepend="檢查項目">
                <b-input
                  v-model="masterData.iNe"
                  readonly
                />
              </b-input-group>
            </b-col>
          </b-row>
          <!-- <b-row no-gutters class='mt-1'>
						<b-col class='px-1'>
							<b-button variant="primary" class='mr-1' :disabled='!buttonState4CheckIn' @click='Click4CheckIn'><font-awesome-icon icon="check-circle" /> 報到完成</b-button>
							<b-button variant="success" class='mr-1' :disabled='!buttonState4CancelCheckIn' @click="Click4CancelCheckIn"><font-awesome-icon icon="eraser" /> 取消報到</b-button>
							<b-button variant="danger" class='mr-1' :disabled='!buttonState4BeginCheck' @click='Click4BeginCheck'><font-awesome-icon icon="radiation" /> 開始檢查</b-button>
							<b-button variant="info" class='mr-1' @click='Click4Exit'><font-awesome-icon icon="reply" /> 返回</b-button>
						</b-col>
          </b-row>-->
        </b-container>
      </b-card-text>
    </b-card>

    <b-row
      no-gutters
      id="secondRow"
    >
      <b-col sm="6">
        <b-card
          no-body
          class="mx-1 mt-1 border"
          :style="{ height: tableHeight }"
          bg-variant="transparent"
        >
          <b-card-header class="bg-warning font-weight-bold cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >EGFR檢驗報告</b-col>
            </b-row>
          </b-card-header>
          <b-card-text>
            <twp
              ref="twp4LabEgfr"
              v-bind:FieldConfig="tableConfig4QueryLab"
              v-bind:DataFetch="GetEGFR"
              heightForScroll="314px"
              NoPaging
            ></twp>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col sm="6">
        <b-card
          no-body
          class="mx-1 mt-1 border"
          :style="{ height: tableHeight }"
          bg-variant="transparent"
        >
          <b-card-header class="bg-warning font-weight-bold cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >FreeT4檢驗報告</b-col>
            </b-row>
          </b-card-header>
          <b-card-text>
            <twp
              ref="twp4LabFreeT4"
              v-bind:FieldConfig="tableConfig4QueryLab"
              v-bind:DataFetch="GetFreeT4"
              heightForScroll="314px"
              NoPaging
            ></twp>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <b-row
      no-gutters
      id="thirdRow"
    >
      <b-col sm="6">
        <b-card
          no-body
          class="mx-1 mt-1 border"
          :style="{ height: tableHeight }"
          bg-variant="transparent"
        >
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
              v-bind:DataFetch="GetADR"
              heightForScroll="314px"
              NoPaging
            ></twp>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col sm="6">
        <b-card
          id="blockInputForm"
          no-body
          class="mx-1 mt-1 border"
          v-show="blockState4InputForm"
          bg-variant="transparent"
        >
          <b-card-header class="bg-success text-white cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >
                檢查作業．登錄區 {{ checking }}
                <b-spinner
                  style="width: 1.5rem; height: 1.5rem;"
                  v-show="false"
                  variant="danger"
                  label="Spinning"
                ></b-spinner>
              </b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="py-1">
            <b-container
              fluid
              class="px-1"
            >
              <b-row no-gutters>
                <b-col
                  sm="3"
                  class="px-1"
                >
                  <b-input-group prepend="放射師">
                    <b-select
                      @change="ChangeRadiographer"
                      v-model="selectedRadiographer"
                      :options="optionsRadiographer"
                    />
                  </b-input-group>
                </b-col>
                <b-col
                  sm="3"
                  class="px-1"
                  v-show="isCtMri"
                >
                  <b-input-group prepend="放射師2">
                    <b-select
                      @change="ChangeRadiographer2"
                      v-model="selectedRadiographer2"
                      :options="optionsRadiographer"
                    />
                  </b-input-group>
                </b-col>

                <b-col
                  sm="3"
                  class="px-1"
                  v-show="isCR"
                >
                  <b-input-group prepend="QC放射師">
                    <b-select
                      @change="ChangeRadiographerQC"
                      v-model="selectedRadiographerQC"
                      :options="optionsRadiographer"
                    />
                  </b-input-group>
                </b-col>

                <b-col
                  sm="3"
                  class="px-1"
                  v-show="!isCR"
                >
                  <b-input-group prepend="護理師">
                    <b-select
                      @change="ChangeNurse"
                      v-model="selectedNurse"
                      :options="[{value:null, text: '請選擇'}, ...nurses]"
                    />
                  </b-input-group>
                </b-col>

                <b-col
                  sm="3"
                  class="px-1"
                  v-show="isMgBmd || isCtMri"
                >
                  <b-input-group prepend="Exam No">
                    <b-input
                      v-model="masterData.LabCustomizeSerial"
                      @change="changeExamNo"
                    />
                  </b-input-group>
                </b-col>

              </b-row>
              <b-row
                no-gutters
                class="mt-1"
              >
                <!-- <b-col sm="3" class="pr-1" v-show="true">
                  <b-card no-body>
                    <b-card-header class="bg-warning font-weight-bold cardHeader">
                      <b-row no-gutters>
                        <b-col cols="6" class="float-left text-left">檢驗報告</b-col>
                      </b-row>
                    </b-card-header>
                    <b-card-text>
                      <twp ref="twp4Lab" v-bind:FieldConfig="tableConfig4QueryLab" v-bind:DataFetch="GetEGFRandFreeT4" heightForScroll="340px" NoPaging> </twp>
                    </b-card-text>
                  </b-card>
                </b-col>-->

                <!-- <b-col sm="3" class="pr-1" v-show="true">
                  <b-card no-body>
                    <b-card-header class="bg-info text-white font-weight-bold cardHeader">
                      <b-row no-gutters>
                        <b-col cols="6" class="float-left text-left">過敏記錄</b-col>
                      </b-row>
                    </b-card-header>
                    <b-card-text>
                      <twp ref="twp4ADR" v-bind:FieldConfig="tableConfig4QueryADR" v-bind:DataFetch="GetADR" heightForScroll="340px" NoPaging> </twp>
                    </b-card-text>
                  </b-card>
                </b-col>-->

                <b-col sm="6">
                  <b-card
                    no-body
                    class="bg-transparent"
                  >
                    <b-card-header class="bg-warning text-black font-weight-bold cardHeader">
                      <b-row no-gutters>
                        <b-col
                          cols="6"
                          class="float-left text-left"
                        >審單紀錄</b-col>
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
                            rows="9"
                            v-model="PreAuditNote"
                            readonly
                            style="height:142px;"
                          ></b-textarea>
                        </b-row>
                        <b-row
                          no-gutters
                          class="my-1"
                        >
                          <b-col
                            sm="12"
                            class="px-1"
                          >
                            <b-input-group prepend="預審醫師">
                              <b-input
                                v-model="PreAuditPhysicianName"
                                readonly
                              />
                            </b-input-group>
                          </b-col>
                        </b-row>
                      </b-container>
                    </b-card-text>
                  </b-card>
                </b-col>
                <b-col sm="6">
                  <b-card
                    no-body
                    class="bg-transparent"
                  >
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
                            rows="9"
                            v-model="checkNote"
                            @change="ChangeCheckNote"
                            style="height:142px;color: var(--themeTextColor) !important"
                            class="bg-transparent"
                          ></b-textarea>
                        </b-row>
                        <b-row
                          no-gutters
                          class="text-right my-1 float-right"
                        >
                          <b-button
                            class="mr-1"
                            variant="success"
                            :disabled="checkNote == '' || checkNote == null"
                            @click="SaveCheckNote"
                          >
                            <font-awesome-icon icon="eraser" />儲存註記
                          </b-button>
                          <b-button
                            variant="warning"
                            :disabled="checkNote == '' || checkNote == null"
                            @click="ClearCheckNote"
                          >
                            <font-awesome-icon icon="eraser" />清除註記
                          </b-button>
                          <!-- <b-col sm="10" class="float-right">
                        <b-button variant="success" :disabled="checkNote == '' || checkNote == null" @click="ClearCheckNote"
                          ><font-awesome-icon icon="eraser" /> 儲存註記</b-button
                        >
                      </b-col>

                      <b-col sm="2" class="float-right">
                        <b-button variant="warning" :disabled="checkNote == '' || checkNote == null" @click="ClearCheckNote"
                          ><font-awesome-icon icon="eraser" /> 清除</b-button
                        >
                          </b-col>-->
                        </b-row>
                      </b-container>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>

              <!-- <b-row no-gutters class='mt-1'>  藥品耗材要移到別處
              <b-col>
                <b-card no-body>
                  <b-card-header class="bg-danger text-white font-weight-bold cardHeader">
                    <b-row no-gutters>
                      <b-col cols="6" class="float-left text-left">藥品耗材</b-col>
                    </b-row>
                  </b-card-header>
                  <b-card-text class='p-1'>
                    <b-container fluid class='p-0'>
                      <b-row no-gutters>
                        <b-col>
                          <twp ref='twp4MaS' 
                          v-bind:FieldConfig='tableConfig4MandS' 
                          v-bind:RowData='tableContent4MandS' 
                          OpButton1Text='編輯' 
                          v-bind:OpButton1Func="RowClickFunc1" 
                          OpButton2Text='刪除' 
                          v-bind:OpButton2Func="RowClickFunc2"></twp>
                        </b-col>
                      </b-row>
                      <b-row no-gutters class='mt-1'>
                        <b-col cols='6' class="float-left text-left ml-1">
                          <b-button variant="outline-primary" @click='Click4NewMaS'><font-awesome-icon icon="plus" /> 新增記錄</b-button>
                        </b-col>
                      </b-row>
                    </b-container>
                  </b-card-text>
                </b-card>
              </b-col>
              </b-row>-->
              <b-row
                no-gutters
                class="mt-1 text-right"
                align-h="end"
              >
                <b-col
                  sm="6"
                  class="px-1"
                >
                  <!-- <b-button variant="primary" class='mr-1' :disabled='!buttonState4CheckIn' @click='Click4CheckIn'><font-awesome-icon icon="check-circle" /> 報到完成</b-button> -->
                  <!-- <b-button variant="success" class='mr-1' :disabled='!buttonState4CancelCheckIn' @click="Click4CancelCheckIn"><font-awesome-icon icon="eraser" /> 取消報到</b-button> -->
                  <!-- :disabled="!allowExit" -->
                  <b-button
                    variant="info"
                    class="mr-1"
                    @click="Click4Exit"
                  >
                    <font-awesome-icon icon="reply" />返回
                  </b-button>
                  <b-button
                    variant="success"
                    @click="ShowDialogBackState"
                    :disabled="!allowStateBack"
                  >
                    <font-awesome-icon icon="backspace" />終止檢查
                  </b-button>

                  <b-button
                    variant="secondary"
                    class="ml-1"
                    @click="showWasteImage=true"
                  >
                    <font-awesome-icon icon="file-image" />不良影像處理
                  </b-button>
                  <!-- <b-button
                    variant="warning"
                    class="mr-1"
                    @click="ShowDialogCancelOp"
                    :disabled="!allowCancel"
                  >
                    <font-awesome-icon icon="eraser" />取消檢查
                  </b-button>-->

                  <!-- <b-button variant="danger" class='mr-1' :disabled='!buttonState4BeginCheck' @click='Click4BeginCheck'><font-awesome-icon icon="radiation" /> 開始檢查</b-button> -->
                  <!-- <b-button variant="info" class='mr-1' @click='Click4Exit'><font-awesome-icon icon="power-off" /> 檢查完畢</b-button> -->
                </b-col>
                <b-col sm="4">
                  <!-- <b-button variant="primary" class='mr-1' :disabled='!buttonState4CheckIn' @click='Click4CheckIn'><font-awesome-icon icon="check-circle" /> 報到完成</b-button> -->
                  <!-- <b-button variant="success" class='mr-1' :disabled='!buttonState4CancelCheckIn' @click="Click4CancelCheckIn"><font-awesome-icon icon="eraser" /> 取消報到</b-button> -->
                  <!-- <b-button variant="info" class='mr-1' @click='Click4Exit'><font-awesome-icon icon="reply" /> 返回</b-button> -->
                  <!-- <b-button variant="success" class='mr-1' @click="Click4CancelOp"><font-awesome-icon icon="eraser" /> 取消登錄</b-button> -->
                  <!-- <b-button variant="danger" class="mr-1" :disabled="!allowBeginCheck" @click="Click4BeginCheck">
                    <font-awesome-icon icon="radiation" />開始檢查
                  </b-button>
                  <b-button variant="primary" class="mr-1" :disabled="!allowFinishCheck" @click="Click4Finish"> <font-awesome-icon icon="power-off" />檢查完畢 </b-button>-->

                  <b-button
                    variant="primary"
                    class="mr-1"
                    @click="Click4SaveEmployees"
                  >
                    <font-awesome-icon icon="save" />紀錄放射師/護理師
                  </b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <wasteImage
      :show.sync="showWasteImage"
      :patient="dataStore.masterData || {}"
      :key="Object.keys(masterData).length"
      :stepDefault="1"
      :showDelFailImageCheckbox="true"
    />

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
              <b> <i class="fas fa-trash"></i> 取消 </b>
            </b-btn>
            <b-btn
              variant="danger"
              @click="OnRecordSave"
            >
              <b> <i class="fas fa-save"></i> 確認 </b>
            </b-btn>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>

    <b-modal
      ref="dialogCancelOp"
      centered
      hide-footer
      title="取消檢查"
      header-bg-variant="danger"
      title-class="lang-zh-Hant-TW font-weight-bold text-white"
      body-class="lang-zh-Hant-TW"
    >
      <div class="d-block text-left">
        <p class="lang-zh-Hant-TW">將取消此筆檢查單，是否確認?</p>
      </div>
      <b-textarea
        id="DxRMain"
        no-resize
        rows="4"
        class="border-primary"
        ref="reportPlainText"
        v-model="Reason4CancelExam"
        placeholder="請於此處輸入取消檢查原因"
      />
      <b-btn
        class="mt-3"
        variant="success"
        block
        @click="Click4CancelOp"
      >確認</b-btn>
      <b-btn
        class="mt-2"
        variant="secondary"
        block
        @click="CloseDialogCancelOp"
      >取消</b-btn>
    </b-modal>
    <b-modal
      ref="dialogBackState"
      centered
      hide-footer
      title="取消登錄"
      header-bg-variant="warning"
      title-class="lang-zh-Hant-TW font-weight-bold"
      body-class="lang-zh-Hant-TW"
    >
      <div class="d-block text-left">
        <p class="lang-zh-Hant-TW">將退回櫃台報到狀態，是否確認?</p>
      </div>
      <b-btn
        class="mt-3"
        variant="success"
        block
        @click="Click4StateBack"
      >確認</b-btn>
      <b-btn
        class="mt-2"
        variant="secondary"
        block
        @click="CloseDialogStateBack"
      >取消</b-btn>
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

//狀態常數
const CHECKED_IN = "21";
const CHECK_INPROCESS = "31";
const EXAM_FINISHED = "36,51,56,61,63,65,71,73,75,77,79";

import twp from "@/components/TWPv5";
import * as configs from "@/config";
import { getEmployeeDataByType } from "@/assets/service/dataManager.js";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapGetters, mapState, mapMutations } from "vuex";
import wasteImage from "@/components/WasteImage.vue";
// const queryResult = require('@/assets/DataSource/DR0101001')
// const checkItem = require('@/assets/DataSource/DR0407001')
// const patientSource = require('@/assets/DataSource/DR0431001')
// const opProgress = require('@/assets/DataSource/DR04X1001')
// const opPRadiographer = require('@/assets/DataSource/DR0423002')
// const opPNurse = require('@/assets/DataSource/DR0423003')

const queryLaboratory = require("@/assets/DataSource/DR04Y1001");

const queryADR = require("@/assets/DataSource/DR04Y2001");

const opMandS = require("@/assets/DataSource/DR0408001");
const dsMandS = require("@/assets/DataSource/DR0408002");

const configLab =
  //queryLaboratory.PresentConfig();
  [
    {
      key: "eDate",
      label: "檢驗日期",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap"
    },
    {
      key: "EXPER_CODE",
      label: "檢驗項目",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap font-weight-bold"
    },
    {
      key: "EXPER_DATA",
      label: "檢驗值",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap font-weight-bold"
    },
    {
      key: "EXPER_DATA3",
      label: "參考值",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap font-weight-bold"
    }
  ];

const configADR =
  //queryADR.PresentConfig();
  [
    {
      key: "eDate",
      label: "登錄日期",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap"
    },
    {
      key: "MED_CODE",
      label: "藥品編號",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap font-weight-bold text-left"
    },
    {
      key: "MEE_DESC",
      label: "藥品描述",
      sortable: false,
      thClass: "text-nowrap",
      tdClass: "text-nowrap font-weight-bold"
    }
  ];

/**
 * 為指定的 html tag id 加上或取消遮罩
 * @param {string} id HTML tag id
 * @param {boolean} flag 加上或取消遮罩, 預設: true-加上遮罩
 */
// function areaBlock(id, flag = true) {
// 	if(flag) {
// 		$('#' + id).block({ message: '', overlayCSS: { backgroundColor: '#fff', opacity: 0.3, cursor: 'wait' }, fadeIn: 0, fadeOut: 0 })
// 	} else {
// 		$('#' + id).unblock()
// 	}
// }
export default {
  name: "FI0202",
  components: { twp, wasteImage },
  mixins: [dateFormatMixin],
  data () {
    return {
      tableHeight: "350px",
      BasePath: this.$route.path,
      id4EditWindow: id4EditWindow,
      labRoomId: "",
      selectedLabRoom: null,
      masterGUId: null,
      masterData: {},
      buttonState4CheckIn: true,
      buttonState4CancelCheckIn: false,
      buttonState4BeginCheck: false,
      buttonState4CheckCompleted: false,
      blockState4InputForm: false,
      selectedRadiographer: null,
      selectedRadiographer2: null,
      selectedRadiographerQC: null,
      isCtMri: true,
      isMgBmd: true,
      isCR: false,
      optionsRadiographer: [],
      optionsRadiographer2: [],
      optionsRadiographerQC: [],
      selectedNurse: null,
      optionsNurse: [],
      optionsDxPhysician: '',
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
      },
      checkNote: "",
      dataStore: {},
      allowExit: false,
      allowCancel: false,
      allowStateBack: false,
      allowBeginCheck: false,
      allowFinishCheck: false,
      checkingStyle: {
        backgroundColor: "white"
      },
      checking: "",
      Reason4CancelExam: null,
      myTimer: null,
      useWebSocket: true,
      hubProxy: null,
      //
      tempFI0201UiParams: null,
      //
      PreAuditNote: null,
      PreAuditPhysicianName: null,
      showWasteImage: false
    };
  },
  computed: {
    // allowCheckIn() {
    // 	return this.masterData && this.masterData.oSt !== 31
    // },
    ...mapGetters(["getThemeColors", "getDxDrs"]),
    ...mapState(["nurses", "radiographerBrief"])
  },

  methods: {
    ...mapMutations(['SET_DX_DR', 'SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    //用來執行animation的timer
    getParams (param) {

      return typeof param !== 'object'
        ? param
        : param.value.length < 3
          ? this.radiographerBrief.short[param.value]
          : param.value;
    },
    SetMyTimer () {
      this.myTimer = setInterval(() => {
        this.MyTimerTick();
      }, 500);
    },
    MyTimerTick () {
      if (this.checkingStyle.backgroundColor === "pink") this.checkingStyle.backgroundColor = "pink";
      else this.checkingStyle.backgroundColor = "pink";
    },
    StopTimer () {
      if (this.myTimer) {
        clearInterval(this.myTimer);
      }
    },
    //
    //畫面UI enable/disable 判斷
    UIEnables () {
      // this.allowExit = false
      // this.allowCancel = false
      // this.allowBeginCheck = true
      // this.allowFinishCheck = false
      this.allowExit = true;
      this.allowCancel = true;
      this.allowBeginCheck = false;
      this.allowFinishCheck = false;
      this.allowStateBack = true;
      this.IsChecking(false);

      if (this.dataStore.masterData !== undefined) {
        if (this.dataStore.masterData.Status === CHECKED_IN || this.dataStore.masterData.Status === EXAM_FINISHED) this.allowExit = true;
        if (this.dataStore.masterData.Status === CHECK_INPROCESS) this.allowCancel = true;
        if (this.dataStore.masterData.Status === CHECKED_IN) this.allowBeginCheck = true;
        if (this.dataStore.masterData.Status === CHECK_INPROCESS) {
          this.allowFinishCheck = true;
          this.IsChecking(true);
        }

        if (EXAM_FINISHED.includes(this.dataStore.masterData.Status)) {
          this.allowFinishCheck = false;
          this.allowBeginCheck = false;
          this.allowStateBack = false;
          this.allowCancel = false;
        }
      }
    },
    //變更檢查作業card header 顯示檢查中狀態
    IsChecking (c) {
      if (c) {
        //this.checkingStyle.backgroundColor = 'rgba(255,192,203,1)'
        this.checking = " -檢查中";

        this.SetMyTimer();
      } else {
        this.checkingStyle.backgroundColor = "rgba(255,255,255,255)";
        this.checking = "";

        this.StopTimer();
      }
    },
    //清除檢查註記
    ClearCheckNote () {
      this.checkNote = "";
      this.dataStore.masterData.RadiographerNote = "";
    },
    //變更檢查註記
    ChangeCheckNote () {
      this.dataStore.masterData.RadiographerNote = this.checkNote;
    },
    //變更exam no
    changeExamNo () {
      this.dataStore.masterData.LabCustomizeSerial = this.masterData.LabCustomizeSerial;
    },
    //save檢查註記
    async SaveCheckNote () {
      // 註記存檔 - 後台存取
      let accessionNos = "";
      this.dataStore.dataList.forEach(i => (accessionNos += i.AccessionNo + ","));
      accessionNos = accessionNos.replace(/,\s*$/, "");
      let arrAccessionNos = accessionNos.split(",");

      let dataBody = {
        AccessionNos: arrAccessionNos,
        Note: this.checkNote
      };

      let subPath = "/exam/SaveRadiographerNote";
      let opStatus = false;
      let opResult = "存取時發生錯誤!\r\n";
      let _this = this;
      console.log(`${this.$logs("Call", subPath)}`);
      this.SHOW_LOADING();
      //console.log(this.theReport)
      await window.axios
        .put(subPath, dataBody)
        .then(e => {
          opStatus = true;
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.HIDE_LOADING();
      //
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
      return opStatus;
    },
    //
    //判斷是否已有選擇執行檢驗的放射師
    CheckIfRadiographerSelected () {
      if (this.isCR) {
        if (this.selectedRadiographer == null && this.selectedRadiographerQC == null) {
          this.SET_SIDE_MESSAGE({ msg: "請選擇執行檢驗的放射師", type: 2 });
          return false;
        }
      } else {
        if (this.selectedRadiographer == null && this.selectedNurse == null && this.selectedRadiographer2 == null) {
          this.SET_SIDE_MESSAGE({ msg: "請選擇執行檢驗的放射師及護理師", type: 2 });
          return false;
        }
      }
      return true;
    },
    CheckIfExamNoInput () {
      //後來決定不判斷字元了, 此處判斷取消
      // if (this.isMgBmd || this.isCtMri) {
      //   this.masterData.LabCustomizeSerial = this.masterData.LabCustomizeSerial === null ? "" : this.masterData.LabCustomizeSerial;
      //   this.masterData.LabCustomizeSerial = this.masterData.LabCustomizeSerial.toUpperCase();
      //   let reg = new RegExp("^([A-Za-z]{1}[0-9]{1,})");
      //   if (!this.masterData.LabCustomizeSerial || !reg.test(this.masterData.LabCustomizeSerial)) {
      //     this.SET_SIDE_MESSAGE("Exam No 輸入格式不正確, 第一碼為英文字母.", 2);
      //     return false;
      //   }
      // }
      return true;
    },
    GetEditWindowTitle () {
      return (this.editWindowForm.editState === 1 ? "新增" : "修改") + "︰藥品、耗材";
    },

    //
    //double check取消檢查
    ShowDialogCancelOp () {
      this.$refs.dialogCancelOp.show();
    },
    //
    //double check 取消登錄
    ShowDialogBackState () {
      this.$refs.dialogBackState.show();
    },
    //
    //hide dialog
    CloseDialogStateBack () {
      this.$refs.dialogBackState.hide();
    },
    //
    //hide dialog
    CloseDialogCancelOp () {
      this.$refs.dialogCancelOp.hide();
    },
    Click4CheckIn () {
      //this.masterData.oSt = 41
      //this.masterData.oStName = opProgress.GetText(this.masterData.oSt)
      this.blockState4InputForm = true;
      this.$nextTick(() => {
        this.buttonState4CheckIn = false;
        this.buttonState4CancelCheckIn = true;
        this.buttonState4BeginCheck = true;
      });
    },
    // Click4CancelCheckIn() {
    // 	this.masterData.oSt = 31
    // 	this.masterData.oStName = opProgress.GetText(this.masterData.oSt)
    // 	this.$nextTick(() => {
    // 		this.buttonState4CheckIn = true
    // 		this.buttonState4CancelCheckIn = false
    // 		this.buttonState4BeginCheck = false
    // 	})
    // },

    async Click4SaveEmployees () {
      if (!this.CheckIfRadiographerSelected()) {
        return;
      }
      let subPath = "/exam/SaveEmployee";
      let accessionNos = [this.masterData.cId];

      let _this = this;

      let dataBody = {
        AccessionNos: accessionNos
      };

      if (this.isCR) {
        dataBody.PerformRadiographer1Id = this.selectedRadiographer;
        dataBody.QcRadiographerId = this.selectedRadiographerQC;

      } else {
        dataBody.PerformRadiographer1Id = this.selectedRadiographer;
        dataBody.PerformRadiographer2Id = this.selectedRadiographer2;
        dataBody.PerformNurseId = this.selectedNurse;
        if (this.dataStore.masterData.LabCustomizeSerial && this.dataStore.masterData.LabCustomizeSerial.length > 0) {
          if (this.CheckIfExamNoInput()) {
            dataBody.LabCustomizeSerial = this.dataStore.masterData.LabCustomizeSerial;
          } else {
            return;
          }
        }
      }
      dataBody.DxPhysicianId = this.optionsDxPhysician;
      let opStatus = false;
      let opResult = "存取時發生錯誤!\r\n";
      await window.axios
        .put(subPath, dataBody)
        .then(e => {
          opStatus = true;
          this.Click4Exit();
          // _this.$refs.twp1.OnForceRefresh();
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.HIDE_LOADING();
      //
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
    },

    Click4BeginCheck () {
      if (!this.CheckIfRadiographerSelected()) {
        return;
      }

      if (!this.CheckIfExamNoInput()) {
        return;
      }

      let accessionNos = "";
      this.dataStore.dataList.filter(i => (accessionNos += i.AccessionNo + ","));
      accessionNos = accessionNos.replace(/,\s*$/, "");

      let subPath = "/exam/ExamStart?accessionNos=" + accessionNos;
      let dataBody = this.dataStore.masterData;
      let _this = this;
      let accessionNosArr = accessionNos.split(",");

      if (this.useWebSocket) {
        this.UpDateExam_webSocket("examStart", dataBody, accessionNosArr, this.DoneBeginCheck);
        // this.hubProxy
        //   .invoke("examStart", dataBody, accessionNosArr)
        //   .then(e => {
        //     if (e.Success) {
        //       _this.SET_SIDE_MESSAGE("資料已完成作業");
        //       _this.DoneBeginCheck();
        //     } else {
        //       _this.SET_SIDE_MESSAGE(
        //         "錯誤:" + e.Message + "! 請稍後再試.",
        //         2
        //       );
        //     }
        //   })
        //   .fail(function(error) {
        //     console.log(error);
        //     _this.SET_SIDE_MESSAGE("錯誤:" + error + "! 請稍後再試.", 2);
        //   });
      } else {
        this.UpDateExam(subPath, dataBody, this.DoneBeginCheck);
      }
    },

    Click4Exit () {
      // //更新假資料檢查單
      // if(this.dataStore.masterData){
      // 	this.dataStore.masterData.staId = "A002"
      // 	this.dataStore.masterData.staIdT = "已報到"
      // 	this.dataStore.masterData.cNote = ""
      // 	this.UpDateExam()
      // }
      //this.$router.replace(this.BasePath.replace('/' + window.examRoomData.guid, ''));
      let backObj = null;
      if (this.dataStore.masterData) {
        backObj = this.dataStore.masterData;
      }
      this.$router.replace({
        name: "FI0201",
        params: { backObj: this.tempFI0201UiParams }
      });
    },

    Click4Finish () {
      if (!this.CheckIfRadiographerSelected()) {
        return;
      }
      if (!this.CheckIfExamNoInput()) {
        return;
      }
      let accessionNos = "";
      this.dataStore.dataList.filter(i => (accessionNos += i.AccessionNo + ","));
      accessionNos = accessionNos.replace(/,\s*$/, "");

      let subPath = "/exam/ExamCompleted?accessionNos=" + accessionNos;
      this.dataStore.masterData.RadiographerNote = this.checkNote;
      let dataBody = this.dataStore.masterData;
      let accessionNosArr = accessionNos.split(",");

      if (this.useWebSocket) {
        this.UpDateExam_webSocket("examCompleted", dataBody, accessionNosArr, this.DoneFinishCheck);
      } else {
        this.UpDateExam(subPath, dataBody, this.DoneFinishCheck);
      }
    },

    //
    //取消登錄
    Click4StateBack () {
      // if(!this.CheckIfRadiographerSelected()){
      // 	return
      // }

      let subPath = "/exam/ExamBack";
      let accessionNos = [];
      this.dataStore.dataList.filter(i => accessionNos.push(i.AccessionNo));

      if (this.useWebSocket) {
        this.UpDateExam_webSocket("examBack", null, accessionNos, this.DoneBackState);
      } else {
        this.UpDateExam(subPath, accessionNos, this.DoneBackState);
      }
    },
    //
    //取消檢查
    Click4CancelOp () {
      // if(!this.CheckIfRadiographerSelected()){
      // 	return
      // }
      if (this.Reason4CancelExam == null || this.Reason4CancelExam == "") {
        this.SET_SIDE_MESSAGE({ msg: "請輸入取消檢查原因.", type: 2 });
        return;
      }

      let subPath = "/exam/CancelExam?cancelDescription=" + this.Reason4CancelExam;
      let accessionNos = [];
      this.dataStore.dataList.filter(i => accessionNos.push(i.AccessionNo));

      if (this.useWebSocket) {
        this.UpDateExam_webSocket("cancelExam", accessionNos, this.Reason4CancelExam, this.DoneCancelOp);
      } else {
        this.UpDateExam(subPath, accessionNos, this.DoneCancelOp);
      }
    },
    //
    //完成溝通 開始檢查
    DoneBeginCheck () {
      this.masterData.oSt = this.dataStore.masterData.Status;
      //areaBlock('blockBaseInfo')
      this.blockState4InputForm = true;
      this.masterData.oStName = this.dataStore.masterData.StatusName;
      //
      //按鈕enable判斷
      this.UIEnables();
    },
    //
    //完成溝通 檢查完畢
    DoneFinishCheck () {
      this.masterData.oSt = this.dataStore.masterData.Status;
      this.masterData.oStName = this.dataStore.masterData.StatusName;
      //
      this.Click4Exit();
    },
    //
    //完成溝通 取消檢查
    DoneCancelOp () {
      this.Click4Exit();
    },
    //
    //完成溝通 取消登錄
    DoneBackState () {
      this.Click4Exit();
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
      console.log(this.$logs(`${opNew ? "新增" : "修改"} - sI:${this.editWindowForm.selectedItem}`));
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
    },
    //取得放射師列表
    async GetOptionsRadiographer () {
      const { actual: { Items } } = await getEmployeeDataByType(35, false);
      this.optionsRadiographer = Items.map(({ No, Name }) => ({ text: Name, value: No }));
      this.ChangeRadiographer();
    },
    //取得護理師列表
    async GetOptionsNurse () {
      //  [{ value: null, text: "請選擇" }]

      if (this.nurses.length === 0) {
        const _nurses = await this.getEmployeeData(55);
        this.SET_NURSES(_nurses);
      }
    },
    async GetDxPhysician () {
      if (this.getDxDrs.length === 0) {
        const empDx = await getEmployeeDataByType("21,23,25,27,28,29");
        this.SET_DX_DR(empDx.result);
      }
    },
    async GetFreeT4 (index, toPage, nPerPage) {
      // let itemPack = {};
      // itemPack.Items = this.tableContent4QueryLab;
      // itemPack.Count = this.tableContent4QueryLab.length;
      // return itemPack;
      console.log(this.$logs("EGFR/FreeT4"));
      //
      if (!this.dataStore.masterData) return null;
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../his/GetPatientLabs?patientId=" + this.dataStore.masterData.PatientId + "&experCode=Free-T4";
      let pagingParams = "&pageSize=" + 0 + "&pageCount=" + 1;
      this.SHOW_LOADING();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath + pagingParams,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(new Query()) //.page(toPage, nPerPage))
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        })
        .catch(e => {
          console.log(this.$logs(e.error));
        });

      if (itemPack.Items && itemPack.Items.length > 0) {
        itemPack.Items.filter(i => {
          // let day = i.EXPER_DATE.substring(i.EXPER_DATE.length - 2, i.EXPER_DATE.length);
          // let mon = i.EXPER_DATE.substring(i.EXPER_DATE.length - 4, i.EXPER_DATE.length - 2);
          // let year = i.EXPER_DATE.substring(0, i.EXPER_DATE.length - 4);
          // i.eDate = year + "/" + mon + "/" + day;
          const _dateData = i.SIGN_DATE
            ? /(\d{3})(\d{2})(\d{2})/g.exec(i.SIGN_DATE)
            : [];
          if (_dateData.length > 0) _dateData.shift();
          i.eDate = _dateData.join('/');
          if (!i.IS_NORMAL) {
            i._rowVariant = "danger";
          }
          // i.EXPER_DATE = this.DateToString(i.EXPER_DATE, true);
        });

        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        itemPack.Items.sort((a, b) => {
          return b.SIGN_DATE - a.SIGN_DATE;
        });
      }

      //
      //
      this.HIDE_LOADING();
      //
      if (opStatus) {
        // this.SET_SIDE_MESSAGE('資料已完成存檔作業')
      } else {
        this.SET_SIDE_MESSAGE({ msg: "無法取得FreeT4資訊! 請稍後再試.", type: 2 });
      }

      return itemPack;
    },
    async GetEGFR (index, toPage, nPerPage) {
      // let itemPack = {};
      // itemPack.Items = this.tableContent4QueryLab;
      // itemPack.Count = this.tableContent4QueryLab.length;
      // return itemPack;
      // console.log(this.$logs("EGFR/FreeT4"));
      if (!this.dataStore.masterData) return null;
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../his/GetPatientLabs?patientId=" + this.dataStore.masterData.PatientId + "&experCode=EGFR";
      let pagingParams = "&pageSize=" + 0 + "&pageCount=" + 1;
      this.SHOW_LOADING();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath + pagingParams,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(new Query().where("EXPER_CODE", "equal", "egfr")) //.page(toPage, nPerPage))
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        })
        .catch(e => {
          console.log(this.$logs(e.error));
        });

      if (itemPack.Items && itemPack.Items.length > 0) {
        itemPack.Items.filter(i => {
          let day = i.EXPER_DATE.substring(i.EXPER_DATE.length - 2, i.EXPER_DATE.length);
          let mon = i.EXPER_DATE.substring(i.EXPER_DATE.length - 4, i.EXPER_DATE.length - 2);
          let year = i.EXPER_DATE.substring(0, i.EXPER_DATE.length - 4);
          i.eDate = year + "/" + mon + "/" + day;

          if (!i.IS_NORMAL) {
            i._rowVariant = "danger";
          }
          // i.EXPER_DATE = this.DateToString(i.EXPER_DATE, true);
        });

        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        itemPack.Items.sort((a, b) => {
          return b.EXPER_DATE - a.EXPER_DATE;
        });
      }

      //
      //
      this.HIDE_LOADING();
      //
      if (opStatus) {
        // this.SET_SIDE_MESSAGE('資料已完成存檔作業')
      } else {
        this.SET_SIDE_MESSAGE({ msg: "無法取得EGFR資訊!請稍後再試.", type: 2 });
      }

      return itemPack;
    },
    async GetADR (index, toPage, nPerPage) {
      // console.log(this.$logs())
      // //
      // let itemPack = null
      // //
      // //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      // let subPath = "../checkin/AllergyList"

      // //
      // await new DataManager({
      // 	url: configs.publicPath + subPath,
      // 	adaptor: new WebApiAdaptor(),
      // 	crossDomain: true
      // })
      // .executeQuery(new Query())
      // .then(r => {
      // 	itemPack = r.actual//資料;
      // });

      // itemPack.Items.filter(i=>{
      // 	if(i.Severity > 0)
      // 		i._rowVariant = 'warning'
      // 	})
      // return itemPack
      // let itemPack = {};
      // itemPack.Items = this.tableContent4QueryADR;
      // itemPack.Count = this.tableContent4QueryADR.length;
      // return itemPack;

      //
      if (!this.dataStore.masterData) return null;

      //
      if (!this.dataStore.masterData) return null;
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../his/GetPatientMedWarnings?patientId=" + this.dataStore.masterData.PatientId;
      let pagingParams = "&pageSize=" + 0 + "&pageCount=" + 1;
      this.SHOW_LOADING();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath + pagingParams,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(new Query()) //.page(toPage, nPerPage))
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        })
        .catch(e => {
          console.log(this.$logs(e.error));
        });

      if (itemPack.Items && itemPack.Items.length > 0) {
        itemPack.Items.filter(i => {
          let day = i.UPD_DATE.substring(i.UPD_DATE.length - 2, i.UPD_DATE.length);
          let mon = i.UPD_DATE.substring(i.UPD_DATE.length - 4, i.UPD_DATE.length - 2);
          let year = i.UPD_DATE.substring(0, i.UPD_DATE.length - 4);
          i.eDate = year + "/" + mon + "/" + day;
          // i.EXPER_DATE = this.DateToString(i.EXPER_DATE, true);
        });

        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        itemPack.Items.sort((a, b) => {
          return b.UPD_DATE - a.UPD_DATE;
        });
      }

      //
      //
      this.HIDE_LOADING();
      //
      if (opStatus) {
        // this.SET_SIDE_MESSAGE('資料已完成存檔作業')
      } else {
        this.SET_SIDE_MESSAGE({ msg: "無法取得過敏記錄!請稍後再試.", type: 2 });
      }

      return itemPack;
    },
    //更新檢查單資料與狀態 websocket
    UpDateExam_webSocket (command, data1, data2, callBack) {
      let _this = this;
      if (data1) {
        this.hubProxy
          .invoke(command, data1, data2, this.$store.state.Profile4User.JWTToke)
          .then(e => {
            if (e.Success) {
              _this.SET_SIDE_MESSAGE({ msg: "資料已完成作業" });
              if (e.Exams !== undefined && e.Exams.length > 0) {
                _this.dataStore.masterData = e.Exams[0];
                // _this.dataStore.masterData.RadiographerNote = _this.checkNote;
              }
              callBack();
            } else {
              _this.SET_SIDE_MESSAGE({ msg: "錯誤:" + e.Message + "! 請稍後再試.111", type: 2 });
            }
          })
          .fail(function (error) {
            console.log(error);
            _this.SET_SIDE_MESSAGE({ msg: "錯誤:" + error + "! 請稍後再試.", type: 2 });
          });
      } else {
        this.hubProxy
          .invoke(command, data2, this.$store.state.Profile4User.JWTToke)
          .then(e => {
            if (e.Success) {
              _this.SET_SIDE_MESSAGE({ msg: "資料已完成作業" });
              if (e.Exams !== undefined && e.Exams.length > 0) {
                _this.dataStore.masterData = e.Exams[0];
                // _this.dataStore.masterData.RadiographerNote = _this.checkNote;
              }
              callBack();
            } else {
              _this.SET_SIDE_MESSAGE({ msg: "錯誤:" + e.Message + "! 請稍後再試.", type: 2 });
            }
          })
          .fail(function (error) {
            console.log(error);
            _this.SET_SIDE_MESSAGE({ msg: "錯誤:" + error + "! 請稍後再試.", type: 2 });
          });
      }
    },
    //更新檢查單資料與狀態等
    async UpDateExam (subPath, dataBody, callBack) {
      // 報告存檔 - 後台存取
      let url = subPath;
      let opStatus = false;
      let opResult = "存取時發生錯誤!\r\n";
      let _this = this;
      console.log(`${this.$logs("Call", subPath)}`);
      this.SHOW_LOADING();
      //console.log(this.theReport)
      await window.axios
        .put(subPath, dataBody)
        .then(e => {
          opStatus = true;
          if (e !== undefined && e.length > 0) {
            _this.dataStore.masterData = e[0];
            // _this.dataStore.masterData.RadiographerNote = _this.checkNote;
          }
          callBack();
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.HIDE_LOADING();
      //
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
      return opStatus;
    },
    //更新檢查單資料與狀態等
    async ChangeDataAndState (accessionNos, subPath, callBack) {
      // 報告存檔 - 後台存取
      let url = subPath;
      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      //console.log(this.theReport)
      await window.axios
        .put(subPath, accessionNos)
        .then(e => {
          opStatus = true;
          callBack(opStatus);
        })
        .catch(function (error) {
          opStatus = false;
          callBack(opStatus);
        });

      //
      //按鈕enable判斷
      this.UIEnables();

      this.HIDE_LOADING();
      //
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "作業完成" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
      return opStatus;
    },
    GetInputData () {
      // 取得list帶入的資料
      if (!window.examRoomData) {
        this.$router.replace({
          name: "FI0201"
          // params: { labRoomId: roomName, patientData: [x], backObj: this.backObj }
        });
      }
      // console.log("dataIn: " + window.examRoomData.patientData);
      let dataList = (this.dataStore.dataList = window.examRoomData.patientData);
      let d = (this.dataStore.masterData = dataList[0]);
      //帶入UI params
      //檢查註記
      this.checkNote = d.RadiographerNote;
      //申請單號
      this.masterData.cId = d.AccessionNo;
      //開單日期
      this.masterData.cDt = d.OrderDate;
      //檢查單狀態名稱
      this.masterData.oStName = d.StatusName;
      //病歷號
      this.masterData.hId = d.PatientId;
      //檢驗項目
      this.masterData.iNe = d.ProcedureNameList;
      //病患名稱
      this.masterData.pNe = d.PatientName;
      //病患性別
      this.masterData.pGd = d.PatientSex;
      //?ID
      this.masterData.pId = d.OtherPatientId;
      //病患年齡
      this.masterData.pAge = d.PatientAge;
      //儀器類型
      this.masterData.modality = d.Modality;
      //病患來源名稱
      this.masterData.pSrName = d.PatientSourceTypeName;
      //Exam no
      this.masterData.LabCustomizeSerial = d.LabCustomizeSerial;
      //檢查室名稱
      this.labRoomId = window.examRoomData.labRoomId;
      this.selectedLabRoom = window.examRoomData.selectedLabRoom;
      //
      this.PreAuditNote = d.PreAuditNote;
      this.PreAuditPhysicianName = d.PreAuditPhysicianName;
      let params = this.GetLocalStorage();
      //放射師1
      if (this.dataStore.masterData.PerformRadiographer1Id === null) {
        if (params.PerformRadiographer1Id) {
          this.dataStore.masterData.PerformRadiographer1Id = this.selectedRadiographer = this.getParams(params.PerformRadiographer1Id);
        }
        // localStorage.selectedRadiographer && localStorage.selectedRadiographer != "" ? localStorage.selectedRadiographer : null;
      } else {
        this.selectedRadiographer = this.getParams(this.dataStore.masterData.PerformRadiographer1Id);
      }
      //放射師2
      if (this.masterData.modality.toLowerCase().includes("ct") || this.masterData.modality.toLowerCase().includes("mr")) {
        if (this.dataStore.masterData.PerformRadiographer2Id === null) {
          if (params.PerformRadiographer2Id) {
            this.dataStore.masterData.PerformRadiographer2Id = this.selectedRadiographer2 = this.getParams(params.PerformRadiographer2Id);
          }
          // localStorage.selectedRadiographer2 && localStorage.selectedRadiographer2 != "" ? localStorage.selectedRadiographer2 : null;
        } else {
          this.selectedRadiographer2 = this.getParams(this.dataStore.masterData.PerformRadiographer2Id);
        }
      }

      //放射師QC
      if (this.masterData.modality.toLowerCase().includes("cr")) {
        if (this.dataStore.masterData.QcRadiographerId === null) {
          if (params.QcRadiographerId) {
            this.dataStore.masterData.QcRadiographerId = this.selectedRadiographerQC = this.getParams(params.QcRadiographerId);
          }
          // localStorage.selectedRadiographer2 && localStorage.selectedRadiographer2 != "" ? localStorage.selectedRadiographer2 : null;
        } else {
          this.selectedRadiographerQC = this.getParams(this.dataStore.masterData.QcRadiographerId);
        }
      }
      //護理師
      if (this.dataStore.masterData.PerformNurseId === null) {
        if (params.PerformNurseId) this.dataStore.masterData.PerformNurseId = this.selectedNurse = this.getParams(params.PerformNurseId);
        // localStorage.selectedNurse && localStorage.selectedNurse != "" ? localStorage.selectedNurse : null;
      } else {
        this.selectedNurse = this.getParams(this.dataStore.masterData.PerformNurseId);
      }

      if (this.$route.params.hubProxy) this.hubProxy = this.$route.params.hubProxy;

      // if (this.$route.params.backObj) this.tempFI0201UiParams = this.$route.params.backObj;

      this.$refs.twp4LabEgfr.OnForceRefresh();
      this.$refs.twp4LabFreeT4.OnForceRefresh();
      this.$refs.twp4ADR.OnForceRefresh();
      // let backObj = window.examRoomData.backObj
      // if(backObj != null){
      // 	this.selectedRadiographer = this.selectedRadiographer==null? backObj.PerformRadiographer1Id:this.selectedRadiographer
      // 	this.selectedRadiographer2 = this.selectedRadiographer2==null? backObj.PerformRadiographer2Id:this.selectedRadiographer2
      // 	this.selectedNurse = this.selectedNurse==null? backObj.PerformNurseId:this.selectedNurse
      // }
    },
    //
    //放射師1變更, 連動變更放射師2列表 (對應移除已選過的放射師項目)
    ChangeRadiographer () {
      //放射師2連帶動作
      // if (this.selectedRadiographer != null) this.optionsRadiographer2 = this.optionsRadiographer.filter(i => i.value != this.selectedRadiographer);
      // else this.optionsRadiographer2 = this.optionsRadiographer;

      // if (this.selectedRadiographer == this.selectedRadiographer2) this.selectedRadiographer2 = null;

      // //QC放射師連帶動作
      // if (this.selectedRadiographer != null) this.optionsRadiographerQC = this.optionsRadiographer.filter(i => i.value != this.selectedRadiographer);
      // else this.optionsRadiographerQC = this.optionsRadiographer;

      this.SaveLocalStorage(0);
      // localStorage.selectedRadiographer = this.selectedRadiographer ? this.selectedRadiographer : "";
      this.dataStore.masterData.PerformRadiographer1Id = this.selectedRadiographer;
    },
    //
    //放射師2變更
    ChangeRadiographer2 () {
      this.SaveLocalStorage(1);
      // localStorage.selectedRadiographer2 = this.selectedRadiographer2 ? this.selectedRadiographer2 : "";
      this.dataStore.masterData.PerformRadiographer2Id = this.selectedRadiographer2;
    },
    //
    //QC放射師變更
    ChangeRadiographerQC () {
      this.SaveLocalStorage(2);
      // localStorage.selectedRadiographer2 = this.selectedRadiographer2 ? this.selectedRadiographer2 : "";
      this.dataStore.masterData.QcRadiographerId = this.selectedRadiographerQC;
    },
    //
    //護理師變更
    ChangeNurse () {
      this.SaveLocalStorage(3);
      // localStorage.selectedNurse = this.selectedNurse ? this.selectedNurse : "";
      this.dataStore.masterData.PerformNurseId = this.selectedNurse;
    },
    //
    //儲存檢查室 放射師 護理師
    //type=> 0: 放射師1, 1:放射師2, 2:QC放射師, 3:護理師
    SaveLocalStorage (type) {
      let params = this.GetLocalStorage();
      if (type == 0) {
        params.PerformRadiographer1Id = this.selectedRadiographer ? this.selectedRadiographer : "";
      } else if (type == 1) {
        params.PerformRadiographer2Id = this.selectedRadiographer2 ? this.selectedRadiographer2 : "";
      } else if (type == 2) {
        params.QcRadiographerId = this.selectedRadiographerQC ? this.selectedRadiographerQC : "";
      } else if (type == 3) {
        params.PerformNurseId = this.selectedNurse ? this.selectedNurse : "";
      }

      localStorage.setItem("FI0202-" + this.selectedLabRoom, JSON.stringify(params));
    },
    //
    //取得檢查室 放射師 護理師
    GetLocalStorage () {
      let params = JSON.parse(localStorage.getItem("FI0202-" + this.selectedLabRoom));
      if (params) {
        params.PerformRadiographer1Id = params.PerformRadiographer1Id && params.PerformRadiographer1Id != "" ? params.PerformRadiographer1Id : null;
        params.PerformRadiographer2Id = params.PerformRadiographer2Id && params.PerformRadiographer2Id != "" ? params.PerformRadiographer2Id : null;
        params.QcRadiographerId = params.QcRadiographerId && params.QcRadiographerId != "" ? params.QcRadiographerId : null;
        params.PerformNurseId = params.PerformNurseId && params.PerformNurseId != "" ? params.PerformNurseId : null;
      } else {
        params = {
          PerformRadiographer1Id: null,
          PerformRadiographer2Id: null,
          QcRadiographerId: null,
          PerformNurseId: null
        };
      }
      return params;
    }
  },
  created () {
    //儲存FI0201 UI參數
    if (this.$route.params.backObj) this.tempFI0201UiParams = this.$route.params.backObj;
    // this.masterGUId = window.examRoomData.guid
    // if(this.masterGUId) {
    // 	var res = []
    // 	res = queryResult.DataRow(this.masterGUId)
    // 	if(res && res.length > 0) {
    // 		this.masterData = res[0]
    // 		this.$set(this.masterData, 'pSrName', patientSource.GetText(this.masterData.pSr))
    // 		this.$set(this.masterData, 'oSt', 31)
    // 		this.$set(this.masterData, 'oStName', opProgress.GetText(this.masterData.oSt))
    // 		//this.masterData.pNe = '壹貳参肆伍陸柒捌玖拾壹貳参肆伍陸柒捌玖'
    // 	}
    // 	//console.log(this.masterData)
    // }
    //
    //取得放射師列表
    //this.optionsRadiographer = opPRadiographer.Options()
    this.GetOptionsRadiographer();

    //取得護理師列表
    //this.optionsNurse = opPNurse.Options()
    this.GetOptionsNurse();
    //取得分派醫師
    this.GetDxPhysician();
    this.tableConfig4QueryLab = configLab;
    //queryLaboratory.PresentConfig();
    this.tableContent4QueryLab = queryLaboratory.DataSet();
    this.tableConfig4QueryADR = configADR;
    //queryADR.PresentConfig();
    this.tableContent4QueryADR = queryADR.DataSet();
    this.tableConfig4MandS = dsMandS.PresentConfig();
    this.tableContent4MandS = dsMandS.DataSet(this.masterData.pId);
  },
  mounted () {

    this.Click4CheckIn();
    //this.Click4BeginCheck()
    this.GetInputData();
    this.UIEnables();

    //ct mri 判斷
    if (this.masterData.modality.toLowerCase() == "ct" || this.masterData.modality.toLowerCase() == "mr") {
      this.isCtMri = true;
    } else {
      this.isCtMri = false;
    }

    //mg bmd 判斷
    if (this.masterData.modality.toLowerCase() == "mg" || this.masterData.modality.toLowerCase() == "bmd") {
      this.isMgBmd = true;
    } else {
      this.isMgBmd = false;
    }
    //CR 判斷
    if (this.masterData.modality.toLowerCase() == "cr") {
      this.isCR = true;
    } else {
      this.isCR = false;
    }

  }
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

.fade-enter-active {
  animation: go 0.5s;
}

.fade-leave-active {
  animation: back 0.5s;
}

div.lightTheme textarea.form-control,
div.darkTheme textarea.form-control {
  color: inherit;
}

@keyframes go {
  from {
    background-color: #fff;
  }
  to {
    background-color: #999;
  }
}

@keyframes back {
  from {
    background-color: #999;
  }
  to {
    background-color: #fff;
  }
}
</style>
