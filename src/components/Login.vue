<template>
  <div class="wrapper">
    <button type="submit" @click="login">Login</button>
    <div
        style="margin: 200px auto; background-color: #fff; width: 350px; height: 280px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="name">
          <el-input size="medium" prefix-icon="el-icon-user" v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" prefix-icon="el-icon-lock" show-password
                    v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: right">
<!--          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>-->
          <el-button type="primary" size="small" autocomplete="off" @click="login">登录</el-button>
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/')">游客</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import SustechMap from "@/components/SustechMap.vue";

export default {
  name: "LogIn",
  data() {
    return {
      user: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    login() {
  axios.get("http://10.26.158.225:8080/building").then(res => {
    console.log(res.data);
    //需要检查用户名和密码
    SustechMap.username = this.user.name;
  }).catch((err) => console.log(err));
    }
    // {
    //   this.$refs['userForm'].validate((valid) => {
    //     console.log(valid)
    //     if (valid) {  // 表单校验合法
    //       this.request.post("/user/login", this.user).then(res => {
    //         if (res.code === '200') {
    //           localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
    //           // localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
    //           // // 动态设置当前用户的路由
    //           // setRoutes()
    //           // this.$message.success("登录成功")
    //           // if (res.data.role === 'ROLE_STUDENT') {
    //           //   this.$router.push("/front/home")
    //           // } else {
    //           //   this.$router.push("/")
    //           // }
    //           this.$router.push("/")
    //           this.$message.success("dengluchenggong")
    //         } else {
    //           this.$message.error(res.msg)
    //         }
    //       })
    //     }else{
    //       console.log("is not valid")
    //     }
    //   });
    // }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  overflow: hidden;
}
</style>
