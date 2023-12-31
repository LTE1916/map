<template>
  <div class="container">
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
              <span >{{ building.name}}</span>
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
          <!-- FullCalendar 组件 -->
          <FullCalendar :options="this.calendarOptions" ref="calendarRef" class="custom-calendar"/>

          <el-dialog
              v-model="dialogVisible"
              title="Tips"
              width="30%"
          >
            <span>This is a message</span>
            <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="dialogVisible = false">
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
      reservation:{},
      buildings: [],
      roomsPerFloor: 9,
      calendarRef: null,
      calendarOptions: {
        licenseKey: 'GPL-My-Project-Is-Open-Source',
        plugins: [dayGridPlugin, resourceTimelinePlugin, interactionPlugin],
        initialView: 'resourceTimelineDay',
        slotMinTime: '08:00:00',
        slotMaxTime: '22:00:00',
        height: '700px',
        resources: [],
        events: [],
        selectable: true,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
        },
        views: {
          resourceTimelineDay: { buttonText: 'Day' },
          resourceTimelineWeek: { buttonText: 'Week' },
          resourceTimelineMonth: { buttonText: 'Month' },
        },
      },

    };
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
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
    // loadAllEvent(){
    //   this.$request.get('/booking-info/all').then((res)=>{
    //     if (res.code ==="200"){
    //       const events = res.data;
    //
    //     }else{
    //       console.error("all")
    //     }
    //   })
    // },
    loadClassroom(building, floor) {
      return this.$request.get(`/classroom/searchFloor?building=${building}&floor=${floor}`).then((res) => {
        if (res.code === "200") {
          const classrooms = res.data;
          this.calendarOptions.resources = classrooms.map(classroom => ({
            id: classroom.id,
            title: classroom.name
          }));
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

    async loadCurEvents(classrooms){
      for (const classroom of classrooms) {
        try {
          // 发送 POST 请求
          this.$request.post('/booking-info/Room', classroom).then((response)=>{
            const classroomEvents = response.data;
            for (const booking of classroomEvents) {
              const event = {
                resourceId: classroom.id,
                start: booking.startTime,
                end: booking.endTime,
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
    selectFloor(building,floor) {
      this.selectedFloor = floor;
      console.log(this.selectedFloor)
      this.updateFullCalendar(building,floor);
    },
    handleTimeRangeSelect(info) {
      console.log("Info:", info);
      if (
          info &&
          info.start &&
          info.end &&
          typeof info.start.getHours === 'function' &&
          typeof info.end.getHours === 'function'
      ) {
        this.selectedRoomName = `Room ${info.resource.id}`;
        this.selectedTimeRange = [info.start, info.end];
        this.dialogVisible = true;
        console.log(info)
      } else {
        console.error("Invalid or missing information for time range selection");
      }
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    getFloors(floor) {
      console.log(floor)
      console.log(Array.from({ length: floor }, (_, i) => i + 1))
      return Array.from({ length: floor }, (_, i) => i + 1);
    },
    updateFullCalendar(building, floor) {
      console.log("updateFull")
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
  background-image: url('@/assets/1.jpg');
  background-size: cover;
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

</style>

