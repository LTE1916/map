import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import requestPlugin from './plugins/request'
import v3Directives from 'vue-next-directive'

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(requestPlugin)
app.use(v3Directives)
app.config.globalProperties.$global = {
  user: {
    authority: "GUEST",
    avatarUrl: "",
    id: 0,
    login: true,
    password: "",
    token: "",
    username: "guest"
  },
  firstLogin: true,//是否第一次登录
  getUser() {
    return this.user
  },
  setUser(user) {
    this.user = user
  },
  resetUser() {
    this.user = {
      authority: "GUEST",
      avatarUrl: "",
      id: 0,
      login: true,
      password: "",
      token: "",
      username: "guest"
    };
    this.firstLogin =  true;
  }
}


app.mount('#app');