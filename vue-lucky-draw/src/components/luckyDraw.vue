<template>
	<div class="kugou-content">
		<!-- banner图 -->
		<img src="../assets/images/banner.png" alt class="bg-banner" />
		<!-- 滚动号码 -->
		<div class="kugou-scroll" id="container">
			<ul class="bg-scroll">
				<img src="../assets/images/name.png" alt class="notice-img" />
				<li v-for="(item, i) in list" :key="i" ref="rollLi" :class="{ 'anim' : animate && i == 0 }">
					<span class="lkq-name">{{ item.phone }}</span>
				</li>
			</ul>
		</div>
		<!-- 抽奖弹窗 -->
		<div class="turntable">
			<img src="../assets/images/flash.png" alt :class="['run-item-' + current]" />
			<!-- 礼品部分 -->
			<img src="../assets/images/present.png" alt class="present-content" />
			<!-- 按钮 -->
			<img
				@click="handleStart"
				src="../assets/images/bigBottom.png"
				alt
				class="start-btn-big"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: "index",
	data() {
		return {
			animate: false,
			initSpeed: 200, // 初始速度
			speed: null, // 变化速度
			diff: 20, // 速度增加的值
			award: {}, // 抽中的奖品
			awards: [
				// 奖品列表
			],
			time: 0, // 记录开始抽奖的时间
			current: 1, // 当前转动的位置
			isRuningLucky: false, // 是否正在抽奖
			listenContentList: "",
			activeName: "张杰",
			list: [
				{
					phone: "186****2336抽中0元话费"
				},
				{
					phone: "166****2336抽中1元话费"
				},
				{
					phone: "156****2336抽中2元话费"
				}
			]
		};
	},
	created() {
		//  this.getKugouSongInfoList()
	},
	mounted() {
		// var btnTimer = setInterval(() => {
		//   this.isBigBtn = !this.isBigBtn
		// }, 300)
		this.handleDeviceWidth();
		window.addEventListener("resize", this.handleDeviceWidth);
		let scrollTimer1 = setInterval(this.scroll, 2000);
		// this.scroll()
	},
	methods: {
		// 抽奖
		handleStart() {
			if (this.isRuningLucky) {
				return this.$toast("正在抽奖中...");
			}
			if (isNaN(Number(this.initSpeed))) {
				return false;
			}
			this.speed = this.initSpeed;
			//  if(this.callNumber){
			//  // 开始抽奖
			this.isRuningLucky = true;
			this.time = Date.now();
			this.drawAward();
			this.$toast("开始抽奖");
			console.log("开始抽奖");
			//  } else {
			//   this.$refs.LoginDialog.openDialog()
			//  }

			// let params2 = {
			//   title: '酷狗',
			//   currentUrl: window.location.href,
			//   pageId: 'kugou',
			//   operate: 'click',
			//   operateDesc: { desc: '酷狗和订购' },
			//   channelId: this.channelId // 赋值
			// }
			// window.submitStatInfo(params2)
			// 订购
			// window.WOMH5SDK &&
			//   window.WOMH5SDK.iap.placeOrder('111', 'unique_good_id', 500, 'CNY')
		},
		drawAward() {
			// 请求接口，模拟一个数据(请求时间为2s)
			setTimeout(() => {
				this.award = {
					id: "4",
					name: "天线宝宝"
				};
				console.log("返回的抽奖结果是", this.award);
			}, 2000);
			this.move();
		},
		move() {
			let timer = setTimeout(() => {
				this.current++;
				if (this.current > 8) {
					this.current = 1;
				}
				// 若抽中的奖品id存在，则开始减速转动
				if (this.award.id && (Date.now() - this.time) / 1000 > 2) {
					console.log("奖品出来了");
					this.speed += this.diff; // 转动减速

					// 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
					if (
						(Date.now() - this.time) / 1000 > 4 &&
						this.award.id == this.current
						// (Date.now() - this.time) / 1000 > 4 && this.award.id == this.awards[this.current].id
					) {
						clearTimeout(timer);
						this.isRuningLucky = false;
						setTimeout(() => {
							// 这里写停下来要执行的操作（弹框）
							this.$toast(
								"您的奖品是" + this.award.name + ",奖品id是" + this.current
							);
						}, 100);
						return;
					}

					// 若抽中的奖品不存在，则加速转动
				} else {
					if (this.speed >= 50) {
						this.speed -= this.diff; // 转动加速
					}
				}

				this.move();
			}, this.speed);
		},
		// 视口适配
		handleDeviceWidth() {
			var deviceWidth = document.documentElement.clientWidth;
			if (deviceWidth > 750) deviceWidth = 750;
			document.documentElement.style.fontSize = deviceWidth / 7.5 + "px";
		},
		// 歌曲
		getKugouSongInfoList() {
			getActiveSongInfoList({
				activeName: this.activeName
			}).then(res => {
				if (res.data.code === "200") {
					console.log("请求的结果是", res.data);
					// 截取只可以显示5首歌
					let arr = res.data.data;
					if (arr.length > 3) {
						arr = arr.slice(0, 3); // 变量可修改
					}
					this.listenContentList = res.data.data;
				}
			});
		},
		//  滚动
		scroll() {
			this.animate = true;
			let timer = setTimeout(() => {
				this.list.push(this.list[0]);
				this.list.shift();
				this.animate = false;
				// 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
				console.log("滚动定时");
			}, 500);
		}
	}
};
</script>
<style lang="stylus" scoped>

.kugou-content {
	width: 100%;
	overflow: hidden;
	position: relative;
	padding-top: 4.1rem;
	// banner图
	.bg-banner {
		position: absolute;
		top: 0;
		right: 0;
		width: 8.4rem;
	}
	// 中奖抽奖
	.kugou-scroll {
		.bg-scroll {
			position: relative;
			background: url("../assets/images/phone.png") center top no-repeat;
			background-size: 100%;
			width: 100%;
			height: 0.74rem;
			line-height: 0.74rem;
			font-size: 0.35rem;
			overflow: hidden;
			text-align: center;
			letter-spacing: 0.03rem;
		}
		.lkq-name {
			margin: 0 auto;
			color: #fff;
		}
		.anim {
			transition: all 0.5s linear;
			margin-top: -0.74rem;
		}
	}
	// 抽奖框
	.turntable {
		position: relative;
		background: url("../assets/images/lottery.png") center top no-repeat;
		background-size: 8.5rem;
		background-position: -1.06rem -0.9rem;
		height: 8.2rem;
		padding: 1.55rem 0.83rem 1.15rem;
		.present-content {
			width: 75%;
			position: absolute;
			top: 1.68rem;
			left: 0.96rem;
			z-index: 100;
		}
		.start-btn-big {
			width: 1.8rem;
			position: absolute;
			top: 3.55rem;
			left: 2.88rem;
			z-index: 999;
			animation: btn-animation 0.3s ease-out infinite alternate;
		}
		.run-item-1 {
			width: 2.03rem;
		}
		.run-item-2 {
			width: 2.03rem;
			display: block;
			margin: 0 0 0 1.93rem;
		}
		.run-item-3 {
			width: 2.03rem;
			display: block;
			margin: 0 0 0 3.85rem;
		}
		.run-item-4 {
			width: 2.03rem;
			display: block;
			margin: 1.9rem 0 0 3.85rem;
		}
		.run-item-5 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 3.85rem;
		}
		.run-item-6 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 1.925rem;
		}
		.run-item-7 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 0;
		}
		.run-item-8 {
			width: 2.03rem;
			display: block;
			margin: 1.9rem 0 0 0;
		}
	}
	
}

@keyframes btn-animation {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.85);
	}
}

.notice-img {
	position: absolute;
	top: 0.12rem;
	left: 0.55rem;
}
</style>
