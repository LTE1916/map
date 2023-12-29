<template>

  <div class="custom-div" >

    <div class="app-container">
      <div style="background-color: #ffffff;">
        <div id="container"></div>
      </div>
  </div>

    <el-popover
        v-model:visible= popoverVisible
        trigger="manual"
        :title="title"
        width="500"
        height="1600"
        :style="{ top: popoverTop, left: popoverLeft }">
      <el-button type="danger" size="small"  @click="popoverVisible = false"
                 style="position: absolute; top: 0; right: 0;">close
      </el-button>
        <!-- 添加弹出内容 -->
      <div>{{ introduction }}</div>
      <el-button type="primary" size="small" @click="openReviewForm"
          >Review</el-button>
        <!-- Review form -->
        <div v-if="reviewFormVisible">
          <!-- Add input fields or file upload for text and images -->
          <textarea v-model="reviewText" placeholder="Enter your review"></textarea>
<!--          <input type="file" @change="handleFileUpload" accept="image/*">-->
          <el-upload
              ref="fileUpload"
              action="/upload"
              multiple
              accept="image/*"
              :on-change="handleFileUpload"
          >
            <el-button type="primary" size="small">Select Images</el-button>
          </el-upload>
<!--          <button @click="submitReview">Submit</button>-->
          <el-button
              type="primary"
              size="small"
              style=""
              @click="reviewFormVisible ? submitReview() : popoverVisible = false"
          >
            {{ reviewFormVisible ? 'Submit' : 'Close' }}
          </el-button>
        </div>
    </el-popover>
    <div>
      <sidebar  ref="sidebarRef"></sidebar> <!-- 在map.vue中使用sidebar组件 -->
    </div>
  </div>
  <el-menu class = "custom-menu-container" mode="horizontal" text-color="#ffffff" active-text-color="#ffd04b"
           background-color="transparent ">
    <el-button :icon="House"  class="custom-button" @click="navigateTo('0')">主页</el-button>
    <el-button :icon="ChatLineSquare" class="custom-button" @click="navigateTo('1')">论坛</el-button>
    <el-button :icon="Timer" class="custom-button" @click="navigateTo('2')">教室预定</el-button>
    <el-button :icon="ShoppingCart" class="custom-button" @click="navigateTo('3')"> 文创购物 </el-button>
    <el-button :icon="Van" class="custom-button" @click="navigateTo('4')"> 公交站点 </el-button>
    <el-button :icon="Search" class="custom-button" @click="navigateTo('5')"> 导航 </el-button>
    <el-button :icon="ArrowLeft" round >test button</el-button>
  </el-menu>

</template>

<script>

import AMapLoader from '@amap/amap-jsapi-loader';

import Sidebar from './SideBar.vue'; // 导入sidebar.vue组件
import {ElButton, ElPopover, ElUpload } from 'element-plus';
import 'element-plus/dist/index.css'

import {getCurrentInstance, onMounted, ref} from "vue";
import {House,ChatLineSquare,Timer,ShoppingCart,Search,ArrowLeft,Van} from "@element-plus/icons-vue";
export default {
  components: {
    Sidebar,
    ElUpload,
    ElButton,
    ElPopover,

  },
  setup(){
    const map = ref(null);
    const amap = ref(null)
    const markers = [];
    const busStationMarkers = [];
    const line1Markers = [];//公交线路，内部存marker
    const line2Markers = [];
    const line3Markers = [];
    const line4Markers = [];
    let nearStartRecords = [];//起点附近3个站点的信息
    let nearEndRecords = [];//终点附近3个站点的信息
    const bus_line1 = ref(null);
    const bus_line2 = ref(null);
    const walking_line = ref(null); //步行导航
    const showBuildingMarkFlag = ref(true);
    const showBusStationMarkFlag = ref(false);
    const shownavigationFlag = ref(false);
    const busStationOverlay = ref(null);
    const buildingOverlay = ref(null);
    const navigationOverlay = ref(null);
    const popoverVisible = ref(false);
    const navigationFlag = ref(false);
    const chooseStartFlag = ref(true);
    const start = ref('');
    const end = ref('');

    const title = ref('');
    const introduction = ref('');
    const username = ref("");
    const authority = ref("");
    const library1 = ref(null);
    const library2 = ref(null);
    const library3 = ref(null);
    const dormitory1= ref(null);
    const dormitory2 = ref(null);
    const dormitory3 = ref(null);
    const dormitory4 = ref(null);
    const dormitory5 = ref(null);
    const dormitory6 = ref(null);
    const dormitory7 = ref(null);
    const dormitory8 = ref(null);
    const dormitory9 = ref(null);
    const dormitory10 = ref(null);
    const dormitory11 = ref(null);
    const dormitory12 = ref(null);
    const dormitory13 = ref(null);
    const dormitory14 = ref(null);
    const dormitory15 = ref(null);
    const dormitory16 = ref(null);
    const dormitory17 = ref(null);
    const cafeteria1 = ref(null)
    const  cafeteria2 = ref(null)
    const  cafeteria3 = ref(null)
    const cafeteria4 = ref(null)
    const cafeteria5 = ref(null)
    const cafeteria6 = ref(null)
    const teaching_building1 = ref(null)
    const teaching_building2 = ref(null)
    const teaching_building3 = ref(null)
    const research_building1 = ref(null)
    const research_building2 = ref(null)
    const research_building3 = ref(null)
    const college1 = ref(null)
    const college2 = ref(null)
    const college3 = ref(null)
    const college4 = ref(null)
    const college5 = ref(null)
    const college6 = ref(null)
    const college7 = ref(null)
    const college8 = ref(null)
    const jiu_hua = ref(null)
    const office = ref(null)
    const administrative_building = ref(null)
    const popoverTop = ref(0);
    const popoverLeft = ref(0);
    const faculty_apartment1 = ref(null)
    const faculty_apartment2 = ref(null)
    const faculty_apartment3 = ref(null)
    const faculty_apartment4 = ref(null)
    const faculty_apartment5 = ref(null)
    const faculty_apartment6 = ref(null)
    const gym1 = ref(null)
    const gym2 = ref(null)
    const gym3 = ref(null)
    const reviewFormVisible = ref(false);
    const reviewText = ref('');
    const selectedFile = ref(null);
    const startIcon = ref(null);
    const endIcon = ref(null);
    const activeSidebar = ref(false);

    const xing_yuan = ref(null)
    const hui_yuan = ref(null)
    const chuang_yuan = ref(null)
    const li_yuan = ref(null)
    const student_dormitry = ref(null)
    const community_health_center = ref(null)
    const faculty_cafeteria = ref(null)
    const guest_house = ref(null)
    const gate3 = ref(null)
    const gate2 = ref(null)
    const gate1 = ref(null)
    const administration_building = ref(null)
    const gate7 = ref(null)
    const research_building = ref(null)
    const COEN = ref(null)
    const COES = ref(null)
    const SideBarRef = ref(null);
    const { proxy } = getCurrentInstance();
    const navigateTo = (index) => {

      switch (index) {
        case '0':
          showMainPage();
          break;
        case '1':
          // window.location.href = 'http://
          break;
        case '2':
          // window.location.href = 'http://
          break;
        case '3':
          //  window.location.href = 'http://
          break;
        case '4':
          showBusStationMarkers();
          break;
        case '5':
          handleNavigation();
      }

      // Add logic to handle navigation based on index
    };
    const openReviewForm = () => {
      reviewFormVisible.value = true;
    };

    const handleFileUpload = (event) => {
      // Handle file upload logic, set selectedFile value
      selectedFile.value = event.target.files[0];
    };

    const submitReview = () => {//到时候提交给后台
      // Implement the logic to submit the review (text and/or image)
      console.log('Review Text:', reviewText.value);
      console.log('Selected File:', selectedFile.value);

      // Close the review form after submission
      reviewFormVisible.value = false;
    };

    const showMainPage = () => {
      showBuildingMarkFlag.value = true;
      showBusStationMarkFlag.value = false;
      shownavigationFlag.value = false;
      for (let i = 0; i < markers.length; i++) {
        markers[i].show();
      }
      for (let i = 0; i < busStationMarkers.length; i++) {
        busStationMarkers[i].hide();
      }
      bus_line1.value.hide();
      bus_line2.value.hide();
      navigationOverlay.value.hide()
      SideBarRef.value.resetSideBar()
    }

    const showBusStationMarkers = () => {
      showBusStationMarkFlag.value = true;
      showBuildingMarkFlag.value = false;
      for (let i = 0; i < markers.length; i++) {
        markers[i].hide();
      }
      for (let i = 0; i < busStationMarkers.length; i++) {
        busStationMarkers[i].show();
      }
      bus_line1.value.show();
      bus_line2.value.show();
    }

    const handleNavigation = () => {
      navigationFlag.value = true;
      SideBarRef.value.handleNavigate();
      // Implement the logic to navigate to the desired location
    }
    const confirmNavigation = (navigationMethod) => {
      navigationOverlay.value.clearOverlays();
      console.log(`Start: ${start.value}, End: ${end.value}`);
      if (start.value === '' && end.value === '') {
        alert("请选择起点和终点");
      }else if(start.value === end.value){
        alert("起点和终点不能相同");
      }else if (start.value === '') {
        alert("请选择起点");
      }else if (end.value === '') {
        alert("请选择终点");
      }else {
        const mapValue = map.value;

        // 执行导航逻辑
        mapValue.plugin(["AMap.Walking"], function() {
          const walking = new amap.value.Walking({
          });
          if (navigationMethod === 'walk'){
            walking.search(start.value, end.value,function(status, result) {
              if (status === 'complete') {
                const steps = result.routes[0].steps;
                let path = [];
                let instructions = [];
                for (let i = 0; i < steps.length; i++) {
                  path = path.concat(steps[i].path);
                  instructions.push(steps[i].instruction)
                }
                SideBarRef.value.setSteps(instructions);
                walking_line.value = new amap.value.Polyline({
                  strokeOpacity:1,
                  strokeWeight: 6,  // 线宽
                  borderWeight: 1,  // 线宽
                  strokeColor: "#63e398",  // 线颜色

                  lineJoin: 'round'  // 折线拐点连接处样式
                });
                walking_line.value.setPath(path)
                walking_line.value.setMap(mapValue);
                navigationOverlay.value.addOverlay(walking_line.value)
                // 路线规划成功
                chooseStartFlag.value = true;
                navigationFlag.value = false;
              }
            });
          }

          else if (navigationMethod === 'bus'){
            // buildingOverlay.value.hide();
            // busStationOverlay.value.show();
            console.log('bus')
            const walking = new amap.value.Walking();


            const bus_route_mid = new amap.value.Polyline({
              strokeOpacity:1,
              strokeWeight: 6,
              borderWeight: 1,
              strokeColor: "#7e99f4",

              lineJoin: 'round'
            });

            const nearestStartStation = nearestStations(busStationMarkers, start.value,3);
            //nearestStartStation是marker数组
            const nearestEndStation = nearestStations(busStationMarkers, end.value,3);
            for (let i = 0; i < nearestStartStation.length; i++) {

              walking.search(start.value, nearestStartStation[i].getPosition(),function(status, result) {
                const instructions = [];
                if (status === 'complete') {
                  let tmpPath = [];
                  const steps = result.routes[0].steps;
                  for (let i = 0; i < steps.length; i++) {
                    tmpPath = tmpPath.concat(steps[i].path);
                    if(i === steps.length - 1){
                      instructions.push(steps[i].instruction.slice(0,-5))
                    }else {
                      instructions.push(steps[i].instruction)
                    }

                  }
                  addStartNearStation(nearestStartStation[i], result.routes[0].distance , tmpPath, instructions,nearestStartStation.length)
                }
              });
            }

            //todo 后端获取公交

            for (let i = 0; i < nearestStartStation.length; i++) {
              walking.search(nearestEndStation[i].getPosition(), end.value,function(status, result) {
                const instructions = [];
                if (status === 'complete') {
                  let tmpPath = [];
                  const steps = result.routes[0].steps;
                  for (let i = 0; i < steps.length; i++) {
                    tmpPath = tmpPath.concat(steps[i].path);
                    instructions.push(steps[i].instruction)
                  }

                  addEndNearStation(nearestEndStation[i],result.routes[0].distance ,tmpPath, instructions,nearestEndStation.length)
                }
              });
            }


            navigationOverlay.value.addOverlay(bus_route_mid)

            }

          const startMarker = new amap.value.Marker({position:start.value,icon:startIcon.value})
          const endMarker = new amap.value.Marker({position:end.value,icon:endIcon.value})
          startMarker.setMap(map.value)
          endMarker.setMap(map.value)
          navigationOverlay.value.addOverlay(startMarker)
          navigationOverlay.value.addOverlay(endMarker)
          shownavigationFlag.value = true
        })
    }
    };

    const addStartNearStation = (nearestStartStation,distance, tmpPath, instructions, num) => {
      nearStartRecords.push({
        station: nearestStartStation,
        distance:distance,
        path: tmpPath,
        instructions: instructions
      });
      if (num === nearStartRecords.length) {
        const minDistanceRecord = nearStartRecords.reduce((minRecord, record) => {
          return (minRecord.distance < record.distance) ? minRecord : record;
        });
        // 比较传入的三个值
        console.log(minDistanceRecord.station)
        const bus_route_start = new amap.value.Polyline({
          strokeOpacity:1,
          strokeWeight: 6,
          borderWeight: 1,
          strokeColor: "#925eb0",

          lineJoin: 'round'
        });
        bus_route_start.setPath(minDistanceRecord.path)
        bus_route_start.setMap(map.value);
        navigationOverlay.value.addOverlay(bus_route_start)
        SideBarRef.value.addSteps(minDistanceRecord.instructions)
        nearStartRecords=[];
      }

    }

    const addEndNearStation = (nearestStartStation, distance, tmpPath, instructions, num) =>{
      nearEndRecords.push({
        station: nearestStartStation,
        distance:distance,
        path: tmpPath,
        instructions: instructions
      });
      if (num === nearEndRecords.length) {
        const minDistanceRecord = nearEndRecords.reduce((minRecord, record) => {
          return (minRecord.distance < record.distance) ? minRecord : record;
        });
        const bus_route_end = new amap.value.Polyline({
          strokeOpacity:1,
          strokeWeight: 6,
          borderWeight: 1,
          strokeColor: "#925eb0",

          lineJoin: 'round'
        });
        bus_route_end.setPath(minDistanceRecord.path)
        bus_route_end.setMap(map.value);
        navigationOverlay.value.addOverlay(bus_route_end)
        SideBarRef.value.addSteps(minDistanceRecord.instructions)
        nearEndRecords=[];
      }

    }

    const nearestStations = (line, position, numOfNearestStations) => {
      //返回最近的N个车站
      line.sort((a, b) => {
        const distanceA = amap.value.GeometryUtil.distance(position, a.getPosition());
        const distanceB = amap.value.GeometryUtil.distance(position, b.getPosition());
        return distanceA - distanceB;
      });

      return line.slice(0, numOfNearestStations);
    };


    const handleDormitoryClick = ($event) => {
      if (navigationFlag.value) {
        if(chooseStartFlag.value){
          start.value = $event.target._originOpts.position;
          SideBarRef.value.setStart(start.value);
          chooseStartFlag.value = false;
        }else {
          end.value = $event.target._originOpts.position;
          SideBarRef.value.setEnd(end.value);
          chooseStartFlag.value = true;
        }
      }else {
      popoverVisible.value = true;
      title.value = $event.target._originOpts.title;
      SideBarRef.value.setName(title.value);
    }

    };
    onMounted(() => {

      SideBarRef.value = proxy.$refs.sidebarRef;
      window._AMapSecurityConfig = {
        securityJsCode: '9cd0ae12178c767342bff17cbf6ed653',
      }
        AMapLoader.load({key: 'c7a4dd8b9777a66796d5b71cf0839982', version: '2.0'}).then((AMap) => {
          amap.value = AMap;

          startIcon.value = new AMap.Icon({
            size: new AMap.Size(25, 34), //图标尺寸
            image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png", //Icon 的图像
            imageOffset: new AMap.Pixel(-9, -3), //图像相对展示区域的偏移量，适于雪碧图等
            imageSize: new AMap.Size(135, 40), //根据所设置的大小拉伸或压缩图片
          });
          endIcon.value = new AMap.Icon({
            size: new AMap.Size(25, 34), //图标尺寸
            image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png", //Icon 的图像
            imageOffset: new AMap.Pixel(-95, -3),
            imageSize: new AMap.Size(135, 40),
          });
          const mask = [[
            [113.994771,22.602154], [113.995249,22.599787], [113.996525,22.598672],
            [113.996802,22.598004], [113.996937,22.598158], [113.996851,22.597628],
            [113.996483,22.597012], [113.995271,22.59622], [113.995314,22.592209],
            [113.998694,22.59214], [113.999611,22.592532], [114.005693,22.596245],
            [114.008472,22.596811], [114.010088,22.599401], [114.012155,22.602529],
            [114.010962,22.603081], [114.009042,22.602952], [114.008081,22.604948],
            [114.003897,22.606869], [114.002856,22.607672], [114.003066,22.608132],
            [114.001995,22.609076], [114.000863,22.607818], [113.999511,22.605699],
            [113.995949,22.604342],
        ]]//掩盖区域
          const buildingLayer = new AMap.Buildings({zooms:[16.75,20]});
          var options = {
                hideWithoutStyle:true,//是否隐藏设定区域外的楼块
                areas:[
                    { //宿舍11-17
                  //visible:false,//是否可见
                  //rejectTexture:true,是否屏蔽自定义地图的纹理
                  color1: 'ffffff00',//楼顶颜色
                  color2: 'ffffcccc',//楼面颜色
                  path: [[114.001226,22.602211],[114.001582,22.60292],[114.000579,22.603173],
                    [113.998755,22.602257],[113.999455,22.601186]]

                },{ //九华精舍
                  color1: 'ff99ff00', color2: 'ff9999cc',
                  path:[[113.999444,22.600369], [113.999615,22.59977],[114.000189,22.599844], [114.000119,22.600384]]
                },{ //宿舍1-6
                  color1: 'ffffff00', color2: 'ffffcccc',
                  path:[[114.000018,22.600567], [113.999058,22.600315],[113.998994,22.599042], [113.998238,22.598975], [113.997867,22.60035],[113.999415,22.601203]]
                },{ //宿舍7-10
                  color1: 'ffffff00', color2: 'ffffcccc',
                  path:[[113.998744,22.602104],[113.998642,22.602263], [113.997049,22.601906], [113.99714,22.601045], [113.997655,22.601173],[113.998272,22.60148]
                  ]
                },{//教师公寓
                  color1: 'ff99ff00', color2: 'ff9999cc',
                  path: [[114.001847,22.600049],[114.002903,22.60045],[114.003542,22.598771], [114.002463,22.598435],[114.001847,22.600049]]
                },{//工学院
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[113.995112,22.601708],[113.995434,22.599737],[113.99647,22.598826], [113.997269,22.59998],[113.996523,22.600688],[113.996448,22.601842]]
                },{//人文社科学院
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[114.001094,22.597593],[114.001421,22.597177],[114.001759,22.59741],
                    [114.002193,22.59735],[114.002451,22.597093],[114.002762,22.59731],
                  [114.00244,22.597751],[114.001646,22.597845]]
                },{//理学院
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[113.998095,22.59374],[113.999313,22.595206],[114.000235,22.594512], [113.999361,22.593442],[113.998733,22.593269]]
                },{//商学院
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[114.000133,22.595587],[114.000713,22.59631],[114.001399,22.595835], [114.000799,22.595102]]
                },{//医学院and深港微电子学院
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[113.995381,22.595587],[113.995284,22.594567],[113.996239,22.594458], [113.996335,22.595448]]
                },{//STEAM
                  color1: 'ff8ecfc9', color2: 'ff8ecfff',
                  path: [[114.002022,22.603346],[114.00259,22.603163],[114.00266,22.60348],[114.002649,22.603673],[114.002301,22.603787],[114.00215,22.603653]]
                },{//琳恩图书馆
                  color1: 'ffc497b2', color2: 'ffc497b2',
                  path: [[113.998025,22.595389],[113.998857,22.59528],[113.998878,22.594765], [113.997902,22.594844]]
                },{//涵泳图书馆
                  color1: 'ffc497b2', color2: 'ffc497b2',
                  path: [[113.996872,22.601802],[113.996963,22.601376],[113.997333,22.601421], [113.997221,22.601887]]
                },{//一丹图书馆
                  color1: 'ffc497b2', color2: 'ffc497b2',
                  path: [[113.998159,22.597885],[113.997811,22.59737],[113.998406,22.597008], [113.998417,22.597821]]
                },{//一科and二科
                  color1: 'ffc497b2', color2: 'ffc497b2',
                  path: [[113.996673,22.59685],[113.995751,22.596241],[113.995595,22.595825], [113.996427,22.595503],[113.997124,22.596578]]
                },{//检测中心
                  color1: 'ffc497b2', color2: 'ffc497b2',
                  path: [[113.996765,22.595641],[113.996652,22.595032],[113.997226,22.595003], [113.997381,22.595498],[113.997054,22.595518]]
                },{//1教学楼
                  color1: 'ffffbe7a', color2: 'ffffbe7a',
                  path: [[113.997183,22.596454],[113.996759,22.595741],[113.997424,22.595468], [113.997843,22.59629]]
                },{//2教学楼
                  color1: 'ffffbe7a', color2: 'ffffbe7a',
                  path: [[113.996609,22.594948],[113.996582,22.594463],[113.997086,22.594408], [113.997194,22.594908]]
                },{//3教学楼
                  color1: 'ffffbe7a', color2: 'ffffbe7a',
                  path: [[113.999479,22.596122],[113.999967,22.595661],[114.0006,22.596449], [114.000005,22.596657]]
                },{//中心食堂
                  color1: 'fff27970', color2: 'fff27970',
                  path: [[113.997853,22.598009],[113.998057,22.59792],[113.997929,22.597539],
                    [113.997521,22.597078],[113.997483,22.596707],[113.997451,22.596687],
                  [113.997237,22.596786],[113.997258,22.597202]]
                },{//湖畔食堂
                  color1: 'fff27970', color2: 'fff27970',
                  path: [[113.997569,22.597009],[113.997451,22.596632],[113.997805,22.596449],
                    [113.998508,22.596791],[113.998374,22.596984],]
                },{//2食堂
                  color1: 'fff27970', color2: 'fff27970',
                  path: [[113.998755,22.601639],[113.998422,22.601595],[113.998293,22.602145], [113.998658,22.602219]]
                },{//荔园食堂
                  color1: 'fff27970', color2: 'fff27970',
                  path: [[113.999318,22.605085],[113.999232,22.604787],[113.999854,22.604669], [113.999903,22.604966]]
                },{//办公楼
                  color1: 'fff2b2b4', color2: 'fff2b2b4',
                  path: [[114.001103,22.598406],[114.001377,22.597955],[114.002063,22.598312], [114.001742,22.598742]]
                },{//行政楼
                  color1: 'fff2b2b4', color2: 'fff2b2b4',
                  path: [[113.997804,22.59479],[113.997675,22.594394],[113.998158,22.594077], [113.99863,22.594399],[113.998394,22.594751]]
                },{//慧园
                  color1: 'ffca774b', color2: 'ffca774b',
                  path: [[114.002625,22.603087],[114.003408,22.603335],[114.00373,22.603855], [114.003891,22.605301],
                  [114.002877,22.605103],[114.002673,22.603741]]
                },{//荔园
                  color1: 'ff9dc3e7', color2: 'ff9dc3e7',
                  path: [[114.000276,22.603874],[114.000549,22.60483],[114.000249,22.605018], [114.000345,22.605479],
                    [113.999535,22.605642],[113.999364,22.605122],[113.999364,22.605122],[113.999364,22.605122],
                 [113.999224,22.60436],[113.999348,22.604221],[113.99968,22.603993]]
                },{//创园
                  color1: 'ffbb9297', color2: 'ffbb9297',
                  path: [[114.000345,22.603879],[114.00204,22.603315],[114.002105,22.603627], [114.001644,22.60387],
                    [114.001778,22.604538],[114.000581,22.60486]]
                },{//欣园
                  color1: 'ffec8f3f', color2: 'ffec8f3f',
                  path: [[114.003013,22.608142],[114.002026,22.608969],[114.001356,22.608222], [114.001914,22.607667],
                    [114.002316,22.607979],[114.0026,22.607721]]
                },{//风雨操场
                  color1: 'ffb2ba81', color2: 'ffb2ba81',
                  path: [[113.999321,22.598284],[113.99952,22.598572],[113.999943,22.598705], [114.000126,22.598923],
                    [113.999852,22.599067],[114.000115,22.599498],[114.000255,22.599617],[114.000469,22.599508],
                  [114.001285,22.599894],[114.001252,22.600013],[114.000614,22.600013],[113.999563,22.599275],
                  [113.999144,22.598577],[113.999166,22.598334]]
                },{//润扬
                  color1: 'ffb2ba81', color2: 'ffb2ba81',
                  path: [[114.003833,22.602054],[114.00387,22.601449],[114.004611,22.601593], [114.004632,22.602212]]
                }]
              };
          //fff2b2b4
          buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
          buildingOverlay.value = new AMap.OverlayGroup();
          busStationOverlay.value = new AMap.OverlayGroup();
          navigationOverlay.value = new AMap.OverlayGroup();
          bus_line1.value = new AMap.Polyline({
            strokeOpacity:1,
            strokeWeight: 10,  // 线宽
            borderWeight: 1,  // 线宽
            strokeColor: "#f29f05",  // 线颜色

            lineJoin: 'round'  // 折线拐点连接处样式
          });
          bus_line2.value = new AMap.Polyline({
            strokeOpacity:1,
            strokeWeight: 10,  // 线宽
            borderWeight: 1,  // 线宽
            strokeColor: "#228B22",  // 线颜色

            lineJoin: 'round'  // 折线拐点连接处样式
          });

          map.value = new AMap.Map('container', {
            mask: mask,
            viewMode: '3D',
            zoom: 17,
            center: [114.002365, 22.599631],
            showLabel: false,
            showIndoorMap:false,
            showBuildingBlock: true,
            //features:['bg','point','road'],
            layers:[
              AMap.createDefaultLayer(),
              buildingLayer,
            ]
          });








            AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye", "AMap.Geolocation", "AMap.MapType",
                "AMap.MouseTool"], function () {
                //异步同时加载多个插件
                // 添加地图插件
              map.value.addControl(new AMap.ToolBar()); // 工具条控件;范围选择控件
              map.value.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
              map.value.addControl(new AMap.HawkEye()); // 显示缩略图
              map.value.addControl(new AMap.Geolocation()); // 定位当前位置
              map.value.addControl(new AMap.MapType()); // 实现默认图层与卫星图,实时交通图层之间切换
              });
          map.value.on('movestart', () => {
            const zoom = map.value.getZoom(); // 获取当前地图的缩放级别
            if (zoom < 16.9) {
              buildingOverlay.value.hide();
              busStationOverlay.value.hide();
              bus_line1.value.hide();
              bus_line2.value.hide();
              navigationOverlay.value.hide();
            } else {
              if(showBuildingMarkFlag.value) {
                buildingOverlay.value.show();
                bus_line1.value.hide();
                bus_line2.value.hide();
              }
              if(showBusStationMarkFlag.value) {
                busStationOverlay.value.show();
                bus_line1.value.show();
                bus_line2.value.show();
              }
              if(shownavigationFlag.value){
                navigationOverlay.value.show();
              }
            }
          });
          map.value.on('zoomend', () => {
            const zoom = map.value.getZoom(); // 获取当前地图的缩放级别
            if (zoom < 16.9) {
              buildingOverlay.value.hide();
              busStationOverlay.value.hide();
              bus_line1.value.hide();
              bus_line2.value.hide();
              navigationOverlay.value.hide();
            } else {
              if(showBuildingMarkFlag.value) {//此时点击了回到主页
                buildingOverlay.value.show();
                busStationOverlay.value.hide();
                 bus_line1.value.hide();
                bus_line2.value.hide();
                navigationOverlay.value.hide();
              }
              if(showBusStationMarkFlag.value) {
                buildingOverlay.value.hide();
                busStationOverlay.value.show();
                bus_line1.value.show();
                bus_line2.value.show();
              }
              if(shownavigationFlag.value){
                navigationOverlay.value.show();
              }
            }
          });
          map.value.on('click',function(e) {
            if (navigationFlag.value) {
              const lnglat = e.lnglat;
              console.log('点击了地图，坐标为：' + lnglat.getLng() + ',' + lnglat.getLat());
              if(chooseStartFlag.value){
                start.value = lnglat;
                SideBarRef.value.setStart(start.value);
                chooseStartFlag.value = false;
              }else {
                end.value = lnglat;
                SideBarRef.value.setEnd(end.value);
                chooseStartFlag.value = true;
              }
            }
          });





          dormitory1.value = new AMap.Marker({
            position: [113.998653, 22.599186], title: '学生宿舍1栋', label: {content: '学生宿舍1栋'},});
          dormitory2.value = new AMap.Marker({
            position: [113.998637, 22.599661], title: '学生宿舍2栋', label: {content: '学生宿舍2栋'},});
          dormitory3.value = new AMap.Marker({
            position: [113.99853, 22.600201], title: '学生宿舍3栋', label: {content: '学生宿舍3栋'},});
          dormitory4.value = new AMap.Marker({
            position: [113.998835, 22.600657], title: '学生宿舍4栋', label: {content: '学生宿舍4栋'},});
          dormitory5.value = new AMap.Marker({
            position: [113.999377, 22.600969], title: '学生宿舍5栋', label: {content: '学生宿舍5栋'},});
          dormitory6.value = new AMap.Marker({
            position: [113.999613, 22.600677], title: '学生宿舍6栋', label: {content: '学生宿舍6栋'},});
          dormitory7.value = new AMap.Marker({
            position: [113.997373, 22.601922], title: '学生宿舍7栋', label: {content: '学生宿舍7栋'},});
          dormitory8.value = new AMap.Marker({
            position: [113.997448, 22.601318], title: '学生宿舍8栋', label: {content: '学生宿舍8栋'},});
          dormitory9.value = new AMap.Marker({
            position: [113.997936, 22.601714], title: '学生宿舍9栋', label: {content: '学生宿舍9栋'},});
          dormitory10.value = new AMap.Marker({
            position: [113.998376, 22.602091], title: '学生宿舍10栋', label: {content: '学生宿舍10栋'},});
          dormitory11.value = new AMap.Marker({
            position: [113.999061, 22.602202], title: '学生宿舍11栋', label: {content: '学生宿舍11栋'},});
          dormitory12.value = new AMap.Marker({
            position: [113.999839, 22.602628], title: "学生宿舍12栋", label: {content: "学生宿舍12栋"},});
          dormitory13.value = new AMap.Marker({
            position: [113.999528, 22.601652], title: "学生宿舍13栋", label: {content: "学生宿舍13栋"},});
          dormitory14.value = new AMap.Marker({
            position: [114.000025, 22.601855], title: "学生宿舍14栋", label: {content: "学生宿舍14栋"},});
          dormitory15.value = new AMap.Marker({
            position: [114.000439, 22.602231], title: "学生宿舍15栋", label: {content: "学生宿舍15栋"},});
          dormitory16.value = new AMap.Marker({
            position: [114.00098, 22.602543], title: "学生宿舍16栋", label: {content: "学生宿舍16栋"},});
          dormitory17.value = new AMap.Marker({
            position: [114.000921, 22.602979], title: "学生宿舍17栋", label: {content: "学生宿舍17栋"},});
          library1.value = new AMap.Marker({
            position: [113.997128, 22.601514], title: "涵泳图书馆", label: {content: "涵泳图书馆"},});
          library2.value = new AMap.Marker({
            position: [113.99839, 22.595091], title: "琳恩图书馆", label: {content: "琳恩图书馆"},});
          library3.value = new AMap.Marker({
            position: [113.998277, 22.597533], title: "一丹图书馆", label: {content: "一丹图书馆"},});
          cafeteria1.value = new AMap.Marker({
            position: [113.997792, 22.597677], title: "中心食堂", label: {content: "中心食堂"},});
          cafeteria2.value = new AMap.Marker({
            position: [113.998586, 22.601832], title: "第二学生食堂", label: {content: "第二学生食堂"},});
          cafeteria3.value = new AMap.Marker({
            position: [113.997822, 22.596719], title: "湖畔食堂", label: {content: "湖畔食堂"},});
          cafeteria4.value = new AMap.Marker({
            position: [113.999648, 22.604821], title: "荔园餐厅", label: {content: "荔园餐厅",}});
          cafeteria5.value = new AMap.Marker({
            position: [114.002748, 22.600055], title: "西餐厅", label: {content: "西餐厅",},});
          cafeteria6.value = new AMap.Marker({
            position: [114.002185, 22.599901], title: "茶餐厅", label: {content: "茶餐厅"},});
          teaching_building1.value = new AMap.Marker({
            position: [113.997303, 22.595971], title: "第一教学楼", label: {content: "第一教学楼"}});
          teaching_building2.value = new AMap.Marker({
            position: [113.996903, 22.594746], title: "第二教学楼", label: {content: "第二教学楼"}});
          teaching_building3.value = new AMap.Marker({
            position: [113.999864, 22.595915], title: "第三教学楼", label: {content: "第三教学楼"}});
          research_building1.value = new AMap.Marker({
            position: [113.996643,22.596326], title: "第一科研楼", label: {content: "第一科研楼"},});
          research_building2.value = new AMap.Marker({
            position: [113.996101,22.595924], title: "第二科研楼", label: {content: "第二科研楼",},});
          research_building3.value = new AMap.Marker({
            position: [113.997024,22.595325], title: "检测中心", label: {content: "检测中心"},});
          college1.value = new AMap.Marker({
            position: [113.995374, 22.601041], title: "工学院北楼", label: {content: "工学院北楼"},});
          college2.value = new AMap.Marker({
            position: [113.995835, 22.599659], title: "工学院南楼", label: {content: "工学院南楼",},});
          college3.value = new AMap.Marker({
            position: [114.000637, 22.595489], title: "商学院", label: {content: "商学院"},});
          college4.value = new AMap.Marker({
            position: [113.999907, 22.594315], title: "理学院", label: {content: "理学院"}});
          college5.value = new AMap.Marker({
            position: [114.002015, 22.597614], title: "人文社科学院", label: {content: "人文社科学院"},});
          college6.value = new AMap.Marker({
            position: [113.995848,22.595341], title: "医学院", label: {content: "医学院"},});
          college7.value = new AMap.Marker({
            position: [113.995826,22.594771], title: "深港微电子学院", label: {content: "深港微电子学院"},});
          college8.value = new AMap.Marker({
            position: [114.002357,22.603423], title: "STEAM", label: {content: "STEAM"},});
          jiu_hua.value = new AMap.Marker({
            position: [113.999853, 22.600115], title: "九华精舍", label: {content: "九华精舍"},});
          office.value = new AMap.Marker({
            position: [114.001506, 22.598426], title: "办公楼", label: {content: "办公楼"},});
          administrative_building.value = new AMap.Marker({
            position: [113.998114,22.59446], title: "行政楼", label: {content: "行政楼"},});
          faculty_apartment1.value = new AMap.Marker({
            position: [114.002182, 22.600026], title: "教师公寓1栋", label: {content: "教师公寓1栋"},});
          faculty_apartment2.value = new AMap.Marker({
            position: [114.002707, 22.600259], title: "教师公寓2栋", label: {content: "教师公寓2栋"},});
          faculty_apartment3.value = new AMap.Marker({
            position: [114.002283, 22.599585], title: "教师公寓3栋", label: {content: "教师公寓3栋"},});
          faculty_apartment4.value = new AMap.Marker({
            position: [114.002857, 22.599867], title: "教师公寓4栋", label: {content: "教师公寓4栋"},});
          faculty_apartment5.value = new AMap.Marker({
            position: [114.002396, 22.599149], title: "教师公寓5栋", label: {content: "教师公寓5栋"}});
          faculty_apartment6.value = new AMap.Marker({
            position: [114.003034, 22.599313], title: "教师公寓6栋", label: {content: "教师公寓6栋"},});
          gym1.value = new AMap.Marker({
            position: [113.999666, 22.598976], title: "风雨操场", label: {content: "风雨操场"},});
          gym2.value = new AMap.Marker({
            position: [114.003236, 22.601756], title: "松禾体育场", label: {content: "松禾体育场"},});
          gym3.value = new AMap.Marker({
            position: [114.004261, 22.601895], title: "松禾体育馆", label: {content: "松禾体育馆"},});


          xing_yuan.value = new AMap.Marker({
            position: [114.002467,22.607841], title: "欣园", label: {content: "欣园"},});
          hui_yuan.value = new AMap.Marker({
            position: [114.003309,22.603185], title: "慧园", label: {content: "慧园"},});
          chuang_yuan.value = new AMap.Marker({
            position: [114.002011,22.603299], title: "创园", label: {content: "创园"},});
          li_yuan.value = new AMap.Marker({
            position: [114.000209,22.603582], title: "荔园", label: {content: "荔园"},});
          student_dormitry.value = new AMap.Marker({
            position: [113.998814,22.601809], title: "学生宿舍", label: {content: "学生宿舍"},});
          community_health_center.value = new AMap.Marker({
            position: [114.000751,22.60007], title: "社康中心", label: {content: "社康中心"},});
          faculty_cafeteria.value = new AMap.Marker({
            position: [114.002902,22.600432], title: "教工餐厅", label: {content: "教工餐厅"},});
          guest_house.value = new AMap.Marker({
            position: [114.003562,22.598857], title: "专家公寓", label: {content: "专家公寓"},});
          gate3.value = new AMap.Marker({
            position: [114.004061,22.597594], title: "3号门", label: {content: "3号门"},});
          gate2.value = new AMap.Marker({
            position: [114.001078,22.595102], title: "2号门", label: {content: "2号门"},});
          gate1.value = new AMap.Marker({
            position: [113.999447,22.5932], title: "1号门", label: {content: "1号门"},});
          administration_building.value = new AMap.Marker({
            position: [113.997424,22.594107], title: "行政楼", label: {content: "行政楼"},});
          gate7.value = new AMap.Marker({
            position: [113.995269,22.594563], title: "7号门", label: {content: "7号门"},});
          research_building.value = new AMap.Marker({
            position: [113.996637,22.596826], title: "科研楼", label: {content: "科研楼"},});
          COEN.value = new AMap.Marker({
            position: [113.995249,22.600512], title: "工学院北楼", label: {content: "工学院北楼"},});
          COES.value = new AMap.Marker({
            position: [113.996741,22.59908], title: "工学院南楼", label: {content: "工学院南楼"},});



          line1Markers.push(xing_yuan.value,hui_yuan.value, chuang_yuan.value, li_yuan.value,
              student_dormitry.value, community_health_center.value, faculty_cafeteria.value,
              guest_house.value, gate3.value, gate2.value, gate1.value,
              administration_building.value, gate7.value, research_building.value, COEN.value);

          line2Markers.push(xing_yuan.value, hui_yuan.value, chuang_yuan.value, li_yuan.value,
              student_dormitry.value,  COES.value, research_building.value);

          busStationMarkers.push(xing_yuan.value, hui_yuan.value, chuang_yuan.value, li_yuan.value, student_dormitry.value, community_health_center.value, faculty_cafeteria.value, guest_house.value, gate3.value, gate2.value, gate1.value, administration_building.value, gate7.value, research_building.value, COEN.value,COES.value);
          for (let i = 0; i < busStationMarkers.length; i++) {
            busStationMarkers[i].setIcon('https://vdata.amap.com/icons/b18/1/2.png')
            busStationMarkers[i].setMap(map.value);
            busStationMarkers[i].hide();
            busStationOverlay.value.addOverlay(busStationMarkers[i]);
            busStationMarkers[i].on('click', function (e) {
              handleDormitoryClick(e);
            })
          }


          map.value.plugin(["AMap.Driving"], function() { //加载驾车服务插件
            const driving = new AMap.Driving({
              hideMarkers:true,
            });
            if (line1Markers.length > 0){
              const waypoints1= [];
              for (let i = 0; i < line1Markers.length; i++) {
                waypoints1.push(line1Markers[i].getPosition());
              }

              console.log(waypoints1[0])
              driving.search([114.002467,22.607841], [113.995249,22.600512], {waypoints: waypoints1},function(status, result) {
                if (status === 'complete') {

                  const steps = result.routes[0].steps;
                  let path = [];
                  for (let i = 0; i < steps.length; i++) {
                    path = path.concat(steps[i].path);
                  }
                  for (let i = 0; i < path.length; i++) {
                    path[i] = [path[i].lng- 0.00001, path[i].lat -0.00001];
                  }
                  bus_line1.value.setPath(path)
                  bus_line1.value.setMap(map.value);
                  bus_line1.value.hide();
                  // 路线规划成功
                } else {

                  // 路线规划失败
                }
                // result即是对应的驾车路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
              });
            }
            if (line2Markers.length > 0){
              const waypoints2 = [];
              for (let i = 0; i < line2Markers.length; i++) {
                waypoints2.push(line2Markers[i].getPosition());
              }
              driving.search([114.002467,22.607841], [113.996637,22.596826], {waypoints: waypoints2},function(status, result) {
                if (status === 'complete') {

                  const steps = result.routes[0].steps;
                  let path = [];
                  for (let i = 0; i < steps.length; i++) {
                    path = path.concat(steps[i].path);
                  }
                  for (let i = 0; i < path.length; i++) {
                    path[i] = [path[i].lng+ 0.00001, path[i].lat +0.00001];
                  }
                  bus_line2.value.setPath(path);
                  bus_line2.value.setMap(map.value);
                  bus_line2.value.hide();
                  // 路线规划成功
                } else {

                  // 路线规划失败
                }
                // result即是对应的驾车路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
              });
            }


          });
          //创建自定义标签
          // var customLabel = document.createElement('div');
          // customLabel.className = 'custom-label';
          // customLabel.textContent = '第一教学楼';
// // 自定义 CSS 样式
//         var customStyle = document.createElement('style');
//         customStyle.type = 'text/css';
//         customStyle.innerHTML = '.custom-label {' +
//             'background-color: #fff;' +
//             'border: 2px solid #000;' +
//             'padding: 5px;' +
//             'font-size: 14px;' +
//             'border-radius: 5px;' + // 设置边框圆角
//             '}';
//
//         document.getElementsByTagName('head')[0].appendChild(customStyle);
//
// // 创建并设置 Marker
//         teaching_building1.value = new AMap.Marker({
//           position: [113.997303,22.595971],
//           title: "第一教学楼",
//           icon: {
//             size: new AMap.Size(30, 30), // 设置图标大小
//             image: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png' // 设置图标图片
//           }
//         });
//         teaching_building1.value.setLabel({
//           offset: new AMap.Pixel(0, -30), // 设置 Label 偏移量
//           content: customLabel // 自定义 Label 元素
//         });

          markers.push(library1.value,library2.value,library3.value,dormitory1.value,dormitory2.value,dormitory3.value,dormitory4.value,dormitory5.value,dormitory6.value,dormitory7.value,dormitory8.value,dormitory9.value,dormitory10.value,dormitory11.value,dormitory12.value,dormitory13.value,dormitory14.value,dormitory15.value,dormitory16.value,dormitory17.value,cafeteria1.value,cafeteria2.value,cafeteria3.value,cafeteria4.value,cafeteria5.value,cafeteria6.value,teaching_building1.value,teaching_building2.value,teaching_building3.value,research_building1.value,research_building2.value,research_building3.value,college1.value,college2.value,college3.value,college4.value,college5.value,college6.value,college7.value,college8.value,jiu_hua.value,office.value,faculty_apartment1.value,faculty_apartment2.value,faculty_apartment3.value,faculty_apartment4.value,faculty_apartment5.value,faculty_apartment6.value,gym1.value,gym2.value,gym3.value);
          for (let i = 0; i < markers.length; i++) {
            buildingOverlay.value.addOverlay(markers[i]);
            markers[i].on('click', function (e) {
              handleDormitoryClick(e);
            })
          }
          map.value.add(buildingOverlay.value);
          map.value.add(busStationOverlay.value);
          map.value.add(navigationOverlay.value);
        });
      });


    return {
      SideBarRef,
      start,
      end,
      buildingOverlay,
      busStationOverlay,
      navigationOverlay,
      handleNavigation,
      confirmNavigation,
      markers,
      busStationMarkers,
      line1Markers,
      line2Markers,
      line3Markers,
      line4Markers,
      showBuildingMarkFlag,
      shownavigationFlag,
      popoverVisible,
      popoverTop,
      popoverLeft,
      title,
      introduction,
      username,
      authority,
      handleDormitoryClick,
      reviewFormVisible,
      reviewText,
      openReviewForm,
      handleFileUpload,
      submitReview,
      activeSidebar,
      navigateTo,
      showBusStationMarkers,
      ArrowLeft, House,ChatLineSquare,Timer,ShoppingCart,Search,Van
    };
  },

  methods:{
    setUsername() {

    },
}

}


/*在Vue3中使用时,需要引入Vue3中的shallowRef方法(使用shallowRef进行非深度监听,
因为在Vue3中所使用的Proxy拦截操作会改变JSAPI原生对象,所以此处需要区别Vue2使用方式对地图对象进行非深度监听,
否则会出现问题,建议JSAPI相关对象采用非响应式的普通对象来存储)*/
//import { shallowRef } from '@vue/reactivity';
//import {ref} from "vue";

 //const map = shallowRef(null);
// const path = ref([]);
// const current_position = ref([]);




</script>

<style scoped>
#container{
  padding:0px;
  margin: 0px;
  width: 100vw; /* 100% 屏幕宽度 */
  height: 100vh; /* 100% 屏幕高度 */
}
.custom-menu-container {
  background-color: transparent;
  height: 50px;  /* 设置导航栏的高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  border-bottom: #45a049;
}
.custom-button {

  background-color: #ffffff; /* 设置按钮的背景色 */
  font-size: 13px;
  color: #111010;
  margin-left: 20px; /* 设置左边边距 */
  font-family: 'Roboto', sans-serif;
  border-radius: 20px; /* 设置按钮的圆角 */
  border: 1px solid #dcdcdc; /* 添加边框 */
}

.custom-div{
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
}

.sidebar {
  z-index: 999; /* 设置一个较高的z-index值，以确保sidebar显示在最上层 */
}
</style>