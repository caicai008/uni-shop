<template>
	<view class="userInfo-container">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<image :src="avatar" class="avatar" mode=""></image>
			<view class="nickName">{{nickName}}</view>
		</view>
		
		<!-- 面板列表区域 -->
		<view class="panel-list">
			<!-- 面板一 -->
			<view class="panel">
				<view class="panel-body">
					<view class="panel-item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>14</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>18</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			
			<!-- 面板二 -->
			<view class="panel">
				<view class="panel-title">
					<text>我的订单</text>
				</view>
				<view class="panel-body">
						<view class="panel-item">
							<image src="../../static/my-icons/icon1.png" class="icon" mode=""></image>
							<text>待付款</text>
						</view>
						<view class="panel-item">
							<image src="../../static/my-icons/icon2.png" class="icon" mode=""></image>
							<text>待收货</text>
						</view>
						<view class="panel-item">
							<image src="../../static/my-icons/icon3.png" class="icon" mode=""></image>
							<text>退款/退货</text>
						</view>
						<view class="panel-item">
							<image src="../../static/my-icons/icon4.png" class="icon" mode=""></image>
							<text>全部订单</text>
						</view>
				</view>
			</view>
			
			<!-- 面板三 -->
			<view class="panel">
					<view class="panel-list-item">
						<text>收货地址</text>
						<uni-icons type="right"></uni-icons>
					</view>
					<view class="panel-list-item">
						<text>联系客服</text>
						<uni-icons type="right"></uni-icons>
					</view>
					<view class="panel-list-item" @click="logout">
						<text>退出登录</text>
						<uni-icons type="right"></uni-icons>
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex'
	export default {
		
		name:"my-userinfo",
		data() {
			return {
				
			};
		},
		computed: {
			...mapGetters('m_user', ['avatar', 'nickName'])
		},
		methods: {
			...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
			
			logout() {
				uni.showModal({
					title: '提示',
					content: '您确定要退出登录吗？',
					success: (res) => {
						if(res.cancel) return uni.$showMsg('取消操作！')
						
						// 确认退出
						this.updateAddress({})
						this.updateUserInfo({})
						this.updateToken('')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.userInfo-container {
	height: 100%;
	background-color: #f4f4f4;
	
	.top-box {
		height: 400rpx;
		background-color: #C00000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.avatar {
			width: 90px;
			height: 90px;
			border-radius: 50%;
			border: 2px solid white;
			box-shadow: 0 1px 5px black;
		}
		
		.nickName {
			font-size: 16px;
			color: #fff;
			margin-top: 10px;
		}
	}
	
	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;
		
		.panel {
			background-color: #fff;
			border-radius: 3px;
			margin-bottom: 10px;
			
			.panel-list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;
				line-height: 35px;
				font-size: 15px;
			}
			
			.panel-title {
				line-height: 45px;
				font-size: 15px;
				padding-left: 10px;
				border: 1px solid #f4f4f4;
			}
			
			.panel-body {
				display: flex;
				justify-content: space-around;
				
				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 12px;
					padding: 10px 0;
					
					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
		}
	}
}
</style>