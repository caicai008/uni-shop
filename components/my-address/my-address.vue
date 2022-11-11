<template>
	<view>
		<!-- 选择收货地址 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!--渲染收获地址 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="name">收货人：{{address.userName}}</view>
				<view class="phone">
					<text class="pnum">电话：{{address.telNumber}}</text>
					<uni-icons type="right" size="14"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="address">收货地址：{{addstr}}</view>
			</view>
		</view>
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	export default {
		name:"my-address",
		data() {
			return {
				// address: {}
			};
		},
		methods: {
			// 选择收货地址
			async chooseAddress() {
			    // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
			    //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
			    const [err, succ] = await uni.chooseAddress().catch(err => err)
				// console.log(succ);
				if(err === null && succ.errMsg === 'chooseAddress:ok') {
					// this.address = succ
					this.$store.commit('m_user/updateAddress', succ)
				}
				
				// 用户没有授权
				if(err && err.errMsg === 'chooseAddress:fail auth deny') {
					// 调用授权申请
					this.reAuth()
				}
			},
			
			// 发起授权申请
			async reAuth() {
				await uni.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					success(res) {
						if(res.cancel) return uni.$showMsg('您取消了授权操作！')
						if(res.confirm) {
							return uni.openSetting({
								success: (setRes) => {
									if(setRes.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
									if(!setRes.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
								}
							})
						}
					}
				})
			}
		},
		computed: {
			...mapState('m_user', ['address']),
			...mapGetters('m_user', ['addstr'])
		}
	}
</script>

<style lang="scss">
.address-border {
	display: block;
	width: 100%;
	height: 5px;	
}

.address-choose-box {
	height: 90px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 12px;	
}

.address-info-box {
	height: 90px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 12px;
	padding: 5px;
	
	.row1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		
		.phone {
			padding-right: 10px;
			
			.pnum {
				padding-right: 5px;
			}
		}
	}
	
	.row2 {
		font-size: 12px;
		margin-top: 10px;
	}
}
</style>