export default {
	namespaced: true,
	
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		redirectInfo: null
	}),
	
	mutations: {
		// 更新地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		
		// 地址信息保存到本地
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		
		// 用户信息保存到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		
		// 更新用户信息
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		
		// 更新用户token
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		
		// token信息保存到本地
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		
		// 登录重定向
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
			// console.log('###', state.redirectInfo);
		}
	},
	
	getters: {
		addstr(state) {
			if(!state.address.provinceName) return
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		},
		
		avatar(state) {
			return state.userInfo.avatarUrl
		},
		
		nickName(state) {
			return state.userInfo.nickName
		}
	}
}