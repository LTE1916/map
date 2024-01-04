<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <div v-show="pageVisible">

    <!-- 表格 -->
    <el-table :data="bookingData" style="width: 100%; margin: 5px" height="500px">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column prop="type" label="文创类型" width="200"></el-table-column>
      <el-table-column prop="name" label="文创名字" width="200"></el-table-column>
      <el-table-column prop="price" label="产品单价" width="100"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="disapproveBooking(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="openAddDialog">新增</el-button>
    <el-dialog v-model="editDialogVisible" title="编辑产品信息" width="30%">
      <el-form :model="currentEditBooking">
        <el-form-item label="文创名字">
          <el-input v-model="currentEditBooking.name"></el-input>
        </el-form-item>
        <el-form-item label="产品单价">
          <el-input v-model="currentEditBooking.price"></el-input>
        </el-form-item>
        <el-form-item label="文创类型">
          <el-input v-model="currentEditBooking.type"></el-input>
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
              class="avatar-uploader"
              :action="'http://' + serverIp + ':8080/files/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :class="{'is-success': uploadSuccess }"
          >
            <img v-if="currentEditBooking.photoUrl" :src="currentEditBooking.photoUrl" class="avatar circular-avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditBooking">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog
        v-model="confirmDialogVisible"
        title="确认操作"
        :before-close="handleCloseConfirmDialog"
    >
      <span>你确定要删除这个文创产品吗？</span>
      <template v-slot:footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteBooking">删除</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {serverIp} from "../../../public/config";

export default {
  name: 'BookingInfoManager',
  data() {
    return {
      serverIp: serverIp,
      alertVisible: false,
      pageVisible: true,
      bookingData: [],
      editDialogVisible: false,
      currentEditBooking: {
        id: 0,
        name: '',
        photoUrl: '',
        price: '',
        type: ''
      },
      confirmDialogVisible: false,
      currentDisapproveBooking: null,
      uploadSuccess: false
    }
  },
  mounted() {
    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const user = this.$global.user
    if ( user.authority !== 'ADMIN') {
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
    this.fetchData()
  },
  methods: {
    openAddDialog() {
      this.currentEditBooking = {
        id: 0,
        name: '',
        photoUrl: '',
        price: '',
        type: ''
      };
      this.editDialogVisible = true;
    },
    fetchData() {
      this.$request.get('/product')
          .then(response => {
            if(response.code === '200') {
              console.log(response.data);
              this.bookingData = response.data;
              console.log('Booking data:', this.bookingData);
            }else {
              console.log('Fetch error:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error:', error)
          })
    },
    openEditDialog(booking) {
      this.currentEditBooking = { ...booking };
      this.editDialogVisible = true;
    },
    submitEditBooking() {
      if (this.currentEditBooking.id) {
        // 编辑操作
        this.$request.post('/product', this.currentEditBooking)
            .then(response => {
              if (response.code === '200') {
                console.log('Edit successful:', response);
                this.editDialogVisible = false;
                this.fetchData();
              } else {
                console.log('Edit error:', response.data.msg);
              }
            })
            .catch(error => {
              console.error('Error during update:', error);
            });
      } else {
        // 新增操作
        this.$request.post('/product', this.currentEditBooking)
            .then(response => {
              if (response.code === '200') {
                console.log('Add successful:', response);
                this.editDialogVisible = false;
                this.fetchData();
              } else {
                console.log('Add error:', response.data.msg);
              }
            })
            .catch(error => {
              console.error('Error during add:', error);
            });
      }
    },
    openConfirmDialog(row) {
      this.currentDisapproveBooking = row;
      this.confirmDialogVisible = true;
    },
    handleCloseConfirmDialog(done) {
      this.$confirm('确认关闭？')
          .then(()=> {
            done();
          })
          .catch(()=> {});
    },
    handleAvatarSuccess(res) {
      if (res.code === '200') { // 假设成功的code是200
        this.currentEditBooking.photoUrl = res.data; // 更新图片URL
        this.uploadSuccess = true;
      } else {
        console.error('Upload error:', res.msg); // 打印错误消息
      }
      console.log(res);
    },
    deleteBooking() {
      if (!this.currentDisapproveBooking) return;
      const id = this.currentDisapproveBooking.id;
      this.$request.delete(`/product/${id}`)
          .then(response => {
            if(response.code === '200'){
              console.log('Delete successful:', response);
              this.confirmDialogVisible = false;
              this.fetchData();
            }else {
              console.log('Delete error:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    disapproveBooking(row) {
      this.openConfirmDialog(row);
    }
  }
}
</script>
<style scoped>
.avatar-uploader {
  max-width: 100%; /* 限制上传组件的最大宽度 */
}

.avatar {
  max-width: 100%; /* 限制图片的最大宽度 */
  max-height: 200px; /* 限制图片的最大高度 */
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}
</style>
