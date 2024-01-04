<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <div v-show="pageVisible" v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc; padding: 10px 0; ">

  </div>



</template>


<script>

export default {
  name: "StatisticInfo",
  data() {
    return {
      alertVisible: false,
      pageVisible: true,
      info: [],

    }
  },
  created() {
    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const user = this.$global.user
    if (user.authority !== 'ADMIN') {
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
    this.loadData()
  },
  methods: {
    loadData() {
      this.$request.post("/booking-info/all")
      .then((response) => {
        if (response.code === "200") {
          this.info = response.data
          console.log(this.info)
        }
      })
    },

  }
}
</script>


<style scoped>




.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}



.comment-footer .time,
.comment-footer .actions {
  width: 200px;
}

.comment-footer .actions {
  text-align: right;
  flex: 1;
}


</style>