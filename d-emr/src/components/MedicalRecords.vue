<template>
  <CardBox class="cardBoxType5" ref="cardBoxType5" v-if="data">
    <Dialog title="系統提示" v-model="sysInfoBox" :width="'30vw'">
      <p style="padding: 20px 0; text-align: center">請勾選項目!</p>
      <Button @click="sysInfoBox = false" style="color: #000000">確定</Button>
    </Dialog>

    <template #header>
      <div class="cardBoxTitle" style="font-size: 15px">
        <i class="el-icon-user-solid" />
        病患姓名：{{ data.personData.PatientName }}
        <el-divider direction="vertical"></el-divider>
        性別：{{ data.personData.PatientSex }}
        <el-divider direction="vertical"></el-divider>
        病患身份證字號：{{ data.personData.SheetIndexIdNo }}
        <el-divider direction="vertical"></el-divider>
        病歷號：{{ data.personData.ChartNo }}
        <el-divider direction="vertical"></el-divider>
        <!-- 生日：{{ $global.YYYYMMDD(data.data.SheetIndexPatientBirthDate) }} -->
        生日：{{ $global.YYYYMMDD(data.personData.SheetIndexPatientBirthDate) }}
      </div>
    </template>

    <div class="cus-el-col">
      <div class="content-MR">
        <el-tabs v-model="activeName" type="card" v-if="data.data" style="width: 100%">
          <el-tab-pane
            v-for="tab in tabs.filter((tab) => table[tab.name].length > 0)"
            :key="tab.name"
            :name="tab.name"
            :label="tab.label"
          ></el-tab-pane>
        </el-tabs>
        <div class="tablebox-MR max2048">
          <el-table
            class="mb-1"
            :data="table[activeName]"
            border
            stripe
            style="width: 100%"
            :row-class-name="getRowClass"
            @selection-change="handleSelectionChange"
          >
            <el-table-column width="60px" align="center" type="expand">
              <template slot-scope="props">
                <el-table class="mb-1" :data="props.row.subList" border stripe style="width: 100%" :show-header="false">
                  <el-table-column label="紀錄" width="120px" align="center">
                    <template slot-scope="scope">
                      <Button class="sm buttonColor-1" @click="previewPDF(scope.row.SheetArchiveOid)">預覽</Button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="SheetRevisionNo" label="版本" sortable>
                    <template slot-scope="scope">
                      {{ scope.row.SheetRevisionNo }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="SheetName" label="單張名稱" width="160px" sortable></el-table-column>
                  <el-table-column prop="SpotCheck" label="抽審" width="160px" sortable>
                    <template slot-scope="scope">
                      {{ scope.row.SpotCheck ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="SheetDate" label="病歷完成日期" width="160px" sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.SheetDate">
                        {{ $global.YYYYMMDD(scope.row.SheetDate.slice(0, 8)) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="SignatureDate" label="簽章時間" width="160px" sortable>
                    <template slot-scope="scope">
                      <div v-if="scope.row.SignatureDate">
                        {{ $global.YYYYMMDD(scope.row.SignatureDate.slice(0, 8)) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="SignerUserId" label="病歷確認者代碼" width="160px" sortable></el-table-column>
                  <el-table-column prop="Author" label="病歷確認者" width="160px" sortable></el-table-column>
                  <el-table-column prop="SignerUserId" label="簽章者代碼" width="160px" sortable></el-table-column>
                  <el-table-column prop="SignerName" label="簽章者姓名" width="160px" sortable></el-table-column>
                  <el-table-column prop="PatientAge" label="年齡" width="160px" sortable>
                    <template>
                      {{
                        data.data && data.data[0] && data.data[0].SheetIndexPatientBirthDate
                          ? getAge(data.data[0].SheetIndexPatientBirthDate)
                          : ''
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="備註" width="160px" sortable></el-table-column>
                  <el-table-column prop="SheetId" label="單張編號" width="160px" sortable></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="60px" align="center"></el-table-column>
            <el-table-column prop="SheetRevisionNo" width="100px" label="版本" sortable></el-table-column>
            <el-table-column prop="SheetName" label="單張名稱" width="160px" sortable></el-table-column>
            <el-table-column prop="SpotCheck" label="抽審" width="160px" sortable>
              <template slot-scope="scope">
                {{ scope.row.SpotCheck ? '是' : '否' }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="筆數" width="160px" sortable></el-table-column> -->
            <el-table-column prop="SheetDate" label="病歷完成日期" width="160px" sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.SheetDate">
                  {{ $global.YYYYMMDD(scope.row.SheetDate.slice(0, 8)) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="SignatureDate" label="簽章時間" width="160px" sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.SignatureDate">
                  {{ $global.YYYYMMDD(scope.row.SignatureDate.slice(0, 8)) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="SignerUserId" label="病歷確認者代碼" width="160px" sortable></el-table-column>
            <el-table-column prop="Author" label="病歷確認者" width="160px" sortable></el-table-column>
            <el-table-column prop="SignerUserId" label="簽章者代碼" width="160px" sortable></el-table-column>
            <el-table-column prop="SignerName" label="簽章者姓名" width="160px" sortable></el-table-column>
            <el-table-column prop="PatientAge" label="年齡" width="100px" sortable>
              <template>
                {{
                  data.data && data.data[0] && data.data[0].SheetIndexPatientBirthDate
                    ? getAge(data.data[0].SheetIndexPatientBirthDate)
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column prop="date" label="備註" width="160px" sortable></el-table-column>
            <el-table-column prop="SheetId" label="單張編號" width="160px" sortable></el-table-column>
          </el-table>
        </div>
        <div class="toolbox-MR">
          <div class="action-row">
            <a class="action-btn-a" href="javascript:;" title="預覽">
              <img
                src="../assets/img/svg/browse.svg"
                @click="
                  () => {
                    if (multipleSelection && multipleSelection.length) {
                      previewPDF()
                    } else {
                      showErrBox()
                    }
                  }
                "
              />
            </a>
            <a class="action-btn-a" href="javascript:;" title="列印">
              <img
                src="../assets/img/svg/print.svg"
                @click="
                  () => {
                    if (multipleSelection && multipleSelection.length) {
                      editPDF()
                    } else {
                      showErrBox()
                    }
                  }
                "
              />
            </a>
            <a class="action-btn-a" href="javascript:;" title="註銷">
              <img src="../assets/img/svg/remove.svg" @click="onDeleteClick" />
            </a>
            <a class="action-btn-a" href="javascript:;" title="PDF">
              <img
                src="../assets/img/svg/pdf.svg"
                @click="
                  () => {
                    if (multipleSelection && multipleSelection.length) {
                      downloadPDF(multipleSelection)
                    } else {
                      showErrBox()
                    }
                  }
                "
              />
            </a>
            <a class="action-btn-a" href="javascript:;" title="抽審">
              <img
                src="../assets/img/svg/certificate.svg"
                @click="
                  () => {
                    if (multipleSelection && multipleSelection.length) {
                      sampling(multipleSelection)
                    } else {
                      showErrBox()
                    }
                  }
                "
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogShow" title="是否確定註銷" show-close @close="onHide">
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-11 mr-1" @click="onHide">取消</Button>
        <Button class="buttonColor-1 mr-1" @click="onDeleteClick">儲存</Button>
      </div>
    </el-dialog>
  </CardBox>
</template>

<script>
import moment from 'moment'
import CardBox from '@/components/CardBox.vue'

export default {
  components: { CardBox },
  props: ['personData', 'data'],
  data() {
    return {
      dialogShow: false,
      showPreviewBox: false,
      pdfURL: null,
      previewInfo: null,
      activeName: null,
      multipleSelection: [],
      canDelete: false,
      sysInfoBox: false,

      tabs: [
        {
          label: '門診病歷',
          name: 'SHEET_TYPE_OID_013',
        },
        {
          label: '影像報告',
          name: 'SHEET_TYPE_OID_001',
        },
        {
          label: '出院病摘',
          name: 'SHEET_TYPE_OID_002',
        },
        {
          label: '檢驗報告',
          name: 'SHEET_TYPE_OID_003',
        },
        {
          label: '檢驗報告',
          name: 'SHEET_TYPE_OID_015',
        },
      ],
    }
  },
  watch: {
    'data.data'() {
      this.initActiveName()
    },
  },
  computed: {
    table() {
      const table = this.tabs.reduce((tableObj, tab) => {
        const arr = this.data.data
          .filter((sheet) => sheet.SheetTypeOid === tab.name)
          .sort((a, b) => {
            if (a.SheetRevisionNo > b.SheetRevisionNo) return -1
            if (b.SheetRevisionNo > a.SheetRevisionNo) return 1
            return 0
          })
          .reduce((arr, currentSheet) => {
            const find = arr.find((sheet) => sheet.CustomPk === currentSheet.CustomPk)
            if (find) {
              find.subList.push(currentSheet)
            } else {
              arr.push({ ...currentSheet, subList: [] })
            }

            return arr
          }, [])

        tableObj[tab.name] = arr
        return tableObj
      }, {})

      return table
    },
  },
  methods: {
    getAge(date) {
      let currentDate = moment()
      let birthDate = moment(date, 'YYYYMMDD')
      let difference = currentDate - birthDate
      let age = Math.floor(difference / 31557600000)
      return age
    },
    async previewPDF(x) {
      this.$store.commit('loading', true)

      //multiple files
      let tempArr = []
      this.multipleSelection.forEach((v, i) => {
        tempArr[i] = v.SheetArchiveOid
      })

      let fileData = []

      if (x) {
        fileData = await this.$api.postSheetArchiveExport([x])
      } else {
        fileData = await this.$api.postSheetArchiveExport(tempArr)
      }

      this.pdfURL = window.URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
      window.open(this.pdfURL + `#toolbar=0`)
      this.$store.commit('loading', false)
    },
    async editPDF(x) {
      this.$store.commit('loading', true)

      let tempArr = []
      this.multipleSelection.forEach((v, i) => {
        tempArr[i] = v.SheetArchiveOid
      })

      let fileData = []

      if (x) {
        fileData = await this.$api.postSheetArchiveExport([x])
      } else {
        fileData = await this.$api.postSheetArchiveExport(tempArr)
      }

      this.pdfURL = window.URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }))
      window.open(this.pdfURL)
      this.$store.commit('loading', false)
    },
    toDownload(url) {
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('target', '_blank')
      link.click()
    },
    //downloadPDF
    async downloadPDF(x) {
      this.$store.commit('loading', true)

      console.log(`downloadPDF: `, x[0].SheetId)

      //multiple files
      let tempArr = []
      this.multipleSelection.forEach((v, i) => {
        tempArr[i] = v.SheetArchiveOid
      })
      let fileData = await this.$api.postSheetArchiveExport(tempArr)

      const url = window.URL.createObjectURL(new Blob([fileData]))
      this.openDownload(url, `signatureReport_${x[0].SheetId}.pdf`)
      this.$store.commit('loading', false)
    },
    openDownload(url, name) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    async deleteSheetArchive() {
      this.$store.commit('loading', true)

      try {
        const tasks = this.multipleSelection.map((item) => this.$api.delSheetArchive(item.SheetArchiveOid))
        await Promise.all(tasks)
        this.$message.success('註銷成功')
        this.dialogShow = false
        this.currentItem = null
        this.$emit('refresh')
      } catch (error) {
        this.$message.error('註銷失敗')
      } finally {
        this.$store.commit('loading', false)
      }
    },
    onHide() {
      this.dialogShow = false
      this.currentItem = null
    },
    onDeleteClick(row) {
      this.currentItem = row
      this.dialogShow = true
    },

    async sampling() {
      try {
        this.$store.commit('loading', true)

        let tempArr = []
        this.multipleSelection.forEach((v, i) => {
          tempArr[i] = {
            SheetArchiveOid: v.SheetArchiveOid,
            SpotCheck: true,
          }
        })

        await this.$api.postSheetSetSpotCheck(tempArr)
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.$emit('refresh')
        this.$store.commit('loading', false)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showErrBox() {
      this.sysInfoBox = true
    },
    getRowClass(row) {
      let data = row.row
      let res = []
      if (data.subList && data.subList.length > 0) {
        res.push('row-expand-has')
        return res
      } else {
        res.push('row-expand-no')
        return res
      }
    },
    initActiveName() {
      const find = Object.entries(this.table).find((keyValueArr) => keyValueArr[1].length > 0)
      this.activeName = find[0]
    },
  },
  async created() {
    this.initActiveName()
  },
  async mounted() {
    if (this.$store.state.userData && this.$store.state.userData.IsRecordManager) {
      this.canDelete = true
    }
  },
}
</script>
<style lang="scss" scoped>
.action-row {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 24px;
  gap: 12px;
  .action-btn-a {
    max-width: 40px;
    max-height: 40px;
    cursor: pointer;

    &:hover {
      -webkit-animation: scale-down-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
      animation: scale-down-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  }
}
</style>
