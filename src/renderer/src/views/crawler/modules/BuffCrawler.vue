<script setup lang="ts">
import type { Ref } from 'vue'
import type { Dayjs } from 'dayjs'
import { EnvEnum } from '@renderer/enums/env_enum'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

import { sendMessageToNode } from '@renderer/utils/ipc'

import { ref, reactive, createVNode } from 'vue'

import { useSocketIO } from '@renderer/hooks/use_socketio'

import useCrawlerCtrl from '@renderer/hooks/use_crawler_ctrl'
import { useRouter } from 'vue-router'

const {
	actPage,
	endPage,
	offset,
	limit,
	token,
	buffData,
	startBuffCrawlerByPage,
	stopBuffCrawler,
	clearBuffData,
	gatherBuffData,
	reverseBuff,
	actBuffHistoryPrices,
	stopBuffHistoryPrices,
	fetchHistoryBuffData,
	saveServerCacheHistoryPrice,
	startRefererBuff,
	stopRefererBuff,
	gatherRefererBuff,
	clearRefererBuff,
	updateLogInfo,
	saveServerCacheData,
	saveSteamPurchaseData,
	saveBuffPurchaseData,
} = useCrawlerCtrl()

const { ipcRenderer } = window.electron

const originTargetKeys = []

const leftTableColumns = [
	{
		dataIndex: 'name',
		title: '名称',
		width: 300,
		resizable: true,
	},
	{
		dataIndex: 'costPerformance',
		title: '性价比',
		sorter: (a, b) => a.costPerformance - b.costPerformance,
	},
	// {
	//     dataIndex: "historyPrices",
	//     title: "buff历史价格",
	//     sorter: (a, b) => a.historyPrices - b.historyPrices,
	// },
	{
		dataIndex: 'cost',
		title: '成本',
		sorter: (a, b) => a.cost - b.cost,
	},
	{
		dataIndex: 'steamPrice',
		title: 'steam价格',
		sorter: (a, b) => a.steamPrice - b.steamPrice,
	},
	{
		dataIndex: 'difference',
		title: '差价',
		sorter: (a, b) => a.difference - b.difference,
	},
	{
		dataIndex: 'buyNum',
		title: '销售量',
		sorter: (a, b) => a.buyNum - b.buyNum,
	},
	{
		dataIndex: 'profits',
		title: '预估利润',
		sorter: (a, b) => a.profits - b.profits,
	},
	{
		dataIndex: 'differentialRate',
		title: '差价率',
		sorter: (a, b) => a.differentialRate - b.differentialRate,
	},
	{
		dataIndex: 'priceList',
		title: '在售价格',
		customRender: (text, record) => {
			return text.value.join(' / ')
		},
	},

	{
		dataIndex: 'leftOperation',
		title: '跳转',
	},
]

const rightTableColumns = [
	{
		dataIndex: 'name',
		title: '名称',
	},
	{
		dataIndex: 'cost',
		title: '成本',
		sorter: (a, b) => a.cost - b.cost,
	},
	{
		dataIndex: 'steamPrice',
		title: 'steam价格',
		sorter: (a, b) => a.steamPrice - b.steamPrice,
	},
	{
		dataIndex: 'selfBuyNum',
		title: '购买量',
		sorter: (a, b) => a.selfBuyNum - b.selfBuyNum,
	},
	{
		dataIndex: 'operation',
		title: 'operation',
	},
]

const transferTable: Ref<InstanceType<any>> = ref(null)
const { openExternal } = <any>window.api

console.log('import.meta', import.meta.env)
console.log('servePath', EnvEnum.servicePath)
const servePath = ref(EnvEnum.servicePath)

//历史价格数据统计时间
const statisticalTime = ref<Dayjs>()

/*--data transfer--*/
const targetKeys: Ref<any[]> = ref(originTargetKeys)
const disabled = ref(false)
const showSearch = ref(true)
const leftColumns = ref(leftTableColumns)
const rightColumns = ref(rightTableColumns)

/*--buff--*/
// const buffData = ref<TProcessedBuffData[]>(useDataStore().buffData)
const serverStatus = ref('default')
const serverStatusText = ref('closed')
const serverStartTime = ref('')
const serverEndTime = ref('')

/*--修改行--*/
const editableData = reactive({})
const edit = (key) => {
	editableData[key] = buffData.value.filter((item) => key === item.key)[0]
}
const save = (key) => {
	Object.assign(buffData.value.filter((item) => key === item.key)[0], editableData[key])
	delete editableData[key]
}
const cancel = (key) => {
	delete editableData[key]
}

const onChange = (nextTargetKeys, direction, moveKeys) => {
	console.log('nextTargetKeys', nextTargetKeys)
	const rightData: any[] = []
	console.log('buffData', buffData)
	for (let i = 0; i < nextTargetKeys.length; i++) {
		rightData.push(buffData.value[nextTargetKeys[i]])
	}
}

const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => {
	return {
		getCheckboxProps: (item) => ({
			disabled: disabled || item.disabled,
		}),
		onSelectAll(selected, selectedRows) {
			const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key)
			onItemSelectAll(treeSelectedKeys, selected)
		},
		onSelect({ key }, selected) {
			onItemSelect(key, selected)
		},
		selectedRowKeys: selectedKeys,
	}
}

/*--buff--*/

ipcRenderer.on('buffCrawlerRunning', (e, payload) => {
	console.log('im in!!!!!!!!!!!!!!!!!!!!!!!')
	serverStatus.value = 'processing'
	serverStatusText.value = 'Running'
	serverStartTime.value = new Date().toLocaleString()
	message.success('服务启动成功!')
})

ipcRenderer.on('buffCrawlerClosing', (e, payload) => {
	serverStatus.value = 'default'
	serverStatusText.value = 'closed'
	serverEndTime.value = new Date().toLocaleString()
	message.success('服务关闭成功!')
})

const startCrawlerServer = (info) => {
	let command = ''
	if (info === 'dev') {
		command = 'startDevBuffCrawler'
	} else if (info === 'prd') {
		command = 'startPrdBuffCrawler'
	}
	Modal.confirm({
		title: '是否确认打开服务?',
		icon: createVNode(ExclamationCircleOutlined),
		content: '该操作会在后台启动 pm2 buffCrawler 服务',
		onOk() {
			return new Promise<void>((resolve, reject) => {
				console.log('-------------------lalalalalla')
				sendMessageToNode(command, servePath.value)

				ipcRenderer.once('startBuffCrawlerFailed', (e, payload) => {
					message.error('服务启动失败!')
					reject()
				})
				ipcRenderer.once('startBuffCrawlerDone', (e, payload) => {
					resolve()
					setTimeout(() => {
						connectSocket()
					}, 10000)
				})
			})
		},

		onCancel() {},
	})
}

const stopCrawlerServer = () => {
	Modal.confirm({
		title: '是否确认关闭服务?',
		icon: createVNode(ExclamationCircleOutlined),
		content: '该操作会关闭后台 pm2 buffCrawler 服务',
		onOk() {
			return new Promise<void>((resolve, reject) => {
				sendMessageToNode('stopBuffCrawler', servePath.value)
				ipcRenderer.once('stopBuffCrawlerFailed', (e, payload) => {
					message.error('服务启动失败!')
					reject()
				})
				ipcRenderer.once('stopBuffCrawlerDone', (e, payload) => {
					resolve()
				})
			})
		},

		onCancel() {},
	})
}

const reStartCrawlerServer = () => {
	Modal.confirm({
		title: '是否确认重启服务?',
		icon: createVNode(ExclamationCircleOutlined),
		content: '该操作会重启后台 pm2 buffCrawler 服务',
		onOk() {
			return new Promise<void>((resolve, reject) => {
				sendMessageToNode('reStartBuffCrawler', servePath.value)
				ipcRenderer.once('startBuffCrawlerFailed', (e, payload) => {
					message.error('服务启动失败!')
					reject()
				})
				ipcRenderer.once('startBuffCrawlerDone', (e, payload) => {
					resolve()
					setTimeout(() => {
						connectSocket()
					}, 10000)
				})
			})
		},

		onCancel() {},
	})
}

const connectSocket = () => {
	// SocketService.Instance.connect()
	// const socket = SocketService.Instance
	// socket.registerCallBack('endLoop', (payload) => {
	// 	if (payload === 'endLoop') {
	// 		sendMessageToNode('notifyLoopEnd')
	// 	}
	// })
	// return SocketService.Instance
	const wsUrl = `ws://localhost:8888/`
	useSocketIO(wsUrl).socket.once('endLoop', (payload) => {
		// console.log('payload', payload);
		// new Notification(`通知！！！`, {
		//     body: `本次循环任务已经完成！`
		// });
		sendMessageToNode('notifyLoopEnd')
	})
}

const getBuffCrawlerLog = () => {
	sendMessageToNode('getBuffCrawlerLog', servePath.value)
}

function confirmAction(action: Function, ...params: any[]) {
	let title = ''
	const funcName = action.name.split(' ').pop()
	switch (funcName) {
		case 'startBuffCrawlerByPage':
			title = '是否启动BUFF爬虫?'
			break
		case 'stopBuffCrawler':
			title = '是否关闭BUFF爬虫?'
			break
		case 'clearBuffData':
			title = '是否清除BUFF数据?'
			break
		case 'gatherBuffData':
			title = '是否创建BUFF数据汇总?'
			break
		case 'fetchHistoryBuffData':
			title = '是否启动BUFF历史数据加载?'
			break
		case 'actBuffHistoryPrices':
			title = '是否启动BUFF历史价格爬虫?'
			break
		case 'stopBuffHistoryPrices':
			title = '是否关闭BUFF历史价格爬虫?'
			break
		case 'startRefererBuff':
			title = '是否启动 REFERER BUFF爬虫?'
			break
		case 'stopRefererBuff':
			title = '是否关闭 REFERER BUFF爬虫?'
			break
		case 'gatherRefererBuff':
			title = '是否启动REFERER BUFF数据汇总?'
			break
		case 'clearRefererBuff':
			title = '是否清除REFERER BUFF数据?'
			break
	}

	Modal.confirm({
		title,
		icon: createVNode(ExclamationCircleOutlined),
		onOk() {
			action.apply(this, params)
		},

		onCancel() {},
	})
}

async function saveToSteam() {
	if (unref(targetKeys).length < 1) {
		return
	}

	const rightData: any[] = []
	for (let i = 0; i < unref(targetKeys).length; i++) {
		console.log(targetKeys[i])
		rightData.push(buffData[targetKeys[i]])
	}

	console.log('rightData', rightData)

	saveSteamPurchaseData(rightData)
}

async function saveToBuff() {
	if (unref(targetKeys).length < 1) {
		return
	}

	const rightData: any[] = []
	for (let i = 0; i < unref(targetKeys).length; i++) {
		rightData.push(buffData[targetKeys[i]])
	}

	console.log('rightData', rightData)

	saveBuffPurchaseData(rightData)
}

//浏览器跳转
function goTo(target: string, record: Pick<TProcessedBuffData, 'steamUrl' | 'refererUrl'>): void {
	let link = ''
	switch (target) {
		case 'steam':
			link = record.steamUrl
			break
		case 'buff':
			link = record.refererUrl
			break
	}
	openExternal(link)
}

//显示隐藏右侧表格
function toggleRightTable(): void {
	const shell: any = unref(transferTable).$el
	const rightTable = shell.querySelector('.rightTable')
	rightTable.classList.toggle('hide')
}

function doSearch(inputValue, item) {
	return item.name.indexOf(inputValue) > -1
}

function resetTransferStyle(params) {
	if (params.direction === 'left') {
		return {
			flex: 1,
		}
	} else {
		return {
			flex: 0,
		}
	}
}

function analysePurchase() {
	useRouter().push({
		name: 'PurchaseAnalyser',
	})
}

function analyseData() {
	useRouter().push({
		name: 'DataAnalyser',
	})
}

defineExpose({
	buffData,
	targetKeys,

	transferTable,
	openExternal,
	actPage,
	endPage,
	offset,
	limit,
	statisticalTime,
})
</script>

<template>
	<div class="BuffCrawler">
		<el-scrollbar>
			<section class="title bg2">
				<h2>Buff Crawler</h2>
			</section>

			<section class="status-panel bg2">
				<a-descriptions title="Server Info" bordered>
					<a-descriptions-item label="Serve Path" :span="3">
						<a-input v-model:value="servePath" placeholder="input absolute serve path" />
					</a-descriptions-item>
					<a-descriptions-item label="Product">Buff Crawler</a-descriptions-item>
					<a-descriptions-item label="Control Panel" :span="2">
						<a-space>
							<a-button @click="startCrawlerServer('dev')">启动DEV</a-button>
							<a-button @click="startCrawlerServer('prd')">启动PRD</a-button>
							<a-button @click="stopCrawlerServer()">关闭</a-button>
							<a-button @click="reStartCrawlerServer()">重启</a-button>
							<a-button @click="getBuffCrawlerLog()">获取打印日志</a-button>
						</a-space>
					</a-descriptions-item>
					<a-descriptions-item label="Status">
						<a-badge :status="serverStatus" :text="serverStatusText" />
					</a-descriptions-item>
					<a-descriptions-item label="Start time">{{ serverStartTime }}</a-descriptions-item>
					<a-descriptions-item label="End Time">{{ serverEndTime }}</a-descriptions-item>
					<a-descriptions-item label="Latest Token" :span="3">
						<a-input-search
							v-model:value="token"
							placeholder="input latest token"
							size="large"
							@search="updateLogInfo(token)"
						>
							<template #enterButton>
								<a-button>更新</a-button>
							</template>
						</a-input-search>
					</a-descriptions-item>
					<a-descriptions-item label="Server Info">
						Data disk type: MongoDB
						<br />
						Database version: 3.4
						<br />
						Package: dds.mongo.mid
						<br />
						Storage space: 10 GB
						<br />
						Replication factor: 3
						<br />
						Region: East China 1
						<br />
					</a-descriptions-item>
				</a-descriptions>
			</section>

			<section class="ctrlPanel bg2">
				<a-space style="flex-wrap: wrap">
					<!-- <a-button @click="confirmAction(startBuffCrawlerByPage)"
                        >BUFF爬虫启动！！</a-button
                    > -->
					<a-button @click="confirmAction(startBuffCrawlerByPage, actPage, endPage)">BUFF启动从</a-button>
					<a-input-number v-model:value="actPage" addon-before="页数从" min="1" step="150" max="910" />
					<a-input-number v-model:value="endPage" addon-before="页数到" min="2" step="150" max="910" />
					<a-button @click="confirmAction(stopBuffCrawler)">BUFF爬虫关闭！！</a-button>
					<a-button @click="confirmAction(gatherBuffData)">启动BUFF数据汇总</a-button>
					<a-button @click="reverseBuff()">启动BUFF数据汇总(倒序)</a-button>
					<a-button @click="confirmAction(fetchHistoryBuffData)">启动BUFF历史数据加载</a-button>
					<a-button @click="confirmAction(actBuffHistoryPrices)">BUFF历史价格爬虫启动！！</a-button>
					<a-button @click="confirmAction(stopBuffHistoryPrices)">BUFF历史价格爬虫关闭！！</a-button>
					<a-button @click="confirmAction(clearBuffData)">清除BUFF数据！！</a-button>
					<a-button @click="analysePurchase()">分析订单</a-button>
					<a-button @click="analyseData()">分析数据</a-button>
					<a-button @click="saveServerCacheData()">保存缓存数据</a-button>
					<a-date-picker
						v-model:value="statisticalTime"
						placeholder="请选择历史价格统计时间"
						style="width: 200px"
					/>
					<a-button @click="saveServerCacheHistoryPrice()">保存缓存历史价格数据</a-button>
				</a-space>
			</section>

			<section class="ctrlPanel bg2">
				<a-space style="flex-wrap: wrap">
					<a-input-number v-model:value="offset" addon-before="offset" min="0" step="100" />
					<a-input-number v-model:value="limit" addon-before="limit" min="1" step="150" />
				</a-space>

				<a-space style="flex-wrap: wrap">
					<a-button @click="confirmAction(startRefererBuff, 'sticker', offset, limit)">
						启动REFERER BUFF爬虫_印花
					</a-button>
					<a-button @click="confirmAction(startRefererBuff, 'major')">启动REFERER BUFF爬虫</a-button>
				</a-space>

				<a-space style="flex-wrap: wrap">
					<a-button @click="confirmAction(stopRefererBuff)">关闭REFERER BUFF爬虫</a-button>
					<a-button @click="confirmAction(gatherRefererBuff)">启动REFERER BUFF数据汇总</a-button>
					<a-button @click="confirmAction(clearRefererBuff)">清除REFERER BUFF数据</a-button>
				</a-space>
			</section>

			<section class="data-panel bg2">
				<a-transfer
					ref="transferTable"
					v-model:target-keys="targetKeys"
					:data-source="buffData"
					:disabled="disabled"
					:show-search="showSearch"
					:show-select-all="true"
					:filter-option="doSearch"
					:list-style="resetTransferStyle"
					@change="onChange"
				>
					<template
						#children="{
							direction,
							filteredItems,
							selectedKeys,
							disabled: listDisabled,
							onItemSelectAll,
							onItemSelect,
						}"
					>
						<a-table
							:row-selection="
								getRowSelection({
									disabled: listDisabled,
									selectedKeys,
									onItemSelectAll,
									onItemSelect,
								})
							"
							:columns="direction === 'left' ? leftColumns : rightColumns"
							:class="{ rightTable: direction === 'right', hide: direction === 'right' }"
							:data-source="filteredItems"
							size="default"
							:custom-row="
								({ key, disabled: itemDisabled }) => ({
									onClick: () => {
										if (itemDisabled || listDisabled) return
										onItemSelect(key, !selectedKeys.includes(key))
									},
								})
							"
						>
							<template #bodyCell="{ column, text, record }">
								<template v-if="['cost', 'selfBuyNum', 'steamPrice'].includes(column.dataIndex)">
									<div>
										<a-input
											v-if="editableData[record.key]"
											v-model:value="editableData[record.key][column.dataIndex]"
											style="margin: -5px 0"
										/>
										<template v-else>
											{{ text }}
										</template>
									</div>
								</template>
								<template v-else-if="column.dataIndex === 'operation'">
									<div class="editable-row-operations">
										<a-space>
											<span v-if="editableData[record.key]">
												<a @click="save(record.key)">Save</a>
												<a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
													<a>Cancel</a>
												</a-popconfirm>
											</span>
											<span v-else>
												<a @click="edit(record.key)">Edit</a>
											</span>
										</a-space>
									</div>
								</template>
								<template v-else-if="column.dataIndex === 'leftOperation'">
									<div class="editable-row-operations">
										<a-space>
											<span>
												<a @click="goTo('steam', record)">跳转steam</a>
											</span>
											<span>
												<a @click="goTo('buff', record)">跳转buff</a>
											</span>
										</a-space>
									</div>
								</template>
							</template>
						</a-table>
					</template>

					<template #footer="{ direction }">
						<a-button
							v-if="direction === 'left'"
							style="float: left; margin: 5px"
							@click="toggleRightTable"
						>
							显示/隐藏右侧表格
						</a-button>
						<a-button v-if="direction === 'right'" style="float: left; margin: 5px" @click="saveToSteam">
							从Steam购买
						</a-button>
						<a-button v-if="direction === 'right'" style="float: left; margin: 5px" @click="saveToBuff">
							从Buff购买
						</a-button>
					</template>
				</a-transfer>
			</section>
		</el-scrollbar>
	</div>
</template>

<style scoped>
.BuffCrawler {
	border-radius: 20px;
	height: 100%;
	overflow: hidden;
}

.title {
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.title h2 {
	font-size: 18px;
	margin: 0;
}

.status-panel {
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.ctrlPanel {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	gap: 10px;
	flex-wrap: wrap;
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.data-panel {
	padding: 15px;
	border-radius: 20px;
}

/*--右边穿梭框--*/

.rightTable {
	width: 640px;
}

.hide {
	display: none;
}
</style>
