<template>
  <h3 class="router-title">{{ metaName }}</h3>
  <div class="grid grid-cols-3 gap-5 px-3 py-2 flex-1 main-content-video">
    <div class="col-span-1 left-side">
      <div class="frame h-full">
        <div class="title">
          <div class="w-9" />
          <div>視訊記錄清單</div>
          <div class="cursor-pointer font-black pr-5">
            <i class="pi pi-sort-alt" @click="sortItems" />
          </div>
        </div>

        <div class="video-list custom-scroll-bar">
          <div
            class="video-content"
            v-for="(item, index) in items"
            :key="index"
            :class="{
              even: index % 2 === 0,
              active: editVideo.FileName == item.FileName,
            }"
            @click="setEditVideo(item)"
          >
            <div
              class="video-image"
              :style="{ backgroundImage: `url(/assets/player.svg)` }"
            />
            <div class="video-word" :title="item.Remark">
              <div class="file-line1">
                <span class="file-word-prex">檔案:</span>
                <span class="file-word">{{ item.FileName || "" }}</span>
              </div>
              <div>
                <span class="file-word-prex">期間:</span>
                <span class="file-word">
                  {{ item.start || "" }} ~ {{ item.end || "" }}</span
                >
              </div>
              <!-- <div class="font-semibold">結束: {{ item.end || "" }}</div> -->
              <div>
                <span class="file-word-prex">影片刪除時間:</span>
                <span class="file-word">{{ item.deleteDate || "" }}</span>
              </div>

              <div class="text-yellow-700">
                <span class="file-word-prex">備註說明:</span>
                <span class="file-word2">{{ item.remark || "" }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-2 text-lg right-side custom-scroll-bar pr-1">
      <div class="flex flex-col">
        <div class="font-medium flex flex-wrap" style="color: #1c2a54">
          <div
            v-for="[key, value] in Object.entries(colNameObj)"
            class="px-1"
            :key="key"
          >
            <span>{{ value }}:</span>
            <span class="font-semibold mr-2">{{ itemData[key] || "" }}</span>
          </div>
          <!-- ---{{ itemData }}--{{ editItem }} -->
        </div>
        <div class="video flex-1" ref="videoFrame" v-if="editVideo.FileName">
          <video
            :title="editVideo.FileName"
            controls
            class="w-full"
            :key="`video${compontKey}`"
          >
            <source
              :src="editVideo.FileUrl"
              type="video/mp4"
              :key="`video${compontKey}`"
            />
          </video>
        </div>
        <div class="no-video-data" v-else>
          <div class="no-video-data-content">
            <div class="mb-2 no-video-data-content-line1" v-show="items.length">
              請選擇視訊紀錄檔案
            </div>
            <div class="no-video-data-content-line2" v-show="items.length">
              Select a video recording file.
            </div>
            <div
              class="mb-2 no-video-data-content-line1"
              v-show="!items.length"
            >
              暫無資料
            </div>
            <div class="no-video-data-content-line2" v-show="!items.length">
              No Data
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-start">
        <Button
          class="p-button-outlined p-button-info"
          @click="$router.push({ name: `${$route.query?.viewfrom}` })"
          >返回會診清單</Button
        >
      </div>

      <div class="relative">
        <TextArea
          title="視訊紀錄備註說明："
          v-model="editVideo.Remark"
          :class="
            !Boolean(editVideo.FileName) || !isSameInstitution
              ? 'avoid-clicks'
              : ''
          "
        />

        <Button
          label="重新輸入"
          class="p-button-secondary p-button-sm"
          style="position: absolute; top: 3px; right: 100px; height: 25px"
          @click="editVideo.Remark = ''"
          :disabled="!Boolean(editVideo.FileName) || !isSameInstitution"
        />
        <Button
          label="儲存"
          class="p-button-info p-button-sm"
          style="position: absolute; top: 3px; right: 30px; height: 25px"
          @click="saveVideoRecord(editVideo)"
          :disabled="!Boolean(editVideo.FileName) || !isSameInstitution"
        />
      </div>

      <div class="flex justify-end items-start">
        <Button
          class="p-button-success"
          @click="downloadVideo(editVideo)"
          :disabled="!Boolean(editVideo.FileName) || !isSameInstitution"
          ><i class="pi pi-download mr-2"></i> 下載此視訊</Button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { getVideoById, putVideoRecord } from "Service/apis.js";
import dayjs from "dayjs";
import { useToast } from "vue-toastification";
export default {
  props: {
    metaName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const toast = useToast();
    const videoFrame = ref();
    const videoSize = ref(null);
    const store = useStore();
    const editItem = ref({});
    const items = ref([]);
    const compontKey = ref(0);

    const colNameObj = {
      Name: "病患姓名",
      Age: "年齡",
      Birthday: "出生年月日",
      GenderCode: "性別",
      Identifier: "身分證號",
      patientSourceType: "就醫身分別",
      Area: "區域",
      FirstVisitMed: "初診科別",
    };
    const itemData = ref({
      Name: "",
      Age: "",
      Birthday: "",
      GenderCode: "",
      Identifier: "",
      patientSourceType: "",
      Area: "",
      FirstVisitMed: "",
      InstitutionNo: "",
    });

    function resizeVideoSize() {
      setTimeout(() => {
        videoSize.value = {
          width: videoFrame.value.clientWidth,
          height: videoFrame.value.clientHeight,
        };
      }, 100);
    }
    const getData = async (message = "") => {
      let { data } = await getVideoById(editItem.value.Id);
      data = data.map((s) => {
        s.time = s.FileName.split("_")[1].split(".")[0];
        s.start = dayjs(s.StartTime).format("YYYY-MM-DD HH:mm:ss");
        s.end = dayjs(s.EndTime).format("YYYY-MM-DD HH:mm:ss");
        s.deleteDate = dayjs(s.DeleteTime).format("YYYY-MM-DD HH:mm:ss");
        s.remark =
          Boolean(s.Remark) && s.Remark.length > 20
            ? `${s.Remark.substring(0, 20)}...`
            : s.Remark;
        return s;
      });
      data.sort((a, b) => {
        if (a.time < b.time) return 1;
        if (a.time > b.time) return -1;
      });

      items.value = data;

      if (message == "noneed") {
        return;
      }

      // if (data.length) {
      //   setEditVideo(data[0]);
      // }
    };

    const getAge = (dateString) => {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    onMounted(async () => {
      const obj = { ...store.state.editItem };
      editItem.value = { ...obj };
      itemData.value = { ...obj.Patient };

      switch (+obj.PatientSourceType) {
        case 1:
          obj.patientSourceType = "健保";

          break;
        case 2:
          obj.patientSourceType = "自費";
          break;
        case 0:
          obj.patientSourceType = `其他${obj.PatientSourceOtherType || ""}`;
          break;
        default:
          obj.patientSourceType = "";
      }
      itemData.value.patientSourceType = obj.patientSourceType;

      if (Boolean(obj.Patient.Birthday)) {
        itemData.value.Birthday = dayjs(obj.Patient.Birthday).format(
          "YYYY-MM-DD"
        );
        itemData.value.Age = getAge(obj.Patient.Birthday);
      }
      if (
        Boolean(obj.Patient.GenderCode) &&
        obj.Patient.GenderCode.includes("male")
      ) {
        itemData.value.GenderCode =
          obj.Patient.GenderCode == "female" ? "女" : "男";
      }

      await getData();
      // resizeVideoSize();
      window.addEventListener("resize", resizeVideoSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeVideoSize);
    });

    const editVideo = ref({
      FileName: "",
      Remark: null,
      SheetId: null,
    });

    const setEditVideo = (item) => {
      editVideo.value = { ...item };
      compontKey.value += 1;
    };

    const saveVideoRecord = async (item) => {
      const obj = {
        SheetId: item.SheetId,
        FileName: item.FileName,
        Remark: item.Remark,
      };
      try {
        const res = await putVideoRecord(obj);
        toast.success(`儲存成功`, {
          timeout: 3000,
          hideProgressBar: true,
        });
        getData("noneed");
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    const sortType = ref("negative");

    const sortItems = () => {
      if (sortType.value == "positive") {
        items.value.sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
        });
        sortType.value = "negative";
      } else {
        items.value.sort((a, b) => {
          if (a.time < b.time) return 1;
          if (a.time > b.time) return -1;
        });
        sortType.value = "positive";
      }
    };

    const downloadVideo = (item) => {
      if (!item.FileUrl) {
        toast.error("選擇要下載的視訊紀錄", {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }
      // window.open(item.fileUrl);
      // window.open(item.FileUrl);
      let link;
      link = document.createElement("a");
      link.setAttribute("href", item.FileUrl);
      link.setAttribute("download", item.FileName)
      link.click();
    };

    const isSameInstitution = computed(() => {
      const accountInstitutionNo = store.state?.others
        ? store.state?.others.InstitutionNo
        : "";

      return editItem.value.InstitutionNo == accountInstitutionNo;
    });

    return {
      itemData,
      colNameObj,
      videoFrame,
      videoSize,
      editItem,
      getData,
      items,

      editVideo,
      setEditVideo,
      saveVideoRecord,

      sortType,
      sortItems,

      compontKey,

      downloadVideo,
      isSameInstitution,
    };
  },
};
</script>

<style lang="scss" scoped>
.left-side {
  .title {
    @apply flex justify-between h-10 leading-10 text-xl font-semibold;
    background: #88b6e5;
    color: #fff;
    border: 1px #6c80ca solid;
    border-radius: 6px;
  }
  .frame {
    @apply bg-white shadow border border-blue-300 flex flex-col;
    border-radius: 10px;
  }
  .video-list {
    flex: 1 0 0;
    @apply overflow-y-auto divide-y divide-gray-300;
    > div.video-content {
      @apply cursor-pointer p-2 flex;
      &.even {
        background-color: #e7f2f3;
      }

      > div:nth-child(2) {
        @apply flex-1 ml-2;
      }
      &.active,
      &:hover {
        background-color: #d9e9fe;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

        @apply rounded-md;

        .video-word {
          .file-line1 {
            .file-word {
              // color: #041c79e0;
            }
          }
        }
      }
      .video-word {
        .file-line1 {
          .file-word {
          }
        }
      }
    }
  }
  .video-image {
    @apply w-32 h-24;
    background: transparent no-repeat center center / cover;
    border-radius: 8px;
  }
}
.right-side {
  @apply grid gap-4;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  // grid-gap: 35px;
  // grid-template-rows: minmax(200px, 1fr) auto;

  overflow: auto;
  .video {
    @apply bg-black;
  }
}
.main-content-video {
  // min-height: calc(100vh - 243px);
  height: calc(100vh - 217px);
}
.file-word-prex {
  // color: #373232;
  color: #514747;
  font-weight: 400;
  display: inline-block;
  margin-right: 3px;
  // font-size: 14px;
}
.file-word {
  color: #041c79bf;
  font-weight: 700;
  font-size: 14px;
}
.file-word2 {
  color: #041c79bf;
  font-weight: 900;
  font-size: 14px;
}
.no-video-data {
  border: 1px solid #d1d5db;
  height: 100%;
  position: relative;
  .no-video-data-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .no-video-data-content-line1 {
      // color: #5c6179;
      // color: #8d92ab;
      color: #7c7c7c;
      font-size: 24px;
    }
    .no-video-data-content-line2 {
      // color: #7f87b8;
      // color: #7c7c7ce8;
      // color: #7c7676e8;
      color: #041c79;
      font-size: 18px;
    }
  }
}
</style>
