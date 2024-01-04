<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <div v-show="pageVisible">
    <el-input
        v-model="search.username"
        placeholder="按用户名搜索"
        @keyup.enter="fetchData"
        :style="{ width: '50%', margin: '5px' }"
    ></el-input>
    <el-input
        v-model="search.classroom"
        placeholder="按教室搜索"
        @keyup.enter="fetchData"
        :style="{ width: '50%', margin: '5px' }"
    ></el-input>
    <el-input
        v-model="search.building"
        placeholder="按建筑搜索"
        @keyup.enter="fetchData"
        :style="{ width: '50%', margin: '5px' }"
    ></el-input>
    <el-input
        v-model="search.floor"
        placeholder="按楼层搜索"
        @keyup.enter="fetchData"
        :style="{ width: '50%', margin: '5px' }"
        type="number"
    ></el-input>
    <el-button @click="fetchData" style="margin-left: 5px;">搜索</el-button>
    <el-button @click="resetSearch" style="margin-left: 10px;">重置</el-button>

    <!-- 表格 -->
    <el-table :data="bookingData" style="width: 100%; margin: 5px" height="500px">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="200"></el-table-column>
      <el-table-column prop="classroomId" label="教室编号" width="200"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="200"></el-table-column>
      <el-table-column prop="classroom" label="教室" width="100"></el-table-column>
      <el-table-column prop="building" label="建筑" width="100"></el-table-column>
      <el-table-column prop="floor" label="楼层" width="100"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="disapproveBooking(scope.row)">不同意</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="editDialogVisible" title="编辑预约信息" width="30%">
      <el-form :model="currentEditBooking">
        <el-form-item label="用户名">
          <el-input v-model="currentEditBooking.username"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="currentEditBooking.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="currentEditBooking.endTime"></el-input>
        </el-form-item>

<!--        <el-form-item label="教室">-->
<!--          <el-input v-model="currentEditBooking.classroom"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="建筑">-->
<!--          <el-input v-model="currentEditBooking.building"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="楼层">-->
<!--          <el-input v-model="currentEditBooking.floor"></el-input>-->
<!--        </el-form-item>-->
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
      <span>你确定要删除这条预约信息吗？</span>
      <template v-slot:footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteBooking">删除</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'BookingInfoManager',
  data() {
    return {
      alertVisible: false,
      pageVisible: true,
      bookingData: [],
      search: {
        username: null,
        classroom: null,
        building: null,
        floor: null
      },
      editDialogVisible: false,
      currentEditBooking: {
        id: 0,
        username: '',
        startTime: '',
        endTime: '',
        classroomId: 0,
      },
      confirmDialogVisible: false,
      currentDisapproveBooking: null
    }
  },

  mounted() {
    if (this.$global.firstLogin) {
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const user = this.$global.user
    console.log(user)
    if (user.authority !== 'ADMIN') {
      this.alertVisible = true;
      this.pageVisible = false;
      setTimeout(() => {
        // 在等待2秒后执行的逻辑
        if (this.$global.user.authority === 'GUEST') {
          this.$router.push('/login');
        } else {
          this.$router.push('/map');
        }
      }, 2000);
    }
    this.fetchData()
  },
  methods: {
    initSearch() {
      return {
        username: null,
        classroom: null,
        building: null,
        floor: null
      };
    },
    fetchData() {
      this.$request.post('/booking-info/all', this.search)
          .then(response => {
            if (response.code === '200') {
              console.log(this.search);
              console.log(response.data);
              this.bookingData = response.data;
              for (let i = 0; i < this.bookingData.length; i++) {
                this.$request.get('/', this.bookingData[i]).then(res => {
                  this.bookingData[i].building = res.data.building;
                  this.bookingData[i].classroom = res.data.classroom;
                  this.bookingData[i].floor = res.data.floor;
                })
              }
              console.log('Booking data:', this.bookingData);
            } else {
              console.log('Fetch error:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('Error:', error)
          })
    },
    resetSearch() {
      this.search = this.initSearch();
      this.fetchData()
    },
    openEditDialog(booking) {
      this.currentEditBooking = {...booking};
      this.editDialogVisible = true;
    },
    submitEditBooking() {
      this.$request.post('/booking-info', this.currentEditBooking)
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
    },
    openConfirmDialog(row) {
      this.currentDisapproveBooking = row;
      this.confirmDialogVisible = true;
    },
    handleCloseConfirmDialog(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
    deleteBooking() {
      if (!this.currentDisapproveBooking) return;
      const id = this.currentDisapproveBooking.id;
      this.$request.delete(`/booking-info/${id}`)
          .then(response => {
            if (response.code === '200') {
              console.log('Delete successful:', response);
              this.confirmDialogVisible = false;
              this.fetchData();
            } else {
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
