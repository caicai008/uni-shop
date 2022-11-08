<template>
	<view>
		<!-- 搜索框 -->
		<!-- <my-search :bgcolor="'green'" :radius="1"></my-search> -->
		<my-search @click="goSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
			  <block v-for="(item, i) in cateList" :key="i">
			    <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChange(i)">{{item.cat_name}}</view>
			  </block>
			</scroll-view>
			
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
			  <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
				<!-- 二级分类标题 -->
			    <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
				<!-- 三级分类列表 -->
				<view class="cate-lv3-list">
					<!-- 三级分类item项 -->
					<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
						<image :src="item3.cat_icon" mode=""></image>
						<text>{{ item3.cat_name }}</text>
					</view>
				</view>
			  </view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				// 选中项
				active: 0,
				// 分类数据列表
				cateList: [],
				 // 二级分类列表
				cateLevel2: [],
				 // 滚动条距离顶部的距离
				scrollTop: 0
			}
		},
		onLoad() {
			const sysinfo = uni.getSystemInfoSync()
			this.wh = sysinfo.windowHeight - 50
			
			this.getCateList()
		},
		methods: {
			// 获取一级分类列表
			async getCateList() {
				const { data: res } = await uni.$http.get('public/v1/categories')
				// console.log(res);
				if(res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			
			// 获取点击项
			activeChange(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				// 切换一级分类时，动态设置 scrollTop 的值
				this.scrollTop = this.scrollTop ? 0 : 1
			},
			
			// 点击三级分类跳转到商品列表页
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			
			// 点击搜索跳转到搜索页
			goSearch() {
				// console.log('ok');
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  
  .cate-lv3-list {
	  display: flex;
	  flex-wrap: wrap;
	  
	  .cate-lv3-item {
		  width: 33.33%;
		  margin-bottom: 10px;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
	  }
	  
	  image {
		  width: 60px;
		  height: 60px;
	  }
	  
	  text {
		  font-size: 12px
	  }
  }
}
</style>
