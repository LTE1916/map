<template>
  <div>
    <div class="app-container">
      <div style="background-color: #ffffff;">
        <div id="container"></div>
      </div>
  </div>
    <el-popover
        id="popover"
        :visible=true
        placement="top"
        title="Title"
        :width="200"
        content="this is content, this is content, this is content"
    ></el-popover>
  </div>


</template>

<script>

import AMapLoader from '@amap/amap-jsapi-loader';
import axios from "axios";

import 'element-plus/dist/index.css'
export default {

  data() {

    return {
      username: "",
      authority:"",
    }
  },
  created() {
    this.initMap()
  },

  methods:{
    initMap() {
      window._AMapSecurityConfig = {
        securityJsCode: '9cd0ae12178c767342bff17cbf6ed653',
      }
      AMapLoader.load({
        key:"c7a4dd8b9777a66796d5b71cf0839982", // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins:[''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
        const map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          zoom:17,           //初始化地图级别
          center:[114.002365,22.599631], //初始化地图中心点位置
          showLabel:false,   //不显示地图文字标记
        });

        const dormitory11  = new AMap.Marker({
          position: [113.999061,22.602202],
          title: "学生宿舍11栋",
          label: {
            content: "学生宿舍11栋",
            visible: true,
          },
        });
        const dormitory12  = new AMap.Marker({
          position: [113.999839,22.602628],
          title: "学生宿舍12栋",
          label: {
            content: "学生宿舍12栋",
            visible: true,
          },
        });
        const dormitory13  = new AMap.Marker({
          position: [113.999528,22.601652],
          title: "学生宿舍13栋",
          label: {
            content: "学生宿舍13栋",
            visible: true,
          },
        });
        const dormitory14  = new AMap.Marker({
          position: [114.000025,22.601855],
          title: "学生宿舍14栋",
          label: {
            content: "学生宿舍14栋",
            visible: true,
          },
        })
        const dormitory15  = new AMap.Marker({
          position: [114.000439,22.602231],
          title: "学生宿舍15栋",
          label: {
            content: "学生宿舍15栋",
            visible: true,
          },
        })
        const dormitory16  = new AMap.Marker({
          position: [114.00098,22.602543],
          title: "学生宿舍16栋",
          label: {
            content: "学生宿舍16栋",
            visible: true,
          },
        })
        const dormitory17  = new AMap.Marker({
          position: [114.000921,22.602979],
          title: "学生宿舍17栋",
          label: {
            content: "学生宿舍17栋",
            visible: true,
          },
        })

        dormitory11.on('click', function() {
          axios.get("http://localhost:8080/building",{
            params:{
              buildingName:"dormitory11",
              userName:this.username,
            }
          }).then(res => {
            console.log(res.data);
          }).catch((err) => console.log(err));

          // 这里编写显示信息窗体的代码，使用res.data作为参数
          // 例如，可以使用Vue组件来渲染信息窗体
          // 例如：
          // new Vue({
          //   data: {
          //     buildingInfo: data
          //   },
          //   template: `
          //     <div>
          //       <h3>{{ buildingInfo.name }}</h3>
          //       <p>{{ buildingInfo.description }}</p>
          //     </div>
          //   `
          // }).$mount('#infoWindow');



        });
        dormitory12.on('click', function() {
          var params = new URLSearchParams();
          params.append('username', this.username);
          params.append('command', 'dfghjd');
          axios.post('http://localhost:8080/user/addUser1', params)
          .then(res => {
            console.log(res.data);
          }).catch((err) => console.log(err));
        });



        map.add(dormitory11);
        map.add(dormitory12);
        map.add(dormitory13);
        map.add(dormitory14);
        map.add(dormitory15);
        map.add(dormitory16);
        map.add(dormitory17);

        map.on('movestart', () =>{
          var zoom = map.getZoom(); // 获取当前地图的缩放级别
          var allOverlays = map.getAllOverlays();
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
        // 添加插件
        AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye","AMap.Geolocation","AMap.MapType","AMap.MouseTool"], function () {
          //异步同时加载多个插件
          // 添加地图插件
          map.addControl(new AMap.ToolBar()); // 工具条控件;范围选择控件
          map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
          map.addControl(new AMap.HawkEye()); // 显示缩略图
          map.addControl(new AMap.Geolocation()); // 定位当前位置
          map.addControl(new AMap.MapType()); // 实现默认图层与卫星图,实时交通图层之间切换


          // 以下是鼠标工具插件
          // const mouseTool = new AMap.MouseTool(map);
          // mouseTool.rule();// 用户手动绘制折线图,测量距离
          // mouseTool.measureArea(); // 测量面积
        });
        // 单击
        // const infoWindow = new AMap.InfoWindow({
        //   offset: new AMap.Pixel(0, -30), // 设置信息窗体的偏移量，使其显示在点击位置的上方
        // });

        // map.on('click', (e) => {
        //   // 调用POI搜索的方法
        //   AMap.plugin('AMap.PlaceSearch', function() {
        //     const placeSearch = new AMap.PlaceSearch();
        //
        //     // 根据点击位置的经纬度坐标进行POI搜索
        //
        //     //placeSearch.setFilter({keyword: '南园小筑', excludeKeywords:''})
        //     placeSearch.searchNearBy('', e.lnglat, 100, function(status, result) {
        //       if (status === 'complete' && result.info === 'OK') {
        //         // 获取第一个搜索结果的地点名称
        //         const address = result.poiList.pois[0].name;
        //
        //         // 设置信息窗体的内容
        //         infoWindow.setContent(address);
        //
        //         // 在点击位置打开信息窗体
        //         infoWindow.open(map, e.lnglat);
        //       }
        //     });
        //   });
        // });

        // map.on('click',(e) => {
        //   // lng ==> 经度值  lat => 维度值
        //   current_position.value = [e.lnglat.lng,e.lnglat.lat];
        //   AMap.plugin('AMap.Geocoder', function() {
        //       const geocoder = new AMap.Geocoder();
        //       geocoder.radius = 10
        //     geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
        //       if (status === 'complete' && result.info === 'OK') {
        //         // 获取地点名称
        //         const address = result.regeocode.formattedAddress;
        //         console.log(address);
        //       }
        //     });
        //   });
        //   path.value.push([e.lnglat.lng,e.lnglat.lat]);
        //   // addMarker();
        //   // addPolyLine();
        // })


        // 实例化点标记
        // 第一种(封成函数来触发)
        // function addMarker() {
        //   const marker = new AMap.Marker({
        //     icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        //     position: current_position.value, // 这里我们通过上面的点击获取经纬度坐标,实时添加标记
        //     // 通过设置 offset 来添加偏移量
        //     offset: new AMap.Pixel(-26, -54),
        //   });
        //   marker.setMap(map);
        // }
        // // 第二种 直接写死 position 的经纬度值
        // /*const marker = new AMap.Marker({
        //     icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        //     position: [113.808299,34.791787],
        //     // 通过设置 offset 来添加偏移量
        //     offset: new AMap.Pixel(-26, -54),
        // });
        // marker.setMap(map);*/
        //
        //
        // // 折线
        // function addPolyLine() {
        //   const polyline = new AMap.Polyline({
        //     path: path.value,
        //     isOutline: true,
        //     outlineColor: "#ffeeff",
        //     borderWeight: 1,
        //     strokeColor: "#3366FF",
        //     strokeOpacity: 0.6,
        //     strokeWeight: 5,
        //     // 折线样式还支持 'dashed'
        //     strokeStyle: "solid",
        //     // strokeStyle是dashed时有效
        //     // strokeDasharray: [10, 5],
        //     lineJoin: "round",
        //     lineCap: "round",
        //     zIndex: 50,
        //   });
        //   map.add([polyline]);
        // }



      }).catch(e=>{
        console.log(e);
      })
    }
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
  width: 100%;
  height: 800px;
}
</style>