<template>
  <div>
    <!-- 表格 -->
    <el-table :data="bookingData" style="width: 100%; margin: 5px" height="600px">
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
export default {
  name: 'BookingInfoManager',
  data() {
    return {
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
      currentDisapproveBooking: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
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
      this.$request.post('/product', this.currentEditBooking)
          .then(response => {
            if(response.code === '200'){
              console.log('Edit successful:', response);
              this.editDialogVisible = false;
              this.fetchData();
            }else {
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
          .then(()=> {
            done();
          })
          .catch(()=> {});
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
