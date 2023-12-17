<template>
  <div class="sidebar">
    <el-scrollbar ref="scrollbarRef" height="100%">

      <div class="">
        <img src="../resources/3647.jpg_wh300.jpg" alt="建筑图片">

        <div class="content">
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
        </div>
        <el-divider></el-divider>
      </div>

      <div :class="{ 'content-top': contentIsTop }">
        <el-menu
            default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            @click="selectItem(item)"
        >
          <el-menu-item index="1">
            概览
          </el-menu-item>
          <el-menu-item index="2">
            评论
          </el-menu-item>
        </el-menu>

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
      contentIsTop: false,
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
    selectItem(item) {
      this.contentIsTop = item.name === '评论'; // 当点击评论时，contentIsTop变为true
    },
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
    }
  }

};
</script>

<style>
.sidebar {
  width: 400px;
//color: #42b983; display: block; background-color: #ffffff; position: fixed; top: 0; left: 0;
  height: 100%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  /* 样式细节 */
}

img {
  max-width: 100%; /* 让图片不超过容器宽度 */
  height: auto; /* 保持图片比例 */
  /* 其他样式 */
}

.content {
  padding: 20px;
}

.el-menu-demo {
  display: flex;
  justify-content: space-around; /* 这会使所有菜单项均匀分布 */
}

.router {
  padding: 20px;
}

.content-top {
  order: -1; /* 负序号会置顶内容 */
}

/* 其他CSS样式 */
</style>
