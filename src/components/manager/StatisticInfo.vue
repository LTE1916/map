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
      buildingInfoMap: {},
      building1Info:{},
      building2Info:{},
      chart: null,
      chartData: {
        // 这里是你要绘制的饼图数据
      },
      alertVisible: false,
      pageVisible: true,
      info: [],

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
    this.chart.setOption(this.setOption())
  },
  methods: {
    setOption() {
      return {
        // 这里是你的 ECharts 配置项
        title: {
          text: '一教预约统计图',
          subtext: '各个教室预约情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['数据1', '数据2', '数据3', '数据4', '数据5']
        },
        series: [
          {
            name: '一教预约统计图',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
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
            data: [
              {value: 335, name: '数据1'},
              {value: 310, name: '数据2'},
              {value: 234, name: '数据3'},
              {value: 135, name: '数据4'},
              {value: 1548, name: '数据5'}
            ]
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
        }
      })
    },
    analysisData(){
      this.info.forEach(item => {
        // 发送请求以获取每个classroomId对应的building信息
        this.$request.post(`/booking-info/Room/${item.classroomId}`)
        .then((response) => {
          if (response.code === "200") {
            const buildingName = response.data.building; // 假设响应中有一个名为building的字段表示建筑物名称
            // 统计每个建筑物的info总数
            if (this.buildingInfoMap[buildingName]) {
              this.buildingInfoMap[buildingName]++;
            } else {
              this.buildingInfoMap[buildingName] = 1;
            }
          }
        })
        .catch(error => {
          console.error("Error fetching building info:", error);
        });
      });
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