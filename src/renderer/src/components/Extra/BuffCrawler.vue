<script setup lang="ts">
import type { Ref } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

import { sendMessageToNode } from '@renderer/utils';
import { errorCaptured } from '@renderer/utils/help'

import { ref, reactive, createVNode } from 'vue';

import { postActionLocal } from '@renderer/api/manage'
import SocketService from '@renderer/api/socketService'

const { ipcRenderer } = window.electron;

const originTargetKeys = [];

const leftTableColumns = [
	{
		dataIndex: "name",
		title: "名称",
		width: 300,
		resizable: true,
	},
	{
		dataIndex: "costPerformance",
		title: "性价比",
		sorter: (a, b) => a.costPerformance - b.costPerformance,
	},
	// {
	//     dataIndex: "historyPrices",
	//     title: "buff历史价格",
	//     sorter: (a, b) => a.historyPrices - b.historyPrices,
	// },
	{
		dataIndex: "cost",
		title: "成本",
		sorter: (a, b) => a.cost - b.cost,
	},
	{
		dataIndex: "steamPrice",
		title: "steam价格",
		sorter: (a, b) => a.steamPrice - b.steamPrice,
	},
	{
		dataIndex: "difference",
		title: "差价",
		sorter: (a, b) => a.difference - b.difference,
	},
	{
		dataIndex: "buyNum",
		title: "销售量",
		sorter: (a, b) => a.buyNum - b.buyNum,
	},
	{
		dataIndex: "buffProfits",
		title: "预估利润",
		sorter: (a, b) => a.buffProfits - b.buffProfits,
	},
];

const rightTableColumns = [
	{
		dataIndex: "name",
		title: "名称",
	},
	{
		dataIndex: "cost",
		title: "成本",
		sorter: (a, b) => a.cost - b.cost,
	},
	{
		dataIndex: "steamPrice",
		title: "steam价格",
		sorter: (a, b) => a.steamPrice - b.steamPrice,
	},
	{
		dataIndex: "selfBuyNum",
		title: "购买量",
		sorter: (a, b) => a.selfBuyNum - b.selfBuyNum,
	},
	{
		dataIndex: "operation",
		title: "operation",
	},
];



const actPage = ref(1);
const endPage = ref(2);
const tokenInfo = ref("");

/*--data transfer--*/
const targetKeys: Ref<any[]> = ref(originTargetKeys);
const disabled = ref(false);
const showSearch = ref(true);
const leftColumns = ref(leftTableColumns);
const rightColumns = ref(rightTableColumns);


/*--buff--*/
const buffData: Ref<any[]> = ref([]);
const serverStatus = ref("default");
const serverStatusText = ref("closed");
const serverStartTime = ref("");
const serverEndTime = ref("");


/*--修改行--*/
const editableData = reactive({});
const edit = (key) => {
	editableData[key] = buffData.value.filter((item) => key === item.key)[0];
};
const save = (key) => {
	Object.assign(
		buffData.value.filter((item) => key === item.key)[0],
		editableData[key]
	);
	delete editableData[key];
};
const cancel = (key) => {
	delete editableData[key];
};

const onChange = (nextTargetKeys, direction, moveKeys) => {
	console.log("nextTargetKeys", nextTargetKeys);
	let rightData: any[] = [];
	console.log("buffData", buffData);
	for (let i = 0; i < nextTargetKeys.length; i++) {
		rightData.push(buffData.value[nextTargetKeys[i]]);
	}
};

const getRowSelection = ({
	disabled,
	selectedKeys,
	onItemSelectAll,
	onItemSelect,
}) => {
	return {
		getCheckboxProps: (item) => ({
			disabled: disabled || item.disabled,
		}),
		onSelectAll(selected, selectedRows) {
			const treeSelectedKeys = selectedRows
				.filter((item) => !item.disabled)
				.map(({ key }) => key);
			onItemSelectAll(treeSelectedKeys, selected);
		},
		onSelect({ key }, selected) {
			onItemSelect(key, selected);
		},
		selectedRowKeys: selectedKeys,
	};
};

/*--buff--*/

ipcRenderer.on("buffCrawlerRunning", (e, payload) => {
	console.log('im in!!!!!!!!!!!!!!!!!!!!!!!');
	serverStatus.value = "processing";
	serverStatusText.value = "Running";
	serverStartTime.value = new Date().toLocaleString();
	message.success("服务启动成功!");
});

ipcRenderer.on("buffCrawlerClosing", (e, payload) => {
	serverStatus.value = "default";
	serverStatusText.value = "closed";
	serverEndTime.value = new Date().toLocaleString();
	message.success("服务关闭成功!");
});

const startBuffCrawler = (info) => {
	let command = "";
	if (info === "dev") {
		command = "startDevBuffCrawler";
	} else if (info === "prd") {
		command = "startPrdBuffCrawler";
	}
	Modal.confirm({
		title: "是否确认打开服务?",
		icon: createVNode(ExclamationCircleOutlined),
		content: "该操作会在后台启动 pm2 buffCrawler 服务",
		onOk() {
			return new Promise<void>((resolve, reject) => {
				console.log('-------------------lalalalalla');
				sendMessageToNode(command);

				ipcRenderer.once("startBuffCrawlerFailed", (e, payload) => {
					message.error("服务启动失败!");
					reject();
				})
				ipcRenderer.once("startBuffCrawlerDone", (e, payload) => {
					resolve();
					setTimeout(() => {
						connectSocket();
					}, 10000)
				})
			});
		},

		onCancel() { },
	});
};

const stopBuffCrawler = () => {
	Modal.confirm({
		title: "是否确认关闭服务?",
		icon: createVNode(ExclamationCircleOutlined),
		content: "该操作会关闭后台 pm2 buffCrawler 服务",
		onOk() {
			return new Promise<void>((resolve, reject) => {
				sendMessageToNode("stopBuffCrawler");
				ipcRenderer.once("stopBuffCrawlerFailed", (e, payload) => {
					message.error("服务启动失败!");
					reject();
				})
				ipcRenderer.once("stopBuffCrawlerDone", (e, payload) => {
					resolve();
				})
			});
		},

		onCancel() { },
	});
};

const reStartBuffCrawler = () => {
	Modal.confirm({
		title: "是否确认重启服务?",
		icon: createVNode(ExclamationCircleOutlined),
		content: "该操作会重启后台 pm2 buffCrawler 服务",
		onOk() {
			return new Promise<void>((resolve, reject) => {
				sendMessageToNode("reStartBuffCrawler");
				ipcRenderer.once("startBuffCrawlerFailed", (e, payload) => {
					message.error("服务启动失败!");
					reject();
				})
				ipcRenderer.once("startBuffCrawlerDone", (e, payload) => {
					resolve();
					setTimeout(() => {
						connectSocket();
					}, 10000)
				})
			});
		},

		onCancel() { },
	});
};

const connectSocket = () => {
	SocketService.Instance.connect();
	let socket = SocketService.Instance;
	socket.registerCallBack('endLoop', (payload) => {
		if (payload === 'endLoop') {
			sendMessageToNode("notifyLoopEnd");
		}
	})
	return SocketService.Instance;
}


const getBuffCrawlerLog = () => {
	sendMessageToNode("getBuffCrawlerLog");
};

defineExpose({
	tokenInfo,
	buffData,
	targetKeys,

	actPage,
	endPage,

});


</script>

<template>
	<div class="BuffCrawler">
		<el-scrollbar>
			<section class="title bg2">
				<h2>Buff Crawler</h2>
			</section>

			<section class="status-panel bg2">
				<a-descriptions title="Server Info" bordered>
					<a-descriptions-item label="Product">Buff Crawler</a-descriptions-item>
					<a-descriptions-item label="Control Panel" :span="2">
						<a-space>
							<a-button @click="startBuffCrawler('dev')">启动DEV</a-button>
							<a-button @click="startBuffCrawler('prd')">启动PRD</a-button>
							<a-button @click="stopBuffCrawler()">关闭</a-button>
							<a-button @click="reStartBuffCrawler()">重启</a-button>
							<a-button @click="getBuffCrawlerLog()">获取打印日志</a-button>
						</a-space>
					</a-descriptions-item>
					<a-descriptions-item label="Status">
						<a-badge :status="serverStatus" :text="serverStatusText" />
					</a-descriptions-item>
					<a-descriptions-item label="Start time">{{
					serverStartTime
					}}</a-descriptions-item>
					<a-descriptions-item label="End Time">{{
					serverEndTime
					}}</a-descriptions-item>
					<a-descriptions-item label="Latest Token" :span="3">
						<a-input-search v-model:value="tokenInfo" placeholder="input latest token" size="large"
							@search="upDateLogInfo">
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
					<!-- <a-button @click="confirmAction(actBuff)"
                        >BUFF爬虫启动！！</a-button
                    > -->
					<a-button @click="confirmAction(actPageBuff)">BUFF启动从</a-button>
					<a-input-number v-model:value="actPage" addon-before="页数从" min=1 step=150 max=910 />
					<a-input-number v-model:value="endPage" addon-before="页数到" min=2 step=150 max=910 />
					<a-button @click="confirmAction(stopBuff)">BUFF爬虫关闭！！</a-button>
					<a-button @click="confirmAction(gatherBuff)">启动BUFF数据汇总</a-button>
					<a-button @click="reverseBuff()">启动BUFF数据汇总(倒序)</a-button>
					<a-button @click="confirmAction(historyBuff)">启动BUFF历史数据加载</a-button>
					<a-button @click="confirmAction(actBuffHistoryPrices)">BUFF历史价格爬虫启动！！</a-button>
					<a-button @click="confirmAction(stopBuffHistoryPrices)">BUFF历史价格爬虫关闭！！</a-button>
					<a-button @click="confirmAction(clearBuff)">清除BUFF数据！！</a-button>
					<a-button @click="analysePurchase()">分析订单</a-button>
				</a-space>
			</section>

			<section class="data-panel bg2">
				<a-transfer v-model:target-keys="targetKeys" :data-source="buffData" :disabled="disabled"
					:show-search="showSearch" :show-select-all="true" :filter-option="doSearch"
					:list-style="resetTransferStyle" @change="onChange">
					<template #children="{
					    direction,
					    filteredItems,
					    selectedKeys,
					    disabled: listDisabled,
					    onItemSelectAll,
					    onItemSelect,
					}" class="ok">
						<a-table :row-selection="
						    getRowSelection({
						        disabled: listDisabled,
						        selectedKeys,
						        onItemSelectAll,
						        onItemSelect,
						    })
						" :columns="
						    direction === 'left'
						        ? leftColumns
						        : rightColumns
						" :class="{ rightTable: direction === 'right' }" :data-source="filteredItems" size="default" :custom-row="
						    ({ key, disabled: itemDisabled }) => ({
						        onClick: () => {
						            if (itemDisabled || listDisabled)
						                return;
						            onItemSelect(
						                key,
						                !selectedKeys.includes(key)
						            );
						        },
						    })
						">
							<template #bodyCell="{ column, text, record }">
								<template v-if="
								    [
								        'cost',
								        'selfBuyNum',
								        'steamPrice',
								    ].includes(column.dataIndex)
								">
									<div>
										<a-input v-if="editableData[record.key]" v-model:value="
										    editableData[record.key][
										        column.dataIndex
										    ]
										" style="margin: -5px 0" />
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
												<a-popconfirm title="Sure to cancel?" @confirm="
												    cancel(record.key)
												">
													<a>Cancel</a>
												</a-popconfirm>
											</span>
											<span v-else>
												<a @click="edit(record.key)">Edit</a>
											</span>
										</a-space>
									</div>
								</template>
							</template>
						</a-table>
					</template>

					<template #footer="{ direction }">
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

<script lang="ts">
export default {
	data() {
		return {

		};
	},

	methods: {
		confirmAction(action) {
			let title = "";
			let funcName = action.name.split(" ").pop();
			switch (funcName) {
				case "actBuff":
					title = "是否启动BUFF爬虫?";
					break;
				case "actPageBuff":
					title = "是否启动BUFF爬虫?";
					break;
				case "stopBuff":
					title = "是否关闭BUFF爬虫?";
					break;
				case "gatherBuff":
					title = "是否创建BUFF数据汇总?";
					break;
				case "historyBuff":
					title = "是否启动BUFF历史数据加载?";
					break;
				case "actBuffHistoryPrices":
					title = "是否启动BUFF历史价格爬虫?";
					break;
				case "stopBuffHistoryPrices":
					title = "是否关闭BUFF历史价格爬虫?";
					break;
				case "clearBuff":
					title = "是否清除BUFF数据?";
					break;
			}

			Modal.confirm({
				title,
				icon: createVNode(ExclamationCircleOutlined),
				onOk() {
					return new Promise<void>((resolve, reject) => {
						action().then(() => {
							resolve();
						});
					});
				},

				onCancel() { },
			});
		},

		/*---buff service qpi---*/
		async actBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/actBuff');
			if (msg) {
				message.success(msg.data.message);
			}
		},

		async actPageBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/actBuff', {
				startPage: this.actPage,
				endPage: this.endPage
			});

			if (msg) {
				message.success(msg.data.message);
			}
		},

		async stopBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/stopBuff');

			if (msg) {
				message.success(msg.data.message);
			}
		},

		async clearBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/clearBuff');

			if (msg) {
				message.success(msg.data.message);
			}
		},

		async gatherBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/gatherBuff');

			if (msg) {
				this.processBuffData(msg.data.data);
				message.success(msg.data.message);
			}
		},

		reverseBuff() {
			if (this.buffData.length === 0) {
				this.gatherBuff();
			}
			this.buffData.reverse();
		},

		async actBuffHistoryPrices() {
			let [err, msg] = await errorCaptured(postActionLocal, '/actBuffHistoryPrices');

			if (msg) {
				message.success(msg.data.message);
			}
		},

		async stopBuffHistoryPrices() {
			let [err, msg] = await errorCaptured(postActionLocal, '/stopBuffHistoryPrices');

			if (msg) {
				message.success(msg.data.message);
			}
		},

		async historyBuff() {
			let [err, msg] = await errorCaptured(postActionLocal, '/getBuffHistoryPrices');

			if (msg) {
				this.processBuffData(msg.data.data);
				message.success(msg.data.message);
			}
		},

		analysePurchase() {
			this.goTo("/Crawler/PurchaseAnalyser");
		},

		/*------*/
		processBuffData(buffData) {
			for (let i = 0; i < buffData.length; i++) {
				let data = buffData[i];
				this.buffData.push({
					key: i.toString(),
					name: data.name,
					costPerformance: new Number(data.costPerformance).toFixed(
						2
					),
					historyPrices: data.historyPrice,
					cost: new Number(data.cost).toFixed(2),
					steamPrice: new Number(data.steamPrice).toFixed(2),
					difference: new Number(data.difference).toFixed(2),
					buyNum: data.buyNum,
					buffProfits: new Number(data.buffProfits).toFixed(2),
				});
			}
		},

		resetTransferStyle(params) {
			console.log("params", params);
			if (params.direction === "left") {
				return {
					flex: 1,
				};
			} else {
				return {
					flex: 0,
				};
			}
		},

		doSearch(inputValue, item) {
			return item.name.indexOf(inputValue) > -1;
		},

		/*---transfer footer---*/

		async saveToSteam() {
			let targetKeys = this.targetKeys;
			let buffData = this.buffData;

			if (!targetKeys) {
				return;
			}

			let rightData: any[] = [];
			for (let i = 0; i < targetKeys.length; i++) {
				console.log(targetKeys[i]);
				rightData.push(buffData[targetKeys[i]]);
			}

			console.log("rightData", rightData);

			let [err, msg] = await errorCaptured(postActionLocal, '/saveSteamPurchase', {
				goods: rightData,
				buy_time: new Date().getTime(),
			});

			if (msg) {
				if (msg.data.status == 1) {
					message.success(msg.data.message);
				} else {
					message.error(msg.data.message);
				}
			}

			if (err) {
				console.log("err", err);
			}
		},

		async saveToBuff() {
			let targetKeys = this.targetKeys;
			let buffData = this.buffData;

			if (!targetKeys) {
				return;
			}

			let rightData: any[] = [];
			for (let i = 0; i < targetKeys.length; i++) {
				rightData.push(buffData[targetKeys[i]]);
			}

			console.log("rightData", rightData);

			let [err, msg] = await errorCaptured(postActionLocal, '/saveBufffPurchase', {
				goods: rightData,
				buy_time: new Date().getTime(),
			});


			if (msg) {
				if (msg.data.status == 1) {
					message.success(msg.data.message);
				} else {
					message.error(msg.data.message);
				}
			}

			if (err) {
				console.log("err", err);
			}
		},

		/*---updateToken---*/
		async upDateLogInfo() {
			let token = this.tokenInfo.trim();

			let [err, msg] = await errorCaptured(postActionLocal, '/updateLogInfo', {
				token,
			});

			if (msg) {
				if (msg.data.status == 1) {
					message.success(msg.data.message);
				} else {
					message.error(msg.data.message);
				}
			}

			if (err) {
				console.log("err", err);
			}
		},

		goTo(target) {
			this.$router.push(target);
		},
	}
}
</script>

<style scoped>

</style>