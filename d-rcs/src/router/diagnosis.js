import store from '@/store'
export default {
  path: '/diagnosisManage/',
  name: 'diagnosisManage',
  meta: {
    title: '會診清單',
  },
  redirect: { name: 'recordingMaintain' },
  children: [
    {
      path: 'recordingMaintain',
      name: 'recordingMaintain',
      meta: {
        title: '會診記錄作業',
        needfooter: true,
      },
      component: () => import('views/diagnosis/list.vue'),
      beforeEnter: (to, from, next) => {
        //避免協助人員亂看
        const dakarNoCheck = store.state?.dakar ? store.state?.dakar.No : ''
        if (`${dakarNoCheck}`.includes('assist') && to.name == 'recordingMaintain' && from.name == 'formalForm') {
          next({ name: 'Auth' })
        } else {
          next()
        }
      },
    },
    {
      path: 'closedList',
      name: 'closedList',
      meta: {
        title: '已結案會診記錄',
        needfooter: true,
      },
      component: () => import('views/diagnosis/list.vue'),
    },
    {
      path: 'recordingDelete',
      name: 'recordingDelete',
      meta: {
        title: '會診單刪除作業',
        needfooter: true,
      },
      component: () => import('../views/diagnosis/list.vue'),
    },
    {
      path: 'draftForm/:item',
      name: 'draftForm',
      meta: {
        title: '會診單',
        needfooter: false,
      },
      component: () => import('../views/diagnosis/draft/index2.vue'),
    },
    {
      path: 'postEditForm/:item',
      name: 'postEditForm',
      meta: {
        title: '會診單事後編輯',
        needfooter: false,
      },
      component: () => import('../views/diagnosis/draft/index2.vue'),
    },
    {
      path: 'sheetOnlyView/:item',
      name: 'sheetOnlyView',
      meta: {
        title: '會診單檢視',
        needfooter: false,
      },
      component: () => import('../views/diagnosis/draft/index2.vue'),
    },
    {
      path: 'formalForm/:item',
      name: 'formalForm',
      meta: {
        title: '會診諮詢單',
        needfooter: false,
      },
      component: () => import('../views/diagnosis/formal/index.vue'),
    },
    {
      path: 'attachMaintain/:id',
      name: 'attachMaintain',
      meta: {
        title: '附件維護作業',
        needfooter: true,
      },
      component: () => import('../views/diagnosis/attachmaintain.vue'),
    },
    {
      path: 'videoRecord',
      name: 'videoRecord',
      meta: {
        title: '視訊紀錄',
        needfooter: true,
      },
      component: () => import('../views/diagnosis/videorecord.vue'),
    },
    {
      path: 'supplementarySeal',
      name: 'supplementarySeal',
      meta: {
        title: '補簽章作業',
        needfooter: true,
      },
      component: () => import('../views/diagnosis/supplementaryseal.vue'),
    },
  ],
}
