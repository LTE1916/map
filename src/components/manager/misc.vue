<script>
import SearchBox from "@/components/manager/searchBox.vue";
export default {
  name: "miscView",
  components:{
    SearchBox
  },
  created() {
    this.loadBlockList()
  },
  data() {
    return {
      blockedUsername: null,
      input: null,
      start: null,
      end: null,
      blockedUser: []
    }
  },
  methods: {
    handleRegister() {
      console.log(this.start)
      console.log(this.end)
      this.$request.post(`/user/registerBatch?start=${this.start}&end=${this.end}`, {}).then((res) => {
        if (res.code === "200") {
          console.log("注册成功")
        }
      })
    },
    handleBlock() {
      this.$request.post(`/user/block?username=${this.blockedUsername}`, {
      }).then((res) => {
        if (res.code === "200") {
          console.log(res)
          this.loadBlockList()
        }
      })
    },
    undoBlock(row){
      this.$request.post(`/user/undoBlock?username=${row.username}`, {
      }).then((res) => {
        if (res.code === "200") {
          console.log(res)
          this.loadBlockList()
        }
      })
    },
    loadBlockList() {
      this.$request.get('/user/blockList').then((res) => {
        if (res.code === "200") {
          this.blockedUser = res.data;
          console.log(res.data);
        }
      })
    },

  }
}
</script>

<template>
  <div class="batchRegister">
    <span>Batch Register</span>
    <el-input v-model="this.start" placeholder="Please input the start number"/>
    <el-input v-model="this.end" placeholder="Please input the end number"/>
    <el-button @click="handleRegister()">confirm</el-button>
  </div>
  <div class="block">
    <span>Block user</span>
    <el-input v-model="blockedUsername" placeholder="Please input"/>
    <el-button @click="handleBlock()">confirm</el-button>
    <searchBox></searchBox>
    <el-table :data="blockedUser" style="width: 100%" height="400px">
      <el-table-column prop="avatar" label="头像">
        <template v-slot="scope">
          <el-image style="width: 30px; height: 30px; border-radius: 50%" :src="scope.row.avatarUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="small" @click="undoBlock(scope.row)">移出黑名单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<style scoped>

</style>