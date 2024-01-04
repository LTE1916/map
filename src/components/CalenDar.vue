<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <div class="container" v-show="pageVisible">
    <el-row class="tac">
      <el-col :span="24">
        <h1 class="mb-2" style="font-weight: bold; font-size: 30px; text-align: center;">教室预订</h1>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            style="width: 400px"
        >
          <el-sub-menu v-for="(building, index) in buildings" :key="index" :index="index + 1">
            <template #title>
              <span>{{ building.name }}</span>
            </template>
            <el-menu-item
                v-for="floor in getFloors(building.floorNumber)"
                :key="floor"
                :index="(index + 1) * 10 + floor"
                @click="selectFloor(building,floor)">
              {{ floor }}楼
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="4">
            <span>统计数据</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span>我的预约</span>
          </el-menu-item>

        </el-menu>
      </el-col>
    </el-row>

    <div class="content">
      <div>
        <template v-if="selectedFloor">
          <FullCalendar :options="this.calendarOptions" ref="calendarRef" class="custom-calendar"/>
          <el-dialog
              v-model="dialogVisible"
              title="教室预订"
              width="50%"
              class="custom-dialog"
          >
            <el-form :model="reservation" label-position="top">
              <el-form-item label="当前建筑">
                <span>{{ selectedBuilding ? selectedBuilding.name : '-' }}</span>
              </el-form-item>
              <el-form-item label="当前楼层">
                <span>{{ selectedFloor ? selectedFloor : '-' }}</span>
              </el-form-item>
              <el-form-item label="当前房间号">
                <span>{{ selectedRoomName ? selectedRoomName : '-' }}</span>
              </el-form-item>
              <el-form-item label="预约时间">
                <span>{{ formatReservationTime(selectedTimeRange) }}</span>
              </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="confirmReservation">
                Confirm
              </el-button>
            </span>
            </template>
          </el-dialog>
        </template>
      </div>
    </div>


  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import {ElCol, ElMenu, ElMenuItem, ElRow} from 'element-plus';

export default {
  components: {
    FullCalendar,
    ElRow,
    ElCol,
    ElMenu,
    ElMenuItem,
  },
  data() {
    return {
      selectedBuilding: null,
      selectedFloor: null,
      selectedRoomName: '',
      selectedTimeRange: [null, null],
      dialogVisible: false,
      alertVisible: false,
      pageVisible: true,
      reservation: {},
      user: {},
      buildings: [],
      calendarRef: null,
      calendarOptions: {
        licenseKey: 'GPL-My-Project-Is-Open-Source',
        plugins: [dayGridPlugin, resourceTimelinePlugin, interactionPlugin],
        initialView: 'resourceTimelineDay',
        slotMinTime: '08:00:00',
        slotMaxTime: '24:00:00',
        height: '700px',
        resources: [],
        events: [],
        selectable: {
          time: true,
          select: this.handleTimeRangeSelect,
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
        },
        views: {
          resourceTimelineDay: {buttonText: 'Day'},
          resourceTimelineWeek: {buttonText: 'Week'},
          resourceTimelineMonth: {buttonText: 'Month'},
        },
        datesSet: (info) => {
          this.disablePrevButton(info);
        },
      },

    };
  },
  created() {

    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const userInfo = this.$global.user

    if (userInfo.authority !== 'USER'&& userInfo.authority !== 'ADMIN') {
      this.alertVisible = true;
      this.pageVisible = false;
      setTimeout(() => {
        // 在等待2秒后执行的逻辑
        this.$router.push('/login');
      }, 2000);

    }
    this.loadData()
  },
  methods: {
    disablePrevButton(info) {
      const currentDate = new Date();
      const calendarStartDate = info.start;
      const prevButton = document.querySelector('.fc-prev-button');

      if (prevButton) {
        prevButton.disabled = calendarStartDate <= currentDate;
      }
    },
    formatReservationTime(timeRange) {
      const start = this.formatTime(timeRange[0]);
      const end = this.formatTime(timeRange[1]);
      return `${this.formatDay(timeRange[0])}：${start}-${end}`;
    },

    formatDay(date) {
      const options = {weekday: 'short'};
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },

    formatTime(date) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
    },
    confirmReservation() {
      this.$request.post('/booking-info', {
        username: this.user.username,
        startTime: this.formatTimeForBackend(this.selectedTimeRange[0]),
        endTime: this.formatTimeForBackend(this.selectedTimeRange[1]),
        classroom: this.selectedRoomName,
        building: this.selectedBuilding.name,
        floor: this.selectedFloor,
      }).then((response) => {
        if (response.code === '200') {
          this.$message.success('预约提交成功');
          this.updateFullCalendar(this.selectedBuilding,this.selectedFloor);
          this.dialogVisible = false;
        } else {
          this.$message.error('预约提交失败');
        }
      }).catch((error) => {
        console.error('提交预约时发生错误:', error);
        this.$message.error('提交预约时发生错误');
      });
    },
    formatTimeForBackend(time) {
      const utcTime = new Date(time.getTime() - time.getTimezoneOffset() * 60000);
      return utcTime.toISOString();
    },
    loadData() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
      this.$request.get('/booking-info/building').then((res) => {
        if (res.code === "200") {
          this.buildings = res.data
          console.log("buildings")
          console.log(this.buildings)
        } else {
          console.error("get building information error")
        }
      })
    },
    loadClassroom(building, floor) {
      return this.$request.get(`/classroom/searchFloor?building=${building}&floor=${floor}`).then((res) => {
        if (res.code === "200") {
          const classrooms = res.data;
          this.calendarOptions.resources = classrooms.map(classroom => ({
            id: classroom.id,
            title: classroom.name
          }));
          console.log(classrooms)
          return classrooms;
        } else {
          console.error("fail");
          throw new Error('Request failed');
        }
      }).catch((error) => {
        console.error('Error during API request:', error);
        throw error;
      });
    },

    async loadCurEvents(classrooms) {
      for (const classroom of classrooms) {
        try {
          // 发送 POST 请求
          this.$request.post('/booking-info/Room', classroom).then((response) => {
            const classroomEvents = response.data;
            for (const booking of classroomEvents) {
              const event = {
                resourceId: classroom.id,
                start: booking.startTime,
                end: booking.endTime,
                username: booking.username,
                backgroundColor: 'green'
              };
              console.log(event);
              this.calendarOptions.events.push(event);
            }
          })
          // 假设响应中的数据是我们需要的事件数组
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
    },
    selectFloor(building, floor) {
      this.selectedBuilding = building;
      this.selectedFloor = floor;
      console.log(this.selectedFloor)
      this.updateFullCalendar(building, floor);
    },
    handleTimeRangeSelect(info) {
      if (info && info.start && info.end && typeof info.start.getHours === 'function' && typeof info.end.getHours === 'function' && info.start > new Date()) {
        const isOverlap = this.isTimeRangeOverlap(info.start, info.end, info);

        if (!isOverlap) {
          this.selectedRoomName = info.resource.title;
          this.selectedTimeRange = [info.start, info.end];
          this.dialogVisible = true;
        } else {
          this.$message.error('所选时间段已被预约或有重叠，请重新选择');
        }
      } else {
        console.error("Invalid or missing information for time range selection");
      }
    },
    isTimeRangeOverlap(newStartTime, newEndTime, info) {
      const events = this.calendarOptions.events;
      const currentUser = this.user.username; // 获取当前用户的用户名
      console.log(newEndTime);
      console.log(newStartTime);
      for (const event of events) {
        const eventStartTime = new Date(event.start);
        const eventEndTime = new Date(event.end);
        console.log(eventStartTime);
        console.log(eventEndTime);
        if(event.resourceId === info.resource.id && ((newStartTime >= eventStartTime && newStartTime < eventEndTime) ||
            (newEndTime > eventStartTime && newEndTime <= eventEndTime) ||
            (newStartTime <= eventStartTime && newEndTime >= eventEndTime)))
        {
          return true;
        }
        if (
            ((event.resourceId === info.resource.id && event.username !== currentUser) &&
                ((newStartTime >= eventStartTime && newStartTime < eventEndTime) ||
                    (newEndTime > eventStartTime && newEndTime <= eventEndTime) ||
                    (newStartTime <= eventStartTime && newEndTime >= eventEndTime)))||
            ((event.resourceId === info.resource.id && event.username === currentUser) &&
                ((newStartTime >= eventStartTime && newStartTime < eventEndTime) ||
                    (newEndTime > eventStartTime && newEndTime <= eventEndTime) ||
                    (newStartTime <= eventStartTime && newEndTime >= eventEndTime)))||
            ((event.resourceId !== info.resource.id && event.username === currentUser) &&
                ((newStartTime >= eventStartTime && newStartTime < eventEndTime) ||
                    (newEndTime > eventStartTime && newEndTime <= eventEndTime) ||
                    (newStartTime <= eventStartTime && newEndTime >= eventEndTime)))
        ) {
          return true;
        }
      }
      return false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    getFloors(floor) {
      console.log(floor)
      console.log(Array.from({length: floor}, (_, i) => i + 1))
      return Array.from({length: floor}, (_, i) => i + 1);
    },
    updateFullCalendar(building, floor) {
      console.log("updateFull")
      this.calendarOptions.events = [];
      this.loadClassroom(building.name, floor).then(classrooms => {
        this.loadCurEvents(classrooms)
      }).catch(error => {
        console.error('Error loading classrooms:', error);
      });
    }
  },
  mounted() {
    this.calendarOptions.select = this.handleTimeRangeSelect;
    this.$watch(() => this.calendarRef, (newVal) => {
      if (newVal) {
        newVal.getApi().refetchEvents();
      }
    });
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(to right, var(--el-color-primary-light-8), #BC8F8F);
  min-height: 94vh;
}

.content {
  width: 80%;
  padding: 20px;
  box-sizing: border-box;
}

.custom-calendar {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.custom-dialog {
  border-radius: 10px;
}
</style>

