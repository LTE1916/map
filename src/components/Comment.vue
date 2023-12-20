<template>
  <div>
    <!-- 弹窗 -->
    <el-dialog
        title="南方科技大学"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <div class="dialog-content">
        <!-- 用户信息等其他内容 -->

        <!-- 评分组件 -->
        <el-rate v-model="rating"></el-rate>

        <!-- 输入评论的文本框 -->
        <el-input
            type="textarea"
            placeholder="详细说明您在这个地点的亲身体验"
            v-model="reviewContent"
        ></el-input>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview">提交评论</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"UserComment",

  data() {
    return {
      dialogVisible: false,
      rating: 0,
      reviewContent: ''
    };
  },
  methods: {
    submitReview() {
      console.log('Rating:', this.rating);
      console.log('Review:', this.reviewContent);
      // 在这里处理评论的提交逻辑
      // 可能会包括调用一个API
      this.dialogVisible = false; // 提交后关闭弹窗
    }
  }
};
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
}

.el-rate {
  margin-bottom: 20px;
}

.el-input {
  margin-bottom: 20px;
}
</style>
