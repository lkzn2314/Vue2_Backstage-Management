import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//导入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
//导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//富文本编辑器对应的样式 
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入NProgress对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('formatDate', function(originVal) {
	const dt = new Date(originVal)
	
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')
	
	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')
	
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(ElementUI)
//配置请求路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
	//展示进度条
	NProgress.start()
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
axios.interceptors.response.use(res => {
	//关闭进度条
	NProgress.done()
	return res
})

Vue.prototype.$http = axios

Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
