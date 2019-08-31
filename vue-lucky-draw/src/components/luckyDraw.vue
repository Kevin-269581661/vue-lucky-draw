<template>
	<div class="kugou-content">
		<!-- banner图 -->
		<img src="../assets/images/banner.png" alt class="bg-banner" />
		<!-- 滚动号码 -->
		<div class="kugou-scroll">
			<ul class="bg-scroll">
				<img src="../assets/images/name.png" alt class="notice-img" />
				<li v-for="(item, i) in list" :key="i" ref="rollLi" :class="{ 'anim' : animate && i == 0 }">
					<span class="lkq-name">{{ item.phone }}</span>
				</li>
			</ul>
		</div>
		<!-- 抽奖弹窗 -->
		<div class="turntable">
      <!-- 转动背景 -->
			<img src="../assets/images/flash.png" alt :class="['run-item-' + current]" />
			<!-- 礼品框 -->
			<img src="../assets/images/present.png" alt class="present-content" />
			<!-- 抽奖按钮 -->
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
import { Toast } from 'vant';

export default {
	name: "index",
	data() {
		return {
			animate: false,
			initSpeed: 200,  // 初始速度
			speed: null,  // 变化速度
			diff: 20,  // 速度变化的值，值越大，变化地越快
			award: {},  // 抽中的奖品
			awards: [  // 奖品列表
        {
          id: 1,
          name: '潘多拉音箱'
        },
        {
          id: 2,
          name: '小酷M1耳机'
        },
        {
          id: 3,
          name: '酷狗VIP会员'
        },
        {
          id: 4,
          name: '8元话费'
        },
        {
          id: 5,
          name: '12元话费'
        },
        {
          id: 6,
          name: '谢谢参与'
        },
        {
          id: 7,
          name: '4元话费'
        },
        {
          id: 8,
          name: '谢谢参与'
        }
			],
			time: 0,  // 记录开始抽奖的时间
			current: 0,  // 当前转动的位置
			isRuningLucky: false,  // 是否正在抽奖
			list: [  // 中奖号码
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
	},
	mounted() {
		let scrollTimer = setInterval(this.scroll, 2000);
	},
	methods: {
		// 抽奖
		handleStart() {
			if (this.isRuningLucky) {
				return Toast("正在抽奖中...");
			}
			if (isNaN(Number(this.initSpeed))) {
				return false;
			}
			this.speed = this.initSpeed;
			// 开始抽奖
			this.isRuningLucky = true;
			this.time = Date.now();
			this.drawAward();
			Toast("开始抽奖");
		},
		drawAward() {
			// 请求接口，模拟一个抽奖数据(假设请求时间为2s)
			setTimeout(() => {
				this.award = {
					id: "4"
				};
				console.log("返回的抽奖结果是", this.award);
			}, 2000);
			this.move();
		},
		move() {
			let timer = setTimeout(() => {
				this.current++;
				if (this.current > 7) {
					this.current = 0;
				}
				// 若抽中的奖品id存在，则开始减速转动
				if (this.award.id && (Date.now() - this.time) / 1000 > 2) {
					console.log("奖品出来了");
          this.speed += this.diff; // 转动减速
          
					// 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
					if (
						(Date.now() - this.time) / 1000 > 4 &&
						this.award.id == this.awards[this.current].id
					) {
						clearTimeout(timer);

						setTimeout(() => {
              this.isRuningLucky = false;
							// 这里写停下来要执行的操作（弹出奖品框）
							Toast(
								"您抽中的奖品是" + this.awards[this.current].name + ",奖品id是" + this.awards[this.current].id
							);
						}, 400);
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
		// 中奖名单滚动
		scroll() {
			this.animate = true;
			let timer = setTimeout(() => {
				this.list.push(this.list[0]);
				this.list.shift();
				this.animate = false;
			}, 500);
		}
	}
};
</script>
<style lang="stylus" scoped>

.kugou-content {
  background-color: #000;
	width: 100%;
	overflow: hidden;
	position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
	padding-top: 4.1rem;
	// 顶部图片
	.bg-banner {
		position: absolute;
		top: 0;
		right: 0;
		width: 8.4rem;
	}
	// 滚动号码
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
      font-size: 0.28rem;
		}
		.anim {
			transition: all 0.5s linear;
			margin-top: -0.74rem;
		}
	}
	// 抽奖
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
		.run-item-0 {
			width: 2.03rem;
		}
		.run-item-1 {
			width: 2.03rem;
			display: block;
			margin: 0 0 0 1.93rem;
		}
		.run-item-2 {
			width: 2.03rem;
			display: block;
			margin: 0 0 0 3.85rem;
		}
		.run-item-3 {
			width: 2.03rem;
			display: block;
			margin: 1.9rem 0 0 3.85rem;
		}
		.run-item-4 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 3.85rem;
		}
		.run-item-5 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 1.925rem;
		}
		.run-item-6 {
			width: 2.03rem;
			display: block;
			margin: 3.8rem 0 0 0;
		}
		.run-item-7 {
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
