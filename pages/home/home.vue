<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<my-search @click="goSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="item in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="'../../subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" 
				@click="navClickHandler(item)"
			>
				<image :src="item.image_src" mode="" class="nav-img"></image>
			</view>
		</view>

		<!-- 商品楼层 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item, index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" mode="" class="floor-title"></image>
				<!-- 楼层图片 -->
				<view class="floor-img-box">
					<!-- 左侧大图 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧小图 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(obj, i) in item.product_list" :key="i" v-if="i !== 0" :url="obj.url">
							<image :src="obj.image_src" :style="{width: obj.image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [], // 轮播图列表
				navList: [], // 分类导航
				floorList: [] // 楼层的数据列表
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 获取轮播图数据
			async getSwiperList() {
				const { data: res } = await uni.$http.get('public/v1/home/swiperdata')
				// console.log(res);
				if(res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
			},
			
			// 获取分类导航数据
			async getNavList() {
				const { data: res } = await uni.$http.get('public/v1/home/catitems')
				// console.log(res);
				if(res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
			},
			
			// 点击分类导航跳转
			navClickHandler(item) {
				if(item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			
			// 获取楼层的数据列表
			async getFloorList() {
				const { data: res } = await uni.$http.get('public/v1/home/floordata')
				// console.log(res);
				if(res.meta.status !== 200) return uni.$showMsg()
				 // 通过双层 forEach 循环，处理 URL 地址
				  res.message.forEach(floor => {
				    floor.product_list.forEach(prod => {
				      prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
				    })
				  })
				this.floorList = res.message
			},
			
			goSearch() {
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style>
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}	

swiper {
	height: 330rpx;
}
.swiper-item, image {
	width: 100%;
	height: 100%;
}
.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 15rpx 0;
}
.nav-img {
	width: 128rpx;
	height: 140rpx;
}
.floor-title {
	width: 100%;
	height: 60rpx;
	display: flex;
}
.floor-img-box {
	display: flex;
	padding-left: 10rpx;
}
.right-img-box {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}
</style>