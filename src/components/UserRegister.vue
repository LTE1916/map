<template>
  <div class="register-container">

    <h1>Welcome to Sustech Campus!!!</h1>

    <div class="register-form">
      <el-form ref="userForm" :model="user" :rules="rules">
        <h2>User register Dashboard</h2>
        <div>
          <el-form-item label="Username" prop="username">
            <el-input v-model="user.username"
                      :placeholder="role === 'user' ? 'Enter your username' : 'Enter your admin name'"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="user.password" placeholder="Enter your password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="role === 'user'" @click="registerUser">Register</el-button>
          </el-form-item>
        </div>
      </el-form>

    </div>

  </div>

</template>

<script>

export default {
  name: 'UserRegister',
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

      role: "user",
    };
  },
  methods: {
    registerUser() {
      // Implement register logic based on the selected role
      if (this.role === 'user' || this.role === 'admin') {
        this.$refs['userForm'].validate((valid) => {
          console.log(valid)
          this.user.authority = this.role.toUpperCase();
          if (valid) {  // 表单校验合法
            this.$request.post("/user/register", this.user).then(res => {
              if (res.code === '200') {
                this.$router.push("/login")
                this.$message.success("register success")
              } else {
                this.$message.error(res.msg)
              }
            }).catch((err) => {
              console.log(err)
            })
          } else {
            console.log("is not valid")
          }
        });
      } else {
        console.log(this.role)
      }
    },
    logout() {
      // Implement logout logic
      this.loggedIn = false;

    },
  },

};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 使容器占据整个视窗高度 */
  background: url('@/assets/1.jpg') center center/cover no-repeat; /* 替换为你的图片路径 */
  font-family: 'Arial', sans-serif;
}

.register-form {
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









