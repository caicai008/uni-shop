<template>
	<view class="">
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索列表 -->
		<view class="search-list" v-if="searchResults.length !== 0">
			<view class="search-item" v-for="item in searchResults" :key="item.goods_id" @click="gotoDetail(item.goods_id)">
				<text class="goods-name">{{item.goods_name}}</text>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
		  <!-- 标题区域 -->
		  <view class="history-title">
		    <text>搜索历史</text>
		    <uni-icons type="trash" size="17" @click="removeH"></uni-icons>
		  </view>
		  <!-- 列表区域 -->
		  <view class="history-list">
		    <uni-tag :text="item" v-for="(item, i) in historys" :key="i" type="error" :circle="true" @click="gotoGoodsList(item)"></uni-tag>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: '',
				kw: '',
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: []
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e
					// console.log(e)
					this.getSearchList()
				}, 500)
			},
			// 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
			  // 判断关键词是否为空
			  if (this.kw === '') {
			    this.searchResults = []
			    return
			  }
			  // 发起请求，获取搜索建议列表
			  const { data: res } = await uni.$http.get('public/v1/goods/qsearch', { query: this.kw })
			  // console.log(res);
			  if (res.meta.status !== 200) return uni.$showMsg()
			  this.searchResults = res.message
			},
			
			// 点击搜索列表跳跳转到详情页
			gotoDetail(id) {
				// console.log(id);
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + id
				})
				this.searchHistory()
			},
			
			// 搜索历史
			searchHistory() {
				// this.historyList.push(this.kw)
				let set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				
				// 搜索历史持久化
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			
			// 清空历史记录
			removeH() {
				uni.showModal({
					cancelText: '取消',
					confirmText: '确认',
					title: '提示',
					content: '您确认删除全部历史记录吗？',
					confirmColor: '#3B8BFF',
					cancelColor: '#222222',
					success: res => {
						if(res.cancel) {
							// console.log('cancel');
							return
						} else {
							// console.log('ok');
							this.historyList = []
							uni.setStorageSync('kw', [])
						}
					}
				})
			},
			
			// 点击搜索历史跳转到详情页
			gotoGoodsList(item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?query=' + item
				})
			}
		},
		computed: {
			historys() {
				return [...this.historyList].reverse()
			}
		},
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}

.search-list {
	padding: 0 5px;
	
	.search-item {
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		}
	}
}

.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
