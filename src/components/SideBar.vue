<template>
  <transition name="slide" >
  <div class="sidebar" v-show="this.sideBarVisible" >
    <div v-show="this.scrollbarVisible">
      <el-scrollbar ref="scrollbarRef" height="100%">
        <div class="title" v-show="activeIndex ===1">
          <img :src="this.avatarUrl" alt="建筑图片">
          <div class="sidebar-header">
            <h1>{{ name }}</h1>
            <el-rate
                v-model="this.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value} points"
            />
            <span class="rating-reviews">({{ this.reviews }} reviews)</span>
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
            <div class="summary.text">
              {{ this.building.text}}
            </div>
            <div class="summary.photo">
              <img :src="this.building" alt="建筑图片">
            </div>
            <div>
            </div>
          </div>
          <div class="comment" v-show="activeIndex===2">
            <div style="display: flex; justify-content: center; align-items: center;">
              <el-button :icon="Edit" color="#626aef" round @click="this.dialogVisible = true" v-if="showComponent">我要评价</el-button>
            </div>

            <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc; padding: 10px 0; ">
              <div style="display: flex">
                <div style="width: 100px; text-align: center">
                  <el-image :src="item.avatarUrl" style="width: 50px; height: 50px; border-radius: 50%"></el-image>
                </div> <!--  头像-->
                <div style="flex: 1; font-size: 14px; padding: 5px 0; line-height: 25px">
                  <div><b>{{ item.username }}：</b></div>
                  <div>
                    <el-rate v-model="item.rating" size="small" allow-half disabled
                             show-score style="font-size: 24px;"></el-rate>
                  </div>
                  <div><span>{{ item.comment }}</span></div>

                  <div style="display: flex; line-height: 20px; margin-top: 5px">
                    <div style="width: 200px;">
                      <i class="el-icon-time"></i><span style="margin-left: 5px">{{ formattedDate(item.time) }}</span>
                    </div>
                    <div style="text-align: right; flex: 1">
                      <el-button style="margin-left: 5px" link @click="handleReply(item)" v-if="showComponent">回复</el-button>
                      <el-button link style="color: red" @click="del(item.id)"
                                 v-if="((user.id === item.userId)&&(this.user.authority === 'USER' || this.user.authority === 'ADMIN'))">删除
                      </el-button>
                    </div>
                  </div>
                </div>   <!--  内容-->
              </div>


              <div v-if="item.children.length" style="padding-left: 50px;">
                <div v-for="subItem in item.children" :key="subItem.id"
                     style="background-color: #f0f0f0; padding: 5px 20px">
                  <!--          回复列表-->
                  <div style="font-size: 14px; padding: 5px 0; line-height: 25px ">
                    <div>
                      <b style="color: #3a8ee6" v-if="subItem.pnickname">@{{ subItem.pnickname }}</b>
                    </div>
                    <div style="padding-left: 5px">
                      <b>{{ subItem.username }}：</b>
                      <span>{{ subItem.comment }}</span>
                    </div>

                    <div style="display: flex; line-height: 20px; margin-top: 5px; padding-left: 5px">
                      <div style="width: 200px;">
                        <i class="el-icon-time"></i><span
                          style="margin-left: 5px">{{ formattedDate(subItem.time) }}</span>
                      </div>
                      <div style="text-align: right; flex: 1">
                        <el-button style="margin-left: 5px" link @click="handleReply(subItem)">回复</el-button>
                        <el-button link style="color: red" @click="del(subItem.id)" v-if="user.id === subItem.userId">
                          删除
                        </el-button>
                      </div>
                    </div>
                  </div>   <!--  内容-->
                </div>
              </div>
            </div>


          </div>

          <div ref="innerRef">
            <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
              {{ item }}
            </p>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div v-show="navigatebarVisible" >
      <el-input type="text" placeholder="起点输入" v-model="startPoint"></el-input>
      <el-input type="text" placeholder="终点输入" v-model="endPoint"></el-input>
      <el-button @click="startNavigation">开始导航</el-button>
      <el-radio-group  v-model="radio1" @change="selectNavigationMethod">
        <el-radio label="walk">步行导航</el-radio>
        <el-radio  label="bus">公交导航</el-radio>
      </el-radio-group>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="step" label="steps" width:100 />
      </el-table>
    </div>


  </div>
  </transition>


  <div class="sidebar-toggle-button" @click="toggleSidebar" :style="this.buttonStyle" >
    <el-button :icon="this.sideBarVisible? ArrowLeft:ArrowRight" round ></el-button>
  </div>

  <el-dialog
      v-model="this.dialogVisible"
      :title="name"
      width="30%"
      draggable
  >
    <div class="user-profile">
      <div class="avatar-wrapper">
        <img :src="this.user.avatarUrl" alt="头像" class="avatar"/>
      </div>
      <div class="username">
        {{ this.user.username }}
      </div>
    </div>

    <el-rate v-model="this.reviewContent.rating" size="large" allow-half style="padding: 20px"></el-rate>

    <!-- 输入评论的文本框 -->
    <el-input
        type="textarea"
        placeholder="详细说明您在这个地点的亲身体验"
        v-model="this.reviewContent.comment"
    ></el-input>

    <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleCommentButton">
                Confirm
              </el-button>
            </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="this.replydialogVisible"
      width="30%"
      draggable
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">回复</h4>
        <el-avatar :src="this.currentReply.pavatar"></el-avatar>
        <span>{{ this.currentReply.pname }}</span>
      </div>
    </template>


    <!-- 输入评论的文本框 -->
    <el-input
        type="textarea"
        placeholder="详细说明您在这个地点的亲身体验"
        v-model="this.reviewContent.comment"
    ></el-input>

    <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleCommentButton">
                Confirm
              </el-button>
            </span>
    </template>



  </el-dialog>

</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包
import customParseFormat from 'dayjs/plugin/customParseFormat'; // 导入解析插件

dayjs.extend(customParseFormat);
dayjs.locale('zh-cn');
import {ElScrollbar,ElButton,ElInput,ElDialog,ElRadioGroup,ElRadio,ElTableColumn} from 'element-plus';
import {ArrowLeft, ArrowRight, ArrowUp, Edit} from "@element-plus/icons-vue";


export default {

  computed: {
    showComponent() {
      return this.user.authority === 'USER' || this.user.authority === 'ADMIN';
    },

    ArrowRight() {
      return ArrowRight
    },
    ArrowLeft() {
      return ArrowLeft
    },
    ArrowUp() {
      return ArrowUp
    },
    Edit() {
      return Edit
    }
  },
  components: {
    ElScrollbar,
    ElButton,
    ElInput,
    ElDialog,
    ElRadioGroup,
    ElRadio,
    ElTableColumn,
  },
  created() {
    this.loadData()
    this.loadComment()
    this.loadRating()
  },
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("user")),//获取用户权限
      reviewContent: {},
      comments: [],
      reviews: 0,
      rating: 0,
      name: "第一教学楼",
      commentIsTop: false,
      activeIndex: 1,
      user: {},
      dialogVisible: false,
      commentVisible: false,
      building: {
        id: 11,
        name: "第一教学楼",
        text: "第一教学楼的描述",
        photoUrl: "http://example.com/image1.jpg",
        bookingAvailable: false,
        floorNumber: 1
      },
      replydialogVisible: false,
      currentReply: {},
      sideBarVisible:false,
      scrollbarVisible:true,
      navigatebarVisible:false,
      startPoint: '',
      endPoint: '',
      navigationMethod: 'walk',
      buttonStyle:"  position: absolute;\n" +
          "  top: 50%; /* 垂直居中 */\n" +
          "  left: 0px; /* 根据按钮宽度调整，确保按钮紧贴侧边栏 */\n" +
          "  transform: translateY(-50%); /* 使用transform来精确居中 */\n" ,
      avatarUrl : "http://localhost:8080/files/fa1e99a24de742b7bbb3420481781076.png",
      radio1: 'walk',
      tableData: [
        { step:'' },
        { step:'' },
        { step:'' },
        // Add more dynamic columns as needed
      ],
      tableIndex:0,
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


    selectNavigationMethod(val){
      if (val === 'walk'){
        this.navigationMethod = 'walk'
      }else
      if (val === 'bus'){
        this.navigationMethod = 'bus'
      }
    },

    handleNavigate(){
      if(this.sideBarVisible === false){
        this.toggleSidebar();
      }
      this.scrollbarVisible = false;
      this.navigatebarVisible = true;
    },
    resetSideBar(){
      if (this.sideBarVisible === true){
        this.toggleSidebar();
      }
      this.name =  'welcome'
      this.startPoint = ''
      this.endPoint = ''
      this.navigationMethod = 'walk'
      this.scrollbarVisible = true;
      this.navigatebarVisible = false;
      let instructions = ['','','']
      this.setSteps(instructions)
    },
    startNavigation() {
      this.$parent.confirmNavigation(this.navigationMethod);
      // Add your navigation logic here
    },
    setName(name) {
      //这里表示map中点击了建筑
      this.name = name;
      this.loadComment();
      this.loadData()
      this.loadRating()
      console.log(this.sideBarVisible)
      if(this.sideBarVisible === false){
        this.toggleSidebar();
      }
    },
    setStart(position) {
      this.startPoint = position;
    },
    setEnd(position) {
      this.endPoint = position;
    },
    setSteps(instructions){
      for (let i = 0; i < instructions.length; i++) {
        this.tableData[i] =
        { step: instructions[i] };
      }
    },
    addSteps(instructions){
      let index = this.tableIndex
      console.log('tableIndex: '+this.tableIndex)
      for (let i = 0; i < instructions.length; i++) {
        this.tableData[i+index] = { step: instructions[i] };
        this.tableIndex++;
      }
    },
    loadComment() {
      this.$request.get(`/comment/findTree/${this.name}`)
          .then((response) => {
            if (response.code === "200") {
              this.comments = response.data
              console.log(this.comments)
            }
          })
    },
    loadRating() {
      this.$request.get('/comment/getRating', {
        params: {
          building: this.name
        }
      }).then((response) => {
        if (response.code === "200") {
          this.rating = response.data.rating
          this.reviews = response.data.reviewNumber
        }
      })
    },
    loadData() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

      this.$request.get('/building/search', {
        params: {
          name: this.name
        }
      })
          .then((response) => {
            // 使用箭头函数
            if (response.code === "200") {
              this.building = response.data
              console.log(this.building.text)
              console.log(this.building.photoUrl)
            } else {
              console.log('lost')
            }
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
    },
    handleReply(subitem) {
      this.reviewContent = {pid: subitem.id}
      this.currentReply.pname = subitem.username
      this.currentReply.pavatar = subitem.avatar
      this.replydialogVisible = true
    },
    del(id) {
      this.$request.delete("/comment/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
          this.loadComment()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleCommentButton() {
      this.reviewContent.building = this.name
      this.reviewContent.userId = this.user.id
      this.reviewContent.username = this.user.username
      console.log(this.reviewContent)
      this.$request.post("/comment", this.reviewContent).then(res => {
        if (res.code === '200') {
          this.$message.success("评论成功")
          this.reviewContent = {}  // 初始化评论对象内容
          this.loadComment()
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loadRating()
    },

    formattedDate(originalDate) {
      return dayjs(originalDate).format('YYYY年MM月DD日 HH:mm:ss');
    },

    toggleSidebar() {
      this.sideBarVisible = !this.sideBarVisible;
      this.$parent.updateMenu(this.sideBarVisible);
      // 根据侧边栏的可见性调整按钮的位置
      if (this.sideBarVisible === true){
        this.buttonStyle = "  position: absolute;\n" +
            "  top: 50%; /* 垂直居中 */\n" +
            "  left: 400px; /* 根据按钮宽度调整，确保按钮紧贴侧边栏 */\n" +
            "  transform: translateY(-50%); /* 使用transform来精确居中 */\n" +
            "  transition: left 0.3s; /* 过渡效果 */"
      }else{
        this.buttonStyle ="  position: absolute;\n" +
            "  top: 50%; /* 垂直居中 */\n" +
            "  left: 0px; /* 根据按钮宽度调整，确保按钮紧贴侧边栏 */\n" +
            "  transform: translateY(-50%); /* 使用transform来精确居中 */\n" +
            "  transition: right 0.3s; /* 过渡效果 */"
      }

    }
    ,
    getSideBarVisible(){
      return this.sideBarVisible
    },
  }

};
</script>

<style>
.sidebar {
  display: block;
  flex-direction: column; /* 如果希望子元素垂直排列 */
  width: 400px;
  position: fixed; top: 0; left: 0; height: 100%; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #f0f0f0;
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
}

.commentIsTop {
  order: -1; /* 负序号会置顶内容 */
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

>>> .el-dialog__header {
  justify-content: center;
}

.content {
  width: 400px;
  display: block;
  word-wrap: break-word;
  white-space: normal;
  padding: 10px;
  box-sizing: border-box;
}

.user-profile {
  display: flex;
  align-items: center; /* 保证内容垂直居中 */
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  margin-right: 10px; /* 头像和文本之间的距离 */
}

.avatar {
  width: 50px; /* 头像宽度 */
  height: 50px; /* 头像高度 */
  border-radius: 50%; /* 圆形头像 */
  /* 可以添加边框或阴影等 */
}

.username {
  font-size: 16px; /* 根据需要设置合适的字体大小 */
  /* 根据需要添加其他样式 */
}
.slide-enter-active{
  transform: translateX(-400px); /* 侧边栏初始位置 */
  transition: transform 0.3s ease-in-out;
}
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-to {

  transform: translateX(0px); /* 侧边栏宽度的相反方向移动 */
}
.slide-leave-to {
  transform: translateX(-100%); /* 侧边栏宽度的相反方向移动 */
}

/* 其他CSS样式 */
</style>
