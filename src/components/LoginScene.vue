<template>
  <div class="login-container">
    <h1>User Login</h1>
    <form @submit.prevent="LoginScene">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" @click="login">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { getCaptcha } from "@/api/api";

import {onMounted, ref} from "vue";
export default {
  setup() {
    let captchaId = ref();
    onMounted(() => {
      //onMounted是Vue声明周期的钩子函数，由Vue提供，
      //请参考Vue声明周期钩子官方文档
      getcaptchaAPI();
    });
    function getcaptchaAPI() {
      getCaptcha()
      .then((res) => {
        /*这里的res是响应成功是返回的数据，res.data说明获取报文
        中的data字段对应的值,我在setup声明使用的ref，所以赋值时
        需要使用captchaId.value的方式*/
        captchaId.value = res.data;
      })
      //在这里处理错误
      .catch((err) => console.log(err));
    }
  },
  data() {
    return {
      username: "",
      password: "",
      error: ""
    };
  },
  methods: {
    login() {
      // 在这里添加用户登录逻辑
      // 你可以向服务器发送登录请求，并根据响应来更新界面
      // 这里只是一个简单的示例，没有实际登录逻辑


      if (this.username === "example" && this.password === "password") {
        // 登录成功，重置错误消息
        this.error = "";
        alert("Login successful!");
      } else {
        // 登录失败，显示错误消息
        this.error = "Invalid username or password.";
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
