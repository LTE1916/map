<template>
  <div class="login-container">

    <h1>Welcome to Sustech Campus!!!</h1>

    <div class="login-form">
      <div v-if="role === 'guest'">
        <h2>Guest Mode</h2>
        <p>You are browsing as a guest. No registration or login required.</p>
        <button @click="enterGuestMode">Enter</button>
      </div>

      <el-form v-if="role ==='user'||role === 'admin' " ref="userForm" :model="user" :rules="rules">
        <h2>{{ role === 'user' ? 'User' : 'Admin' }} Dashboard</h2>
        <div v-if="!loggedIn">
          <el-form-item label="Username" prop="username">
            <el-input v-model="user.username" :placeholder="role === 'user' ? 'Enter your username' : 'Enter your admin name'"></el-input>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="user.password" placeholder="Enter your password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="login">Login</el-button>
            <el-button v-if="role === 'user'" @click="register">Register</el-button>
          </el-form-item>
        </div>
        <p v-else>Welcome, {{ role === 'user' ? user.username : `Admin ${user.username}` }}!</p>
        <el-button v-if="loggedIn" @click="logout">Logout</el-button>
      </el-form>

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
      },
      role: "guest",
      loggedIn: false
    };
  },
  methods: {
    enterGuestMode() {
      // Implement guest mode logic
      let res={
        code:200,
        msg:"success",
        data:{}
      };
      res.data = {
        username: "guest",
        authority: "GUEST"
      }
      localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
      this.$emit('login-success');
      this.$router.push("/map")
    },
    login() {
      // Implement login logic based on the selected role
      if (this.role === 'user' || this.role ==='admin') {
        this.$refs['userForm'].validate((valid) => {
          console.log(valid)
          this.user.authority = this.role.toUpperCase();
          if (valid) {  // 表单校验合法
            this.$request.post("/user/login", this.user).then(res => {
              if (res.code === '200') {
                this.loggedIn = true;
                console.log(res.data)
                localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
                this.$router.push("/map")
                this.$message.success("login success")
              } else {
                this.$message.error(res.msg)
              }
            }).catch((err)=>{
              console.log(err)
            })
          } else {
            console.log("is not valid")
          }
        });
      }else {

        console.log(this.role)
      }
    },
    register() {
      // Implement registration logic based on the selected role
      this.$router.push("/register")

    },
    logout() {
      // Implement logout logic
      this.loggedIn = false;

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
  background: url('@/assets/3.jpeg') center center/cover no-repeat; /* 替换为你的图片路径 */
  font-family: 'Arial', sans-serif;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8); /* 设置登录表单的背景色，可根据需要调整透明度 */
  margin-top: 30px;backdrop-filter: blur(5px); /* 添加模糊效果，需要浏览器支持 */
  border: 1px solid #ccc;
}

h1 {
  font-size: 4em;
  margin-bottom: 20px;
  color: #ffffff; /* 设置颜色为深灰色 */
}


label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

select {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  font-size: 14px;
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
  margin-bottom: 10px;
}

button:hover {
  background-color: #2980b9;
}
h2 {
  font-size: 2em;
  margin-bottom: 15px;
  color: #333;
}
p {
  color: #666;
}
/* 添加其他样式以适应你的需求 */
</style>
