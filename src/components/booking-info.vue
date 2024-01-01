<template>
  <div>
    <!-- 搜索部分 -->
    <el-input
        v-model="search.username"
        placeholder="按用户名搜索"
        @keyup.enter="fetchData"
    ></el-input>
    <el-input
        v-model="search.classroom"
        placeholder="按教室搜索"
        @keyup.enter="fetchData"
    ></el-input>
    <el-input
        v-model="search.building"
        placeholder="按建筑搜索"
        @keyup.enter="fetchData"
    ></el-input>
    <el-input
        v-model="search.floor"
        placeholder="按楼层搜索"
        @keyup.enter="fetchData"
        type="number"
    ></el-input>
    <el-button @click="fetchData">搜索</el-button>
    <el-button @click="resetSearch">重置</el-button>
    <!-- 表格 -->
    <el-table :data="bookingData" style="width: 100%" height="500px">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160"></el-table-column>
      <el-table-column prop="classroom" label="教室" width="100"></el-table-column>
      <el-table-column prop="building" label="建筑" width="100"></el-table-column>
      <el-table-column prop="floor" label="楼层" width="80"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button size="mini" @click="editBooking(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="disapproveBooking(scope.row)">不同意</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'BookingInfoManager',
  data() {
    return {
      bookingData: [],
      search: {
        username: null,
        classroom: null,
        building: null,
        floor: null
      }
    }
  },
  mounted() {
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
            console.log(this.search)
            console.log(response.data)
            this.bookingData = response.data
          })
          .catch(error => {
            console.error('Error:', error)
          })
    },
    resetSearch() {
      this.search = this.initSearch();
      this.fetchData()
    },
    editBooking(row) {

      console.log('Editing', row)
    },
    disapproveBooking(row) {

      console.log('Disapproving', row)
    }
  }
}
</script>
