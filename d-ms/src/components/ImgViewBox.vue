<template>
  <div class="imgViewBox" v-if="data">
    <div class="imgViewBoxInfo">
      <el-row :gutter="10">
        <el-col :md="8">病歷號 : {{ data.PatientId }}</el-col>
        <el-col :md="8">姓名 : {{ data.Patient.Cname }}</el-col>
        <el-col :md="8">身分證號 : {{ data.Patient.Identifier }}</el-col>
      </el-row>
    </div>
    <div class="imgViewBoxMenu">
      <div class="imgViewBoxMenuList">
        <Button class="buttonColor-14 mr-1" @click="moveChoose({ key: 'ArrowUp' })">上一頁</Button>
        <div class="mr-1">{{ chooseImgNo + 1 }}/{{ imgList.length }}</div>
        <Button class="buttonColor-14 mr-1" @click="moveChoose({ key: 'ArrowDown' })">下一頁</Button>
        <img class="imgViewBoxMenuListItem" src="../assets/img/放大.png" @click="transform.scale += 0.2" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/縮小.png" @click="transform.scale -= 0.2" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/原圖.png" @click="preview" />
        <!--<img class="imgViewBoxMenuListItem" src="../assets/img/適高.png" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/適寬.png" />-->
        <img class="imgViewBoxMenuListItem" src="../assets/img/左90.png" @click="transform.rotate -= 90" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/右90.png" @click="transform.rotate += 90" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/上下切換.png" @click="transform.rotateX += 180" />
        <img class="imgViewBoxMenuListItem" src="../assets/img/左右切換.png" @click="transform.rotateY += 180" />
        <el-input-number v-model="transform.scale" :precision="2" :step="0.1"></el-input-number>
      </div>
    </div>
    <div class="imgViewBoxContent">

      <div class="imgViewBoxContentImageList" ref="imgViewBoxContentImageList" tabindex="0">
        <template v-for="(item, index) in imgList">
          <div :key="index">
            <div class="imgViewBoxContentImageListItem"
              :class="{ 'chooseImgNo': chooseImgNo !== null && index === chooseImgNo }" @click="chooseImg(index)">
              <img class="imgViewBoxContentImageListItemImage" :src="$api.baseURL + item.Attachment" />
            </div>
            <div class="imgViewBoxContentImageListItemNumber mb-1">{{ index + 1 }}/{{ imgList.length }}</div>
          </div>
        </template>
      </div>
      <div class="imgViewBoxContentView" @wheel="zoom">
        <div class="imgViewBoxContentViewBox">
          <img class="imgViewBoxContentViewBoxImage" :src="$api.baseURL + imgList[chooseImgNo].Attachment"
            v-if="chooseImgNo !== null"
            :style="{ 'transform': `scale(${transform.scale},${transform.scale}) rotate(${transform.rotate}deg) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`, 'top': `${transform.y}px`, 'left': `${transform.x}px` }"
            @mousedown.prevent="isDrag = true" @mouseup="isDrag = false" @mouseout="isDrag = false" @mousemove="move" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['info', 'type'],
  data() {
    return {
      data: null,
      imgList: [],
      chooseImgNo: null,
      isDrag: false,
      transform: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
      }
    }
  },
  async created() {
    await this.getData()
    document.addEventListener('keydown', this.moveChoose, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.moveChoose, false)
  },
  methods: {
    async getData() {
      this.$store.commit('loading', true)
      this.data = this.info

      if (this.type === 1) {
        const tempObj = {
          PatientId: this.info.PatientId,
          FolderId: this.info.FolderId,
          DocCategoryId: this.info.DocCategoryId,
        }
        this.imgList = await this.$api.getDocRecordImgGetAllImage(tempObj)
      }
      else {
        this.imgList = await this.$api.getDocArchiveImage({ $filter: `Id eq ${this.data.Id}` }).then(res => res.Items)
      }
      for (let item of this.imgList) {
        item.Attachment += '?time=' + new Date().getTime()
      }
      if (this.imgList.length) this.chooseImgNo = 0
      this.$nextTick(() => {
        this.reSort()
        this.$forceUpdate()
      })
      this.$store.commit('loading', false)
    },
    reSort() {
      this.imgList = this.imgList.sort((a, b) => a.Ord - b.Ord)
    },
    chooseImg(x) {
      this.transform.x = 0
      this.transform.y = 0
      this.transform.scale = 1
      this.transform.rotate = 0
      this.transform.rotateX = 0
      this.transform.rotateY = 0
      this.chooseImgNo = x
    },
    preview() {
      window.open(`${this.$api.baseURL}${this.imgList[this.chooseImgNo].Attachment}`)
    },
    zoom(e) {
      if (e.deltaY < 0) this.transform.scale += 0.2
      else this.transform.scale -= 0.2
    },
    move(e) {
      if (this.isDrag) {
        this.transform.x += e.movementX
        this.transform.y += e.movementY
      }
    },
    moveChoose(e) {
      this.$refs.imgViewBoxContentImageList.focus()
      if (e.key === 'ArrowDown') {
        console.log('ArrowDown')
        this.chooseImgNo++
        if (this.chooseImgNo >= this.imgList.length) this.chooseImgNo = 0
      }
      else if (e.key === 'ArrowUp') {
        console.log('ArrowUp')
        this.chooseImgNo--
        if (this.chooseImgNo < 0) this.chooseImgNo = this.imgList.length - 1
      }
    }
  }
}
</script>