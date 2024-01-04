<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <el-card style="width: 1000px; height:600px; padding: 20px;background: rgba(255, 255, 255, 0.5);" v-show="pageVisible">
    <div class="flex-container">
      <div class="avatar-container">
        <el-upload
            class="avatar-uploader"
            :action="'http://' + serverIp +':8080/files/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :class="{ 'is-success': uploadSuccess }"
        >

          <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar circular-avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>

      <div class="form-container">
        <el-form label-width="100px" size="large">
          <el-form-item label="用户名">
            <template #label>
              <div class="label-container">
                <el-icon>
                  <user/>
                </el-icon>
                用户名
              </div>
            </template>
            <el-input v-model="form.username" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <template #label>
              <div class="label-container">
                <el-icon>
                  <message/>
                </el-icon>
                邮箱
              </div>
            </template>
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <template #label>
              <div class="label-container">
                <el-icon>
                  <phone/>
                </el-icon>
                电话
              </div>
            </template>
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="custom-button" type="primary" @click="save">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { serverIp } from "../../../public/config";
import {Message,User,Phone} from "@element-plus/icons-vue";

export default {
  name: "PersonView",
  components: {Message,User,Phone},
  data() {
    return {
      alertVisible: false,
      pageVisible: true,
      serverIp: serverIp,
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      uploadSuccess: false,
    };
  },
  created() {
    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const userInfo = this.$global.user
    if (userInfo.authority !== 'USER'&& userInfo.authority !== 'ADMIN') {
      this.alertVisible = true;
      this.pageVisible = false;

      setTimeout(() => {
        // 在等待2秒后执行的逻辑
        if(this.$global.user.authority === 'GUEST') {
          this.$router.push('/login');
        }else {
          this.$router.push('/map');
        }
      }, 2000);

    }
    console.log(userInfo)
    this.getUser().then((res) => {
      console.log(res);
      this.form = res;
    });
  },
  methods: {
    async getUser() {
      return (await this.$request.get("/user/username/" + this.user.username)).data;
    },
    save() {
      this.$request.post("/user", this.form).then((res) => {
        if (res.code === "200") {
          this.$message.success("保存成功");

          // 触发父级更新User的方法
          this.$emit("refreshUser");

          // 更新浏览器存储的用户信息
          this.getUser().then((res) => {
            res.token = JSON.parse(localStorage.getItem("user")).token;
            localStorage.setItem("user", JSON.stringify(res));
          });
        } else {
          this.$message.error("保存失败");
        }
      });
    },
    handleAvatarSuccess(res) {
      this.form.avatarUrl = res.data;
      this.uploadSuccess = true;
      console.log(res);
    },
  },
};
</script>

<style>
.custom-button {
  background: rgba(255, 255, 255, 0.1);
  color: #8c939d;
  border-color: #8c939d;
}
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 2px dashed #8c939d;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 10px;
  transition: border-color 0.3s ease; /* 添加过渡效果 */
}

.el-button:hover {
  background-color: var(--el-color-primary-light-8);
  color: #fff;
}

.avatar-uploader .el-upload:not(.is-success):hover {
  border-color: var(--el-color-primary-light-8);
}
.avatar-uploader.is-success .el-upload {
  border-color: transparent;
}

.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 138px;
  height: 138px;
  display: block;
  object-fit: cover; /* 新增的样式，强制使图片充满容器并保持宽高比例 */
  border-radius: 50%; /* 将图片也设置为圆形 */
}

/* Flex布局样式 */
.flex-container {
  display: flex;
  justify-content: space-between; /* 左右两侧分别上下居中，可根据需要调整 */
  align-items: center; /* 子元素在纵向方向上居中 */
}

.avatar-container {
  width: 48%; /* 左侧头像容器占据48%的宽度，可根据需要调整 */
  margin-top: 200px;
}

.form-container {
  width: 48%; /* 右侧表单容器占据48%的宽度，可根据需要调整 */
  margin-top: 80px;
}
</style>
