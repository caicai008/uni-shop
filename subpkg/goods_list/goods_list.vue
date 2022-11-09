<template>
	<view class="goods-list">
		<view v-for="item in goodsList" :key="item.goods_id" @click="goDoodsDetail(item)">
			<my-goods :item="item"></my-goods>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					// 请求参数对象
					queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				goodsList: [],
				total: 0,
			}
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// console.log(this.queryObj);
			
			this.getGoodsList()
		},
		methods: {
			 // 获取商品列表数据的方法
			  async getGoodsList(cd) {
			    // 发起请求
			    const { data: res } = await uni.$http.get('public/v1/goods/search', this.queryObj)
			    if (res.meta.status !== 200) return uni.$showMsg()
				
				// 请求结束--调用回调
				cd && cd()
			    // 为数据赋值--新旧数据拼接
			    this.goodsList = [...this.goodsList, ...res.message.goods]
			    this.total = res.message.total
				// console.log(this.goodsList);
			  },
			  
			  // 点击item项跳转到商品详情页
			  goDoodsDetail(item) {
				  uni.navigateTo({
				  	url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				  })
			  }
		},
		onReachBottom() {
			if(this.queryObj.pagenum * this.queryObj.pagesize > this.total) {
				return uni.$showMsg('数据加载完毕！')
			}
			this.queryObj.pagenum += 1
			
			this.getGoodsList()
		},
		onPullDownRefresh() {
			// 重置关键信息
			this.queryObj.total = 0
			this.queryObj.pagenum = 1
			this.goodsList = []
			
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
