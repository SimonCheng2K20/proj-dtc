<template>
  <div class="dialog" @click.stop="$emit('input',false)" v-if="value">
    <div class="dialogBox" :class="{'fullMode':fullMode}" @click.stop :style="{'width':width}">
      <div class="dialogBoxTitle">
        <div class="dialogBoxTitleText">{{title}}</div>
        <div class="dialogBoxTitleMenu">
          <i class="dialogBoxTitleMenuItem" :class="fullMode ? 'el-icon-copy-document':'el-icon-full-screen'" @click="fullMode=!fullMode" />
          <i class="dialogBoxTitleMenuItem el-icon-close" @click="$emit('input',false)" />
        </div>
      </div>
      <div class="dialogBoxContent">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value','title','width'],
  data() {
    return {
      fullMode:false
    }
  }
}
</script>