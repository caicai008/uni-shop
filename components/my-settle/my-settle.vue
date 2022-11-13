<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio">
			<radio color="#C00000" :checked="isFullCheck" @click="changeAllState" /><text>全选</text>
		</label>

		  <!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { mapGetters, mapState, mapMutations } from 'vuex'
	import store from '../../store/store.js'
	export default {
		name:"my-settle",
		data() {
			return {
				second: 3
			}
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart']),
			
			isFullCheck() {
			    return this.total === this.checkedCount
			}
		},
		methods: {
			
			
			// 全选--反选
			changeAllState() {
				return this.$store.commit('m_cart/changeAllGoodsState', !this.isFullCheck)
			},
			
			// 结算功能
			settlement() {
				if(!this.checkedCount) return uni.$showMsg('请选择结算商品！')
				if(!this.addstr) return uni.$showMsg('请选择收获地址！')
				
				
				if(!this.token) return this.delayNavigate()
				
				// 已登录--生成订单信息
				this.payOrder()
			},
			
			// 生成订单信息
			async payOrder() {
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				const order = {
					// 开发期间，注释掉真实的订单价格，
					// order_price: this.checkedGoodsAmount,
					// 写死订单总价为 1 分钱
					order_price: 0.01,
					consignee_addr: this.addstr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({ 
						goods_id: x.goods_id, 
						goods_number: x.goods_count, 
						goods_price: x.goods_price ,
					}))
				}
				
				// 1.2 发起请求创建订单
				const {data: res} = await uni.$http.post('public/v1/my/orders/create', order)
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// console.log(res);
				// 1.3 得到服务器响应的“订单编号”
				const orderNnumber = res.message.order_number
				
				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				const {data: res2} = await uni.$http.post('public/v1/my/orders/req_unifiedorder', {order_number: orderNnumber})
				// 2.2 预付订单生成失败
				// console.log(res2);
				if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				// 2.3 得到订单支付相关的必要参数
				const payInfo = res2.message.pay
				
				// 3. 发起微信支付
				   // 3.1 调用 uni.requestPayment() 发起微信支付
				   const [err, succ] = await uni.requestPayment(payInfo)
				  
				   // 3.2 未完成支付
				   if (err) return uni.$showMsg('订单未支付！')
				   // 3.3 完成了支付，进一步查询支付的结果
				   const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				   // 3.4 检测到订单未支付
				   if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				   // 3.5 检测到订单支付完成
				   uni.showToast({
				     title: '支付完成！',
				     icon: 'success'
				   })
			},
 			
			// 时间跳转提示
			showTips(n) {
				uni.showToast({
					title: '结算请先登录！' + n + '秒后自动跳转到登录页',
					icon: 'none',
					mask: true,
				})
			},
			
			// 延时跳转方法
			delayNavigate() {
				// 重新发起请求--重置second
				this.second = 3
				
				this.showTips(this.second)
				
				this.timer = setInterval(() => {
					this.second --
					
					if(this.second <= 0) {
						clearInterval(this.timer)
						
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.$store.commit('m_user/updateRedirectInfo', {
									openType: 'switchTab',
									from: '/pages/cart/cart'
								})
							}
						})
						return 
					}
					
					this.showTips(this.second)
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 50px;
	background-color: white;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 5px;
	font-size: 14px;
	
	.amount {
		color: #c00000;
	}
	
	.btn-settle {
		height: 50px;
		min-width: 100px;
		background-color: #c00000;
		color: #fff;
		line-height: 50px;
		text-align: center;
	}
}
</style>