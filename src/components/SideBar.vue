<template>
  <div class="sidebar">
    <el-scrollbar ref="scrollbarRef" height="100%">
      <div class="title" v-show="activeIndex ===1">
        <img src="../assets/1.jpg" alt="建筑图片">
        <div class="sidebar-header">
          <h1>{{ name }}</h1>
          <el-rate
              v-model="rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} points"
          />
          <span class="rating-reviews">({{ reviews }} reviews)</span>
        </div>
        <el-divider></el-divider>
      </div>

      <div :class="{ 'comment-top': commentIsTop }">

        <el-menu
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
        >
          <el-menu-item index="1" @click="handleClick1">
            概览
          </el-menu-item>
          <el-menu-item index="2" @click="handleClick2">
            评论
          </el-menu-item>
        </el-menu>
      </div>

      <div class="content">
        <div class="summary" v-show="activeIndex===1">
          <div>this is summary.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
        </div>
        <div class="comment" v-show="activeIndex===2">
          <div>this is comment.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
        </div>

        <div ref="innerRef">
          <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
            {{ item }}
          </p>
        </div>
      </div>
    </el-scrollbar>

  </div>
</template>

<script>
import {ElScrollbar} from 'element-plus';

export default {
  components: {
    ElScrollbar,
  },
  // props: {
  //   name: {
  //     type: String,
  //     required: true
  //   }
  // },
  created() {
    this.fetchData()
  },
  data() {
    return {
      reviews: 0,
      rating: 0,
      text: "",
      photo: "",
      name: "building A",
      commentIsTop: false,
      activeIndex: 1,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const inner = this.$refs.innerRef;
      if (inner) {
        this.max = inner.clientHeight - 380;
      }
    });
  },
  methods: {

    fetchData() {
      this.$request.get('/building/search', {
        params: {
          name: this.name
        }
      })
          .then((response) => {
            // 使用箭头函数
            if (response.code === "200") {
              this.text = response.data.text;
              this.photo = response.data.photoUrl;
              console.log(this.text)
              console.log(this.photo)
            } else {
              console.log('lost')
            }

            // console.log(location)
          })
          .catch((error) => {
            console.log(error);
          });
    },
    handleClick1() {
      this.activeIndex = 1
    },
    handleClick2() {
      this.activeIndex = 2
      this.commentIsTop = true
    }
  }

};
</script>

<style>
.sidebar {
  display: block;
  flex-direction: column; /* 如果希望子元素垂直排列 */
  width: 400px;
//color: #42b983; display: block; background-color: #ffffff; position: fixed; top: 0; left: 0; height: 100%; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); display: flex;
  /* 样式细节 */
}

img {
  max-width: 100%; /* 让图片不超过容器宽度 */
  height: auto; /* 保持图片比例 */
  /* 其他样式 */
}

.sidebar-header {
  padding: 20px;
}

.el-menu-demo {
  justify-content: space-around; /* 这会使所有菜单项均匀分布 */
  width: 100%;
//min-width: 400px;
}

.commentIsTop {
  order: -1; /* 负序号会置顶内容 */
}

.content {
  width: 400px;
  display: block;
  word-wrap: break-word;
  white-space: normal;
  padding: 10px;
  box-sizing: border-box;
}

/* 其他CSS样式 */
</style>
