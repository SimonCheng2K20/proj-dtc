<template>
  <b-container id="topNav" fluid>
    <b-navbar fixed="top" toggleable="sm" type="dark" id="mainNav">
      <b-navbar-brand to="/" replace>
        <!-- <b-img :src="`${publicPath}LogoWF4NB_128x128.png`" class="mr-1 logo" /> -->
        <span class="title">和信醫院．影像報告系統</span>
        <!-- <span class="title">陽明交通大學醫院．影像報告系統</span> -->
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-item-dropdown text="櫃台作業">
            <b-dropdown-item to="/MI01/FI0101" replace
              >報到櫃台</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="檢查室作業">
            <b-dropdown-item to="/MI02/FI0201" replace
              >報到前台</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="診斷報告">
            <b-dropdown-item to="/MI03/FI0302" replace
              >報告片語維護</b-dropdown-item
            >
            <b-dropdown-item to="/MI03/FI0303" replace
              >癌篩樣版維護</b-dropdown-item
            >

            <!--
						<b-dropdown-item to="/" replace disabled>Home</b-dropdown-item>
						<b-dropdown-divider></b-dropdown-divider>
						<b-dropdown-item to="/about" replace disabled>About</b-dropdown-item>
            -->
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="權限管理作業">
            <b-dropdown-item to="/Role" replace>角色管理</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="基本資料維護">
            <b-dropdown-item to="/Institution" replace
              >部門維護</b-dropdown-item
            >
            <b-dropdown-item to="/Room" replace>檢查室維護</b-dropdown-item>
            <b-dropdown-item to="/Device" replace>檢查儀器維護</b-dropdown-item>
            <b-dropdown-item to="/Employee" replace>員工管理</b-dropdown-item>
            <b-dropdown-item to="/Patient" replace>病患管理</b-dropdown-item>
            <b-dropdown-item to="/CheckCategory" replace
              >檢查類別維護</b-dropdown-item
            >
            <b-dropdown-item to="/CheckCombo" replace
              >檢查套餐維護</b-dropdown-item
            >
            <b-dropdown-item to="/CheckItem" replace
              >檢查項目維護</b-dropdown-item
            >
            <b-dropdown-item to="/Medication" replace>藥品維護</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="排程維護">
            <b-dropdown-item to="/DefaultSpecialTime" replace
              >檢查室每週例行排程</b-dropdown-item
            >
            <b-dropdown-item to="/SpecialTime" replace
              >檢查室特定時段排程</b-dropdown-item
            >
            <b-dropdown-item to="/Schedule" replace>排程總覽</b-dropdown-item>
            <b-dropdown-item to="/BookingTest" replace
              >排程 Booking</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="報告醫師排程維護">
            <b-dropdown-item to="/WeekScheduling" replace
              >日班週排程</b-dropdown-item
            >
            <b-dropdown-item to="/MonthScheduling" replace
              >小夜班月排程</b-dropdown-item
            >
            <b-dropdown-item to="/ManualDispatch" replace
              >手動分派報告</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="統計作業">
            <b-dropdown-item to="/EmployeeWorkload" replace
              >檢查人員工作量</b-dropdown-item
            >
            <b-dropdown-item to="/DeviceWorkload" replace
              >儀器使用量</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
};
</script>
