<template>
  <div class="misc-view">
    <!-- Batch Register Section -->
    <div class="batch-register section" style="background: rgba(255, 255, 255, 0.5);">
      <h3>Batch Register</h3>
      <el-input v-model="start" placeholder="Start Number" ></el-input>
      <el-input v-model="end" placeholder="End Number"></el-input>
      <el-button @click="handleRegister">Confirm</el-button>
    </div>

    <div class="block section">
      <h3>Block User</h3>
      <el-input v-model="blockedUsername" placeholder="Username"></el-input>
      <el-button @click="handleBlock">Confirm</el-button>
      <search-box class="custom-search-box"></search-box>

      <el-table :data="blockedUser" style="width: 100% ;" height="400px" >
        <!-- Avatar Column -->
        <el-table-column prop="avatar" label="Avatar">
          <template v-slot="scope">
            <el-image
                style="width: 30px; height: 30px; border-radius: 50%"
                :src="scope.row.avatarUrl"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="Username"></el-table-column>
        <el-table-column prop="phone" label="Phone"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column label="Operation">
          <template v-slot="scope">
            <el-button size="medium" @click="undoBlock(scope.row)">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/components/manager/searchBox.vue";

export default {
  name: "MiscView",
  components: {
    SearchBox,
  },
  created() {
    this.loadBlockList();
  },
  data() {
    return {
      blockedUsername: null,
      start: null,
      end: null,
      blockedUser: [],
    };
  },
  methods: {
    handleRegister() {
      this.$request
          .post(`/user/registerBatch?start=${this.start}&end=${this.end}`, {})
          .then((res) => {
            if (res.code === "200") {
              console.log("Registration successful");
            }
          });
    },
    handleBlock() {
      this.$request.post(`/user/block?username=${this.blockedUsername}`, {}).then((res) => {
        if (res.code === "200") {
          console.log(res);
          this.loadBlockList();
        }
      });
    },
    undoBlock(row) {
      this.$request.post(`/user/undoBlock?username=${row.username}`, {}).then((res) => {
        if (res.code === "200") {
          console.log(res);
          this.loadBlockList();
        }
      });
    },
    loadBlockList() {
      this.$request.get("/user/blockList").then((res) => {
        if (res.code === "200") {
          this.blockedUser = res.data;
          console.log(res.data);
        }
      });
    },
  },
};
</script>

<style scoped>
.misc-view {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}

.section {
  width: 45%;
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section h3 {
  font-size: 20px;
  margin-bottom: 15px;

}
.el-input {
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px; /* 圆角矩形样式 */
}

.el-button {
  border-radius: 8px; /* 圆角矩形样式 */
  background: rgba(255, 255, 255, 0.5);
}

.el-table {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px; /* 圆角矩形样式 */
}
</style>
