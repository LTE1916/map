<script>

import {Message, Setting} from "@element-plus/icons-vue";

export default {
  name: "managerView",
  components: {Message, Setting},
  data() {
    return {
      itemVisible: true,
      alertVisible: false,
      pageVisible: true,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {

    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    console.log(this.$global.user)
    const userInfo = this.$global.user

    if (userInfo.authority !== 'USER'&& userInfo.authority !== 'ADMIN') {
      this.alertVisible = true;
      this.pageVisible = false;
      setTimeout(() => {
        // 在等待2秒后执行的逻辑
        this.$router.push('/login');
      }, 2000);

    }else if(userInfo.authority === 'USER'){
      this.itemVisible = false;
    }
  },
  methods: {
    handleInfo() {
      this.$router.push('/person')
    },
    handleChecking() {
      this.$router.push('/checkComment')
    },
    handlemisc() {
      this.$router.push('/misc')
    },
    handleBack() {
      this.$router.push('/map')
    },
    handleBooking(){
      this.$router.push('/bookingInfo')
    },
    handleProduct(){
      this.$router.push('/productUpload')
    },
    handleBuilding(){
      this.$router.push('/building')
    },
    handleStatisticInfo(){
      this.$router.push('/StatisticInfo')
    },
    handleLogout() {
      if (this.user!=null){
        this.$global.resetUser();
        this.$request.post('/user/logout', this.user).then((res) => {
          if (res.code === "200") {
            console.log("logout successfully")
            localStorage.removeItem('user')
            this.$router.push('/map')
          } else {
            console.log("fail")
          }
        })
      }else{
        console.error("fail")
      }
    }
  }
}
</script>
<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <el-container class="layout-container-demo" v-show="pageVisible">
    <el-header style="display: flex;justify-content: space-between; font-size: 20px">
      <!-- 左边容器，只包含 logo -->
      <div style="position: relative;">
        <img
            style="width: 600px; height: 100%;"
            src="../../assets/LOGO1.png"
            alt="Sustech logo"
        />
      </div>

      <div style="position: absolute; left: 600px; top: 0;">
        <h1 style="font-family: '黑体',serif; line-height: 180px; color: black;">用户管理系统</h1>
      </div>


      <!-- 右边容器，包含下拉菜单和用户名 -->
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px" :size="30">
            <setting/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBack">back</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Setup</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '3']">
            <el-menu-item index="1" @click="handleInfo()">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">个人信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2" @click="handleChecking()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">审核评论</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3" @click="handlemisc()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">批注册及黑名单设置</span>
              </template>
            </el-menu-item>
            <el-menu-item index="4" @click="handleBooking()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">教室预约管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="5" @click="handleProduct()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">文创管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="6" @click="handleBuilding()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">建筑管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="7" @click="handleStatisticInfo()" v-show="itemVisible">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                <span class="menu-item-text">统计数据</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main style="height: 750px;">
        <div class="subview">
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

.layout-container-demo .el-header {
  height: 150px;
  position: relative;
  background: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
}
.menu-item-text {
  font-size: 16px;    /* 调整字体大小 */
  font-weight: bold;  /* 将字体设置为黑体 */
  color: rgb(128, 128, 128);       /* 设置字体颜色为黑色 */
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-main {

  padding: 20px; /* 添加内间距 */

  background: linear-gradient(to right, var(--el-color-primary-light-8), #BC8F8F);
}

.subview {
  margin: 20px;
  padding: 20px;
  display: block;
  border: #111010;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>