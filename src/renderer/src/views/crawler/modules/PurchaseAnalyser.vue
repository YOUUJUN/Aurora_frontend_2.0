<script setup lang="ts">
import type { IPurchaseData } from '#renderer/buff_crawler'

import { message } from 'ant-design-vue'
import { errorCaptured } from '@renderer/utils/help'

import { postActionLocal } from '@renderer/api/manage'

const columns = [
	{
		dataIndex: 'name',
		title: '名称',
	},
	{
		dataIndex: 'buff_price',
		title: '成本',
		sorter: (a, b) => a.buff_price - b.buff_price,
	},
	{
		dataIndex: 'steam_price',
		title: 'steam价格',
		sorter: (a, b) => a.steam_price - b.steam_price,
	},
	{
		dataIndex: 'self_buy_num',
		title: '购买量',
		sorter: (a, b) => a.selfBuyNum - b.selfBuyNum,
	},
	{
		dataIndex: 'buy_time',
		title: '购买日期',
	},
	{
		dataIndex: 'operation',
		title: 'operation',
	},
]

const tabActiveKey = ref<string>('1')

const steamPurchaseData = ref<any[]>([])
const buffPurchaseData = ref<any[]>([])

const doSearch = (inputValue, item) => {
	return item.name.indexOf(inputValue) > -1
}

defineExpose({
	steamPurchaseData,
	buffPurchaseData,
})
</script>

<template>
	<article class="Purchase">
		<el-scrollbar>
			<a-page-header
				style="border: 1px solid rgb(235, 237, 240)"
				title="Purchase Analyser"
				sub-title="This is a subtitle"
				@back="goBack()"
			/>

			<a-tabs v-model:activeKey="tabActiveKey" size="large" centered>
				<a-tab-pane key="1" tab="Steam Purchases">
					<section class="ctrlPanel bg2">
						<a-space align="start">
							<a-button @click="getSteamPurchases()">获取Steam订单信息</a-button>
						</a-space>
					</section>

					<section class="data-panel bg2">
						<a-table :columns="columns" :data-source="steamPurchaseData">
							<template #bodyCell="{ column, record }">
								<template v-if="column.key === 'action'">
									<span>
										<a>Invite 一 {{ record.name }}</a>
										<a-divider type="vertical" />
										<a>Delete</a>
										<a-divider type="vertical" />
										<a class="ant-dropdown-link">More actions</a>
									</span>
								</template>
							</template>
						</a-table>
					</section>
				</a-tab-pane>
				<a-tab-pane key="2" tab="Buff Purchases" force-render>
					<section class="ctrlPanel bg2">
						<a-space align="start">
							<a-button @click="getBuffPurchases()">获取Buff订单信息</a-button>
						</a-space>
					</section>

					<section class="data-panel bg2">
						<a-table :columns="columns" :data-source="buffPurchaseData">
							<template #bodyCell="{ column, record }">
								<template v-if="column.key === 'action'">
									<span>
										<a>Invite 一 {{ record.name }}</a>
										<a-divider type="vertical" />
										<a>Delete</a>
										<a-divider type="vertical" />
										<a class="ant-dropdown-link">More actions</a>
									</span>
								</template>
							</template>
						</a-table>
					</section>
				</a-tab-pane>
			</a-tabs>
		</el-scrollbar>
	</article>
</template>

<script lang="ts">
export default {
	methods: {
		async getSteamPurchases() {
			const [err, msg] = await errorCaptured(postActionLocal, '/getSteamPurchases')

			if (msg) {
				console.log('msg', msg)
				this.steamPurchaseData = this.processData(msg.data.data)
				message.success(msg.data.message)
			}
		},

		async getBuffPurchases() {
			const [err, msg] = await errorCaptured(postActionLocal, '/getBuffPurchases')

			if (msg) {
				console.log('msg', msg)
				this.buffPurchaseData = this.processData(msg.data.data)
				message.success(msg.data.message)
			}
		},

		/*------*/
		processData(payload) {
			console.log('payload', payload)
			const newData: IPurchaseData[] = []
			for (let i = 0; i < payload.length; i++) {
				const data = payload[i]
				newData.push({
					key: i.toString(),
					name: data.goods_name,
					buff_price: new Number(data.buff_price).toFixed(2),
					steam_price: new Number(data.steam_price).toFixed(2),
					self_buy_num: data.buy_num,
					buy_time: data.buy_time,
				})
			}

			return newData
		},

		goBack() {
			this.$router.back()
		},
	},
}
</script>

<style scoped>
.Purchase {
	border-radius: 20px;
	height: 100%;
	overflow: hidden;
}

.breadCrumbPanel {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.ctrlPanel {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.data-panel {
	padding: 15px;
	border-radius: 20px;
}
</style>
