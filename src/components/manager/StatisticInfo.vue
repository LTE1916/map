<template>
  <el-alert
      v-show="alertVisible"
      title="无权限"
      type="error"
      description="返回登录界面，请重新登录"
      show-icon
  />
  <div v-show="pageVisible" style="border-bottom: 1px solid #ccc; padding: 10px 0; ">
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </div>



</template>


<script>
import * as echarts from 'echarts'

export default {
  name: "StatisticInfo",
  data() {
    return {
      // buildingInfoMap: {},
      // building1Info:{},
      // building2Info:{},
      chart: null,
      chartData: {
        // 这里是你要绘制的饼图数据
      },
      alertVisible: false,
      pageVisible: true,
      info: [],
      buildingUsage:{}

    }
  },


  created() {
    if(this.$global.firstLogin){
      this.$global.setUser(JSON.parse(localStorage.getItem("user")));
      this.$global.firstLogin = false;
    }
    const user = this.$global.user
    if (user.authority !== 'ADMIN') {
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

    // 创建一个 ECharts 实例

  },
  mounted() {
    // 创建一个 ECharts 实例
    this.loadData()
    this.chart = echarts.init(this.$refs.chart)
    // 在 ECharts 实例中配置图表
  },
  methods: {
    setOption() {
      const yiJiao = this.getChartDataForYiJiao();
      const sanJiao = this.getChartDataForYiJiao1();
      const totalUsageYiJiao = this.getTotalUsageForBuilding(this.buildingUsage["第一教学楼"]);
      const totalUsageSanJiao = this.getTotalUsageForBuilding(this.buildingUsage["第三教学楼"]);
      const comparisonData = [
        { value: totalUsageYiJiao, name: '一教' },
        { value: totalUsageSanJiao, name: '三教' }
      ];
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: [
          {
            // 第一个图例，对应“一教”
            orient: 'vertical',
            left: 'left', // 将图例放置在左侧
            top: 'center', // 垂直居中
            data: yiJiao.map(item => item.name)
          },
          {
            // 第二个图例，对应“三教”
            orient: 'vertical',
            right: 'right', // 将图例放置在右侧
            top: 'center', // 垂直居中
            data: sanJiao.map(item => item.name)
          }

        ],
        series: [
          {
            name: '一教预约统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '50%'], // 将“一教”饼图放置在左侧
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: yiJiao
          },
          {
            name: '三教预约统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['75%', '50%'], // 将“三教”饼图放置在右侧
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: sanJiao
          },
          {
            // 新增的百分比图系列配置
            name: '教学楼使用对比',
            type: 'pie',
            radius: ['30%', '45%'], // 适当减小半径以适应屏幕
            center: ['50%', '75%'], // 调整中心位置，确保在屏幕上可见
            data: comparisonData
          }
        ],
        title: [
          {
            // “一教”的标题
            text: '一教预约统计',
            left: '25%',
            textAlign: 'center'
          },
          {
            // “三教”的标题
            text: '三教预约统计',
            left: '75%',
            textAlign: 'center'
          },
          {
            // 新增的百分比图标题配置
            text: '教学楼使用对比',
            left: '50%',
            top: '35%', // 调整标题位置，确保在饼图上方
            textAlign: 'center'
          }
        ]
      }
    },

    loadData() {
      this.$request.get("/booking-info/all")
      .then((response) => {
        if (response.code === "200") {
          this.info = response.data
          console.log(this.info)
          this.mapClassroomsToBuildings();
          this.$nextTick(this.updateChart);
        }
      })
    },
    updateChart() {
      this.chart.setOption(this.setOption());
    }
    ,
    mapClassroomsToBuildings() {
      const promises = this.info.map(booking => this.fetchBuildingInfo(booking.classroomId));
      Promise.all(promises).then(() => {
        this.updateChart(); // 更新图表
      });
    },
    fetchBuildingInfo(classroomId) {
      return new Promise((resolve, reject) => {
        this.$request.get(`/classroom/${classroomId}`)
            .then(response => {
              if (response.code === "200") {
                const classroomName = response.data.name;
                const buildingId = response.data.buildingId;
                this.$request.get(`/building/searchById/${buildingId}`)
                    .then(response => {
                      if (response.code === "200"){
                        const buildingName = response.data.name;
                        this.updateBuildingUsage(buildingName, classroomName);
                        resolve(); // 解析 Promise
                      }
                    })
              } else {
                resolve(); // 即使请求失败也要解析 Promise
              }
            }).catch(reject);
      });
    },
    getTotalUsageForBuilding(buildingData) {
      // 检查 buildingData 是否为 null 或 undefined
      if (!buildingData) {
        return 0; // 如果是，直接返回 0
      }
      // 如果 buildingData 是对象，则继续计算
      return Object.values(buildingData).reduce((sum, usage) => sum + usage, 0);
    }
    ,
    updateBuildingUsage(buildingName, classroomId) {
      if (!this.buildingUsage[buildingName]) {
        this.buildingUsage[buildingName] = {};
      }
      if (!this.buildingUsage[buildingName][classroomId]) {
        this.buildingUsage[buildingName][classroomId] = 0;
      }
      this.buildingUsage[buildingName][classroomId]++;
    },
    getChartDataForYiJiao() {
      const yiJiaoData = [];
      const building = this.buildingUsage["第一教学楼"];
      if (building) {
        for (const classroomId in building) {
          if (Object.prototype.hasOwnProperty.call(building, classroomId)) {
            yiJiaoData.push({
              value: building[classroomId],
              name: `一教${classroomId}`
            });
          }
        }
      }
      return yiJiaoData;
    },
    getChartDataForYiJiao1() {
      const yiJiaoData1 = [];
      const building = this.buildingUsage["第三教学楼"];
      if (building) {
        for (const classroomId in building) {
          if (Object.prototype.hasOwnProperty.call(building, classroomId)) {
            yiJiaoData1.push({
              value: building[classroomId],
              name: `三教${classroomId}`
            });
          }
        }
      }
      return yiJiaoData1;
    }
  }
}
</script>


<style scoped>




.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}



.comment-footer .time,
.comment-footer .actions {
  width: 200px;
}

.comment-footer .actions {
  text-align: right;
  flex: 1;
}


</style>