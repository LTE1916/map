import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import requestPlugin from './plugins/request'


const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(requestPlugin)
app.mount('#app');