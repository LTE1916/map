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
              <span @click="selectBuilding(building)">{{ building }}</span>
            </template>
            <el-menu-item v-for="floor in floors" :key="floor" :index="(index + 1) * 10 + floor" @click="selectFloor(floor)">
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

    <!-- 教室和预约界面 -->
    <div class="content">
      <div>
        <template v-if="selectedFloor">
          <!-- FullCalendar 组件 -->
          <FullCalendar :options="calendarOptions" ref="calendarRef" class="custom-calendar"/>

          <!-- el-popover 弹窗 -->
          <el-popover
              v-model="popoverVisible"
              placement="right"
              title="教室预订"
              width="300"
          >
            <el-form label-position="top">
              <el-form-item label="教室名称">
                <el-input v-model="selectedRoomName" disabled />
              </el-form-item>
              <el-form-item label="选择的时间段">
                <el-time-picker
                    v-model="selectedTimeRange"
                    is-range
                    format="HH:mm"
                    value-format="HH:mm"
                />
              </el-form-item>
            </el-form>
          </el-popover>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { ElRow, ElCol, ElMenu, ElMenuItem, ElForm, ElFormItem, ElInput, ElTimePicker } from 'element-plus';

export default {
  components: {
    FullCalendar,
    ElRow,
    ElCol,
    ElMenu,
    ElMenuItem,
    ElForm,
    ElFormItem,
    ElInput,
    ElTimePicker,
  },
  setup() {
    const selectedBuilding = ref(null);
    const selectedFloor = ref(null);
    const selectedRoomName = ref('');
    const selectedTimeRange = ref([]);
    const popoverVisible = ref(false);
    const buildings = ['第一教学楼', '第三教学楼'];
    const floors = [1, 2, 3, 4, 5];
    const roomsPerFloor = 9;
    const calendarRef = ref(null);

    const selectBuilding = (building) => {
      selectedBuilding.value = building;
    };

    const selectFloor = (floor) => {
      selectedFloor.value = floor;
      updateFullCalendar(floor);
    };

    const getRoomsByFloor = (floor) => {
      const rooms = [];
      for (let i = 1; i <= roomsPerFloor; i++) {
        rooms.push(`${floor * 100 + i}`);
      }
      return rooms;
    };
    const handleTimeRangeSelect = (info) => {
      console.log("---------------------")
      if (info.start && info.end) {
        selectedRoomName.value = `Room ${info.resource.id}`;
        selectedTimeRange.value = [info.start, info.end];
        popoverVisible.value = true;
      }
    };
    const closeDialog = () => {
      popoverVisible.value = false;
    };
    const calendarOptions = ref({
      licenseKey: 'GPL-My-Project-Is-Open-Source',
      plugins: [dayGridPlugin, resourceTimelinePlugin,interactionPlugin],
      initialView: 'resourceTimelineDay',
      slotMinTime: '08:00:00',
      slotMaxTime: '22:00:00',
      height: '700px',
      resources: [],
      events: [],
      selectable: true,
      select: handleTimeRangeSelect,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
      },
      views: {
        resourceTimelineDay: {
          buttonText: 'Day',
        },
        resourceTimelineWeek: {
          buttonText: 'Week',
        },
        resourceTimelineMonth: {
          buttonText: 'Month',
        },
      },
    });
    const updateFullCalendar = (floor) => {
      const resources = getRoomsByFloor(floor).map((room) => ({
        id: room,
        title: `Room ${room}`,
      }));

      const events = [
        ...getRoomsByFloor(floor).map((room) => ({
          title: `Meeting ${room}`,
          resourceId: room,
          start: '2023-12-30T10:00:00',
          end: '2023-12-30T15:00:00',
          backgroundColor: 'green',
        })),
      ];

      calendarOptions.value.resources = resources;
      calendarOptions.value.events = events;
    };

    watchEffect(() => {
      if (calendarRef.value) {
        calendarRef.value.getApi().refetchEvents();
      }
    });

    return {
      selectedBuilding,
      selectedFloor,
      selectedRoomName,
      selectedTimeRange,
      popoverVisible,
      buildings,
      floors,
      roomsPerFloor,
      selectBuilding,
      selectFloor,
      getRoomsByFloor,
      calendarOptions,
      calendarRef,
      handleTimeRangeSelect,
      closeDialog,
    };
  },
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

