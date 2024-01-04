<template>
  <div>
    <el-alert
        v-show="alertVisible"
        title="无权限"
        type="error"
        description="教室仍然存在预约信息"
        show-icon
    />
    <el-table :data="buildingData" style="width: 100%" height="500px">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="名称" width="100"></el-table-column>
      <el-table-column prop="text" label="描述" width="160"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="openBuilding(scope.row)">建筑编辑</el-button>
          <el-button size="mini" type="danger" @click="showClassrooms(scope.row.id)">显示教室</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" @click="openBuilding1()">增加教学楼</el-button>

    <el-dialog v-model="buildingDialog" title="编辑建筑详情" width="30%">
      <el-form :model="currentBuilding">
        <el-form-item label="名称">
          <el-input v-model="currentBuilding.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentBuilding.text"></el-input>
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
              class="avatar-uploader"
              :action="'http://' + serverIp + ':8080/files/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :class="{'is-success': uploadSuccess }"
          >
            <img :src="currentBuilding.photoUrl" class="avatar circular-avatar">
          </el-upload>
        </el-form-item>
        <el-form-item label="预约可用">
          <el-switch v-model="currentBuilding.bookingAvailable"></el-switch>
        </el-form-item>
        <el-form-item label="楼层数">
          <el-input-number v-model="currentBuilding.floorNumber" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="buildingDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEditBuilding">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="classroomDialog" title="教室信息" width="50%">
      <el-table :data="filteredClassrooms" style="width: 100%">
        <el-table-column prop="name" label="教室名称" width="100"></el-table-column>
        <el-table-column prop="duration" label="时长" width="100"></el-table-column>
        <el-table-column prop="floor" label="楼层" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button size="mini" @click="openEditClassroom(scope.row)">教室编辑</el-button>
            <el-button size="mini" type="danger" @click="disapproveClassroom(scope.row)">删除教室</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-button type="success" @click="openClassroom()">增加教室</el-button>
    </el-dialog>
    <el-dialog v-model="editClassroom" title="编辑教室详情" width="30%">
      <el-form :model="currentClassroom">
        <el-form-item label="教室名称">
          <el-input v-model="currentClassroom.name"></el-input>
        </el-form-item>
        <el-form-item label="容量">
          <el-input v-model="currentClassroom.duration"></el-input>
        </el-form-item>
        <el-form-item label="楼层数">
          <el-input-number v-model="currentClassroom.floor" :min="1"></el-input-number>
        </el-form-item>

      </el-form>
      <template v-slot:footer>
        <el-button @click="editClassroom = false">取消</el-button>
        <el-button type="primary" @click="submitEditClassroom">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog
        v-model="confirmDeleteClassroom"
        title="确认操作"
    >
      <span>你确定要删除这条预约信息吗？</span>
      <template v-slot:footer>
        <el-button @click="confirmDeleteClassroom = false">取消</el-button>
        <el-button type="danger" @click="deleteClassroom">删除</el-button>
      </template>
    </el-dialog>


  </div>
</template>
<script>
import {serverIp} from "../../../public/config";

export default {
  name: 'BuildingInfoManager',
  data() {
    return {
      currentBuildingId: 0,
      alertVisible: false,
      serverIp: serverIp,
      buildingData: [],
      classroomData: [],
      buildingDialog: false,
      classroomDialog: false,
      currentBuilding: {
        id: 0,
        name: '',
        text: '',
        photoUrl: '',
        bookingAvailable: true,
        floorNumber: 0
      },
      uploadSuccess: false,
      filteredClassrooms: [],
      editClassroom: false,
      currentClassroom:{
        name: '',
        buildingId: 0,
        duration: 0,
        floor: 0
      },
      confirmDeleteClassroom: false,
      currentDisapproveClassroom: null
    }
  },
  mounted() {
    this.fetchBuildingData();
    this.fetchClassroomData();
  },
  methods: {

    handleAvatarSuccess(res) {
      if (res.code === '200') { // 假设成功的code是200
        this.currentBuilding.photoUrl = res.data; // 更新图片URL
        this.uploadSuccess = true;
      } else {
        console.error('Upload error:', res.msg); // 打印错误消息
      }
      console.log(res);
    },



    fetchBuildingData() {
      this.$request.get('/building')
          .then(response => {
            if (response.code === '200') {
              this.buildingData = response.data;
              console.log('Building data:', this.buildingData);
            } else {
              console.error('Fetch error:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    openBuilding(building) {
      console.log("openBuilding method called with building:", building);
      this.currentBuilding = {...building};
      this.buildingDialog = true;
    },
    openBuilding1(){
      this.buildingDialog = true;
    },
    openClassroom(){
      this.currentClassroom.buildingId = this.currentBuildingId;
      this.editClassroom = true;
    },
    submitEditBuilding() {
      console.log(this.currentBuilding);
      this.$request.post(`/building`, this.currentBuilding)
          .then(response => {
            if(response.code === '200'){
              console.log('Update successful:', response);
              this.buildingDialog = false;
              this.currentBuilding = {
                id: 0,
                name: '',
                text: '',
                photoUrl: '',
                bookingAvailable: true,
                floorNumber: 0
              };
              this.fetchBuildingData();
            }else {
              console.log('Update error:',response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error during update:', error);
          });
    },

    fetchClassroomData() {
      this.$request.get('/classroom')
          .then(response => {
            if (response.code === '200') {
              this.classroomData = response.data;
              console.log('Classroom data:', this.classroomData);
            } else {
              console.error('Fetch error:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },


    showClassrooms(buildingId) {
      this.currentBuildingId = buildingId;
          this.filteredClassrooms = this.classroomData.filter(
          classroom => classroom.buildingId === buildingId
      );
      this.classroomDialog = true;
    },

    openEditClassroom(classroom) {
      this.currentClassroom = { ...classroom };
      this.editClassroom = true;
    },
    submitEditClassroom() {
      // 发送更新请求到服务器
      console.log(this.currentClassroom);
      this.$request.post(`/classroom`, this.currentClassroom)
          .then(response => {
            if(response.code === '200'){
              this.editClassroom = false;
              this.classroomDialog = false;
              this.fetchClassroomData();
              console.log('Edit classroom: ', response.data.name);
            }else{
              console.error('Upload error:', response.msg);
            }
          })
          .catch(error => {
            console.error('Error during update:', error);
          });
    },
    openConfirmDialog(row) {
      this.currentDisapproveClassroom = row;
      this.confirmDeleteClassroom = true;
    },

    deleteClassroom() {
      if (!this.currentDisapproveClassroom) return;
      const id = this.currentDisapproveClassroom.id;
      this.$request.delete(`/classroom/${id}`)
          .then(response => {
            if(response.code === '200'){
              console.log('Delete successful:', response);
              this.confirmDeleteClassroom = false;
              this.classroomDialog = false;
              this.editClassroom = false;
              this.fetchClassroomData();
            }else {
              console.log('Delete error:', response.data.msg);
              this.alertVisible = false;
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    disapproveClassroom(row) {
      this.openConfirmDialog(row);
    }
  }
}
</script>

<style>
.circular-avatar {
  border-radius: 50%;
  width: 100px;
  height: 100px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 100px;
  text-align: center;
}

.avatar-uploader {
  display: block;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  background: #fafafa;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
}

.is-success .avatar-uploader-icon {
  display: none;
}
</style>