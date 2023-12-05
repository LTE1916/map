<!-- App.vue -->

<template>
  <div>
    <LogIn @login-success="handleLoginSuccess" v-if="showLogin" />
    <SustechMap v-if="!showLogin" />
  </div>
</template>

<script>
import SustechMap from './components/SustechMap.vue'
import LogIn from './components/LogIn.vue'

export default {
  components: {
    LogIn,
    SustechMap
  },
  data() {
    return {
      showLogin: true,
      username: ''
    };
  },
  methods: {
    handleLoginSuccess() {
      // 登录成功后切换显示状态
      this.showLogin = false;

    }
  }
}
</script>

<style>

</style>
