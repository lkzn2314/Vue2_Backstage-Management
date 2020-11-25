import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//导入element-ui
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

//导入字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.use(ElementUI);

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
