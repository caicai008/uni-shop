<template>
	<view>
		<view class="goods-item">
			<view class="goods-left">
				<image :src="item.goods_small_logo || defaultPic" mode="" class="goods-pic"></image>
			</view>
			<view class="goods-right">
				<view class="goods-name">{{item.goods_name}}</view>
				<view class="goods-price">￥{{item.goods_price | tofixed}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: {}
			}
		},
		name:"my-goods",
		data() {
			return {
				defaultPic: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
			};
		},
		filters: {
		  // 把数字处理为带两位小数点的数字
		  tofixed(num) {
		    return Number(num).toFixed(2)
		  }
		}
	}
</script>

<style lang="scss">
.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		
		.goods-left {
			margin-right: 5px;
			
			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		
		.goods-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name {
				font-size: 12px;
			}
			
			.goods-price {
				font-size: 16px;
				color: #C00000;
			}
		}
	}
</style>