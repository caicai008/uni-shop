<template>
	<view class="goods-info">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item, i) in goodsInfo.pics">
				<image :src="item.pics_big" mode="" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 价格信息 -->
		<view class="goods-info-box">
			<!-- 价格 -->
			<view class="goods-price" v-if="goodsInfo.goods_price">￥{{goodsInfo.goods_price}}</view>
			<view class="goods-info">
				<!-- 名称 -->
				<view class="goods-name">{{goodsInfo.goods_name}}</view>
				<!-- 收藏 -->
				<view class="fav">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 快递 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 富文本 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		
		<!-- 商品导航组件 -->
		<view class="goods_nav">
		  <!-- fill 控制右侧按钮的样式 -->
		  <!-- options 左侧按钮的配置项 -->
		  <!-- buttonGroup 右侧按钮的配置项 -->
		  <!-- click 左侧按钮的点击事件处理函数 -->
		  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
		  <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import store from '@/store/store.js'
	import { mapGetters } from 'vuex'
	
	export default {
		data() {
			return {
				goodsInfo:[],
				goods_id: '',
				 // 左侧按钮组的配置对象
				options: [{
				  icon: 'shop',
				  text: '店铺'
				}, {
				  icon: 'cart',
				  text: '购物车',
				  info: 0
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
					text: '加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				  },
				  {
					text: '立即购买',
					backgroundColor: '#ffa200',
					color: '#fff'
				  }
				]
			}
		},
		onLoad(options) {
			// console.log(options);
			this.goods_id = options.goods_id
			this.getGoodsInfo()
		},
		watch: {
			total: {
				// handler 属性用来定义侦听器的 function 处理函数
				handler(newValue) {
					const findResult = this.options.find(x => x.text === '购物车')
					if(findResult) {
						findResult.info = newValue
					}
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
				immediate: true
			}
		},
		computed: {
			...mapGetters('m_cart', ['total'])
		},
		methods: {
			async getGoodsInfo() {
				const { data: res } = await uni.$http.get('public/v1/goods/detail?goods_id=' + this.goods_id)
				// console.log(res);
				if (res.meta.status !== 200) return uni.$showMsg()
				
				// 图片处理
				 res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp /g, 'jpg')
				
				this.goodsInfo = res.message
			},
			
			// 图片预览
			preview(i) {
				uni.previewImage({
					current: i,
					urls: this.goodsInfo.pics.map(p => p.pics_big)
				})
			},
			
			// 购物车
			onClick(e) {
				// console.log(e);
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			
			// 加入购物车
			buttonClick(e) {
				// 2. 组织一个商品的信息对象
				const goods = {
					goods_id: this.goodsInfo.goods_id,       // 商品的Id
					goods_name: this.goodsInfo.goods_name,   // 商品的名称
					goods_price: this.goodsInfo.goods_price, // 商品的价格
					goods_count: 1,                           // 商品的数量
					goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
					goods_state: true                         // 商品的勾选状态
				}
				store.commit('m_cart/addToCart', goods)
				store.commit('m_cart/saveToStorage')
			}
		}
	}
</script>

<style lang="scss">
	.goods-info {
		padding-bottom: 50px;
	}
swiper {
	height: 750rpx;
	
	image {
		width: 100%;
		height: 100%;
	}
}

.goods-info-box {
	padding: 10px;
	padding-right: 0;
	
	.goods-price {
		font-size: 18px;
		color: #c00000;
		margin: 10px 0;
	}
	.goods-info{
		display: flex;
		justify-content: space-between;
	}
	.goods-name{
		font-size: 12px;
		padding-right: 10px;
	}
	.fav{
		width: 120px;
		font-size: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-left: 1px solid #efefef;
		color: gray;
	}
	.yf{
		margin: 10px 0;
		font-size: 12px;
		color: grey;
	}
}

.goods_nav {
	// 为商品导航组件添加固定定位
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
}
</style>
