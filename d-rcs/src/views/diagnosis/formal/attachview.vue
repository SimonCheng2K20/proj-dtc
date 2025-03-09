<template>
  <div class="attachmaintain">
    <div class="main-grid p-2 flex-1 main-content">
      <div class="col-span-1">
        <div class="border rounded-lg border-blue-300 overflow-hidden h-full flex flex-col">
          <div class="list-title" title="僅限會診單建立的單位可新增、刪除附件">
            附件總覽清單
            <span>
              <Button icon="pi pi-plus" label="新增附件" class="p-button-warning add-button" @click.stop="showEditModal(1)"
                :disabled="!isSameInstitution" />
            </span>
          </div>

          <div class="overflow-y-auto custom-scroll-bar px-1" style="flex: 1 0 0">
            <tableField :columns="columns" :itemsData="itemsData" :isLocal="false" :showPagination="false"
              thSize="text-md">
              <template v-slot:custom1="{ params }">
                <button class="attach-button" type="button" style="background: #fc5792"
                  @click.stop="showEditModal(3, params.item)"
                  :disabled="!isSameInstitution"
                  :style="!isSameInstitution ? 'background: rgb(252 87 146 / 75%)' : ''"
                  v-if="!checkDicom(params.item.Id)">
                  刪除
                </button>
                <button class="attach-button" type="button" style="background: #7f57f2"
                  @click.stop="showEditModal(2, params.item)">檢閱</button>
              </template>
            </tableField>
          </div>
        </div>
      </div>

      <div class="col-span-2 text-lg flex flex-col">
        <div class="basic-info">
          <div class="font-medium" style="color: #1c2a54">
            <span>病患姓名:</span>
            <span class="font-semibold mr-2">{{ patientInfo.Name || ' ' }}</span>
            <span>性別:</span><span class="font-semibold mr-2">{{ patientInfo.GenderCode || ' ' }}</span>
            <span>年齡:</span><span class="font-semibold mr-2">{{ patientInfo.Age || ' ' }}歲</span>
            <span>出生年月日:</span><span class="font-semibold mr-2">{{ patientInfo.BirthDate || ' ' }}</span>
            <span>身分證號:</span><span class="font-semibold mr-2">{{ patientInfo.Identifier || ' ' }}</span>
            <br />
            <span>就醫身分別:</span><span class="font-semibold mr-2">{{
                patientInfo.PatientSourceType == 1
                  ? '健保'
                  : patientInfo.PatientSourceType == 2
                    ? '自費'
                    : patientInfo.PatientSourceType == 0
                      ? `其他_${patientInfo.PatientSourceOtherType || ''}`
                      : ''
            }}</span>
            <span>區域:</span><span class="font-semibold mr-2">{{ patientInfo.Area || ' ' }}</span>
            <span>初診科別:</span><span class="font-semibold mr-2">{{ patientInfo.FirstVisitMed || ' ' }}</span>
          </div>
        </div>

        <div class="rounded-md flex-1 flex flex-col attch-file-view" style="border: 1px solid #b3c0e7">
          <div class="px-2 py-2 text-center text-2xl">附件檢視: {{ modalItem.FileName || '' }}</div>
          <div class="text-right pr-3 text-sm">
            {{ modalItem.CreateTime ? modalItem.CreateTime.split('T')[0] : '' }}
          </div>
          <div class="attch-file-view-img custom-scroll-bar" style="height: calc(100vh - 190px); overflow: auto"
            @click="openImg(modalItem.FilePath)" :style="Boolean(modalItem.FilePath) ? 'cursor: pointer' : ''">
            <img style="width: 100%" v-show="modalItem.FilePath && !modalItem.FilePath.includes('pdf')"
              :src="modalItem.FilePath" />
          </div>
        </div>
      </div>
    </div>

    <!-- //EditModal -->
    <Dialog v-model:visible="editModal" :style="nowType == 3 ? 'width: 700px' : 'width: 980px'" :draggable="false"
      :modal="true" class="custom-modal">
      <template #header>
        <h3>
          {{ nowType == 1 ? '新增附件' : nowType == 2 ? '編輯附件' : '刪除附件' }}
        </h3>
      </template>
      <section>
        <div class="about" v-show="false">
          <input id="file-upload" type="file" @change="fileChange($event)" ref="inputFile"
            accept="image/bmp,image/x-bmp,image/jpeg,image/png,.pdf" />
        </div>
        <div class="modal-main-content" v-if="nowType == 1 || nowType == 2">
          <div class="left-img" @click="selectFile('file1')">
            <img src="/assets/upload.png" />
          </div>
          <div class="right-list">
            <header class="right-main-content">
              <div>操作</div>

              <div>檔名</div>
              <div>檔案類型</div>
            </header>
            <section class="right-main-content mt-3" v-if="currentFileType">
              <div style="padding: 9px 0">
                <Button style="height: 25px" @click="clearFile2">刪除</Button>
              </div>

              <InputText v-model.trim="currentFileName" placeholder="請輸入檔案名稱" />
              <div>{{ currentFileType || '' }}</div>
            </section>
          </div>
        </div>
        <div class="modal-main-content" v-else style="grid-template-columns: 110px 1fr">
          <div>
            <img class="mt-4 mr-2 float-right w-9" src="/assets/notice-icon2.png" />
          </div>
          <div class="delete-main-content">
            <div>是否確定要刪除此附件?</div>
            <div>檔名: {{ modalItem.FileName || '' }}</div>
          </div>
        </div>
      </section>

      <template #footer>
        <Button v-if="nowType == 1 || nowType == 2" label="確定新增" @click="saveEditModal" />
        <Button v-else label="確定刪除" @click="saveEditModal" class="p-button-danger" />
        <Button label="取消" class="p-button-success" @click="editModal = false" />
      </template>
    </Dialog>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import tableField from 'comps/datafields/tables.vue'
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import { getSheetById, addAttach, deleteAttach, getDicomFile } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import { cloneDeep, groupBy } from 'lodash'
export default {
  components: { tableField },
  setup() {
    const toast = useToast()
    const store = useStore()
    const editItem = ref({}) //from List Data

    const columns = [
      { key: 'custom1', label: '操作', type: 'text', width: '185px' },
      { key: 'FileName', label: '檔名', type: 'text' },
      { key: 'CreateTime', label: '建立日期', type: 'text', width: '136px' },
      { key: 'Type', label: '檔案類型', type: 'text', width: '90px' },
    ]

    const patientInfo = ref({
      name: '',
      age: '',
      birthday: '',
      gender: '',
      id: '',
      medicalType: '',
      area: '',
      firstVisitDepartment: '',
      remark: '',
    }) //patientData

    const itemsData = reactive({
      items: new Array(0).fill(1).map((v, i) => ({
        fileName: `附件檢視${v + i}`,
        createDate: dayjs()
          .add(30 - Math.floor(Math.random() * 60), 'day')
          .format('YYYY-MM-DD'),
        fileType: 'PDF',
      })),
      total: 0,
    }) //fileList

    const dicomInit = {
      CreateAccountNo: null,
      CreateTime: null,
      FileName: null,
      FilePath: null,
      Id: null,
      Type: null,
    }

    const dicomData = reactive({
      items: []
    })
    const dicomItems = ref(cloneDeep(dicomData.items))

    const checkDicom = (item) => {
      const reg = /^dicom_/
      return reg.test(item)
    }

    const dicomCount = reactive({
      count: 0
    })

    async function getData() {
      let { data } = await getSheetById(editItem.value.Id)

      // console.log(data)

      data.Patient.BirthDate = data.Patient.Birthday ? dayjs(data.Patient.Birthday).format('YYYY-MM-DD') : ''

      patientInfo.value = { ...data.Patient }
      // console.log("data.", data.InstitutionNo);
      patientInfo.value.InstitutionNo = data.InstitutionNo
      patientInfo.value.PatientSourceType = data.PatientSourceType
      patientInfo.value.PatientSourceOtherType = data.PatientSourceOtherType
      patientInfo.value.FirstVisitMed = data.Patient.FirstVisitMed
      patientInfo.value.Age = data.PatientAge ? data.PatientAge : ''

      data.Attaches = data.Attaches.map((s) => {
        s.CreateTime = s.CreateTime ? dayjs(s.CreateTime).format('YYYY-MM-DD') : ''
        return s
      })

      // Dicom
      let resDicom = await getDicomFile(editItem.value.Id)

      if (resDicom.status === 200 && dicomCount.count === 0) {

        // console.log(resDicom.data)

        dicomCount.count++

        if (resDicom.data.length) {

          resDicom.data.forEach((v, i) => {

            if (v.DicomFiles.length) {
              v.DicomFiles.forEach((w, j) => {

                let tempObj = cloneDeep(dicomInit);
                let tempReg = /\/(\w+).dcm$/
                let tempNo = w.Dicom.match(tempReg)
                let tempTag = 'dicom_'
                
                tempObj.CreateAccountNo = v.AccountNo
                tempObj.CreateTime = dayjs(new Date().getTime()).format('YYYY-MM-DD')
                tempObj.FileName = tempReg.test(w.Dicom) ? tempNo[1] : new Date().getTime()
                tempObj.FilePath = w.Jpeg
                tempObj.Id = tempReg.test(w.Dicom) ? tempTag + tempNo[1] : tempTag + new Date().getTime()
                tempObj.Type = 'jpeg'

                dicomItems.value.push(tempObj)
              })
            }
          })
        }

      }

      const dicomItemsTemp = cloneDeep(dicomItems.value)

      // itemsData.items = [...data.Attaches]
      itemsData.items = [...new Set([...dicomItemsTemp, ...data.Attaches])]

      console.log(itemsData.items)
    }

    // ---modalItem---

    const editModal = ref(false)
    const nowType = ref(1)
    const modalItem = ref({})

    const file1 = ref('')
    const currentFile = ref('')
    const currentFileName = ref('')
    const currentFileType = ref('')

    function clearFile() {
      //put the file in it
      currentFile.value = ''
      currentFileName.value = ''
      currentFileType.value = ''
    }

    function clearFile2() {
      //put the file in it
      currentFile.value = ''
      currentFileName.value = ''
      currentFileType.value = ''
      document.getElementById('file-upload').value = ''
    }

    async function showEditModal(type, item) {
      //type- 1新增、2檢閱、3刪除

      if (type == 3) {
        modalItem.value = { ...item }

        nowType.value = type
        editModal.value = true
      } else if (type == 1) {
        clearFile()
        nowType.value = type
        editModal.value = true
      } else {
        modalItem.value = { ...item }

        if (modalItem.value.FilePath.includes('pdf')) {
          window.open(modalItem.value.FilePath)
        }
      }
    }

    async function saveEditModal() {
      try {
        if (nowType.value == 1) {
          if (!Boolean(currentFileName.value)) {
            toast.error('請先選擇檔案', {
              timeout: 5000,
              hideProgressBar: true,
            })
            return
          }

          let form = new FormData()
          form.append('SheetId', editItem.value.Id)
          form.append('FileName', '' + currentFileName.value)
          form.append('File', currentFile.value)
          console.log('form', currentFile.value, form)
          const res = await addAttach(form)
        }

        if (nowType.value == 3) {
          // console.log("ssss", modalItem.value);
          await deleteAttach(modalItem.value.Id)
          modalItem.value = {}
        }

        editModal.value = false
        await getData()
        toast.success(`附件更新成功`, {
          timeout: 2000,
          hideProgressBar: true,
        })
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    function selectFile() {
      document.getElementById('file-upload').click()
    }

    function fileChange(e) {
      currentFile.value = e.target.files[0]
      currentFileName.value = Boolean(e.target.files[0]) ? e.target.files[0].name.split('.')[0] : ''
      currentFileType.value = Boolean(e.target.files[0]) ? e.target.files[0].type : ''
    }
    const isSameInstitution = computed(() => {
      const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''

      return patientInfo.value.InstitutionNo == accountInstitutionNo
    })

    const openImg = (url = null) => {
      if (!Boolean(url)) {
        return
      }
      window.open(url)
    }

    watch(
      () => store.state.editItem,
      (val) => {
        console.log(val)
        editItem.value = { ...store.state.editItem }
      },
      {
        immediate: true,
        deep: true,
      }
    )

    const init = async () => {
      editItem.value = { ...store.state.editItem }
    }

    init()
    
    // onMounted(async () => {
    //   editItem.value = { ...store.state.editItem }
    //   // await getData();
    // })

    return {
      patientInfo,
      columns,
      itemsData,
      getData,

      // ---modalItem---
      editModal,
      nowType,
      modalItem,
      file1,
      currentFileName,
      currentFileType,

      showEditModal,
      saveEditModal,

      selectFile,

      clearFile,
      clearFile2,

      currentFile,
      fileChange,

      isSameInstitution,
      openImg,
      checkDicom,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-grid {
  display: grid;
  grid-template-columns: 650px 1fr 1fr;
  grid-column-gap: 10px;
}

.attachmaintain {
  // @apply flex-1 flex flex-col;
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
}

.list-title {
  // @apply text-center h-10 leading-10 text-xl font-semibold;
  height: 2.5rem;
  text-align: center;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  line-height: 2.5rem;
  // original
  color: #2a375c;
  background: #f1f9e8;
  position: relative;
}

.add-button {
  border: 1px solid #593a11;
  height: 31px;
  position: absolute;
  right: 12px;
  top: 5px;
}

.attach-button {
  // @apply text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 1;
  color: rgba(255, 255, 255, 1);
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  &.disabled {
    background-color: gray !important;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.basic-info {
  // @apply flex justify-between items-start;
  display: flex;
  align-items: flex-start;
  justify-content: space-between
}

.modal-main-content {
  display: grid;
  grid-template-columns: 190px 1fr;
  padding: 10px;
  grid-column-gap: 20px;

  .left-img {
    width: 190px;
    border: 1px dashed #8cadef;
    border-radius: 6px;
    cursor: pointer;
  }

  .right-list {
    .right-main-content {
      display: grid;
      grid-template-columns: 120px 380px 1fr;

      >div {
        border: 1px solid rgb(255, 255, 255);
        border-bottom: none;
        border-right: none;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        font-size: 14px;
        padding: 8px 0;
        height: 52px;
        text-align: center;
      }

      >div:nth-child(4n) {
        border-right: 1px solid rgb(255, 255, 255);
      }
    }

    header {
      background: #e9e9e9;
      color: #364265;
      font-weight: 700;

      >div {
        padding-top: 12.5px !important;
      }
    }

    section {
      // background: #ecf6ff1c;
      color: #213474;
      font-weight: 600;
    }
  }

  .delete-main-content {
    color: #364265;
    font-weight: 600;
    font-size: 22px;
  }
}

.main-content {
  min-height: calc(100vh - 243px);
}
</style>
