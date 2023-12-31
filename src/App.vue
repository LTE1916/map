<!-- App.vue -->

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  components: {

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
html,body,#app{
  height: 100%;
}
</style>
