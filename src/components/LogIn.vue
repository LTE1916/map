<!--<template>-->
<!--  <div class="wrapper">-->
<!--    <button type="submit" @click="login">Login</button>-->
<!--    <div-->
<!--        style="margin: 200px auto; background-color: #fff; width: 350px; height: 280px; padding: 20px; border-radius: 10px">-->
<!--      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>-->
<!--      <el-form :model="user" :rules="rules" ref="userForm">-->
<!--        <el-form-item prop="name">-->
<!--          <el-input size="medium" prefix-icon="el-icon-user" v-model="user.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item prop="password">-->
<!--          <el-input size="medium" prefix-icon="el-icon-lock" show-password-->
<!--                    v-model="user.password"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item style="margin: 10px 0; text-align: right">-->
<!--          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>-->
<!--          <el-button type="primary" size="small" autocomplete="off" @click="login">登录</el-button>-->
<!--          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/')">游客</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--import axios from "axios";-->
<!--import SustechMap from "@/components/SustechMap.vue";-->

<!--export default {-->
<!--  name: "LogIn",-->
<!--  data() {-->
<!--    return {-->
<!--      user: {},-->
<!--      rules: {-->
<!--        username: [-->
<!--          {required: true, message: '请输入用户名', trigger: 'blur'},-->
<!--          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}-->
<!--        ],-->
<!--        password: [-->
<!--          {required: true, message: '请输入密码', trigger: 'blur'},-->
<!--          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}-->
<!--        ],-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    login() {-->
<!--  axios.get("http://10.26.158.225:8080/building").then(res => {-->
<!--    console.log(res.data);-->
<!--    //需要检查用户名和密码-->
<!--    SustechMap.username = this.user.name;-->
<!--  }).catch((err) => console.log(err));-->
<!--    }-->
<!--    // {-->
<!--    //   this.$refs['userForm'].validate((valid) => {-->
<!--    //     console.log(valid)-->
<!--    //     if (valid) {  // 表单校验合法-->
<!--    //       this.request.post("/user/login", this.user).then(res => {-->
<!--    //         if (res.code === '200') {-->
<!--    //           localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器-->
<!--    //           // localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器-->
<!--    //           // // 动态设置当前用户的路由-->
<!--    //           // setRoutes()-->
<!--    //           // this.$message.success("登录成功")-->
<!--    //           // if (res.data.role === 'ROLE_STUDENT') {-->
<!--    //           //   this.$router.push("/front/home")-->
<!--    //           // } else {-->
<!--    //           //   this.$router.push("/")-->
<!--    //           // }-->
<!--    //           this.$router.push("/")-->
<!--    //           this.$message.success("dengluchenggong")-->
<!--    //         } else {-->
<!--    //           this.$message.error(res.msg)-->
<!--    //         }-->
<!--    //       })-->
<!--    //     }else{-->
<!--    //       console.log("is not valid")-->
<!--    //     }-->
<!--    //   });-->
<!--    // }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.wrapper {-->
<!--  height: 100vh;-->
<!--  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);-->
<!--  overflow: hidden;-->
<!--}-->
<!--</style>-->

<template>
  <div class="login-container">

    <h1>Welcome to Sustech Campus!!!</h1>

    <div class="login-form">
      <div v-if="role === 'guest'">
        <h2>Guest Mode</h2>
        <p>You are browsing as a guest. No registration or login required.</p>
        <button @click="enterGuestMode">Enter</button>
      </div>

      <div v-else-if="role === 'user'">
        <h2>User Dashboard</h2>
        <div v-if="!loggedIn">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your username">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password">
          <button @click="login">Login</button>
          <button @click="register">Register</button>
        </div>
        <p v-else>Welcome, {{ username }}!</p>
        <button v-if="loggedIn" @click="logout">Logout</button>
      </div>

      <div v-else-if="role === 'admin'">
        <h2>Admin Dashboard</h2>
        <div v-if="!loggedIn">
          <label for="adminName">Admin Name:</label>
          <input type="text" id="adminName" v-model="adminName" placeholder="Enter your admin name">
          <label for="adminPassword">Password:</label>
          <input type="password" id="adminPassword" v-model="adminPassword" placeholder="Enter your password">
          <button @click="login">Login</button>
          <button @click="register">Register</button>
        </div>
        <p v-else>Welcome, Admin {{ adminName }}!</p>
        <button v-if="loggedIn" @click="logout">Logout</button>
      </div>

      <div>
        <label>Select Role:</label>
        <select v-model="role">
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: 'LogIn',
  data() {
    return {
      role: 'guest',
      loggedIn: false,
      username: '',
      password: '',
      adminName: '',
      adminPassword: '',
    };
  },
  methods: {
    enterGuestMode() {
      // Implement guest mode logic
      this.$emit('login-success');
    },
    login() {
      // Implement login logic based on the selected role
      this.loggedIn = true;

      if (this.role === 'user') {
        //若登录成功
        this.$emit('login-success');
        this.$refs.sustechMapInstance.setUsername("your_username");
        // Implement user login logic using this.username and this.password
      } else if (this.role === 'admin') {
        this.$emit('login-success');
        // Implement admin login logic using this.adminName and this.adminPassword
      }
    },
    register() {
      // Implement registration logic based on the selected role
      this.loggedIn = true;

      if (this.role === 'user') {
        // Implement user registration logic using this.username and this.password
      } else if (this.role === 'admin') {
        // Implement admin registration logic using this.adminName and this.adminPassword
      }
    },
    logout() {
      // Implement logout logic
      this.loggedIn = false;
      this.username = '';
      this.password = '';
      this.adminName = '';
      this.adminPassword = '';
    },
  },

};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 使容器占据整个视窗高度 */
  background: url('@/assets/1.jpg') center center/cover no-repeat; /* 替换为你的图片路径 */
  font-family: 'Arial', sans-serif;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5); /* 设置登录表单的背景色，可根据需要调整透明度 */
  margin-top: 30px;
}

h1 {
  font-size: 4em;
  margin-bottom: 20px;
  color: #fff; /* 设置颜色为白色 */
}


label {
  display: block;
  margin-bottom: 8px;
}

select {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #2980b9;
}

/* 添加其他样式以适应你的需求 */
</style>









