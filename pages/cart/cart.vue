<template>
	<view  class="cart-box" v-if="cart.length !== 0">
		<!-- 收货地址 -->
		<my-address></my-address>
		<!-- 购物车标题 -->
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="cart-title-text">购物车</text>
		</view>
		
		<!-- 商品列表 -->
		<uni-swipe-action>
			<block class="goods" v-for="(item, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="onclick(item)">
					<my-goods :item="item" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler" @num-change="numChangeFn"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<!-- 结算 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车 -->
	<view class="empty" v-else>
		<image src="/static/cart_empty@2x.png" mode=""  class="empty-img"></image>
		<text class="empty-text">购物车里什么也没有哇~</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			}
		},
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			radioChangeHandler(e) {
				// console.log(e);
				this.$store.commit('m_cart/updateGoodsState', e)
			},
			numChangeFn(value) {
				// console.log(value);
				this.$store.commit('m_cart/updateGoodsCount', value)
			},
			onclick(item) {
				// console.log(item);
				uni.showModal({
					title: '提示',
					content: '您确定要删除当前商品吗？',
					success: res => {
						if(res.cancel) {
							// console.log('取消');
							return
						} else if(res.confirm) {
							// console.log('确定');
							this.$store.commit('m_cart/removeGoods', item.goods_id)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.cart-box {
	padding-bottom: 50px;
}
.cart-title {
	height: 40px;
	display: flex;
	align-items: center;
	font-size: 14px;
	padding-left: 5px;
	border-bottom: 1px solid #efefef;
	
	.cart-title-text {
		margin-left: 10px;
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 150px;
	
	.empty-img {
		width: 90px;
		height: 90px;
	}
	
	.empty-text {
		font-size: 12px;
		color: gray;
		margin-top: 15px;
	}
}
</style>
