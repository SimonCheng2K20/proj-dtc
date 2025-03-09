<template>
  <div
    id="subReport"
    class="sub-report pageContent pb-1"
    :class="{ 'mt-0': !getToggleReport.navigation }"
  >
    <div
      class="dtc-mask"
      v-if="showDtcMask"
    />
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <reportHeader
        :HotkeyList="HotkeyList"
        @showCallLab="showCallLab"
        @WinConfigOpen="WinConfigOpen"
        @HelpShow="HelpShow"
      />

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
            :isSubReport="isSubReport"
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

          <reportBtns
            :continuousReportCode.sync="continuousReportCode"
            :isShiftNoteAvaliable="isShiftNoteAvaliable"
            :ShiftNoteNeedsToClick="ShiftNoteNeedsToClick"
            :lockingCallPacs="lockingCallPacs"
            :isAbleToModifyReport="isAbleToModifyReport()"
            :theReport="theReport"
            :cstTab="cstTab"
            :hasReportHistory="reportHistory.length > 0"
            :pageProcess="pageProcess"
            :numObj="numObj"
            :numObj2="numObj2"
            :isSubReport="true"
            @viewPrevRecord="viewPrevRecord"
            @viewNextRecord="viewNextRecord"
            @WinMass4ShiftNote="WinMass4ShiftNote"
            @addNoteB4Save="addNoteB4Save"
            @DataSave="DataSave"
            @WinMass4Phrase="WinMass4Phrase"
            @viewUrgentReport="viewUrgentReport"
            @callView="callView"
            @reportTemplateOpen="reportTemplateOpen"
            @versionHistoryOpen="versionHistoryOpen"
          />

          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1">
              <b-tabs>
                <b-tab title="歷史報告">
                  <reportDtcHistory
                    @showHistoryReport="({item, id}) => viewHistoryReport(item, id)"
                    @showAlert="showVersionAlert"
                    :historys="historyList"
                    :showDetailHeight="{height: showDetailHeight.height.replace('450', '492')}"
                  />
                </b-tab>
                <b-tab title="圖片">
                  <div :style="{height: showDetailHeight.height.replace('450', '465')}">
                    IMGS
                  </div>
                </b-tab>
              </b-tabs>
              
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
                    <div slot="title">
                      {{ item.CSTName }}
                      <span
                        @click.stop="_removeCstTab(i)"
                        class="tab-close"
                      >&times;</span>
                    </div>
                    <report
                      ref="subreport"
                      :title="item.CSTName"
                      :id="item.CSTId"
                      :cstContent="item.cstHtml"
                      :cstData="item.structureData"
                      @updateCstSecTab="updateCstSecTab"
                    />

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
                :isLoading="showHistoryLoadingNo"
                :viewHistoryItem="viewHistoryItem"
                :isSubReport="true"
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
      <div  v-if="reportList.length> 0">
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
      <div v-else class="py-2">
        <b-spinner class="align-middle mr-1"></b-spinner>
        <strong>載入中, 請稍待 ...</strong>
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
import reportBaseInfo from "@/components/report/reportBaseInfo";
import reportRecordInfo from "@/components/report/reportRecordInfo";
import reportHeader from "@/components/report/reportHeader";
import reportBtns from "@/components/report/reportBtns";
import reportDtcHistory from "@/components/report/history";
import ModifyReport from "@/components/report/ModifyReport";
import reportContentHistory from "@/components/ReportContentHistory";
import wasteImage from "@/components/WasteImage.vue";
import report from "@/components/report";
import BusFactory from "@/assets/js/busFactory.js";
import Swal from "sweetalert2";
import { winIQControl, winConfig4HotkeyDetect, winConfig4StructureReport, winConfig4ReportTemple, winConfig4VersionHistory, callLab, theProcedure } from "@/assets/js/reportCommonVariable.js";
import { getCstList, callPaceWebSocket, getReportByAccessionNo, reportSave, getReportContents, selectNoListForImageQuality } from "@/assets/service/dataManager";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import reportMix from "@/mixins/report.js";
import { defaultHotKeyArr, modifyOptions1, modifyOptions2, urgOptions, urg2Options, norOptions } from "@/components/report/defaultData";
// 載入模組:KeyPressIdentifier

// 動態宣告-外部
var OutterProprty4DynamicDeclare = { name4ContentDiff: "versionDiffByDynamic" };
import TxtDif from "@/components/TextDiff";
import RxP from "@/components/CI0302ReportPhrase";  // 載入模組:片語維護

export default {
  name: "SubReport",
  components: { TxtDif, RxP, ModifyReport, reportContentHistory, reportBaseInfo, reportHeader, reportBtns, reportDtcHistory, reportRecordInfo, wasteImage, report },
  mixins: [dateFormatMixin, reportMix],
  data () {
    return {
      isMounted: false,
      isFetchingData: "",
      isDataChange: false,
      isSubReport: false,

      showHistoryDlg: false,
      showHistoryLoadingNo: '',
      showDtcMask: false,
      showCstBtns: true,
      showAlert: false,
      showImgReport: false,
      showWasteImage: false,

      windowObj: "",
      callLab,
      loadingHistory: false,
      copyOk: false,
      cstTab: [],
      cstTabName: "",
      currentNum: 1,
      currentPage: 1,
      currentTab: "",

      title: "書寫報告書寫",
      smsMsg: "",
      whySaveText: "",
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

      perPage: 10,
      initArray: [],
      totalArrayLen: "",
      viewHistoryItem: "",
      imgQualityList: [],
      ApprovalPhysicianName: null,
      approvalList: [],
      historyList: [],
      myFullScreenItem: "",
      reportList: [],
      fullScreen: false,

      reportImg: "",
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      VueNestLevel: 0,
      //
      UserId: "Pollux",
      // 功能啟動時之先決條件的處理狀況
      // 動態宣告-內部
      innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
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
      winIQControl,
      winConfig4HotkeyDetect,
      winConfig4StructureReport,
      winConfig4ReportTemple,
      winConfig4VersionHistory,
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
      continuousReportCode: "Y",
      theProcedure,
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
      toggleTime: Date.now(),
      lackNextReport: false,
      ShiftNoteNeedsToClick: false,
      savingTimeStamp: null
    };
  },
  computed: {
    currentTabObj () {
      return this.cstTab.find(({ CSTName }) => this.cstTabName === CSTName);
    },
    loginId () {
      return this.$store.state.Profile4User.id;
    },
    canApproveReport () {
      const v = this.approvalList.find((s) => this.loginId === s.value);
      return v ? true : false;
    },
    theSamePerson () {
      const v = this.theReport.IssuePhysicianId === this.loginId;
      return v;
    },
    MacroItemList () {
      // 片語簡易清單
      // console.log(this.$logs());
      return this.theMacroList;
    },
    NameOfImageQuality () {
      let value = "";
      if (this.theReport && this.theReport.ImageQualityCode) {
        if (this.optionsImageQuality && this.optionsImageQuality.length > 0) {
          this.optionsImageQuality.some((e) => {
            if (e.value === this.theReport.ImageQualityCode) {
              value = e.text;
              return true;
            }
          });
        }
      }
      return value;
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
    tempalteIsShow() {
      return this.isMounted && this.$refs.subTemplate
        ? this.$refs.subTemplate.isShow
        : false;
    }
  },
  methods: {
    updateCstSecTab ({ rowIdx, key, name }) {
      const tmpTab = JSON.parse(this.cstTab[0].cstHtml);
      tmpTab.source[rowIdx]["itemRow"].forEach((item) => {
        if (item["tabs"] && item["tabs"]["name"] === name) {
          if (item.tabs["show"] && item.tabs[key] !== key) {
            delete item.tabs["show"];
          } else if (item.tabs["key"] === key) {
            item.tabs["show"] = true;
          }
        }
      });
      this.cstTab[0].cstHtml = JSON.stringify(tmpTab);
    },
    saveFullScreenForm () {
      if (!this.$refs["subreport"]) return false;
      this.$refs["subreport"].forEach((ch, idx) => {
        this.cstTab[idx].updateCount += 1;
        this.cstTab[idx].structureData = JSON.stringify(
          ch.secs.reduce(
            (a1, c1) => ({
              ...a1,
              ...c1.itemRow
                .map(({ items }) => items)
                .flat()
                .reduce((a2, c2) => {
                  return { ...a2, [c2.key]: c2.value };
                }, {}),
            }),
            {}
          )
        );
      });
      return true;
    },
  },
  created () {
    this.initReport(); // mixin report.js
  },
  watch: {
    tempalteIsShow (val) {
      if(!val) {
        setTimeout(()=>{
          if(this.cstTab.length === 0) {
            Swal.fire({
              title: "必需選擇一個報告",
              showCancelButton: true,
              confirmButtonText: "選擇",
              cancelButtonText: "返回"
            }).then((result)=>{
              if(result.hasOwnProperty('value')) {
                this.reportTemplateOpen();
              } else if(result.hasOwnProperty('dismiss')) {
                this.$router.push({name: "FI0304ForSub"});
              }
            });

          }
        },1000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/reportStyle.scss";
/deep/ #blkReportInput .input-group {
  .custom-select {
    background-color: transparent;
    color: inherit !important;
    option {
      color: #333;
    }
  }
}
.report-tab {
  width: calc(100% - 10px);
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
.sb4RHis {
  width: 100%;
  overflow: auto;
}
</style>
