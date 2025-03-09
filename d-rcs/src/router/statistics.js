export default {
  path: "/statisticsManage/",
  name: "statisticsManage",
  meta: {
    title: "統計作業",
  },
  component: () => import("../views/statistics/index.vue"),
  children: [
    {
      path: "reportStatistics",
      name: "reportStatistics",
      meta: {
        title: "會診記錄統計作業",
        needfooter: true,
      },
      component: () => import("../views/statistics/reportStatistics.vue"),
    },
    // {
    //   path: "statisticsMaintain2",
    //   name: "statisticsMaintain2",
    //   meta: {
    //     title: "statistics2",
    //     needfooter: true,
    //   },
    //   component: () => import("../views/statistics/work2.vue"),
    // },
  ],
};
