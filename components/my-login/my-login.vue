<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button class="btn-login" open-type="getUserInfo" @click="getUserProfile">一键登录</button>
		<!-- 登录提示 -->
		<view class="tip-login">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	import store from '../../store/store.js'
	export default {
		name:"my-login",
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		data() {
			return {
				
			};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			
			getUserProfile() {
					uni.getUserProfile({
                    desc:"weixin", // 指明用途,这个参数是必须的
                    success: res => {
						// console.log(res);
						store.commit('m_user/updateUserInfo', res.userInfo)
						
						this.getToken(res)
					}
                })
			},
			
			async getToken(info) {
				// const [err, res] = await uni.login().catch(err => err)
				// console.log(re);
				// if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
				
				// const qurey = {
				// 	code: res.code,
				// 	encryptedData: info.encryptedData,
				// 	iv: info.iv,
				// 	rawData: info.rawData,
				// 	signature: info.signature
				// }
				
				// console.log(qurey);
				
				// const { data: loginRes } = await uni.$http.post('public/v1/users/wxlogin', qurey)
				
				// let chars ='ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
				
				//        const msg = loginRes.msg || {}
				
				//        if (loginRes.meta.status === 400) {
				
				//          // 模拟token
				
				//          for (let i = 1; i < chars.length; i++) {
				
				//            const n = chars.charAt(Math.floor(Math.random() * chars.length))
				
				//            msg.token += n
				
				//          }
				
				//        }
				// 因为不是黑马的开发人员，拿不到真正的登录接口，所以使用已有的token
				const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
				
				this.updateToken(token)
				
				// if(loginRes.meta.status !== 200) return uni.$showMsg('登陆失败！')
				uni.$showMsg('登录成功！')
				this.navigatorBack()
				
			},
			
			navigatorBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}	
</script>

<style lang="scss">
.login-container {
	height: 750rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	position: relative;
	overflow: hidden;
	
	&::after {
		content: '';
		display: block;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 40px;
		background-color: white;
		border-radius: 100%;
		transform: translateY(50%);
		
	}
	
	.btn-login {
		width: 90%;
		border-radius: 100px;
		background-color: #c00000;
		color: white;
		margin: 15px 0;
	}
	
	.tip-login {
		font-size: 12px;
		color: gray;
	}
}
</style>