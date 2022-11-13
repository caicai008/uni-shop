import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from 'store/store.js'

import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/'

// 请求拦截器
$http.beforeRequest = function(options) {
	wx.showLoading({
		title: '请求加载中'
	})
	
	// console.log(store);
	// 判断请求的是否为有权限的api接口
	if(options.url.indexOf('/my/') !== -1) {
		options.header = {
			Authorization: store.state.m_user.token
		}
	}
}

// 响应拦截器
$http.afterRequest = function() {
	wx.hideLoading()
}

// 封装消息提示
uni.$showMsg = function (title = '数据获取失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif