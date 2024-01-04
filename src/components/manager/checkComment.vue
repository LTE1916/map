<script>
import dayjs from "dayjs";

export default {
  name: "checkComment",
  data() {
    return {
      alertVisible: false,
      pageVisible: true,
      comments: [],
      recentComment:{},
      detailVisible:false
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
      console.log("loadData is used")
      this.$request.get("comment/findUnchecked")
          .then((response) => {
            if (response.code === "200") {
              this.comments = response.data
              console.log(this.comments)
            }
          })
      console.log("loadData is used")
    },
    pass(item) {
      item.checked = true;
      this.$request.post("/comment", item).then(res => {
        if (res.code === '200') {
          this.$message.success("已通过")
          this.detailVisible = false;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    fail(item) {
      this.$request.delete(`/comment/${item.id}`).then(res => {
        if (res.code === '200') {
          this.$message.success("已拒绝")
          this.detailVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    formattedDate(originalDate) {
      return dayjs(originalDate).format('YYYY年MM月DD日 HH:mm:ss');
    }
  }
}
</script>

<template>
    <el-alert
        v-show="alertVisible"
        title="无权限"
        type="error"
        description="返回登录界面，请重新登录"
        show-icon
    />
  <div v-show="pageVisible" v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc; padding: 10px 0; ">
    <div style="display: flex" class="comment-block">
      <div style="width: 100px; text-align: center" class="avatar">
        <el-image :src="item.avatarUrl" style="width: 50px; height: 50px; border-radius: 50%"></el-image>
      </div> <!--  头像-->
      <div style="flex: 1; font-size: 14px; padding: 5px 0; line-height: 25px">
        <div><b>{{ item.username }}：</b></div>
        <div>
          <el-rate v-model="item.rating" size="small" allow-half disabled
                   show-score style="font-size: 24px;"></el-rate>
        </div>
        <div class="comment-content"><span>{{ item.comment }}</span></div>
        <div style="display: flex; line-height: 20px; margin-top: 5px" class="comment-footer">
          <div style="width: 200px;" class="time" >
            <i class="el-icon-time"></i><span style="margin-left: 5px">{{ formattedDate(item.time) }}</span>
          </div>
          <div style="text-align: right; flex: 1" class="actions">
            <el-button style="margin-left: 5px" link @click="detailVisible = true;recentComment = item">详情</el-button>
            <el-button style="margin-left: 5px" link @click="pass(item)">通过</el-button>
            <el-button style="margin-left: 5px" link @click="fail(item)">否定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
      v-model="this.detailVisible"
      :title="recentComment.building"
      width="30%"
      draggable
  >
    <div class="user-profile">
      <div class="avatar-wrapper">
        <img :src="this.recentComment.avatarUrl" alt="头像" class="avatar"/>
      </div>
      <div class="username">
        {{ this.recentComment.username }}
      </div>
    </div>

    <el-rate v-model="this.recentComment.rating" size="large" allow-half disabled style="padding: 20px"></el-rate>

    <!-- 输入评论的文本框 -->
    <el-input
        type="textarea"
        placeholder="详细说明您在这个地点的亲身体验"
        v-model="this.recentComment.comment"
        disabled
    ></el-input>
    <template #footer>
            <span class="dialog-footer">
              <el-button @click="detailVisible = false">close</el-button>
              <el-button type="primary" @click="pass(recentComment)">
                pass
              </el-button>
            </span>
    </template>
  </el-dialog>

</template>

<style scoped>
.comment-block {
  border: 1px solid #ccc; /* 边框 */
  padding: 10px; /* 内边距 */
  margin-bottom: 15px; /* 间距 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1); /* 阴影效果 */
  background: rgba(255, 255, 255, 0.5);
}

.avatar {
  width: 100px;
  text-align: center;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
  font-size: 14px;
  padding: 5px 0;
  line-height: 25px;
}

.comment-footer {
  display: flex;
  line-height: 20px;
  margin-top: 5px;
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