<template>
  <div>
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
        height = "1600"
        :content="introduction"
        :style="{ top: popoverTop, left: popoverLeft }">


        <!-- 添加一个关闭按钮用于手动关闭弹出框 -->
        <button @click="popoverVisible = false">Close</button>
        <!-- 添加弹出内容 -->
        ...

      <div>Building Information</div>
    </el-popover>
  </div>


</template>

<script>

import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";

import { ElPopover } from 'element-plus';
import 'element-plus/dist/index.css'
import {onMounted, ref} from "vue";
export default {
  components: {
    ElPopover,
  },
  setup(){
    const popoverVisible = ref(false);
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
    const college1 = ref(null)
    const college2 = ref(null)
    const college3 = ref(null)
    const college4 = ref(null)
    const college5 = ref(null)
    const jiu_hua = ref(null)
    const office = ref(null)
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


    const handleDormitoryClick = ($event) => {
      popoverVisible.value = true;
      console.log($event.target._originOpts.title)


      title.value = $event.target._originOpts.title;
      introduction.value = 'this is the introduction of '+$event.target._originOpts.title
          +$event.target._originOpts.label.content;
      const x = $event.pixel.x
      const y = $event.pixel.y;
      popoverTop.value = `${y}px`;
      popoverLeft.value = `${x}px`;
      console.log(username.value)

      axios.get('http://localhost:8080/building', {
        params: {
          buildingName: title.value ,
          userName: 'exampleName', //替换成具体的用户名或者从组件的props中获取
        }
      })
      .then((res) => {

        console.log(res.data);
      })
      .catch((err) => console.log(err));
    };
    onMounted(() => {
      AMapLoader.load({ key: 'c7a4dd8b9777a66796d5b71cf0839982', version: '2.0' }).then((AMap) => {
        const map = new AMap.Map('container', {
          viewMode: '3D',
          zoom: 17,
          center: [114.002365, 22.599631],
          showLabel: false,
        });
        AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye","AMap.Geolocation","AMap.MapType","AMap.MouseTool"], function () {
          //异步同时加载多个插件
          // 添加地图插件
          map.addControl(new AMap.ToolBar()); // 工具条控件;范围选择控件
          map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
          map.addControl(new AMap.HawkEye()); // 显示缩略图
          map.addControl(new AMap.Geolocation()); // 定位当前位置
          map.addControl(new AMap.MapType()); // 实现默认图层与卫星图,实时交通图层之间切换
        });
        map.on('movestart', () =>{
          const zoom = map.getZoom(); // 获取当前地图的缩放级别
          const allOverlays = map.getAllOverlays();
          allOverlays.forEach(function(overlay){
            if(overlay instanceof AMap.Marker){ // 判断该覆盖物是否为Marker
              if(zoom < 16.9) {
                overlay.hide();
              } else {
                overlay.show();
              }
            }
          });
        });

        const markers = [];

        dormitory1.value   = new AMap.Marker({
          position: [113.998653,22.599186],
          title: '学生宿舍1栋',
          label: {
            content: '学生宿舍1栋',
            visible: true,
          },
        });
        dormitory2.value   = new AMap.Marker({
          position: [113.998637,22.599661],
          title: '学生宿舍2栋',
          label: {
            content: '学生宿舍2栋',
            visible: true,
          },
        });
        dormitory3.value   = new AMap.Marker({
          position: [113.99853,22.600201],
          title: '学生宿舍3栋',
          label: {
            content: '学生宿舍3栋',
            visible: true,
          },
        });
        dormitory4.value   = new AMap.Marker({
          position: [113.998835,22.600657],
          title: '学生宿舍4栋',
          label: {
            content: '学生宿舍4栋',
            visible: true,
          },
        });
        dormitory5.value   = new AMap.Marker({
          position: [113.999377,22.600969],
          title: '学生宿舍5栋',
          label: {
            content: '学生宿舍5栋',
            visible: true,
          },
        });
        dormitory6.value   = new AMap.Marker({
          position: [113.999613,22.600677],
          title: '学生宿舍6栋',
          label: {
            content: '学生宿舍6栋',
            visible: true,
          },
        });
        dormitory7.value   = new AMap.Marker({
          position: [113.997373,22.601922],
          title: '学生宿舍7栋',
          label: {
            content: '学生宿舍7栋',
            visible: true,
          },
        });
        dormitory8.value   = new AMap.Marker({
          position: [113.997448,22.601318],
          title: '学生宿舍8栋',
          label: {
            content: '学生宿舍8栋',
            visible: true,
          },
        });
        dormitory9.value   = new AMap.Marker({
          position: [113.997936,22.601714],
          title: '学生宿舍9栋',
          label: {
            content: '学生宿舍9栋',
            visible: true,
          },
        });
        dormitory10.value  = new AMap.Marker({
          position: [113.998376,22.602091],
          title: '学生宿舍10栋',
          label: {
            content: '学生宿舍10栋',
            visible: true,
          },
        });
        dormitory11.value  = new AMap.Marker({
          position: [113.999061, 22.602202],
          title: '学生宿舍11栋',
          label: {
            content: '学生宿舍11栋',
            visible: true,
          },
        });
        dormitory12.value  = new AMap.Marker({
          position: [113.999839,22.602628],
          title: "学生宿舍12栋",
          label: {
            content: "学生宿舍12栋",
            visible: true,
          },
        });
        dormitory13.value  = new AMap.Marker({
          position: [113.999528,22.601652],
          title: "学生宿舍13栋",
          label: {
            content: "学生宿舍13栋",
            visible: true,
          },
        });
        dormitory14.value  = new AMap.Marker({
          position: [114.000025,22.601855],
          title: "学生宿舍14栋",
          label: {
            content: "学生宿舍14栋",
            visible: true,
          },
        });
        dormitory15.value  = new AMap.Marker({
          position: [114.000439,22.602231],
          title: "学生宿舍15栋",
          label: {
            content: "学生宿舍15栋",
            visible: true,
          },
        });
        dormitory16.value  = new AMap.Marker({
          position: [114.00098,22.602543],
          title: "学生宿舍16栋",
          label: {
            content: "学生宿舍16栋",
            visible: true,
          },
        });
        dormitory17.value  = new AMap.Marker({
          position: [114.000921,22.602979],
          title: "学生宿舍17栋",
          label: {
            content: "学生宿舍17栋",
            visible: true,
          },
        });

        library1.value  = new AMap.Marker({
          position: [113.997128,22.601514],
          title: "涵泳图书馆",
          label: {
            content: "涵泳图书馆",
            visible: true,
          },
        });
        library2.value  = new AMap.Marker({
          position: [113.99839,22.595091],
          title: "琳恩图书馆",
          label: {
            content: "琳恩图书馆",
            visible: true,
          },
        });
        library3.value  = new AMap.Marker({
          position: [113.998277,22.597533],
          title: "一丹图书馆",
          label: {
            content: "一丹图书馆",
            visible: true,
          },
        });

        cafeteria1.value = new AMap.Marker({
          position: [113.997792,22.597677],
          title: "中心食堂",
          label: {
            content: "中心食堂",
            visible: true,
          },
        });
        cafeteria2.value = new AMap.Marker({
          position: [113.998586,22.601832],
          title: "第二学生食堂",
          label: {
            content: "第二学生食堂",
            visible: true,
          },
        });
        cafeteria3.value = new AMap.Marker({
          position: [113.997822,22.596719],
          title: "湖畔食堂",
          label: {
            content: "湖畔食堂",
            visible: true,
          },
        });
        cafeteria4.value = new AMap.Marker({
          position: [113.999648,22.604821],
          title: "荔园餐厅",
          label: {
            content: "荔园餐厅",
            visible: true,
          },
        });
        cafeteria5.value = new AMap.Marker({
          position: [114.002748,22.600055],
          title: "西餐厅",
          label: {
            content: "西餐厅",
            visible: true,
          },
        });
        cafeteria6.value = new AMap.Marker({
          position: [114.002185,22.599901],
          title: "茶餐厅",
          label: {
            content: "茶餐厅",
            visible: true,
          },
        });
        teaching_building1.value = new AMap.Marker({
          position: [113.997303,22.595971],
          title: "第一教学楼",
          label: {
            content: "第一教学楼",
            visible: true,
          },

        });
        teaching_building2.value = new AMap.Marker({
          position: [113.996903,22.594746],
          title: "第二教学楼",
          label: {
            content: "第二教学楼",
            visible: true,
          },
        });
        teaching_building3.value = new AMap.Marker({
          position: [113.999864,22.595915],
          title: "第三教学楼",
          label: {
            content: "第三教学楼",
            visible: true,
          },

        });

        college1.value= new AMap.Marker({
          position: [113.995374,22.601041],
          title: "工学院北楼",
          label: {
            content: "工学院北楼",
            visible: true,
          },

        });
        college2.value= new AMap.Marker({
          position: [113.995835,22.599659],
          title: "工学院南楼",
          label: {
            content: "工学院南楼",
            visible: true,
          },

        });
        college3.value= new AMap.Marker({
          position: [114.000637,22.595489],
          title: "商学院",
          label: {
            content: "商学院",
            visible: true,
          },

        });
        college4.value= new AMap.Marker({
          position: [113.999907,22.594315],
          title: "理学院",
          label: {
            content: "理学院",
            visible: true,
          },

        });
        college5.value= new AMap.Marker({
          position: [114.002015,22.597614],
          title: "人文社科学院",
          label: {
            content: "人文社科学院",
            visible: true,
          },

        });
        jiu_hua.value =  new AMap.Marker({
          position: [113.999853,22.600115],
          title: "九华精舍",
          label: {
            content: "九华精舍",
            visible: true,
          },

        });
        office.value =  new AMap.Marker({
          position: [114.001506,22.598426],
          title: "办公楼",
          label: {
            content: "办公楼",
            visible: true,
          },

        });
        faculty_apartment1.value = new AMap.Marker({
          position: [114.002182,22.600026],
          title: "教师公寓1栋",
          label: {
            content: "教师公寓1栋",
            visible: true,
          },

        });
        faculty_apartment2.value = new AMap.Marker({
          position: [114.002707,22.600259],
          title: "教师公寓2栋",
          label: {
            content: "教师公寓2栋",
            visible: true,
          },

        });
        faculty_apartment3.value = new AMap.Marker({
          position: [114.002283,22.599585],
          title: "教师公寓3栋",
          label: {
            content: "教师公寓3栋",
            visible: true,
          },

        });
        faculty_apartment4.value = new AMap.Marker({
          position: [114.002857,22.599867],
          title: "教师公寓4栋",
          label: {
            content: "教师公寓4栋",
            visible: true,
          },

        });
        faculty_apartment5.value = new AMap.Marker({
          position: [114.002396,22.599149],
          title: "教师公寓5栋",
          label: {
            content: "教师公寓5栋",
            visible: true,
          },

        });
        faculty_apartment6.value = new AMap.Marker({
          position: [114.003034,22.599313],
          title: "教师公寓6栋",
          label: {
            content: "教师公寓6栋",
            visible: true,
          },

        });
        gym1.value =  new AMap.Marker({
          position: [113.999666,22.598976],
          title: "风雨操场",
          label: {
            content: "风雨操场",
            visible: true,
          },

        });
        gym2.value =  new AMap.Marker({
          position: [114.003236,22.601756],
          title: "松禾体育场",
          label: {
            content: "松禾体育场",
            visible: true,
          },

        });
        gym3.value =  new AMap.Marker({
          position: [114.004261,22.601895],
          title: "松禾体育馆",
          label: {
            content: "松禾体育馆",
            visible: true,
          },

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


        markers.push(library1.value);
        markers.push(library2.value);
        markers.push(library3.value);

        markers.push(dormitory1.value);
        markers.push(dormitory2.value);
        markers.push(dormitory3.value);
        markers.push(dormitory4.value);
        markers.push(dormitory5.value);
        markers.push(dormitory6.value);
        markers.push(dormitory7.value);
        markers.push(dormitory8.value);
        markers.push(dormitory9.value);
        markers.push(dormitory10.value);
        markers.push(dormitory11.value);
        markers.push(dormitory12.value);
        markers.push(dormitory13.value);
        markers.push(dormitory14.value);
        markers.push(dormitory15.value);
        markers.push(dormitory16.value);
        markers.push(dormitory17.value);
        markers.push(cafeteria1.value);
        markers.push(cafeteria2.value);
        markers.push(cafeteria3.value);
        markers.push(cafeteria4.value);
        markers.push(cafeteria5.value);
        markers.push(cafeteria6.value);
        markers.push(teaching_building1.value)
        markers.push(teaching_building2.value)
        markers.push(teaching_building3.value)
        markers.push(college1.value)
        markers.push(college2.value)
        markers.push(college3.value)
        markers.push(college4.value)
        markers.push(college5.value)
        markers.push(jiu_hua.value)
        markers.push(office.value)
        markers.push(faculty_apartment1.value)
        markers.push(faculty_apartment2.value)
        markers.push(faculty_apartment3.value)
        markers.push(faculty_apartment4.value)
        markers.push(faculty_apartment5.value)
        markers.push(faculty_apartment6.value)
        markers.push(gym1.value)
        markers.push(gym2.value)
        markers.push(gym3.value);
        //这里需要添加到地图上显示
        for (let i = 0; i < markers.length; i++) {
          map.add(markers[i]);
          markers[i].on('click', function (e){
            handleDormitoryClick(e);
          })
        }

      });
    });


    return {
      popoverVisible,
      popoverTop,
      popoverLeft,
      title,
      introduction,
      username,
      authority,
      handleDormitoryClick,
    };
  },
  methods:{
    setUsername(username) {
      this.username = username;
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

<style>
#container{
  padding:0px;
  margin: 0px;
  width: 100vw; /* 100% 屏幕宽度 */
  height: 100vh; /* 100% 屏幕高度 */
}
</style>