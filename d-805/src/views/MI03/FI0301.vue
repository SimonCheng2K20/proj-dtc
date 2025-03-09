/* eslint-disable no-empty */
<template>
  <div id="FI0301" class="pageContent pb-1" :class="{ 'mt-0': !getToggleReport.navigation }">
    <div class="dtc-mask" v-if="showDtcMask" />
    <b-card no-body class="mx-1" bg-variant="transparent">
      <reportHeader :HotkeyList="HotkeyListNew" @showCallLab="showCallLab" @WinConfigOpen="hotkeyListShow" />
      <b-card-text class="text-left py-1 m-0">
        <b-container fluid class="px-0">
          <reportBaseInfo
            v-show="getToggleReport.patientDetail"
            :report="theReport"
            :procedure="theProcedure"
            :key="'baseinfo_' + theProcedure.AccessionNo"
            :optionsImageQuality="optionsImageQuality"
            :tempPhysicianId="tempPhysicianId"
            @ShowIQControlEdit="WinIQControlEdit"
            @updateSpecificVariable="updateSpecificVariable"
            @updateSpecificReportValue="updateSpecificReportValue"
          />

          <reportRecordInfo
            v-show="getToggleReport.reportDetail"
            :key="'recordinfo_' + theProcedure.AccessionNo"
            :procedure="theProcedure"
            :report="theReport"
            class="mt-1"
          />

          <reportBtns
            ref="reportBtns"
            :continuousReportCode.sync="continuousReportCode"
            :isShiftNoteAvaliable="isShiftNoteAvaliable"
            :ShiftNoteNeedsToClick="ShiftNoteNeedsToClick"
            :lockingCallPacs="lockingCallPacs"
            :theReport="theReport"
            :cstTab="cstTab"
            :hasReportHistory="reportHistory.length > 1"
            :pageProcess="pageProcess"
            :numObj="numObj"
            :numObj2="numObj2"
            :procedure="theProcedure"
            :origReportContent="origReportContent"
            @callParentPacs="callPacs"
            @viewPrevRecord="viewPrevRecord"
            @viewNextRecord="viewNextRecord"
            @WinMass4ShiftNote="WinMass4ShiftNote"
            @WinMass4Radiographer="WinMass4Radiographer"
            @addNoteB4Save="addNoteB4Save"
            @DataSave="DataSave"
            @WinMass4Phrase="WinMass4Phrase"
            @viewUrgentReport="viewUrgentReport"
            @viewAbnormalReport="viewAbnormalReport"
            @callView="callView"
            @reportTemplateOpen="reportTemplateOpen"
            @versionHistoryOpen="versionHistoryOpen"
            @FailImageReport="FailImageReport"
            @examination-for-805-finish="({ ScreeningWarning }) => (theReport.ScreeningWarning = ScreeningWarning)"
            @addObjectNote="insertObjectContent"
            @backToPreviousRoute="backToPreviousRoute"
          />

          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1">
              <reportDtcHistory
                @showHistoryReport="({ item, id }) => viewHistoryReport(item, id)"
                @hisShowPac="({AccessionNo, PatientId}) => getHisPacImage(PatientId, AccessionNo)"
                @showAlert="showVersionAlert"
                :historys="historyList"
                :Images="Images"
                :showDetailHeight="showHistoryHeight"
                :selectedImage.sync="theReport.ReportImageOids"
                :currentModality="theProcedure.Modality"
              />
            </b-col>

            <b-col
              id="blkReportInput"
              ref="blkReportInput"
              :sm="showHistoryDlg && theReport ? 5 : 10"
              class="px-1"
              style="display: flex; flex-direction: column"
            >
              <b-textarea
                id="DxRMain"
                no-resize
                class="border-primary sb4RHis"
                v-show="!showImgReport"
                ref="reportPlainText"
                v-model="theReport.ReportContent"
                @keyup.native.119="findReportPhraseStr()"
                placeholder="請於此處輸入報告內容"
                style="padding-right: 50px; font-family: Monaco !important; flex-grow: 1"
                wrap="hard"
              />

              <!-- spellcheck="false" -->
              <!-- debounce="500" -->

              <div class="sticky" v-if="reportImg">
                <b-button-group v-show="!fullScreen">
                  <b-button
                    v-show="showCstBtns"
                    v-if="theReport.DxrStatus != 71"
                    variant="info"
                    size="sm"
                    class="mr-1"
                    @click="DataSave(63)"
                  >
                    <font-awesome-icon icon="save" class="mr-1" />暫存報告
                  </b-button>

                  <b-button v-show="showCstBtns" size="sm" variant="danger" @click="showImgReport = true">
                    <font-awesome-icon icon="chalkboard-teacher" class="mr-1" />切到癌症報告
                  </b-button>
                  <div v-show="showCstBtns" class="ml-1"></div>
                  <b-button v-show="showCstBtns" size="sm" variant="info" @click="exitFullScreen">
                    <font-awesome-icon icon="pen" />切到書寫報告
                  </b-button>
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
                <vue-tabs ref="reportTabs" active-tab-color="#e74c3c" active-text-color="white">
                  <v-tab
                    v-for="(item, i) in cstTab"
                    class="title_center"
                    :key="item.CSTName + '_' + item.updateCount"
                    :title="item.CSTName"
                    style="padding: 10px; position: relative"
                    @click="updateVtabTitle(item)"
                  >
                    <div @click="updateVtabTitle(item)" slot="title">
                      {{ item.CSTName }}
                      <span @click.stop="_removeCstTab(i)" class="tab-close">&times;</span>
                    </div>
                    <!-- <img class="img-border" :src="item.img" > -->
                    <form>
                      <div v-html="item.cstHtml" />
                    </form>
                  </v-tab>
                </vue-tabs>
              </div>

              <div
                class="report-selected-images-area"
                v-if="imagesShow && imagesShow.length"
              >
                <div class="img-title">
                  選取圖片 :&nbsp;
                  <span>
                    已選擇 <span class="it-num">{{ imagesShow.length }}</span> / ({{ Images.length }})
                  </span>
                </div>
                <div class="img-content">
                  <div
                    class="img-item"
                    v-for="(item, index) in imagesShow"
                    :key="index"
                  >
                    <b-icon-x-circle
                      class="img-x"
                      @click="theReport.ReportImageOids.splice(index, 1)"
                    ></b-icon-x-circle>
                    <b-img style="width: 100%;" :src="item.src" />
                  </div>
                </div>
              </div>
            </b-col>

            <b-col v-if="showHistoryDlg && theReport" sm="5">
              <reportContentHistory
                ref="reportContentHistory"
                v-if="HotkeyListNew.length > 0"
                :viewHistoryItem="viewHistoryItem"
                :isLoading.sync="showHistoryLoadingNo"
                v-on:closeModal="() => (showHistoryDlg = false)"
                v-on:insertHistoryContent="insertHistoryContent"
                :keyName="HotkeyListNew.find(({ method }) => method === 'insertHistoryContent')['hotkey'] || []"
                v-on:getHisPacImage="getHisPacImage"
                :hisPacShow="hisPacShow"
                :hisPacImage="hisPacImageReactive"
                :lockingCallPacs="lockingCallPacs"
              />
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <ModifyReport :patient="theProcedure || {}" />

    <wasteImage
      :show.sync="showWasteImage"
      :patient="theProcedure || {}"
      :stepDefault="3"
      :imgKeep="{ check: true, display: false }"
    />

    <b-modal
      id="callPackCheck"
      ref="callPackCheck"
      centered
      no-fade
      size="600"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="'success'"
      :header-text-variant="'light'"
      hide-footer
    >
      <template slot="modal-title">
        <font-awesome-icon icon="eraser" class="mr-2" />
        <span class="zhTW">呼叫PACS</span>
      </template>
      <div style="margin-top: 12px">
        <div style="margin-bottom: 12px; font-size: 1.5rem; line-height: 1.5; text-align: center">已呼叫PACS</div>
      </div>
      <!-- <b-row>
        <b-col class="text-right" style="margin-top: 8px; padding: 4px 8px 8px 8px">
          <b-button variant="primary" class="mr-2"  @click="$bvModal.hide('callPackCheck')">確定</b-button>
        </b-col>
      </b-row> -->
    </b-modal>

    <b-modal
      id="reNewReportContent"
      ref="reNewReportContent"
      centered
      no-fade
      size="600"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="'danger'"
      :header-text-variant="'light'"
      @ok="reNewReportTemp"
      ok-title="確定"
      cancel-title="取消"
      @show="keydownEnterRevokeReport"
      @hide="cancelkeydownEnterRevokeReport"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="eraser" class="mr-2" />
        <span class="zhTW">放棄撰打報告</span>
      </template>
      <div style="margin-top: 12px">
        <div style="margin-bottom: 12px; font-size: 1.5rem; line-height: 1.5; text-align: center">確認放棄撰打?</div>
      </div>
      <!-- <b-row>
        <b-col class="text-right" style="margin-top: 8px; padding: 4px 8px 8px 8px">
          <b-button variant="secondary" class="mr-2">取消</b-button>
          <b-button variant="primary" class="mr-2">確定</b-button>
        </b-col>
      </b-row> -->
    </b-modal>

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
        <font-awesome-icon icon="code-branch" class="mr-1" />
        <span class="zhTW">版本差異</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col>
            <!--
						<TxtDif :old-string="oldStr" :new-string="newStr" :context="10" outputFormat='side-by-side'/>
            -->
            <TxtDif :old-string="oldStr" :new-string="newStr" :context="10" />
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
      @hide="FocusOnContent"
    >
      <template slot="modal-title">
        <font-awesome-icon :icon="winMassComponent ? 'book-medical' : 'procedures'" class="mr-1" />
        <span class="zhTW">{{ winMassTitle }}</span>
      </template>
      <div class="d-block zhTW" style="max-height: 75vh; overflow-y: auto">
        <b-row>
          <b-col class="px-1">
            <RxP
              v-if="winMassComponent"
              :instantContent="instantContent"
              v-on:clearInstantContent="() => (instantContent = '')"
            />
            <b-textarea v-else no-resize rows="32" v-model="winMassContent" readonly />
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="FailImage"
      ref="FailImage"
      centered
      no-fade
      size="lg"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="'primary'"
      :header-text-variant="'light'"
      @show="keydownEnterFailImage"
      @hide="cancelKeydownEnterFailImage"
      hide-footer
    >
      <template slot="modal-title">
        <font-awesome-icon icon="image" class="mr-2" />
        <span class="zhTW">不良片紀錄</span>
      </template>
      <div style="margin-top: 12px">
        <div class="d-flex align-items-center mb-2">
          <span class="col-2 p-0" style="font-size: 1.2rem; line-height: 1.5">放射師 : </span>
          <b-select
            id="refRadiographer"
            v-model="failImageGlobalRadioGrapher"
            :options="optionsRadiographer"
            @change="ChangeRadiographer"
          />
        </div>
        <div style="margin-bottom: 12px; font-size: 1.2rem; line-height: 1.5">醫師備註 :</div>
        <div style="position: relative; padding-bottom: 28px">
          <b-textarea
            id="failImageTextarea"
            placeholder="限制100字內"
            class="col-12"
            style="min-height: 160px; padding: 8px"
            maxlength="100"
            v-model="failImageGlobalText"
          />
          <div
            class="position-absolute"
            style="display: flex; align-items: center; bottom: 0; right: 12px; color: #666666"
          >
            <span>目前字數</span>&nbsp; &nbsp;<span>:</span>&nbsp;
            <span>
              {{ failImageGlobalText && failImageGlobalText.length ? convertTextLen : '0' }}
              / 100
            </span>
          </div>
        </div>
      </div>
      <b-row>
        <b-col class="text-right" style="margin-top: 8px; padding: 4px 8px 8px 8px">
          <b-button variant="secondary" class="mr-2" @click="onFailImageCancelClick"> 取消 </b-button>
          <b-button variant="primary" class="mr-2" @click="checkFailImageOk"> 確定 </b-button>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      id="WinHotkeyDetect0301"
      ref="WinHotkeyDetect"
      centered
      hide-footer
      no-fade
      body-class="py-1 themeModal"
      no-close-on-esc
      :header-bg-variant="winConfig4HotkeyDetect.HeadBgV"
      :header-text-variant="winConfig4HotkeyDetect.HeadTxV"
      :body-bg-variant="winConfig4HotkeyDetect.BodyBgV"
      :body-text-variant="winConfig4HotkeyDetect.BodyTxV"
      @hide="removeHotkeySettingKeydownHandler"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="cog" class="mr-1" />
        <span class="zhTW">{{ winConfig4HotkeyDetect.Title }}</span>
      </template>
      <div class="d-block zhTW" style="padding-bottom: 10px;">
        <b-container>
          <b-row class="mb-3">
            <b-col>
              <div>
                <span>請勿按下 <kbd> Alt </kbd> + <kbd> F4 </kbd>，那會關閉瀏覽器！</span>
                <Button @click="$bvModal.show('hotkeyblock')">Hotkey 說明</Button>
              </div>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <div>
                <span> 目前設定值為 </span>
                <span v-for="(key, index) in seletedHotkeyItem.hotkey" :key="key">
                  <kbd>{{ key }}</kbd>
                  <span v-if="index < seletedHotkeyItem.hotkey.length - 1"> + </span>
                </span>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div>
                <span> 您設定的是 </span>
                <span v-for="(key, index) in keydownSettingHotkey" :key="key">
                  <kbd>{{ key }}</kbd>
                  <span v-if="index < keydownSettingHotkey.length - 1"> + </span>
                </span>
                <span v-if="!checkBlockHotkey">，不得設為 Hotkey</span>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="float-right" style="margin-top: 12px">
                <!-- <b-button
                  style="background: red"
                  class="mr-1"
                  @click="resetSelectHotkey"
                  :disabled="seletedHotkeyItem.hotkey.length === 0 && keydownSettingHotkey.length === 0"
                >
                  重置
                </b-button> -->
                <b-button
                  style="background: grey"
                  class="mr-1"
                  @click="keydownSettingHotkey = []"
                  :disabled="keydownSettingHotkey.length === 0"
                >
                  清除
                </b-button>
                <b-button
                  variant="warning"
                  class="mr-1"
                  @click="saveHotkey"
                  :disabled="!checkBlockHotkey"
                >
                  <font-awesome-icon icon="check" class="mr-1" />儲存設定
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
        <font-awesome-icon icon="image" class="mr-1" />
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
      header-class="b-Hotkey-header"
      body-class="py-1 themeModal border-bottom border-right border-left rounded-bottom"
      :header-bg-variant="winConfigure.HeadBgV"
      :header-text-variant="winConfigure.HeadTxV"
      :body-bg-variant="winConfigure.BodyBgV"
      :body-text-variant="winConfigure.BodyTxV"
      @hide="FocusOnContent"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="cog" class="mr-1" />
        <span class="zhTW">{{ winConfigure.Title }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col>
            <b-container fluid class="px-1">
              <b-row>
                <b-col>
                  <hr />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-container>
                    <b-row style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 8px 0;">
                      <b-col v-for="(item, index) in HotkeyListNew" :key="index">
                        <b-button
                          :variant="$IsThemeBlack() ? 'primary' : 'success'"
                          @click="setHotKey(item)"
                          class="mr-1"
                          >{{ item.title }}</b-button
                        >
                        <span v-for="(key, index) in item.hotkey" :key="key">
                          <kbd>{{ key }}</kbd>
                          <span v-if="index < item.hotkey.length - 1"> + </span>
                        </span>
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
        <b-row>
          <b-col>
            <div class="float-right" style="padding: 8px 0;">
              <b-button variant="warning" class="mr-1" @click="deleteAllHotkey"> 清除所有設定 </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      id="hotkeyblock"
      size="xl"
      title="不得設為 Hotkey 組合"
      :header-bg-variant="winConfig4ReportTemple.HeadBgV"
      :header-text-variant="winConfig4ReportTemple.HeadTxV"
      :body-bg-variant="winConfig4ReportTemple.BodyBgV"
      :body-text-variant="winConfig4ReportTemple.BodyTxV"
      hide-footer
    >
      <div style="display: flex; gap: 8px">
        <div>
          <div style="background: #e2d2ff; padding: 4px">Control</div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px;
              background: #f8f3ff;
              padding: 4px;
            "
          >
            <div v-for="(keys, index) in blockHotkeyGroupBy.Control" :key="index">
              <kbd>{{ keys[0] }}</kbd> + <kbd>{{ keys[1] }}</kbd>
            </div>
          </div>
        </div>
        <div>
          <div style="background: #fce1ac; padding: 4px">Shift</div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 8px;
              background: #fff6e4;
              padding: 4px;
            "
          >
            <div v-for="(keys, index) in blockHotkeyGroupBy.Shift" :key="index">
              <kbd>{{ keys[0] }}</kbd> + <kbd>{{ keys[1] }}</kbd>
            </div>
          </div>
        </div>
        <div>
          <div style="background: #cbefbf; padding: 4px">Alt</div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(1, minmax(0, 1fr));
              gap: 8px;
              background: #f1ffec;
              padding: 4px;
            "
          >
            <div v-for="(keys, index) in blockHotkeyGroupBy.Alt" :key="index">
              <kbd>{{ keys[0] }}</kbd> + <kbd>{{ keys[1] }}</kbd>
            </div>
          </div>
        </div>
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
        <font-awesome-icon icon="edit" class="mr-1" />
        <span class="zhTW">癌症報告</span>
      </template>
      <div>
        <b-link
          style="display: block"
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
        <font-awesome-icon icon="code-branch" class="mr-1" />
        <span class="zhTW">{{ `報告版次(共` + reportHistory.length + `筆 )` }}</span>
      </template>
      <div>
        <b-link
          style="display: block"
          class="my-1"
          v-for="(item, index) in reportHistory"
          v-bind:key="index"
          @click="DoThis(innerProprty4DynamicDeclare.name4ContentDiff, item)"
          >{{ item }}</b-link
        >
      </div>
    </b-modal>

    <b-modal
      id="abnormal-report"
      ref="abnormalReport"
      centered
      no-fade
      size="lg"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="winConfig4VersionHistory.HeadBgV"
      :header-text-variant="winConfig4VersionHistory.HeadTxV"
      :body-bg-variant="winConfig4VersionHistory.BodyBgV"
      :body-text-variant="winConfig4VersionHistory.BodyTxV"
      @ok="sendAbnormalReport"
      ok-title="發送"
      cancel-title="取消"
      @show="keydownEnterSendSMS"
      @hide="cancelkeydownEnterSendSMS"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="code-branch" class="mr-1" />
        <span class="zhTW">使用簡訊發送病患異常通報</span>
      </template>
      <div style="margin-top: 12px">
        <div class="mb-3 rounded" v-if="emergencyKeyWords.length > 0">
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

        <div class="d-flex align-items-center mb-2">
          <span class="col-2 p-0">通知醫師</span>
          <b-input class="col-4" v-model="doctorName" disabled />
          <span class="col-2">手機號碼</span>
          <b-input class="col-4" v-model="phoneNumber" />
        </div>
        <div style="margin-bottom: 12px">簡訊內容</div>
        <b-textarea
          id="abnormalSmsTextarea"
          placeholder="限制1000字內"
          class="col-12"
          style="resize: none; height: 200px"
          maxlength="1000"
          v-model="abnormalSms"
        />
        <div class="position-absolute" style="bottom: 10px; right: 25px">
          目前字數:
          {{ abnormalSms && abnormalSms.length ? abnormalSms.length : '0' }}/1000
        </div>

        <div class="d-flex justify-content-between align-items-center mt-2">
          <b-check v-model="autoAdd">於報告中加註異常通知訊息</b-check>
        </div>
      </div>
    </b-modal>

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
        <font-awesome-icon icon="code-branch" class="mr-1" />
        <span class="zhTW">緊急通報</span>
      </template>
      <div style="margin-top: 12px">
        <div class="mb-3 rounded" v-if="emergencyKeyWords.length > 0">
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

        <div style="margin-bottom: 12px">緊急傳呼發給開單醫師的簡訊如下:</div>
        <b-input-group prepend="通報等級" @click="otherInput = ''">
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
          <input type="radio" :id="item.id" v-model="urgentOpt" :value="item.value" />
          <label :for="item.id">{{ item.text }}</label>
          <input class="input" v-if="i + 1 === urgOptions.length" v-model="otherInput" />
        </div>
        <div
          v-for="(item, i) in urg2Options"
          :key="item.id"
          class="urgent-opt ml-3 my-2"
          v-show="urgentPriorityCode == 'u1'"
        >
          <input type="radio" :id="item.id" v-model="urgentOpt" :value="item.value" />
          <label :for="item.id">{{ item.text }}</label>
          <input class="input" v-if="i + 1 === urg2Options.length" v-model="otherInput" />
        </div>

        <div
          v-for="(item, i) in norOptions"
          :key="item.id"
          class="urgent-opt ml-3 my-2"
          v-show="urgentPriorityCode == 'u3'"
        >
          <input type="radio" :id="item.id" v-model="urgentOpt" :value="item.value" />
          <label :for="item.id">{{ item.text }}</label>
          <input class="input" v-if="i + 1 === norOptions.length" v-model="otherInput" />
        </div>

        <div style="margin-bottom: 12px">簡訊內容</div>
        <textarea
          placeholder="限制70字內"
          ref="urgentPlaceholder"
          class="sms-input"
          maxlength="70"
          :value="urgentPlaceholder"
        />

        <div v-text="urgentPlaceholder" />

        <div class="urgent-btns">
          <b-btn variant="secondary" style="visibility: hidden" class="px-5" size="lg">報告內容</b-btn>
          <div></div>
          <b-btn variant="primary" class="px-5" size="lg" :disabled="!urgentOpt" @click="notifyUrgentMsg">確定</b-btn>
          <b-btn variant="secondary" @click="$bvModal.hide('urgent-report')" size="lg" class="px-5">取消</b-btn>
        </div>
      </div>
    </b-modal>

    <b-modal
      id="view-history2"
      ref="viewHistory"
      centered
      hide-footer
      no-fade
      style="min-width: 100vw"
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
        <div class="wired-content" v-show="viewHistoryItem.ReportSource === 'EBM'">
          <b-button @click="copyPasteText(viewHistoryItem.ReportContent)" variant="info">
            <font-awesome-icon icon="copy" class="mr-1" />複製診斷報告內文
          </b-button>
          <div v-if="copyOk" style="color: red">資料已複製並貼上</div>
          <b-textarea v-model="viewHistoryItem.ReportContent" style="flex: 1"></b-textarea>
        </div>
        <div class="left" v-show="viewHistoryItem.ReportSource === 'DTC'">
          <div class="block">
            <div>檢查項目 :</div>
            <div>
              {{ viewHistoryItem.ProcedureNameList ? viewHistoryItem.ProcedureNameList : '暫無資料' }}
            </div>
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
            <div>
              {{ viewHistoryItem.ApprovalPhysicianId ? viewHistoryItem.ApprovalPhysicianId : '暫無資料' }}
            </div>
          </div>
          <div class="block">
            <div>正式報告醫師代碼:</div>
            <div>
              {{ viewHistoryItem.IssuePhysicianId ? viewHistoryItem.IssuePhysicianId : '暫無資料' }}
            </div>
          </div>

          <div class="block">
            <div>正式報告審核成立之日期時間:</div>
            <div v-text="DateToString(new Date(viewHistoryItem.IssueTime), true)"></div>
          </div>
          <div class="block">
            <div>正式報告醫師之證照編號:</div>
            <div>
              {{ viewHistoryItem.IssuePhysicianMdlNo ? viewHistoryItem.IssuePhysicianMdlNo : '暫無資料' }}
            </div>
          </div>
          <div class="block" hidden>
            <div>Image</div>
            <div>
              {{ viewHistoryItem.StructureImage ? viewHistoryItem.StructureImage : '暫無資料' }}
            </div>
          </div>
          <div class="block">
            <div>病歷號:</div>
            <div>
              {{ viewHistoryItem.PatientId ? viewHistoryItem.PatientId : '暫無資料' }}
            </div>
          </div>
          <div class="block">
            <div>報告撰寫人員:</div>
            <div>
              {{ viewHistoryItem.DxreportPhysicianName ? viewHistoryItem.DxreportPhysicianName : '暫無資料' }}
            </div>
          </div>
          <div class="block">
            <div>審核人員 :</div>
            <div>
              {{ viewHistoryItem.ApprovalPhysicianName ? viewHistoryItem.ApprovalPhysicianName : '暫無資料' }}
            </div>
          </div>
          <div class="block">
            <div>正式報告醫師 :</div>
            <div>
              {{ viewHistoryItem.IssuePhysicianName ? viewHistoryItem.IssuePhysicianName : '暫無資料' }}
            </div>
          </div>
        </div>
        <div class="right" v-show="viewHistoryItem.ReportSource === 'DTC'">
          <div v-if="viewHistoryItem.CSTName1">
            <vue-tabs active-tab-color="#e74c3c" active-text-color="white" class="dtc-vue-tab-history">
              <v-tab
                v-for="item in 6"
                :key="item"
                :title="viewHistoryItem[`CSTName${item}`]"
                class="title_center"
                style="padding: 10px; position: relative; color: white"
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
          <div class="mb-2" style="margin-top: 1rem">
            診斷報告內文
            <b-button
              v-if="viewHistoryItem.ReportContent"
              @click="copyPasteText(viewHistoryItem.ReportContent)"
              variant="info"
            >
              <font-awesome-icon icon="copy" class="mr-1" />複製診斷報告內文
            </b-button>
          </div>
          <div v-if="copyOk" style="color: red">資料已複製並貼上</div>
          <div v-if="!viewHistoryItem.ReportContent" class="mb-5">暫無記錄</div>
          <b-textarea
            v-if="viewHistoryItem.ReportContent"
            v-model="viewHistoryItem.ReportContent"
            class="mb-5"
            style="width: 50vw; min-height: calc(100vh-250px)"
          ></b-textarea>
        </div>
      </div>
    </b-modal>

    <b-modal id="WinCST0301" ref="WinCST" centered @hide="WinCSTHide">
      <div class="d-block zhTW">
        <b-form id="WinCST0301DxRSC">
          <b-row ref="myReportImg">
            <b-col class="px-2" id="my-report-img" v-html="cstReportHtml"></b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>
  </div>
  
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import {
  getEmployeesByNo,
  getEmployeeDataByType,
  getPersonalSetting,
  savePersonalSetting,
  getActionReportRelease,
  getRadiographerCodeName,
  getPhraseData,
} from '@/assets/service/dataManager'
import reportBaseInfo from '@/components/report/reportBaseInfo'
import reportRecordInfo from '@/components/report/reportRecordInfo'
import reportHeader from '@/components/report/reportHeader'
import reportBtns from '@/components/report/reportBtns'
import reportDtcHistory from '@/components/report/history'
import BusFactory from '@/assets/js/busFactory.js'
import {
  winIQControl,
  winConfig4HotkeyDetect,
  winConfig4StructureReport,
  winConfig4ReportTemple,
  winConfig4VersionHistory,
  callLab,
  theProcedure,
} from '@/assets/js/reportCommonVariable.js'
import ModifyReport from './ModifyReport'
import { get } from '@/utils/lodash.js'
import { dateFormatMixin } from '@/SupportLib_J.js'
// import HistoryReport from "@/components/HistoryReportModal";
import { getPacsThumbnail } from '@/assets/service/dataManager'
import { mapGetters, mapMutations,  mapActions } from 'vuex'
import { FI0304HotkeyArr } from './defaultData.js'

// 載入模組:KeyPressIdentifier
import { modifyOptions1, modifyOptions2, urgOptions, urg2Options, norOptions } from '@/components/report/defaultData'
import reportContentHistory from '@/components/ReportContentHistory'
import wasteImage from '@/components/WasteImage.vue'
import reportMix from '@/mixins/report.js'
// 動態宣告-外部
var OutterProprty4DynamicDeclare = {
  name4ContentDiff: 'versionDiffByDynamic',
}

//	1. 安裝: $ npm i vue-code-diff
//	2. 再加自行撰寫 TextDiff
//	- 這個 plug-in 不是很合用, 但先勉強湊和著用
import TxtDif from '@/components/TextDiff'
// 載入模組:片語維護
import RxP from '@/components/CI0302ReportPhrase'

window.confirm = async (msg) => {
  return Promise.resolve(msg)
}

export default {
  name: 'FI0301',
  components: {
    TxtDif,
    RxP,
    ModifyReport,
    reportContentHistory,
    reportBaseInfo,
    reportHeader,
    reportBtns,
    reportDtcHistory,
    reportRecordInfo,
    wasteImage,
  },
  mixins: [dateFormatMixin, reportMix],
  data() {
    return {
      isMounted: false,
      isSubReport: false,
      isDataChange: false,
      isFetchingData: '',
      showHistoryDlg: false,
      showHistoryLoadingNo: '',
      showDtcMask: false,
      showCstBtns: true,
      showAlert: false,
      showImgReport: false,
      showWasteImage: false,
      windowObj: '',
      callLab,
      loadingHistory: false,
      copyOk: false,
      cstTab: [],
      cstTabName: '',
      currentNum: 1,
      currentPage: 1,
      currentTab: '',
      title: '書寫報告書寫',
      smsMsg: '',
      whySaveText: '',
      // phraseRecords: [],
      otherInput: '',
      hideNextPrevBtn: false,
      nextViewArr: [],
      modifyOpt: 1,
      modifyOptions: [],
      modifyOptions1,
      modifyOptions2,
      cstReportHtml: '',
      urgentPriorityCode: 'u1',
      urgentOpt: '',
      urgOptions,
      urg2Options,
      norOptions,
      dxrVersion: '',
      perPage: 10,
      initArray: [],
      totalArrayLen: '',
      viewHistoryItem: {},
      imgQualityList: [],
      ApprovalPhysicianName: null,
      approvalList: [],
      historyList: [],
      leftMost: true,
      rightMost: false,
      myFullScreenItem: '',
      reportList: [],
      fullScreen: false,
      reportImg: '',
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      VueNestLevel: 0,
      //
      UserId: 'Pollux',
      innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
      // 內文差異比對
      oldStr: 'Older String',
      newStr: 'Newer String',
      // 大對話框呈現內文
      winMassTitle: '',
      winMassContent: '',
      winMassHeadBgV: '',
      winMassHeadTxV: '',
      winMassBodyBgV: '',
      winMassComponent: false,
      winConfigure: {
        Title: `HotKey 組態設定 (共${FI0304HotkeyArr.length}筆)`,
      },
      winIQControl,
      winConfig4HotkeyDetect,
      winConfig4StructureReport,
      winConfig4ReportTemple,
      winConfig4VersionHistory,
      HotkeyList: [],
      personalSetting: {},
      seletedHotkeyItem: {
        hotkey: [],
      },
      keydownSettingHotkey: [],
      HotkeyTempSet: [],
      HotkeyCurrentItemName: '',
      HotkeyPressed: '',
      HotkeyPressRemark: '',
      HotkeyPressMessage: '',
      UnderHotkeyDetect: false,
      // 片語相關資料
      reportPhrase: {
        GUID: -1,
        PhraseCode: '',
        Replacement: '',
        OPPrgId: '',
      },
      theMacroList: [],
      // 檢查相關資料
      continuousReportCode: 'Y',
      theProcedure,
      labProcedures: '檢查項目一\n檢查項目二\n檢查項目三\n檢查項目四',
      // 報告相關資料
      theReport: { IsPositive: true },
      origReportContent: '',
      origCstHtmlData: '',
      reportHistory: [],
      optionsImageQuality: [],
      instantContent: '',
      busFactory: BusFactory(this),
      storeQuery: {
        tabList: null,
        query: null,
        searchCondition: null,
        rows: [],
      },
      sortMethod: null,
      tempPhysicianId: null,
      emergencyKeyWords: [],
      lockingCallPacs: false,
      toggleTime: Date.now(),
      lackNextReport: false,
      ShiftNoteNeedsToClick: false,
      searchCondition: null,
      savingTimeStamp: null,
      queue: {
        number: null,
        prevIsAuto: false,
      },
      reportData: {},
      Images: [],
      doctorName: '',
      phoneNumber: '',
      abnormalSms: '',
      failImageText: '',
      radioGrapher: null,
      optionsRadiographer: [],
      autoAdd: true,
      HotkeyListNew: [],
      keying: [],
      isKeyingStop: false,
      blockHotkeyArr: [
        ['Escape'],
        ['`'],
        ['0'],
        ['1'],
        ['2'],
        ['3'],
        ['4'],
        ['5'],
        ['6'],
        ['7'],
        ['8'],
        ['9'],
        ['-'],
        ['='],
        ['Tab'],
        ['A'],
        ['B'],
        ['C'],
        ['D'],
        ['E'],
        ['F'],
        ['G'],
        ['H'],
        ['I'],
        ['J'],
        ['K'],
        ['L'],
        ['M'],
        ['N'],
        ['O'],
        ['P'],
        ['Q'],
        ['R'],
        ['S'],
        ['T'],
        ['U'],
        ['V'],
        ['W'],
        ['X'],
        ['Y'],
        ['Z'],
        ['CapsLock'],
        ['['],
        [']'],
        [';'],
        [`'`],
        [','],
        ['.'],
        ['/'],
        ['Backspace'],
        [' '],
        ['+'],
        ['\\'],
        ['*'],
        ['Control'],
        ['Shift'],
        ['Alt'],
        ['ArrowUp'],
        ['ArrowDown'],
        ['ArrowLeft'],
        ['ArrowRight'],
        ['Insert'],
        ['Home'],
        ['PageUp'],
        ['PageDown'],
        ['Delete'],
        ['End'],
        ['NumLock'],
        ['Enter'],
        ['Control', 'Escape'],
        ['Shift', 'Escape'],
        ['Alt', 'Escape'],
        ['Control', 'Tab'],
        ['Shift', '!'],
        ['Alt', 'F4'],
        ['Control', 'CapsLock'],
        ['Shift', '@'],
        ['Alt', 'Tab'],
        ['Control', 'Enter'],
        ['Shift', '#'],
        ['Alt', 'CapsLock'],
        ['Control', 'Shift'],
        ['Shift', '$'],
        ['Alt', 'Enter'],
        ['Control', 'F4'],
        ['Shift', '%'],
        ['Alt', 'Shift'],
        ['Control', '/'],
        ['Shift', '^'],
        ['Alt', 'ArrowUp'],
        ['Control', 'ArrowUp'],
        ['Shift', '&'],
        ['Alt', 'ArrowDown'],
        ['Control', 'ArrowDown'],
        ['Shift', '*'],
        ['Alt', 'ArrowLeft'],
        ['Control', 'ArrowLeft'],
        ['Shift', '('],
        ['Alt', 'ArrowRight'],
        ['Control', 'ArrowRight'],
        ['Shift', ')'],
        ['Alt', 'Insert'],
        ['Control', 'Insert'],
        ['Shift', '_'],
        ['Alt', 'Home'],
        ['Control', 'Home'],
        ['Shift', '+'],
        ['Alt', 'PageUp'],
        ['Control', 'PageUp'],
        ['Shift', 'Tab'],
        ['Alt', 'PageDown'],
        ['Control', 'PageDown'],
        ['Shift', '{'],
        ['Alt', 'Delete'],
        ['Control', 'Delete'],
        ['Shift', '}'],
        ['Alt', 'End'],
        ['Control', 'End'],
        ['Shift', '|'],
        ['Alt', 'NumLock'],
        ['Control', 'NumLock'],
        ['Control', 'Pause'],
        ['Shift', 'CapsLock'],
        ['Control', 'E'],
        ['Shift', ':'],
        ['Control', 'F'],
        ['Shift', 'Enter'],
        ['Control', 'J'],
        ['Shift', '<'],
        ['Control', 'K'],
        ['Shift', '>'],
        ['Control', 'N'],
        ['Shift', '?'],
        ['Control', 'P'],
        ['Shift', '/'],
        ['Control', 'T'],
        ['Shift', '-'],
        ['Control', 'W'],
        ['Shift', 'Control'],
        ['Control', 'Y'],
        ['Shift', 'Alt'],
        ['Control', 'Z'],
        ['Shift', 'Insert'],
        ['Shift', 'Home'],
        ['Shift', 'PageUp'],
        ['Shift', 'PageDown'],
        ['Shift', 'End'],
        ['Shift', 'Delete'],
        ['Shift', 'ArrowUp'],
        ['Shift', 'ArrowDown'],
        ['Shift', 'ArrowLeft'],
        ['Shift', 'ArrowRight'],
        ['Shift', 'NumLock'],
        ['Shift', '"'],
        ['Shift', '0'],
        ['Shift', '1'],
        ['Shift', '2'],
        ['Shift', '3'],
        ['Shift', '4'],
        ['Shift', '5'],
        ['Shift', '6'],
        ['Shift', '7'],
        ['Shift', '8'],
        ['Shift', '9'],
        ['Control', ';'],
      ],
      keyUpHandler: null,
      FI0304HotkeyArr,
      hisPacShow: false,
      hisPacImage: [],
      hisIndex: 0,
      hisCountTemp: 0,
      tempReplacementTemp: {
        tag: null,
        content: null,
      },
      releaseCountTemp: 0,
      backByUserTemp: false
    }
  },
  computed: {
    lastToken(){
      return localStorage['token']
    },
    lastRelease: {
      get(){
        return this.getFinalRelease()
      },
      set(val){
        this.SET_FINAL_RELEASE(val)
      }
    },
    convertTextLen() {
      let len = 0
      let text = this.failImageGlobalText

      for (let i = 0; i < text.length; i++) {
        let t = text.charAt(i)
        if (t.match(/[^\x00-\xff]/gi) != null) {
          // console.log(`ch: `, t)
          len += 1
        } else {
          // console.log(`en: `, t)
          len += 1
        }
      }

      return len
    },
    imagesShow() {
      return this.theReport.ReportImageOids
        ? this.theReport.ReportImageOids.map((oid) => {
            return this.Images.find((item) => item.oid === oid) || {}
          })
        : []
    },
    checkBlockHotkey() {
      for (let i = 0; i < this.blockHotkeyArr.length; i++) {
        const items = this.blockHotkeyArr[i]
        const validArr = []

        if (items.length === this.keydownSettingHotkey.length) {
          for (let j = 0; j < items.length; j++) {
            if (
              this.keydownSettingHotkey.map((item) => item.toLocaleUpperCase()).includes(items[j].toLocaleUpperCase())
            ) {
              validArr.push(false)
            } else {
              validArr.push(true)
            }
          }

          if (!validArr.includes(true)) {
            return false
          }
        }
      }

      return true
    },

    blockHotkeyGroupBy() {
      return this.blockHotkeyArr.reduce((obj, item) => {
        const arr = obj[item[0]]
        if (arr) arr.push(item)
        else obj[item[0]] = []

        return obj
      }, {})
    },
    abnormalReportShow() {
      return this.isMounted && this.$refs['abnormalReport'] && this.$refs['abnormalReport'].isShow ? true : false
    },
    urgentReportShow() {
      return this.isMounted && this.$refs['urgentReport'] && this.$refs['urgentReport'].isShow ? true : false
    },
    Window4MassShow() {
      return this.isMounted && this.$refs['Window4Mass'] && this.$refs['Window4Mass'].isShow ? true : false
    },
    ReportTempShow() {
      return this.isMounted && this.$refs['reportTemplate'] && this.$refs['reportTemplate'].isShow ? true : false
    },
    SubTemplateShow() {
      return this.isMounted && this.$refs['subTemplate'] && this.$refs['subTemplate'].isShow ? true : false
    },
    isSaving() {
      return !window.isSavingDtc ? false : window.isSavingDtc
    },
    phraseRecords() {
      return this.phrase.private.length === 0 && this.phrase.public.length === 0
        ? []
        : [...this.phrase.private, ...this.phrase.public]
    },
    loginId() {
      return this.$store.state.Profile4User.id
    },
    theSamePerson() {
      const v = this.theReport.IssuePhysicianId === this.loginId
      return v
    },
    MacroItemList() {
      // 片語簡易清單
      // console.log(this.$logs());
      return this.theMacroList
    },
    DxReportVersion: {
      get() {
        return this.dxrVersion ? this.dxrVersion : '編輯中...'
      },
      set(v) {
        this.dxrVersion = v
      },
    },
    DxReportContent: {
      get() {
        return this.theReport && this.$Exists(this.theReport.ReportContent) ? this.theReport.ReportContent : ''
      },
      set(v) {
        if (this.theReport && this.$Exists(this.theReport.ReportContent)) this.theReport.ReportContent = v
      },
    },
    DxReportExtraNote: {
      get() {
        return this.theReport && this.$Exists(this.theReport.ExtraNote) ? this.theReport.ExtraNote : ''
      },
      set(v) {
        if (this.theReport && this.$Exists(this.theReport.ExtraNote)) this.theReport.ExtraNote = v
      },
    },
    DxReportIQCode: {
      get() {
        return this.theReport && this.$Exists(this.theReport.ImageQualityCode) ? this.theReport.ImageQualityCode : ''
      },
      set(v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityCode)) this.theReport.ImageQualityCode = v
      },
    },
    DxReportIQNote: {
      get() {
        return this.theReport && this.$Exists(this.theReport.ImageQualityNote) ? this.theReport.ImageQualityNote : ''
      },
      set(v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityNote)) this.theReport.ImageQualityNote = v
      },
    },
    hisPacImageReactive() {
      return this.hisPacImage
    },
    hisCount: {
      get() {
        return this.hisCountTemp
      },
      set(val) {
        this.hisCountTemp = val
      },
    },
    tempReplacement: {
      get() {
        return this.tempReplacementTemp
      },
      set(val) {
        this.tempReplacementTemp = val
      },
    },
    releaseCount: {
      get() {
        return this.releaseCountTemp
      },
      set(val) {
        this.releaseCountTemp = val
      },
    },
    isMphrase: {
      get(){
        return this.getMphraseValue()
      },
      set(val){
        this.SET_MPHRASE(val)
      }
    },
    instantModality() {
      return this.theProcedure.Modality
    },
  },
  methods: {
    ...mapGetters(['getREPOValue', 'getFinalRelease', 'getMphraseValue']),
    ...mapActions(['action_savingPersonalSetting']),
    ...mapMutations(['SET_SIDE_MESSAGE', 'SET_FINAL_RELEASE', 'SET_MPHRASE']),
    // backToPreviousRoute() {
    //   this.$router.push({
    //     name: this.$route.name === 'SubReport' ? 'FI0304ForSub' : 'FI0304',
    //   })
    // },
    resetSelectHotkey(){
      console.log(`resetSelectHotkey ()=>{}`, this.seletedHotkeyItem)
      console.log(`this.HotkeyListNew: `, this.HotkeyListNew)

      this.HotkeyListNew.forEach((item) => {
        if(
          this.seletedHotkeyItem.title === item.title
        ){
          item.hotkey = []
          console.log(`matched: `, item)
        }
      })

      this.seletedHotkeyItem.hotkey = []
      this.keydownSettingHotkey = []
    },
    FocusOnContent(time = 250) {
      // this.$refs.reportPlainText.$el.focus()
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs['reportPlainText']) this.$refs['reportPlainText'].focus()
        })
      }, time)
    },
    hotkeyListShow() {
      this.$bvModal.show('WinConfig0301')
    },
    async GetOptionsRadiographer() {
      // const {
      //   actual: { Items },
      // } = await getEmployeeDataByType(35, false)
      // this.optionsRadiographer = Items.map(({ No, Name }) => ({
      //   text: `${No}-${Name}`,
      //   value: No,
      // }))
      // this.optionsRadiographer.unshift({ text: '請選擇', value: null })

      // console.log(`this.optionsRadiographer: `, this.optionsRadiographer)

      // // this.ChangeRadiographer()

      try {
        const { Items } = await getRadiographerCodeName()
        if (Items && Items.length) {
          Items.sort((a, b) => {
            return Number(a.CodeName) - Number(b.CodeName)
          })

          this.optionsRadiographer = Items.map(({ CodeName, EmployeeName, EmployeeId }) => ({
            text: `${CodeName}-${EmployeeName}`,
            value: CodeName,
            Id: EmployeeId,
            Name: EmployeeName,
          }))
          this.optionsRadiographer.unshift({ text: '請選擇', value: null })
        }
      } catch (err) {
        console.log(`error: `, err)
      }
    },
    ChangeRadiographer(e) {
      this.failImageGlobalData.EmployeeName = null
      this.failImageGlobalData.EmployeeNo = null

      this.optionsRadiographer.forEach((v) => {
        if (v.value === e) {
          this.failImageGlobalData.EmployeeName = v.Name
          this.failImageGlobalData.EmployeeNo = v.Id
        }
      })
    },
    keydownEnterFailImage() {
      document.addEventListener('keydown', this.sendFailImageWhenEnter)
    },
    cancelKeydownEnterFailImage() {
      document.removeEventListener('keydown', this.sendFailImageWhenEnter)
      
      // esc / click leave > focus on report
      this.FocusOnContent()
    },
    async sendFailImageWhenEnter(evt) {
      // console.log(`evt.key: `, evt.key);
      if (evt.key === 'Enter' && document.getElementById('failImageTextarea') != document.activeElement) {
        await this.checkFailImageOk()
      }
    },
    async checkFailImageOk() {
      if (this.failImageGlobalRadioGrapher === null || this.failImageGlobalRadioGrapher === '') {
        this.SET_SIDE_MESSAGE({ msg: '請選擇放射師~', type: 2 })
        document.querySelector('#refRadiographer').focus()
        return
      } else {
        await this.onFailImageOkClick()
        setTimeout(()=>{
          this.FocusOnContent()
        }, 300)
      }
    },
    async onFailImageOkClick() {
      this.failImageGlobalData.Reason = this.failImageGlobalText
      this.failImageGlobalData.EmployeeCodeName = this.failImageGlobalRadioGrapher
      await this.SaveFailImageReason(this.failImageGlobalData)
      this.clearFailimageData(true)
    },
    onFailImageCancelClick() {
      this.$bvModal.hide('FailImage')
      this.clearFailimageData()
    },
    async getPacsThumbnail() {
      try {
        const query = `?patientId=${this.theProcedure.PatientId}&accessionNo=${this.theProcedure.AccessionNo}`
        const data = await getPacsThumbnail(query)

        if (data) {
          console.log(`getPacsThumbnail > data: `, data)

          this.Images = data.map((url) => {
            const urlObj = new URL(url)
            const params = new URLSearchParams(urlObj.search)
            const oid = params.get('objectUID')
            return { src: url, oid }
          })

          console.log(`getPacsThumbnail > Images: `, this.Images)
        }

        // // test use
        // this.Images = [
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        //   {
        //     src: 'https://picsum.photos/600/600?r=' + Math.random(),
        //     oid: Math.random(),
        //   },
        // ]

      } catch (error) {
        return { error }
      }
    },
    async GetActionReportRelease() {
      try {
        await getActionReportRelease(this.theProcedure.AccessionNo)
      } catch (error) {
        return { error }
      }
    },
    resetFullScreenForm() {
      document.querySelector('#WinCST0301DxRSC').reset()
      let item = this.cstTab.find((s) => s.CSTName === this.cstTabName)
      if (!item) return
      item.structureData = ''
    },
    async GetVersions() {
      //	以 AccessionNo 取得 各版次之診斷報告 資訊
      this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`)
    },
    saveFullScreenForm() {
      let update = false
      const els = [...document.querySelectorAll('.vue-tabs form')]
      if (!els || !els.length) return false
      try {
        els.forEach((el, i) => {
          const valueSet = $(el).serializeArray()
          const valueString = valueSet ? JSON.stringify(valueSet) : ''

          if (this.cstTab[i].structureData != valueString) {
            update = true
          }
          this.cstTab[i].structureData = valueString
        })
        return update
      } catch (e) {
        return update
      }
      //this.DataSave(this.theReport.DxrStatus , true);
    },
    async GetEmployees() {
      try {
        const res = await getEmployeesByNo(this.theProcedure.RequestingPhysicianId)
        if (res && res.PhoneNo != null) {
          this.phoneNumber = res.PhoneNo
        } else if (res.PhoneNo === null) {
          this.phoneNumber = ''
        }
      } catch (err) {
        console.log(err)
      }
    },
    addAbnormalReportToReportContent() {
      const date = moment(new Date()).format('YYYY年MM月DD日 HH時mm分')
      const twDate = date.substring(0, 4) - 1911 + date.slice(4)

      if (this.theReport.ReportContent === null) {
        this.theReport.ReportContent = `\n\n於 ${twDate}通知${this.theProcedure.RequestingPhysicianName}醫師，${this.theProcedure.ProcedureCompleted}的${this.theProcedure.Modality}影像有異常報告。\n\n`
      } else {
        this.theReport.ReportContent =
          this.theReport.ReportContent +
          '\n\n' +
          `於 ${twDate}通知${this.theProcedure.RequestingPhysicianName}醫師，${this.theProcedure.ProcedureCompleted}的${this.theProcedure.Modality}影像有異常報告。\n\n`
      }
    },
    async getPersonalSetting() {
      try {
        const data = await getPersonalSetting(this.loginId)

        const setting = data ? JSON.parse(data) : {}
        const hotkeySettingArr = setting.hotkeySetting || []
        this.HotkeyListNew = this.FI0304HotkeyArr.map((item) => {
          const findSettingItem = hotkeySettingArr.find((settingItem) => settingItem.title === item.title)
          if (findSettingItem) {
            item.hotkey = findSettingItem.hotkey
          }
          return item
        })

        setting.hotkeySetting = this.HotkeyListNew
        Object.assign(this.personalSetting, setting)
      } catch (error) {
        console.log(error)
      }
    },
    async savePersonalSetting() {
      try {
        this.personalSetting.hotkeySetting = this.HotkeyListNew
        const data = await savePersonalSetting(this.loginId, this.personalSetting)
      } catch (error) {
        console.log(error)
      }
    },
    checkHotkeyMatch(items1, items2) {
      const check = items1.map((item1) => {
        return items2.map((item2) => item2.toLocaleUpperCase()).includes(item1.toLocaleUpperCase())
      })

      return items1.length === items2.length && !check.includes(false)
    },
    keydownHandler(evt) {
      this.keying = []

      if (this.keying.map((item) => item.toLocaleUpperCase()).includes(evt.key.toLocaleUpperCase())) {
        return
      }

      this.keying.push(evt.key)
      if (evt.altKey && !this.keying.includes('Alt')) this.keying.push('Alt')
      if (evt.ctrlKey && !this.keying.includes('Control')) this.keying.push('Control')
      if (evt.shiftKey && !this.keying.includes('Shift')) this.keying.push('Shift')

      // Shift + 任意鍵組合會自動觸發 keyup
      const add = () => {
        this.keyUpHandler = window.addEventListener(
          'keyup',
          () => {
            this.keyUpHandler = null
            if (evt.key === 'Shift') {
              add()
            } else {
              this.keying = []
            }
          },
          { once: true }
        )
      }

      if (!this.keyUpHandler) add()

      const hotkey = this.HotkeyListNew.find((item) => {
        return item.hotkey && item.hotkey.length > 0 ? this.checkHotkeyMatch(item.hotkey, this.keying) : false
      })

      if (hotkey) {
        evt.preventDefault()
        console.log(`[${hotkey.method}]`, hotkey.method)
        get(this, hotkey.method)()
        this.keying = []
      }
    },
    setHotKey(item) {
      this.seletedHotkeyItem = item
      this.keydownSettingHotkey = []
      this.$bvModal.show('WinHotkeyDetect0301')
      window.addEventListener('keydown', this.hotkeySettingKeydownHandler)
      window.removeEventListener('keydown', this.keydownHandler)
    },
    async saveHotkey() {

      if (
        this.HotkeyListNew.find((item) =>
          item.hotkey
            ? item.hotkey.join(',').toLocaleUpperCase() === this.keydownSettingHotkey.join(',').toLocaleUpperCase()
            &&
            item.hotkey.length
            : false
        )
      ) {
        this.SET_SIDE_MESSAGE({ msg: '此熱鍵已存在', type: 2 })
        return
      }

      if (!this.checkBlockHotkey) {
        this.SET_SIDE_MESSAGE({ msg: '此熱鍵無法被設置', type: 2 })
        return
      }

      this.seletedHotkeyItem.hotkey = this.keydownSettingHotkey
      this.savePersonalSetting()
      this.$bvModal.hide('WinHotkeyDetect0301')
    },
    removeHotkeySettingKeydownHandler() {
      window.addEventListener('keydown', this.keydownHandler)
      window.removeEventListener('keydown', this.hotkeySettingKeydownHandler)
    },
    hotkeySettingKeydownHandler(evt) {
      evt.preventDefault()

      if (this.isKeyingStop) {
        this.keydownSettingHotkey = []
        this.isKeyingStop = false
      }

      // Shift + 任意鍵組合會自動觸發 keyup
      const add = () => {
        this.keyUpHandler = window.addEventListener(
          'keyup',
          () => {
            this.keyUpHandler = null
            if (evt.key === 'Shift') {
              add()
            } else {
              this.isKeyingStop = true
            }
          },
          { once: true }
        )
      }
      if (!this.keyUpHandler) add()

      if (this.keydownSettingHotkey.map((item) => item.toLocaleUpperCase()).includes(evt.key.toLocaleUpperCase()))
        return
      else this.keydownSettingHotkey.push(evt.key)
    },
    deleteAllHotkey() {
      this.$bvModal
        .msgBoxConfirm('是否確定清除所有熱鍵', {
          cancelTitle: '取消',
          okTitle: '確定',
        })
        .then((val) => {
          if (val) {
            this.HotkeyListNew.forEach((item) => {
              item.hotkey = null
            })
            this.savePersonalSetting()
          }
        })
    },
    hisItemFocus(idx = 0, timer = 1000) {
      let el = document.getElementById('blkHistoryList')
      if (el) {
        setTimeout(() => {
          document.activeElement.blur()
          let element = document.getElementById(`dtc-history${idx}`)
          if (element) {
            element.focus()
          }
        }, timer)
      }
    },
    KeyWatch(evt) {
      if (evt.key === 'ArrowDown' && document.activeElement.id == `dtc-history${this.hisIndex}`) {
        // if(this.hisCount == 0){
        //   this.hisItemFocus(0, 200)
        // }else{
        //   if(this.hisIndex != this.historyList.length - 1){
        //     this.hisIndex++
        //     this.hisItemFocus(this.hisIndex, 200)
        //   }else{
        //     return false
        //   }
        // }

        if (this.hisIndex != this.historyList.length - 1) {
          this.hisIndex++
          this.hisItemFocus(this.hisIndex, 200)
        } else {
          return false
        }

        this.hisCount++
      }

      // if (evt.key === 'ArrowDown' && document.activeElement.id !== `DxRMain`) {
      //   if(this.hisIndex != this.historyList.length - 1){
      //       this.hisIndex++
      //       this.goNextHistory()
      //   }
      // }
      
      if (evt.key === 'ArrowUp' && document.activeElement.id == `dtc-history${this.hisIndex}`) {
        // if(this.hisCount == 0){
        //   this.hisItemFocus(0, 200)
        // }else{
        //   if(this.hisIndex != 0){
        //     this.hisIndex--
        //     this.hisItemFocus(this.hisIndex, 200)
        //   }
        // }

        if (this.hisIndex != 0) {
          this.hisIndex--
          this.hisItemFocus(this.hisIndex, 200)  
        } else {
          return false
        }

        this.hisCount++
      }

      // if (evt.key === 'ArrowUp' && document.activeElement.id !== `DxRMain`) {
      //   if(this.hisIndex != 0){
      //     this.hisIndex--
      //     this.goPrevHistory()
      //   }
      // }

    },
    // async SpaceWatch(evt) {
    //   if (evt.code === 'Space') {
    //     this.tempReplacement.tag = null
    //     this.tempReplacement.content = null

    //     if (this.DxReportContent) {
    //       let reg = /(?!\s)[a-zA-Z0-9]{1,}$/

    //       if (reg.test(this.DxReportContent)) {

    //         let matchResult = this.DxReportContent.match(reg)
    //         let count = 0
    //         let phrases = this.$store.state.phrase.private.concat(this.$store.state.phrase.public)

    //         if (phrases && phrases.length) {
    //           phrases.forEach((v) => {
    //             if (v.PhraseCode === matchResult[0] && count === 0) {
    //               this.tempReplacement.tag = v.PhraseCode
    //               this.tempReplacement.content = v.Replacement
    //               count++
    //             }
    //           })
    //         }
    //       }
    //     }
    //   }
    // },
    async SpaceWatch(evt) {
      if (evt.code === 'Space') {

        this.tempReplacement.tag = null
        this.tempReplacement.content = null

        if (this.DxReportContent) {
          let sltArea = this.$refs.reportPlainText
          let sltStart = sltArea.selectionStart
          // let sltEnd = sltArea.selectionEnd
          let txtBefore = this.DxReportContent ? this.DxReportContent.substring(0, sltStart) : ''
          let txtAfter = this.DxReportContent ? this.DxReportContent.substring(sltStart) : ''

          let phrases = this.$store.state.phrase.private.concat(this.$store.state.phrase.public)
          phrases = _.orderBy(phrases, [({PhraseCode:{length}})=> length, 'PhraseCode'], ['desc'])
          let count = 0

          if(this.isMphrase === 'Y'){
            if(phrases && phrases.length){
              phrases.forEach((v)=>{
                if(v.Modality === this.instantModality){
                  let preReg = /[^\w]/g
                  let result = v.PhraseCode.replace(preReg, ($)=>{
                    return '\\' + $
                  })
                  let reg = new RegExp(`(?<![^\\s]{1,})${result}$`)

                  if(reg.test(txtBefore) && count === 0){
                    console.log(`reg:`, reg)
                    count++
                    this.DxReportContent = txtBefore.replace(reg, v.Replacement) + txtAfter
                    let tempBefore = txtBefore.replace(reg, v.Replacement)
                    let textFocus = tempBefore
                    let newSelectPos = textFocus.length

                    this.$nextTick(() => {
                      this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
                      this.$refs.reportPlainText.focus()
                    })
                  }
                }
              })
            }
          }else{
            if(phrases && phrases.length){
              phrases.forEach((v)=>{
                let preReg = /[^\w]/g
                let result = v.PhraseCode.replace(preReg, ($)=>{
                  return '\\' + $
                })
                let reg = new RegExp(`(?<![^\\s]{1,})${result}$`)

                if(reg.test(txtBefore) && count === 0){
                    console.log(`reg:`, reg)
                    count++
                    this.DxReportContent = txtBefore.replace(reg, v.Replacement) + txtAfter
                    let tempBefore = txtBefore.replace(reg, v.Replacement)
                    let textFocus = tempBefore
                    let newSelectPos = textFocus.length

                    this.$nextTick(() => {
                      this.$refs.reportPlainText.selectionStart = this.$refs.reportPlainText.selectionEnd = newSelectPos
                      this.$refs.reportPlainText.focus()
                    })
                }
              })
            }
          }

        }
      }
    },
    async releaseReport(text = ''){
      if(localStorage['token'] && !this.lastRelease){
        console.log(`${text} (FI0301) ~`)
        await this.GetActionReportRelease()
      }
    },
    async UnloadWatch(e) {
      
      let result = confirm(e.returnValue)
      result.then(async (res) => {
        if(res){
          await this.releaseReport(`beforeunload`)
        }
      })
    },
    VisibleWatch(){
      if(!document.hidden){
        this.FocusOnContent(1000)
      }
    },
    async init() {
      this.getPersonalSetting()
      this.GetEmployees()
      this.GetOptionsRadiographer()
      this.getPacsThumbnail()
    },
  },
  async created() {

    this.continuousReportCode = this.getREPOValue()
    console.log(`fi0301~`)

    await this.initReport() // mixin report.js
    this.init()
  },
  beforeMount(){
    window.addEventListener('beforeunload', this.UnloadWatch)
    window.addEventListener('visibilitychange', this.VisibleWatch)
  },
  mounted() {
    if (this.theProcedure.ScreeningWarning > 0) {
      this.$bvModal.show('examination-for-805-dialog')
    }

    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keydown', this.KeyWatch)
    window.addEventListener('keydown', this.SpaceWatch)

    this.FocusOnContent()
  },
  async beforeRouteLeave(to, from, next) {
    await this.releaseReport(`beforeRouteLeave`)
    next()
  },
  async beforeDestroy() {
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keydown', this.KeyWatch)
    window.removeEventListener('keydown', this.SpaceWatch)
  },
  async destoryed(){
    window.removeEventListener('beforeunload', this.UnloadWatch)
    window.removeEventListener('visibilitychange', this.VisibleWatch)
  },
  watch: {
    'theReport.ReportContent': {
      handler(val) {
        if (val) {
          this.FocusOnContent(1100)
        }
      },
      immedaite: true,
      deep: true,
    },
    historyList: {
      handler(val) {
        if (val && val.length) {
          this.hisCount = 0
        }
      },
      immediate: true,
      deep: true,
    },
    isMphrase: {
      handler(newVal, oldVal) {
        if (
          oldVal
          &&
          newVal
          &&
          newVal !== oldVal
        ) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    // tempReplacement: {
    //   handler(val) {
    //     if (val && val.content) {
    //       // console.log(`tempReplacement (w)`, val)
    //       let reg = /(?!\s)[a-zA-Z0-9]{1,}$/
    //       this.DxReportContent = this.DxReportContent.replace(reg, val.content)
    //       // this.SET_SIDE_MESSAGE({ msg: `片語: ${val.tag ? val.tag : '無名'} 已插入~` })
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    // hisCount: {
    //   handler(val){
    //     console.log(`hisCount: `, val)
    //   },
    //   deep: true,
    //   immediate: true,
    // }
    // "theProcedure.Modality": {
    //   handler(val){
    //     if(val){
    //         console.log("this.theProcedure.Modality", this.theProcedure.Modality)
    //     }
    //   },
    //   immedaite: true,
    //   deep: true
    // }
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/reportStyle.scss';

.report-selected-images-area{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 0 0 0;
  width: 100%;
  overflow: auto;
  >.img-title{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
    padding: 0 6px;
    width: 100%;
    line-height: 24px;
    background: rgba(0,123,255,0.8);
    color: #fff;
    font-size: 14px;
    border-radius: 4px;

    .it-num{
      font-weight: bold; font-size: 16px;
    }

  }
  >.img-content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    height: 100px;
    overflow-y: scroll;
    
    >.img-item{
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #123456;
      background: #dddddd;
      position: relative;
      width: 100px;
      height: 100px;

      >.img-x{
        position: absolute;
        right: 0;
        top: 0;
        background: #fff;
        border-radius: 100%; cursor: pointer;
      }
    }
  }
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

.b-Hotkey-header{
  border-bottom: none;
}

</style>
