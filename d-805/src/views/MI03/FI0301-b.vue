/* eslint-disable no-empty */
<template>
  <div
    id="FI0301"
    class="pageContent pb-1"
    :class="{ 'mt-0': !getToggleReport.navigation }"
  >
    <div
      class="dtc-mask"
      v-if="showDtcMask"
    ></div>

    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-warning text-dark cardHeader btn-right d-flex justify-content-between align-items-center py-1">
        <div class="font-weight-bold">
          報告撰寫作業
          <span @click="showCallLab"></span>
        </div>
        <div style="height: 24px;">
          <toggle-button
            ref="toggleView"
            class="mr-1"
            @change="togglePatientDetailView"
            :value="getToggleReport.patientDetail"
            :key="'patientDetail_' + getToggleReport.patientDetail"
            color="#3545dc"
            :font-size="14"
            :height="24"
            :width="120"
            :labels="{ checked: '顯示病患詳情', unchecked: '顯示病患詳情' }"
          />

          <toggle-button
            ref="toggleView"
            @change="toggleDetailView(event)"
            :value="getToggleReport.reportDetail"
            :key="'reportDetail_' + getToggleReport.reportDetail"
            class="detail-btn"
            color="#dc3545"
            :font-size="14"
            :height="24"
            :width="100"
            :labels="{ checked: '顯示詳情', unchecked: '顯示詳情' }"
          />

          <toggle-button
            ref="toggleView"
            class="ml-1"
            @change="toggleNavigation"
            :value="getToggleReport.navigation"
            :key="'navigation_' + getToggleReport.navigation"
            color="#35dc45"
            :font-size="14"
            :height="24"
            :width="100"
            :labels="{ checked: '顯示頭部', unchecked: '顯示頭部' }"
          />
        </div>

        <div>
          <font-awesome-icon
            icon="cog"
            :disabled="!HotkeyList.length"
            class="mr-2 text-black cursor-pointer"
            @click="WinConfigOpen"
          />
          <font-awesome-icon
            icon="question"
            class="mr-1 cursor-pointer"
            hidden
            @click="HelpShow"
          />
        </div>
      </b-card-header>

      <b-card-text class="text-left py-1 m-0">
        <b-container
          fluid
          class="px-0"
        >
          <reportBaseInfo
            v-show="getToggleReport.patientDetail"
            :report="theReport"
            :procedure="theProcedure"
            :key="'baseinfo_' + theProcedure.AccessionNo"
            :optionsImageQuality="optionsImageQuality"
            :tempPhysicianId="tempPhysicianId"
            @ShowIQControlEdit="WinIQControlEdit"
            @updateSpecificVariable="updateSpecificVariable"
          />

          <reportRecordInfo
            v-show="getToggleReport.reportDetail"
            :key="'recordinfo_' + theProcedure.AccessionNo"
            :procedure="theProcedure"
            :report="theReport"
            class="mt-1"
          />

          <b-row
            no-gutters
            class="mt-1 main-toolbar align-items-center"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group>
                <div class="form-control dtc-version-num">
                  <div
                    @click="viewPrevRecord"
                    :style="numObj"
                    style="text-align:right;"
                  >
                    <font-awesome-icon icon="arrow-left" />
                  </div>
                  <div>{{ pageProcess }}</div>
                  <div
                    :style="numObj2"
                    @click="viewNextRecord(false)"
                  >
                    <font-awesome-icon icon="arrow-right" />
                  </div>
                </div>
              </b-input-group>
            </b-col>

            <div class="px-1">
              <b-input-group
                prepend="連續報告"
                id="non-stop"
              >
                <template v-slot="append">
                  <b-radio-group
                    readonly
                    name="ContinuousReport"
                    v-model="continuousReportCode"
                    :options="OptionsContinuousReport"
                    buttons
                    button-variant="outline-warning"
                  ></b-radio-group>
                </template>
              </b-input-group>
            </div>

            <div
              class="left-arrow dtc-arrow mr-2"
              :style="`visibility: ${leftMost ? 'hidden' : 'visible'}`"
              @click="clickLeftArrow"
              style="text-align:right; color: var(--themeTextColor);"
            >
              <font-awesome-icon icon="arrow-left" />
            </div>

            <div
              ref="dtcToolBar"
              class="dtc-toolbar flex-1"
            >
              <b-button
                v-if="isShiftNoteAvaliable"
                variant="warning"
                class="mr-1"
                @click="WinMass4ShiftNote"
              >
                <b-spinner
                  small
                  type="grow"
                  class="mr-1 align-middle"
                  v-if="ShiftNoteNeedsToClick"
                />
                <font-awesome-icon
                  v-else
                  icon="bell"
                  class="mr-1"
                />
                <span :class="{'blink': ShiftNoteNeedsToClick }">交班記錄</span>
              </b-button>

              <b-button
                variant="primary"
                class="mr-1"
                @click="callPacs"
                :disabled="lockingCallPacs"
              >
                <font-awesome-icon
                  icon="images"
                  class="mr-1"
                />呼叫PACS </b-button>
              <b-button
                variant="info"
                v-if="theReport.DxrStatus == 71"
                v-show="isAbleToModifyReport()"
                class="mr-1"
                @click="addNoteB4Save()"
              >
                <font-awesome-icon
                  icon="save"
                  class="mr-1"
                />修改報告
              </b-button>
              <b-button
                variant="info"
                v-if="theReport.DxrStatus != 71"
                class="mr-1"
                @click="DataSave(63)"
                :disabled="isSaving"
              >
                <font-awesome-icon
                  icon="save"
                  class="mr-1"
                />暫存報告
              </b-button>
              <b-button
                variant="success"
                class="mr-1"
                @click="DataSave(71)"
                :disabled="theReport.DxrStatus == 71 || isSaving"
              >
                <font-awesome-icon
                  icon="check"
                  class="mr-1"
                />正式報告
              </b-button>
              <b-button
                variant="primary"
                class="mr-1"
                @click="DataSave(65)"
                :disabled="theReport.DxrStatus == 71 || theReport.DxrStatus == 65 || theSamePerson || isSaving"
              >
                <font-awesome-icon
                  icon="chalkboard-teacher"
                  class="mr-1"
                />送交審核
              </b-button>
              <b-button
                variant="danger"
                class="mr-1"
                @click="DataSave(61)"
                :disabled="!(theSamePerson && theReport.DxrStatus == 65)"
              >
                <font-awesome-icon
                  icon="chalkboard-teacher"
                  class="mr-1"
                />退回重寫
              </b-button>
              <b-button
                variant="success"
                class="mr-1"
                @click="WinMass4Phrase"
              >
                <font-awesome-icon
                  icon="book-medical"
                  class="mr-1"
                />片語維護 </b-button>
              <b-button
                variant="danger"
                class="mr-1"
                @click="viewUrgentReport"
              >
                <font-awesome-icon
                  icon="sms"
                  class="mr-1"
                />緊急通報 </b-button>
              <b-button
                variant="info"
                class="mr-1"
                @click="callView"
              >
                <font-awesome-icon
                  icon="sms"
                  class="mr-1"
                />CALL LAB </b-button>
              <!--複雜呈現之按鈕-->

              <b-button
                v-if="!isShiftNoteAvaliable"
                variant="dark"
                :disabled="true"
                class="mr-1"
              >
                <font-awesome-icon
                  icon="bell"
                  class="mr-1"
                />
                <span>交班記錄</span>
              </b-button>

              <!-- <b-dropdown  id="dropdown-reportlist" text="癌症報告" dropleft  v-show="isCtMri">
									<b-dropdown-item v-for="(item,i) in reportList" :key="i" @click="editHtmlReport(item)">{{item.CSTName}}</b-dropdown-item>
              </b-dropdown>-->

              <b-button
                variant="info"
                :disabled="!isCtMri || cstTab.length === 6"
                @click="reportTemplateOpen"
                class="mr-1"
              >
                <font-awesome-icon
                  icon="edit"
                  class="mr-1"
                />癌症報告
              </b-button>

              <b-button
                variant="success"
                :disabled="!reportHistory.length"
                @click="versionHistoryOpen"
                class="mr-1"
              >
                <font-awesome-icon
                  icon="history"
                  class="mr-1"
                />報告版次
              </b-button>

              <b-button
                variant="success"
                @click="WinMass4Radiographer"
                class="mr-1"
              >
                <font-awesome-icon
                  icon="clipboard"
                  class="mr-1"
                />檢查註記 </b-button>
            </div>

            <div
              class="right-arrow dtc-arrow ml-2"
              @click="clickRightArrow"
              :style="`visibility: ${rightMost ? 'hidden' : 'visible'}`"
              style="color: var(--themeTextColor);"
            >
              <font-awesome-icon icon="arrow-right" />
            </div>

            <b-button
              variant="primary"
              class="dtc-back"
              @click="backToPreviousRoute"
            >
              <font-awesome-icon
                icon="arrow-circle-left"
                class="mx-1"
              />返回 </b-button>
          </b-row>

          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-card
                bg-variant="transparent"
                no-body
                class="border position-relative"
              >
                <b-card-header class="bg-primary font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left text-white"
                      @click="showVersionAlert(2)"
                    >
                      歷史診斷報告
                      {{ this.historyList.length > 0 && !this.loadingHistory ? `(共${this.historyList.length}筆 )` : "(暫無記錄)" }}
                    </b-col>
                  </b-row>
                </b-card-header>
                <b-card-text
                  v-if="this.loadingHistory"
                  class="d-flex flex-column text-center justify-content-center position-absolute w-100"
                  style="left: 50%; top: 50%; transform: translate(-50%);"
                >
                  <b-spinner
                    type="grow"
                    label="Spinning"
                    class="pl-3 mx-auto"
                  ></b-spinner>
                  <div>歷史診斷報告載入中, 請稍待 ..</div>
                </b-card-text>

                <b-card-text class="p-0">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <div
                        ref="blkHistoryList"
                        class="sb4RHis"
                        style="position:relative;"
                        :style="showDetailHeight"
                      >
                        <div
                          class="dtc-his-grid text-white"
                          style="background:#343a40"
                        >
                          <template v-if="historyList.length">
                            <div
                              style="padding-left:18px"
                              class="title"
                            >項目</div>
                            <div>
                              報告醫師
                            </div>
                            <div class="title">完成時間</div>
                          </template>
                        </div>

                        <div
                          class="dtc-his-grid"
                          style="padding-top:5px;"
                          v-for="(item, i) in historyList"
                          :id="'dtc-history' + i"
                          :key="'dtc-history' + i"
                          @click="viewHistoryReport(item, i)"
                          :class="i === 0 ? 'active-history' : ''"
                        >
                          <div
                            class="procedure pl-1"
                            :title="item.ProcedureNameList"
                          >
                            {{ item.ProcedureName ? item.ProcedureName : item.ReportContent }}
                          </div>

                          <div v-text="item.IssuePhysicianName"></div>

                          <div
                            class="time text-right"
                            :title="item.ProcedureNameList"
                            v-text="item.ProcedureCompleted ? item.ProcedureCompletedForShow : '暫無資料'"
                          />
                        </div>
                      </div>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
              id="blkReportInput"
              ref="blkReportInput"
              :sm="showHistoryDlg && theReport ? 5 : 10"
              class="px-1"
            >
              <b-textarea
                id="DxRMain"
                no-resize
                class="border-primary sb4RHis h-100"
                v-show="!showImgReport"
                ref="reportPlainText"
                v-model="theReport.ReportContent"
                @keyup.native.119="findReportPhraseStr()"
                placeholder="請於此處輸入報告內容"
                style="height:100%;padding-right:50px;font-family: Monaco !important;"
                wrap="hard"
              />
              <!-- spellcheck="false" -->
              <!-- debounce="500" -->
              <div
                class="sticky"
                v-if="reportImg"
              >
                <b-button-group v-show="!fullScreen">
                  <b-button
                    v-show="showCstBtns"
                    v-if="theReport.DxrStatus != 71"
                    variant="info"
                    size="sm"
                    class="mr-1"
                    @click="DataSave(63)"
                  >
                    <font-awesome-icon
                      icon="save"
                      class="mr-1"
                    />暫存報告
                  </b-button>

                  <b-button
                    v-show="showCstBtns"
                    size="sm"
                    variant="danger"
                    @click="showImgReport = true"
                  >
                    <font-awesome-icon
                      icon="chalkboard-teacher"
                      class="mr-1"
                    />切到癌症報告
                  </b-button>
                  <div
                    v-show="showCstBtns"
                    class="ml-1"
                  ></div>
                  <b-button
                    v-show="showCstBtns"
                    size="sm"
                    variant="info"
                    @click="exitFullScreen"
                  >
                    <font-awesome-icon icon="pen" />切到書寫報告 </b-button>
                  <toggle-button
                    ref="toggleView"
                    class="ml-2 mt-1"
                    @change="showCstBtns = !showCstBtns"
                    :value="showCstBtns"
                    color="#dc3545"
                    :height="24"
                    :width="24"
                  />
                </b-button-group>
              </div>
              <div
                class="sb4RHis report-tab dtc-vue-tab title_center"
                :style="showDetailHeight"
                v-show="showImgReport"
                v-if="cstTab.length"
              >
                <vue-tabs
                  ref="reportTabs"
                  active-tab-color="#e74c3c"
                  active-text-color="white"
                >
                  <v-tab
                    v-for="(item, i) in cstTab"
                    class="title_center"
                    :key="item.CSTName + '_' + item.updateCount"
                    :title="item.CSTName"
                    style="padding:10px;position:relative;"
                    @click="updateVtabTitle(item)"
                  >
                    <div
                      @click="updateVtabTitle(item)"
                      slot="title"
                    >
                      {{ item.CSTName }}
                      <span
                        @click.stop="_removeCstTab(i)"
                        class="tab-close"
                      >&times;</span>
                    </div>
                    <!-- <img class="img-border" :src="item.img" > -->

                    <form>
                      <div v-html="item.cstHtml" />
                    </form>
                  </v-tab>
                </vue-tabs>
              </div>
            </b-col>

            <b-col
              v-if="showHistoryDlg && theReport"
              sm="5"
            >
              <!-- :theProcedure="theProcedure"
              :historyList="historyList"
              :theReport="theReport"
              :viewHistoryItem="viewHistoryItem"
              v-on:closeModal="() => (showHistoryDlg = false)" -->

              <!-- :keyName="(HotkeyList.find(({method})=>method==='insertHistoryContent'))" -->

              <reportContentHistory
                v-if="HotkeyList.length > 0"
                :viewHistoryItem="viewHistoryItem"
                v-on:closeModal="() => (showHistoryDlg = false)"
                v-on:insertHistoryContent="insertHistoryContent"
                :keyName="KeyCode2Text(HotkeyList.find(({ method }) => method === 'insertHistoryContent')['hotkey'] || '')"
              />
              <!-- KeyCode2Text -->
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-modal
      id="WinDiff0301"
      ref="Window4Diff"
      centered
      hide-footer
      size="xl"
      no-fade
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="code-branch"
          class="mr-1"
        />
        <span class="zhTW">版本差異</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col>
            <!--
						<TxtDif :old-string="oldStr" :new-string="newStr" :context="10" outputFormat='side-by-side'/>
            -->
            <TxtDif
              :old-string="oldStr"
              :new-string="newStr"
              :context="10"
            />
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="WinMass0301"
      ref="Window4Mass"
      centered
      hide-footer
      scrollable
      size="xl"
      no-fade
      :header-bg-variant="winMassHeadBgV"
      :header-text-variant="winMassHeadTxV"
      body-class="py-1 themeModal border-right border-bottom border-left"
      :body-bg-variant="winMassBodyBgV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          :icon="winMassComponent ? 'book-medical' : 'procedures'"
          class="mr-1"
        />
        <span class="zhTW">{{ winMassTitle }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col class="px-1">
            <RxP
              v-if="winMassComponent"
              :instantContent="instantContent"
              v-on:clearInstantContent="() => (instantContent = '')"
            />
            <b-textarea
              v-else
              no-resize
              rows="32"
              v-model="winMassContent"
              readonly
            />
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="WinHotkeyDetect0301"
      ref="WinHotkeyDetect"
      centered
      hide-footer
      no-fade
      body-class="py-1 themeModal"
      :header-bg-variant="winConfig4HotkeyDetect.HeadBgV"
      :header-text-variant="winConfig4HotkeyDetect.HeadTxV"
      :body-bg-variant="winConfig4HotkeyDetect.BodyBgV"
      :body-text-variant="winConfig4HotkeyDetect.BodyTxV"
      @ok="ModalOk"
      @cancel="ModalCancel"
      @close="ModalClose"
      @hide="ModalHide"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="cog"
          class="mr-1"
        />
        <span class="zhTW">{{ winConfig4HotkeyDetect.Title }}</span>
      </template>
      <div class="d-block zhTW">
        <b-container>
          <b-row class="mb-4">
            <b-col>
              <div>
                <!-- :class="$IsThemeBlack() ? 'text-white' : 'text-danger'" -->
                <span>
                  注意: 請勿按下
                  <span class="align-text-bottom mx-1"> <kbd>Alt</kbd> + <kbd>F4</kbd> </span>,
                  <span>那會關閉瀏覽器 !</span>
                </span>
              </div>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col>
              <div>
                <span v-html="HotkeyPressRemark"></span>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div>
                <span v-html="HotkeyPressMessage"></span>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="float-right">
                <b-button
                  variant="warning"
                  class="mr-1"
                  @click="EndOfKPInterceptor"
                  :disabled="!(HotkeyPressed && HotkeyPressed.length > 0)"
                >
                  <font-awesome-icon
                    icon="check"
                    class="mr-1"
                  />儲存設定
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>

    <b-modal
      id="WinIQControl0301"
      ref="WinIQControl"
      centered
      hide-footer
      no-fade
      size="xl"
      body-class="py-1 themeModal"
      :header-bg-variant="winIQControl.HeadBgV"
      :header-text-variant="winIQControl.HeadTxV"
      :body-bg-variant="winIQControl.BodyBgV"
      :body-text-variant="winIQControl.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="image"
          class="mr-1"
        />
        <span class="zhTW">{{ winIQControl.Title }}</span>
      </template>
      <div class="d-block zhTW">
        <b-container>
          <b-row>
            <b-col class="px-0">
              <b-row class="mt-1">
                <b-col>
                  <b-input-group>
                    <template v-slot:prepend>
                      <!-- :class="{ 'bg-light': $IsThemeBlack(), 'text-dark': $IsThemeBlack() }" -->
                      <b-input-group-text>影像品質</b-input-group-text>
                    </template>
                    <template v-slot="append">
                      <b-radio-group
                        readonly
                        name="ImageQualitySelect"
                        v-model="DxReportIQCode"
                        :options="optionsImageQuality"
                        buttons
                        button-variant="outline-primary"
                      />
                    </template>
                  </b-input-group>
                </b-col>
              </b-row>
              <b-row class="mt-1 mb-1">
                <b-col>
                  <b-textarea
                    id="IQCNote"
                    ref="IQControlNote"
                    no-resize
                    rows="15"
                    class="border-primary"
                    v-model="DxReportIQNote"
                    placeholder="請於此處輸入影像品質註記"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>

    <b-modal
      id="WinConfig0301"
      ref="WinConfig"
      centered
      hide-footer
      no-fade
      size="xl"
      body-class="py-1 themeModal border-bottom border-right border-left rounded-bottom"
      :header-bg-variant="winConfigure.HeadBgV"
      :header-text-variant="winConfigure.HeadTxV"
      :body-bg-variant="winConfigure.BodyBgV"
      :body-text-variant="winConfigure.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="cog"
          class="mr-1"
        />
        <span class="zhTW">{{ winConfigure.Title }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col class="px-0">
            <b-container
              fluid
              class="px-1"
            >
              <b-row>
                <b-col>
                  <hr />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-container>
                    <b-row
                      v-for="(i, index) in Math.ceil(HotkeyTempSet.length / 3)"
                      :key="index"
                      class="my-1"
                    >
                      <b-col
                        sm="4"
                        v-for="(item, idx) in HotkeyTempSet.slice((i - 1) * 3, i * 3)"
                        :key="idx"
                      >
                        <b-button
                          :variant="$IsThemeBlack() ? 'primary' : 'success'"
                          @click="Item4Config(item.title)"
                          class="mr-1"
                        >{{ item.title }}</b-button>
                        <span
                          v-html="KeyCode2Text(item.hotkey)"
                          class="mx-1"
                        ></span>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <hr />
                </b-col>
              </b-row>
              <b-row class="my-2">
                <b-col>
                  <div class="float-right">
                    <b-button
                      variant="info"
                      hidden
                      class="mr-2"
                      @click="HotkeyConfigReset"
                    >
                      <font-awesome-icon
                        icon="undo"
                        class="mr-1"
                      />回復設定 </b-button>
                    <b-button
                      variant="danger"
                      class="mr-2"
                      @click="HotkeyConfigDefault"
                    >
                      <font-awesome-icon
                        icon="eraser"
                        class="mr-1"
                      />重置成系統初始設定 </b-button>
                    <b-button
                      variant="warning"
                      hidden
                      class="mr-2"
                      @click="HotkeyConfigSave"
                    >
                      <font-awesome-icon
                        icon="save"
                        class="mr-1"
                      />儲存設定 </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="WinHelp0301"
      ref="WinHelp"
      centered
      hide-footer
      no-fade
      size="xl"
      body-class="py-1 themeModal"
      :header-bg-variant="winConfig4HotkeyDetect.HeadBgV"
      :header-text-variant="winConfig4HotkeyDetect.HeadTxV"
      :body-bg-variant="winConfig4HotkeyDetect.BodyBgV"
      :body-text-variant="winConfig4HotkeyDetect.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="question"
          class="mr-1"
        />
        <span class="zhTW">{{ winConfig4HotkeyDetect.Title }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col class="px-0">
            <b-container
              fluid
              class="px-1"
            >
              <b-row>
                <b-col>
                  <h4>Hotkey:</h4>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <hr />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-container>
                    <b-row
                      v-for="(i, index) in Math.ceil(HotkeyList.length / 3)"
                      :key="index"
                      class="my-1"
                    >
                      <b-col
                        sm="4"
                        v-for="(item, idx) in HotkeyList.slice((i - 1) * 3, i * 3)"
                        :key="idx"
                      >
                        <span class="mr-1">{{ item.title }}</span>
                        <span
                          v-html="KeyCode2Text(item.hotkey)"
                          class="align-text-bottom mx-1"
                        ></span>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <hr />
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="report-template"
      ref="reportTemplate"
      centered
      hide-footer
      no-fade
      size="sm"
      scrollable
      body-class="py-1 themeModal border-right border-left border-bottom"
      :header-bg-variant="winConfig4ReportTemple.HeadBgV"
      :header-text-variant="winConfig4ReportTemple.HeadTxV"
      :body-bg-variant="winConfig4ReportTemple.BodyBgV"
      :body-text-variant="winConfig4ReportTemple.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="edit"
          class="mr-1"
        />
        <span class="zhTW">癌症報告</span>
      </template>
      <div>
        <b-link
          style="display:block;"
          class="my-1"
          v-for="(item, i) in reportList"
          :key="i"
          @click="editHtmlReport(item)"
        >
          {{ item.CSTName }}
        </b-link>
      </div>
    </b-modal>

    <b-modal
      id="sub-template"
      ref="subTemplate"
      centered
      hide-footer
      no-fade
      size="sm"
      scrollable
      body-class="py-1 themeModal"
      :header-bg-variant="winConfig4ReportTemple.HeadBgV"
      :header-text-variant="winConfig4ReportTemple.HeadTxV"
      :body-bg-variant="winConfig4ReportTemple.BodyBgV"
      :body-text-variant="winConfig4ReportTemple.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="file-alt"
          class="mr-1"
        />
        <span class="zhTW">次專科報告</span>
      </template>
      <div>
        <b-link
          style="display:block;"
          class="my-1"
          v-for="(item, i) in subrList"
          :key="i"
          @click="editHtmlReport(item)"
        >
          {{ item.CSTName }}
        </b-link>
      </div>
    </b-modal>

    <b-modal
      id="version-history"
      ref="versionHistory"
      centered
      hide-footer
      no-fade
      size="sm"
      scrollable
      body-class="py-1 themeModal border-bottom border-right border-left"
      :header-bg-variant="winConfig4VersionHistory.HeadBgV"
      :header-text-variant="winConfig4VersionHistory.HeadTxV"
      :body-text-variant="winConfig4VersionHistory.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="code-branch"
          class="mr-1"
        />
        <span class="zhTW">{{ `報告版次(共` + reportHistory.length + `筆 )` }}</span>
      </template>
      <div>
        <b-link
          style="display:block;"
          class="my-1"
          v-for="(item, index) in reportHistory"
          v-bind:key="index"
          @click="DoThis(innerProprty4DynamicDeclare.name4ContentDiff, item)"
        >{{ item }}</b-link>
      </div>
    </b-modal>

    <ModifyReport :patient="theProcedure || {}" />

    <b-modal
      id="urgent-report"
      ref="urgentReport"
      centered
      hide-footer
      no-fade
      size="lg"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="winConfig4VersionHistory.HeadBgV"
      :header-text-variant="winConfig4VersionHistory.HeadTxV"
      :body-bg-variant="winConfig4VersionHistory.BodyBgV"
      :body-text-variant="winConfig4VersionHistory.BodyTxV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          icon="code-branch"
          class="mr-1"
        />
        <span class="zhTW">緊急通報</span>
      </template>
      <div style="margin-top:12px">
        <div
          class="mb-3 rounded"
          v-if="emergencyKeyWords.length > 0"
        >
          <div>文章內有含以下關鍵字:</div>
          <div class="d-flex flex-wrap p-2">
            <div
              class="bg-primary text-white p-1 px-2 rounded mr-1"
              v-for="keyword in emergencyKeyWords"
              :key="keyword"
              v-text="keyword"
            />
          </div>
        </div>

        <div style="margin-bottom:12px;">緊急傳呼發給開單醫師的簡訊如下:</div>
        <b-input-group
          prepend="通報等級"
          @click="
            urgentOpt = 1;
            otherInput = '';
          "
        >
          <template v-slot="append">
            <b-radio-group
              v-model="urgentPriorityCode"
              :options="urgentLevels"
              buttons
              button-variant="outline-danger"
            ></b-radio-group>
          </template>
        </b-input-group>
        <div
          v-for="(item, i) in urgOptions"
          :key="item.id"
          class="urgent-opt ml-3 my-2"
          v-show="urgentPriorityCode == 'u2'"
        >
          <input
            type="radio"
            :id="item.id"
            v-model="urgentOpt"
            :value="item.value"
          />
          <label :for="item.id">{{ item.text }}</label>
          <input
            class="input"
            v-if="i + 1 === urgOptions.length"
            v-model="otherInput"
          />
        </div>
        <div
          v-for="(item, i) in urg2Options"
          :key="item.id"
          class="urgent-opt ml-3 my-2"
          v-show="urgentPriorityCode == 'u1'"
        >
          <input
            type="radio"
            :id="item.id"
            v-model="urgentOpt"
            :value="item.value"
          />
          <label :for="item.id">{{ item.text }}</label>
          <input
            class="input"
            v-if="i + 1 === urg2Options.length"
            v-model="otherInput"
          />
        </div>

        <div
          v-for="(item, i) in norOptions"
          :key="item.id"
          class="urgent-opt ml-3 my-2"
          v-show="urgentPriorityCode == 'u3'"
        >
          <input
            type="radio"
            :id="item.id"
            v-model="urgentOpt"
            :value="item.value"
          />
          <label :for="item.id">{{ item.text }}</label>
          <input
            class="input"
            v-if="i + 1 === norOptions.length"
            v-model="otherInput"
          />
        </div>

        <textarea
          class="sms-input"
          :value="urgentPlaceholder"
        ></textarea>
        <div class="urgent-btns">
          <b-btn
            variant="secondary"
            style="visibility: hidden;"
            class="px-5"
            size="lg"
          >報告內容</b-btn>
          <div></div>
          <b-btn
            variant="primary"
            class="px-5"
            size="lg"
            @click="notifyUrgentMsg"
          >確定</b-btn>
          <b-btn
            variant="secondary"
            @click="$bvModal.hide('urgent-report')"
            size="lg"
            class="px-5"
          >取消</b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="view-history2"
      ref="viewHistory"
      centered
      hide-footer
      no-fade
      style="min-width:100vw"
      scrollable
      body-class="py-1 themeModal border-bottom border-right border-left"
      :header-bg-variant="winConfig4VersionHistory.HeadBgV"
      :header-text-variant="winConfig4VersionHistory.HeadTxV"
      :body-bg-variant="winConfig4VersionHistory.BodyBgV"
      :body-text-variant="winConfig4VersionHistory.BodyTxV"
    >
      <template slot="modal-title">
        <!-- <font-awesome-icon
          icon="wpforms"
          class="mr-1"
        /> -->
        <span class="zhTW">歷史診斷報告</span>
      </template>
      <div class="view-history-pop">
        <div
          class="wired-content"
          v-show="viewHistoryItem.ReportSource === 'EBM'"
        >
          <b-button
            @click="copyPasteText(viewHistoryItem.ReportContent)"
            variant="info"
          >
            <font-awesome-icon
              icon="copy"
              class="mr-1"
            />複製診斷報告內文 </b-button>
          <div
            v-if="copyOk"
            style="color:red;"
          >資料已複製並貼上</div>
          <b-textarea
            v-model="viewHistoryItem.ReportContent"
            style="flex:1"
          ></b-textarea>
        </div>
        <div
          class="left"
          v-show="viewHistoryItem.ReportSource === 'DTC'"
        >
          <div class="block">
            <div>檢查項目 :</div>
            <div>{{ viewHistoryItem.ProcedureNameList ? viewHistoryItem.ProcedureNameList : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>檢查完成時間 :</div>
            <div v-text="DateToString(new Date(viewHistoryItem.IssueTime), true)"></div>
          </div>
          <div class="block">
            <div>申請單號:</div>
            <div>{{ viewHistoryItem.OrderNo }}</div>
          </div>
          <div class="block">
            <div>申請單號:</div>
            <div>{{ viewHistoryItem.AccessionNo }}</div>
          </div>
          <div class="block">
            <div>報告狀態:</div>
            <div v-text="getStatus(viewHistoryItem.DxrStatus)"></div>
          </div>
          <div class="block">
            <div>報告版次:</div>
            <div>{{ viewHistoryItem.DxrVersion }}</div>
          </div>
          <div class="block">
            <div>撰寫人員代碼:</div>
            <div>{{ viewHistoryItem.DxreportPhysicianId }}</div>
          </div>
          <div class="block">
            <div>審核人員代碼:</div>
            <div>{{ viewHistoryItem.ApprovalPhysicianId ? viewHistoryItem.ApprovalPhysicianId : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>正式報告醫師代碼:</div>
            <div>{{ viewHistoryItem.IssuePhysicianId ? viewHistoryItem.IssuePhysicianId : "暫無資料" }}</div>
          </div>

          <div class="block">
            <div>正式報告審核成立之日期時間:</div>
            <div v-text="DateToString(new Date(viewHistoryItem.IssueTime), true)"></div>
          </div>
          <div class="block">
            <div>正式報告醫師之證照編號:</div>
            <div>{{ viewHistoryItem.IssuePhysicianMdlNo ? viewHistoryItem.IssuePhysicianMdlNo : "暫無資料" }}</div>
          </div>
          <div
            class="block"
            hidden
          >
            <div>Image</div>
            <div>{{ viewHistoryItem.StructureImage ? viewHistoryItem.StructureImage : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>病歷號:</div>
            <div>{{ viewHistoryItem.PatientId ? viewHistoryItem.PatientId : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>報告撰寫人員:</div>
            <div>{{ viewHistoryItem.DxreportPhysicianName ? viewHistoryItem.DxreportPhysicianName : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>審核人員 :</div>
            <div>{{ viewHistoryItem.ApprovalPhysicianName ? viewHistoryItem.ApprovalPhysicianName : "暫無資料" }}</div>
          </div>
          <div class="block">
            <div>正式報告醫師 :</div>
            <div>{{ viewHistoryItem.IssuePhysicianName ? viewHistoryItem.IssuePhysicianName : "暫無資料" }}</div>
          </div>
        </div>
        <div
          class="right"
          v-show="viewHistoryItem.ReportSource === 'DTC'"
        >
          <div v-if="viewHistoryItem.CSTName1">
            <vue-tabs
              active-tab-color="#e74c3c"
              active-text-color="white"
              class="dtc-vue-tab-history"
            >
              <v-tab
                v-for="item in 6"
                :key="item"
                :title="viewHistoryItem[`CSTName${item}`]"
                class="title_center"
                style="padding:10px;position:relative;color:white"
                v-if="viewHistoryItem[`CSTName${item}`]"
              >
                <div slot="title">{{ viewHistoryItem[`CSTName${item}`] }}</div>
                <form>
                  <div v-html="viewHistoryItem[`StructureContent${item}`]"></div>
                </form>
                <!-- <img class="img-border" :src="viewHistoryItem[`StructureImage${item}`]" /> -->
              </v-tab>
            </vue-tabs>
          </div>
          <div
            class="mb-2"
            style="margin-top:1rem;"
          >
            診斷報告內文
            <b-button
              v-if="viewHistoryItem.ReportContent"
              @click="copyPasteText(viewHistoryItem.ReportContent)"
              variant="info"
            >
              <font-awesome-icon
                icon="copy"
                class="mr-1"
              />複製診斷報告內文
            </b-button>
          </div>
          <div
            v-if="copyOk"
            style="color:red;"
          >資料已複製並貼上</div>
          <div
            v-if="!viewHistoryItem.ReportContent"
            class="mb-5"
          >暫無記錄</div>
          <b-textarea
            v-if="viewHistoryItem.ReportContent"
            v-model="viewHistoryItem.ReportContent"
            class="mb-5"
            style="width:50vw; min-height:calc(100vh-250px);"
          ></b-textarea>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="WinCST0301"
      ref="WinCST"
      centered
      @hide="WinCSTHide"
    >
      <div class="d-block zhTW">
        <b-form id="WinCST0301DxRSC">
          <b-row ref="myReportImg">
            <b-col
              class="px-2"
              id="my-report-img"
              v-html="cstReportHtml"
            ></b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>

    <wasteImage
      :show.sync="showWasteImage"
      :patient="theProcedure || {}"
      :stepDefault="3"
    />
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import reportBaseInfo from "./reportBaseInfo";
import reportRecordInfo from "./reportRecordInfo";
import BusFactory from "@/assets/js/busFactory.js";
import Swal from "sweetalert2";
import * as configs from "@/config";
// import Loading from "@/components/home/Loading";
import ModifyReport from "./ModifyReport";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
// import HistoryReport from "@/components/HistoryReportModal";
// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control;
const KeyCode4Alternate = configs.KeyCode4Alternate;
const KeyCode4Shift = configs.KeyCode4Shift;
// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
import { defaultHotKeyArr, modifyOptions1, modifyOptions2, urgOptions, urg2Options, norOptions } from "./defaultData";
import reportContentHistory from "@/components/ReportContentHistory";
import wasteImage from "@/components/WasteImage.vue";
// 動態宣告-外部
var OutterProprty4DynamicDeclare = {
  name4ContentDiff: "versionDiffByDynamic",
};

//	1. 安裝: $ npm i vue-code-diff
//	2. 再加自行撰寫 TextDiff
//	- 這個 plug-in 不是很合用, 但先勉強湊和著用
import TxtDif from "@/components/TextDiff";

// 載入模組:片語維護
import RxP from "@/components/CI0302ReportPhrase";
import { getCstList, callPaceWebSocket, getReportByAccessionNo, reportSave, getReportContents } from "@/assets/service/dataManager";
export default {
  name: "FI0301",
  components: { TxtDif, RxP, ModifyReport, reportContentHistory, reportBaseInfo, reportRecordInfo, wasteImage },
  mixins: [dateFormatMixin],
  data () {
    return {
      isMounted: false,
      showHistoryDlg: false,
      showDtcMask: false,
      windowObj: "",
      callLab: "https://onepage.wanfang.gov.tw/#@",
      showCstBtns: true,
      loadingHistory: false,
      showAlert: false,
      copyOk: false,
      cstTab: [],
      cstTabName: "",
      title: "書寫報告書寫",
      smsMsg: "",
      whySaveText: "",
      isDataChange: false,
      // phraseRecords: [],
      otherInput: "",
      hideNextPrevBtn: false,
      nextViewArr: [],
      modifyOpt: 1,
      modifyOptions: [],
      modifyOptions1,
      modifyOptions2,
      cstReportHtml: "",
      urgentPriorityCode: "u1",
      urgentOpt: "1",
      urgOptions,
      urg2Options,
      norOptions,
      dxrVersion: "",
      currentNum: 1,
      perPage: 10,
      currentPage: 1,
      currentTab: "",
      initArray: [],
      totalArrayLen: "",
      viewHistoryItem: "",
      imgQualityList: [],
      ApprovalPhysicianName: null,
      approvalList: [],
      historyList: [],
      options: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
      ],
      leftMost: true,
      rightMost: false,
      myFullScreenItem: "",
      reportList: [],
      subrList: [],
      fullScreen: false,
      gray: "#868e96",
      showImgReport: false,
      reportImg: "",
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      VueNestLevel: 0,
      //
      UserId: "Pollux",
      // 功能啟動時之先決條件的處理狀況
      prerequisiteCompleted: false,
      prerequisiteFailure: false,
      // 動態宣告-內部
      innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black,
      },
      // 內文差異比對
      oldStr: "Older String",
      newStr: "Newer String",
      // 大對話框呈現內文
      winMassTitle: "",
      winMassContent: "",
      winMassHeadBgV: "",
      winMassHeadTxV: "",
      winMassBodyBgV: "",
      winMassComponent: false,
      winConfigure: {
        Title: `HotKey 組態設定 (共${defaultHotKeyArr.length}筆)`,
      },
      winIQControl: {
        Title: "影像品質",
      },
      winConfig4HotkeyDetect: {
        Title: "Hotkey 設定",
      },
      winConfig4StructureReport: {
        Title: "編輯癌症報告",
      },
      winConfig4ReportTemple: {
        Title: "癌症報告",
      },
      winConfig4VersionHistory: {
        Title: "歷史版本",
      },
      HotkeyList: [],
      HotkeyTempSet: [],
      HotkeyCurrentItemName: "",
      HotkeyPressed: "",
      HotkeyPressRemark: "",
      HotkeyPressMessage: "",
      UnderHotkeyDetect: false,
      // 片語相關資料
      reportPhrase: {
        GUID: -1,
        PhraseCode: "",
        Replacement: "",
        OPPrgId: "",
      },
      theMacroList: [],
      // 檢查相關資料
      casePriorityCode: "Y",
      continuousReportCode: "Y",
      theProcedure: {
        StatusName: "",
        AccessionNo: "123A567BC", //申請單號(大單號)
        StudyDate: "2019/10/14", //檢查日期
        Modality: "CT/MRI", //檢查儀器
        PatientId: "1234567-8", //病歷號
        PatientSourceType: "O-門診", //病患來源
        PatientName: "趙大升",
        PatientSex: "M-男性",
        PatientBirthday: "1943/12/31",
        PatientAge: 76,
        Subjective: "這裡放的是病患主訴",
        Objective: "這裡是醫師客觀",
        //RadiographerNote: '這是放射師的檢查註記',
        RadiographerNote:
          "這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n",
        RequestingPhysicianId: "1231",
        RequestingPhysicianName: "開單醫師",
        BedNo: "701221", //床號
        ShiftNote: "這是交班記錄",
        ShiftPhysicianName: "",
      },
      labProcedures: "檢查項目一\n檢查項目二\n檢查項目三\n檢查項目四",
      // 報告相關資料
      theReport: { IsPositive: true },
      origReportContent: "",
      origCstHtmlData: "",
      reportHistory: [],
      optionsImageQuality: [],
      instantContent: "",
      busFactory: BusFactory(this),
      storeQuery: { tabList: null, query: null, searchCondition: null, rows: [] },
      sortMethod: null,
      tempPhysicianId: null,
      emergencyKeyWords: [],
      lockingCallPacs: false,
      isFetchingData: "",
      showWasteImage: false,
      toggleTime: Date.now(),
      lackNextReport: false,
      ShiftNoteNeedsToClick: false
    };
  },
  computed: {
    ...mapState(["DxreportPhysician", "phrase", "attendingDrs", "Profile4User"]),
    ...mapGetters(["getProfile4User", "getProfileHotkeySetting", "getIssueDrs", "getToggleReport"]),
    isShiftNoteAvaliable () {
      return this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0
    },
    urgentReportShow () {
      return this.isMounted && this.$refs["urgentReport"] && this.$refs["urgentReport"].isShow
        ? true
        : false;
    },
    Window4MassShow () {
      return this.isMounted && this.$refs['Window4Mass'] && this.$refs['Window4Mass'].isShow
        ? true
        : false;
    },

    ReportTempShow () {
      return this.isMounted && this.$refs['reportTemplate'] && this.$refs['reportTemplate'].isShow
        ? true
        : false;
    },
    SubTemplateShow () {
      return this.isMounted && this.$refs['subTemplate'] && this.$refs['subTemplate'].isShow
        ? true
        : false;
    },
    showDetailHeight () {
      const height =
        this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
          ? 450
          : this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
            ? 333
            : !this.getToggleReport.reportDetail && this.getToggleReport.patientDetail
              ? 302
              : !this.getToggleReport.reportDetail && !this.getToggleReport.patientDetail
                ? 184
                : 184;

      return { height: `calc(100vh - ${height - (this.getToggleReport.navigation ? 0 : 60)}px)` };
    },
    pageIndex () {
      return this.totalArrayLen !== this.initArray.length // 資料未載完
        ? this.currentNum + (this.currentPage - 1) * this.perPage
        : this.currentNum;
    },
    pageProcess () {
      return `${this.pageIndex}/${this.totalArrayLen}`;
    },
    isSaving () {
      return !window.isSavingDtc ? false : window.isSavingDtc;
    },
    phraseRecords () {
      return this.phrase.private.length === 0 && this.phrase.public.length === 0 ? [] : [...this.phrase.private, ...this.phrase.public];
    },
    loginId () {
      return this.$store.state.Profile4User.id;
    },
    theSamePerson () {
      const v = this.theReport.IssuePhysicianId === this.loginId;
      return v;
    },
    numObj () {
      return {
        visibility: this.currentNum + (this.currentPage - 1) * this.perPage <= 1 || this.hideNextPrevBtn ? "hidden" : "visible",
        cursor: "pointer",
      };
    },
    numObj2 () {
      return {
        visibility: this.pageIndex >= this.totalArrayLen || this.hideNextPrevBtn ? "hidden" : "visible",
        cursor: "pointer",
      };
    },
    urgentPlaceholder () {
      const selectVal = (this.urgentPriorityCode === "u2" ? this.urgOptions : this.urgentPriorityCode === "u1" ? this.urg2Options : this.norOptions).find(
        ({ value }) => value == this.urgentOpt
      );

      if (!selectVal) return "";
      return `病患姓名: ${this.theProcedure.PatientName} 病歷號: ${this.theProcedure.PatientId}  ${
        this.urgentPriorityCode === "u2" ? "緊急危險" : this.urgentPriorityCode === "u1" ? "異常值" : "普通"
        }(${selectVal.text}), 請速閱放射報告,並聯絡病患. ${this.urgentOpt == 90 ? this.otherInput : ""} `;
    },
    isCtMri () {
      return this.theProcedure.Modality && (this.theProcedure.Modality.includes("CT") || this.theProcedure.Modality.includes("MR"));
    },
    MacroItemList () {
      // 片語簡易清單
      // console.log(this.$logs());
      return this.theMacroList;
    },
    urgentLevels () {
      return [
        { text: "異常值通報", value: "u1" },
        { text: "緊急危險通報", value: "u2" },
        { text: "普通通報", value: "u3" },
      ];
    },
    OptionsCasePriority () {
      return this.casePriorityCode == "Y" ? [{ text: "急件", value: "Y" }] : [{ text: "一般", value: "N" }];
    },
    OptionsContinuousReport () {
      // 連續(登打)報告之啟用與否?
      return [
        { text: "啟用", value: "Y" },
        { text: "取消", value: "N" },
      ];
    },
    DxReportVersion: {
      get () {
        return this.dxrVersion ? this.dxrVersion : "編輯中...";
      },
      set (v) {
        this.dxrVersion = v;
      },
    },
    DxReportContent: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ReportContent) ? this.theReport.ReportContent : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ReportContent)) this.theReport.ReportContent = v;
      },
    },
    DxReportExtraNote: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ExtraNote) ? this.theReport.ExtraNote : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ExtraNote)) this.theReport.ExtraNote = v;
      },
    },
    DxReportIQCode: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ImageQualityCode) ? this.theReport.ImageQualityCode : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityCode)) this.theReport.ImageQualityCode = v;
      },
    },
    DxReportIQNote: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ImageQualityNote) ? this.theReport.ImageQualityNote : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityNote)) this.theReport.ImageQualityNote = v;
      },
    },
  },
  methods: {
    ...mapMutations([
      "SHOW_LOADING",
      "HIDE_LOADING",
      "SET_SIDE_MESSAGE",
      "CLEAR_PHRASE",
      "SET_PRIVATE_PHRASE",
      "SET_PUBLIC_PHRASE",
      "SET_ATTENDING_DR",
      "SET_HOTKEY",
      "SET_REPORT_TOGGLE",
    ]),
    ...mapActions(["action_getPhrase"]),
    updateSpecificVariable ({ key, value }) {
      this[key] = value;
    },
    insertHistoryContent () {
      if (!this.showHistoryDlg) return;
      this.showImgReport = false;
      const sltStart = this.$refs.reportPlainText.selectionStart;
      // 前文
      const textBefore = this.theReport.ReportContent ? this.theReport.ReportContent.substring(0, sltStart) : "";
      // 後文
      const textAfter = this.theReport.ReportContent ? this.theReport.ReportContent.substring(sltStart, this.theReport.ReportContent.length) : "";
      // 插入後的新位置
      const newSelectPos = textBefore.length + this.viewHistoryItem.ReportContent.length;
      // const newSelectPos = this.theReport.ReportContent.length + this.viewHistoryItem.ReportContent.length - textAfter.length;

      this.theReport.ReportContent = textBefore + this.viewHistoryItem.ReportContent + textAfter;
      this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos;

      this.$nextTick(() => {
        this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos;
      });
      // setTimeout(() => {
      //   // const newPos = this.theReport.ReportContent.length - textAfter.length;
      //   this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos;
      // }, 300);
    },
    showVersionAlert (n) {
      if (!this.showAlert && n === 1) {
        this.showAlert = true;
        return;
      } else if (this.showAlert && n === 2) {
        // alert("this.origDxStatus " + this.origDxStatus + "\n" + "this.theReport.DxrStatus:  " + this.theReport.DxrStatus);
      }
    },
    _removeCstTab (i) {
      Swal.fire({
        title: "移除癌症報告:",
        text: `${this.cstTab[i].CSTName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          this.removeCstTab(i);
        }
      });
    },
    removeCstTab (i) {
      this.cstTab.splice(i, 1);
      if (!this.cstTab.length) {
        this.reportImg = "";
        this.showImgReport = false;
        this.cstTabName = "";
      } else {
        this.cstTabName = this.cstTab[0].CSTName;
      }
      if (this.theReport.DxrStatus == 71) return;
      this.DataSave(this.theReport.DxrStatus, true);
    },
    ShiftNoteNotice () {
      return this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0 && this.ShiftNoteNeedsToClick;
    },
    async notifyUrgentMsg () {
      if (!this.urgentPlaceholder) {
        this.SET_SIDE_MESSAGE({ msg: "尚未輸入緊急通報原因, 不得存檔.", type: 2 });
        return;
      }
      const obj = {
        RequestingPhysicianId: this.theProcedure.RequestingPhysicianId,
        DxReportPhysicianId: this.theReport.DxreportPhysicianId ? this.theReport.DxreportPhysicianId : this.loginId,
        AccessionNo: this.theProcedure.AccessionNo,
        Message: this.urgentPlaceholder,
        HRRLevelId: this.urgentPriorityCode == "u2" ? "1" : this.urgentPriorityCode == "u1" ? "2" : "3",
        HRRItemId: this.urgentOpt,
        HRRItemDesc: this[this.urgentPriorityCode == "u2" ? "urgOptions" : this.urgentPriorityCode == "u1" ? "urg2Options" : "norOptions"].find(
          ({ value }) => value == this.urgentOpt
        ).text,
        HRROthersNote: this.otherInput,
      };
      this.SHOW_LOADING();
      try {
        await window.axios.post("/Hrr/Save", obj);
        this.SET_SIDE_MESSAGE({ msg: "緊急通知成功送出" });
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: "送出緊急通知失敗", type: 2 });
      } finally {
        this.HIDE_LOADING();
        this.$bvModal.hide("urgent-report");
      }
    },
    showCallLab () {
      // alert(window.callLabUrl);
    },
    async callView () {
      const url = this.callLab + this.theProcedure.PatientId;
      let ok = true;
      //this.openPopupWindow();
      this.windowObj = window.open();
      try {
        this.SET_SIDE_MESSAGE({ msg: "CALL LAB 送出 " });
        this.windowObj.location.href = url;
        window.callLabUrl = url;
      } catch (e) {
        ok = false;
      } finally {
        //setTimeout(() => this.windowObj.close(),5000);
        if (ok) console.log("");
        //this.SET_SIDE_MESSAGE('CALL LAB 成功送出 @ ' + url);
        else this.SET_SIDE_MESSAGE({ msg: "CALL LAB 通知失敗 @ " + url, type: 2 });
      }
    },
    _removeActiveHistoryCursorPos (keep) {
      const el = document.querySelector(".active-history");
      if (!el) return;
      keep ? "" : el.classList.remove("active-history");
      let id = el.id.replace("dtc-history", "");
      return [Number(id), el];
    },
    _updateActiveHistoryCursorPos (id) {
      const target = document.querySelector("#dtc-history" + id);
      if (target) {
        target.classList.add("active-history");
        target.scrollIntoView();
      }
    },
    toggleDetailView () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "reportDetail", value: !this.getToggleReport.reportDetail });
    },
    togglePatientDetailView () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "patientDetail", value: !this.getToggleReport.patientDetail });
    },
    toggleNavigation () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "navigation", value: !this.getToggleReport.navigation });
    },
    goNextHistory () {
      let [id, el] = this._removeActiveHistoryCursorPos();
      id = Number(id) + 1;
      const len = this.historyList.length - 1;
      if (id > len) {
        el.classList.add("active-history");
        return;
      }
      this._updateActiveHistoryCursorPos(id);
      this.openHistory();
    },
    goPrevHistory () {
      let [id, el] = this._removeActiveHistoryCursorPos();
      --id;

      if (id < 0) {
        el.classList.add("active-history");
        return;
      }
      this._updateActiveHistoryCursorPos(id);

      // this.viewHistoryReport(this.historyList[id], id);
      this.openHistory();
    },
    openHistory () {
      let [id] = this._removeActiveHistoryCursorPos(true);
      const item = this.historyList[id];
      this.viewHistoryReport(item, id);
    },

    resetWhySave () {
      const inputs = this.modifyOptions2.slice(5, 100);
      inputs.forEach((s) => (s.input = ""));
      const org = this.modifyOptions2.slice(0, 5);
      this.modifyOptions2 = [...org, ...inputs];
      this.modifyOpt = this.modifyOptions1[0].value;
    },

    addNoteB4Save () {
      if (!this.isAbleToModifyReport()) return;
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? "info" : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$bvModal.show("dtcModifyReport");
    },
    showPacsUrl () {
      // alert(window.packUrl);
    },
    isAbleToModifyReport () {
      const ok1 = this.theReport.DxreportPhysicianId === this.loginId && this.theReport.DxrStatus == 71;
      const ok2 = this.theReport.IssuePhysicianId === this.loginId && this.theReport.DxrStatus == 71;
      const ok3 = this.theReport.EditDxreportPhysicianId === this.loginId && this.theReport.DxrStatus == 71;
      return ok1 || ok2 || ok3;
    },
    async getAllRows () {
      if (!this.storeQuery.url) {
        return;
      }
      let itemPack = "";
      await new DataManager({
        url: configs.publicPath + "../exam/GetModalityList",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(this.storeQuery.query)
        .then((r) => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.filter((i) => {
        i.IssueTime = this.DateToString(i.IssueTime, true);
        i.StudyTime = i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);
      });

      itemPack.Items.sort((a, b) => {
        return b.IssueTime - a.IssueTime || a.Status - b.Status;
      });

      this.totalArrayLen = itemPack.Items.length;
      // this.dxrVersion = `${this.currentNum}/` + this.totalArrayLen;
      this.dxrVersion = `${this.currentNum + (this.currentPage - 1) * this.perPage}/` + this.totalArrayLen;

      for (let i = 0; i < this.storeQuery.rows.length; ++i) {
        let idx = itemPack.Items.length && itemPack.Items.findIndex((s) => s.AccessionNo === this.storeQuery.rows[i].AccessionNo);
        if (!itemPack.Items.length) break;
        if (idx > -1) {
          itemPack.Items.splice(idx, 1);
        }
      }
      if (itemPack.Items.length) {
        this.nextViewArr = [...itemPack.Items];
      }
    },
    getStatus (n) {
      n = Number(n);
      let s = "";
      if (n == 61) {
        s = "退回重寫";
      } else if (n == 63) {
        s = "暫存檔案";
      } else if (n == 65) {
        s = "等待審核";
      } else if (n == 71) {
        s = "正式報告";
      }
      return s;
    },
    updateVtabTitle (item) {
      this.cstTabName = item.CSTName;
      window.cstResultStr = item.structureData;
      this.fillCstFromData(`#p-${this.cstTabName}`);
    },
    clickLeftArrow () {
      const el = document.querySelector(".dtc-toolbar");
      let v = el.scrollLeft - 630;
      v + el.offsetWidth >= el.scrollWidth ? (v = el.scrollWidth - el.offsetWidth) : "";
      el.scrollLeft = v;
    },
    clickRightArrow () {
      const el = document.querySelector(".dtc-toolbar");
      let v = el.scrollLeft + 630;
      v < 0 ? (v = 0) : "";
      el.scrollLeft = v;
    },
    resetFullScreenForm () {
      document.querySelector("#WinCST0301DxRSC").reset();
      let item = this.cstTab.find((s) => s.CSTName === this.cstTabName);
      if (!item) return;
      item.structureData = "";
    },
    async editHtmlReport (item) {
      let ret = "";
      item ? (this.cstTabName = item.CSTName) : (ret = this.cstTab.find((s) => s.CSTName === this.cstTabName));
      //alert( this.cstTabName)
      if (ret) {
        item = ret;
        //alert(this.cstTabName + item.structureData)
      } else if (item) {
        const t = this.cstTab.find((s) => s.CSTName === item.CSTName);
        if (t) {
          this.SET_SIDE_MESSAGE({ msg: `${item.CSTName}已存在,請選擇其他`, type: 2 });
          return;
        }
        this.$refs["reportTemplate"].hide();
        const html = (await window.axios.get("/cst/Get?cstId=" + item.CSTId)).StructureContent;
        item.cstHtml = html;
        if (!this.cstTab) this.cstTab = [];

        this.reportImg = true;
        this.showImgReport = true;
        this.cstTab = [...this.cstTab, item];

        this.registerReportEvent("remove");
        this.$nextTick(() => {
          this.registerReportEvent("add");
        });
      } else {
        return;
      }
      const myId = `#t-${item.CSTName}`;
      setTimeout(() => document.querySelector(myId).click(), 500);
      this.cstReportHtml = item.cstHtml; // it contains html only; the data is saved in differnt place
    },
    exitFullScreen (_id) {
      //const id = _id ? _id : '#blkReportInput';
      this.showImgReport = false;
      //const el = document.querySelector(id);
      //el.exitFullscreen();
    },
    enterFullScreen (_id) {
      const id = _id ? _id : "#blkReportInput";
      const el = document.querySelector(id);
      el.requestFullscreen();
      this.showImgReport = true;
    },
    async GetVersions () {
      //	以 AccessionNo 取得 各版次之診斷報告 資訊
      this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
    },

    FocusOnContent () {
      // 設定(報告內容編輯區塊)為焦點所在 ; disable run time error
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs["reportPlainText"]) this.$refs["reportPlainText"].focus();
        });
      }, 500);
    },

    getReportPhraseStr (v) {
      if (!this.phraseRecords.length) return "";
      const ret = this.phraseRecords.find((s) => {
        return s.PhraseCode.toLowerCase() === v.toLowerCase();
      });
      return ret ? ret.Replacement : "";
    },
    findReportPhraseStr (target) {
      const taskObject = target || this.$refs["reportPlainText"];
      if (!taskObject.value) return;
      const isMainReport = !target;
      const value = taskObject.value.trim();
      const arr = Array.from(value);
      let words = [];
      let end = taskObject.selectionEnd;
      for (let i = end - 1; -1 < end; --i) {
        if (/^\w+$/.test(value[i]) || /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\{|\}|\[|\]|\||\;|\:|\'|\"|\,|\.|\/|\<|\>|\?/.test(value[i])) {
          words = [arr[i], ...words];
        } else {
          break;
        }
        --end;
      }
      const key = words.join("");
      const replacement = this.getReportPhraseStr(key).trim();
      // const lastKeyWord = replacement.slice(-5);
      if (!replacement) return;
      const len = value.length - words.length;
      const orig = 1 > len ? "" : arr.slice(0, taskObject.selectionEnd - key.length).join("");
      // alert(orig)
      let rightStr = 1 > len ? "" : arr.slice(taskObject.selectionEnd, value.length).join("");
      // alert(rightStr)
      if (rightStr === key) {
        rightStr = "";
      }
      if (isMainReport) {
        this.theReport.ReportContent = orig ? `${orig}${replacement}${rightStr}` : `${replacement}${rightStr}`;
      } else {
        target.value = orig ? `${orig}${replacement}${rightStr}` : `${replacement}${rightStr}`;
      }
      this.$nextTick(() => {
        taskObject.selectionStart = taskObject.selectionEnd = taskObject.selectionEnd - rightStr.length;
      });

      // taskObject.selectionEnd = end + replacement.length;
    },
    async viewHistoryReport ({ AccessionNo, PatientId }, i) {
      this._removeActiveHistoryCursorPos();
      this._updateActiveHistoryCursorPos(i);
      // if (item.ReportSource == "DTC") {    不知道為什麼要dtc
      //   //get report details;
      //   this.SHOW_LOADING("報告");
      //   item = await getReportByAccessionNo(this.theProcedure.AccessionNo);
      //   this.HIDE_LOADING();
      // }

      // this.SHOW_LOADING("報告 ");
      this.viewHistoryItem = await getReportByAccessionNo(AccessionNo, PatientId);
      Object.keys(this.viewHistoryItem)
        .filter((k) => k.includes("CSTName"))
        .forEach((key) => {
          if (this.viewHistoryItem[key]) {
            this.viewHistoryItem[key] = this.viewHistoryItem[key] + `-${key.slice(-1)}`;
          }
        });
      this.showHistoryDlg = true;
      // this.HIDE_LOADING();
    },
    viewUrgentReport (item) {
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? "danger" : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["urgentReport"].show();
      // console.log(this.$refs["urgentReport"]);
    },
    InstantPhraseCreate () {
      this.instantContent = "";
      let taskObject = this.$refs["reportPlainText"];
      if (taskObject) {
        let posB = taskObject.selectionStart;
        let posE = taskObject.selectionEnd;
        if (posE > posB) {
          this.instantContent = taskObject.value.substring(posB, posE);
          // console.log(this.$logs(this.instantContent));
          if (this.instantContent && this.instantContent.length > 0) {
            this.WinMass4Phrase();
          }
        }
      }
    },
    DoThis (methodName, ...args) {
      // 動態呼叫處理
      this.$refs["versionHistory"].hide();
      // console.log(this.$logv());
      // const arr = args[0].split('/')
      window.dtcDiff = args[0];
      //alert(JSON.stringify(args));
      this[methodName](args);
    },
    [OutterProprty4DynamicDeclare.name4ContentDiff]: async function (x) {
      // console.log(this.$logs(null, OutterProprty4DynamicDeclare.name4ContentDiff));
      // 如果傳入參數為 array, 則轉換型別為 string
      if (typeof x !== "string") {
        x = x[0];
      }

      const map = await window.axios.get(`/Report/Get?accessionNo=${this.theProcedure.AccessionNo}&version=${x}`); //this.GetVersionContent(x)
      this.oldStr = map.ReportContent;
      this.newStr = this.theReport.ReportContent;
      //
      this.$refs["Window4Diff"].show();

      setTimeout(() => {
        const el = document.querySelector("#WinDiff0301___BV_modal_content_");
        el.requestFullscreen();
      }, 200);
    },
    ThemeSwitch (color) {
      // Theme:Black 切換
      //
      this.themePacks.themeBlack = color !== "white";
      //
      let activate = this.themePacks.themeBlack;
      let className = this.themePacks.themeBlackName;
      const el = document.body;
      //
      if (activate) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
      // console.log(this.$logs(this.$IsThemeBlack() ? "Black" : "White"));
    },
    jumpingToTextArea () {
      let jumpCount = 3;
      let focusEvent = () => {
        jumpCount -= 1;
        if (!document.getElementById('WinMass0301___BV_modal_body_').querySelector("textarea:focus")) {
          const _textarea = document.getElementById('WinMass0301___BV_modal_body_').querySelector("textarea");
          this.$nextTick(() => {
            _textarea.focus();
            _textarea.scrollTop = 0;
          });
        }
        if (jumpCount <= 0) {
          clearInterval(jumpInterval);
        }
      }
      let jumpInterval = setInterval(focusEvent, 250);
    },
    WinMass4Objective () {
      // console.log(this.$logs());
      if (!this.$refs["Window4Mass"]) return;

      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "danger";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      //
      this.winMassTitle = "醫師客觀";
      this.winMassContent = this.theProcedure.Objective;
      this.$refs["Window4Mass"].show();
      this.jumpingToTextArea();
    },
    WinMass4Subjective () {
      // console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "info";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "病患主訴";
      this.winMassContent = this.theProcedure.Subjective;
      this.$refs["Window4Mass"].show();
      this.jumpingToTextArea();
    },
    WinMass4Phrase () {
      // console.log(this.$logs());
      //WinMass0301___BV_modal_content_"
      this.winMassComponent = true;
      //
      this.winMassHeadBgV = "primary";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "片語維護";
      this.$refs["Window4Mass"].show();
      this.jumpingToTextArea();
    },
    WinMass4Icd10 () {
      // console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "warning";
      this.winMassHeadTxV = "dark";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "Icd-10";

      const icd10Content = !this.theReport["DISEASE"]
        ? "暫無資料"
        : this.theReport["DISEASE"]
          .split(",")
          .reduce((acc, cur, index) => acc.concat(`${cur.trim()} ${this.theReport["DISEASE_CODE"].split(",")[index]}`), [])
          .join("\n");

      this.winMassContent = icd10Content;
      this.$refs["Window4Mass"].show();
      this.jumpingToTextArea();
    },
    WinMass4Radiographer () {
      // console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "warning";
      this.winMassHeadTxV = "dark";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "檢查註記";
      this.winMassContent = this.theProcedure.RadiographerNote;
      this.$refs["Window4Mass"].show();
    },
    WinMass4ShiftNote () {
      // console.log(this.$logs());
      let PhyName = this.theProcedure.ShiftPhysicianName;
      PhyName == null ? (this.theProcedure.ShiftPhysicianName = "") : this.theProcedure.ShiftPhysicianName;
      if (this.ShiftNoteNotice) {
        this.winMassComponent = false;
        //
        this.winMassHeadBgV = "info";
        this.winMassHeadTxV = "white";
        //is.winMassBodyBgV = 'dark'
        this.winMassTitle = "交班記錄 記錄醫師: " + this.theProcedure.ShiftPhysicianName;
        this.winMassContent = this.theProcedure.ShiftNote;
        this.$refs["Window4Mass"].show();
        if (this.ShiftNoteNeedsToClick) this.ShiftNoteNeedsToClick = false;
      }
    },
    copyPasteText () {
      this.theReport.ReportContent += "\n" + this.viewHistoryItem.ReportContent;
      this.showImgReport = false;
      this.$bvModal.hide("view-history");
      this.SET_SIDE_MESSAGE({ msg: "資料已複製並貼上" });
    },
    checkReportContent (num, auto) {
      let update = false;
      if (!auto) {
        update = this.saveFullScreenForm();
      }
      let ok = true;
      // this.theReport.ReportContent = this.theReport.ReportContent ? this.theReport.ReportContent.trim() : "";
      if (!this.theReport.ReportContent && !update) {
        auto ? "" : this.SET_SIDE_MESSAGE({ msg: "尚未輸入報告內容, 不得存檔.", type: 2 });
        ok = false;
      }
      if (this.origReportContent === this.theReport.ReportContent && !update && num > 900) {
        auto ? "" : this.SET_SIDE_MESSAGE({ msg: "報告內容並無異動, 無需存檔.", type: 2 });
        ok = false;
      } else if (!this.theReport.IssuePhysicianId && num >= 65) {
        auto ? "" : this.SET_SIDE_MESSAGE({ msg: "尚未選擇審核醫師,不得存檔.", type: 2 });
        ok = false;
      }
      return ok;
    },

    getCstRecords () {
      for (let i = 1; i < 7; ++i) {
        this.theReport[`StructureData${i}`] = "";
        this.theReport[`StructureContent${i}`] = "";
        this.theReport[`StructureImage${i}`] = "";
        this.theReport[`CSTName${i}`] = "";
        this.theReport[`CSTId${i}`] = "";
      }
      //if(!this.cstTab.length) return;
      this.cstTab.forEach((s, i) => {
        let idx = i + 1;
        this.theReport[`StructureData${idx}`] = s.structureData ? s.structureData : "";
        this.theReport[`StructureContent${idx}`] = s.cstHtml;
        this.theReport[`StructureImage${idx}`] = s.img ? s.img : "";
        this.theReport[`CSTName${idx}`] = s.CSTName;
        this.theReport[`CSTId${idx}`] = s.CSTId;
      });
    },
    DataSave (num, autoSave = false) {
      if (this.theReport.DxrStatus == 71 && num == 71) return;
      const ok = this.checkReportContent(num, autoSave);
      //if (!ok || (this.showDtcMask && !autoSave)) return;
      if (!ok && num < 72) return;
      if (!this.theReport.DxreportPhysicianId) {
        this.theReport.DxreportPhysicianId = this.loginId;
      }
      this.save(autoSave, num);
      //this.FocusOnContent()
    },

    async save (auto, num) {
      window.isSavingDtc = true;
      let opStatus = true;
      this.getCstRecords();
      if (window.timer301) clearInterval(window.timer301);
      auto ? "" : this.SHOW_LOADING();
      if (num === 71 || num === 999 || num === 1000) {
        await this.handleCanvasImage();
      }

      try {
        const reportData = { ...this.theReport };
        if (this.getProfile4User.staffType === "28") {
          // 打字員
          reportData["EditDxreportPhysicianName"] = this.getProfile4User.employeeName;
          reportData["EditDxreportPhysicianId"] = this.getProfile4User.id;
        }
        reportData.ReportContent = reportData.ReportContent.trim();
        reportData.DxrType = "31";
        reportData.DxrStatus = num > 900 ? 71 : num;
        this.emergencyKeyWords = await reportSave(`accessionNos=${this.theProcedure.AccessionNo}${!auto ? "&tempSave=true" : ""}${num === 10000 ? '&notify=true' : ''}`, reportData);
        if (this.emergencyKeyWords.length > 0) {
          this.viewUrgentReport();
          this.lackNextReport = true;
        }

        this.theReport.DxrType = "31"; //  31 is html + normal text
        this.theReport.DxrStatus = num > 900 ? 71 : num; // if > 900 ; change the offically passed doc
        if (!auto) this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
        if (!(this.continuousReportCode == "N" || auto) && this.emergencyKeyWords.length === 0) this.viewNextRecord(true);
        this.lockingCallPacs = false;


      } catch (err) {
        opStatus = false;
        this.SET_SIDE_MESSAGE({ msg: "存取時發生錯誤!!!!" + "! 請稍後再試.", type: 2 });
      } finally {
        window.isSavingDtc = false;
        window.timer301 = setInterval(this.saveFile, 10 * 1000);
        if (auto) return;
        this.HIDE_LOADING();
      }

      return opStatus;
    },
    insertAfter (newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    async handleCanvasImage () {
      if (!this.$refs.reportTabs) return true;
      const forms = this.$refs.reportTabs.$el.querySelectorAll("form");
      return new Promise((resolve) => {
        [].forEach.call(forms, (el, idx) => {
          let copiedEl = el.cloneNode(true);
          document.body.append(copiedEl);
          [].forEach.call(copiedEl.querySelectorAll("textarea"), (tarea) => {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("style", "min-width: 50%; max-width: 80vw; min-height: 150px; border: 1px solid #000; padding: 10px; border-radius: 3px;");
            // newDiv.textContent = tarea.value.replace(/\n\r?/g, '<br />');
            newDiv.innerHTML = `<p>${tarea.value.replace(/\n\r?/g, "<br />")}</p>`;
            this.insertAfter(newDiv, tarea);
            tarea.parentNode.removeChild(tarea);
          });
          html2canvas(copiedEl).then((canvas) => {
            this.theReport[`StructureImage${idx + 1}`] = canvas.toDataURL();
            if (idx === forms.length - 1) {
              resolve(true);
            }
          });
          document.body.removeChild(copiedEl);
        });
      });
    },

    HelpShow () {
      this.WinHelpSelf();
    },
    backToPreviousRoute () {
      this.$router.push({ name: "FI0304" });
      // this.$router.push(-1);
    },
    WinHelpSelf () {
      // console.log(this.$logs());
      //
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4HotkeyDetect.Title = "功能說明";
      this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["WinHelp"].show();
    },
    HKWatch (event) {
      // 熱鍵 vs. 功能 分派器
      //console.log(this.$logs())
      // 取得 自訂按鍵辨識字串
      let keyCombine = KeyPressIdentifier(event);

      if (!keyCombine) {
        return;
      }
      //
      // HotKey 機制之開啟或閉鎖機制
      if (!this.allowHotKeyFunctional) {
        // console.log(this.$logs("OFF"));
        return;
      }
      //
      //this.HotkeyPressed = keyCombine
      let runMethod = null;
      let param = "";
      this.HotkeyList.some((e) => {
        if (e.hotkey === keyCombine) {
          runMethod = e.method;
          param = e.param;
          return true;
        }
      });
      //
      if (runMethod) {
        // console.log(this.$logs(runMethod));
        event.preventDefault();
        this[runMethod](param);
      }
    },
    BMWatch (bvEvent, modalId) {
      if (modalId === "WinCST0301" && bvEvent.type === "shown") {
        const item = this.cstTab.find((s) => s.CSTName === this.cstTabName);
        if (!item) return;
        const myData = item.structureData;
        //alert(myData);
        if (!myData) return;
        window.dtcCurrentCstData = window.cstResultStr = myData;
        let valueSet = JSON.parse(myData);
        if (valueSet && valueSet.length > 0) {
          valueSet.forEach((e) => {
            let item = $(`#WinCST0301DxRSC [name="${e.name}"]`);
            if (item && item.length > 0) {
              let detail = item[0];
              if (",INPUT,TEXTAREA,SELECT,".indexOf(`,${detail.tagName},`) >= 0) {
                if (detail.type === "radio" || detail.type === "checkbox") {
                  $.each(item, (index, content) => {
                    if (content.value === e.value) {
                      content.checked = true;
                      return false;
                    }
                  });
                } else {
                  item.val(e.value);
                }
              }
            }
          });
        }
        //
      }
      //
      if (modalId === "WinConfig") {
        if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = false;
        } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = true;
        }
        return;
      } else if (modalId === "WinHotkeyDetect0301") {
        if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.UnderHotkeyDetect = true;
          window.removeEventListener("keydown", this.HKWatch);
          window.addEventListener("keydown", this.KeyPressInterceptor);
        } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
          window.removeEventListener("keydown", this.KeyPressInterceptor);
          window.addEventListener("keydown", this.HKWatch);
          this.UnderHotkeyDetect = false;
        }
        return;
      } else if (modalId === "WinWait") {
        // 只是遮罩, 無須處理
        return;
      }
      //
      this.allowHotKeyFunctional = ",show,shown,".indexOf(`,${bvEvent.type},`) < 0;
    },
    KeyCode2Text (code) {
      // 轉換 自訂按鍵辨識字串 為 html tag 值, 以利在畫面上突顯呈現
      let value = "";
      if (code.indexOf(KeyCode4Control) >= 0) {
        value += "<kbd>Ctrl</kbd> + ";
        code = code.replace(KeyCode4Control, "");
      }
      if (code.indexOf(KeyCode4Alternate) >= 0) {
        value += "<kbd>Alt</kbd> + ";
        code = code.replace(KeyCode4Alternate, "");
      }
      if (code.indexOf(KeyCode4Shift) >= 0) {
        value += "<kbd>Shift</kbd> + ";
        code = code.replace(KeyCode4Shift, "");
      }
      if (code && code.length > 0) {
        value += `<kbd>${code === " " ? "Space" : code}</kbd>`;
      }
      //
      if (!value || value.length <= 0) {
        return "(尚未設定)";
      }
      return value;
    },
    Item4Config (e) {
      // 開啟 熱鍵取值 視窗
      // console.log(this.$logs(e));
      //
      this.HotkeyCurrentItemName = e;
      //
      let IsThemeBlack = this.$IsThemeBlack();
      let textVariant = IsThemeBlack ? "warning" : "primary";
      let currentValue = "";
      let defaultValue = "";
      this.HotkeyTempSet.some((el) => {
        if (el.title === e) {
          currentValue = this.KeyCode2Text(el.hotkey);
          defaultValue = this.KeyCode2Text(el.default);
        }
      });
      this.HotkeyPressRemark = `<span class="text-${textVariant}">目前設定值為 ${currentValue} 預設值為 ${defaultValue}</span>`;
      //
      this.HotkeyPressed = "";
      this.HotkeyPressMessage = "等待 您的輸入...";
      //
      this.winConfig4HotkeyDetect.Title = "個人化 Hotkey 設定";
      this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? "info" : "primary";
      this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["WinHotkeyDetect"].show();
    },
    WinConfigOpen () {
      // 開啟 組態設定 視窗
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      let IsThemeBlack = this.$IsThemeBlack();
      //this.winConfigure.Title = '組態設定'
      this.winConfigure.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfigure.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["WinConfig"].show();
    },
    showTemplateModal (isSubReport) {
      this.winConfig4ReportTemple.Title = isSubReport ? "次專科報告" : "癌症報告";
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4ReportTemple.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfig4ReportTemple.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs[isSubReport ? "subTemplate" : "reportTemplate"].show();
      this.$nextTick(() => {
        setTimeout(() => {
          document.getElementById('report-template___BV_modal_body_').children[0].children[0].focus();
        }, 500);
      });


    },
    reportTemplateOpen () {
      if (!this.isCtMri) return;
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      this.showTemplateModal(false);
    },
    versionHistoryOpen () {
      if (!this.reportHistory.length) {
        this.SET_SIDE_MESSAGE({ msg: "無報告版次", type: 2 });
        return;
      }
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.Title = "版本歷史";
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["versionHistory"].show();
    },
    WinIQControlEdit () {
      // this.$refs["WinIQControl"].show();
      this.showWasteImage = true;
    },
    WinCSTOpen () {
      if (this.fullScreen) {
        return;
      }
      this.showImgReport = true;
      let IsThemeBlack = this.$IsThemeBlack();
      //this.winConfig4StructureReport.Title = '影像品質'
      this.winConfig4StructureReport.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfig4StructureReport.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["WinCST"].show();
    },
    saveFullScreenForm () {
      let update = false;
      const els = [...document.querySelectorAll(".vue-tabs form")];
      if (!els || !els.length) return false;
      try {
        els.forEach((el, i) => {
          const valueSet = $(el).serializeArray();
          const valueString = valueSet ? JSON.stringify(valueSet) : "";

          if (this.cstTab[i].structureData != valueString) {
            update = true;
          }
          this.cstTab[i].structureData = valueString;
        });
        return update;
      } catch (e) {
        return update;
      }
      //this.DataSave(this.theReport.DxrStatus , true);
    },
    conbineData2Content (valueStr, content) {
      if (!valueStr) return content;
      const value = JSON.parse(valueStr);
      const { source } = JSON.parse(content);
      source.forEach((s) => {
        s.items.forEach((item) => {
          if (value[item.key]) {
            item.value = value[item.key];
          }
        });
      });
      return JSON.stringify({ source });
    },
    fillCstFromData (id) {
      if (!window.cstResultStr) return;
      let valueSet = JSON.parse(window.cstResultStr);
      //this.areaBlock(id);
      if (valueSet && valueSet.length > 0) {
        valueSet.forEach((e) => {
          let item = $(`${id} [name="${e.name}"]`);
          if (item && item.length > 0) {
            let detail = item[0];
            if (",INPUT,TEXTAREA,SELECT,".indexOf(`,${detail.tagName},`) >= 0) {
              if (detail.type === "radio" || detail.type === "checkbox") {
                $.each(item, (index, content) => {
                  if (content.value === e.value) {
                    content.checked = true;
                    return false;
                  }
                });
              } else {
                item.val(e.value);
              }
            }
          }
        });
      }
    },
    WinCSTHide () { },
    KeyPressInterceptor (e, debugMode = false) {
      // 熱鍵取值框 的 按鍵攔截處理
      //	- 基本邏輯跟 KeyPressIdentifier.js 差不多, 但細部處理不同, 所以得重寫一份
      //

      if (debugMode) console.log(this.$logs());
      if (debugMode) console.log(`> key(${e.key}), keyCode(${e.keyCode}), code(${e.code}) @ location(${e.location})`);
      //
      // 停止預設功能
      //	- 20191028 Pollux, 在這裡得先強迫不執行按鍵的預設行為, 才不會干擾到取值作業
      //	- !! 還是有按鍵是無法攔截或停止預設行為的, 通常是作業系統的操作鍵, 如: Alt-F4, Alt-Tab, ...
      //	- event 是預設傳入的參數
      event.preventDefault();
      //
      // 發生了新的按鍵事件, 先重置畫面上的相關資訊
      this.HotkeyPressed = "";
      this.HotkeyPressMessage = "等待 您的輸入...";
      //
      let code = e.key;
      //
      // 排除三大複合鍵
      if (",Alt,Control,Shift,".indexOf("," + code + ",") >= 0) {
        return null;
      }
      //
      if (
        ",CapsLock,Escape,Meta,NumLock,Process,Tab,Home,End,PageUp,PageDown,ArrowUp,ArrowDown,ArrowLeft,ArrowRight,Insert,Delete,Enter,ScrollLock,Pause,ContextMenu,".indexOf(
          "," + code + ","
        ) >= 0
      ) {
        // 特定功能鍵直接不處理
        this.HotkeyPressed = "";
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'><kbd>${code}</kbd></span>, <span>不得設為 hotkey !</span>`;
        this.SET_SIDE_MESSAGE({ msg: `按鍵[${code}]為特定功能鍵, 不得設為 hotkey !`, type: 2 });
        return null;
      }
      //
      // 用這個變數來組出最終的比對標的
      let keyCombine = "";
      let interpret = "";
      // 複合性功能鍵判斷, 依序為: 1.Contral, 2.Alt, 3.Shift
      if (e.ctrlKey) {
        keyCombine += KeyCode4Control;
        interpret += "<kbd>Ctrl</kbd> + ";
      }
      if (e.altKey) {
        keyCombine += KeyCode4Alternate;
        interpret += "<kbd>Alt</kbd> + ";
      }
      if (e.shiftKey) {
        if (!(RegExp(/[`!@#$%^&*()_+}{|":?/><]/).test(code) || (code.length === 1 && RegExp(/[A-Z]/).test(code)))) {
          keyCombine += KeyCode4Shift;
          interpret += "<kbd>Shift</kbd> + ";
        } else {
          if (debugMode) console.log(this.$logs("Shift 被排除了!"));
        }
      }
      //
      code = code.toUpperCase();
      keyCombine += code;
      interpret += this.KeyCode2Text(code);
      const blockKeyPair = ["KC.P", "KC.F", "KC.KS.P", "KC.E", "KC.K", "KC.J", "KC./", "KC.Z", "KC.Y"];
      //
      if (
        keyCombine.length == 1 &&
        //gExp(/[`!@#$%^&*()_+}{|":;'?/><\[\],.\-=]/).test(keyCombine) ||
        (RegExp(/[`!@#$%^&*()_+}{|":;'?/><[\],.\-=]/).test(keyCombine) || RegExp(/[0-9]/).test(keyCombine) || RegExp(/[A-Z]/).test(keyCombine) || keyCombine === " ")
      ) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`;
        return;
      } else if (blockKeyPair.find((s) => s == keyCombine.trim())) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`;
        return;
      }
      // }else if(keyCombine >= 3) {
      //   this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`
      // 	return
      // }
      this.HotkeyPressed = keyCombine;
      this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>`;
      if (debugMode) console.log(this.$logs(`this.HotkeyPressed=[${this.HotkeyPressed}]`));
    },
    // 熱鍵取值框 事件處理
    //	- 請小心注意 事件 的執行順序...
    ModalOk (bvModalEvt) {
      console.log(this.$logs());
    },
    ModalCancel (bvModalEvt) {
      console.log(this.$logs());
    },
    ModalClose (bvModalEvt) {
      this.UnderHotkeyDetect = false;
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
    },
    ModalHide (bvModalEvt) {
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
      if (this.UnderHotkeyDetect) {
        bvModalEvt.preventDefault();
      }
    },
    EndOfKPInterceptor () {
      // 熱鍵設定完成後, 存入暫時組態集
      // console.log(this.$logs(this.HotkeyCurrentItemName));
      //
      let newHotkey = this.HotkeyPressed;
      // 如新熱鍵不為空值, 先清掉重複的
      if (newHotkey && newHotkey.length > 0) {
        this.HotkeyTempSet.forEach((e) => {
          if (e.hotkey === newHotkey) {
            e.hotkey = "";
          }
        });
      }
      // 找到對應項目, 設入新熱鍵值
      this.HotkeyTempSet.some((e) => {
        if (e.title === this.HotkeyCurrentItemName) {
          e.hotkey = this.HotkeyPressed;
          // console.log(this.$logs(`${this.HotkeyCurrentItemName} > ${e.hotkey}`));
          return true;
        }
      });
      // 關閉熱鍵取值框
      this.UnderHotkeyDetect = false;
      this.HotkeyConfigSave();
      this.$refs["WinHotkeyDetect"].hide();
    },
    HotkeyConfigReset () {
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      this.SET_SIDE_MESSAGE({ msg: "組態設定已回復原值" });
    },
    async HotkeyConfigDefault () {
      this.HotkeyTempSet = this.HotkeyList = [...defaultHotKeyArr];
      this.HotkeyTempSet.forEach((e) => {
        e.hotkey = e.default;
      });
      this.SET_SIDE_MESSAGE({ msg: "Hotkey組態設定已重置成系統設定" });
      //this.HotkeyList = [...defaultHotKeyArr];
      let obj = { EmployeeNo: this.loginId, PersonalSetting: "" };
      await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj);
      this.SET_HOTKEY(JSON.stringify(this.HotkeyList));
    },
    async HotkeyConfigSave () {
      this.HotkeyList = this.$DeepCopy(this.HotkeyTempSet);
      let param = {
        AccId: this.UserId,
        Setting: JSON.stringify(this.HotkeyList),
      };
      try {
        this.SHOW_LOADING();
        let obj = {
          EmployeeNo: this.loginId,
          PersonalSetting: JSON.stringify(param),
        };
        await window.axios.put(`/employee/SavePersonalSetting?employeeNo=${this.loginId}`, obj);
        let okMessage = `組態設定已完成`;
        this.SET_SIDE_MESSAGE({ msg: okMessage });
        this.SET_HOTKEY(JSON.stringify(this.HotkeyList));
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: "組態設定 FAIL" });
      } finally {
        this.HIDE_LOADING();
      }
    },

    async getDataFromStore () {
      if (this.$store.state.fi0304TabSource) {
        const { rows, query, searchCondition, currentKey, rowIdx, tabList } = this.$store.state.fi0304TabSource;
        const specificTab = tabList.find(({ id }) => id === currentKey);
        this.storeQuery.query = query;
        this.storeQuery.rows = rows;
        this.storeQuery.tabList = tabList;
        this.perPage = specificTab.per;
        this.currentPage = specificTab.page;
        this.currentNum = rowIdx;
        this.currentTab = currentKey;
        this.totalArrayLen = specificTab.count;
        this.searchCondition = searchCondition;
        this.dxrVersion = `${this.currentNum}/` + this.totalArrayLen;
        this.initArray = rows;
        this.$store.unregisterModule("fi0304TabSource");

        if (this.totalArrayLen > this.initArray.length) {
          getReportContents(this.searchCondition, this.storeQuery.query).then(({ actual: { Items } }) => {
            const _currentIdx = (this.currentPage - 1) * this.perPage;
            Items.splice(_currentIdx, this.perPage, ...this.initArray);
            this.initArray = Items;
            this.currentNum = this.currentNum + (this.currentPage - 1) * this.perPage;

            if (this.isFetchingData) {
              this.HIDE_LOADING(); // 強制
              const actionType = this.isFetchingData;
              this.isFetchingData = "";
              this[`view${actionType === "next" ? "Next" : "Prev"}Record`]();
            }
          });
        }
      } else {
        // 沒資料則回去
        this.$router.replace({ name: "FI0304" });
      }
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]));
      this.action_getPhrase(this.initArray[this.currentNum - 1]["DxreportPhysicianId"]); // 取片語資料
    },
    getNewPageData (isNext) {
      //急診/件 搜尋判斷
      // this.queryStore.perPage = nPerPage;
      // this.queryStore.currentPage = toPage;
      // this.searchCondition = this.collectSearchCondition(index)
      return new Promise(async (resolve, reject) => {
        this.SHOW_LOADING();
        let opResult = "";
        this.currentPage += isNext ? 1 : -1;

        // 移除上一個 page query
        // this.storeQuery.query.queries.pop();
        this.storeQuery.query.queries = this.storeQuery.query.queries.filter(({ fn }) => fn === "onWhere" || fn === "onSortBy");
        // .sortBy(this.sortMethod.key, this.sortMethod.desc ? "descending" : "ascending")

        try {
          let { actual } = await getReportContents(this.searchCondition, this.storeQuery.query.page(this.currentPage, this.perPage));
          this.HIDE_LOADING();
          // 登錄所有的筆數 覺得不太安全

          actual.Items.forEach((item) => {
            //逾期時間判斷
            item.Due = false;
            if (item.Status === "71") {
              //正式報告不顯示逾期
              item.DueTimeStr = "-";
              item.DueTimeMins = 0;
            } else {
              item.DueTimeMins =
                (this.currentTab == "FI0304_emy" || item.EmgFlag == "Y" ? 24 : this.currentTab == "FI0304_door" ? 72 : 120) * 60 -
                this.diff_mins(new Date(), item.ProcedureCompleted);
              item.DueTimeStr = `
                ${item.DueTimeMins <= 0 ? "+" : ""}
                ${this.SinglgeNumTo2Digit(Math.floor(Math.abs(item.DueTimeMins) / 60 / 24))}天
                ${this.SinglgeNumTo2Digit(Math.floor((Math.abs(item.DueTimeMins) / 60) % 24))}小時
                ${this.SinglgeNumTo2Digit(Math.abs(item.DueTimeMins) % 60)}分
              `;
              if (item.DueTimeMins <= 0) item.Due = true;
            }
            item["ScheduleTimeForShow"] = this.$moment(item.ScheduleTime).format("YYYY-MM-DD hh:mm:ss");
            //時間 to string
            item.ProcedureCompleted = this.DateToString(item.ProcedureCompleted, true);
            item.PatientBirthday = this.DateToString(item.PatientBirthday, false);

            //影像到位時間
            item.StudyTime = item.StudyTime == null ? "無影像" : this.DateToString(item.StudyTime, true);

            if (item.EmgFlag === "Y" || item.PatientSourceTypeCode === "E") {
              item._rowVariant = "danger";
            }
            //若為多檢查項目合併為arr, 此處拆解為string with comma
            item.ProcedureNameStr = item.ProcedureName;
            if (item.ProcedureName instanceof Array) {
              item.ProcedureNameStr = item.ProcedureName.join(",");
            }
          });

          resolve(actual.Items);
        } catch (err) {
          this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
          this.HIDE_LOADING();
          reject();
        }
      });
    },
    registerSpecificProcedure (patient) {
      [
        "AccessionNo",
        "EmgFlag",
        "Modality",
        "PatientId",
        "PatientName",
        "PatientSex",
        "RequestingPhysicianName",
        "RequestingPhysicianId",
        "Subjective",
        "Objective",
        "RadiographerNote",
        "ShiftNote",
        "StatusName",
        "PatientAge",
        "DeviceName",
        "ShiftPhysicianName",
        "ProcedureNameList",
      ].forEach((key) => {
        this.theProcedure[key] = patient[key];
      });

      if (patient['ShiftNote']) this.ShiftNoteNeedsToClick = true;

      const [t1, t2] = patient.ProcedureCompleted && patient.ProcedureCompleted.split ? patient.ProcedureCompleted.split(":") : ["", "", ""];
      this.theProcedure.StudyDate = t1 ? [t1, t2].join(":") : patient.ProcedureCompleted;
      this.theProcedure.PatientSourceType = patient.PatientSourceTypeCode + "-" + patient.PatientSourceTypeName;
      this.theProcedure.BedNo = patient.BedNo ? patient.BedNo : "暫無記錄";
      this.theProcedure.PatientBirthday = this.DateToString(new Date(patient.PatientBirthday));
      this.casePriorityCode = patient.EmgFlag;
      this.labProcedures = patient.ProcedureNameList;

      if (!this.$store.state.DxreportPhysician) {
        this.$store.registerModule("DxreportPhysician", {
          state: {
            id: patient.DxreportPhysicianId,
            name: patient.DxreportPhysicianName,
          },
        });
      }
    },
    repotKeyDown119 ({ code, target }) {
      if (code === "F8") this.findReportPhraseStr(target);
    },
    registerReportEvent (state) {
      [].forEach.call(this.$refs.reportTabs.$el.querySelectorAll("textarea"), (el) => {
        if (state === "add") {
          el.addEventListener("keydown", this.repotKeyDown119);
        } else {
          el.removeEventListener("keydown", this.repotKeyDown119);
        }
      });
    },
    normalizeReportData () {
      // clearInterval(window.timer301);
      this.isDataChange = false;
      this.historyList = [];
      this.reportHistory = [];
      this.cstTabName = "";
      this.cstTab = [];
      // hold the data for comparing in saving
      this.origReportContent = this.theReport.ReportContent ? this.theReport.ReportContent.trim() : "";
      this.reportImg = this.theReport.StructureContent1;
      if (this.reportImg) {
        this.showImgReport = true;
        this.cstReportHtml = "" + this.theReport.StructureContent1;
        let arr = [];
        for (let i = 1; i < 7; ++i) {
          if (!this.theReport[`StructureContent${i}`]) break;
          let obj = {
            cstHtml: "",
            img: "",
            structureData: "",
            CSTName: "",
            updateCount: 0,
          };
          obj.structureData = this.theReport[`StructureData${i}`];
          obj.img = this.theReport[`StructureImage${i}`];
          obj.cstHtml = this.theReport[`StructureContent${i}`];
          obj.CSTName = this.theReport[`CSTName${i}`] ? this.theReport[`CSTName${i}`] : "Name-dtc-tab-" + i;
          obj.CSTId = this.theReport[`CSTId${i}`] ? this.theReport[`CSTId${i}`] : "ID-dtc-tab-" + i;
          arr.push(obj);
        }
        this.cstTab = [...arr];
        this.cstTabName = this.cstTab[0].CSTName;
        setTimeout(() => {
          this.cstTab.forEach((item) => {
            this.updateVtabTitle(item);
          });
          this.updateVtabTitle(this.cstTab[0]);
          this.registerReportEvent("add");
        }, 200);
      }
      if (window.timer301) clearInterval(window.timer301);
      window.timer301 = setInterval(this.saveFile, 10 * 1000);
      if (!this.theReport.OrderNo) {
        this.theReport.OrderNo = this.theReport.AccessionNo.split("_")[0];
      }

      if (!this.theReport.DxrStatus) {
        this.theReport.DxrStatus = 63;
      }

      if (!this.theReport.DxrVersion) {
        this.theReport.DxrVersion = "1";
      }

      this.theReport.PatientId = this.theProcedure.PatientId ? this.theProcedure.PatientId : "" + new Date().getTime();

      if (!this.DxReportIQCode) {
        this.DxReportIQCode = "30";
      }

      if (!this.theReport.IssuePhysicianId && this.getIssueDrs.some(({ value }) => value === this.loginId)) {
        // 報告沒有押審核醫師，而該登入者是在審核醫師名單
        this.theReport.IssuePhysicianId = this.loginId;
      }

      if (!this.theReport.IssuePhysicianId && this.tempPhysicianId) this.theReport.IssuePhysicianId = this.tempPhysicianId;

      this.callPacs("show");
      setTimeout(async () => {
        try {
          this.loadingHistory = true;
          this.historyList = await window.axios.get("/Report/GetPatientReportList?patientId=" + this.theProcedure.PatientId);
          this.historyList = this.historyList.sort((rp1, rp2) => (rp1.IssueTime > rp2.IssueTime ? -1 : 1));

          this.historyList.forEach((his) => {
            his["ProcedureCompletedForShow"] = this.$moment(his.ProcedureCompleted).format("YYYY-MM-DD");
          });

          this.loadingHistory = false;
        } catch (err) {
          this.SET_SIDE_MESSAGE({ msg: `歷史診斷報告 API (/Report/GetPatientReportList) 發生錯誤: ${err.message}`, type: 2 });
          this.loadingHistory = false;
        }
      });
      setTimeout(async () => {
        try {
          this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
        } catch (err) {
          this.SET_SIDE_MESSAGE({ msg: `報告版次 API (/Report/GetVersionList) 發生錯誤: ${err.message}`, type: 2 });
        }
      });
    },

    async viewRecordByCurrentNumber () {
      window.isSavingDtc = true;
      this.cstReportHtml = this.reportImg = this.showImgReport = "";
      this.dxrVersion = `${this.currentNum}/${this.totalArrayLen}`;
      // this.SHOW_LOADING("報告");
      try {
        this.showDtcMask = true;
        this.theReport = await getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure["PatientId"]);
        if (this.isCtMri) this.theReport["IsPositive"] = true;
        this.normalizeReportData();
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: `viewRecordByCurrentNumber 發生錯誤: ${err.message}`, type: 2 });
      } finally {
        window.isSavingDtc = false;
        this.showDtcMask = false;
        // this.HIDE_LOADING();
      }
    },

    openPopupWindow () {
      const height = 5;
      const width = 5;
      const t = innerHeight - height;
      const l = innerWidth - width;
      this.windowObj = window.open(
        "DTC:PACK",
        "PACS",
        `height=10,width=10,left=${l},top=${t},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no`
      );
    },
    textareaFocusWork () {
      this.FocusOnContent();
      let runCount = 10;
      let focusInterval = () => {
        runCount -= 1;
        try {
          if (
            !document.getElementById('blkReportInput').querySelector('textarea:focus') &&
            !(this.$refs["Window4Mass"] && this.$refs["Window4Mass"].isShow) &&
            !(this.$refs[isSubReport ? "subTemplate" : "reportTemplate"] && this.$refs[isSubReport ? "subTemplate" : "reportTemplate"].isShow)
          ) this.FocusOnContent();
        } catch (error) {
          clearInterval(focusTimer);
        }
        if (runCount <= 0) clearInterval(focusTimer);
      }
      let focusTimer = setInterval(focusInterval, 2000);
    },

    async callPacs (str) {
      let ok = true;
      this.lockingCallPacs = true;
      setTimeout(() => (this.lockingCallPacs = false), 10 * 1000);
      // this.openPopupWindow();
      try {
        str == "show" ? "" : this.SET_SIDE_MESSAGE({ msg: "已呼叫PACS" });
        const url = await window.axios(`/api/PacsUri/` + this.theProcedure.AccessionNo);
        window.packUrl = url;
        callPaceWebSocket(url);
        requestAnimationFrame(() => {
          this.FocusOnContent();
        });
        this.textareaFocusWork();   //強迫把focus抓回來
        // window.packUrl = url;
        // this.windowObj.location.href = url;

      } catch (err) {
        ok = false;
      } finally {
        // setTimeout(() => this.windowObj.close(), 5000);
        if (ok) {
          //this.SET_SIDE_MESSAGE('已呼叫PACS @ ' + url);
        } else if (process.env.NODE_ENV === "production") {
          this.SET_SIDE_MESSAGE({ msg: "呼叫PACS發生錯誤", type: 2 });
        }
      }
    },
    async viewNextRecord (redirect) {
      if (this.isFetchingData) return;

      if (this.currentNum >= this.initArray.length && this.currentNum < this.totalArrayLen) {
        // 未載完
        this.SHOW_LOADING();
        this.isFetchingData = "next";
        return;
      } else if (this.currentNum === this.initArray.length && this.currentNum === this.totalArrayLen && redirect) {
        //最後一筆
        this.$router.replace({ name: "FI0304" });
        return;
      }
      if (this.showHistoryDlg) this.showHistoryDlg = false;
      this._removeActiveHistoryCursorPos();
      this.currentNum += 1;
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]));
      this.viewRecordByCurrentNumber();
    },
    async viewPrevRecord (redirect = false) {
      if (this.isFetchingData) return;

      if (this.currentNum <= 1 && this.pageIndex > this.currentNum) {
        this.SHOW_LOADING();
        this.isFetchingData = "prev";
        return;
      } else if (this.currentNum == 1 && this.pageIndex == 1) {
        return;
      }
      if (this.showHistoryDlg) this.showHistoryDlg = false;
      this._removeActiveHistoryCursorPos();
      this.currentNum -= 1;
      this.registerSpecificProcedure(Object.assign({}, this.initArray[this.currentNum - 1]));
      this.viewRecordByCurrentNumber();
    },
    async getHotKeySetting () {
      const savingMethods = this.getProfileHotkeySetting.map(({ method }) => method);
      const restOfArr = defaultHotKeyArr.filter(({ method }) => !savingMethods.includes(method));
      this.HotkeyList = this.getProfileHotkeySetting.length > 0 ? this.getProfileHotkeySetting.concat(restOfArr) : [...defaultHotKeyArr];
    },
    async saveFile () {
      if (window.isSavingDtc) return;
      if (!this.isDataChange || !this.theReport || this.theReport.DxrStatus == 71) return;
      const update = this.saveFullScreenForm();
      !this.isDataChange && update ? (this.isDataChange = true) : "";
      this.isDataChange = false;
      await this.DataSave(63, true);
    },
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === "FI0304" && this.storeQuery.tabList) {
      const pageNum = Math.ceil(this.pageIndex / this.perPage);
      const tabIdx = this.storeQuery.tabList.findIndex(({ id }) => id === this.currentTab);
      this.storeQuery.tabList[tabIdx].items = this.initArray.filter((item, idx) => idx >= (pageNum - 1) * this.perPage && idx < this.perPage * pageNum);
      this.storeQuery.tabList[tabIdx].page = 1; // pageNum
      this.storeQuery.tabList[tabIdx].per = this.perPage;

      this.$store.registerModule("fi0301TabSource", {
        state: {
          query: this.storeQuery.query,
          searchCondition: this.searchCondition,
          currentKey: this.currentTab,
          tabList: this.storeQuery.tabList,
        },
      });
      // const { rows, query, searchCondition, currentKey, rowIdx, tabList } = this.$store.state.fi0304TabSource;
      //   const specificTab = tabList.find(({id}) => id === currentKey);

      //   this.storeQuery.query = query;
      //   this.storeQuery.rows = rows;
      //   this.perPage = specificTab.per;
      //   this.currentPage = specificTab.page;
      //   this.currentNum = rowIdx;
      //   this.currentTab = currentKey;
      //   this.totalArrayLen = specificTab.count;
      //   this.searchCondition = searchCondition;
      //   this.dxrVersion = `${this.currentNum + (this.currentPage - 1) * this.perPage}/` + this.totalArrayLen;
      //   this.initArray = rows;
      //   this.$store.unregisterModule("fi0304TabSource");
    } else {
      if (this.$store.state && this.$store.state.fi0304TabSource) this.$store.unregisterModule("fi0304TabSource");
    }

    next();
  },
  beforeDestroy () {
    clearInterval(window.timer301);
    this.CLEAR_PHRASE();
  },
  async beforeMount () {
    // this.SHOW_LOADING("報告");
    this.theReport = await getReportByAccessionNo(this.theProcedure.AccessionNo, this.theProcedure["PatientId"]);

    window.removeEventListener("keydown", this.HKWatch);
    window.addEventListener("keydown", this.HKWatch);

    this.$root.$on("close-history-dlg", () => (this.showHistoryDlg = false));
    this.$root.$on("dtc-copy-paste", (s) => {
      if (this.showImgReport) return;
      if (!this.theReport.ReportContent) this.theReport.ReportContent = "";
      this.theReport.ReportContent += "\n" + s;
    });
    //document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);

    try {
      if (this.isCtMri) this.theReport["IsPositive"] = true; // 預設陽性
      // this.theReport["IsPositive"] = true;
      //normalize array to dislay
      this.normalizeReportData();
      //step 5 get CST list; CancerScreeningTemplate
      this.reportList = await getCstList();
      //step 4. get 影像品質清單API
      let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
      this.optionsImageQuality = imgs.Items.map(({ No, Name }) => ({ value: No, text: Name }));
      //normalize array to dislay
      // Step 6: get all rows for performance cache
      //await this.getAllRows();
      //get all report phrase
      // this.phraseRecords = await this.collectingPhrash();
      // this.busFactory.$on("reload-report-phrase", async () => {
      //   this.CLEAR_PHRASE();
      //   this.action_getPhrase();
      // });
    } catch (err) {
      this.SET_SIDE_MESSAGE({ msg: `API 發生錯誤: ${err.message}`, type: 2 });
      //alert(err.message);
    }
  },
  async created () {
    ["winConfigure", "winIQControl", "winConfig4HotkeyDetect", "winConfig4StructureReport", "winConfig4ReportTemple", "winConfig4VersionHistory"].forEach((k) => {
      this[k] = { ...this[k], HeadBgV: "", HeadTxV: "", BodyBgV: "", BodyTxV: "", Content: "" };
    });
    this.getDataFromStore();
    this.getHotKeySetting();
    // window.timer301 = setInterval(this.saveFile, 10 * 1000);

    this.busFactory.$on("dtc-modify-report-dlg", (s) => {
      const { s1, s1Type, s2, s3, s4, s2Input, s3Input, s4Input, notify } = s;
      this.theReport.ModifyExpressUserType = s1Type;
      this.theReport.ModifyExpressUserId = s1Type == "03" ? this.loginId : s1;
      this.theReport.ModifyExpressId = s2;
      this.theReport.ModifyExpressNote = s2 == "90" ? s2Input : "";
      this.theReport.ModifyReasonId = s3;
      this.theReport.ModifyNote = s3 == "90" ? s3Input : "";
      this.theReport.ModifyMajorCauseId = s4;
      this.theReport.ModifyMajorCauseNote = s4 == "90" ? s4Input : "";
      const num = notify ? 10000 : 999;
      this.DataSave(num, false); // 暫時改成false
      //this.SET_SIDE_MESSAGE({msg:"報告撰寫作業資料已完成存檔作業"});
    });
  },
  mounted () {
    this.isMounted = true;
    const el = document.querySelector(".dtc-toolbar");
    if (el)
      el.onscroll = () => {
        this.leftMost = !el.scrollLeft ? true : false;
        this.rightMost = el.scrollLeft + el.offsetWidth >= el.scrollWidth ? true : false;
        //console.log(el.scrollLeft + el.offsetWidth);
      };
    // 設定 b-modal listeners
    this.$root.$on("bv::modal::show", this.BMWatch);
    this.$root.$on("bv::modal::shown", this.BMWatch);
    this.$root.$on("bv::modal::hide", this.BMWatch);
    this.$root.$on("bv::modal::hidden", this.BMWatch);
    // 先留下解析度資訊, 日後或許有用...
    // console.log(this.$logs(`BView:${document.body.clientWidth}x${document.body.clientHeight}`));
    // console.log(this.$logs(`WView:${window.innerWidth}x${window.innerHeight}`));
    // 自動 focus 到 (報告內容編輯區塊)
    this.FocusOnContent();

    // this.$nextTick(() => {
    //   // 計算功能按鈕寬度
    //   const contentWdt = this.$refs.dtcToolBar
    //     ? Array.from(this.$refs.dtcToolBar.querySelectorAll("button")).reduce((acc, el) => {
    //       acc += el.offsetWidth + 3;
    //       return acc;
    //     }, 0)
    //     : 0;

    //   if (this.$refs.dtcToolBar && contentWdt + 50 > this.$refs.dtcToolBar.offsetWidth) {
    //     this.$refs.dtcToolBar.parentNode.classList.add("withArrowBtns");
    //   } else {
    //     this.$refs.dtcToolBar.parentNode.classList.add("withOutArrowBtns"); // withOutArrowBtns
    //   }
    // });

    this.$watch(
      () => this.$refs.urgentReport.isShow,
      (val) => {
        if (!val) this.emergencyKeyWords = [];
      }
    );
  },
  destroyed () {
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    window.removeEventListener("keydown", this.KeyPressInterceptor);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);
    // 解除 b-modal listeners
    this.$root.$off("bv::modal::show", this.BMWatch);
    this.$root.$off("bv::modal::shown", this.BMWatch);
    this.$root.$off("bv::modal::hide", this.BMWatch);
    this.$root.$off("bv::modal::hidden", this.BMWatch);

    if (this.$store.state.DxreportPhysician) {
      this.$store.unregisterModule("DxreportPhysician");
    }
  },
  watch: {
    urgentOpt (v) {
      if (v != 6) {
        this.otherInput = "";
      }
    },
    showDetails (v) {
      // const els = [...document.querySelectorAll(".sb4RHis")];
      // const el = document.querySelector(".dtc-vue-tab");
      // if (!v) {
      //   els.forEach((el) => {
      //     el.classList.add("sb4Hide");
      //   });
      //   el.classList.add("sb4Hide");
      // } else {
      //   els.forEach((el) => {
      //     el.classList.remove("sb4Hide");
      //   });
      //   el.classList.remove("sb4Hide");
      // }
    },
    "theReport.ReportContent" () {
      if (this.theReport.ReportContent && !this.showImgReport) {
        if (this.theReport.DxrStatus == 71) {
          this.isDataChange = false;
        } else {
          this.isDataChange = true;
        }
      }
    },
    Window4MassShow (val) {
      if (!val) this.FocusOnContent();
    },
    ReportTempShow (val) {
      if (!val) this.FocusOnContent();
    },
    SubTemplateShow (val) {
      if (!val) this.FocusOnContent();
    },
    urgentReportShow (val) {
      if (!val && this.lackNextReport) {
        this.lackNextReport = false;
        this.viewNextRecord(true)
      }
    }


  },
};
</script>

<style lang="scss" scoped>
/deep/ textarea {
  &.form-control:disabled,
  &.form-control[readonly] {
    background-color: transparent;
    color: inherit;
  }
}

.themeBlack .vue-tabs .nav-tabs > li > a div {
  color: white;
}
.themeBlack .vue-tabs input {
  background: white;
  color: black;
}
#FI0301 {
  position: relative;
}

#FI0301 .dtc-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: "none";
  z-index: 999999;
}

#FI0301 ::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
.text-black {
  color: black !important;
}
#app .themeBlack a {
  color: white !important;
}
#WinCST0301___BV_modal_header_ {
  .close {
    display: none;
  }
}

#WinCST0301___BV_modal_content_,
#WinMass0301___BV_modal_content_ {
  width: 100vw;
  height: 100vh;
}

#dropdown-1__BV_toggle_ {
  font-size: 12px !important;
  padding: 2px 8px !important;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: -3px;
}
</style>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
/* .themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
} */

.cardHeader {
  padding: 0 1.25rem; /*2px 1.25rem;*/
  white-space: nowrap;
}

.scrollBox {
  width: 100%;
  height: 132px; /*132px*/
  white-space: nowrap;
  overflow: auto;
}

.sb4RHis {
  width: 100%;
  overflow: auto;
}

/* 
/* height: calc(100vh - 440px);

.sb4Hide {
  min-height: calc(100vh - 297px) !important;
}
*/

/* -- */
.blink {
  animation: blink-animation 1s ease-in-out infinite;
}

@keyframes blink-animation {
  to {
    opacity: 0;
  }
}
</style>

<style lang="scss" scoped>
.mod-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  .left,
  .right {
    display: flex;
    flex-direction: column;
  }
}

#blkReportInput {
  position: relative;
  overflow: auto;

  .sticky {
    position: absolute;
    right: 22px;
    top: 5px;
    width: auto;
    height: auto;
    z-index: 3;
    cursor: pointer;
  }
  .full {
    position: sticky;
    right: 12px;
    top: 25px;
    width: auto;
    height: auto;
    z-index: 3;
  }
  > div {
    z-index: 1;
  }
  img {
    position: absolute;
    display: block;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  textarea {
    background-color: transparent;
    color: inherit;
  }
}
</style>

<style lang="scss" scoped>
/deep/ .table-responsive {
  table.table {
    td {
      > div {
        width: 100%;
        max-width: 600px !important;
      }
    }
  }
}

.dropleft .dropdown-menu {
  max-height: 480px;
  overflow: auto;
}

.title-grid {
  display: grid;
  grid-template-columns: 160px 500px;
  grid-gap: 100px;
}

.main-toolbar {
  position: relative;
}

#FI0301 {
  .dtc-toolbar {
    height: 40px;
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: -moz-hidden-unscrollable;
    > * {
      display: inline-block;
    }
    > button {
      width: 120px;
      min-width: 120px;
      white-space: nowrap;
    }
    &::-webkit-scrollbar {
      width: 0px; /* Remove scrollbar space */
      height: 0px;
      background: transparent; /* Optional: just make scrollbar invisible */
    }
  }
}

.dtc-arrow {
  width: 20px;
  height: 20px;
  font-weight: 800;
  cursor: pointer;
  display: block;
  position: static;
  line-height: 1;
  transform: none;
}

.withOutArrowBtns {
  .dtc-arrow {
    visibility: hidden !important;
  }
}

.img-border {
  display: inline-block;
  object-position: top left;
  width: 100%;
  height: 100%;
}

.dtc-back {
  position: static;
  display: block;
  min-width: 100px;
  height: 38px;
}
.dtc-his-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid #ddd;
  //grid-row-gap: 15px;
  > div {
    margin-bottom: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 6px;
    cursor: pointer;
    padding-top: 3px;
    &.time,
    &.procedure {
      font-size: 12px;
      white-space: normal;
      color: inherit;
    }
  }
}
.wired-content {
  display: flex;
  flex-direction: column;
  line-height: 2rem;
  font-size: 1.5rem;
  > * {
    margin: 1.2rem 0;
  }
  textarea {
    min-width: 90vw;
    min-height: calc(100vh - 230px);
  }
}
.view-history-pop {
  textarea {
    pointer-events: none !important;
  }
  display: flex;
  padding-top: 30px;
  font-size: 24px;
  .block {
    margin-bottom: 20px;
  }
  .left,
  .right {
    flex: 1;
    flex-direction: column;
    textarea {
      height: calc(100vh - 300px);
    }
  }
  .left {
    flex: 0 0 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .v-grid {
    display: grid;
    grid-template-columns: repeat(3, max-content max-content);
    grid-gap: 16px;
    margin-bottom: 20px;
  }
}

.urgent-opt {
  > label {
    display: inline-block;
    margin-left: 13px;
    background: transparent !important;
  }
  .input {
    margin-left: 12px;
    width: 600px;
  }
  input[type="radio"] {
    transform: scale(1.5);
  }
}
.sms-input {
  margin-top: 15px;
  margin-bottom: 15px;
  display: inline-block;
  margin-left: 16px;
  width: 680px;
  height: 200px;
}
.urgent-btns {
  display: grid;
  grid-template-columns: max-content 140px max-content max-content;
  grid-gap: 30px;
  margin-left: 16px;
  margin-bottom: 16px;
}
.dtc-version-num {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  text-align: center;
}

.first-row {
  position: relative;
  .positive-btn {
    position: absolute;
    left: 160px;
    top: 5px;
  }
}
.btn-right {
  position: relative;
}
// .detail-btn {
//   position: absolute !important;
//   left: 50%;
//   transform: translateX(-50%);
//   top: 0px;
//   z-index: 2;
// }
.vue-js-switch {
  background: transparent !important;
}
.footer-b4-save {
  margin: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 200px 100px 100px;
  grid-gap: 1rem;
}

.report-tab {
  position: absolute;
  top: 3px;
  left: 10px;
  right: 0px;
  bottom: 0;
  height: calc(100% + 30px);
  width: 100%;
  z-index: 99999;
  /deep/ textarea,
  /deep/ input[type="text"] {
    background-color: inherit;
    color: inherit;
  }
  /deep/ input[type="text"] {
    border: 1px solid;
  }
}

.dtc-vue-tab {
  overflow-x: hidden;
}
// *::-webkit-scrollbar {
// 		width: 0px;  /* Remove scrollbar space */
// 		background: transparent;  /* Optional: just make scrollbar invisible */
// }
.tab-close {
  position: absolute;
  top: -4px;
  right: 0px;
  cursor: pointer;
}
.tab-close:hover {
  transform: rotate(7deg);
}

.active-history {
  background: yellow;
  color: #000;
}

.themeBlack .active-history {
  background: var(--red) !important;
  font-weight: 700;
}
.themeBlack .vue-tabs .tabs__link:hover {
  background: var(--primary) !important;
}
.dtc-vue-tab-history .tab-content {
  pointer-events: none;
}
</style>

<style>
#view-history2___BV_modal_content_ {
  min-width: 100vw !important;
  width: 100vw !important;
}

.modal-body a {
  color: inherit;
}
</style>
