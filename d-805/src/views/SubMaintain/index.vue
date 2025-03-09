<template>
  <div class="class-report">

    <div class="p-1">
      <div class="mb-1">
        <page-title
          title="次專科樣版維護作業"
          img="file-alt"
        >
          <div class="ml-auto">
            <b-button
              v-if="!wholeItems"
              @click="createNewItems"
              size="sm"
            >
              <font-awesome-icon icon="plus" />
              新增
            </b-button>

            <template v-if="wholeItems && !isPreview">
              <b-button
                variant="primary"
                size="sm"
                class="mr-1"
                @click="changeMode('preview')"
              >
                <font-awesome-icon icon="eye" />
                預覽
              </b-button>

              <b-button
                variant="warning"
                size="sm"
                class="mr-1"
                @click="editShopEvent('clearValue')"
              >
                <font-awesome-icon icon="eraser" />
                清除資料
              </b-button>

              <b-button
                variant="primary"
                size="sm"
                class="mr-1"
                @click="editShopEvent('addRow')"
              >
                <font-awesome-icon icon="plus-square" />
                新增欄位
              </b-button>

              <b-button
                v-if="localItems && localItems.source && localItems.source.length > 0"
                size="sm"
                class="mr-1"
                variant="danger"
                @click="editShopEvent('saveItems', false)"
              >
                <font-awesome-icon icon="save" />
                保存編輯
              </b-button>
              <b-button
                v-if="localItems && localItems.source && localItems.source.length > 0"
                size="sm"
                class="mr-1"
                variant="danger"
                @click="editShopEvent('saveItems', true)"
              >
                <font-awesome-icon icon="save" />
                保存離開
              </b-button>
              <b-button
                v-if="localItems && localItems.source && localItems.source.length > 0 && localItems.isOld"
                size="sm"
                variant="danger"
                @click="editShopEvent('saveAnotherItems')"
              >
                <font-awesome-icon icon="sign-out-alt" />
                另存編輯
              </b-button>

            </template>

            <template v-if="wholeItems && isPreview">
              <b-button
                size="sm"
                variant="primary"
                @click="changeMode('edit')"
              >
                <font-awesome-icon icon="eye-slash" />
                取消預覽
              </b-button>
            </template>

            <b-button
              class="ml-1"
              v-if="wholeItems"
              size="sm"
              variant="danger"
              @click="closeEditing"
            >
              <font-awesome-icon icon="window-close" />
              關閉
            </b-button>

          </div>

        </page-title>
      </div>

      <template v-if="wholeItems">
        <preview-shop
          ref="previewShop"
          v-if="isPreview"
          :items="wholeItems"
          :insts="get_InstitutionList"
          v-on:cancel="clearWholeItems"
          v-on:editItem="changeMode('edit')"
        />
        <edit-shop
          ref="editShop"
          v-else
          :items="wholeItems"
          :insts="get_InstitutionList"
          :usedTemps="usedTemplate"
          v-on:cancel="clearWholeItems"
          v-on:refresh="getTemplateList"
          v-on:previewItem="changeMode('preview')"
        />
      </template>

      <table-list
        v-else
        :items="tempList"
        v-on:editSecs="editSecs"
        v-on:reviewSecs="reviewSecs"
        v-on:remove="removeTemplate"
      />

    </div>
  </div>
</template>

<script>
import editShop from "./editShop";
import previewShop from "./previewShop";
import { getCstList, deleteCstData } from "@/assets/service/dataManager.js";

import tableList from './tableList';
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  data () {
    return {
      wholeItems: null,
      defaultColumn: () => ({ label: null, append: null, span: 1, key: null, type: null, value: "", isFinish: false, isReadOnly: false, createTime: new Date().getTime() }),
      tempList: [],
      isPreview: false,
      isMounted: false
    };
  },
  computed: {
    ...mapGetters(['get_InstitutionList', 'getThemeColors']),
    usedTemplate () {
      return this.tempList.length === 0
        ? []
        : this.tempList.map(({ reportId, InstitutionId }) => ({ reportId, InstitutionId }));
    },
    localItems () {
      // return this.wholeItems && !this.isPreview && !this.$refs['editShop']
      //   ? null
      //   : this.$refs['editShop'].localItems;
      return this.isMounted && this.$refs['editShop']
        ? this.$refs['editShop'].localItems
        : {};
    }
  },
  methods: {
    ...mapActions(['action_InstitutionList']),
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING']),
    createNewItems () {
      this.wholeItems = {
        reportTitle: '',
        reportId: '',
        CSTVersion: '',
        institution: '',
        source: [],
        isOld: false
      };
    },
    changeMode (mode) {
      this.isPreview = mode === 'preview';
    },
    clearWholeItems () {
      this.wholeItems = null;
      this.isPreview = false;
    },
    fillItems (secs) {
      this.wholeItems = {
        reportTitle: secs['reportTitle'] || 'none',
        reportId: secs['reportId'] || '',
        institution: secs['InstitutionId'] || '',
        CSTVersion: secs['CSTVersion'],
        source: JSON.parse(JSON.stringify(secs.source)),
        isOld: true
      };
    },
    editSecs (secs) {
      this.fillItems(secs);
    },
    reviewSecs (secs) {
      this.isPreview = true;
      this.fillItems(secs);
    },
    async getTemplateList () {
      this.SHOW_LOADING();

      try {
        const items = await getCstList('?cst=false');
        this.tempList = items.filter(({ StructureContent }) => !StructureContent.includes('<p>')).map(item =>
          ({
            ...JSON.parse(item.StructureContent.replace(/&quot;/g, '"').replace('<p>', '').replace('</p>', '')),
            CSTVersion: item.CSTVersion,
            reportTitle: item.CSTName,
            reportId: item.CSTId,
            InstitutionId: '' + item.InstitutionId,
          }));
        this.HIDE_LOADING();
      } catch (err) {
        this.HIDE_LOADING();
      }



      // getCstList('?cst=false').then(res => {
      //   this.tempList = res.filter(({ StructureContent }) => !StructureContent.includes('<p>')).map(item =>
      //     ({
      //       ...JSON.parse(item.StructureContent.replace(/&quot;/g, '"').replace('<p>', '').replace('</p>', '')),
      //       CSTVersion: item.CSTVersion,
      //       reportTitle: item.CSTName,
      //       reportId: item.CSTId,
      //       InstitutionId: '' + item.InstitutionId,
      //     }));
      // });
    },
    onSuperMenuClose () { },
    closeEditing () {
      this.$refs[this.isPreview ? 'previewShop' : 'editShop'].isLeaving = true;
    },
    editShopEvent (key, value = null) {
      this.$refs['editShop'][key](value);
    },
    removeTemplate (item) {

      deleteCstData(item.reportId).then(() => {
        this.getTemplateList();
      })
    }
  },
  components: { tableList, editShop, previewShop },
  created () {
    this.getTemplateList();
    if (this.get_InstitutionList || this.get_InstitutionList.length === 0) {
      this.action_InstitutionList();
    }
  },
  watch: {
    wholeItems (val) {
      if (val !== null) {
        this.$nextTick(() => { this.isMounted = true })
      } else {
        this.isMounted = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.class-report {
  padding-top: 56px;
  min-height: 100vh;
}
.temp-list {
  > div {
    border-bottom: 1px solid var(--dark);
    &:nth-last-child(1) {
      border-bottom-width: 0;
    }
  }
}
.main-ipt {
  /deep/ .super-select-container {
    height: 38px;
  }
  /deep/ .super-select-input {
    padding: 5px 10px;
    height: 38px;
  }
}
</style>
