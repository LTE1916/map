<script>

import {Message, Setting} from "@element-plus/icons-vue";

export default {
  name: "managerView",
  components: {Message, Setting},
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
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
    handleLogout() {
      if (this.user!=null){
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
  <el-container class="layout-container-demo" style="height: 500px">
    <el-header style="display: flex; justify-content: space-between; font-size: 20px">
      <!-- 左边容器，只包含 logo -->
      <div>
        <img
            style="width: 150px; height: 100%;"
            src="../../assets/LOGO.png"
            alt="Sustech logo"
        />
      </div>

      <!-- 右边容器，包含下拉菜单和用户名 -->
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px" :size="20">
            <setting/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBack">back</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Tom</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '3']">
            <el-menu-item index="1" @click="handleInfo()">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                个人信息
              </template>
            </el-menu-item>
            <el-menu-item index="2" @click="handleChecking()">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                审核评论
              </template>
            </el-menu-item>
            <el-menu-item index="3" @click="handlemisc()">
              <template #title>
                <el-icon>
                  <message/>
                </el-icon>
                批注册以及黑名单设置
              </template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="subview">
          <el-scrollbar>
            <router-view>
            </router-view>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

.layout-container-demo .el-header {
  height: 20%;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  margin: 20px;
  padding: 20px; /* 添加内间距 */
  border: 1px solid #111010; /* 添加边框 */
  background-color: #42b983;
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